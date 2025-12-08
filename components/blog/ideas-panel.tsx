"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lightbulb, RefreshCw, X, Loader2, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface BlogIdea {
  id: string;
  title: string;
  hook: string;
  keywords: string[];
  type: string;
}

interface IdeasPanelProps {
  className?: string;
}

export function IdeasPanel({ className }: IdeasPanelProps) {
  const router = useRouter();
  const [ideas, setIdeas] = useState<BlogIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startingId, setStartingId] = useState<string | null>(null);

  // Load ideas from API on mount
  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    const isRefresh = ideas.length > 0;
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      // Initial load: GET /api/blog/ideas
      // Refresh: POST /api/blog/ideas/refresh
      const endpoint = isRefresh ? "/api/blog/ideas/refresh" : "/api/blog/ideas";
      const method = isRefresh ? "POST" : "GET";

      const response = await fetch(endpoint, { method });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch ideas");
      }

      const data = await response.json();
      setIdeas(data.ideas || []);
    } catch (err) {
      console.error("Failed to fetch ideas:", err);
      setError(err instanceof Error ? err.message : "Failed to load ideas");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleStartPost = async (idea: BlogIdea) => {
    setStartingId(idea.id);
    setError(null);

    try {
      // Call scaffold API with the idea
      const response = await fetch("/api/ai/blog/scaffold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: idea.title,
          description: idea.hook,
          suggestedKeywords: idea.keywords,
          type: idea.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to scaffold blog post");
      }

      const data = await response.json();

      // Mark idea as used in the database
      await fetch(`/api/blog/ideas/${idea.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "used",
          createdPostId: data.postId,
        }),
      });

      // Remove the used idea from the list
      setIdeas((prev) => prev.filter((i) => i.id !== idea.id));

      // Navigate to the new post editor
      router.push(`/dashboard/blog/${data.postId}`);
    } catch (err) {
      console.error("Failed to start post:", err);
      setError(err instanceof Error ? err.message : "Failed to create post");
      setStartingId(null);
    }
  };

  const handleDismiss = async (ideaId: string) => {
    try {
      // Mark idea as dismissed in the database
      await fetch(`/api/blog/ideas/${ideaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "dismissed" }),
      });

      // Remove from local state
      setIdeas((prev) => prev.filter((i) => i.id !== ideaId));
    } catch (err) {
      console.error("Failed to dismiss idea:", err);
      setError(err instanceof Error ? err.message : "Failed to dismiss idea");
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <section className={className}>
        <div
          className="rounded-xl p-8"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--card-border)",
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <Loader2
              className="w-5 h-5 animate-spin"
              style={{ color: "var(--weld)" }}
            />
            <p style={{ color: "var(--text-secondary)" }}>
              Generating fresh ideas...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Empty State
  if (ideas.length === 0 && !error) {
    return (
      <section className={className}>
        <div
          className="rounded-xl p-8 text-center"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--card-border)",
          }}
        >
          <Lightbulb
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "var(--weld)" }}
          />
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            No ideas yet
          </h3>
          <p className="mb-6" style={{ color: "var(--text-muted)" }}>
            Generate AI-powered blog ideas based on your Shopify products
          </p>
          <div className="flex flex-col items-center gap-3">
            <Button variant="primary" size="md" onClick={fetchIdeas}>
              <Lightbulb className="w-4 h-4 mr-2" />
              Generate Ideas
            </Button>
            <Link
              href="/dashboard/blog/new"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
              style={{ color: "var(--text-muted)" }}
            >
              <FileText className="w-4 h-4" />
              Or start with a blank post
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={className}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="rounded-lg p-2"
            style={{ backgroundColor: "var(--weld-light)" }}
          >
            <Lightbulb className="w-5 h-5" style={{ color: "var(--weld)" }} />
          </div>
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Fresh Ideas
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchIdeas}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Generating..." : "Refresh"}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mb-6 p-4 rounded-lg text-sm"
          style={{
            backgroundColor: "var(--danger-light, #fee2e2)",
            color: "var(--danger, #dc2626)",
            border: "1px solid var(--danger, #dc2626)",
          }}
        >
          {error}
        </div>
      )}

      {/* Ideas Grid - 3 cards with uniform height */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ideas.slice(0, 3).map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onStart={handleStartPost}
            onDismiss={handleDismiss}
            isStarting={startingId === idea.id}
          />
        ))}
      </div>

      {/* Start from scratch option */}
      <div
        className="mt-4 text-center py-3 rounded-lg"
        style={{ backgroundColor: "var(--background)" }}
      >
        <Link
          href="/dashboard/blog/new"
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
          style={{ color: "var(--text-muted)" }}
        >
          <FileText className="w-4 h-4" />
          Or start with a blank post
        </Link>
      </div>
    </section>
  );
}

interface IdeaCardProps {
  idea: BlogIdea;
  onStart: (idea: BlogIdea) => void;
  onDismiss: (id: string) => void;
  isStarting: boolean;
}

function IdeaCard({ idea, onStart, onDismiss, isStarting }: IdeaCardProps) {
  return (
    <div
      className="relative flex flex-col h-[280px] rounded-xl p-4 transition-all duration-200 hover:shadow-lg"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    >
      {/* Dismiss Button */}
      <button
        onClick={() => onDismiss(idea.id)}
        className="absolute top-3 right-3 rounded-full p-1 transition-colors"
        style={{
          color: "var(--text-muted)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--background)";
          e.currentTarget.style.color = "var(--text-primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "var(--text-muted)";
        }}
        aria-label="Dismiss idea"
        disabled={isStarting}
      >
        <X className="w-4 h-4" />
      </button>

      {/* Type Badge */}
      <span
        className="inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide self-start"
        style={{
          backgroundColor: "var(--indigo-light)",
          color: "var(--indigo)",
        }}
      >
        {idea.type}
      </span>

      {/* Title - 2 lines max */}
      <h3
        className="text-lg font-semibold line-clamp-2 mt-2 pr-6"
        style={{ color: "var(--text-primary)" }}
      >
        {idea.title}
      </h3>

      {/* Hook - 2 lines max, flex-1 to fill space */}
      <p
        className="text-sm line-clamp-2 mt-1 flex-1"
        style={{ color: "var(--text-secondary)" }}
      >
        {idea.hook}
      </p>

      {/* Keywords + Button pinned to bottom */}
      <div className="mt-auto pt-3 space-y-3">
        <div className="flex flex-wrap gap-1">
          {idea.keywords.slice(0, 3).map((keyword, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: "var(--weld-light)",
                color: "var(--walnut)",
              }}
            >
              {keyword}
            </span>
          ))}
        </div>
        <Button
          onClick={() => onStart(idea)}
          size="md"
          className="w-full"
          disabled={isStarting}
          style={{
            backgroundColor: isStarting ? "#9ca3af" : "var(--madder)",
            color: "white",
          }}
          onMouseEnter={(e) => {
            if (!isStarting) {
              e.currentTarget.style.backgroundColor = "#a14d2d";
            }
          }}
          onMouseLeave={(e) => {
            if (!isStarting) {
              e.currentTarget.style.backgroundColor = "var(--madder)";
            }
          }}
        >
          {isStarting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Draft...
            </>
          ) : (
            <>
              Start This Post
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
