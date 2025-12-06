import { NextRequest, NextResponse } from "next/server";
import {
  getUserSearchAnalytics,
  getUserSites,
  isConnected,
  disconnect,
} from "@/lib/google-search-console";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user.id) {
      throw new Error("User ID not found");
    }

    const userId = user.id; // Ensure TypeScript knows this is a string
    const searchParams = request.nextUrl.searchParams;

    // Check if user wants to check connection status
    const checkConnection = searchParams.get("check") === "true";
    if (checkConnection) {
      const connected = await isConnected(userId);
      return NextResponse.json({ connected });
    }

    // Check if user wants to list sites
    const listSites = searchParams.get("sites") === "true";
    if (listSites) {
      const sites = await getUserSites(userId);
      return NextResponse.json({ sites });
    }

    // Get search analytics data
    const siteUrl = searchParams.get("siteUrl");
    if (!siteUrl) {
      return NextResponse.json(
        { error: "siteUrl parameter is required" },
        { status: 400 }
      );
    }

    // Parse date range (default to last 30 days)
    const endDate = searchParams.get("endDate") || new Date().toISOString().split("T")[0];
    const startDateDefault = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const startDate = searchParams.get("startDate") || startDateDefault;

    // Parse dimensions
    const dimensionsParam = searchParams.get("dimensions");
    const dimensions = dimensionsParam
      ? dimensionsParam.split(",")
      : ["query"];

    // Parse pagination
    const rowLimit = Math.min(
      parseInt(searchParams.get("rowLimit") || "25"),
      1000
    );
    const startRow = parseInt(searchParams.get("startRow") || "0");

    // Fetch search analytics
    const data = await getUserSearchAnalytics(userId, siteUrl, {
      startDate,
      endDate,
      dimensions: dimensions as ("query" | "page" | "country" | "device" | "searchAppearance")[],
      rowLimit,
      startRow,
    });

    // Calculate aggregated metrics
    const aggregated = {
      totalClicks: 0,
      totalImpressions: 0,
      averageCtr: 0,
      averagePosition: 0,
    };

    if (data.rows && data.rows.length > 0) {
      aggregated.totalClicks = data.rows.reduce((sum, row) => sum + row.clicks, 0);
      aggregated.totalImpressions = data.rows.reduce((sum, row) => sum + row.impressions, 0);
      aggregated.averageCtr =
        data.rows.reduce((sum, row) => sum + row.ctr, 0) / data.rows.length;
      aggregated.averagePosition =
        data.rows.reduce((sum, row) => sum + row.position, 0) / data.rows.length;
    }

    // Format response
    return NextResponse.json({
      siteUrl,
      dateRange: { startDate, endDate },
      aggregated,
      rows: data.rows || [],
      totalRows: data.rows?.length || 0,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle specific Google API errors
    if (
      error instanceof Error &&
      error.message.includes("No Google tokens found")
    ) {
      return NextResponse.json(
        { error: "Google Search Console not connected", connected: false },
        { status: 403 }
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user.id) {
      throw new Error("User ID not found");
    }

    const userId = user.id; // Ensure TypeScript knows this is a string

    // Disconnect Google Search Console
    await disconnect(userId);

    return NextResponse.json({
      success: true,
      message: "Google Search Console disconnected",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
