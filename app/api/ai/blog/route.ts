import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const { action, title, content } = await request.json();

    if (!action || !content) {
      return NextResponse.json(
        { error: "Missing required fields: action and content" },
        { status: 400 }
      );
    }

    const systemInstruction = `You are an SEO content writer for Herbarium Dyeworks, an artisan hand-dyed wool business.
Write educational, engaging content about natural dyeing, hand-dyed wool, and fiber arts.
Use an artisan voice: educational, personal, storytelling-focused. Never hard-sell.`;

    let result: string;

    switch (action) {
      case "excerpt": {
        // Generate excerpt from content
        const prompt = `Read this blog post content and generate a concise, engaging excerpt (150-160 characters) suitable for meta description and SEO.

Blog content:
${content}

Return ONLY the excerpt text, no additional formatting or explanation.`;

        result = await generateContent({ prompt, systemInstruction, maxTokens: 200 });
        // Clean up any quotes or extra whitespace
        result = result.trim().replace(/^["']|["']$/g, "");
        break;
      }

      case "tags": {
        // Generate tags from title and content
        const prompt = `Read this blog post and suggest 5-8 relevant tags/keywords for SEO and categorization.

Title: ${title || "Untitled"}
Content:
${content}

Focus on:
- Natural dyeing techniques
- Color names
- Fiber types (wool, yarn, etc.)
- Craft processes
- Seasonal themes

Return ONLY a comma-separated list of tags, no additional formatting or explanation.
Example: indigo dyeing, natural dyes, hand-dyed yarn, wool fiber, botanical colors`;

        result = await generateContent({ prompt, systemInstruction, maxTokens: 150 });
        // Clean up any extra whitespace or formatting
        result = result.trim().replace(/\n/g, ", ").replace(/,\s*,/g, ",");
        break;
      }

      default:
        return NextResponse.json({ error: "Invalid action. Use 'excerpt' or 'tags'" }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("AI blog generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate content" },
      { status: 500 }
    );
  }
}
