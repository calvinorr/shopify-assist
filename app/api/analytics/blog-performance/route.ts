import { NextRequest, NextResponse } from "next/server";
import { getUserSearchAnalytics } from "@/lib/google-search-console";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/schema";

interface BlogPostWithMetrics {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "review" | "published";
  publishedAt: Date | null;
  url: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  previousClicks?: number;
  previousImpressions?: number;
  clicksChange?: number;
  impressionsChange?: number;
}

interface BlogPerformanceResponse {
  posts: BlogPostWithMetrics[];
  topPerformers: BlogPostWithMetrics[];
  needsAttention: BlogPostWithMetrics[];
  totals: {
    clicks: number;
    impressions: number;
    averageCtr: number;
    averagePosition: number;
    previousClicks?: number;
    previousImpressions?: number;
    clicksChange?: number;
    impressionsChange?: number;
  };
  dateRange: {
    startDate: string;
    endDate: string;
    previousStartDate?: string;
    previousEndDate?: string;
  };
}

/**
 * Extract slug from Herbarium blog URL
 * Matches URLs like: https://herbariumdyeworks.com/blogs/news/[slug]
 */
function extractSlugFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);

    // Expected format: blogs/news/[slug]
    if (pathParts.length >= 3 && pathParts[0] === "blogs" && pathParts[1] === "news") {
      return pathParts[2];
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Calculate date range for comparison period
 */
function calculatePreviousPeriod(startDate: string, endDate: string): { previousStartDate: string; previousEndDate: string } {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const periodDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const previousEnd = new Date(start);
  previousEnd.setDate(previousEnd.getDate() - 1);

  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousStart.getDate() - periodDays + 1);

  return {
    previousStartDate: previousStart.toISOString().split("T")[0],
    previousEndDate: previousEnd.toISOString().split("T")[0],
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user.id) {
      throw new Error("User ID not found");
    }

    const userId = user.id;
    const searchParams = request.nextUrl.searchParams;

    // Parse parameters
    const siteUrl = searchParams.get("siteUrl") || "sc-domain:herbariumdyeworks.com";

    // Parse date range (default to last 30 days)
    const endDate = searchParams.get("endDate") || new Date().toISOString().split("T")[0];
    const startDateDefault = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const startDate = searchParams.get("startDate") || startDateDefault;

    const compareWithPrevious = searchParams.get("compareWithPrevious") === "true";

    // Fetch all blog posts from database
    const allBlogPosts = await db.select().from(blogPosts);

    // Fetch page-level GSC data
    const gscData = await getUserSearchAnalytics(userId, siteUrl, {
      startDate,
      endDate,
      dimensions: ["page"],
      rowLimit: 1000, // Get all pages to ensure we capture all blog posts
    });

    // Fetch previous period data if comparison is requested
    let previousGscData = null;
    let previousPeriod = null;

    if (compareWithPrevious) {
      previousPeriod = calculatePreviousPeriod(startDate, endDate);
      previousGscData = await getUserSearchAnalytics(userId, siteUrl, {
        startDate: previousPeriod.previousStartDate,
        endDate: previousPeriod.previousEndDate,
        dimensions: ["page"],
        rowLimit: 1000,
      });
    }

    // Create lookup maps for GSC data
    const gscMetricsMap = new Map<string, { clicks: number; impressions: number; ctr: number; position: number }>();
    const previousMetricsMap = new Map<string, { clicks: number; impressions: number }>();

    // Process current period GSC data
    if (gscData.rows) {
      for (const row of gscData.rows) {
        if (!row.keys || row.keys.length === 0) continue;

        const url = row.keys[0];
        const slug = extractSlugFromUrl(url);

        if (slug) {
          gscMetricsMap.set(slug, {
            clicks: row.clicks,
            impressions: row.impressions,
            ctr: row.ctr,
            position: row.position,
          });
        }
      }
    }

    // Process previous period GSC data
    if (previousGscData?.rows) {
      for (const row of previousGscData.rows) {
        if (!row.keys || row.keys.length === 0) continue;

        const url = row.keys[0];
        const slug = extractSlugFromUrl(url);

        if (slug) {
          previousMetricsMap.set(slug, {
            clicks: row.clicks,
            impressions: row.impressions,
          });
        }
      }
    }

    // Combine blog posts with their GSC metrics
    const postsWithMetrics: BlogPostWithMetrics[] = allBlogPosts
      .filter(post => post.slug && post.status === "published" && post.publishedAt)
      .map(post => {
        const slug = post.slug!;
        const metrics = gscMetricsMap.get(slug);
        const previousMetrics = previousMetricsMap.get(slug);

        const postData: BlogPostWithMetrics = {
          id: post.id,
          title: post.title,
          slug: slug,
          status: (post.status || "draft") as "draft" | "review" | "published",
          publishedAt: post.publishedAt,
          url: `https://herbariumdyeworks.com/blogs/news/${slug}`,
          clicks: metrics?.clicks || 0,
          impressions: metrics?.impressions || 0,
          ctr: metrics?.ctr || 0,
          position: metrics?.position || 0,
        };

        // Add comparison data if available
        if (previousMetrics) {
          postData.previousClicks = previousMetrics.clicks;
          postData.previousImpressions = previousMetrics.impressions;
          postData.clicksChange = postData.clicks - previousMetrics.clicks;
          postData.impressionsChange = postData.impressions - previousMetrics.impressions;
        }

        return postData;
      })
      .sort((a, b) => b.clicks - a.clicks); // Sort by clicks descending

    // Calculate totals
    const totals: {
      clicks: number;
      impressions: number;
      averageCtr: number;
      averagePosition: number;
      previousClicks?: number;
      previousImpressions?: number;
      clicksChange?: number;
      impressionsChange?: number;
    } = postsWithMetrics.reduce(
      (acc, post) => {
        acc.clicks += post.clicks;
        acc.impressions += post.impressions;
        if (post.previousClicks !== undefined) {
          acc.previousClicks = (acc.previousClicks || 0) + post.previousClicks;
        }
        if (post.previousImpressions !== undefined) {
          acc.previousImpressions = (acc.previousImpressions || 0) + post.previousImpressions;
        }
        return acc;
      },
      {
        clicks: 0,
        impressions: 0,
        averageCtr: 0,
        averagePosition: 0,
        previousClicks: 0,
        previousImpressions: 0,
      }
    );

    // Calculate averages
    const postsWithMetricsCount = postsWithMetrics.filter(p => p.clicks > 0).length;
    if (postsWithMetricsCount > 0) {
      totals.averageCtr = postsWithMetrics.reduce((sum, post) => sum + post.ctr, 0) / postsWithMetricsCount;
      totals.averagePosition = postsWithMetrics.reduce((sum, post) => sum + post.position, 0) / postsWithMetricsCount;
    }

    // Calculate changes
    if (totals.previousClicks && totals.previousClicks > 0) {
      totals.clicksChange = totals.clicks - totals.previousClicks;
    }
    if (totals.previousImpressions && totals.previousImpressions > 0) {
      totals.impressionsChange = totals.impressions - totals.previousImpressions;
    }

    // Get top performers (top 3 by clicks)
    const topPerformers = postsWithMetrics.slice(0, 3);

    // Get posts needing attention (declining traffic)
    const needsAttention = postsWithMetrics
      .filter(post => {
        if (!post.clicksChange) return false;
        // Flag posts with >20% decline in clicks and had at least 10 clicks before
        return post.clicksChange < 0 &&
               post.previousClicks &&
               post.previousClicks >= 10 &&
               Math.abs(post.clicksChange) / post.previousClicks > 0.2;
      })
      .sort((a, b) => (a.clicksChange || 0) - (b.clicksChange || 0)) // Most declined first
      .slice(0, 5);

    // Build response
    const response: BlogPerformanceResponse = {
      posts: postsWithMetrics,
      topPerformers,
      needsAttention,
      totals,
      dateRange: {
        startDate,
        endDate,
        ...(previousPeriod && {
          previousStartDate: previousPeriod.previousStartDate,
          previousEndDate: previousPeriod.previousEndDate,
        }),
      },
    };

    return NextResponse.json(response);
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
