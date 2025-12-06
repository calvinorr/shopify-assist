"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProductImagePicker } from "./product-image-picker";
import {
  Image as ImageIcon,
  Sparkles,
  Copy,
  Check,
  Save,
  Loader2,
  X,
  Hash,
  Package,
  Wand2,
} from "lucide-react";

interface SelectedProduct {
  id: string;
  name: string;
  color: string | null;
}

interface PostComposerProps {
  initialCaption?: string;
  initialHashtags?: string[];
  initialImageUrl?: string;
  postId?: string;
  onSave?: (data: { caption: string; hashtags: string[]; imageUrl?: string }) => Promise<void>;
  onCancel?: () => void;
}

const CAPTION_MAX_LENGTH = 2200;

const HASHTAG_CATEGORIES = {
  craft: ["#handdyed", "#naturaldye", "#fibercrafts", "#yarnlove", "#slowfashion"],
  color: ["#indigodye", "#plantdyed", "#botanicaldye", "#madder", "#weld"],
  community: ["#makersgonnamake", "#fiberartist", "#knittersofinstagram", "#weaversofinstagram"],
  brand: ["#herbariumdyeworks", "#herbarium"],
};

export function PostComposer({
  initialCaption = "",
  initialHashtags = [],
  initialImageUrl,
  postId,
  onSave,
  onCancel,
}: PostComposerProps) {
  const [caption, setCaption] = useState(initialCaption);
  const [hashtags, setHashtags] = useState<string[]>(initialHashtags);
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl);
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const characterCount = caption.length;
  const isOverLimit = characterCount > CAPTION_MAX_LENGTH;

  const handleGenerateCaption = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: "Instagram post for Herbarium Dyeworks - hand-dyed wool and natural dyes",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.captions?.[0]) {
          setCaption(data.captions[0].text);
        }
        if (data.hashtags) {
          const allTags = [
            ...(data.hashtags.niche || []),
            ...(data.hashtags.community || []),
            ...(data.hashtags.brand || []),
          ].slice(0, 15);
          setHashtags(allTags);
        }
      }
    } catch (error) {
      console.error("Failed to generate caption:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave({ caption, hashtags, imageUrl });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToClipboard = useCallback(() => {
    const fullText = `${caption}\n\n${hashtags.join(" ")}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [caption, hashtags]);

  const handleSelectProductImage = (
    newImageUrl: string,
    product: { id: string; name: string; color: string | null }
  ) => {
    setImageUrl(newImageUrl);
    setSelectedProduct(product);
    setShowImagePicker(false);

    // Generate product-specific hashtags
    if (product.color) {
      const colorTag = `#${product.color.toLowerCase().replace(/\s+/g, "")}`;
      if (!hashtags.includes(colorTag)) {
        setHashtags((prev) => [...prev, colorTag]);
      }
    }
  };

  const handleRefineCaption = async () => {
    if (!selectedProduct || !caption.trim()) return;

    setIsRefining(true);
    try {
      const res = await fetch("/api/ai/caption/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption,
          productName: selectedProduct.name,
          productColor: selectedProduct.color,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.caption) {
          setCaption(data.caption);
        }
      }
    } catch (error) {
      console.error("Failed to refine caption:", error);
    } finally {
      setIsRefining(false);
    }
  };

  const toggleHashtag = (tag: string) => {
    if (hashtags.includes(tag)) {
      setHashtags(hashtags.filter((t) => t !== tag));
    } else {
      setHashtags([...hashtags, tag]);
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-6">
      {/* Product Image Picker Modal */}
      {showImagePicker && (
        <ProductImagePicker
          onSelect={handleSelectProductImage}
          onClose={() => setShowImagePicker(false)}
          selectedImageUrl={imageUrl}
        />
      )}

      {/* Image Preview */}
      <Card className="overflow-hidden">
        <div
          className="aspect-square flex items-center justify-center relative"
          style={{ backgroundColor: "var(--background)" }}
        >
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt="Post preview"
                className="w-full h-full object-cover"
              />
              {/* Selected product badge */}
              {selectedProduct && (
                <div
                  className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-lg flex items-center gap-2"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <Package className="h-4 w-4 text-white flex-shrink-0" />
                  <span className="text-white text-sm font-medium truncate">
                    {selectedProduct.name}
                  </span>
                  {selectedProduct.color && (
                    <Badge variant="muted" size="sm">
                      {selectedProduct.color}
                    </Badge>
                  )}
                </div>
              )}
              {/* Change image button */}
              <Button
                variant="outline"
                size="sm"
                className="absolute top-3 right-3"
                onClick={() => setShowImagePicker(true)}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                }}
              >
                Change
              </Button>
            </>
          ) : (
            <div className="text-center p-8">
              <ImageIcon
                className="h-16 w-16 mx-auto mb-4"
                style={{ color: "var(--text-muted)" }}
              />
              <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                Select an image from your products
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowImagePicker(true)}
                style={{ backgroundColor: "var(--indigo)" }}
              >
                <Package className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Caption */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Caption
          </label>
          <span
            className="text-xs"
            style={{ color: isOverLimit ? "var(--danger)" : "var(--text-muted)" }}
          >
            {characterCount}/{CAPTION_MAX_LENGTH}
          </span>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write your caption..."
          rows={6}
          error={isOverLimit}
        />
        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateCaption}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? "Generating..." : "Generate with AI"}
          </Button>

          {selectedProduct && caption.trim() && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefineCaption}
              disabled={isRefining}
            >
              {isRefining ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4 mr-2" />
              )}
              {isRefining ? "Refining..." : `Refine for ${selectedProduct.name.split(" ").slice(0, 2).join(" ")}`}
            </Button>
          )}
        </div>
      </div>

      {/* Selected Hashtags */}
      {hashtags.length > 0 && (
        <div>
          <label
            className="text-sm font-medium mb-2 block"
            style={{ color: "var(--text-primary)" }}
          >
            Selected Hashtags ({hashtags.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <Badge
                key={tag}
                variant="indigo"
                className="cursor-pointer"
                onClick={() => removeHashtag(tag)}
              >
                {tag}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Hashtag Suggestions */}
      <div>
        <label
          className="text-sm font-medium mb-3 block flex items-center gap-2"
          style={{ color: "var(--text-primary)" }}
        >
          <Hash className="h-4 w-4" />
          Suggested Hashtags
        </label>
        <div className="space-y-3">
          {Object.entries(HASHTAG_CATEGORIES).map(([category, tags]) => (
            <div key={category}>
              <p
                className="text-xs uppercase tracking-wide mb-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                {category}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={hashtags.includes(tag) ? "indigo" : "muted"}
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => toggleHashtag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div
        className="flex items-center justify-between pt-4 border-t"
        style={{ borderColor: "var(--card-border)" }}
      >
        <Button variant="outline" size="md" onClick={handleCopyToClipboard}>
          {copied ? (
            <Check className="h-4 w-4 mr-2" style={{ color: "var(--success)" }} />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? "Copied!" : "Copy to Clipboard"}
        </Button>

        <div className="flex gap-2">
          {onCancel && (
            <Button variant="ghost" size="md" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={isSaving || isOverLimit}
            style={{ backgroundColor: "var(--indigo)" }}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving ? "Saving..." : postId ? "Update Draft" : "Save Draft"}
          </Button>
        </div>
      </div>
    </div>
  );
}
