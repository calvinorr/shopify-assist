"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, RefreshCw, X, Loader2, ArrowRight } from "lucide-react";
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

const STORAGE_KEY = "shopify-assist-blog-ideas";

export function IdeasPanel({ className }: IdeasPanelProps) {
  const router = useRouter();
  const [ideas, setIdeas] = useState<BlogIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startingId, setStartingId] = useState<string | null>(null);

  // Load ideas from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setIdeas(parsed);
      } catch (err) {
        console.error("Failed to parse stored ideas:", err);
      }
    } else {
      // If no cached ideas, auto-fetch on mount
      fetchIdeas();
    }
  }, []);

  // Save ideas to localStorage whenever they change
  useEffect(() => {
    if (ideas.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [ideas]);

  const fetchIdeas = async () => {
    const isRefresh = ideas.length > 0;
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await fetch("/api/blog/ideas");

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

  const handleDismiss = (ideaId: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== ideaId));
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
          <Button variant="primary" size="md" onClick={fetchIdeas}>
            <Lightbulb className="w-4 h-4 mr-2" />
            Generate Ideas
          </Button>
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

      {/* Ideas Grid - 2 columns on mobile, horizontal scroll on larger screens */}
      <div className="grid grid-cols-2 md:flex md:overflow-x-auto gap-4 pb-2">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onStart={handleStartPost}
            onDismiss={handleDismiss}
            isStarting={startingId === idea.id}
          />
        ))}
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
      className="relative rounded-xl p-5 transition-all duration-200 hover:shadow-lg flex-shrink-0 w-full md:w-80"
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
      <div className="mb-3">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide"
          style={{
            backgroundColor: "var(--indigo-light)",
            color: "var(--indigo)",
          }}
        >
          {idea.type}
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-lg font-bold mb-2 leading-tight pr-6"
        style={{ color: "var(--text-primary)" }}
      >
        {idea.title}
      </h3>

      {/* Hook */}
      <p
        className="text-sm mb-4 leading-relaxed line-clamp-2"
        style={{ color: "var(--text-secondary)" }}
      >
        {idea.hook}
      </p>

      {/* Keywords */}
      <div className="flex flex-wrap gap-2 mb-4">
        {idea.keywords.slice(0, 3).map((keyword, index) => (
          <span
            key={index}
            className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "var(--weld-light)",
              color: "var(--walnut)",
            }}
          >
            {keyword}
          </span>
        ))}
        {idea.keywords.length > 3 && (
          <span
            className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--text-muted)",
            }}
          >
            +{idea.keywords.length - 3}
          </span>
        )}
      </div>

      {/* Start Button */}
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
  );
}
