import { NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { desc, sql } from "drizzle-orm";

/**
 * Determine the current season based on the month
 */
function getSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Fall";
  return "Winter";
}

/**
 * Get upcoming holidays in the next 30 days
 */
function getUpcomingHolidays(): string[] {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  const holidays: Record<string, string> = {
    "0-1": "New Year's Day",
    "1-14": "Valentine's Day",
    "2-17": "St. Patrick's Day",
    "3-22": "Earth Day",
    "4-12": "Mother's Day (approx)",
    "5-19": "Father's Day (approx)",
    "6-4": "Independence Day",
    "8-2": "Labor Day (approx)",
    "9-31": "Halloween",
    "10-28": "Thanksgiving (approx)",
    "11-25": "Christmas",
  };

  const upcoming: string[] = [];

  // Check current month and next month
  for (let i = 0; i < 60; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(now.getDate() + i);
    const checkMonth = checkDate.getMonth();
    const checkDay = checkDate.getDate();
    const key = `${checkMonth}-${checkDay}`;

    if (holidays[key] && i <= 30) {
      upcoming.push(holidays[key]);
    }
  }

  return upcoming;
}

/**
 * Generate contextual blog post ideas using Gemini AI
 * GET /api/blog/ideas
 */
export async function GET() {
  try {
    // 1. Gather context
    const season = getSeason();
    const holidays = getUpcomingHolidays();

    // Fetch top colors from products
    const colorStats = await db
      .select({
        color: products.color,
        count: sql<number>`count(*)`,
      })
      .from(products)
      .groupBy(products.color)
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    const topColors = colorStats
      .map((c) => c.color)
      .filter((c): c is string => c !== null);

    // Fetch bestselling products
    const topProducts = await db
      .select({
        name: products.name,
        color: products.color,
        tags: products.tags,
      })
      .from(products)
      .orderBy(desc(products.inventory))
      .limit(5);

    const productNames = topProducts
      .map((p) => `${p.name}${p.color ? ` (${p.color})` : ""}`)
      .filter(Boolean);

    // 2. Build AI prompt
    const systemInstruction = `You are a content strategist for Herbarium Dyeworks, an artisan hand-dyed wool business.
Your role is to generate SEO-optimized blog post ideas that educate fiber artists while naturally connecting to products.
Write in an educational, storytelling tone - never salesy or promotional.`;

    const prompt = `You are a content strategist for Herbarium Dyeworks, an artisan hand-dyed wool business.

Current context:
- Season: ${season}
- Upcoming: ${holidays.length > 0 ? holidays.join(", ") : "No major holidays in next 30 days"}
- Top colors: ${topColors.length > 0 ? topColors.join(", ") : "No color data available"}
- Bestselling products: ${productNames.length > 0 ? productNames.join(", ") : "No product data available"}

Generate 5 blog post ideas that:
1. Target long-tail SEO keywords fiber artists search for
2. Tie naturally to products without being salesy
3. Provide genuine educational value
4. Mix evergreen and seasonal content

Return JSON array with exactly this structure:
[{
  "id": "unique-id",
  "title": "SEO-friendly headline",
  "hook": "One compelling sentence to intrigue readers",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "type": "how-to" | "guide" | "story" | "seasonal" | "product-spotlight",
  "seasonalRelevance": "why this is timely (or 'evergreen')"
}]

IMPORTANT: Return ONLY valid JSON. No markdown formatting, no code blocks, just the raw JSON array.`;

    // 3. Generate ideas
    const response = await generateContent({
      prompt,
      systemInstruction,
      maxTokens: 2000,
    });

    // 4. Parse response
    let ideas = [];
    try {
      // Try to extract JSON from response (handle markdown code blocks)
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        ideas = JSON.parse(jsonMatch[0]);
      } else {
        // If no array found, try parsing the whole response
        ideas = JSON.parse(response);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw response:", response);

      // Return error response
      return NextResponse.json(
        {
          error: "Failed to parse AI response",
          rawResponse: response.substring(0, 500),
        },
        { status: 500 }
      );
    }

    // 5. Validate and return response
    return NextResponse.json({
      ideas,
      context: {
        season,
        holidays,
        topColors,
      },
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Blog ideas generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate blog ideas",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
