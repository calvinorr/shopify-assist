import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";

// GET /api/blog - List all blog posts
export async function GET() {
  try {
    const posts = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        status: blogPosts.status,
        metaDescription: blogPosts.metaDescription,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
      })
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));

    return NextResponse.json({ posts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/blog - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, tags, status = "draft", scheduledAt } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const id = randomUUID();
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await db.insert(blogPosts).values({
      id,
      title,
      slug,
      contentHtml: content,
      metaDescription: excerpt || null,
      focusKeywords: tags ? JSON.stringify(tags.split(",").map((t: string) => t.trim())) : null,
      status: status as "draft" | "review" | "published",
      scheduledAt: scheduledAt ? new Date(scheduledAt * 1000) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ id, slug, message: "Post created successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/blog - Bulk delete blog posts
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array is required" }, { status: 400 });
    }

    await db.delete(blogPosts).where(inArray(blogPosts.id, ids));

    return NextResponse.json({
      message: `${ids.length} post${ids.length > 1 ? 's' : ''} deleted successfully`,
      count: ids.length
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH /api/blog - Bulk update blog post status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, status } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array is required" }, { status: 400 });
    }

    if (!status || !["draft", "review", "published"].includes(status)) {
      return NextResponse.json({ error: "Valid status is required (draft, review, or published)" }, { status: 400 });
    }

    await db
      .update(blogPosts)
      .set({
        status: status as "draft" | "review" | "published",
        updatedAt: new Date()
      })
      .where(inArray(blogPosts.id, ids));

    return NextResponse.json({
      message: `${ids.length} post${ids.length > 1 ? 's' : ''} updated to ${status}`,
      count: ids.length
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
