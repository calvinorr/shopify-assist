import { NextRequest, NextResponse } from "next/server";
import { generateCaptions, generateHashtags } from "@/lib/gemini";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    // Parse request body
    const body = await req.json();
    const { ideaTitle, ideaDescription, productName, color } = body;

    // Validate required fields
    if (!ideaTitle || !ideaDescription) {
      return NextResponse.json(
        { error: "Missing required fields: ideaTitle and ideaDescription" },
        { status: 400 }
      );
    }

    // Use provided values or sensible defaults
    const product = productName || "Hand-Dyed Wool";
    const colorName = color || "Natural Dye";

    // Build context from idea title and description
    const context = `Instagram Post Idea: ${ideaTitle}\n${ideaDescription}`;

    // Generate captions and hashtags in parallel
    const [captions, hashtags] = await Promise.all([
      generateCaptions(product, ideaDescription, colorName, context),
      generateHashtags(product, colorName, "hand-dyed wool")
    ]);

    // Return formatted response
    return NextResponse.json({
      captions: captions.length > 0 ? captions : getFallbackCaptions(ideaTitle, product, colorName),
      hashtags: {
        brand: hashtags.brand.length > 0 ? hashtags.brand : getFallbackBrandHashtags(),
        product: hashtags.product.length > 0 ? hashtags.product : getFallbackProductHashtags(),
        community: hashtags.community.length > 0 ? hashtags.community : getFallbackCommunityHashtags(),
        trending: hashtags.trending.length > 0 ? hashtags.trending : getFallbackTrendingHashtags()
      }
    });

  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error generating caption:", error);

    // Return fallback content on error
    return NextResponse.json({
      captions: getFallbackCaptions("Hand-Dyed Wool", "Hand-Dyed Wool", "Natural"),
      hashtags: {
        brand: getFallbackBrandHashtags(),
        product: getFallbackProductHashtags(),
        community: getFallbackCommunityHashtags(),
        trending: getFallbackTrendingHashtags()
      }
    }, { status: 200 }); // Return 200 with fallback instead of error
  }
}

// Fallback caption generators
function getFallbackCaptions(title: string, product: string, color: string): string[] {
  return [
    `✨ ${title} - Explore our beautiful ${color} ${product}. Link in bio to shop! 🧶`,
    `Behind the scenes: Creating ${color} magic with natural dyes. Each skein is one-of-a-kind. 💚`,
    `New in the shop: ${product} in stunning ${color}. Perfect for your next project! 🍂`
  ];
}

function getFallbackBrandHashtags(): string[] {
  return [
    "#herbariumdyeworks",
    "#herbariumwool",
    "#artisanwool",
    "#naturaldyedwool",
    "#slowfashionwool"
  ];
}

function getFallbackProductHashtags(): string[] {
  return [
    "#handdyedwool",
    "#handdyedyarn",
    "#indiededyarn",
    "#naturaldye",
    "#woollove",
    "#yarnlove"
  ];
}

function getFallbackCommunityHashtags(): string[] {
  return [
    "#knittersofinstagram",
    "#crochetersofinstagram",
    "#fiberarts",
    "#yarnaddicts",
    "#knitlove",
    "#yarnstash"
  ];
}

function getFallbackTrendingHashtags(): string[] {
  return [
    "#slowfashion",
    "#sustainablefashion",
    "#handmade",
    "#shopsmall",
    "#supportlocal",
    "#makersgonnamake"
  ];
}
