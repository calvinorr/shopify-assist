import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { sql } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { cachedResponse, CACHE_DURATIONS } from "@/lib/cache";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
    const offset = parseInt(searchParams.get("offset") ?? "0");
    const color = searchParams.get("color");
    const inStock = searchParams.get("inStock") === "true";

    let query = db
      .select({
        id: products.id,
        shopifyProductId: products.shopifyProductId,
        handle: products.handle,
        name: products.name,
        description: products.description,
        color: products.color,
        tags: products.tags,
        imageUrls: products.imageUrls,
        inventory: products.inventory,
        price: products.price,
        currency: products.currency,
        createdAt: products.createdAt,
      })
      .from(products);

    // Apply filters
    const conditions = [];
    if (color) {
      conditions.push(sql`${products.color} = ${color}`);
    }
    if (inStock) {
      conditions.push(sql`${products.inventory} > 0`);
    }
    if (conditions.length > 0) {
      query = query.where(sql.join(conditions, sql` AND `)) as typeof query;
    }

    const results = await query
      .orderBy(sql`${products.name} asc`)
      .limit(limit)
      .offset(offset);

    // Parse JSON fields
    const parsed = results.map((p) => ({
      ...p,
      tags: p.tags ? JSON.parse(p.tags) : [],
      imageUrls: p.imageUrls ? JSON.parse(p.imageUrls) : [],
    }));

    // Get total count for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products);

    return cachedResponse(
      {
        products: parsed,
        total: countResult[0]?.count ?? 0,
        limit,
        offset,
      },
      CACHE_DURATIONS.products
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
