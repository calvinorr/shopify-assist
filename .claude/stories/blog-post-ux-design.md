# Story: Blog Post UX Improvements

**Epic:** See `.claude/epic.md`
**Status:** complete
**Priority:** P1
**Created:** 2024-12-05
**Updated:** 2024-12-05
**Completed:** 2024-12-05

## Objective
Improve blog post UX with database-backed idea persistence, cleaner layout, and real-time SEO guidance.

## Acceptance Criteria

### Part 1: Database-Backed Blog Ideas
- [x] `blog_ideas` table created with status tracking (active/used/dismissed)
- [x] Blog ideas load from database (no regeneration on page refresh)
- [x] "Refresh" button generates 3 new ideas (marks old as dismissed)
- [x] Dismissed ideas tracked (won't reappear)
- [x] "Start This Post" marks idea as used + links to created post

### Part 2: Ideas Panel Layout
- [x] Ideas panel shows 3 uniform-height cards (no horizontal scroll)
- [x] Cards use grid layout (1 col mobile, 3 col desktop)
- [x] Title and hook use line-clamp for consistent sizing
- [x] Keywords + button pinned to bottom of card

### Part 3: Blog Editor Sidebar
- [x] Excerpt field has 5 rows + resizable
- [x] Character counter shows X/160 with color warning

### Part 4: Real-Time SEO Guidance
- [x] SEO panel in editor shows real-time score
- [x] Each SEO criterion shows pass/fail with actionable hint
- [x] SEO hints update as user types (via useMemo)
- [x] Shared `lib/seo.ts` utility for scoring logic

## Files to Modify
- `lib/schema.ts` - Add blogIdeas table
- `app/api/blog/ideas/route.ts` - Read from DB, generate if needed
- `app/api/blog/ideas/refresh/route.ts` - Force regenerate
- `app/api/blog/ideas/[id]/route.ts` - PATCH status
- `components/blog/ideas-panel.tsx` - DB-backed, 3-card grid
- `app/dashboard/blog/new/page.tsx` - SEO panel, expand excerpt
- `app/dashboard/blog/[id]/page.tsx` - SEO panel, expand excerpt
- `components/blog/seo-panel.tsx` - Real-time SEO guidance
- `lib/seo.ts` - Shared SEO scoring

## Test Plan
- [ ] Page refresh shows same ideas (from DB)
- [ ] Refresh button generates new ideas
- [ ] Dismiss removes idea, doesn't return
- [ ] Start This Post creates draft, marks idea used
- [ ] SEO score updates in real-time while typing
- [ ] All hints are actionable and accurate
