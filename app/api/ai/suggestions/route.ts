import { NextResponse } from "next/server";
import { generatePostIdeas } from "@/lib/gemini";
import { db } from "@/lib/db";
import { products, aiSuggestions } from "@/lib/schema";
import { desc, sql, eq } from "drizzle-orm";

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

async function generateBlogTopic(
  topColors: string[],
  recentProducts: string[]
): Promise<{ title: string; description: string; reasoning: string; suggestedKeywords: string[] }> {
  const { generateContent } = await import("@/lib/gemini");

  const systemInstruction = `You are a content strategist for Herbarium Dyeworks, an artisan hand-dyed wool business.
Suggest SEO-focused blog topics that educate readers about natural dyeing, wool care, and fiber arts.`;

  const prompt = `Generate 1 blog post topic idea based on this context:

Top-selling colors: ${topColors.join(", ")}
Recent products: ${recentProducts.join(", ")}
Season: ${getSeasonalContext()}

Provide:
- Title (SEO-friendly, compelling)
- Description (2-3 sentences about what the post covers)
- Reasoning (why this topic will attract readers and rank well)
- Suggested Keywords (4-5 SEO keywords to target)

Format as JSON:
{"title": "", "description": "", "reasoning": "", "suggestedKeywords": []}`;

  const response = await generateContent({ prompt, systemInstruction, maxTokens: 600 });

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Fallback
  }

  return {
    title: "Guide to Natural Dyeing with Plant Materials",
    description: "A comprehensive guide to getting started with natural dyes.",
    reasoning: "Evergreen content that attracts organic search traffic.",
    suggestedKeywords: ["natural dyeing", "plant dyes", "wool dyeing", "eco-friendly crafts"],
  };
}

// GET - Load cached suggestions from database (fast, no AI)
export async function GET() {
  try {
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
      .limit(1);

    const instagram = instagramRows.map((row) => {
      try {
        return JSON.parse(row.suggestion);
      } catch {
        return { title: "Error", description: "", reasoning: "" };
      }
    });

    const blog = blogRows.length > 0 ? JSON.parse(blogRows[0].suggestion) : null;

    const cachedAt = instagramRows.length > 0
      ? instagramRows[0].createdAt?.getTime() || Date.now()
      : null;

    return NextResponse.json({
      instagram,
      blog,
      cachedAt,
      isEmpty: instagram.length === 0 && !blog,
    });
  } catch (error) {
    console.error("Failed to load cached suggestions:", error);
    return NextResponse.json({
      instagram: [],
      blog: null,
      cachedAt: null,
      isEmpty: true,
    });
  }
}

// POST - Generate new suggestions and save to database
export async function POST() {
  try {
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
    const [instagramIdeas, blogTopic] = await Promise.all([
      generatePostIdeas(topColors, recentProductNames, getSeasonalContext()),
      generateBlogTopic(topColors, recentProductNames),
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

    // Save new blog suggestion
    await db.insert(aiSuggestions).values({
      id: crypto.randomUUID(),
      type: "blog",
      suggestion: JSON.stringify(blogTopic),
      reasoning: blogTopic.reasoning,
      used: false,
    });

    return NextResponse.json({
      instagram: instagramIdeas,
      blog: blogTopic,
      cachedAt: Date.now(),
      isEmpty: false,
    });
  } catch (error) {
    console.error("AI suggestions generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
