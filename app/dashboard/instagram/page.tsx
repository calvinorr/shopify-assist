"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostComposer } from "@/components/instagram/post-composer";
import { DraftsList } from "@/components/instagram/drafts-list";
import {
  Instagram,
  Plus,
  Link as LinkIcon,
  AlertCircle,
  Loader2,
} from "lucide-react";

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
        title="Instagram"
        description="Create and manage your Instagram content"
      >
        {!showComposer && (
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

      <div className="p-6" style={{ backgroundColor: "var(--background)" }}>
        {/* Connection Status Banner */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: isConnected
                      ? "var(--success-light)"
                      : "var(--weld-light)",
                  }}
                >
                  <Instagram
                    className="h-5 w-5"
                    style={{
                      color: isConnected ? "var(--success)" : "var(--weld)",
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      className="font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Instagram Connection
                    </h3>
                    <Badge variant={isConnected ? "success" : "warning"}>
                      {isConnected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {isConnected
                      ? "Your account is connected. Posts can be published directly."
                      : "Create drafts and copy captions to post manually."}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="md" disabled={isConnected}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Connect Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Manual Posting Instructions */}
        {!isConnected && !showComposer && (
          <Card className="mb-6" style={{ borderColor: "var(--weld-light)" }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertCircle
                  className="h-5 w-5 flex-shrink-0 mt-0.5"
                  style={{ color: "var(--weld)" }}
                />
                <div>
                  <h4
                    className="font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Manual Posting Workflow
                  </h4>
                  <ol
                    className="text-sm space-y-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <li>1. Create your post with AI-generated captions</li>
                    <li>2. Click &quot;Copy to Clipboard&quot; to copy caption + hashtags</li>
                    <li>3. Open Instagram and create a new post</li>
                    <li>4. Paste your caption and publish</li>
                    <li>5. Mark as &quot;Posted&quot; here to track it</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {showComposer ? (
          <div className="max-w-2xl">
            <Card className="p-6">
              <h2
                className="text-lg font-semibold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                {editingPost ? "Edit Post" : "Create New Post"}
              </h2>
              <PostComposer
                initialCaption={editingPost?.caption || initialCaption}
                initialHashtags={editingPost?.hashtags}
                initialImageUrl={editingPost?.imageUrls?.[0]}
                postId={editingPost?.id}
                onSave={handleSavePost}
                onCancel={handleCancelComposer}
              />
            </Card>
          </div>
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
