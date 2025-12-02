import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
    const offset = parseInt(searchParams.get("offset") ?? "0");
    const color = searchParams.get("color");

    let query = db
      .select({
        id: products.id,
        shopifyProductId: products.shopifyProductId,
        name: products.name,
        description: products.description,
        color: products.color,
        tags: products.tags,
        imageUrls: products.imageUrls,
        inventory: products.inventory,
        price: products.price,
        createdAt: products.createdAt,
      })
      .from(products);

    // Filter by color if provided
    if (color) {
      query = query.where(sql`${products.color} = ${color}`) as typeof query;
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

    return NextResponse.json({
      products: parsed,
      total: countResult[0]?.count ?? 0,
      limit,
      offset,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
