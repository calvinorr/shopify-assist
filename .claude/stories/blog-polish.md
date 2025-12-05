# Story: Blog Polish & Refinements

**Epic:** See `.claude/epic.md`
**Status:** not-started
**Priority:** P1
**Created:** 2024-12-05
**Updated:** 2024-12-05

## Objective
Polish the blog posting experience to 100% completion with remaining UX refinements, edge case handling, and quality-of-life improvements.

## Context
Blog posting is currently ~80% complete. Core features are working:
- Ideas generation with DB persistence
- 3-card grid layout
- SEO panel with real-time hints
- Scheduling with calendar view
- Start This Post scaffolding

## Remaining Work (20%)

### UX Polish
- [ ] Review and test idea dismissal flow
- [ ] Ensure "Start This Post" correctly links idea to created post
- [ ] Test calendar drag-drop (if time permits - stretch goal)
- [ ] Verify mobile responsiveness of blog page

### Edge Cases
- [ ] Handle empty state when no ideas exist
- [ ] Handle API errors gracefully in ideas panel
- [ ] Test scheduling edge cases (past dates, timezone handling)
- [ ] Verify autosave doesn't conflict with manual save

### SEO Panel Refinements
- [ ] Test all 6 SEO criteria with real content
- [ ] Ensure hints update correctly as content changes
- [ ] Consider adding focus keyword field separate from tags

### Content Calendar
- [ ] Verify posts display on correct dates
- [ ] Test month navigation
- [ ] Ensure click-to-schedule creates draft correctly

### Performance
- [ ] Review API call frequency (avoid excessive regeneration)
- [ ] Ensure ideas fetch is fast (DB read, not AI generation)
- [ ] Profile page load time

## Acceptance Criteria
- [ ] All blog features work reliably without errors
- [ ] Mobile experience is usable
- [ ] SEO panel provides accurate, helpful feedback
- [ ] Ideas persist and don't regenerate unnecessarily
- [ ] User can go from idea → published post in < 5 minutes

## Test Plan
- [ ] Create a blog post from idea → publish (full workflow)
- [ ] Test on mobile device
- [ ] Verify SEO score changes correctly as content is edited
- [ ] Check calendar shows correct posts on correct dates
- [ ] Confirm refresh generates new ideas, dismiss removes them

## Notes
This story is for polish only - no new features.
Focus on stability, reliability, and edge cases.
