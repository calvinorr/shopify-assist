# Story: Blog New Post Consistency

**Epic:** `.claude/epic.md`
**Status:** complete
**Priority:** P0
**Created:** 2024-12-08
**Updated:** 2024-12-08 09:00

## Objective
Ensure "New Blog Post" behaves consistently across the app - always offering AI-powered creation rather than a blank template.

## Problem
- **Dashboard Quick Actions**: "New Blog Post" → opens blank editor at `/dashboard/blog/new`
- **Blog Page Ideas Panel**: "Start This Post" → calls `/api/ai/blog/scaffold` → opens editor with AI-generated content

Users expect the same experience regardless of entry point.

## Acceptance Criteria
- [x] Dashboard "New Blog Post" button navigates to Blog page instead of blank editor
- [x] Blog page has clear "New Post" entry point (not just idea cards)
- [x] User can still create a blank post if desired (secondary option)
- [x] Navigation flow feels natural and consistent

## Implementation Approach

### Option A: Redirect to Blog Page (Recommended)
Change Dashboard "New Blog Post" to navigate to `/dashboard/blog` where:
1. Ideas panel is prominently displayed
2. Add a "Start from scratch" option below ideas

### Option B: Add Modal Choice
When clicking "New Blog Post" anywhere:
1. Show modal: "Start with AI idea" or "Start blank"
2. AI idea → redirect to blog page ideas
3. Start blank → go to `/dashboard/blog/new`

## Files to Modify
- `components/dashboard/quick-actions.tsx` - Change link destination
- `components/blog/ideas-panel.tsx` - Add "Start blank" option (optional)

## Test Plan
1. Click "New Blog Post" from Dashboard → lands on Blog page
2. Click an idea card → AI scaffold works as before
3. Verify "Start from scratch" option exists and works
4. Navigation feels intuitive, no dead ends

## Completion Evidence
- Build: Passes
- Changes:
  - `quick-actions.tsx`: Changed link from `/dashboard/blog/new` to `/dashboard/blog`
  - `ideas-panel.tsx`: Added "Or start with a blank post" link below ideas grid and in empty state
- Verified: 2024-12-08
