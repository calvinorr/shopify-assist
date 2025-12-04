"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface BlogPost {
  id: string;
  title: string;
  status: "draft" | "review" | "published";
  scheduledAt: string | null;
  publishedAt: string | null;
  createdAt: string;
}

interface ContentCalendarProps {
  posts: BlogPost[];
  onCreatePost?: (date: Date) => void;
}

interface DatePost {
  date: Date;
  posts: BlogPost[];
}

export function ContentCalendar({ posts, onCreatePost }: ContentCalendarProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get first and last day of current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // Get the day of week for first day (0 = Sunday)
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Total days in month
  const daysInMonth = lastDayOfMonth.getDate();

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Group posts by date
  const postsByDate = useMemo(() => {
    const grouped = new Map<string, BlogPost[]>();

    posts.forEach((post) => {
      // Determine which date to use for the post
      let postDate: Date | null = null;

      if (post.publishedAt) {
        postDate = new Date(post.publishedAt);
      } else if (post.scheduledAt) {
        postDate = new Date(post.scheduledAt);
      } else {
        // For drafts without scheduled date, use createdAt
        postDate = new Date(post.createdAt);
      }

      if (postDate) {
        const dateKey = postDate.toISOString().split("T")[0]; // YYYY-MM-DD
        if (!grouped.has(dateKey)) {
          grouped.set(dateKey, []);
        }
        grouped.get(dateKey)!.push(post);
      }
    });

    return grouped;
  }, [posts]);

  // Get posts for a specific date
  const getPostsForDate = (date: Date): BlogPost[] => {
    const dateKey = date.toISOString().split("T")[0];
    return postsByDate.get(dateKey) || [];
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Generate calendar grid
  const calendarDays: (Date | null)[] = [];

  // Add empty cells for days before the first day of month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  }

  // Handle date cell click
  const handleDateClick = (date: Date) => {
    const datePosts = getPostsForDate(date);

    if (datePosts.length === 0) {
      // No posts on this date - option to create new
      if (onCreatePost) {
        onCreatePost(date);
      }
    } else {
      // Toggle selected date to show posts
      setSelectedDate(selectedDate?.getTime() === date.getTime() ? null : date);
    }
  };

  // Handle post click
  const handlePostClick = (postId: string) => {
    router.push(`/dashboard/blog/${postId}`);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "var(--success)";
      case "review":
        return "var(--warning)";
      case "draft":
        return "var(--text-muted)";
      default:
        return "var(--indigo)";
    }
  };

  // Month and year display
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          {monthYear}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft size={18} />
          </Button>
          <Button variant="ghost" size="sm" onClick={goToNextMonth}>
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold py-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {day}
          </div>
        ))}

        {/* Calendar dates */}
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const datePosts = getPostsForDate(date);
          const isSelected = selectedDate?.getTime() === date.getTime();
          const isTodayDate = isToday(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              className="aspect-square p-2 rounded-lg border transition-all hover:shadow-md relative"
              style={{
                borderColor: isSelected
                  ? "var(--indigo)"
                  : isTodayDate
                  ? "var(--weld)"
                  : "var(--card-border)",
                backgroundColor: isSelected
                  ? "var(--indigo-light)"
                  : "var(--card-bg)",
                borderWidth: isSelected || isTodayDate ? "2px" : "1px",
              }}
            >
              {/* Date number */}
              <div
                className="text-sm font-medium mb-1"
                style={{
                  color: isTodayDate ? "var(--weld)" : "var(--text-primary)",
                }}
              >
                {date.getDate()}
              </div>

              {/* Post indicators */}
              {datePosts.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {datePosts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: getStatusColor(post.status),
                      }}
                      title={post.title}
                    />
                  ))}
                  {datePosts.length > 3 && (
                    <div
                      className="text-xs font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      +{datePosts.length - 3}
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t" style={{ borderColor: "var(--card-border)" }}>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "var(--text-muted)" }}
          />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Draft
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "var(--warning)" }}
          />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Review
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "var(--success)" }}
          />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Published
          </span>
        </div>
      </div>

      {/* Selected Date Posts */}
      {selectedDate && (
        <div
          className="mt-4 p-4 rounded-lg border"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (onCreatePost) {
                  onCreatePost(selectedDate);
                }
              }}
            >
              <Plus size={16} className="mr-2" />
              New Post
            </Button>
          </div>

          <div className="space-y-2">
            {getPostsForDate(selectedDate).map((post) => (
              <button
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className="w-full text-left p-3 rounded-lg border transition-all hover:shadow-sm"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getStatusColor(post.status) }}
                      />
                      <span
                        className="font-medium text-sm"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {post.title}
                      </span>
                    </div>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
