"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, RefreshCw, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RecommendationCard } from "./RecommendationCard";

type RecommendationType = "new_post" | "optimize" | "quick_win" | "long_tail";
type ConfidenceLevel = "high" | "medium" | "low";
type PriorityLevel = "high" | "medium" | "low";

interface ContentRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  targetKeyword: string;
  suggestedTitle?: string;
  explanation: string;
  estimatedOpportunity: number;
  confidence: ConfidenceLevel;
  priority: PriorityLevel;
  relatedQueries?: string[];
  existingPostId?: string;
}

interface RecommendationSummary {
  totalRecommendations: number;
  byType: Record<RecommendationType, number>;
  topPriority: ContentRecommendation | null;
}

interface AIInsightsData {
  recommendations: ContentRecommendation[];
  summary: RecommendationSummary;
  cachedAt: string;
  expiresAt: string;
}

export function AIInsights() {
  const router = useRouter();
  const [data, setData] = useState<AIInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGscConnected, setIsGscConnected] = useState<boolean | null>(null);

  const fetchRecommendations = useCallback(async (refresh: boolean = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const url = `/api/ai/content-suggestions${refresh ? "?refresh=true" : ""}`;
      const response = await fetch(url);

      if (response.status === 403) {
        // GSC not connected
        setIsGscConnected(false);
        setData(null);
        return;
      }

      if (response.ok) {
        const result = await response.json();
        setIsGscConnected(true);
        setData(result);
      } else {
        console.error("Failed to fetch AI recommendations");
        setIsGscConnected(false);
      }
    } catch (error) {
      console.error("Failed to fetch AI recommendations:", error);
      setIsGscConnected(false);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleRefresh = () => {
    fetchRecommendations(true);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="rounded-lg p-2"
              style={{ backgroundColor: "var(--weld-light)" }}
            >
              <Sparkles className="w-5 h-5" style={{ color: "var(--weld)" }} />
            </div>
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                AI Insights
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                AI-powered content recommendations
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-lg p-4"
              style={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--card-border)",
              }}
            >
              <Skeleton className="h-5 w-20 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-3/4 mb-3" />
              <Skeleton className="h-3 w-1/2 mb-3" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Not connected state
  if (isGscConnected === false) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="rounded-lg p-2"
              style={{ backgroundColor: "var(--weld-light)" }}
            >
              <Sparkles className="w-5 h-5" style={{ color: "var(--weld)" }} />
            </div>
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                AI Insights
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                AI-powered content recommendations
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-lg p-8 text-center"
          style={{
            backgroundColor: "var(--background)",
            border: "1px solid var(--card-border)",
          }}
        >
          <Sparkles
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "var(--weld)" }}
          />
          <h4
            className="text-base font-medium mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Connect Google Search Console
          </h4>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            AI insights are powered by your search data. Connect Google Search Console
            to get personalized content recommendations.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => router.push("/dashboard/settings")}
            style={{ backgroundColor: "var(--weld)" }}
          >
            Go to Settings
          </Button>
        </div>
      </Card>
    );
  }

  // Empty state
  if (!data || data.recommendations.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="rounded-lg p-2"
              style={{ backgroundColor: "var(--weld-light)" }}
            >
              <Sparkles className="w-5 h-5" style={{ color: "var(--weld)" }} />
            </div>
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                AI Insights
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                AI-powered content recommendations
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div
          className="rounded-lg p-8 text-center"
          style={{
            backgroundColor: "var(--background)",
            border: "1px solid var(--card-border)",
          }}
        >
          <TrendingUp
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "var(--text-muted)" }}
          />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No recommendations available yet. Keep publishing content and check back
            soon for AI-powered insights.
          </p>
        </div>
      </Card>
    );
  }

  // Data state
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="rounded-lg p-2"
            style={{ backgroundColor: "var(--weld-light)" }}
          >
            <Sparkles className="w-5 h-5" style={{ color: "var(--weld)" }} />
          </div>
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              AI Insights
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              AI-powered content recommendations · Cached{" "}
              {formatTimestamp(data.cachedAt)}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Generating..." : "Refresh"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
          />
        ))}
      </div>
    </Card>
  );
}
