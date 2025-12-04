"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Copy, Check, Loader2, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface CaptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: {
    title: string;
    description: string;
  };
}

interface CaptionResponse {
  captions: string[];
  hashtags: {
    brand: string[];
    product: string[];
    community: string[];
    trending: string[];
  };
}

export function CaptionModal({ isOpen, onClose, idea }: CaptionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captionData, setCaptionData] = useState<CaptionResponse | null>(null);
  const [editedCaptions, setEditedCaptions] = useState<string[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<Set<string>>(new Set());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure we're mounted before using portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const fetchCaptions = useCallback(async () => {
    if (!idea.title) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaTitle: idea.title,
          ideaDescription: idea.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate captions");
      }

      const data = await response.json();
      setCaptionData(data);
      // Initialize editable captions
      setEditedCaptions(data.captions || []);
      // Initialize with NO hashtags selected - user picks what they want
      setSelectedHashtags(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [idea.title, idea.description]);

  // Fetch captions when modal opens
  useEffect(() => {
    if (isOpen && !captionData && !loading) {
      fetchCaptions();
    }
  }, [isOpen, captionData, loading, fetchCaptions]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Delay reset to allow close animation
      const timer = setTimeout(() => {
        setCaptionData(null);
        setEditedCaptions([]);
        setSelectedHashtags(new Set());
        setError(null);
        setCopiedIndex(null);
        setCopiedHashtags(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const copyToClipboard = async (text: string, index?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (index !== undefined) {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } else {
        setCopiedHashtags(true);
        setTimeout(() => setCopiedHashtags(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getSelectedHashtags = () => {
    return Array.from(selectedHashtags).join(" ");
  };

  const toggleHashtag = (tag: string) => {
    setSelectedHashtags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  const updateCaption = (index: number, value: string) => {
    setEditedCaptions((prev) => {
      const newCaptions = [...prev];
      newCaptions[index] = value;
      return newCaptions;
    });
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
          style={{
            backgroundColor: "#1e1e1e",
            border: "1px solid #3a3a3a",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-start justify-between p-6 border-b"
            style={{
              backgroundColor: "#1e1e1e",
              borderColor: "#3a3a3a",
            }}
          >
            <div className="flex-1 pr-4 min-w-0">
              <h2
                className="text-xl font-semibold mb-1"
                style={{ color: "#ffffff" }}
              >
                {idea.title}
              </h2>
              <p
                className="text-sm leading-relaxed line-clamp-2"
                style={{ color: "#a0a0a0" }}
              >
                {idea.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:bg-opacity-80"
              style={{
                backgroundColor: "#2a2a2a",
                color: "#ffffff",
              }}
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6" style={{ backgroundColor: "#1e1e1e" }}>
            {loading && (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2
                  className="w-12 h-12 animate-spin mb-4"
                  style={{ color: "#6366f1" }}
                />
                <p
                  className="text-sm"
                  style={{ color: "#d0d0d0" }}
                >
                  Generating captions...
                </p>
              </div>
            )}

            {error && (
              <div
                className="rounded-lg p-4 mb-6"
                style={{
                  backgroundColor: "var(--danger-light)",
                  border: "1px solid var(--danger)",
                }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--danger)" }}
                >
                  {error}
                </p>
                <Button
                  onClick={fetchCaptions}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  Try Again
                </Button>
              </div>
            )}

            {captionData && !loading && (
              <>
                {/* Caption Variations */}
                <div className="mb-8">
                  <h3
                    className="text-lg font-semibold mb-4"
                    style={{ color: "#ffffff" }}
                  >
                    Caption Variations
                  </h3>
                  <div className="space-y-4">
                    {editedCaptions.map((caption, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl transition-all duration-200"
                        style={{
                          backgroundColor: "#2a2a2a",
                          border: "1px solid #3a3a3a",
                        }}
                      >
                        <div className="flex flex-col gap-3">
                          <textarea
                            value={caption}
                            onChange={(e) => updateCaption(index, e.target.value)}
                            rows={3}
                            className="w-full text-sm leading-relaxed resize-none rounded-lg p-3 border focus:outline-none focus:ring-2 transition-all"
                            style={{
                              color: "#ffffff",
                              backgroundColor: "#1a1a1a",
                              borderColor: "#444",
                            }}
                          />
                          <div className="flex items-center justify-between">
                            <span
                              className="text-xs"
                              style={{ color: "#888" }}
                            >
                              {caption.length} characters {selectedHashtags.size > 0 && `+ ${selectedHashtags.size} hashtags`}
                            </span>
                            <Button
                              onClick={() => {
                                const fullCaption = selectedHashtags.size > 0
                                  ? `${caption}\n\n${getSelectedHashtags()}`
                                  : caption;
                                copyToClipboard(fullCaption, index);
                              }}
                              variant="outline"
                              size="sm"
                              style={{
                                backgroundColor: "#444",
                                color: "#fff",
                                border: "1px solid #555",
                              }}
                            >
                              {copiedIndex === index ? (
                                <>
                                  <Check className="w-4 h-4 mr-2" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-2" />
                                  {selectedHashtags.size > 0 ? "Copy All" : "Copy"}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Hashtags Preview */}
                {selectedHashtags.size > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className="text-lg font-semibold"
                        style={{ color: "#ffffff" }}
                      >
                        Selected Hashtags ({selectedHashtags.size})
                      </h3>
                      <Button
                        onClick={() => copyToClipboard(getSelectedHashtags())}
                        variant="primary"
                        size="sm"
                        style={{
                          backgroundColor: "#6366f1",
                          color: "#ffffff",
                          border: "none",
                        }}
                      >
                        {copiedHashtags ? (
                          <>
                            <Check className="w-4 h-4 mr-2" style={{ color: "#ffffff" }} />
                            <span style={{ color: "#ffffff" }}>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" style={{ color: "#ffffff" }} />
                            <span style={{ color: "#ffffff" }}>Copy Hashtags</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <div
                      className="p-3 rounded-lg text-sm"
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #3a3a3a",
                        color: "#a0a0a0",
                      }}
                    >
                      {getSelectedHashtags()}
                    </div>
                  </div>
                )}

                {/* Hashtags */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-lg font-semibold"
                        style={{ color: "#ffffff" }}
                      >
                        Pick Your Hashtags
                      </h3>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "#888" }}
                      >
                        Click tags to add them to your selection
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Brand Hashtags */}
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#2a2a2a", border: "1px solid #3a3a3a" }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "#3d2828" }}
                        >
                          <Hash
                            className="w-4 h-4"
                            style={{ color: "#e57373" }}
                          />
                        </div>
                        <h4
                          className="text-sm font-semibold"
                          style={{ color: "#ffffff" }}
                        >
                          Brand
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {captionData.hashtags.brand.map((tag, index) => (
                          <button
                            key={index}
                            onClick={() => toggleHashtag(tag)}
                            className="text-xs px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 font-medium"
                            style={{
                              backgroundColor: selectedHashtags.has(tag) ? "#3d2828" : "#333",
                              color: selectedHashtags.has(tag) ? "#e57373" : "#ccc",
                              border: selectedHashtags.has(tag) ? "2px solid #e57373" : "1px solid #555",
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Product Hashtags */}
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#2a2a2a", border: "1px solid #3a3a3a" }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "#2d2d4d" }}
                        >
                          <Hash
                            className="w-4 h-4"
                            style={{ color: "#818cf8" }}
                          />
                        </div>
                        <h4
                          className="text-sm font-semibold"
                          style={{ color: "#ffffff" }}
                        >
                          Product
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {captionData.hashtags.product.map((tag, index) => (
                          <button
                            key={index}
                            onClick={() => toggleHashtag(tag)}
                            className="text-xs px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 font-medium"
                            style={{
                              backgroundColor: selectedHashtags.has(tag) ? "#2d2d4d" : "#333",
                              color: selectedHashtags.has(tag) ? "#818cf8" : "#ccc",
                              border: selectedHashtags.has(tag) ? "2px solid #818cf8" : "1px solid #555",
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Community Hashtags */}
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#2a2a2a", border: "1px solid #3a3a3a" }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "#3d3d28" }}
                        >
                          <Hash
                            className="w-4 h-4"
                            style={{ color: "#fbbf24" }}
                          />
                        </div>
                        <h4
                          className="text-sm font-semibold"
                          style={{ color: "#ffffff" }}
                        >
                          Community
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {captionData.hashtags.community.map((tag, index) => (
                          <button
                            key={index}
                            onClick={() => toggleHashtag(tag)}
                            className="text-xs px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 font-medium"
                            style={{
                              backgroundColor: selectedHashtags.has(tag) ? "#3d3d28" : "#333",
                              color: selectedHashtags.has(tag) ? "#fbbf24" : "#ccc",
                              border: selectedHashtags.has(tag) ? "2px solid #fbbf24" : "1px solid #555",
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Trending Hashtags */}
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#2a2a2a", border: "1px solid #3a3a3a" }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "#3d3028" }}
                        >
                          <Hash
                            className="w-4 h-4"
                            style={{ color: "#d4a574" }}
                          />
                        </div>
                        <h4
                          className="text-sm font-semibold"
                          style={{ color: "#ffffff" }}
                        >
                          Trending
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {captionData.hashtags.trending.map((tag, index) => (
                          <button
                            key={index}
                            onClick={() => toggleHashtag(tag)}
                            className="text-xs px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 font-medium"
                            style={{
                              backgroundColor: selectedHashtags.has(tag) ? "#3d3028" : "#333",
                              color: selectedHashtags.has(tag) ? "#d4a574" : "#ccc",
                              border: selectedHashtags.has(tag) ? "2px solid #d4a574" : "1px solid #555",
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

    </>
  );

  return createPortal(modalContent, document.body);
}
