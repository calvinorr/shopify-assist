"use client";

import { useState } from "react";
import { Instagram, Sparkles, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CaptionModal } from "@/components/instagram/caption-modal";
import { cn } from "@/lib/utils";

export interface InstagramIdeaCardProps {
  title: string;
  description: string;
  reasoning: string;
  onUse?: () => void;
}

export function InstagramIdeaCard({
  title,
  description,
  reasoning,
  onUse,
}: InstagramIdeaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUseIdea = () => {
    if (onUse) {
      onUse();
    }
    setIsModalOpen(true);
  };

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{
        boxShadow: '0 2px 8px var(--card-shadow)',
      }}
    >
      {/* Instagram badge */}
      <div
        className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-300 group-hover:scale-110"
        style={{
          backgroundColor: 'var(--madder-light)',
        }}
      >
        <Instagram
          className="w-5 h-5"
          style={{ color: 'var(--madder)' }}
        />
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Title */}
        <h3
          className="text-lg font-semibold mb-3 pr-12 leading-snug"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h3>

        {/* Description - truncated to 2 lines */}
        <p
          className="text-sm leading-relaxed mb-4 line-clamp-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          {description}
        </p>

        {/* Expandable "Why this?" section */}
        <div
          className="mb-4 rounded-lg overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: 'var(--weld-light)',
            border: '1px solid var(--card-border)',
          }}
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-3 text-left transition-colors duration-200 hover:bg-opacity-80"
            aria-expanded={isExpanded}
            aria-controls="reasoning-content"
          >
            <div className="flex items-center gap-2">
              <Sparkles
                className="w-4 h-4"
                style={{ color: 'var(--weld)' }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                Why this?
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-300",
                isExpanded && "rotate-180"
              )}
              style={{ color: 'var(--text-muted)' }}
            />
          </button>

          {/* Reasoning content */}
          <div
            id="reasoning-content"
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div
              className="px-3 pb-3 text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {reasoning}
            </div>
          </div>
        </div>

        {/* Use This Idea button */}
        <Button
          onClick={handleUseIdea}
          variant="primary"
          size="md"
          className="w-full transition-all duration-200"
          style={{
            backgroundColor: 'var(--indigo)',
            color: 'white',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--indigo)';
          }}
        >
          Use This Idea
        </Button>
      </div>

      {/* Subtle grain texture overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Caption Modal */}
      <CaptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        idea={{ title, description }}
      />
    </Card>
  );
}
