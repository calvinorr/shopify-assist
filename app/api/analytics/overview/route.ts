import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, blogPosts, instagramPosts } from "@/lib/schema";
import { sql } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await requireAuth();

    // Get total products and inventory value
    const productStats = await db
      .select({
        totalProducts: sql<number>`count(*)`,
        totalInventoryValue: sql<number>`coalesce(sum(${products.price} * ${products.inventory}), 0)`,
        inStockCount: sql<number>`count(case when ${products.inventory} > 0 then 1 end)`,
        outOfStockCount: sql<number>`count(case when ${products.inventory} = 0 or ${products.inventory} is null then 1 end)`,
      })
      .from(products);

    // Get blog posts count
    const blogStats = await db
      .select({
        totalBlogPosts: sql<number>`count(*)`,
      })
      .from(blogPosts);

    // Get Instagram posts count
    const instagramStats = await db
      .select({
        totalInstagramPosts: sql<number>`count(*)`,
      })
      .from(instagramPosts);

    return NextResponse.json({
      totalProducts: productStats[0]?.totalProducts ?? 0,
      totalInventoryValue: productStats[0]?.totalInventoryValue ?? 0,
      productsByStatus: {
        inStock: productStats[0]?.inStockCount ?? 0,
        outOfStock: productStats[0]?.outOfStockCount ?? 0,
      },
      totalBlogPosts: blogStats[0]?.totalBlogPosts ?? 0,
      totalInstagramPosts: instagramStats[0]?.totalInstagramPosts ?? 0,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch analytics overview", message },
      { status: 500 }
    );
  }
}
