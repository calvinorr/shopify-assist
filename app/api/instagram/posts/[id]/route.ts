import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { instagramPosts } from "@/lib/schema";
import { eq } from "drizzle-orm";

// GET /api/instagram/posts/[id] - Get single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [post] = await db
      .select()
      .from(instagramPosts)
      .where(eq(instagramPosts.id, id));

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...post,
      imageUrls: post.imageUrls ? JSON.parse(post.imageUrls) : [],
      hashtags: post.hashtags ? JSON.parse(post.hashtags) : [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH /api/instagram/posts/[id] - Update post
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { caption, hashtags, imageUrls, productId, status, scheduledTime } = body;

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (caption !== undefined) updateData.caption = caption;
    if (hashtags !== undefined) updateData.hashtags = JSON.stringify(hashtags);
    if (imageUrls !== undefined) updateData.imageUrls = JSON.stringify(imageUrls);
    if (productId !== undefined) updateData.shopifyProductId = productId;
    if (status !== undefined) updateData.status = status;
    if (scheduledTime !== undefined) {
      updateData.scheduledTime = scheduledTime ? new Date(scheduledTime) : null;
    }

    await db
      .update(instagramPosts)
      .set(updateData)
      .where(eq(instagramPosts.id, id));

    return NextResponse.json({ message: "Post updated successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/instagram/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.delete(instagramPosts).where(eq(instagramPosts.id, id));

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
