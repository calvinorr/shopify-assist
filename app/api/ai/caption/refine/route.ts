import { NextRequest, NextResponse } from "next/server";
import { refineCaption } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { caption, productName, productColor, productDescription } = body;

    if (!caption || !productName) {
      return NextResponse.json(
        { error: "Caption and product name are required" },
        { status: 400 }
      );
    }

    const refinedCaption = await refineCaption(
      caption,
      productName,
      productColor,
      productDescription
    );

    return NextResponse.json({ caption: refinedCaption });
  } catch (error) {
    console.error("Caption refinement error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
