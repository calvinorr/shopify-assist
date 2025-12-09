import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

// Use Gemini 2.0 Flash for cost-effective, fast responses
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface GenerateContentOptions {
  prompt: string;
  systemInstruction?: string;
  maxTokens?: number;
}

/**
 * Generate content using Gemini Flash
 */
export async function generateContent({
  prompt,
  systemInstruction,
  maxTokens = 1024,
}: GenerateContentOptions): Promise<string> {
  const modelWithSystem = systemInstruction
    ? genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction,
      })
    : model;

  const result = await modelWithSystem.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      maxOutputTokens: maxTokens,
    },
  });

  return result.response.text();
}

/**
 * Generate Instagram caption variations
 */
export async function generateCaptions(
  productName: string,
  productDescription: string,
  color: string,
  additionalContext?: string
): Promise<string[]> {
  const systemInstruction = `You are a content creator for Herbarium Dyeworks, an artisan hand-dyed wool business.
Write in an artisan voice: educational, personal, storytelling-focused. Never hard-sell.
Focus on the craft, the natural dye process, and the beauty of the colors.`;

  const prompt = `Generate 3 Instagram caption variations for this product:

Product: ${productName}
Color: ${color}
Description: ${productDescription}
${additionalContext ? `Additional context: ${additionalContext}` : ""}

Each caption should:
- Be 150-250 characters (Instagram-friendly)
- Include a call-to-action (link in bio, shop now, etc.)
- Have a different tone: 1) Educational, 2) Personal/Behind-the-scenes, 3) Seasonal/Timely

Return ONLY the 3 captions, numbered 1-3, with no additional commentary.`;

  const response = await generateContent({ prompt, systemInstruction, maxTokens: 800 });

  // Parse the numbered captions
  const captions = response
    .split(/\d+\.\s+/)
    .filter((c) => c.trim().length > 0)
    .map((c) => c.trim());

  return captions;
}

/**
 * Generate Instagram post ideas based on product data
 */
export async function generatePostIdeas(
  topColors: string[],
  recentProducts: string[],
  seasonalContext?: string
): Promise<Array<{ title: string; description: string; reasoning: string }>> {
  const systemInstruction = `You are a content strategist for Herbarium Dyeworks, an artisan hand-dyed wool business.
Suggest Instagram post ideas that balance education, storytelling, and subtle promotion.`;

  const prompt = `Generate 3 Instagram post ideas for this week.

Top-selling colors: ${topColors.join(", ")}
Recent products: ${recentProducts.join(", ")}
${seasonalContext ? `Seasonal context: ${seasonalContext}` : ""}

For each idea, provide:
- Title (short, catchy)
- Description (what the post should show/say)
- Reasoning (why this will perform well)

Format as JSON array: [{"title": "", "description": "", "reasoning": ""}]`;

  const response = await generateContent({ prompt, systemInstruction, maxTokens: 1000 });

  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Fallback if JSON parsing fails
  }

  return [];
}

/**
 * Generate blog post scaffold
 */
export async function generateBlogScaffold(
  topic: string,
  focusKeywords: string[],
  relatedProducts: string[]
): Promise<{
  title: string;
  metaDescription: string;
  sections: Array<{ heading: string; content: string }>;
  suggestedCTA: string;
}> {
  const systemInstruction = `You are an SEO content writer for Herbarium Dyeworks, an artisan hand-dyed wool business.
Write educational, engaging blog content that ranks well for natural dyeing and hand-dyed wool keywords.`;

  const prompt = `Create a blog post scaffold for this topic:

Topic: ${topic}
Focus keywords: ${focusKeywords.join(", ")}
Related products to mention: ${relatedProducts.join(", ")}

Provide:
1. SEO-optimized title (H1)
2. Meta description (150-160 characters)
3. 5-6 section headings with brief content outlines
4. Suggested call-to-action

Format as JSON:
{
  "title": "",
  "metaDescription": "",
  "sections": [{"heading": "", "content": ""}],
  "suggestedCTA": ""
}`;

  const response = await generateContent({ prompt, systemInstruction, maxTokens: 1500 });

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Fallback
  }

  return {
    title: topic,
    metaDescription: "",
    sections: [],
    suggestedCTA: "",
  };
}

/**
 * Refine a caption with product context
 */
export async function refineCaption(
  currentCaption: string,
  productName: string,
  productColor?: string | null,
  productDescription?: string
): Promise<string> {
  const systemInstruction = `You are a content editor for Herbarium Dyeworks, an artisan hand-dyed wool business.
Refine Instagram captions to naturally incorporate product mentions while maintaining the artisan voice.
Keep the original tone and style, just weave in product details authentically.`;

  const prompt = `Refine this Instagram caption to mention the featured product naturally:

Current caption:
"${currentCaption}"

Featured product:
- Name: ${productName}
${productColor ? `- Color: ${productColor}` : ""}
${productDescription ? `- Description: ${productDescription}` : ""}

Guidelines:
- Keep the same length (±20 characters)
- Maintain the original tone and voice
- Naturally work in the product name/color
- Don't add hard-sell language
- Keep any existing hashtags at the end

Return ONLY the refined caption, nothing else.`;

  const response = await generateContent({ prompt, systemInstruction, maxTokens: 500 });
  return response.trim().replace(/^["']|["']$/g, ""); // Remove any quotes
}

/**
 * Generate hashtag suggestions
 */
export async function generateHashtags(
  productName: string,
  color: string,
  category?: string
): Promise<{ brand: string[]; product: string[]; community: string[]; trending: string[] }> {
  const prompt = `Generate Instagram hashtags for a hand-dyed wool product:

Product: ${productName}
Color: ${color}
${category ? `Category: ${category}` : ""}

Provide hashtags in 4 categories:
- Brand: Herbarium Dyeworks specific
- Product: About the product/color
- Community: Knitting/fiber arts community
- Trending: Currently popular relevant tags

Format as JSON:
{"brand": [], "product": [], "community": [], "trending": []}

Include # symbol. 5-7 hashtags per category.`;

  const response = await generateContent({ prompt, maxTokens: 500 });

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Fallback
  }

  return { brand: [], product: [], community: [], trending: [] };
}

/**
 * Generate AI-enhanced content recommendations
 */
export async function generateAIContentRecommendations(
  opportunities: Array<{
    query: string;
    impressions: number;
    position: number;
    type: string;
  }>
): Promise<
  Array<{
    title: string;
    reasoning: string;
  }>
> {
  if (opportunities.length === 0) {
    return [];
  }

  const systemInstruction = `You are a content strategist for Herbarium Dyeworks, an artisan hand-dyed wool business.
Create compelling content recommendations based on search data that will engage the audience and improve SEO performance.`;

  const prompt = `Based on these search queries and their performance, suggest content titles and reasoning:

${opportunities
  .map(
    (opp, i) =>
      `${i + 1}. Query: "${opp.query}"
   - Impressions: ${opp.impressions}/month
   - Current position: ${opp.position.toFixed(1)}
   - Type: ${opp.type}`
  )
  .join("\n\n")}

For each query, provide:
- A compelling blog post title that would rank well
- Brief reasoning (1-2 sentences) explaining why this content would perform well

Format as JSON array:
[{"title": "", "reasoning": ""}]`;

  const response = await generateContent({
    prompt,
    systemInstruction,
    maxTokens: 1000,
  });

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Fallback to basic recommendations
    return opportunities.map((opp) => ({
      title: `Guide to ${opp.query}`,
      reasoning: `This query has ${opp.impressions} monthly impressions. Creating targeted content could improve rankings.`,
    }));
  }

  return [];
}
