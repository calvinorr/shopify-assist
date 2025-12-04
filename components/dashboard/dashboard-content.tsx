"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { HeroSection } from "./hero-section";
import { AISuggestions, InstagramIdea, BlogTopic } from "./ai-suggestions";
import { DataContextSection } from "./data-context-section";
import { DraftsWidget } from "./drafts-widget";
import { QuickStats } from "./quick-stats";

// Types
interface ProductStats {
  totalProducts: number;
  totalInventory: number;
  colorDistribution: Array<{ color: string; count: number }>;
  recentProducts: Array<{
    id: string;
    name: string;
    color: string | null;
    price: number | null;
    inventory: number | null;
    imageUrls: string[];
  }>;
}

interface BlogPost {
  id: string;
  title: string;
  updatedAt: string;
  status: string;
}

interface AISuggestionsData {
  instagram: InstagramIdea[];
  blog: BlogTopic;
}

export function DashboardContent() {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [drafts, setDrafts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AI suggestions state
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestionsData | null>(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiRefreshing, setAiRefreshing] = useState(false);

  const fetchAISuggestions = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setAiRefreshing(true);
        // POST to generate new suggestions
        const res = await fetch("/api/ai/suggestions", { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          setAiSuggestions(data);
        }
      } else {
        setAiLoading(true);
        // GET to load cached suggestions (fast, no AI)
        const res = await fetch("/api/ai/suggestions");
        if (res.ok) {
          const data = await res.json();
          setAiSuggestions(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch AI suggestions:", err);
    } finally {
      setAiLoading(false);
      setAiRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchAISuggestions();
  }, [fetchAISuggestions]);

  async function fetchData() {
    try {
      setLoading(true);

      // Fetch product stats and blog drafts in parallel
      const [statsRes, blogRes] = await Promise.all([
        fetch("/api/products/stats"),
        fetch("/api/blog"),
      ]);

      if (!statsRes.ok) throw new Error("Failed to fetch stats");

      const statsData = await statsRes.json();
      setStats(statsData);

      if (blogRes.ok) {
        const blogData = await blogRes.json();
        // Filter for drafts only
        const draftPosts = (blogData.posts || []).filter(
          (post: BlogPost) => post.status === "draft"
        );
        setDrafts(draftPosts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  const handleRefreshAI = useCallback(() => {
    fetchAISuggestions(true);
  }, [fetchAISuggestions]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--text-muted)" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p style={{ color: "var(--danger)" }}>{error}</p>
      </div>
    );
  }

  // Prepare data for components
  const topColors = stats?.colorDistribution?.slice(0, 3) || [];
  const recentProducts = stats?.recentProducts?.slice(0, 3).map((p) => ({
    name: p.name,
    color: p.color || "Natural",
  })) || [];

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: "var(--background)" }}>
      {/* Hero Section - Primary CTA */}
      <HeroSection optimalPostTime="7:00 PM" />

      {/* AI Suggestions - Content Ideas */}
      <AISuggestions
        instagramIdeas={aiSuggestions?.instagram || []}
        blogTopic={aiSuggestions?.blog || null}
        isLoading={aiLoading}
        isRefreshing={aiRefreshing}
        onRefresh={handleRefreshAI}
      />

      {/* Two Column Layout: Data Context + Drafts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DataContextSection
          topColors={topColors}
          recentProducts={recentProducts}
          isLoading={loading}
        />
        <DraftsWidget drafts={drafts} isLoading={loading} />
      </div>

      {/* Quick Stats - De-emphasized at bottom */}
      <QuickStats
        productCount={stats?.totalProducts || 0}
        inventoryTotal={stats?.totalInventory || 0}
        colorCount={stats?.colorDistribution?.length || 0}
        postsThisWeek={drafts.length}
      />
    </div>
  );
}
