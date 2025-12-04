"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export interface BlogTopicCardProps {
  title: string;
  description: string;
  reasoning: string;
  suggestedKeywords: string[];
  onStart?: () => void;
}

export function BlogTopicCard({
  title,
  description,
  reasoning,
  suggestedKeywords,
  onStart,
}: BlogTopicCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartPost = async () => {
    if (onStart) {
      onStart();
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      // Call the scaffold API to generate the blog post
      const response = await fetch("/api/ai/blog/scaffold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          suggestedKeywords,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate blog post");
      }

      const data = await response.json();

      // Navigate to the edit page for the generated draft
      router.push(`/dashboard/blog/${data.postId}`);
    } catch (err) {
      console.error("Failed to scaffold blog post:", err);
      setError(err instanceof Error ? err.message : "Failed to generate");
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div
              className="rounded-lg p-2.5 mt-1"
              style={{ backgroundColor: 'var(--madder-light)' }}
            >
              <FileText className="h-6 w-6" style={{ color: 'var(--madder)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl mb-2">{title}</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                {description}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Keywords Section */}
        <div>
          <p
            className="text-xs font-medium mb-2 uppercase tracking-wide"
            style={{ color: 'var(--text-muted)' }}
          >
            Suggested Keywords
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: 'var(--weld-light)',
                  color: 'var(--walnut)',
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Expandable Reasoning Section */}
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-lg transition-colors"
            style={{
              backgroundColor: isExpanded ? 'var(--background)' : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!isExpanded) {
                e.currentTarget.style.backgroundColor = 'var(--background)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isExpanded) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <Sparkles
              className="h-4 w-4 flex-shrink-0"
              style={{ color: 'var(--weld)' }}
            />
            <span
              className="text-sm font-medium flex-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              Why this topic?
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            ) : (
              <ChevronDown className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            )}
          </button>

          {isExpanded && (
            <div
              className="mt-2 p-4 rounded-lg"
              style={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--card-border)',
              }}
            >
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {reasoning}
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="p-3 rounded-lg text-sm"
            style={{
              backgroundColor: 'var(--danger-light, #fee2e2)',
              color: 'var(--danger, #dc2626)',
              border: '1px solid var(--danger, #dc2626)',
            }}
          >
            {error}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <Button
            onClick={handleStartPost}
            size="lg"
            className="w-full"
            disabled={isGenerating}
            style={{
              backgroundColor: isGenerating ? '#9ca3af' : 'var(--madder)',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              if (!isGenerating) {
                e.currentTarget.style.backgroundColor = '#a14d2d';
              }
            }}
            onMouseLeave={(e) => {
              if (!isGenerating) {
                e.currentTarget.style.backgroundColor = 'var(--madder)';
              }
            }}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Draft...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Start This Post
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
