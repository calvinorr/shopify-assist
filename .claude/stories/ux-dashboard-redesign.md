# Story: Dashboard Redesign

**Priority:** P1
**Status:** complete
**Epic:** UX/UI Professional Polish

## Overview

Transform the dashboard into an engaging, actionable command center that loads fast, surfaces key insights at a glance, and guides users to their next action.

## Current State

- Dashboard has: Hero section, AI suggestions, data context, drafts widget, quick stats
- Issues: Generic layout, no quick actions, stats at bottom (de-emphasized), no content summary

## User Requirements

1. **Quick Actions** - Primary CTAs: "New Blog Post", "Sync Products", "Generate Ideas"
2. **Content Stats** - Visible counts: drafts, published, scheduled posts
3. **Actionable Insights** - Clear "what to do next" guidance
4. **Progress Tracking** - Visual indicator of content creation momentum
5. **Future Placeholder** - Space for sales correlation analytics

## Design Goals

- **Fast Load** - Critical data visible in <500ms
- **Glanceable** - Key metrics scannable in 2 seconds
- **Actionable** - Clear next steps, not just information display
- **Engaging** - Feels alive, reflects real activity

## Acceptance Criteria

### Quick Actions Section
- [x] Prominent "New Blog Post" button (primary CTA)
- [x] "Sync Products" with last sync timestamp
- [x] "Generate Ideas" quick access
- [x] Actions render above fold

### Content Stats Panel
- [x] Draft count with "Continue Writing" link to most recent
- [x] Published posts count (all time or this month)
- [x] Scheduled posts count with next publish date
- [x] Stats use consistent badge/pill styling

### Activity Summary
- [x] "This Week" summary: posts created, products added
- [x] Recent activity feed (last 3-5 items)
- [x] Visual timeline or simple list format

### Layout Improvements
- [x] Move quick stats from bottom to top section
- [x] Reduce vertical scroll needed for key info
- [x] Better visual hierarchy with section headers
- [x] Consistent card sizing and spacing

### Performance
- [x] Skeleton loaders for each section (not full-page spinner)
- [x] Parallel API calls for independent data
- [x] No layout shift as data loads

## Technical Notes

- Update `components/dashboard/dashboard-content.tsx`
- May split into smaller components: `QuickActions`, `ContentStats`, `ActivityFeed`
- Consider SWR for data caching and background revalidation
- Existing components to refactor: `HeroSection`, `QuickStats`

## Out of Scope

- Sales analytics (future story)
- Advanced filtering on dashboard
- Customizable widget positions

## Files to Modify

- `components/dashboard/dashboard-content.tsx`
- `components/dashboard/hero-section.tsx`
- `components/dashboard/quick-stats.tsx`
- New: `components/dashboard/quick-actions.tsx`
- New: `components/dashboard/content-stats.tsx`
- New: `components/dashboard/activity-feed.tsx`

## Design Reference

```
┌─────────────────────────────────────────────────────┐
│ Quick Actions                                        │
│ [+ New Blog Post]  [↻ Sync Products]  [✨ Ideas]    │
└─────────────────────────────────────────────────────┘

┌──────────────────────┐ ┌──────────────────────────────┐
│ Content Stats        │ │ AI Suggestions               │
│ 3 Drafts • 12 Pub.   │ │ [Instagram idea cards...]    │
│ 1 Scheduled (Dec 8)  │ │                              │
│ [Continue Draft →]   │ │                              │
└──────────────────────┘ └──────────────────────────────┘

┌──────────────────────┐ ┌──────────────────────────────┐
│ Recent Activity      │ │ Data Context                 │
│ • Draft saved (2h)   │ │ Top Colors: ...              │
│ • Post published     │ │ Recent Products: ...         │
│ • Products synced    │ │                              │
└──────────────────────┘ └──────────────────────────────┘
```
