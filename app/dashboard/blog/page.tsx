"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "review" | "published";
  metaDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog");
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts || []);
      } else {
        showToast(data.error || "Failed to load posts", "error");
      }
    } catch {
      showToast("Failed to load posts", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (response.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        showToast("Post deleted");
      } else {
        const data = await response.json();
        showToast(data.error || "Failed to delete", "error");
      }
    } catch {
      showToast("Failed to delete post", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

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
                {isLoading ? "-" : posts.length}
              </div>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                {publishedCount} published, {draftCount} draft
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Published</CardTitle>
                <Calendar size={20} style={{ color: "var(--weld)" }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                {isLoading ? "-" : publishedCount}
              </div>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                Live on your blog
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
                {isLoading ? "-" : draftCount}
              </div>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                {draftCount > 0 ? "Needs attention" : "All caught up"}
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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--text-muted)" }} />
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
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
                                : post.status === "review"
                                ? "var(--warning-light)"
                                : "var(--card-bg)",
                            color:
                              post.status === "published"
                                ? "var(--success)"
                                : post.status === "review"
                                ? "var(--warning)"
                                : "var(--text-muted)",
                          }}
                        >
                          {post.status}
                        </span>
                      </div>
                      {post.metaDescription && (
                        <p
                          className="text-sm mb-2"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {post.metaDescription}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                        <span>Created {new Date(post.createdAt).toLocaleDateString()}</span>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                      >
                        {deletingId === post.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} style={{ color: "var(--danger)" }} />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}

                {posts.length === 0 && (
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
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
