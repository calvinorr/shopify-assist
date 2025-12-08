import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts, blogIdeas } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { validateRequest, updateBlogPostSchema } from "@/lib/validations";

// GET /api/blog/[id] - Get single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const posts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    if (posts.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = posts[0];
    return NextResponse.json({
      ...post,
      focusKeywords: post.focusKeywords ? JSON.parse(post.focusKeywords) : [],
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/blog/[id] - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const { data, error } = await validateRequest(request, updateBlogPostSchema);
    if (error) return error;

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) {
      updateData.title = data.title;
      updateData.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    if (data.content !== undefined) updateData.contentHtml = data.content;
    if (data.excerpt !== undefined) updateData.metaDescription = data.excerpt;
    if (data.tags !== undefined) {
      updateData.focusKeywords = JSON.stringify(
        data.tags.split(",").map((t: string) => t.trim())
      );
    }
    if (data.status !== undefined) updateData.status = data.status;
    if (data.scheduledAt !== undefined) {
      updateData.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt * 1000) : null;
    }

    await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id));

    return NextResponse.json({ message: "Post updated successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/blog/[id] - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    // First, clear any foreign key references from blogIdeas
    await db
      .update(blogIdeas)
      .set({ createdPostId: null })
      .where(eq(blogIdeas.createdPostId, id));

    // Now delete the blog post
    await db.delete(blogPosts).where(eq(blogPosts.id, id));

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
