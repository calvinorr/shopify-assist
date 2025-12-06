import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts, instagramPosts } from "@/lib/schema";
import { sql } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await requireAuth();

    // Get blog posts by status
    const blogByStatus = await db
      .select({
        status: blogPosts.status,
        count: sql<number>`count(*)`,
      })
      .from(blogPosts)
      .groupBy(blogPosts.status);

    // Get Instagram posts by status
    const instagramByStatus = await db
      .select({
        status: instagramPosts.status,
        count: sql<number>`count(*)`,
      })
      .from(instagramPosts)
      .groupBy(instagramPosts.status);

    // Get recent blog activity (last 10 posts created)
    const recentBlogPosts = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        status: blogPosts.status,
        createdAt: blogPosts.createdAt,
        publishedAt: blogPosts.publishedAt,
        scheduledAt: blogPosts.scheduledAt,
      })
      .from(blogPosts)
      .orderBy(sql`${blogPosts.createdAt} desc`)
      .limit(10);

    // Get recent Instagram activity (last 10 posts created)
    const recentInstagramPosts = await db
      .select({
        id: instagramPosts.id,
        caption: instagramPosts.caption,
        status: instagramPosts.status,
        createdAt: instagramPosts.createdAt,
        scheduledTime: instagramPosts.scheduledTime,
        postedTime: instagramPosts.postedTime,
        imageUrls: instagramPosts.imageUrls,
      })
      .from(instagramPosts)
      .orderBy(sql`${instagramPosts.createdAt} desc`)
      .limit(10);

    // Parse image URLs and create recent activity feed
    const recentInstagramWithImages = recentInstagramPosts.map((p) => ({
      ...p,
      imageUrls: p.imageUrls ? JSON.parse(p.imageUrls) : [],
    }));

    // Combine and sort recent activity
    const recentActivity = [
      ...recentBlogPosts.map((post) => ({
        type: "blog" as const,
        id: post.id,
        title: post.title,
        status: post.status,
        createdAt: post.createdAt,
        publishedAt: post.publishedAt,
        scheduledAt: post.scheduledAt,
      })),
      ...recentInstagramWithImages.map((post) => ({
        type: "instagram" as const,
        id: post.id,
        caption: post.caption,
        status: post.status,
        createdAt: post.createdAt,
        scheduledTime: post.scheduledTime,
        postedTime: post.postedTime,
        imageUrls: post.imageUrls,
      })),
    ]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 10);

    return NextResponse.json({
      blogPostsByStatus: blogByStatus,
      instagramPostsByStatus: instagramByStatus,
      recentActivity,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch content analytics", message },
      { status: 500 }
    );
  }
}
