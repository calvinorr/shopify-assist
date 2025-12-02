"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewBlogPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    // Placeholder - will implement actual save to database later
    console.log("Saving blog post:", { title, content });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSaving(false);

    // Show success message (placeholder)
    alert("Blog post saved successfully!");
  };

  const canSave = title.trim().length > 0 && content.trim().length > 0;

  return (
    <>
      <Header
        title="New Blog Post"
        description="Create a new blog post with AI assistance"
      >
        <div className="flex gap-2">
          <Link href="/dashboard/blog">
            <Button variant="outline" size="md">
              <ArrowLeft size={18} className="mr-2" />
              Back
            </Button>
          </Link>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={!canSave || isSaving}
          >
            <Save size={18} className="mr-2" />
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
        </div>
      </Header>

      <div className="max-w-5xl mx-auto">
        <Card>
          <CardContent className="p-6">
            {/* Title Input */}
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Post Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your blog post title..."
                className="w-full px-4 py-3 rounded-lg border text-2xl font-semibold focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: "var(--card-border)",
                  backgroundColor: "var(--background)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Editor */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Content
              </label>
              <TiptapEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your blog post... Share your knowledge about natural dyes, wool care, or crafting techniques."
              />
            </div>

            {/* AI Assistance Section - Placeholder for Phase 3 */}
            <div
              className="mt-6 p-4 rounded-lg border"
              style={{
                borderColor: "var(--card-border)",
                backgroundColor: "var(--weld-light)",
              }}
            >
              <h3
                className="font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                AI Writing Assistant (Coming Soon)
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Get AI-powered suggestions for blog topics, outlines, and content based on your product data and seasonal trends.
              </p>
            </div>

            {/* Metadata Section - Placeholder for Phase 3 */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="excerpt"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Excerpt (optional)
                </label>
                <textarea
                  id="excerpt"
                  rows={3}
                  placeholder="Brief summary for previews..."
                  className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: "var(--card-border)",
                    backgroundColor: "var(--background)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Tags (optional)
                </label>
                <input
                  id="tags"
                  type="text"
                  placeholder="natural dyes, wool care, madder..."
                  className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: "var(--card-border)",
                    backgroundColor: "var(--background)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
