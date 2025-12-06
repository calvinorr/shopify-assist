"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostComposer } from "@/components/instagram/post-composer";
import { DraftsList } from "@/components/instagram/drafts-list";
import { Plus, Loader2 } from "lucide-react";

interface InstagramPost {
  id: string;
  caption: string;
  hashtags: string[];
  imageUrls: string[];
  status: "draft" | "scheduled" | "posted" | "failed";
  scheduledTime?: Date | null;
  postedTime?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function InstagramPage() {
  return (
    <Suspense fallback={<InstagramLoadingState />}>
      <InstagramContent />
    </Suspense>
  );
}

function InstagramLoadingState() {
  return (
    <>
      <Header title="Instagram" description="Loading..." />
      <div className="p-6 flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--text-muted)" }} />
      </div>
    </>
  );
}

function InstagramContent() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [editingPost, setEditingPost] = useState<InstagramPost | null>(null);
  const [initialCaption, setInitialCaption] = useState<string | undefined>();

  // Check for newPost query param (from dashboard idea cards)
  useEffect(() => {
    const newPost = searchParams.get("newPost");
    const ideaTitle = searchParams.get("title");
    const ideaDescription = searchParams.get("description");

    if (newPost === "true") {
      setShowComposer(true);
      // Build initial caption from idea
      if (ideaTitle && ideaDescription) {
        setInitialCaption(`${ideaTitle}\n\n${ideaDescription}`);
      } else if (ideaTitle) {
        setInitialCaption(ideaTitle);
      }
    }
  }, [searchParams]);

  // Mock connection status - will be real when OAuth is implemented
  const isConnected = false;

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/instagram/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSavePost = async (data: {
    caption: string;
    hashtags: string[];
    imageUrl?: string;
  }) => {
    const payload = {
      caption: data.caption,
      hashtags: data.hashtags,
      imageUrls: data.imageUrl ? [data.imageUrl] : [],
      status: "draft",
    };

    if (editingPost) {
      await fetch(`/api/instagram/posts/${editingPost.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/instagram/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setShowComposer(false);
    setEditingPost(null);
    fetchPosts();
  };

  const handleEditPost = (post: InstagramPost) => {
    setEditingPost(post);
    setShowComposer(true);
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Delete this draft?")) return;
    await fetch(`/api/instagram/posts/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  const handleMarkPosted = async (id: string) => {
    await fetch(`/api/instagram/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "posted", postedTime: new Date() }),
    });
    fetchPosts();
  };

  const handleCancelComposer = () => {
    setShowComposer(false);
    setEditingPost(null);
  };

  // Separate posts by status
  const drafts = posts.filter((p) => p.status === "draft");
  const posted = posts.filter((p) => p.status === "posted");

  return (
    <>
      <Header
        title={showComposer ? (editingPost ? "Edit Post" : "Create Post") : "Instagram"}
        description={
          showComposer ? undefined : (
            <div className="flex items-center gap-2">
              <span>Create and manage your Instagram content</span>
              <Badge variant={isConnected ? "success" : "warning"} className="text-xs">
                {isConnected ? "Connected" : "Not Connected"}
              </Badge>
            </div>
          )
        }
      >
        {showComposer ? (
          <Button
            variant="outline"
            size="md"
            onClick={handleCancelComposer}
          >
            Cancel
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowComposer(true)}
            style={{ backgroundColor: "var(--indigo)" }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        )}
      </Header>

      <div className="p-6 h-[calc(100vh-5rem)] overflow-auto" style={{ backgroundColor: "var(--background)" }}>
        {/* Main Content */}
        {showComposer ? (
          <Card className="p-6">
            <PostComposer
              initialCaption={editingPost?.caption || initialCaption}
              initialHashtags={editingPost?.hashtags}
              initialImageUrl={editingPost?.imageUrls?.[0]}
              postId={editingPost?.id}
              onSave={handleSavePost}
              onCancel={handleCancelComposer}
            />
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Drafts */}
            <div>
              <h2
                className="text-lg font-semibold mb-4 flex items-center gap-2"
                style={{ color: "var(--text-primary)" }}
              >
                Drafts
                {drafts.length > 0 && (
                  <Badge variant="muted">{drafts.length}</Badge>
                )}
              </h2>
              <DraftsList
                posts={drafts}
                isLoading={isLoading}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                onMarkPosted={handleMarkPosted}
              />
            </div>

            {/* Posted */}
            <div>
              <h2
                className="text-lg font-semibold mb-4 flex items-center gap-2"
                style={{ color: "var(--text-primary)" }}
              >
                Posted
                {posted.length > 0 && (
                  <Badge variant="success">{posted.length}</Badge>
                )}
              </h2>
              <DraftsList
                posts={posted}
                isLoading={isLoading}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
