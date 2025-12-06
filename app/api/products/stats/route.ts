import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { sql } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await requireAuth();
    // Get total products and inventory
    const totals = await db
      .select({
        totalProducts: sql<number>`count(*)`,
        totalInventory: sql<number>`coalesce(sum(${products.inventory}), 0)`,
      })
      .from(products);

    // Get color distribution (top 10)
    const colorCounts = await db
      .select({
        color: products.color,
        count: sql<number>`count(*)`,
      })
      .from(products)
      .where(sql`${products.color} is not null`)
      .groupBy(products.color)
      .orderBy(sql`count(*) desc`)
      .limit(10);

    // Get recent products (last 5)
    const recentProducts = await db
      .select({
        id: products.id,
        name: products.name,
        color: products.color,
        price: products.price,
        inventory: products.inventory,
        imageUrls: products.imageUrls,
      })
      .from(products)
      .orderBy(sql`${products.createdAt} desc`)
      .limit(5);

    // Parse image URLs from JSON strings
    const recentWithParsedImages = recentProducts.map((p) => ({
      ...p,
      imageUrls: p.imageUrls ? JSON.parse(p.imageUrls) : [],
    }));

    return NextResponse.json({
      totalProducts: totals[0]?.totalProducts ?? 0,
      totalInventory: totals[0]?.totalInventory ?? 0,
      colorDistribution: colorCounts,
      recentProducts: recentWithParsedImages,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
