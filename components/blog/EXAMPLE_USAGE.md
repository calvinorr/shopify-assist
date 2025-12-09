# Blog Performance Components - Usage Examples

## BlogPerformanceCard

A compact card component for displaying blog post performance metrics in a grid or list.

### Basic Usage

```tsx
import { BlogPerformanceCard } from "@/components/blog";
import { useState } from "react";

function BlogPerformanceGrid() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const posts = [
    {
      id: "1",
      title: "Natural Dyeing with Madder Root: A Complete Guide",
      slug: "natural-dyeing-madder-root-guide",
      clicks: 342,
      impressions: 5234,
      ctr: 6.5,
      position: 3.2,
      trend: 12.5, // 12.5% increase
    },
    {
      id: "2",
      title: "Indigo Dyeing Techniques for Beginners",
      slug: "indigo-dyeing-techniques-beginners",
      clicks: 18,
      impressions: 892,
      ctr: 2.0,
      position: 12.8,
      trend: -5.2, // 5.2% decrease
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <BlogPerformanceCard
          key={post.id}
          post={post}
          onClick={() => setSelectedPostId(post.id)}
        />
      ))}
    </div>
  );
}
```

### Performance Badge Logic

The card automatically assigns a performance badge based on click count:
- **High** (green): 100+ clicks
- **Medium** (yellow): 20-99 clicks
- **Low** (gray): < 20 clicks

### Trend Indicator

The optional `trend` property shows percentage change (positive or negative) with color-coded indicators:
- Positive trend: Green with up arrow
- Negative trend: Red with down arrow
- No trend data: Indicator hidden

---

## PerformanceDetailModal

A detailed modal for viewing comprehensive blog post performance metrics and top search queries.

### Basic Usage

```tsx
import { BlogPerformanceCard, PerformanceDetailModal } from "@/components/blog";
import { useState } from "react";

function BlogAnalytics() {
  const [selectedPost, setSelectedPost] = useState<{
    id: string;
    title: string;
    slug: string;
  } | null>(null);

  const handleCardClick = (post: { id: string; title: string; slug: string }) => {
    setSelectedPost(post);
  };

  return (
    <>
      {/* Your blog cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BlogPerformanceCard
          post={{
            id: "1",
            title: "Natural Dyeing Guide",
            slug: "natural-dyeing-guide",
            clicks: 342,
            impressions: 5234,
            ctr: 6.5,
            position: 3.2,
          }}
          onClick={() =>
            handleCardClick({
              id: "1",
              title: "Natural Dyeing Guide",
              slug: "natural-dyeing-guide",
            })
          }
        />
      </div>

      {/* Detail modal */}
      {selectedPost && (
        <PerformanceDetailModal
          open={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          postId={selectedPost.id}
          postTitle={selectedPost.title}
          postSlug={selectedPost.slug}
        />
      )}
    </>
  );
}
```

### API Integration

The modal expects an API endpoint at `/api/analytics/blog/{postId}` that accepts a `dateRange` query parameter:

**Request:**
```
GET /api/analytics/blog/1?dateRange=28d
```

**Response:**
```json
{
  "clicks": 342,
  "impressions": 5234,
  "ctr": 6.53,
  "position": 3.2,
  "topQueries": [
    {
      "query": "natural dyeing with madder",
      "clicks": 145,
      "impressions": 2103,
      "ctr": 6.9,
      "position": 2.8
    },
    {
      "query": "madder root dyeing",
      "clicks": 98,
      "impressions": 1456,
      "ctr": 6.7,
      "position": 3.5
    }
  ],
  "lastUpdated": "2025-12-07T10:30:00Z"
}
```

### Date Range Options

The modal provides three date range options:
- **7 days** - Last week's performance
- **28 days** - Last month (default)
- **90 days** - Last quarter

### Features

1. **Large Metric Cards**: Visual display of clicks, impressions, CTR, and average position
2. **Top Search Queries Table**: Shows which queries are driving traffic to the post
3. **Date Range Selector**: Toggle between different time periods
4. **External Link**: Direct link to view the blog post on the live site
5. **Data Freshness Note**: Reminder about Google Search Console data delay
6. **Loading & Error States**: Skeleton loaders and error handling with retry option

---

## Complete Example with State Management

```tsx
"use client";

import { useState } from "react";
import { BlogPerformanceCard, PerformanceDetailModal } from "@/components/blog";

export default function BlogAnalyticsPage() {
  const [selectedPost, setSelectedPost] = useState<{
    id: string;
    title: string;
    slug: string;
  } | null>(null);

  // Mock data - replace with real data from your API
  const blogPosts = [
    {
      id: "1",
      title: "Natural Dyeing with Madder Root: A Complete Guide",
      slug: "natural-dyeing-madder-root-guide",
      clicks: 342,
      impressions: 5234,
      ctr: 6.5,
      position: 3.2,
      trend: 12.5,
    },
    {
      id: "2",
      title: "Indigo Dyeing Techniques for Beginners",
      slug: "indigo-dyeing-techniques-beginners",
      clicks: 156,
      impressions: 2891,
      ctr: 5.4,
      position: 5.1,
      trend: 8.3,
    },
    {
      id: "3",
      title: "Understanding Wool Fiber Types",
      slug: "understanding-wool-fiber-types",
      clicks: 78,
      impressions: 1456,
      ctr: 5.4,
      position: 8.7,
      trend: -2.1,
    },
  ];

  const handleOpenDetail = (post: { id: string; title: string; slug: string }) => {
    setSelectedPost(post);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Blog Performance</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogPosts.map((post) => (
          <BlogPerformanceCard
            key={post.id}
            post={post}
            onClick={() => handleOpenDetail(post)}
          />
        ))}
      </div>

      {selectedPost && (
        <PerformanceDetailModal
          open={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          postId={selectedPost.id}
          postTitle={selectedPost.title}
          postSlug={selectedPost.slug}
        />
      )}
    </div>
  );
}
```

---

## Design System Compliance

Both components follow the project's design system:

### Colors
- Uses CSS variables from `globals.css` (`--indigo`, `--weld`, `--walnut`, etc.)
- Performance badges use existing badge variants (success, warning, muted)
- Consistent hover states and transitions

### Components
- Built with existing UI primitives (Card, Badge, Button, Skeleton)
- Follows the modal pattern from CaptionModal
- Consistent spacing and typography

### Icons
- All from Lucide React library
- TrendingUp/TrendingDown for trends
- MousePointerClick for clicks
- Eye for impressions
- Search for queries
- ExternalLink for post links

### Accessibility
- Keyboard navigation support
- ARIA labels on close buttons
- Focus-visible styles
- Semantic HTML structure
