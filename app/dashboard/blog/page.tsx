"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar } from "lucide-react";
import Link from "next/link";

// Mock blog posts data - will be replaced with real data later
const mockPosts = [
  {
    id: "1",
    title: "Understanding Natural Dye Colors: A Guide to Madder",
    excerpt: "Explore the rich terracotta tones of madder root and how it creates beautiful reds and pinks in hand-dyed wool...",
    status: "published",
    publishedAt: "2024-11-28",
    author: "Admin"
  },
  {
    id: "2",
    title: "Seasonal Wool Care Tips for Winter",
    excerpt: "Keep your hand-dyed woolens looking vibrant through the winter months with these simple care tips...",
    status: "draft",
    publishedAt: null,
    author: "Admin"
  }
];

export default function BlogPage() {
  return (
    <>
      <Header
        title="Blog Posts"
        description="Manage your blog content and drafts"
      >
        <Link href="/dashboard/blog/new">
          <Button variant="primary" size="md">
            <Plus size={18} className="mr-2" />
            New Post
          </Button>
        </Link>
      </Header>

      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Total Posts</CardTitle>
                <FileText size={20} style={{ color: "var(--indigo)" }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                2
              </div>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                1 published, 1 draft
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>This Month</CardTitle>
                <Calendar size={20} style={{ color: "var(--weld)" }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                1
              </div>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                Published in Nov
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Drafts</CardTitle>
                <FileText size={20} style={{ color: "var(--text-muted)" }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                1
              </div>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                Needs attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Your latest blog posts and drafts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start justify-between p-4 rounded-lg border"
                  style={{
                    borderColor: "var(--card-border)",
                    backgroundColor: "var(--background)",
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3
                        className="font-semibold text-lg"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {post.title}
                      </h3>
                      <span
                        className="px-2 py-0.5 text-xs rounded-full"
                        style={{
                          backgroundColor:
                            post.status === "published"
                              ? "var(--success-light)"
                              : "var(--warning-light)",
                          color:
                            post.status === "published"
                              ? "var(--success)"
                              : "var(--warning)",
                        }}
                      >
                        {post.status}
                      </span>
                    </div>
                    <p
                      className="text-sm mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span>By {post.author}</span>
                      {post.publishedAt && (
                        <span>Published {new Date(post.publishedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link href={`/dashboard/blog/${post.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}

              {mockPosts.length === 0 && (
                <div className="text-center py-12">
                  <FileText
                    size={48}
                    className="mx-auto mb-4"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    No blog posts yet
                  </h3>
                  <p className="mb-4" style={{ color: "var(--text-muted)" }}>
                    Create your first blog post to get started
                  </p>
                  <Link href="/dashboard/blog/new">
                    <Button variant="primary" size="md">
                      <Plus size={18} className="mr-2" />
                      Create Post
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
