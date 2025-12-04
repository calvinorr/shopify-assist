"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IdeasPanel } from "@/components/blog/ideas-panel";
import { ContentCalendar } from "@/components/blog/content-calendar";
import {
  Plus,
  FileText,
  Calendar,
  Trash2,
  Loader2,
  Search,
  LayoutList,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "review" | "published";
  metaDescription: string | null;
  focusKeywords: string | null; // JSON array
  contentHtml: string | null;
  publishedAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

type StatusFilter = "all" | "draft" | "review" | "published" | "scheduled" | "needs_attention";
type SortOption = "date_created" | "date_updated" | "title" | "scheduled_date";
type ViewMode = "list" | "calendar";

export default function BlogPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter and sort state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("date_updated");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Bulk actions state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

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

  // Bulk actions handlers
  const handleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedPosts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedPosts.map(p => p.id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    const confirmMessage = `Delete ${selectedIds.size} post${selectedIds.size > 1 ? 's' : ''}? This cannot be undone.`;
    if (!confirm(confirmMessage)) return;

    setIsBulkProcessing(true);
    try {
      const response = await fetch("/api/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) })
      });

      if (response.ok) {
        const data = await response.json();
        setPosts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
        setSelectedIds(new Set());
        showToast(data.message);
      } else {
        const data = await response.json();
        showToast(data.error || "Failed to delete posts", "error");
      }
    } catch {
      showToast("Failed to delete posts", "error");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkStatusChange = async (status: "draft" | "review" | "published") => {
    if (selectedIds.size === 0) return;

    setIsBulkProcessing(true);
    try {
      const response = await fetch("/api/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds), status })
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state
        setPosts((prev) => prev.map((p) =>
          selectedIds.has(p.id) ? { ...p, status, updatedAt: new Date().toISOString() } : p
        ));
        setSelectedIds(new Set());
        showToast(data.message);
      } else {
        const data = await response.json();
        showToast(data.error || "Failed to update posts", "error");
      }
    } catch {
      showToast("Failed to update posts", "error");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // Calculate SEO score
  const calculateSEOScore = (post: BlogPost): number => {
    let score = 0;

    // Has meta description (+20)
    if (post.metaDescription) {
      score += 20;
      // Meta is 150-160 chars (+10)
      const metaLength = post.metaDescription.length;
      if (metaLength >= 150 && metaLength <= 160) {
        score += 10;
      }
    }

    // Has focus keyword (+20)
    if (post.focusKeywords) {
      try {
        const keywords = JSON.parse(post.focusKeywords);
        if (keywords && keywords.length > 0) {
          score += 20;
          // Title includes keyword (+20)
          const firstKeyword = keywords[0]?.toLowerCase();
          if (firstKeyword && post.title.toLowerCase().includes(firstKeyword)) {
            score += 20;
          }
        }
      } catch {
        // Invalid JSON, skip
      }
    }

    // Content length > 500 words (+15)
    if (post.contentHtml) {
      const textContent = post.contentHtml.replace(/<[^>]*>/g, " ");
      const wordCount = textContent.split(/\s+/).filter(Boolean).length;
      if (wordCount > 500) {
        score += 15;
      }
    }

    // Has at least one link in content (+15)
    if (post.contentHtml && post.contentHtml.includes("<a ")) {
      score += 15;
    }

    return Math.min(score, 100);
  };

  // Get SEO badge color
  const getSEOBadgeColor = (score: number) => {
    if (score < 50) return "var(--danger)";
    if (score < 75) return "var(--warning)";
    return "var(--success)";
  };

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // Apply status filter
    if (statusFilter === "scheduled") {
      filtered = filtered.filter(
        (p) => p.scheduledAt && new Date(p.scheduledAt) > new Date()
      );
    } else if (statusFilter === "needs_attention") {
      filtered = filtered.filter((p) => calculateSEOScore(p) < 50);
    } else if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "date_created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "date_updated":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        case "scheduled_date":
          const aDate = a.scheduledAt ? new Date(a.scheduledAt).getTime() : 0;
          const bDate = b.scheduledAt ? new Date(b.scheduledAt).getTime() : 0;
          return bDate - aDate;
        default:
          return 0;
      }
    });

    return sorted;
  }, [posts, statusFilter, searchQuery, sortOption]);

  // Calculate scheduled date countdown
  const getScheduledCountdown = (scheduledAt: string | null) => {
    if (!scheduledAt) return null;
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    if (scheduled <= now) return null;

    const diffMs = scheduled.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    return `On ${scheduled.toLocaleDateString()}`;
  };

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;
  const scheduledCount = posts.filter(
    (p) => p.scheduledAt && new Date(p.scheduledAt) > new Date()
  ).length;

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
        {/* AI Ideas Panel */}
        <IdeasPanel />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Scheduled</CardTitle>
                <Clock size={20} style={{ color: "var(--indigo)" }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                {isLoading ? "-" : scheduledCount}
              </div>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                {scheduledCount > 0 ? "Ready to publish" : "No scheduled posts"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter and View Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* Left: Select All + Status Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                {/* Select All Checkbox */}
                {filteredAndSortedPosts.length > 0 && (
                  <label className="flex items-center gap-2 px-3 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredAndSortedPosts.length && filteredAndSortedPosts.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 cursor-pointer"
                      style={{ accentColor: "var(--indigo)" }}
                    />
                    <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                      {selectedIds.size > 0 ? `${selectedIds.size} selected` : "Select All"}
                    </span>
                  </label>
                )}

                {/* Divider */}
                {filteredAndSortedPosts.length > 0 && (
                  <div className="h-8 w-px" style={{ backgroundColor: "var(--card-border)" }} />
                )}

                {(["all", "draft", "review", "published", "scheduled", "needs_attention"] as StatusFilter[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: statusFilter === filter ? "var(--text-primary)" : "transparent",
                      color: statusFilter === filter ? "var(--card-bg)" : "var(--text-secondary)",
                      border: `1px solid ${statusFilter === filter ? "var(--text-primary)" : "var(--card-border)"}`,
                    }}
                  >
                    {filter === "needs_attention" ? "Needs Attention" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              {/* Right: Search, Sort, and View */}
              <div className="flex gap-3 w-full md:w-auto">
                {/* Search */}
                <div className="relative flex-1 md:w-64">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="px-3 py-2 rounded-lg text-sm border"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--text-primary)",
                    borderColor: "var(--card-border)",
                  }}
                >
                  <option value="date_updated">Recently Updated</option>
                  <option value="date_created">Recently Created</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="scheduled_date">Scheduled Date</option>
                </select>

                {/* View Toggle */}
                <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: "var(--background)" }}>
                  <button
                    onClick={() => setViewMode("list")}
                    className="p-2 rounded transition-all"
                    style={{
                      backgroundColor: viewMode === "list" ? "var(--card-bg)" : "transparent",
                      color: viewMode === "list" ? "var(--text-primary)" : "var(--text-muted)",
                    }}
                    title="List View"
                  >
                    <LayoutList size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("calendar")}
                    className="p-2 rounded transition-all"
                    style={{
                      backgroundColor: viewMode === "calendar" ? "var(--card-bg)" : "transparent",
                      color: viewMode === "calendar" ? "var(--text-primary)" : "var(--text-muted)",
                    }}
                    title="Calendar View"
                  >
                    <CalendarDays size={18} />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions Bar */}
        {selectedIds.size > 0 && (
          <Card
            className="sticky top-20 z-10"
            style={{
              backgroundColor: "var(--indigo-light)",
              borderColor: "var(--indigo)",
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="font-semibold" style={{ color: "var(--indigo)" }}>
                    {selectedIds.size} post{selectedIds.size > 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={clearSelection}
                    className="text-sm underline hover:no-underline"
                    style={{ color: "var(--indigo)" }}
                  >
                    Clear Selection
                  </button>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusChange("draft")}
                    disabled={isBulkProcessing}
                  >
                    {isBulkProcessing ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                    Mark as Draft
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusChange("review")}
                    disabled={isBulkProcessing}
                  >
                    {isBulkProcessing ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                    Mark as Review
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusChange("published")}
                    disabled={isBulkProcessing}
                  >
                    {isBulkProcessing ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                    Mark as Published
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={isBulkProcessing}
                    style={{ color: "var(--danger)" }}
                  >
                    {isBulkProcessing ? (
                      <Loader2 size={16} className="animate-spin mr-2" />
                    ) : (
                      <Trash2 size={16} className="mr-2" />
                    )}
                    Delete Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts List or Calendar View */}
        {viewMode === "calendar" ? (
          <Card>
            <CardContent className="p-6">
              <ContentCalendar
                posts={filteredAndSortedPosts}
                onCreatePost={(date) => {
                  router.push(`/dashboard/blog/new?date=${date.toISOString()}`);
                }}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {statusFilter === "all" ? "All Posts" : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Posts`}
                  </CardTitle>
                  <CardDescription>
                    Showing {filteredAndSortedPosts.length} of {posts.length} posts
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--text-muted)" }} />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAndSortedPosts.map((post) => {
                    const seoScore = calculateSEOScore(post);
                    const scheduledCountdown = getScheduledCountdown(post.scheduledAt);

                    return (
                      <div
                        key={post.id}
                        className="flex items-start gap-3 p-4 rounded-lg border transition-all hover:shadow-md"
                        style={{
                          borderColor: selectedIds.has(post.id) ? "var(--indigo)" : "var(--card-border)",
                          backgroundColor: selectedIds.has(post.id) ? "var(--indigo-light)" : "var(--background)",
                        }}
                      >
                        {/* Checkbox */}
                        <div className="flex items-start pt-1">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(post.id)}
                            onChange={() => handleToggleSelect(post.id)}
                            className="w-4 h-4 cursor-pointer"
                            style={{ accentColor: "var(--indigo)" }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3
                              className="font-semibold text-lg"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {post.title}
                            </h3>

                            {/* Status Badge */}
                            <span
                              className="px-2 py-0.5 text-xs rounded-full font-medium"
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

                            {/* SEO Score Badge */}
                            <div
                              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${getSEOBadgeColor(seoScore)}15`,
                                color: getSEOBadgeColor(seoScore),
                              }}
                              title={`SEO Score: ${seoScore}/100`}
                            >
                              {seoScore < 50 ? (
                                <AlertCircle size={12} />
                              ) : (
                                <CheckCircle2 size={12} />
                              )}
                              SEO {seoScore}
                            </div>
                          </div>

                          {post.metaDescription && (
                            <p
                              className="text-sm mb-2 line-clamp-2"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {post.metaDescription}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: "var(--text-muted)" }}>
                            <span>Created {new Date(post.createdAt).toLocaleDateString()}</span>
                            {post.publishedAt && (
                              <span>Published {new Date(post.publishedAt).toLocaleDateString()}</span>
                            )}
                            {scheduledCountdown && (
                              <span
                                className="flex items-center gap-1 px-2 py-0.5 rounded-full font-medium"
                                style={{
                                  backgroundColor: "var(--indigo-light)",
                                  color: "var(--indigo)",
                                }}
                              >
                                <Clock size={12} />
                                {scheduledCountdown}
                              </span>
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
                    );
                  })}

                  {filteredAndSortedPosts.length === 0 && posts.length > 0 && (
                    <div className="text-center py-12">
                      <Search
                        size={48}
                        className="mx-auto mb-4 opacity-50"
                        style={{ color: "var(--text-muted)" }}
                      />
                      <h3
                        className="text-lg font-semibold mb-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        No posts match your filters
                      </h3>
                      <p className="mb-4" style={{ color: "var(--text-muted)" }}>
                        Try adjusting your search or filter criteria
                      </p>
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => {
                          setStatusFilter("all");
                          setSearchQuery("");
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}

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
        )}
      </div>
    </>
  );
}
