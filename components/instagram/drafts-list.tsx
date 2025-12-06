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
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex gap-4">
              <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
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
    <div className="space-y-3">
      {posts.map((post) => {
        const statusConfig = getStatusConfig(post.status);
        const StatusIcon = statusConfig.icon;

        return (
          <Card
            key={post.id}
            className="p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div
                className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
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
                    className="h-6 w-6"
                    style={{ color: "var(--text-muted)" }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className="text-sm line-clamp-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {post.caption || "No caption"}
                  </p>
                  <Badge variant={statusConfig.variant} size="sm">
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig.label}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {formatDate(post.updatedAt)}
                  </span>
                  {post.hashtags.length > 0 && (
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {post.hashtags.length} hashtags
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(post)}
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyCaption(post)}
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy
                  </Button>
                  {post.status === "draft" && onMarkPosted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkPosted(post.id)}
                      style={{ color: "var(--success)" }}
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Mark Posted
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(post.id)}
                      style={{ color: "var(--danger)" }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
