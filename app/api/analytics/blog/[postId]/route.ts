import { NextRequest, NextResponse } from "next/server";
import { getUserSearchAnalytics } from "@/lib/google-search-console";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/schema";
import { eq } from "drizzle-orm";

interface QueryData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface PostPerformanceResponse {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  topQueries: QueryData[];
  lastUpdated: string;
}

/**
 * Get performance data for a specific blog post
 * Fetches GSC data filtered to the post's URL and includes top queries
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const user = await requireAuth();
    if (!user.id) {
      throw new Error("User ID not found");
    }

    const userId = user.id;
    const { postId } = await params;
    const searchParams = request.nextUrl.searchParams;

    // Get the blog post from database
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, postId))
      .limit(1);

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    if (!post.slug) {
      return NextResponse.json({ error: "Blog post has no slug" }, { status: 400 });
    }

    // Parse date range from query params
    const dateRange = searchParams.get("dateRange") || "28d";
    const endDate = new Date().toISOString().split("T")[0];

    let daysBack = 28;
    if (dateRange === "7d") daysBack = 7;
    else if (dateRange === "90d") daysBack = 90;

    const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const siteUrl = "sc-domain:herbariumdyeworks.com";
    const postUrl = `https://herbariumdyeworks.com/blogs/news/${post.slug}`;

    // Fetch page-level metrics for this specific post
    const pageData = await getUserSearchAnalytics(userId, siteUrl, {
      startDate,
      endDate,
      dimensions: ["page"],
      rowLimit: 1000,
    });

    // Find metrics for this specific page
    let pageMetrics = { clicks: 0, impressions: 0, ctr: 0, position: 0 };

    if (pageData.rows) {
      for (const row of pageData.rows) {
        if (row.keys && row.keys[0] === postUrl) {
          pageMetrics = {
            clicks: row.clicks,
            impressions: row.impressions,
            ctr: row.ctr,
            position: row.position,
          };
          break;
        }
      }
    }

    // Fetch query-level data filtered by this page
    // GSC API supports filtering by page URL
    const queryData = await getUserSearchAnalytics(userId, siteUrl, {
      startDate,
      endDate,
      dimensions: ["query", "page"],
      rowLimit: 100,
    });

    // Filter queries for this specific page and extract top queries
    const topQueries: QueryData[] = [];

    if (queryData.rows) {
      for (const row of queryData.rows) {
        if (row.keys && row.keys.length >= 2 && row.keys[1] === postUrl) {
          topQueries.push({
            query: row.keys[0],
            clicks: row.clicks,
            impressions: row.impressions,
            ctr: row.ctr,
            position: row.position,
          });
        }
      }
    }

    // Sort by clicks and take top 10
    topQueries.sort((a, b) => b.clicks - a.clicks);
    const topQueriesLimited = topQueries.slice(0, 10);

    // GSC data has a 2-3 day delay
    const lastUpdated = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

    const response: PostPerformanceResponse = {
      ...pageMetrics,
      topQueries: topQueriesLimited,
      lastUpdated,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
