import { NextRequest, NextResponse } from "next/server";
import { refineCaption } from "@/lib/gemini";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
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
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Caption refinement error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
