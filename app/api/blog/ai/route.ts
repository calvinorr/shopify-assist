import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { requireAuth } from "@/lib/auth";

const SYSTEM_INSTRUCTION = `You are a content assistant for Herbarium Dyeworks, an artisan hand-dyed wool business specializing in natural dyes and hand-dyed yarn for knitters and fiber artists.`;

/**
 * Strip HTML tags from content
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ") // Remove HTML tags
    .replace(/\s+/g, " ") // Collapse whitespace
    .trim();
}

/**
 * POST /api/blog/ai
 *
 * Generate AI-powered blog content assistance
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const { action, content, title } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Missing required parameter: action" },
        { status: 400 }
      );
    }

    // Generate excerpt from blog content
    if (action === "excerpt") {
      if (!content) {
        return NextResponse.json(
          { error: "Missing required parameter: content" },
          { status: 400 }
        );
      }

      const plainText = stripHtml(content);

      if (plainText.length === 0) {
        return NextResponse.json(
          { error: "Content is empty after HTML removal" },
          { status: 400 }
        );
      }

      const prompt = `Generate a compelling excerpt for this blog post content. The excerpt should:
- Be 2-3 sentences (150-200 characters)
- Capture the main idea and hook the reader
- Be suitable for SEO meta descriptions
- Maintain the artisan, educational tone

Content:
${plainText.slice(0, 2000)} ${plainText.length > 2000 ? "..." : ""}

Return ONLY the excerpt text, no additional commentary.`;

      const excerpt = await generateContent({
        prompt,
        systemInstruction: SYSTEM_INSTRUCTION,
        maxTokens: 200,
      });

      return NextResponse.json({ excerpt: excerpt.trim() });
    }

    // Generate tag suggestions from blog content
    if (action === "tags") {
      if (!title && !content) {
        return NextResponse.json(
          { error: "Missing required parameters: title or content" },
          { status: 400 }
        );
      }

      const plainText = content ? stripHtml(content) : "";

      const prompt = `Generate 3-5 relevant tags for this blog post about natural dyeing and hand-dyed wool.

${title ? `Title: ${title}` : ""}
${plainText ? `Content:\n${plainText.slice(0, 1500)} ${plainText.length > 1500 ? "..." : ""}` : ""}

Tags should:
- Be relevant to natural dyeing, fiber arts, knitting, or wool crafts
- Be lowercase, hyphen-separated (e.g., "natural-dyes", "wool-dyeing")
- Be searchable keywords
- Include color names if mentioned
- Include technique names if mentioned (e.g., "indigo-dyeing", "plant-based-dyes")

Return ONLY the tags as a JSON array: ["tag-1", "tag-2", "tag-3"]`;

      const response = await generateContent({
        prompt,
        systemInstruction: SYSTEM_INSTRUCTION,
        maxTokens: 200,
      });

      try {
        // Extract JSON array from response
        const jsonMatch = response.match(/\[[\s\S]*?\]/);
        if (jsonMatch) {
          const tags: string[] = JSON.parse(jsonMatch[0]);
          // Validate tags are strings
          if (Array.isArray(tags) && tags.every(t => typeof t === "string")) {
            return NextResponse.json({ tags });
          }
        }
      } catch (parseError) {
        console.error("Failed to parse tags JSON:", parseError);
      }

      // Fallback: Extract tags from response text
      const fallbackTags = response
        .split(/[,\n]/)
        .map(t => t.trim().replace(/^["'\-\s]+|["'\-\s]+$/g, ""))
        .filter(t => t.length > 0 && t.length < 50)
        .slice(0, 5);

      return NextResponse.json({ tags: fallbackTags });
    }

    return NextResponse.json(
      { error: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Blog AI API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
