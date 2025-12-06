"use client";

import Link from "next/link";
import { FileText, Send, Calendar, ChevronRight } from "lucide-react";

interface ContentStatsProps {
  draftCount: number;
  publishedCount: number;
  scheduledCount: number;
  nextScheduledDate?: string | null;
  mostRecentDraftId?: string | null;
  mostRecentDraftTitle?: string | null;
  isLoading?: boolean;
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ContentStats({
  draftCount,
  publishedCount,
  scheduledCount,
  nextScheduledDate,
  mostRecentDraftId,
  mostRecentDraftTitle,
  isLoading = false,
}: ContentStatsProps) {
  if (isLoading) {
    return (
      <div
        className="rounded-xl border p-5"
        style={{
          borderColor: "var(--card-border)",
          backgroundColor: "var(--card-bg)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div
            className="h-5 w-28 rounded animate-pulse"
            style={{ backgroundColor: "var(--card-border)" }}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div
                className="h-8 w-12 rounded animate-pulse"
                style={{ backgroundColor: "var(--card-border)" }}
              />
              <div
                className="h-4 w-16 rounded animate-pulse"
                style={{ backgroundColor: "var(--card-border)" }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: FileText,
      value: draftCount,
      label: "Drafts",
      color: "var(--weld)",
      href: "/dashboard/blog?status=draft",
    },
    {
      icon: Send,
      value: publishedCount,
      label: "Published",
      color: "var(--success)",
      href: "/dashboard/blog?status=published",
    },
    {
      icon: Calendar,
      value: scheduledCount,
      label: "Scheduled",
      color: "var(--indigo)",
      href: "/dashboard/blog?status=scheduled",
      subtitle: nextScheduledDate ? formatDate(nextScheduledDate) : undefined,
    },
  ];

  return (
    <div
      className="rounded-xl border p-5"
      style={{
        borderColor: "var(--card-border)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          Content Status
        </h3>
        <Link
          href="/dashboard/blog"
          className="text-xs font-medium flex items-center gap-1 hover:underline"
          style={{ color: "var(--indigo)" }}
        >
          View all
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group block p-3 rounded-lg transition-colors hover:bg-[var(--card-border)]"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4" style={{ color: stat.color }} />
                <span
                  className="text-2xl font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {stat.value}
                </span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </p>
              {stat.subtitle && (
                <p className="text-xs mt-0.5" style={{ color: stat.color }}>
                  Next: {stat.subtitle}
                </p>
              )}
            </Link>
          );
        })}
      </div>

      {/* Continue Writing CTA */}
      {draftCount > 0 && mostRecentDraftId && (
        <div
          className="mt-4 pt-4 border-t"
          style={{ borderColor: "var(--card-border)" }}
        >
          <Link
            href={`/dashboard/blog/${mostRecentDraftId}`}
            className="flex items-center justify-between group"
          >
            <div className="min-w-0 flex-1">
              <p
                className="text-sm font-medium group-hover:underline truncate"
                style={{ color: "var(--text-primary)" }}
              >
                Continue writing
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {mostRecentDraftTitle || "Untitled Draft"}
              </p>
            </div>
            <ChevronRight
              className="h-4 w-4 flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
            />
          </Link>
        </div>
      )}
    </div>
  );
}
