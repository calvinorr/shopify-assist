"use client";

import Link from "next/link";
import { FileText, Package, RefreshCw, Send } from "lucide-react";

export type ActivityType = "draft_created" | "draft_updated" | "post_published" | "products_synced";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: string;
  meta?: string; // e.g., "298 products" for sync
  linkTo?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  isLoading?: boolean;
}

const activityConfig: Record<
  ActivityType,
  { icon: typeof FileText; color: string; verb: string }
> = {
  draft_created: {
    icon: FileText,
    color: "var(--weld)",
    verb: "Draft created",
  },
  draft_updated: {
    icon: FileText,
    color: "var(--text-muted)",
    verb: "Draft updated",
  },
  post_published: {
    icon: Send,
    color: "var(--success)",
    verb: "Published",
  },
  products_synced: {
    icon: RefreshCw,
    color: "var(--indigo)",
    verb: "Products synced",
  },
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ActivityFeed({ activities, isLoading = false }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div
        className="rounded-xl border p-5"
        style={{
          borderColor: "var(--card-border)",
          backgroundColor: "var(--card-bg)",
        }}
      >
        <div
          className="h-5 w-32 rounded animate-pulse mb-4"
          style={{ backgroundColor: "var(--card-border)" }}
        />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="h-8 w-8 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--card-border)" }}
              />
              <div className="flex-1 space-y-2">
                <div
                  className="h-4 w-3/4 rounded animate-pulse"
                  style={{ backgroundColor: "var(--card-border)" }}
                />
                <div
                  className="h-3 w-1/4 rounded animate-pulse"
                  style={{ backgroundColor: "var(--card-border)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isEmpty = activities.length === 0;

  return (
    <div
      className="rounded-xl border p-5"
      style={{
        borderColor: "var(--card-border)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      <h3
        className="text-sm font-medium mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Recent Activity
      </h3>

      {isEmpty ? (
        <div className="py-6 text-center">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No recent activity
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Your actions will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {activities.slice(0, 5).map((activity) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;

            const content = (
              <div className="flex items-start gap-3 p-2 -mx-2 rounded-lg transition-colors hover:bg-[var(--card-border)]">
                <div
                  className="flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0"
                  style={{ backgroundColor: `${config.color}15` }}
                >
                  <Icon className="h-4 w-4" style={{ color: config.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>
                      {config.verb}:
                    </span>{" "}
                    {activity.title}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {formatRelativeTime(activity.timestamp)}
                    {activity.meta && ` · ${activity.meta}`}
                  </p>
                </div>
              </div>
            );

            return activity.linkTo ? (
              <Link key={activity.id} href={activity.linkTo} className="block">
                {content}
              </Link>
            ) : (
              <div key={activity.id}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
