"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit,
  Copy,
  Image as ImageIcon,
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

interface DraftsListProps {
  posts: InstagramPost[];
  isLoading?: boolean;
  onEdit?: (post: InstagramPost) => void;
  onDelete?: (id: string) => void;
  onMarkPosted?: (id: string) => void;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusConfig(status: InstagramPost["status"]) {
  switch (status) {
    case "draft":
      return { icon: FileText, variant: "muted" as const, label: "Draft" };
    case "scheduled":
      return { icon: Clock, variant: "indigo" as const, label: "Scheduled" };
    case "posted":
      return { icon: CheckCircle, variant: "success" as const, label: "Posted" };
    case "failed":
      return { icon: AlertCircle, variant: "danger" as const, label: "Failed" };
  }
}

function truncateCaption(caption: string, maxLength = 100): string {
  if (caption.length <= maxLength) return caption;
  return caption.substring(0, maxLength).trim() + "...";
}

export function DraftsList({
  posts,
  isLoading = false,
  onEdit,
  onDelete,
  onMarkPosted,
}: DraftsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-3">
            <div className="flex gap-3">
              <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FileText
          className="h-12 w-12 mx-auto mb-4"
          style={{ color: "var(--text-muted)" }}
        />
        <h3
          className="text-lg font-medium mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          No drafts yet
        </h3>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Create your first Instagram post to get started
        </p>
      </Card>
    );
  }

  const handleCopyCaption = (post: InstagramPost) => {
    const fullText = `${post.caption}\n\n${post.hashtags.join(" ")}`;
    navigator.clipboard.writeText(fullText);
  };

  return (
    <div className="space-y-2">
      {posts.map((post) => {
        const statusConfig = getStatusConfig(post.status);
        const StatusIcon = statusConfig.icon;
        const isPosted = post.status === "posted";

        return (
          <Card
            key={post.id}
            className="p-3 hover:shadow-md transition-shadow"
          >
            <div className="flex gap-3 items-start">
              {/* Thumbnail */}
              <div
                className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: "var(--background)" }}
              >
                {post.imageUrls[0] ? (
                  <img
                    src={post.imageUrls[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon
                    className="h-5 w-5"
                    style={{ color: "var(--text-muted)" }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p
                    className="text-sm truncate flex-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {post.caption || "No caption"}
                  </p>
                  <Badge variant={statusConfig.variant} size="sm" className="flex-shrink-0">
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig.label}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>
                    {isPosted && post.postedTime
                      ? `Posted ${formatDate(post.postedTime)}`
                      : formatDate(post.updatedAt)}
                  </span>
                  {post.hashtags.length > 0 && (
                    <>
                      <span>·</span>
                      <span>{post.hashtags.length} hashtags</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {!isPosted && onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(post)}
                    className="h-8 w-8 p-0"
                    title="Edit"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyCaption(post)}
                  className="h-8 w-8 p-0"
                  title="Copy caption"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                {post.status === "draft" && onMarkPosted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkPosted(post.id)}
                    className="h-8 w-8 p-0"
                    style={{ color: "var(--success)" }}
                    title="Mark as posted"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                  </Button>
                )}
                {!isPosted && onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(post.id)}
                    className="h-8 w-8 p-0"
                    style={{ color: "var(--danger)" }}
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
