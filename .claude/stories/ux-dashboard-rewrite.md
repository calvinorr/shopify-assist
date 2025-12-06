# Story: UX Dashboard Rewrite

**Epic:** See `.claude/epic.md`
**Status:** complete
**Priority:** P0
**Created:** 2024-12-05
**Updated:** 2024-12-05 20:20

## Objective
Redesign the dashboard as a focused content creation hub with AI-powered ideas at the forefront, removing clutter that doesn't drive content creation.

## Acceptance Criteria
- [x] Top section: 3 blog post idea cards (minimal but informative)
- [x] Second section: 3 Instagram post idea cards (minimal but informative)
- [x] Third section: Content motivation card (drafts count, next scheduled, days since last post)
- [x] Remove inventory, product stats, and other non-content-focused cards
- [x] Layout is clean, consistent, and not cluttered
- [x] Ideas are actionable - clicking an idea starts the creation flow

## Implementation Notes

### Card Design (Blog & Instagram Ideas)
- Minimal: title/hook, content type indicator, one-click to start
- Could show: suggested product tie-in, seasonal relevance
- Lazy load ideas on page load from Gemini

### Motivation Section
Replace current stats with content-focused metrics:
- Draft count (with link to drafts)
- Next scheduled post (date + title preview)
- Days since last blog/Instagram post (gentle nudge)
- Maybe: "This week's goal: 2 posts" progress bar

### Layout Structure
```
┌─────────────────────────────────────────┐
│  Blog Ideas (3 cards)                   │
│  [Idea 1]  [Idea 2]  [Idea 3]          │
├─────────────────────────────────────────┤
│  Instagram Ideas (3 cards)              │
│  [Idea 1]  [Idea 2]  [Idea 3]          │
├─────────────────────────────────────────┤
│  Your Content Status                    │
│  [Drafts: 2] [Next: Dec 8] [Last: 5d]  │
└─────────────────────────────────────────┘
```

### What to Remove
- Inventory stats
- Product count cards
- Any cards not directly related to content creation

## Test Plan
- [x] Dashboard loads in < 2s
- [x] Ideas render correctly (fallback if API fails)
- [x] Clicking idea navigates to correct editor with context
- [x] Motivation metrics show accurate data
- [ ] Mobile responsive (needs manual verification)

## Completion Evidence

### Files Created/Modified
- `components/dashboard/idea-card.tsx` - Unified card for blog/Instagram ideas
- `components/dashboard/content-motivation.tsx` - Content status section
- `components/dashboard/dashboard-content.tsx` - Complete rewrite with new layout
- `app/api/ai/suggestions/route.ts` - Updated to return 3 blog ideas
- `app/dashboard/blog/new/page.tsx` - Reads query params from idea cards
- `app/dashboard/instagram/page.tsx` - Reads query params and auto-opens composer

### What Was Removed
- QuickActions (sync button moved elsewhere)
- QuickStats (inventory/product counts)
- ActivityFeed (redundant)
- DataContextSection (colors, recent products)
- AISuggestions old component structure

### New Flow
1. Dashboard shows 3 blog ideas + 3 Instagram ideas
2. Clicking blog idea → `/dashboard/blog/new?title=...&description=...&keywords=...`
3. Clicking Instagram idea → `/dashboard/instagram?newPost=true&title=...&description=...`
4. Content motivation section shows drafts, next scheduled, days since last post
