"use client";

import Link from "next/link";
import { Plus, RefreshCw, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  lastSyncTime?: string | null;
  onSync?: () => void;
  isSyncing?: boolean;
}

function formatSyncTime(dateString: string | null | undefined): string {
  if (!dateString) return "Never synced";

  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export function QuickActions({ lastSyncTime, onSync, isSyncing = false }: QuickActionsProps) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        borderColor: "var(--card-border)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/blog/new">
            <Button
              size="md"
              className="shadow-sm"
              style={{
                backgroundColor: "var(--indigo)",
                color: "white",
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Blog Post
            </Button>
          </Link>

          <Button
            size="md"
            variant="outline"
            onClick={onSync}
            disabled={isSyncing}
            className="shadow-sm"
            style={{
              borderColor: "var(--card-border)",
              backgroundColor: "var(--background)",
            }}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync Products"}
          </Button>

          <Link href="/dashboard/instagram">
            <Button
              size="md"
              variant="outline"
              className="shadow-sm"
              style={{
                borderColor: "var(--card-border)",
                backgroundColor: "var(--background)",
              }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Ideas
            </Button>
          </Link>
        </div>

        {/* Right: Sync Status */}
        {lastSyncTime !== undefined && (
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Last sync: {formatSyncTime(lastSyncTime)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
