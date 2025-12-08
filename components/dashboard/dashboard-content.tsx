"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Sparkles, FileText, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { IdeaCard } from "./idea-card";
import { HeaderStats } from "./header-stats";
import { useToast } from "@/components/ui/toast";

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

export function DashboardContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const [blogIdeas, setBlogIdeas] = useState<BlogIdea[]>([]);
  const [instagramIdeas, setInstagramIdeas] = useState<InstagramIdea[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startingBlogIndex, setStartingBlogIndex] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      const [suggestionsRes, blogRes] = await Promise.all([
        fetch("/api/ai/suggestions"),
        fetch("/api/blog"),
      ]);

      if (suggestionsRes.ok) {
        const data = await suggestionsRes.json();
        setBlogIdeas(data.blog || []);
        setInstagramIdeas(data.instagram || []);
      }

      if (blogRes.ok) {
        const blogData = await blogRes.json();
        setPosts(blogData.posts || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  // Compute content stats
  const drafts = posts.filter((p) => p.status === "draft");
  const scheduled = posts.filter(
    (p) => p.scheduledAt && new Date(p.scheduledAt) > new Date()
  );
  const published = posts.filter((p) => p.status === "published");

  // Get dates
  const nextScheduled = scheduled
    .map((p) => p.scheduledAt)
    .filter(Boolean)
    .sort()[0];

  const lastPublished = published
    .map((p) => p.publishedAt)
    .filter(Boolean)
    .sort()
    .reverse()[0];

  // Most recent draft
  const mostRecentDraft = drafts.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )[0];

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

function SkeletonCard() {
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
}

function EmptyState({
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
}
