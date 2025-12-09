"use client";

import { useState, useEffect } from "react";
import { Lightbulb, ChevronDown, ChevronUp, Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Opportunity {
  query: string;
  category: "color" | "how-to" | "product" | "general";
  impressions: number;
  position: number;
  ctr: number;
  score: number;
  estimatedPotential: number;
}

interface SuggestedKeywordsProps {
  onSelectKeyword: (keyword: string) => void;
  className?: string;
}

export function SuggestedKeywords({ onSelectKeyword, className }: SuggestedKeywordsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnectionAndFetchOpportunities();
  }, []);

  async function checkConnectionAndFetchOpportunities() {
    try {
      // First check if GSC is connected
      const checkRes = await fetch("/api/analytics/seo?check=true");
      const checkData = await checkRes.json();

      if (!checkData.connected) {
        setIsConnected(false);
        setLoading(false);
        return;
      }

      setIsConnected(true);

      // Fetch opportunities
      const oppRes = await fetch("/api/analytics/seo/opportunities");
      if (!oppRes.ok) {
        throw new Error("Failed to fetch opportunities");
      }

      const oppData = await oppRes.json();
      setOpportunities(oppData.opportunities?.slice(0, 5) || []);
    } catch (err) {
      console.error("Failed to fetch keyword opportunities:", err);
      setError(err instanceof Error ? err.message : "Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  }

  // Don't render if not connected
  if (!isConnected && !loading) {
    return null;
  }

  return (
    <Card className={className}>
      <div className="p-4">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between mb-2"
        >
          <div className="flex items-center gap-2">
            <Lightbulb size={16} style={{ color: "var(--indigo)" }} />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Suggested Keywords
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp size={16} style={{ color: "var(--text-muted)" }} />
          ) : (
            <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />
          )}
        </button>

        {/* Description */}
        {isExpanded && (
          <p
            className="text-xs mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            Query opportunities from Google Search Console
          </p>
        )}

        {/* Content */}
        {isExpanded && (
          <div className="space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2
                  size={20}
                  className="animate-spin"
                  style={{ color: "var(--text-muted)" }}
                />
              </div>
            ) : error ? (
              <div
                className="flex items-start gap-2 p-3 rounded-lg text-xs"
                style={{
                  backgroundColor: "var(--danger-light, #fee2e2)",
                  color: "var(--danger, #dc2626)",
                }}
              >
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            ) : opportunities.length === 0 ? (
              <p
                className="text-xs text-center py-4"
                style={{ color: "var(--text-muted)" }}
              >
                No keyword opportunities available
              </p>
            ) : (
              opportunities.map((opp, index) => (
                <KeywordSuggestionItem
                  key={index}
                  opportunity={opp}
                  onSelect={() => onSelectKeyword(opp.query)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

interface KeywordSuggestionItemProps {
  opportunity: Opportunity;
  onSelect: () => void;
}

function KeywordSuggestionItem({ opportunity, onSelect }: KeywordSuggestionItemProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "color":
        return { bg: "var(--indigo-light)", fg: "var(--indigo)" };
      case "how-to":
        return { bg: "var(--weld-light)", fg: "var(--weld)" };
      case "product":
        return { bg: "var(--madder-light)", fg: "var(--madder)" };
      default:
        return { bg: "var(--background)", fg: "var(--text-muted)" };
    }
  };

  const colors = getCategoryColor(opportunity.category);

  return (
    <button
      onClick={onSelect}
      className="w-full p-3 rounded-lg text-left transition-all hover:shadow-md"
      style={{
        backgroundColor: "var(--background)",
        border: "1px solid var(--card-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--indigo)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--card-border)";
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className="text-sm font-medium flex-1"
          style={{ color: "var(--text-primary)" }}
        >
          {opportunity.query}
        </span>
        <span
          className="px-2 py-0.5 rounded text-xs font-medium flex-shrink-0"
          style={{
            backgroundColor: colors.bg,
            color: colors.fg,
          }}
        >
          {opportunity.category}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
        <span>{opportunity.impressions.toLocaleString()} impressions</span>
        <span>•</span>
        <span>Position #{opportunity.position.toFixed(1)}</span>
        <span>•</span>
        <span style={{ color: "var(--success)" }}>
          +{opportunity.estimatedPotential} potential clicks
        </span>
      </div>
    </button>
  );
}
