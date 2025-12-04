import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Draft {
  id: string;
  title: string;
  updatedAt: string; // ISO date string
}

interface DraftsWidgetProps {
  drafts: Draft[];
  isLoading?: boolean;
}

/**
 * Format a date as relative time (e.g., "2 days ago", "5 hours ago")
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
}

export function DraftsWidget({ drafts, isLoading = false }: DraftsWidgetProps) {
  // Show up to 3 drafts
  const displayedDrafts = drafts.slice(0, 3);
  const isEmpty = drafts.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Draft Posts</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 rounded-lg animate-pulse"
                style={{ backgroundColor: 'var(--card-border)' }}
              />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="text-center py-6">
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
              No drafts - Start fresh!
            </p>
            <Link
              href="/dashboard/blog"
              className="text-sm font-medium hover:underline"
              style={{ color: 'var(--indigo)' }}
            >
              Create New Post
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {displayedDrafts.map((draft) => (
                <Link
                  key={draft.id}
                  href={`/dashboard/blog/${draft.id}`}
                  className="block group"
                >
                  <div
                    className="flex items-start gap-3 p-3 rounded-lg transition-colors"
                    style={{
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--card-border)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <FileText
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      style={{ color: 'var(--text-muted)' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate group-hover:underline"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {draft.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {formatRelativeTime(draft.updatedAt)}
                      </p>
                    </div>
                    <span
                      className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--indigo)' }}
                    >
                      Edit
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {drafts.length > 3 && (
              <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--card-border)' }}>
                <Link
                  href="/dashboard/blog"
                  className="text-sm font-medium hover:underline"
                  style={{ color: 'var(--indigo)' }}
                >
                  View All Drafts ({drafts.length})
                </Link>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
