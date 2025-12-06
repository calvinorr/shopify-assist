import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { instagramPosts } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { requireAuth } from "@/lib/auth";

// GET /api/instagram/posts - List all posts
export async function GET() {
  try {
    await requireAuth();
    const posts = await db
      .select()
      .from(instagramPosts)
      .orderBy(desc(instagramPosts.createdAt));

    // Parse JSON fields
    const parsed = posts.map((p) => ({
      ...p,
      imageUrls: p.imageUrls ? JSON.parse(p.imageUrls) : [],
      hashtags: p.hashtags ? JSON.parse(p.hashtags) : [],
    }));

    return NextResponse.json({ posts: parsed });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/instagram/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const { caption, hashtags, imageUrls, productId, status = "draft", scheduledTime } = body;

    const id = randomUUID();

    await db.insert(instagramPosts).values({
      id,
      caption: caption || "",
      hashtags: hashtags ? JSON.stringify(hashtags) : null,
      imageUrls: imageUrls ? JSON.stringify(imageUrls) : null,
      shopifyProductId: productId || null,
      status: status as "draft" | "scheduled" | "posted" | "failed",
      scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ id, message: "Post created successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
