"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  MousePointerClick,
  Eye,
  TrendingUp,
  Search,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface PerformanceDetailModalProps {
  open: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
  postSlug: string;
}

interface QueryData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface DetailedMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  topQueries: QueryData[];
  lastUpdated?: string;
}

export function PerformanceDetailModal({
  open,
  onClose,
  postId,
  postTitle,
  postSlug,
}: PerformanceDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DetailedMetrics | null>(null);
  const [dateRange, setDateRange] = useState<"7d" | "28d" | "90d">("28d");

  // Ensure we're mounted before using portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/analytics/blog/${postId}?dateRange=${dateRange}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch performance metrics");
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [postId, dateRange]);

  // Fetch metrics when modal opens or date range changes
  useEffect(() => {
    if (open) {
      fetchMetrics();
    }
  }, [open, fetchMetrics]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setMetrics(null);
        setError(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case "7d":
        return "Last 7 days";
      case "28d":
        return "Last 28 days";
      case "90d":
        return "Last 90 days";
    }
  };

  if (!open || !mounted) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--card-border)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-start justify-between p-6 border-b sticky top-0 z-10"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--card-border)",
            }}
          >
            <div className="flex-1 pr-4 min-w-0">
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {postTitle}
              </h2>
              <a
                href={`https://herbariumdyeworks.com/blog/${postSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm hover:underline"
                style={{ color: "var(--indigo)" }}
              >
                <span>View post</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--text-primary)",
              }}
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6" style={{ backgroundColor: "var(--card-bg)" }}>
            {/* Date Range Selector */}
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Performance Overview
              </h3>
              <div className="flex gap-2">
                {(["7d", "28d", "90d"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                    style={{
                      backgroundColor:
                        dateRange === range
                          ? "var(--indigo)"
                          : "var(--background)",
                      color:
                        dateRange === range
                          ? "#ffffff"
                          : "var(--text-secondary)",
                      border:
                        dateRange === range
                          ? "none"
                          : "1px solid var(--card-border)",
                    }}
                  >
                    {range === "7d" && "7 days"}
                    {range === "28d" && "28 days"}
                    {range === "90d" && "90 days"}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-6">
                {/* Metric cards skeleton */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                  ))}
                </div>
                {/* Table skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-8 rounded-lg" />
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-lg" />
                  ))}
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div
                className="rounded-lg p-4 mb-6"
                style={{
                  backgroundColor: "var(--danger-light)",
                  border: "1px solid var(--danger)",
                }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--danger)" }}
                >
                  {error}
                </p>
                <Button
                  onClick={fetchMetrics}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Metrics Display */}
            {metrics && !loading && (
              <>
                {/* Large Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {/* Clicks */}
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "var(--indigo-light)" }}
                      >
                        <MousePointerClick
                          className="w-5 h-5"
                          style={{ color: "var(--indigo)" }}
                        />
                      </div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                        Clicks
                      </p>
                    </div>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {metrics.clicks.toLocaleString()}
                    </p>
                  </Card>

                  {/* Impressions */}
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "var(--weld-light)" }}
                      >
                        <Eye className="w-5 h-5" style={{ color: "var(--weld)" }} />
                      </div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                        Impressions
                      </p>
                    </div>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {metrics.impressions.toLocaleString()}
                    </p>
                  </Card>

                  {/* CTR */}
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "var(--success-light)" }}
                      >
                        <TrendingUp
                          className="w-5 h-5"
                          style={{ color: "var(--success)" }}
                        />
                      </div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                        CTR
                      </p>
                    </div>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {metrics.ctr.toFixed(1)}%
                    </p>
                  </Card>

                  {/* Average Position */}
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "var(--walnut-light)" }}
                      >
                        <Search
                          className="w-5 h-5"
                          style={{ color: "var(--walnut)" }}
                        />
                      </div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                        Avg Position
                      </p>
                    </div>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {metrics.position.toFixed(1)}
                    </p>
                  </Card>
                </div>

                {/* Top Search Queries Table */}
                <div>
                  <h3
                    className="text-lg font-semibold mb-4"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Top Search Queries
                  </h3>
                  <Card>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr
                            className="border-b"
                            style={{ borderColor: "var(--card-border)" }}
                          >
                            <th
                              className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Query
                            </th>
                            <th
                              className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Clicks
                            </th>
                            <th
                              className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Impressions
                            </th>
                            <th
                              className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide"
                              style={{ color: "var(--text-muted)" }}
                            >
                              CTR
                            </th>
                            <th
                              className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Position
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {metrics.topQueries.length > 0 ? (
                            metrics.topQueries.map((query, index) => (
                              <tr
                                key={index}
                                className="border-b hover:bg-opacity-50 transition-colors"
                                style={{
                                  borderColor: "var(--card-border)",
                                  backgroundColor: "transparent",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "var(--background)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "transparent";
                                }}
                              >
                                <td
                                  className="py-3 px-4 text-sm"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {query.query}
                                </td>
                                <td
                                  className="py-3 px-4 text-sm text-right font-medium"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {query.clicks.toLocaleString()}
                                </td>
                                <td
                                  className="py-3 px-4 text-sm text-right"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  {query.impressions.toLocaleString()}
                                </td>
                                <td
                                  className="py-3 px-4 text-sm text-right"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  {query.ctr.toFixed(1)}%
                                </td>
                                <td
                                  className="py-3 px-4 text-sm text-right"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  {query.position.toFixed(1)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={5}
                                className="py-8 px-4 text-center text-sm"
                                style={{ color: "var(--text-muted)" }}
                              >
                                No search query data available for this period
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>

                {/* Data Freshness Note */}
                <div
                  className="mt-6 p-3 rounded-lg text-xs flex items-start gap-2"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--text-muted)",
                  }}
                >
                  <Loader2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium" style={{ color: "var(--text-secondary)" }}>
                      About this data
                    </p>
                    <p className="mt-1">
                      Google Search Console data typically has a 2-3 day delay. Last
                      updated: {metrics.lastUpdated || getDateRangeLabel()}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
