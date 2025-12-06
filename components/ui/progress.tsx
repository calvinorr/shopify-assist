"use client";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value?: number;
  indeterminate?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export function Progress({
  value = 0,
  indeterminate = false,
  className,
  size = "md",
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full",
        {
          "h-1.5": size === "sm",
          "h-2.5": size === "md",
        },
        className
      )}
      style={{ backgroundColor: "var(--card-border)" }}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-300",
          indeterminate && "animate-progress-indeterminate"
        )}
        style={{
          backgroundColor: "var(--indigo)",
          width: indeterminate ? "40%" : `${clampedValue}%`,
        }}
      />
    </div>
  );
}
