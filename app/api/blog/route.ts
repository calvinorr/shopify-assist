import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";
import { requireAuth } from "@/lib/auth";
import { validateRequest, createBlogPostSchema } from "@/lib/validations";

// GET /api/blog - List all blog posts
export async function GET() {
  try {
    await requireAuth();
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
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/blog - Create new blog post
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const { data, error } = await validateRequest(request, createBlogPostSchema);
    if (error) return error;

    const id = randomUUID();
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await db.insert(blogPosts).values({
      id,
      title: data.title,
      slug,
      contentHtml: data.content || "",
      metaDescription: data.excerpt || null,
      focusKeywords: data.tags ? JSON.stringify(data.tags.split(",").map((t: string) => t.trim())) : null,
      status: data.status as "draft" | "review" | "published",
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt * 1000) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ id, slug, message: "Post created successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/blog - Bulk delete blog posts
export async function DELETE(request: NextRequest) {
  try {
    await requireAuth();
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
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH /api/blog - Bulk update blog post status
export async function PATCH(request: NextRequest) {
  try {
    await requireAuth();
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
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
