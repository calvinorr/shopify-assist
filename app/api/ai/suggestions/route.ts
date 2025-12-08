import { NextRequest, NextResponse } from "next/server";
import { generatePostIdeas } from "@/lib/gemini";
import { db } from "@/lib/db";
import { products, aiSuggestions } from "@/lib/schema";
import { desc, sql, eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

function getSeasonalContext(): string {
  const month = new Date().getMonth();
  const seasons: Record<number, string> = {
    0: "New Year, fresh starts, winter knitting projects",
    1: "Valentine's Day coming, cozy winter crafting",
    2: "Early spring, Easter prep, lighter colors emerging",
    3: "Spring in full bloom, outdoor dyeing season starting",
    4: "Mother's Day, spring garden inspiration",
    5: "Summer approaching, cotton and linen blends",
    6: "Summer crafting, vacation projects",
    7: "Back-to-school prep, fall planning",
    8: "Autumn colors, cozy season beginning",
    9: "Halloween/fall harvest, warm tones trending",
    10: "Holiday gift prep, winter warmth",
    11: "Holiday season, gift giving, winter projects",
  };
  return seasons[month] || "";
}

async function generateBlogTopics(
  topColors: string[],
  recentProducts: string[]
): Promise<Array<{ title: string; description: string; reasoning: string; suggestedKeywords: string[] }>> {
  const { generateContent } = await import("@/lib/gemini");

  const systemInstruction = `You are a content strategist for Herbarium Dyeworks, an artisan hand-dyed wool business.
Suggest SEO-focused blog topics that educate readers about natural dyeing, wool care, and fiber arts.`;

  const prompt = `Generate 3 unique blog post topic ideas based on this context:

Top-selling colors: ${topColors.join(", ")}
Recent products: ${recentProducts.join(", ")}
Season: ${getSeasonalContext()}

For each topic, provide:
- Title (SEO-friendly, compelling)
- Description (2-3 sentences about what the post covers)
- Reasoning (why this topic will attract readers and rank well)
- Suggested Keywords (4-5 SEO keywords to target)

Make sure each topic is distinct - mix educational content, seasonal inspiration, and product storytelling.

Format as JSON array:
[{"title": "", "description": "", "reasoning": "", "suggestedKeywords": []}, ...]`;

  const response = await generateContent({ prompt, systemInstruction, maxTokens: 1200 });

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 3);
      }
    }
  } catch {
    // Fallback
  }

  return [
    {
      title: "Guide to Natural Dyeing with Plant Materials",
      description: "A comprehensive guide to getting started with natural dyes.",
      reasoning: "Evergreen content that attracts organic search traffic.",
      suggestedKeywords: ["natural dyeing", "plant dyes", "wool dyeing", "eco-friendly crafts"],
    },
    {
      title: "Caring for Your Hand-Dyed Wool",
      description: "Essential tips for washing, storing, and maintaining hand-dyed fibers.",
      reasoning: "Practical content that builds trust and reduces returns.",
      suggestedKeywords: ["wool care", "hand-dyed yarn care", "fiber maintenance"],
    },
    {
      title: "The Story Behind Our Seasonal Colors",
      description: "Discover the inspiration behind this season's color palette.",
      reasoning: "Storytelling content that connects emotionally with customers.",
      suggestedKeywords: ["seasonal colors", "color inspiration", "artisan dyeing"],
    },
  ];
}

// GET - Load cached suggestions from database (fast, no AI)
export async function GET() {
  try {
    await requireAuth();
    // Load cached suggestions from database
    const instagramRows = await db
      .select()
      .from(aiSuggestions)
      .where(eq(aiSuggestions.type, "instagram"))
      .orderBy(desc(aiSuggestions.createdAt))
      .limit(3);

    const blogRows = await db
      .select()
      .from(aiSuggestions)
      .where(eq(aiSuggestions.type, "blog"))
      .orderBy(desc(aiSuggestions.createdAt))
      .limit(3);

    const instagram = instagramRows.map((row) => {
      try {
        return JSON.parse(row.suggestion);
      } catch {
        return { title: "Error", description: "", reasoning: "" };
      }
    });

    const blog = blogRows.map((row) => {
      try {
        return JSON.parse(row.suggestion);
      } catch {
        return { title: "Error", description: "", reasoning: "", suggestedKeywords: [] };
      }
    });

    const cachedAt = instagramRows.length > 0
      ? instagramRows[0].createdAt?.getTime() || Date.now()
      : null;

    return NextResponse.json({
      instagram,
      blog,
      cachedAt,
      isEmpty: instagram.length === 0 && blog.length === 0,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to load cached suggestions:", error);
    return NextResponse.json({
      instagram: [],
      blog: [],
      cachedAt: null,
      isEmpty: true,
    });
  }
}

// POST - Generate new suggestions and save to database
export async function POST(request: NextRequest) {
  const rateLimitError = rateLimit(request, "ai:suggestions", RATE_LIMITS.ai);
  if (rateLimitError) return rateLimitError;

  try {
    await requireAuth();
    // Fetch product data for context
    const colorStats = await db
      .select({
        color: products.color,
        count: sql<number>`count(*)`,
      })
      .from(products)
      .groupBy(products.color)
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    const recentProds = await db
      .select({
        name: products.name,
        color: products.color,
      })
      .from(products)
      .orderBy(desc(products.createdAt))
      .limit(5);

    const topColors = colorStats
      .map((c) => c.color)
      .filter((c): c is string => c !== null);

    const recentProductNames = recentProds
      .map((p) => `${p.name} (${p.color || "natural"})`)
      .filter(Boolean);

    // Generate suggestions in parallel
    const [instagramIdeas, blogTopics] = await Promise.all([
      generatePostIdeas(topColors, recentProductNames, getSeasonalContext()),
      generateBlogTopics(topColors, recentProductNames),
    ]);

    // Clear old suggestions and save new ones
    await db.delete(aiSuggestions).where(eq(aiSuggestions.type, "instagram"));
    await db.delete(aiSuggestions).where(eq(aiSuggestions.type, "blog"));

    // Save new Instagram suggestions
    for (const idea of instagramIdeas) {
      await db.insert(aiSuggestions).values({
        id: crypto.randomUUID(),
        type: "instagram",
        suggestion: JSON.stringify(idea),
        reasoning: idea.reasoning,
        used: false,
      });
    }

    // Save new blog suggestions
    for (const topic of blogTopics) {
      await db.insert(aiSuggestions).values({
        id: crypto.randomUUID(),
        type: "blog",
        suggestion: JSON.stringify(topic),
        reasoning: topic.reasoning,
        used: false,
      });
    }

    return NextResponse.json({
      instagram: instagramIdeas,
      blog: blogTopics,
      cachedAt: Date.now(),
      isEmpty: false,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("AI suggestions generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
