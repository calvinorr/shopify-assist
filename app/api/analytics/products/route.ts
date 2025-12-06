import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { sql } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await requireAuth();

    // Get top 10 products by inventory value (price * inventory)
    const topProducts = await db
      .select({
        id: products.id,
        name: products.name,
        color: products.color,
        price: products.price,
        inventory: products.inventory,
        inventoryValue: sql<number>`${products.price} * ${products.inventory}`,
        imageUrls: products.imageUrls,
      })
      .from(products)
      .where(sql`${products.inventory} > 0 and ${products.price} is not null`)
      .orderBy(sql`${products.price} * ${products.inventory} desc`)
      .limit(10);

    // Parse image URLs from JSON strings
    const topProductsWithParsedImages = topProducts.map((p) => ({
      ...p,
      imageUrls: p.imageUrls ? JSON.parse(p.imageUrls) : [],
    }));

    // Get color distribution (top 10)
    const colorDistribution = await db
      .select({
        color: products.color,
        count: sql<number>`count(*)`,
      })
      .from(products)
      .where(sql`${products.color} is not null`)
      .groupBy(products.color)
      .orderBy(sql`count(*) desc`)
      .limit(10);

    // Get low stock alerts (products with inventory < 5)
    const lowStockProducts = await db
      .select({
        id: products.id,
        name: products.name,
        color: products.color,
        inventory: products.inventory,
        price: products.price,
        imageUrls: products.imageUrls,
      })
      .from(products)
      .where(sql`${products.inventory} < 5 and ${products.inventory} > 0`)
      .orderBy(sql`${products.inventory} asc`)
      .limit(20);

    // Parse image URLs from JSON strings
    const lowStockWithParsedImages = lowStockProducts.map((p) => ({
      ...p,
      imageUrls: p.imageUrls ? JSON.parse(p.imageUrls) : [],
    }));

    return NextResponse.json({
      topProducts: topProductsWithParsedImages,
      colorDistribution,
      lowStockAlerts: lowStockWithParsedImages,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch product analytics", message },
      { status: 500 }
    );
  }
}
