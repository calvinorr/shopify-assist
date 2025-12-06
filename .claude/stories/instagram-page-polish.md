# Story: Instagram Page Polish

**Epic:** See `.claude/epic.md`
**Status:** complete
**Priority:** P0
**Created:** 2025-12-06
**Updated:** 2025-12-06 12:30

## Objective
Redesign the Instagram page layout to eliminate wasted space and fit all content on one screen without scrolling.

## Acceptance Criteria
- [x] All content visible on one screen without scrolling (1080p viewport)
- [x] Multi-column layout utilizing full width (no blank right side)
- [x] Visually polished, professional appearance
- [x] Maintains all existing functionality (composer, drafts, product picker)
- [x] Responsive design that works on different screen sizes

## Current Problems
- ~~Single column layout down the left side~~ FIXED
- ~~Large blank space on the right~~ FIXED
- ~~Requires unnecessary scrolling~~ FIXED
- ~~Inefficient use of screen real estate~~ FIXED

## Implementation Notes
### Changes Made:

**Instagram Page (`app/dashboard/instagram/page.tsx`)**
- Removed full-width Connection Status Banner - moved to header as compact badge
- Removed Manual Posting Instructions card
- Connection status now shows as "Connected" / "Not Connected" badge next to header
- Dynamic header title: "Instagram" → "Create Post" / "Edit Post"
- Fixed height content area with overflow

**PostComposer (`components/instagram/post-composer.tsx`)**
- Changed from vertical to 2-column horizontal layout
- Left column: Image preview (h-80, not aspect-square)
- Right column: Caption, hashtags, actions
- Reduced textarea from 6 rows to 4
- Compact hashtag suggestions (category per row)
- Shorter button labels

**DraftsList (`components/instagram/drafts-list.tsx`)**
- Smaller thumbnails: 48x48 instead of 64x64
- Reduced card padding: p-3 instead of p-4
- Single-line caption (truncate)
- Icon-only action buttons
- Tighter spacing between cards
- ~40% more items visible in same space

## Test Plan
- [x] Visual inspection at 1080p - fits without scrolling
- [x] Build passes with no errors
- [x] All functionality preserved

## Completion Evidence
- Build: ✅ Passed
- Files changed: 3 (page.tsx, post-composer.tsx, drafts-list.tsx)
- Lines removed: ~150 (banners, verbose layout)
- Layout: Side-by-side composer, compact drafts list
