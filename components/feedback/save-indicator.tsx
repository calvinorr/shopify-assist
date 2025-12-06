"use client";

import { Check, Loader2, AlertCircle, Cloud } from "lucide-react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface SaveIndicatorProps {
  status: SaveStatus;
  lastSaved?: Date | null;
  errorMessage?: string;
  onRetry?: () => void;
}

function formatLastSaved(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function SaveIndicator({
  status,
  lastSaved,
  errorMessage,
  onRetry,
}: SaveIndicatorProps) {
  if (status === "idle" && !lastSaved) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {status === "saving" && (
        <>
          <Loader2
            className="h-4 w-4 animate-spin"
            style={{ color: "var(--text-muted)" }}
          />
          <span style={{ color: "var(--text-muted)" }}>Saving...</span>
        </>
      )}

      {status === "saved" && (
        <>
          <Check className="h-4 w-4" style={{ color: "var(--success)" }} />
          <span style={{ color: "var(--text-muted)" }}>
            Saved {lastSaved && formatLastSaved(lastSaved)}
          </span>
        </>
      )}

      {status === "error" && (
        <>
          <AlertCircle className="h-4 w-4" style={{ color: "var(--danger)" }} />
          <span style={{ color: "var(--danger)" }}>
            {errorMessage || "Save failed"}
          </span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="font-medium underline hover:no-underline"
              style={{ color: "var(--indigo)" }}
            >
              Retry
            </button>
          )}
        </>
      )}

      {status === "idle" && lastSaved && (
        <>
          <Cloud className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
          <span style={{ color: "var(--text-muted)" }}>
            Saved {formatLastSaved(lastSaved)}
          </span>
        </>
      )}
    </div>
  );
}
