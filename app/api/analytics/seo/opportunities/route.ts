import { NextRequest, NextResponse } from "next/server";
import { getUserSearchAnalytics } from "@/lib/google-search-console";
import { requireAuth } from "@/lib/auth";

// Color keywords for Herbarium Dyeworks
const COLOR_KEYWORDS = [
  "indigo",
  "madder",
  "weld",
  "walnut",
  "blue",
  "red",
  "yellow",
  "brown",
  "green",
  "purple",
  "pink",
  "orange",
  "natural dye",
  "plant dye",
  "botanical dye",
];

const HOW_TO_KEYWORDS = ["how to", "guide", "tutorial", "instructions", "tips"];

const PRODUCT_KEYWORDS = [
  "yarn",
  "wool",
  "fiber",
  "fibre",
  "skein",
  "hand dyed",
  "hand-dyed",
  "merino",
  "sock yarn",
];

type OpportunityCategory = "color" | "how-to" | "product" | "general";

interface Opportunity {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  score: number;
  category: OpportunityCategory;
  estimatedPotential: number;
}

interface OpportunitySummary {
  totalOpportunities: number;
  byCategory: Record<OpportunityCategory, number>;
  topCategory: OpportunityCategory;
}

/**
 * Categorize a query based on keyword matching
 */
function categorizeQuery(query: string): OpportunityCategory {
  const lowerQuery = query.toLowerCase();

  // Check how-to first (most specific)
  if (
    lowerQuery.startsWith("how to") ||
    HOW_TO_KEYWORDS.some((keyword) => lowerQuery.includes(keyword))
  ) {
    return "how-to";
  }

  // Check color keywords
  if (COLOR_KEYWORDS.some((keyword) => lowerQuery.includes(keyword))) {
    return "color";
  }

  // Check product keywords
  if (PRODUCT_KEYWORDS.some((keyword) => lowerQuery.includes(keyword))) {
    return "product";
  }

  return "general";
}

/**
 * Calculate opportunity score for a query
 * Higher score = bigger opportunity
 * Formula: impressions * (1 - ctr) * (position / 10)
 */
function calculateOpportunityScore(
  impressions: number,
  ctr: number,
  position: number
): number {
  return impressions * (1 - ctr) * (position / 10);
}

/**
 * Estimate potential additional clicks if position improved to #1
 * Based on typical CTR for position #1 being ~30% for branded/niche content
 */
function estimatePotential(
  impressions: number,
  currentClicks: number,
  currentPosition: number
): number {
  // Rough CTR estimates by position (conservative for niche content)
  const positionCTR: Record<number, number> = {
    1: 0.3,
    2: 0.15,
    3: 0.1,
    4: 0.07,
    5: 0.05,
    6: 0.04,
    7: 0.03,
    8: 0.025,
    9: 0.02,
    10: 0.015,
  };

  // If already in top 3, potential is smaller
  if (currentPosition <= 3) {
    return Math.round(impressions * 0.3 - currentClicks);
  }

  // Otherwise, estimate clicks at position #1 minus current clicks
  const potentialClicksAtTop = impressions * (positionCTR[1] || 0.3);
  return Math.round(potentialClicksAtTop - currentClicks);
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user.id) {
      throw new Error("User ID not found");
    }

    const userId = user.id;
    const searchParams = request.nextUrl.searchParams;

    // Get site URL (default to Herbarium Dyeworks)
    const siteUrl =
      searchParams.get("siteUrl") || "sc-domain:herbariumdyeworks.com";

    // Parse date range (default to last 90 days for better data)
    const endDate =
      searchParams.get("endDate") || new Date().toISOString().split("T")[0];
    const startDateDefault = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const startDate = searchParams.get("startDate") || startDateDefault;

    // Thresholds (allow customization via query params)
    const minImpressions = parseInt(
      searchParams.get("minImpressions") || "10"
    );
    const maxCtr = parseFloat(searchParams.get("maxCtr") || "0.05"); // 5%
    const minPosition = parseFloat(searchParams.get("minPosition") || "5");

    // Fetch query-level data from Google Search Console
    const data = await getUserSearchAnalytics(userId, siteUrl, {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 1000, // Get more data for filtering
    });

    if (!data.rows || data.rows.length === 0) {
      return NextResponse.json({
        opportunities: [],
        summary: {
          totalOpportunities: 0,
          byCategory: {
            color: 0,
            "how-to": 0,
            product: 0,
            general: 0,
          },
          topCategory: "general" as OpportunityCategory,
        },
        dateRange: { startDate, endDate },
      });
    }

    // Process and filter opportunities
    const opportunities: Opportunity[] = data.rows
      .map((row) => {
        const query = row.keys?.[0] || "";
        const { impressions, clicks, ctr, position } = row;

        return {
          query,
          impressions,
          clicks,
          ctr,
          position,
          score: calculateOpportunityScore(impressions, ctr, position),
          category: categorizeQuery(query),
          estimatedPotential: estimatePotential(impressions, clicks, position),
        };
      })
      .filter((opp) => {
        // Apply thresholds
        return (
          opp.impressions >= minImpressions &&
          opp.ctr < maxCtr &&
          opp.position > minPosition &&
          opp.estimatedPotential > 0 // Must have improvement potential
        );
      })
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, 50); // Limit to top 50

    // Calculate summary statistics
    const summary: OpportunitySummary = {
      totalOpportunities: opportunities.length,
      byCategory: {
        color: opportunities.filter((o) => o.category === "color").length,
        "how-to": opportunities.filter((o) => o.category === "how-to").length,
        product: opportunities.filter((o) => o.category === "product").length,
        general: opportunities.filter((o) => o.category === "general").length,
      },
      topCategory: "general",
    };

    // Determine top category
    const categoryEntries = Object.entries(summary.byCategory) as [
      OpportunityCategory,
      number
    ][];
    const topCategoryEntry = categoryEntries.reduce((max, entry) =>
      entry[1] > max[1] ? entry : max
    );
    summary.topCategory = topCategoryEntry[0];

    return NextResponse.json({
      opportunities,
      summary,
      dateRange: { startDate, endDate },
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
    console.error("SEO opportunities error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
