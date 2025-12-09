"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Target,
  Lightbulb,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface RecommendationCardProps {
  recommendation: ContentRecommendation;
}

// Type badge configuration
const typeConfig: Record<
  RecommendationType,
  { variant: "success" | "warning" | "indigo" | "default"; label: string }
> = {
  new_post: { variant: "indigo", label: "New Post" },
  optimize: { variant: "warning", label: "Optimize" },
  quick_win: { variant: "success", label: "Quick Win" },
  long_tail: { variant: "default", label: "Long Tail" },
};

// Confidence color mapping
const confidenceColors: Record<ConfidenceLevel, string> = {
  high: "var(--success)",
  medium: "var(--weld)",
  low: "var(--text-muted)",
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const typeInfo = typeConfig[recommendation.type];

  const handleAction = () => {
    // Build action URL based on type
    let url = "";
    const keyword = recommendation.targetKeyword;
    const title = recommendation.suggestedTitle || recommendation.title;

    switch (recommendation.type) {
      case "new_post":
      case "long_tail":
        url = `/dashboard/blog/new?keyword=${encodeURIComponent(keyword)}&title=${encodeURIComponent(title)}`;
        router.push(url);
        break;
      case "optimize":
        if (recommendation.existingPostId) {
          router.push(`/dashboard/blog/${recommendation.existingPostId}`);
        } else {
          router.push("/dashboard/blog");
        }
        break;
      case "quick_win":
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(keyword)}`,
          "_blank",
          "noopener,noreferrer"
        );
        break;
    }
  };

  const getActionLabel = () => {
    switch (recommendation.type) {
      case "new_post":
      case "long_tail":
        return "Create Post";
      case "optimize":
        return "Edit Post";
      case "quick_win":
        return "Research";
      default:
        return "View";
    }
  };

  return (
    <div
      className="rounded-lg p-4 transition-all hover:shadow-sm"
      style={{
        backgroundColor: "var(--background)",
        border: "1px solid var(--card-border)",
      }}
    >
      {/* Header: Type Badge + Title */}
      <div className="flex items-start gap-3 mb-3">
        <Badge variant={typeInfo.variant} size="sm">
          {typeInfo.label}
        </Badge>
        <h4
          className="text-sm font-semibold flex-1 leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {recommendation.title}
        </h4>
      </div>

      {/* Keywords */}
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{
            backgroundColor: "var(--card)",
            color: "var(--text-muted)",
          }}
        >
          {recommendation.targetKeyword}
        </span>
        {recommendation.relatedQueries && recommendation.relatedQueries.length > 0 && (
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--text-muted)",
            }}
          >
            +{recommendation.relatedQueries.length} related
          </span>
        )}
      </div>

      {/* Opportunity + Confidence */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <TrendingUp
            className="w-3.5 h-3.5"
            style={{ color: "var(--success)" }}
          />
          <span className="text-xs font-medium" style={{ color: "var(--success)" }}>
            ~{recommendation.estimatedOpportunity} impressions/mo
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: confidenceColors[recommendation.confidence],
            }}
          />
          <span
            className="text-xs capitalize"
            style={{ color: confidenceColors[recommendation.confidence] }}
          >
            {recommendation.confidence}
          </span>
        </div>
      </div>

      {/* Expandable Explanation */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 px-3 rounded-md mb-3 transition-colors"
        style={{
          backgroundColor: isExpanded ? "var(--card)" : "transparent",
        }}
      >
        <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
          Why this matters
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
        ) : (
          <ChevronDown className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
        )}
      </button>

      {isExpanded && (
        <div
          className="px-3 py-2 mb-3 rounded-md text-xs leading-relaxed"
          style={{
            backgroundColor: "var(--card)",
            color: "var(--text-muted)",
          }}
        >
          {recommendation.explanation}
          {recommendation.relatedQueries && recommendation.relatedQueries.length > 0 && (
            <div className="mt-2 pt-2 border-t" style={{ borderColor: "var(--card-border)" }}>
              <div className="text-xs mb-1" style={{ color: "var(--text-primary)" }}>
                Related queries:
              </div>
              <div className="flex flex-wrap gap-1">
                {recommendation.relatedQueries.map((query, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {query}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <Button
        variant={recommendation.type === "optimize" ? "outline" : "primary"}
        size="sm"
        onClick={handleAction}
        className="w-full"
        style={
          recommendation.type === "new_post" || recommendation.type === "long_tail"
            ? { backgroundColor: "var(--indigo)" }
            : undefined
        }
      >
        {getActionLabel()}
        {recommendation.type === "quick_win" && (
          <ExternalLink className="w-3.5 h-3.5 ml-2" />
        )}
      </Button>
    </div>
  );
}
