"use client";

import Link from "next/link";
import { FileText, Calendar, Clock, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow, differenceInDays } from "date-fns";

interface ContentMotivationProps {
  draftCount: number;
  nextScheduledDate?: string | null;
  lastPublishedDate?: string | null;
  mostRecentDraftId?: string | null;
  mostRecentDraftTitle?: string | null;
  isLoading?: boolean;
}

export function ContentMotivation({
  draftCount,
  nextScheduledDate,
  lastPublishedDate,
  mostRecentDraftId,
  mostRecentDraftTitle,
  isLoading = false,
}: ContentMotivationProps) {
  if (isLoading) {
    return (
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Calculate days since last post
  const daysSinceLastPost = lastPublishedDate
    ? differenceInDays(new Date(), new Date(lastPublishedDate))
    : null;

  // Format next scheduled
  const nextScheduledFormatted = nextScheduledDate
    ? formatDistanceToNow(new Date(nextScheduledDate), { addSuffix: true })
    : null;

  const stats = [
    {
      icon: FileText,
      value: draftCount,
      label: "Drafts",
      sublabel: draftCount === 1 ? "ready to edit" : "ready to edit",
      color: "var(--weld)",
      href: "/dashboard/blog?status=draft",
    },
    {
      icon: Calendar,
      value: nextScheduledFormatted || "None",
      label: "Next Post",
      sublabel: nextScheduledDate ? "scheduled" : "nothing scheduled",
      color: "var(--indigo)",
      href: "/dashboard/blog",
      isText: !nextScheduledDate,
    },
    {
      icon: Clock,
      value: daysSinceLastPost !== null ? `${daysSinceLastPost}d` : "—",
      label: "Since Last",
      sublabel: daysSinceLastPost !== null ? "days ago" : "no posts yet",
      color: daysSinceLastPost && daysSinceLastPost > 14 ? "var(--danger)" : "var(--success)",
      href: "/dashboard/blog?status=published",
    },
  ];

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-sm font-medium flex items-center gap-2"
          style={{ color: "var(--text-primary)" }}
        >
          Your Content Status
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
              className="group block p-3 rounded-lg transition-colors hover:bg-[var(--background)]"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4" style={{ color: stat.color }} />
                <span
                  className={`font-semibold ${stat.isText ? "text-sm" : "text-2xl"}`}
                  style={{ color: "var(--text-primary)" }}
                >
                  {stat.value}
                </span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </p>
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
    </Card>
  );
}
