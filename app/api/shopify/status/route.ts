import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { settings, products } from "@/lib/schema";
import { eq, count } from "drizzle-orm";

export async function GET() {
  try {
    await requireAuth();

    // Check if Shopify access token is configured
    const connected = !!process.env.SHOPIFY_ACCESS_TOKEN;

    // Get last sync timestamp from settings
    const [lastSync] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, "shopify_last_sync"))
      .limit(1);

    // Get total product count
    const [result] = await db.select({ count: count() }).from(products);
    const productCount = result?.count || 0;

    return NextResponse.json({
      connected,
      storeUrl: "herbariumdyeworks.myshopify.com",
      lastSyncAt: lastSync?.value ? new Date(lastSync.value).toISOString() : null,
      productCount,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch Shopify status", message },
      { status: 500 }
    );
  }
}
