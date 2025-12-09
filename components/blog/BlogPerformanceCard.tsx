"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, MousePointerClick, Eye } from "lucide-react";

export interface BlogPerformanceCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    trend?: number; // percentage change
  };
  onClick?: () => void;
}

export function BlogPerformanceCard({ post, onClick }: BlogPerformanceCardProps) {
  // Determine performance level based on clicks
  const getPerformanceBadge = () => {
    if (post.clicks >= 100) {
      return { variant: "success" as const, label: "High" };
    } else if (post.clicks >= 20) {
      return { variant: "warning" as const, label: "Medium" };
    } else {
      return { variant: "muted" as const, label: "Low" };
    }
  };

  const performanceBadge = getPerformanceBadge();
  const hasTrend = post.trend !== undefined && post.trend !== 0;

  return (
    <Card
      className="p-4 cursor-pointer transition-all hover:shadow-lg"
      onClick={onClick}
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    >
      {/* Header: Title & Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3
          className="text-sm font-semibold leading-snug line-clamp-2 flex-1"
          style={{ color: "var(--text-primary)" }}
        >
          {post.title}
        </h3>
        <Badge variant={performanceBadge.variant} size="sm" className="flex-shrink-0">
          {performanceBadge.label}
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Clicks */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--indigo-light)" }}
          >
            <MousePointerClick className="w-4 h-4" style={{ color: "var(--indigo)" }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Clicks
            </p>
            <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              {post.clicks.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Impressions */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--weld-light)" }}
          >
            <Eye className="w-4 h-4" style={{ color: "var(--weld)" }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Impressions
            </p>
            <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              {post.impressions.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* CTR & Position Row */}
      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--card-border)" }}>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              CTR
            </p>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {post.ctr.toFixed(1)}%
            </p>
          </div>
          <div
            className="w-px h-8"
            style={{ backgroundColor: "var(--card-border)" }}
          />
          <div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Avg Position
            </p>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {post.position.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Trend Indicator */}
        {hasTrend && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full"
            style={{
              backgroundColor: post.trend! > 0 ? "var(--success-light)" : "var(--danger-light)",
            }}
          >
            {post.trend! > 0 ? (
              <TrendingUp className="w-3 h-3" style={{ color: "var(--success)" }} />
            ) : (
              <TrendingDown className="w-3 h-3" style={{ color: "var(--danger)" }} />
            )}
            <span
              className="text-xs font-medium"
              style={{ color: post.trend! > 0 ? "var(--success)" : "var(--danger)" }}
            >
              {Math.abs(post.trend!).toFixed(0)}%
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
