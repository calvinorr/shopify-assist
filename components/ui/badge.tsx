import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "muted" | "indigo";
  size?: "sm" | "md";
}

const variantStyles = {
  default: {
    backgroundColor: "var(--card-border)",
    color: "var(--text-primary)",
  },
  success: {
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    color: "var(--success)",
  },
  warning: {
    backgroundColor: "rgba(255, 193, 7, 0.15)",
    color: "var(--weld)",
  },
  danger: {
    backgroundColor: "rgba(183, 97, 97, 0.15)",
    color: "var(--danger)",
  },
  muted: {
    backgroundColor: "var(--background)",
    color: "var(--text-muted)",
  },
  indigo: {
    backgroundColor: "rgba(59, 89, 128, 0.15)",
    color: "var(--indigo)",
  },
};

export function Badge({
  className,
  variant = "default",
  size = "sm",
  style,
  ...props
}: BadgeProps) {
  const variantStyle = variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        {
          "px-2 py-0.5 text-xs": size === "sm",
          "px-3 py-1 text-sm": size === "md",
        },
        className
      )}
      style={{
        ...variantStyle,
        ...style,
      }}
      {...props}
    />
  );
}
