"use client";

import { Sparkles, RefreshCw } from "lucide-react";
import { InstagramIdeaCard } from "./instagram-idea-card";
import { BlogTopicCard } from "./blog-topic-card";
import { Button } from "@/components/ui/button";

export interface InstagramIdea {
  title: string;
  description: string;
  reasoning: string;
}

export interface BlogTopic {
  title: string;
  description: string;
  reasoning: string;
  suggestedKeywords: string[];
}

export interface AISuggestionsProps {
  instagramIdeas: InstagramIdea[];
  blogTopic: BlogTopic | null;
  isLoading?: boolean;
  isRefreshing?: boolean;
  isEmpty?: boolean;
  onRefresh?: () => void;
  onUseInstagramIdea?: (idea: InstagramIdea) => void;
  onStartBlogPost?: () => void;
}

export function AISuggestions({
  instagramIdeas,
  blogTopic,
  isLoading = false,
  isRefreshing = false,
  isEmpty = false,
  onRefresh,
  onUseInstagramIdea,
  onStartBlogPost,
}: AISuggestionsProps) {
  const hasContent = instagramIdeas.length > 0 || blogTopic;

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="rounded-lg p-2"
            style={{
              backgroundColor: 'var(--weld-light)',
            }}
          >
            <Sparkles
              className="w-5 h-5"
              style={{ color: 'var(--weld)' }}
            />
          </div>
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            AI-Powered Ideas
          </h2>
        </div>
        {onRefresh && hasContent && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Generating...' : 'New Ideas'}
          </Button>
        )}
      </div>

      {/* Empty State - No cached ideas */}
      {!isLoading && !hasContent && (
        <div
          className="rounded-xl p-8 text-center"
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--card-border)',
          }}
        >
          <Sparkles
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: 'var(--weld)' }}
          />
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            No ideas generated yet
          </h3>
          <p
            className="mb-6"
            style={{ color: 'var(--text-muted)' }}
          >
            Click below to generate AI-powered content ideas based on your products
          </p>
          {onRefresh && (
            <Button
              variant="primary"
              size="md"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <Sparkles className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-pulse' : ''}`} />
              {isRefreshing ? 'Generating Ideas...' : 'Generate Ideas'}
            </Button>
          )}
        </div>
      )}

      {/* Instagram Ideas Grid */}
      {(isLoading || hasContent) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons for Instagram cards
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            instagramIdeas.map((idea, index) => (
              <InstagramIdeaCard
                key={index}
                title={idea.title}
                description={idea.description}
                reasoning={idea.reasoning}
                onUse={() => onUseInstagramIdea?.(idea)}
              />
            ))
          )}
        </div>
      )}

      {/* Blog Topic Card (Full Width) */}
      {isLoading ? (
        <SkeletonBlogCard />
      ) : (
        blogTopic && (
          <BlogTopicCard
            title={blogTopic.title}
            description={blogTopic.description}
            reasoning={blogTopic.reasoning}
            suggestedKeywords={blogTopic.suggestedKeywords}
            onStart={onStartBlogPost}
          />
        )
      )}
    </section>
  );
}

// Loading skeleton for Instagram cards
function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-6 animate-pulse"
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--card-border)',
      }}
    >
      {/* Badge skeleton */}
      <div className="flex justify-end mb-4">
        <div
          className="w-10 h-10 rounded-full"
          style={{ backgroundColor: 'var(--background)' }}
        />
      </div>

      {/* Title skeleton */}
      <div
        className="h-6 rounded mb-3"
        style={{
          backgroundColor: 'var(--background)',
          width: '75%',
        }}
      />

      {/* Description skeleton */}
      <div className="space-y-2 mb-4">
        <div
          className="h-4 rounded"
          style={{
            backgroundColor: 'var(--background)',
            width: '100%',
          }}
        />
        <div
          className="h-4 rounded"
          style={{
            backgroundColor: 'var(--background)',
            width: '90%',
          }}
        />
      </div>

      {/* Why this? section skeleton */}
      <div
        className="h-10 rounded-lg mb-4"
        style={{
          backgroundColor: 'var(--weld-light)',
          border: '1px solid var(--card-border)',
        }}
      />

      {/* Button skeleton */}
      <div
        className="h-10 rounded-lg"
        style={{
          backgroundColor: 'var(--background)',
        }}
      />
    </div>
  );
}

// Loading skeleton for blog card
function SkeletonBlogCard() {
  return (
    <div
      className="rounded-xl p-6 animate-pulse"
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--card-border)',
      }}
    >
      <div className="flex items-start gap-4 mb-6">
        {/* Icon skeleton */}
        <div
          className="w-12 h-12 rounded-lg flex-shrink-0"
          style={{ backgroundColor: 'var(--background)' }}
        />

        <div className="flex-1 space-y-3">
          {/* Title skeleton */}
          <div
            className="h-7 rounded"
            style={{
              backgroundColor: 'var(--background)',
              width: '60%',
            }}
          />

          {/* Description skeleton */}
          <div className="space-y-2">
            <div
              className="h-4 rounded"
              style={{
                backgroundColor: 'var(--background)',
                width: '100%',
              }}
            />
            <div
              className="h-4 rounded"
              style={{
                backgroundColor: 'var(--background)',
                width: '95%',
              }}
            />
            <div
              className="h-4 rounded"
              style={{
                backgroundColor: 'var(--background)',
                width: '85%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Keywords skeleton */}
      <div className="mb-4">
        <div
          className="h-3 rounded mb-3"
          style={{
            backgroundColor: 'var(--background)',
            width: '120px',
          }}
        />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-8 rounded-full"
              style={{
                backgroundColor: 'var(--weld-light)',
                width: `${80 + i * 20}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Why this? section skeleton */}
      <div
        className="h-10 rounded-lg mb-4"
        style={{
          backgroundColor: 'var(--background)',
        }}
      />

      {/* Button skeleton */}
      <div
        className="h-12 rounded-lg"
        style={{
          backgroundColor: 'var(--background)',
        }}
      />
    </div>
  );
}
