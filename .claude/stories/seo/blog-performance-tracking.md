# Story: Blog Performance Tracking

**Epic:** `epics/seo-content-intelligence.md`
**Status:** not-started
**Priority:** P0
**Created:** 2024-12-08
**Updated:** 2024-12-08

## Objective
Show which blog posts are driving organic traffic by linking GSC page data to blog entries.

## Acceptance Criteria

### Analytics Enhancement
- [ ] Fetch page-level GSC data (not just domain-level)
- [ ] Match GSC URLs to blog posts in database
- [ ] Show per-blog-post metrics: clicks, impressions, CTR, avg position
- [ ] Sort blog posts by organic traffic
- [ ] Trend indicator (up/down vs previous period)

### Blog Command Center Integration
- [ ] Add "Performance" column or badge to blog list
- [ ] Show top 3 performing posts on dashboard
- [ ] "Needs Attention" flag for declining posts

### New UI Components
- [ ] Blog performance card (mini sparkline + key metrics)
- [ ] Performance detail modal with query breakdown
- [ ] Date range selector for comparison

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
- [ ] Page-level GSC query returns data
- [ ] URLs correctly matched to blog posts
- [ ] Metrics display on blog list
- [ ] Date range filter works
- [ ] Build passes

## Completion Evidence
_Filled when complete_
