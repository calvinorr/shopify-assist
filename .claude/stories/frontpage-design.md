# Story: Frontpage Design

**Epic:** See `.claude/epic.md`
**Status:** complete
**Priority:** P0
**Created:** 2024-12-03
**Updated:** 2024-12-03

## Objective
Redesign the dashboard homepage to focus on content creation and posting, encouraging users to create new social media content with AI-powered suggestions.

## Acceptance Criteria
- [ ] Dashboard prominently displays "Create New Post" action
- [ ] Shows AI-generated content ideas/suggestions for new posts
- [ ] Displays recent drafts and scheduled posts
- [ ] Quick access to create: Instagram post, Blog post, Caption
- [ ] De-emphasize product stats (move to Products page)
- [ ] Content calendar or upcoming posts widget
- [ ] "What to post today" inspiration section

## Implementation Notes

### Current State
- Dashboard currently shows product stats (298 products, color breakdown)
- Focus is on inventory rather than content creation

### New Design Direction
Based on PRD goals:
- Primary action: Create content
- AI suggestions based on: trending products, seasonal themes, recent sales
- Quick-start templates for common post types
- Show draft posts that need attention

### Layout Concept
```
+----------------------------------+
| Welcome back! Ready to create?   |
+----------------------------------+
| [+ New Post]  [+ Blog]  [+ Idea] |
+----------------------------------+
| AI Suggestions      | Drafts     |
| - "Feature your     | - Post 1   |
|   madder reds..."   | - Post 2   |
| - "Winter wool      |            |
|   care tips"        |            |
+----------------------------------+
| Upcoming Posts      | Quick Stats|
| Calendar view       | (minimal)  |
+----------------------------------+
```

### Components to Create/Update
- `components/dashboard/content-actions.tsx` - Quick action buttons
- `components/dashboard/ai-suggestions.tsx` - AI content ideas
- `components/dashboard/drafts-widget.tsx` - Recent drafts
- `components/dashboard/content-calendar.tsx` - Upcoming posts
- Update `app/dashboard/page.tsx` - New layout

## Test Plan
- [ ] Dashboard loads with content-first layout
- [ ] "Create Post" buttons navigate to correct pages
- [ ] AI suggestions display (can be placeholder initially)
- [ ] Drafts widget shows real blog drafts from database
- [ ] Mobile responsive design works

## Completion Evidence
_Filled when complete_
