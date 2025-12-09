/**
 * AI Content Suggestions API
 *
 * Generates AI-powered content recommendations based on Google Search Console data.
 * Uses Gemini AI to analyze search queries and suggest actionable content opportunities.
 *
 * Features:
 * - Fetches GSC query data (last 90 days)
 * - Analyzes existing blog posts to identify content gaps
 * - Uses AI to generate personalized recommendations
 * - Caches results for 7 days to reduce API calls
 * - Force refresh available with ?refresh=true
 *
 * Returns:
 * - recommendations: Array of content suggestions with type, keywords, and estimated opportunity
 * - summary: Aggregated stats by recommendation type
 * - cachedAt/expiresAt: Cache timestamps
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getUserSearchAnalytics } from "@/lib/google-search-console";
import { generateContent } from "@/lib/gemini";
import { db } from "@/lib/db";
import { aiRecommendations, blogPosts } from "@/lib/schema";
import { eq, and, gt } from "drizzle-orm";

export const dynamic = "force-dynamic";

export type RecommendationType = "new_post" | "optimize" | "quick_win" | "long_tail";
export type ConfidenceLevel = "high" | "medium" | "low";
export type PriorityLevel = "high" | "medium" | "low";

export interface ContentRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  targetKeyword: string;
  suggestedTitle?: string;
  explanation: string;
  estimatedOpportunity: number; // impressions
  confidence: ConfidenceLevel;
  priority: PriorityLevel;
  relatedQueries?: string[];
  existingPostId?: string;
}

interface RecommendationSummary {
  totalRecommendations: number;
  byType: Record<RecommendationType, number>;
  topPriority: ContentRecommendation | null;
}

interface ContentSuggestionsResponse {
  recommendations: ContentRecommendation[];
  summary: RecommendationSummary;
  cachedAt: string;
  expiresAt: string;
}

/**
 * Generate content recommendations using Gemini AI
 */
async function generateAIRecommendations(
  topQueries: Array<{
    query: string;
    impressions: number;
    clicks: number;
    position: number;
    ctr: number;
    estimatedPotential: number;
  }>,
  existingBlogTitles: string[]
): Promise<ContentRecommendation[]> {
  const systemInstruction = `You are an SEO content strategist for Herbarium Dyeworks, a hand-dyed wool e-commerce business.
Your role is to analyze search data and generate actionable content recommendations that will improve organic traffic.

Key business context:
- Artisan hand-dyed wool products
- Natural dye processes (indigo, madder, weld, etc.)
- Target audience: knitters, fiber artists, sustainable fashion enthusiasts
- Voice: Educational, personal, storytelling-focused (not hard-sell)

Recommendation types:
- "new_post": Create entirely new content for untapped keywords
- "optimize": Improve existing content for better rankings
- "quick_win": Low-hanging fruit (high impressions, poor CTR, positions 4-10)
- "long_tail": Specific, niche queries with commercial intent

Priority assessment:
- "high": >500 impressions/month OR position 4-7 with >100 impressions
- "medium": 100-500 impressions OR position 8-15
- "low": <100 impressions OR position >15

Confidence levels:
- "high": Clear search intent, strong commercial value, good keyword volume
- "medium": Moderate search volume, indirect commercial value
- "low": Low volume but strategic importance`;

  const prompt = `Analyze these top search queries and existing blog content to generate content recommendations.

TOP SEARCH QUERIES (last 90 days):
${topQueries.slice(0, 30).map((q, i) =>
  `${i + 1}. "${q.query}"
   - ${q.impressions} impressions, ${q.clicks} clicks
   - Position ${q.position.toFixed(1)}, CTR ${(q.ctr * 100).toFixed(1)}%
   - Potential: +${q.estimatedPotential} clicks`
).join('\n')}

EXISTING BLOG POSTS:
${existingBlogTitles.length > 0
  ? existingBlogTitles.map((title, i) => `${i + 1}. ${title}`).join('\n')
  : 'No existing blog posts'}

TASK:
Generate 8-12 content recommendations based on this data. Focus on:
1. Content gaps (queries with high impressions but no matching content)
2. Quick wins (positions 4-10 that could reach top 3 with optimization)
3. Long-tail opportunities (specific, convertible queries)
4. Optimization for existing posts (if queries suggest better content)

OUTPUT FORMAT (valid JSON array only, no markdown):
[
  {
    "type": "new_post" | "optimize" | "quick_win" | "long_tail",
    "title": "Brief recommendation title",
    "targetKeyword": "Primary keyword to target",
    "suggestedTitle": "Suggested blog post title (SEO-optimized H1)",
    "explanation": "Why this is valuable (1-2 sentences)",
    "estimatedOpportunity": <impressions number>,
    "confidence": "high" | "medium" | "low",
    "priority": "high" | "medium" | "low",
    "relatedQueries": ["related keyword 1", "related keyword 2"]
  }
]`;

  try {
    const response = await generateContent({
      prompt,
      systemInstruction,
      maxTokens: 4096,
    });

    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("Failed to extract JSON from AI response");
      return [];
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Transform to our interface with IDs
    return parsed.map((rec: any) => ({
      id: crypto.randomUUID(),
      type: rec.type as RecommendationType,
      title: rec.title,
      targetKeyword: rec.targetKeyword,
      suggestedTitle: rec.suggestedTitle,
      explanation: rec.explanation,
      estimatedOpportunity: rec.estimatedOpportunity || 0,
      confidence: rec.confidence as ConfidenceLevel,
      priority: rec.priority as PriorityLevel,
      relatedQueries: rec.relatedQueries || [],
      existingPostId: rec.existingPostId || undefined,
    }));
  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    return [];
  }
}

/**
 * Cache recommendations in database
 */
async function cacheRecommendations(
  userId: string,
  recommendations: ContentRecommendation[]
): Promise<void> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Delete old recommendations for this user
  await db.delete(aiRecommendations).where(eq(aiRecommendations.userId, userId));

  // Insert new recommendations
  if (recommendations.length > 0) {
    await db.insert(aiRecommendations).values(
      recommendations.map((rec) => ({
        id: rec.id,
        userId,
        type: rec.type,
        title: rec.title,
        targetKeyword: rec.targetKeyword,
        suggestedTitle: rec.suggestedTitle || null,
        explanation: rec.explanation,
        estimatedOpportunity: rec.estimatedOpportunity,
        confidence: rec.confidence,
        priority: rec.priority,
        relatedQueries: rec.relatedQueries ? JSON.stringify(rec.relatedQueries) : null,
        existingPostId: rec.existingPostId || null,
        createdAt: now,
        expiresAt,
      }))
    );
  }
}

/**
 * Get cached recommendations from database
 */
async function getCachedRecommendations(
  userId: string
): Promise<{ recommendations: ContentRecommendation[]; cachedAt: Date } | null> {
  const now = new Date();

  // Fetch non-expired recommendations
  const cached = await db
    .select()
    .from(aiRecommendations)
    .where(
      and(
        eq(aiRecommendations.userId, userId),
        gt(aiRecommendations.expiresAt, now)
      )
    )
    .orderBy(aiRecommendations.createdAt);

  if (cached.length === 0) {
    return null;
  }

  // Transform from DB format
  const recommendations: ContentRecommendation[] = cached.map((rec) => ({
    id: rec.id,
    type: rec.type,
    title: rec.title,
    targetKeyword: rec.targetKeyword,
    suggestedTitle: rec.suggestedTitle || undefined,
    explanation: rec.explanation,
    estimatedOpportunity: rec.estimatedOpportunity,
    confidence: rec.confidence,
    priority: rec.priority,
    relatedQueries: rec.relatedQueries ? JSON.parse(rec.relatedQueries) : undefined,
    existingPostId: rec.existingPostId || undefined,
  }));

  return {
    recommendations,
    cachedAt: cached[0].createdAt || new Date(),
  };
}

/**
 * Generate summary from recommendations
 */
function generateSummary(recommendations: ContentRecommendation[]): RecommendationSummary {
  const byType: Record<RecommendationType, number> = {
    new_post: 0,
    optimize: 0,
    quick_win: 0,
    long_tail: 0,
  };

  recommendations.forEach((rec) => {
    byType[rec.type] = (byType[rec.type] || 0) + 1;
  });

  // Find top priority recommendation
  const highPriorityRecs = recommendations.filter((r) => r.priority === "high");
  const topPriority = highPriorityRecs.length > 0 ? highPriorityRecs[0] : null;

  return {
    totalRecommendations: recommendations.length,
    byType,
    topPriority,
  };
}

/**
 * Calculate estimated potential additional clicks
 */
function calculateEstimatedPotential(
  impressions: number,
  clicks: number,
  position: number
): number {
  // Estimate CTR at position #1 (30% for niche content)
  const potentialClicksAtTop = impressions * 0.3;
  return Math.max(0, Math.round(potentialClicksAtTop - clicks));
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user.id) {
      throw new Error("User ID not found");
    }

    const userId = user.id;
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get("refresh") === "true";

    // Check for cached recommendations first (unless refresh requested)
    if (!forceRefresh) {
      const cached = await getCachedRecommendations(userId);
      if (cached) {
        const expiresAt = new Date(cached.cachedAt.getTime() + 7 * 24 * 60 * 60 * 1000);
        return NextResponse.json({
          recommendations: cached.recommendations,
          summary: generateSummary(cached.recommendations),
          cachedAt: cached.cachedAt.toISOString(),
          expiresAt: expiresAt.toISOString(),
        } as ContentSuggestionsResponse);
      }
    }

    // Fetch fresh data from Google Search Console
    const siteUrl = searchParams.get("siteUrl") || "sc-domain:herbariumdyeworks.com";
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // Get top 50 search queries
    const gscData = await getUserSearchAnalytics(userId, siteUrl, {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 50,
    });

    // Get existing blog post titles for gap detection
    const posts = await db
      .select({ title: blogPosts.title })
      .from(blogPosts)
      .where(eq(blogPosts.userId, userId));

    const existingTitles = posts.map((p) => p.title);

    // Format GSC data for AI analysis
    const topQueries = (gscData.rows || []).map((row) => ({
      query: row.keys?.[0] || "",
      impressions: row.impressions,
      clicks: row.clicks,
      position: row.position,
      ctr: row.ctr,
      estimatedPotential: calculateEstimatedPotential(
        row.impressions,
        row.clicks,
        row.position
      ),
    }));

    // Generate recommendations using Gemini AI
    const recommendations = await generateAIRecommendations(topQueries, existingTitles);

    // Cache the results
    await cacheRecommendations(userId, recommendations);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return NextResponse.json({
      recommendations,
      summary: generateSummary(recommendations),
      cachedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    } as ContentSuggestionsResponse);
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle Google API errors
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
    console.error("Content suggestions error:", message);

    // Return partial results on error with empty data
    return NextResponse.json(
      {
        recommendations: [],
        summary: {
          totalRecommendations: 0,
          byType: {
            new_post: 0,
            optimize: 0,
            quick_win: 0,
            long_tail: 0,
          },
          topPriority: null,
        },
        cachedAt: new Date().toISOString(),
        expiresAt: new Date().toISOString(),
        error: message,
      },
      { status: 500 }
    );
  }
}
