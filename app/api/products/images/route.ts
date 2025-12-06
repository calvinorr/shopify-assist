import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { sql } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

/**
 * Lightweight endpoint for fetching product images
 * Returns only essential fields for image picker
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
    const search = searchParams.get("search");
    const inStock = searchParams.get("inStock") === "true";

    let query = db
      .select({
        id: products.id,
        name: products.name,
        color: products.color,
        tags: products.tags,
        imageUrls: products.imageUrls,
      })
      .from(products);

    // Build conditions
    const conditions = [];

    // Only products with images
    conditions.push(sql`${products.imageUrls} IS NOT NULL AND ${products.imageUrls} != '[]'`);

    // In stock filter
    if (inStock) {
      conditions.push(sql`${products.inventory} > 0`);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      conditions.push(
        sql`(LOWER(${products.name}) LIKE ${"%" + searchLower + "%"} OR LOWER(${products.color}) LIKE ${"%" + searchLower + "%"})`
      );
    }

    if (conditions.length > 0) {
      query = query.where(sql.join(conditions, sql` AND `)) as typeof query;
    }

    const results = await query
      .orderBy(sql`${products.name} asc`)
      .limit(limit);

    // Parse JSON fields
    const parsed = results.map((p) => ({
      ...p,
      tags: p.tags ? JSON.parse(p.tags) : [],
      imageUrls: p.imageUrls ? JSON.parse(p.imageUrls) : [],
    }));

    // Filter out products with no images after parsing
    const withImages = parsed.filter((p) => p.imageUrls.length > 0);

    return NextResponse.json({
      products: withImages,
      total: withImages.length,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
