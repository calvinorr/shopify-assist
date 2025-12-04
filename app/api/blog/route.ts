import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
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
    const { title, content, excerpt, tags, status = "draft" } = body;

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
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ id, slug, message: "Post created successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
