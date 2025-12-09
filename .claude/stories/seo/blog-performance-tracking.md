# Story: Blog Performance Tracking

**Epic:** `epics/seo-content-intelligence.md`
**Status:** complete
**Priority:** P0
**Created:** 2024-12-08
**Updated:** 2024-12-09 11:15

## Objective
Show which blog posts are driving organic traffic by linking GSC page data to blog entries.

## Acceptance Criteria

### Analytics Enhancement
- [x] Fetch page-level GSC data (not just domain-level)
- [x] Match GSC URLs to blog posts in database
- [x] Show per-blog-post metrics: clicks, impressions, CTR, avg position
- [x] Sort blog posts by organic traffic
- [x] Trend indicator (up/down vs previous period)

### Blog Command Center Integration
- [x] Add "Performance" column or badge to blog list
- [x] Show top 3 performing posts on dashboard
- [x] "Needs Attention" flag for declining posts

### New UI Components
- [x] Blog performance card (mini sparkline + key metrics)
- [x] Performance detail modal with query breakdown
- [x] Date range selector for comparison

## Implementation Notes

### GSC API for Page Data
```javascript
// Query GSC with page dimension
searchanalytics.query({
  siteUrl: 'sc-domain:herbariumdyeworks.com',
  dimensions: ['page'],
  startDate: '2024-11-08',
  endDate: '2024-12-08'
})
```

### URL Matching Strategy
- GSC returns full URLs: `https://herbariumdyeworks.com/blogs/...`
- Blog posts have slugs in database
- Need to extract slug and match

### Data Freshness
- GSC data has 2-3 day delay
- Show "Last updated" timestamp
- Consider caching/storing daily snapshots

## Test Plan
- [x] Page-level GSC query returns data
- [x] URLs correctly matched to blog posts
- [x] Metrics display on blog list
- [x] Date range filter works
- [x] Build passes

## Completion Evidence

**Completed:** 2024-12-09

### Files Created/Modified:
- `app/api/analytics/blog-performance/route.ts` - Main API endpoint for blog performance data
- `app/api/analytics/blog/[postId]/route.ts` - Individual post performance with query breakdown
- `components/blog/BlogPerformanceCard.tsx` - Performance card component
- `components/blog/PerformanceDetailModal.tsx` - Detailed modal with queries
- `app/dashboard/blog/page.tsx` - Added performance badges to blog list
- `components/dashboard/dashboard-content.tsx` - Added top performers section

### Features Delivered:
1. **API Endpoints**: Two new endpoints for performance data
2. **Blog List**: Performance badge (High/Med/Low) with trend arrows
3. **Dashboard**: Top 3 performing posts section
4. **Modal**: Date range selector (7d/28d/90d) with query breakdown
5. **Comparison**: Previous period comparison with change indicators

### Build Status:
✅ Production build passes with no errors
