"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { useToast } from "@/components/ui/toast";
import { useAutosaveOnChange } from "@/hooks/use-autosave";
import { Save, ArrowLeft, Trash2, Loader2, Eye, Edit3, Copy, Sparkles } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  contentHtml: string | null;
  metaDescription: string | null;
  focusKeywords: string[];
  status: "draft" | "review" | "published";
  createdAt: string;
  updatedAt: string;
}

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"draft" | "review" | "published">("draft");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGeneratingExcerpt, setIsGeneratingExcerpt] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

  const handleExportHTML = async () => {
    try {
      await navigator.clipboard.writeText(content);
      showToast("HTML copied to clipboard");
    } catch (error) {
      showToast("Failed to copy HTML", "error");
    }
  };

  const handleGenerateExcerpt = async () => {
    if (!content.trim()) {
      showToast("Please write some content first", "error");
      return;
    }

    setIsGeneratingExcerpt(true);
    try {
      const response = await fetch("/api/ai/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "excerpt",
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate excerpt");
      }

      setExcerpt(data.result);
      showToast("Excerpt generated successfully");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to generate excerpt", "error");
    } finally {
      setIsGeneratingExcerpt(false);
    }
  };

  const handleGenerateTags = async () => {
    if (!content.trim()) {
      showToast("Please write some content first", "error");
      return;
    }

    setIsGeneratingTags(true);
    try {
      const response = await fetch("/api/ai/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "tags",
          title,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate tags");
      }

      setTags(data.result);
      showToast("Tags generated successfully");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to generate tags", "error");
    } finally {
      setIsGeneratingTags(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          showToast("Post not found", "error");
          router.push("/dashboard/blog");
          return;
        }
        throw new Error("Failed to load post");
      }

      const data: BlogPost = await response.json();
      setPost(data);
      setTitle(data.title);
      setContent(data.contentHtml || "");
      setExcerpt(data.metaDescription || "");
      setTags(Array.isArray(data.focusKeywords) ? data.focusKeywords.join(", ") : "");
      setStatus(data.status);
    } catch {
      showToast("Failed to load post", "error");
      router.push("/dashboard/blog");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (silent = false) => {
    if (!title.trim()) {
      if (!silent) {
        showToast("Please enter a title", "error");
      }
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content,
          excerpt: excerpt.trim() || undefined,
          tags: tags.trim() || undefined,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save");
      }

      if (!silent) {
        showToast("Post updated successfully");
      }
    } catch (error) {
      if (!silent) {
        showToast(error instanceof Error ? error.message : "Failed to save post", "error");
      }
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save functionality
  const { status: autosaveStatus } = useAutosaveOnChange({
    values: [title, content, excerpt, tags, status],
    onSave: async () => {
      await handleSave(true);
    },
    delay: 30000, // 30 seconds
    enabled: !isLoading && title.trim().length > 0, // Only auto-save if loaded and has title
  });

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/blog/${id}`, { method: "DELETE" });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete");
      }

      showToast("Post deleted");
      router.push("/dashboard/blog");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to delete post", "error");
      setIsDeleting(false);
    }
  };

  const canSave = title.trim().length > 0;

  // Get status text for display
  const getStatusText = () => {
    if (isSaving) return "Saving...";
    if (autosaveStatus === "saved") return "Saved";
    if (autosaveStatus === "error") return "Save failed";
    if (autosaveStatus === "idle") return "Unsaved changes";
    return null;
  };

  const statusText = getStatusText();

  if (isLoading) {
    return (
      <>
        <Header title="Edit Blog Post" description="Loading..." />
        <div className="p-6 max-w-5xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--text-muted)" }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      <Header
        title="Edit Blog Post"
        description={
          <div className="flex items-center gap-2">
            <span>Last updated {new Date(post.updatedAt).toLocaleDateString()}</span>
            {statusText && (
              <>
                <span style={{ color: "var(--text-muted)" }}>•</span>
                <span
                  className="text-sm"
                  style={{
                    color:
                      autosaveStatus === "saved"
                        ? "var(--success)"
                        : autosaveStatus === "error"
                        ? "var(--danger)"
                        : isSaving
                        ? "var(--text-muted)"
                        : "var(--warning)",
                  }}
                >
                  {statusText}
                </span>
              </>
            )}
          </div>
        }
      >
        <div className="flex gap-2">
          <Link href="/dashboard/blog">
            <Button variant="outline" size="md">
              <ArrowLeft size={18} className="mr-2" />
              Back
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="md"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} style={{ color: "var(--danger)" }} />
            )}
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? (
              <>
                <Edit3 size={18} className="mr-2" />
                Edit
              </>
            ) : (
              <>
                <Eye size={18} className="mr-2" />
                Preview
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={handleExportHTML}
            disabled={!content.trim()}
          >
            <Copy size={18} className="mr-2" />
            Copy HTML
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => handleSave(false)}
            disabled={!canSave || isSaving}
          >
            <Save size={18} className="mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </Header>

      <div className="p-4 h-[calc(100vh-80px)] flex gap-4">
        {/* Main Editor - Left Side */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardContent className="p-4 flex flex-col flex-1 overflow-hidden">
            {isPreviewMode ? (
              /* Preview Mode */
              <div className="flex-1 overflow-auto">
                <h1
                  className="text-3xl font-bold mb-6"
                  style={{ color: "var(--text-primary)" }}
                >
                  {title || "Untitled Post"}
                </h1>
                <div
                  className="prose prose-slate max-w-none"
                  style={{ color: "var(--text-primary)" }}
                  dangerouslySetInnerHTML={{ __html: content || "<p>No content yet...</p>" }}
                />
              </div>
            ) : (
              /* Edit Mode */
              <>
                {/* Title Input */}
                <div className="mb-3">
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title..."
                    className="w-full px-3 py-2 rounded-lg border text-xl font-semibold focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: "var(--card-border)",
                      backgroundColor: "var(--background)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                {/* Editor - Fills remaining space */}
                <div className="flex-1 overflow-hidden">
                  <TiptapEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Start writing your blog post..."
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Sidebar - Right Side */}
        <Card className="w-72 flex-shrink-0">
          <CardContent className="p-4 space-y-4">
            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-xs font-medium mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "review" | "published")}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: "var(--card-border)",
                  backgroundColor: "var(--background)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Excerpt */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="excerpt"
                  className="text-xs font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  Excerpt
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateExcerpt}
                  disabled={isGeneratingExcerpt || !content.trim()}
                  className="h-6 px-2 text-xs gap-1"
                  style={{
                    color: isGeneratingExcerpt ? "var(--text-muted)" : "var(--indigo)",
                  }}
                >
                  {isGeneratingExcerpt ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} />
                      <span>Generate</span>
                    </>
                  )}
                </Button>
              </div>
              <textarea
                id="excerpt"
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary..."
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: "var(--card-border)",
                  backgroundColor: "var(--background)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="tags"
                  className="text-xs font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  Tags
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateTags}
                  disabled={isGeneratingTags || !content.trim()}
                  className="h-6 px-2 text-xs gap-1"
                  style={{
                    color: isGeneratingTags ? "var(--text-muted)" : "var(--indigo)",
                  }}
                >
                  {isGeneratingTags ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      <span>Suggesting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} />
                      <span>Suggest</span>
                    </>
                  )}
                </Button>
              </div>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="comma, separated..."
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: "var(--card-border)",
                  backgroundColor: "var(--background)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
