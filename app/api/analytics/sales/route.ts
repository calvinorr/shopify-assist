import { NextRequest, NextResponse } from "next/server";
import { fetchRecentOrders } from "@/services/shopify";
import { requireAuth } from "@/lib/auth";
import type { SalesAnalytics, DailySales } from "@/types/shopify";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    // Get days parameter from query (default: 30)
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days");
    const days = daysParam ? parseInt(daysParam, 10) : 30;

    // Validate days parameter
    if (isNaN(days) || days < 1 || days > 365) {
      return NextResponse.json(
        { error: "Invalid days parameter. Must be between 1 and 365." },
        { status: 400 }
      );
    }

    // Fetch orders from Shopify
    const orders = await fetchRecentOrders(days);

    // Calculate analytics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Group orders by day for chart data
    const salesByDayMap = new Map<string, DailySales>();

    for (const order of orders) {
      const date = order.date.split("T")[0]; // Extract YYYY-MM-DD

      if (!salesByDayMap.has(date)) {
        salesByDayMap.set(date, {
          date,
          revenue: 0,
          orders: 0,
        });
      }

      const daySales = salesByDayMap.get(date)!;
      daySales.revenue += order.total;
      daySales.orders += 1;
    }

    // Convert map to sorted array (oldest to newest for charts)
    const salesByDay = Array.from(salesByDayMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    const analytics: SalesAnalytics = {
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100, // Round to 2 decimals
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      salesByDay,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Sales analytics error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to fetch sales analytics: ${message}` },
      { status: 500 }
    );
  }
}
