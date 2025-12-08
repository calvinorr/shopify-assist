"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Instagram, Sparkles, ChevronDown, ArrowRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface IdeaCardProps {
  type: "blog" | "instagram";
  title: string;
  description: string;
  reasoning?: string;
  keywords?: string[];
  href: string;
  onStartBlog?: () => Promise<void>;
  isStarting?: boolean;
}

export function IdeaCard({
  type,
  title,
  description,
  reasoning,
  keywords,
  href,
  onStartBlog,
  isStarting = false,
}: IdeaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isBlog = type === "blog";
  const Icon = isBlog ? FileText : Instagram;
  const accentColor = isBlog ? "var(--indigo)" : "var(--madder)";
  const accentBg = isBlog ? "var(--indigo-light)" : "var(--madder-light)";

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col"
      style={{
        boxShadow: "0 2px 8px var(--card-shadow)",
      }}
    >
      {/* Type badge */}
      <div
        className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: accentBg }}
      >
        <Icon className="w-5 h-5" style={{ color: accentColor }} />
      </div>

      {/* Main content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <h3
          className="text-base font-semibold mb-2 pr-12 leading-snug line-clamp-2"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-3 line-clamp-2 flex-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {description}
        </p>

        {/* Keywords (blog only) */}
        {keywords && keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {keywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--text-muted)",
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Expandable reasoning */}
        {reasoning && (
          <div
            className="mb-3 rounded-lg overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: "var(--weld-light)",
              border: "1px solid var(--card-border)",
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsExpanded(!isExpanded);
              }}
              className="w-full flex items-center justify-between p-2.5 text-left"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--weld)" }} />
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Why this?
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-300",
                  isExpanded && "rotate-180"
                )}
                style={{ color: "var(--text-muted)" }}
              />
            </button>

            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div
                className="px-2.5 pb-2.5 text-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {reasoning}
              </div>
            </div>
          </div>
        )}

        {/* CTA Button/Link */}
        {isBlog && onStartBlog ? (
          <button
            onClick={onStartBlog}
            disabled={isStarting}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              backgroundColor: accentColor,
              color: "white",
            }}
          >
            {isStarting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Draft...
              </>
            ) : (
              <>
                Start Writing
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <Link
            href={href}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: accentColor,
              color: "white",
            }}
          >
            Start Creating
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </Card>
  );
}
