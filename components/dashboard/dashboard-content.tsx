"use client";

import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Sparkles, FileText, Instagram, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { IdeaCard } from "./idea-card";
import { HeaderStats } from "./header-stats";
import { useToast } from "@/components/ui/toast";
import { BlogPerformanceCard } from "@/components/blog";

interface BlogIdea {
  title: string;
  description: string;
  reasoning: string;
  suggestedKeywords: string[];
}

interface InstagramIdea {
  title: string;
  description: string;
  reasoning: string;
}

interface BlogPost {
  id: string;
  title: string;
  updatedAt: string;
  status: string;
  scheduledAt?: string | null;
  publishedAt?: string | null;
}

interface TopPerformingPost {
  id: string;
  title: string;
  slug: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  trend?: number;
}

export function DashboardContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const [blogIdeas, setBlogIdeas] = useState<BlogIdea[]>([]);
  const [instagramIdeas, setInstagramIdeas] = useState<InstagramIdea[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [topPerformingPosts, setTopPerformingPosts] = useState<TopPerformingPost[]>([]);
  const [isGscConnected, setIsGscConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPerformance, setIsLoadingPerformance] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startingBlogIndex, setStartingBlogIndex] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Use allSettled so one failure doesn't break everything
      const results = await Promise.allSettled([
        fetch("/api/ai/suggestions"),
        fetch("/api/blog"),
      ]);

      // Handle suggestions result
      if (results[0].status === "fulfilled" && results[0].value.ok) {
        const data = await results[0].value.json();
        setBlogIdeas(data.blog || []);
        setInstagramIdeas(data.instagram || []);
      } else if (results[0].status === "rejected") {
        console.error("Failed to fetch suggestions:", results[0].reason);
      }

      // Handle blog posts result
      if (results[1].status === "fulfilled" && results[1].value.ok) {
        const blogData = await results[1].value.json();
        setPosts(blogData.posts || []);
      } else if (results[1].status === "rejected") {
        console.error("Failed to fetch blog posts:", results[1].reason);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      showToast("Failed to load dashboard data", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const fetchPerformanceData = useCallback(async () => {
    try {
      setIsLoadingPerformance(true);
      const response = await fetch("/api/analytics/blog-performance");

      if (response.status === 403) {
        // GSC not connected
        setIsGscConnected(false);
        setTopPerformingPosts([]);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setIsGscConnected(true);
        setTopPerformingPosts(data.topPerformers || []);
      } else {
        console.error("Failed to fetch performance data");
        setIsGscConnected(false);
      }
    } catch (error) {
      console.error("Failed to fetch performance data:", error);
      setIsGscConnected(false);
    } finally {
      setIsLoadingPerformance(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchPerformanceData();
  }, [fetchData, fetchPerformanceData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/ai/suggestions", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setBlogIdeas(data.blog || []);
        setInstagramIdeas(data.instagram || []);
      }
    } catch (error) {
      console.error("Failed to refresh ideas:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStartBlogPost = async (idea: BlogIdea, index: number) => {
    setStartingBlogIndex(index);
    try {
      // Call scaffold API to generate blog content
      const response = await fetch("/api/ai/blog/scaffold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: idea.title,
          description: idea.description,
          suggestedKeywords: idea.suggestedKeywords,
          type: "blog",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to scaffold blog post");
      }

      const data = await response.json();

      // Remove the used idea from the list
      setBlogIdeas((prev) => prev.filter((_, i) => i !== index));

      // Navigate to the new post editor
      router.push(`/dashboard/blog/${data.postId}`);
    } catch (error) {
      console.error("Failed to start blog post:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to create blog post",
        "error"
      );
      setStartingBlogIndex(null);
    }
  };

  // Memoized content stats to avoid recalculating on every render
  const { drafts, scheduled, published } = useMemo(() => {
    const now = new Date();
    return {
      drafts: posts.filter((p) => p.status === "draft"),
      scheduled: posts.filter(
        (p) => p.scheduledAt && new Date(p.scheduledAt) > now
      ),
      published: posts.filter((p) => p.status === "published"),
    };
  }, [posts]);

  // Memoized dates
  const nextScheduled = useMemo(
    () =>
      scheduled
        .map((p) => p.scheduledAt)
        .filter(Boolean)
        .sort()[0],
    [scheduled]
  );

  const lastPublished = useMemo(
    () =>
      published
        .map((p) => p.publishedAt)
        .filter(Boolean)
        .sort()
        .reverse()[0],
    [published]
  );

  // Helper to build URL with query params
  const buildBlogUrl = (idea: BlogIdea) => {
    const params = new URLSearchParams();
    params.set("title", idea.title);
    params.set("description", idea.description);
    if (idea.suggestedKeywords?.length) {
      params.set("keywords", idea.suggestedKeywords.join(","));
    }
    return `/dashboard/blog/new?${params.toString()}`;
  };

  const buildInstagramUrl = (idea: InstagramIdea) => {
    const params = new URLSearchParams();
    params.set("newPost", "true");
    params.set("title", idea.title);
    params.set("description", idea.description);
    return `/dashboard/instagram?${params.toString()}`;
  };

  const hasIdeas = blogIdeas.length > 0 || instagramIdeas.length > 0;

  return (
    <>
      {/* Header with Content Stats */}
      <Header title="Dashboard">
        <HeaderStats
          draftCount={drafts.length}
          nextScheduledDate={nextScheduled}
          lastPublishedDate={lastPublished}
          isLoading={isLoading}
        />
      </Header>

      <div
        className="p-6 space-y-8 max-w-6xl mx-auto"
        style={{ backgroundColor: "var(--background)" }}
      >
        {/* Blog Ideas Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="rounded-lg p-2"
              style={{ backgroundColor: "var(--indigo-light)" }}
            >
              <FileText className="w-5 h-5" style={{ color: "var(--indigo)" }} />
            </div>
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Blog Ideas
            </h2>
          </div>
          {hasIdeas && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Generating..." : "New Ideas"}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : blogIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {blogIdeas.slice(0, 3).map((idea, index) => (
              <IdeaCard
                key={index}
                type="blog"
                title={idea.title}
                description={idea.description}
                reasoning={idea.reasoning}
                keywords={idea.suggestedKeywords}
                href={buildBlogUrl(idea)}
                onStartBlog={() => handleStartBlogPost(idea, index)}
                isStarting={startingBlogIndex === index}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            type="blog"
            onGenerate={handleRefresh}
            isGenerating={isRefreshing}
          />
        )}
      </section>

      {/* Top Performing Posts Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="rounded-lg p-2"
            style={{ backgroundColor: "var(--weld-light)" }}
          >
            <TrendingUp className="w-5 h-5" style={{ color: "var(--weld)" }} />
          </div>
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Top Performing Content
          </h2>
        </div>

        {isLoadingPerformance ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl p-6" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : isGscConnected === false ? (
          <div
            className="rounded-xl p-6 text-center"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--card-border)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Connect Google Search Console in{" "}
              <button
                onClick={() => router.push("/dashboard/settings")}
                className="text-sm font-medium underline"
                style={{ color: "var(--weld)" }}
              >
                Settings
              </button>{" "}
              to see your top performing blog posts
            </p>
          </div>
        ) : topPerformingPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPerformingPosts.map((post) => (
              <BlogPerformanceCard
                key={post.id}
                post={post}
                onClick={() => router.push(`/dashboard/blog/${post.id}`)}
              />
            ))}
          </div>
        ) : (
          <div
            className="rounded-xl p-6 text-center"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--card-border)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No performance data available yet. Publish some blog posts to see insights here.
            </p>
          </div>
        )}
      </section>

      {/* Instagram Ideas Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="rounded-lg p-2"
            style={{ backgroundColor: "var(--madder-light)" }}
          >
            <Instagram className="w-5 h-5" style={{ color: "var(--madder)" }} />
          </div>
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Instagram Ideas
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : instagramIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {instagramIdeas.slice(0, 3).map((idea, index) => (
              <IdeaCard
                key={index}
                type="instagram"
                title={idea.title}
                description={idea.description}
                reasoning={idea.reasoning}
                href={buildInstagramUrl(idea)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            type="instagram"
            onGenerate={handleRefresh}
            isGenerating={isRefreshing}
          />
        )}
      </section>
      </div>
    </>
  );
}

const SkeletonCard = memo(function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-5 animate-pulse"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--card-border)",
      }}
    >
      <div className="flex justify-end mb-3">
        <div
          className="w-10 h-10 rounded-full"
          style={{ backgroundColor: "var(--background)" }}
        />
      </div>
      <div
        className="h-5 rounded mb-2"
        style={{ backgroundColor: "var(--background)", width: "80%" }}
      />
      <div className="space-y-2 mb-4">
        <div
          className="h-4 rounded"
          style={{ backgroundColor: "var(--background)", width: "100%" }}
        />
        <div
          className="h-4 rounded"
          style={{ backgroundColor: "var(--background)", width: "70%" }}
        />
      </div>
      <div
        className="h-10 rounded-lg"
        style={{ backgroundColor: "var(--background)" }}
      />
    </div>
  );
});

const PerformanceSkeletonCard = memo(function PerformanceSkeletonCard() {
  return (
    <div
      className="rounded-xl p-4 animate-pulse"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--card-border)",
      }}
    >
      {/* Header: Title & Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className="h-4 rounded flex-1"
          style={{ backgroundColor: "var(--background)", width: "70%" }}
        />
        <div
          className="h-5 w-12 rounded"
          style={{ backgroundColor: "var(--background)" }}
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg"
            style={{ backgroundColor: "var(--background)" }}
          />
          <div className="flex-1 space-y-1">
            <div
              className="h-3 rounded"
              style={{ backgroundColor: "var(--background)", width: "60%" }}
            />
            <div
              className="h-4 rounded"
              style={{ backgroundColor: "var(--background)", width: "40%" }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg"
            style={{ backgroundColor: "var(--background)" }}
          />
          <div className="flex-1 space-y-1">
            <div
              className="h-3 rounded"
              style={{ backgroundColor: "var(--background)", width: "60%" }}
            />
            <div
              className="h-4 rounded"
              style={{ backgroundColor: "var(--background)", width: "40%" }}
            />
          </div>
        </div>
      </div>

      {/* CTR & Position Row */}
      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--card-border)" }}>
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <div
              className="h-3 rounded"
              style={{ backgroundColor: "var(--background)", width: "30px" }}
            />
            <div
              className="h-4 rounded"
              style={{ backgroundColor: "var(--background)", width: "40px" }}
            />
          </div>
          <div
            className="w-px h-8"
            style={{ backgroundColor: "var(--card-border)" }}
          />
          <div className="space-y-1">
            <div
              className="h-3 rounded"
              style={{ backgroundColor: "var(--background)", width: "60px" }}
            />
            <div
              className="h-4 rounded"
              style={{ backgroundColor: "var(--background)", width: "30px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

const EmptyState = memo(function EmptyState({
  type,
  onGenerate,
  isGenerating,
}: {
  type: "blog" | "instagram";
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  const isBlog = type === "blog";

  return (
    <div
      className="rounded-xl p-8 text-center"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--card-border)",
      }}
    >
      <Sparkles
        className="w-10 h-10 mx-auto mb-3"
        style={{ color: isBlog ? "var(--indigo)" : "var(--madder)" }}
      />
      <h3
        className="text-base font-medium mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        No {isBlog ? "blog" : "Instagram"} ideas yet
      </h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
        Generate AI-powered ideas based on your products
      </p>
      <Button
        variant="primary"
        size="md"
        onClick={onGenerate}
        disabled={isGenerating}
        style={{
          backgroundColor: isBlog ? "var(--indigo)" : "var(--madder)",
        }}
      >
        <Sparkles className={`w-4 h-4 mr-2 ${isGenerating ? "animate-pulse" : ""}`} />
        {isGenerating ? "Generating..." : "Generate Ideas"}
      </Button>
    </div>
  );
});
