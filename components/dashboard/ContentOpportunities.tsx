"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, TrendingUp, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Opportunity {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  score: number;
  category: "color" | "how-to" | "product" | "general";
  estimatedPotential: number;
}

interface ContentOpportunitiesData {
  opportunities: Opportunity[];
  summary: {
    totalOpportunities: number;
    byCategory: Record<string, number>;
    topCategory: string;
  };
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

// Map category to badge variant and color
const categoryConfig = {
  color: { variant: "indigo" as const, label: "Color" },
  "how-to": { variant: "warning" as const, label: "How-to" },
  product: { variant: "success" as const, label: "Product" },
  general: { variant: "muted" as const, label: "General" },
};

export function ContentOpportunities() {
  const router = useRouter();
  const [data, setData] = useState<ContentOpportunitiesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGscConnected, setIsGscConnected] = useState<boolean | null>(null);

  const fetchOpportunities = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/analytics/seo/opportunities");

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
        console.error("Failed to fetch opportunities");
        setIsGscConnected(false);
      }
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
      setIsGscConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const handleWritePost = (query: string) => {
    const params = new URLSearchParams();
    params.set("keyword", query);
    router.push(`/dashboard/blog/new?${params.toString()}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="rounded-lg p-2"
            style={{ backgroundColor: "var(--weld-light)" }}
          >
            <Lightbulb className="w-5 h-5" style={{ color: "var(--weld)" }} />
          </div>
          <div className="flex-1">
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Content Opportunities
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Queries with untapped potential
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{ backgroundColor: "var(--background)" }}
            >
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-8 w-20" />
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
        <div className="flex items-center gap-3 mb-4">
          <div
            className="rounded-lg p-2"
            style={{ backgroundColor: "var(--weld-light)" }}
          >
            <Lightbulb className="w-5 h-5" style={{ color: "var(--weld)" }} />
          </div>
          <div className="flex-1">
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Content Opportunities
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Queries with untapped potential
            </p>
          </div>
        </div>

        <div
          className="rounded-lg p-6 text-center"
          style={{ backgroundColor: "var(--background)" }}
        >
          <Sparkles
            className="w-10 h-10 mx-auto mb-3"
            style={{ color: "var(--weld)" }}
          />
          <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
            Connect Google Search Console in{" "}
            <button
              onClick={() => router.push("/dashboard/settings")}
              className="font-medium underline"
              style={{ color: "var(--weld)" }}
            >
              Settings
            </button>{" "}
            to discover content opportunities
          </p>
        </div>
      </Card>
    );
  }

  // Empty state
  if (!data || data.opportunities.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="rounded-lg p-2"
            style={{ backgroundColor: "var(--weld-light)" }}
          >
            <Lightbulb className="w-5 h-5" style={{ color: "var(--weld)" }} />
          </div>
          <div className="flex-1">
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Content Opportunities
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Queries with untapped potential
            </p>
          </div>
        </div>

        <div
          className="rounded-lg p-6 text-center"
          style={{ backgroundColor: "var(--background)" }}
        >
          <TrendingUp
            className="w-10 h-10 mx-auto mb-3"
            style={{ color: "var(--text-muted)" }}
          />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No opportunities found. Keep publishing quality content to appear in search results.
          </p>
        </div>
      </Card>
    );
  }

  // Data state
  const topOpportunities = data.opportunities.slice(0, 5);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="rounded-lg p-2"
          style={{ backgroundColor: "var(--weld-light)" }}
        >
          <Lightbulb className="w-5 h-5" style={{ color: "var(--weld)" }} />
        </div>
        <div className="flex-1">
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Content Opportunities
          </h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Queries with untapped potential
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {topOpportunities.map((opportunity, index) => {
          const config = categoryConfig[opportunity.category];

          return (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-opacity-50"
              style={{ backgroundColor: "var(--background)" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {opportunity.query}
                  </p>
                  <Badge variant={config.variant} size="sm">
                    {config.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>{opportunity.impressions.toLocaleString()} impressions</span>
                  <span>•</span>
                  <span>Position {opportunity.position.toFixed(1)}</span>
                  {opportunity.estimatedPotential > 0 && (
                    <>
                      <span>•</span>
                      <span
                        className="font-medium"
                        style={{ color: "var(--success)" }}
                      >
                        +{opportunity.estimatedPotential} potential clicks
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWritePost(opportunity.query)}
                className="flex-shrink-0"
              >
                Write Post
              </Button>
            </div>
          );
        })}
      </div>

      {data.opportunities.length > 5 && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--card-border)" }}>
          <button
            onClick={() => router.push("/dashboard/analytics")}
            className="text-sm font-medium w-full text-center transition-colors"
            style={{ color: "var(--weld)" }}
          >
            View all {data.opportunities.length} opportunities →
          </button>
        </div>
      )}
    </Card>
  );
}
