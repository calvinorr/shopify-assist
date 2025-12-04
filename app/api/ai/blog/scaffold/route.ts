import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { db } from "@/lib/db";
import { blogPosts, products } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { title, description, suggestedKeywords } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Missing required field: title" },
        { status: 400 }
      );
    }

    // Fetch some product context for the AI
    const recentProds = await db
      .select({
        name: products.name,
        color: products.color,
      })
      .from(products)
      .orderBy(desc(products.createdAt))
      .limit(5);

    const productContext = recentProds
      .map((p) => `${p.name} (${p.color || "natural"})`)
      .join(", ");

    const systemInstruction = `You are an expert blog writer for Herbarium Dyeworks, an artisan hand-dyed wool business.
Write educational, engaging blog content in an artisan voice: personal, storytelling-focused, never hard-sell.
Focus on natural dyeing, wool care, and fiber arts. Include practical tips and personal anecdotes.
Write in HTML format suitable for a blog editor.`;

    const prompt = `Write a complete blog post based on this topic:

Topic: ${title}
Description: ${description || ""}
Target Keywords: ${suggestedKeywords?.join(", ") || "natural dyes, hand-dyed wool"}
Related Products: ${productContext}

Write the full blog post content in HTML format with:
- An engaging introduction paragraph (no H1, the title is separate)
- 4-5 sections with H2 headings
- Each section should have 2-3 paragraphs of real, useful content
- Include practical tips where relevant
- End with a conclusion and soft call-to-action
- Total length: approximately 800-1200 words

Important:
- Do NOT include the title as an H1 at the start
- Use only <h2>, <p>, <ul>, <li>, <strong>, <em> tags
- Make it feel personal and authentic, not generic
- Include specific details about natural dyeing when relevant

Return ONLY the HTML content, no markdown, no code blocks.`;

    const contentHtml = await generateContent({
      prompt,
      systemInstruction,
      maxTokens: 3000
    });

    // Clean up the response (remove any markdown code blocks if present)
    let cleanedHtml = contentHtml
      .replace(/```html\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Generate a URL-friendly slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Generate excerpt/meta description
    const excerptPrompt = `Write a 150-160 character meta description for a blog post titled "${title}" about: ${description}. Return ONLY the text, no quotes.`;
    const metaDescription = await generateContent({
      prompt: excerptPrompt,
      maxTokens: 100
    });

    // Create the blog post draft in the database
    const postId = crypto.randomUUID();

    await db.insert(blogPosts).values({
      id: postId,
      title,
      slug: `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
      contentHtml: cleanedHtml,
      metaDescription: metaDescription.replace(/^["']|["']$/g, "").trim(),
      focusKeywords: JSON.stringify(suggestedKeywords || []),
      status: "draft",
    });

    return NextResponse.json({
      success: true,
      postId,
      title,
      contentPreview: cleanedHtml.substring(0, 200) + "...",
    });
  } catch (error) {
    console.error("Blog scaffold generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate blog scaffold" },
      { status: 500 }
    );
  }
}
