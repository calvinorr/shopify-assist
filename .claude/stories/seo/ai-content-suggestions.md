# Story: AI Content Suggestions from GSC

**Epic:** `epics/seo-content-intelligence.md`
**Status:** not-started
**Priority:** P1
**Created:** 2024-12-08
**Updated:** 2024-12-08

## Objective
Use Gemini AI to analyze GSC data and generate specific, actionable content recommendations.

## Acceptance Criteria

### AI Analysis Pipeline
- [ ] Feed top 50 search queries to Gemini with context
- [ ] Include: query, impressions, clicks, position
- [ ] Include: existing blog post titles for gap detection
- [ ] Return structured recommendations

### Recommendation Types
- [ ] **New Blog Post Ideas** - Based on queries with no matching content
- [ ] **Optimize Existing** - Posts that rank but could improve
- [ ] **Quick Wins** - Position 8-15 queries (almost page 1)
- [ ] **Long-tail Opportunities** - Specific queries to target

### Dashboard Integration
- [ ] "AI Insights" section on dashboard (refresh weekly)
- [ ] 3-5 actionable recommendations with priority
- [ ] One-click to create blog from recommendation
- [ ] "Why this matters" explanation for each

### Recommendation Card UI
- [ ] Recommendation title
- [ ] Target keyword(s)
- [ ] Estimated opportunity (impressions)
- [ ] Confidence score
- [ ] Action button (Create / Optimize / Research)

## Implementation Notes

### Gemini Prompt Structure
```
You are an SEO content strategist for Herbarium Dyeworks,
a hand-dyed wool e-commerce business.

Given these Google Search Console queries:
[queries with metrics]

And these existing blog posts:
[blog titles]

Recommend 5 content actions with:
1. Type (new_post / optimize / quick_win)
2. Target keyword
3. Suggested title
4. Why this will help
5. Priority (high/medium/low)
```

### Caching Strategy
- Cache AI recommendations for 7 days
- Store in database with expiry
- Manual refresh button available

## Test Plan
- [ ] AI receives correct GSC data
- [ ] Recommendations are relevant to niche
- [ ] JSON parsing works
- [ ] Dashboard displays correctly
- [ ] Action buttons work
- [ ] Build passes

## Completion Evidence
_Filled when complete_
