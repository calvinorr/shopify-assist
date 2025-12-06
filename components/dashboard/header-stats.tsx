"use client";

import Link from "next/link";
import { FileText, Calendar, Clock } from "lucide-react";
import { formatDistanceToNow, differenceInDays } from "date-fns";

interface HeaderStatsProps {
  draftCount: number;
  nextScheduledDate?: string | null;
  lastPublishedDate?: string | null;
  isLoading?: boolean;
}

export function HeaderStats({
  draftCount,
  nextScheduledDate,
  lastPublishedDate,
  isLoading = false,
}: HeaderStatsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-8 w-20 rounded animate-pulse"
            style={{ backgroundColor: "var(--card-border)" }}
          />
        ))}
      </div>
    );
  }

  const daysSinceLastPost = lastPublishedDate
    ? differenceInDays(new Date(), new Date(lastPublishedDate))
    : null;

  const nextScheduledFormatted = nextScheduledDate
    ? formatDistanceToNow(new Date(nextScheduledDate), { addSuffix: false })
    : null;

  return (
    <div className="flex items-center gap-1">
      {/* Drafts */}
      <Link
        href="/dashboard/blog?status=draft"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--background)]"
      >
        <FileText className="h-4 w-4" style={{ color: "var(--weld)" }} />
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {draftCount}
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          drafts
        </span>
      </Link>

      <div
        className="h-4 w-px mx-1"
        style={{ backgroundColor: "var(--card-border)" }}
      />

      {/* Next Scheduled */}
      <Link
        href="/dashboard/blog"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--background)]"
      >
        <Calendar className="h-4 w-4" style={{ color: "var(--indigo)" }} />
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Next:
        </span>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {nextScheduledFormatted || "—"}
        </span>
      </Link>

      <div
        className="h-4 w-px mx-1"
        style={{ backgroundColor: "var(--card-border)" }}
      />

      {/* Days Since Last */}
      <Link
        href="/dashboard/blog?status=published"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--background)]"
      >
        <Clock
          className="h-4 w-4"
          style={{
            color:
              daysSinceLastPost && daysSinceLastPost > 14
                ? "var(--danger)"
                : "var(--success)",
          }}
        />
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Last:
        </span>
        <span
          className="text-sm font-medium"
          style={{
            color:
              daysSinceLastPost && daysSinceLastPost > 14
                ? "var(--danger)"
                : "var(--text-primary)",
          }}
        >
          {daysSinceLastPost !== null ? `${daysSinceLastPost}d ago` : "—"}
        </span>
      </Link>
    </div>
  );
}
