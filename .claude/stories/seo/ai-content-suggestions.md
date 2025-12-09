# Story: AI Content Suggestions from GSC

**Epic:** `epics/seo-content-intelligence.md`
**Status:** complete
**Priority:** P1
**Created:** 2024-12-08
**Updated:** 2024-12-09 12:45

## Objective
Use Gemini AI to analyze GSC data and generate specific, actionable content recommendations.

## Acceptance Criteria

### AI Analysis Pipeline
- [x] Feed top 50 search queries to Gemini with context
- [x] Include: query, impressions, clicks, position
- [x] Include: existing blog post titles for gap detection
- [x] Return structured recommendations

### Recommendation Types
- [x] **New Blog Post Ideas** - Based on queries with no matching content
- [x] **Optimize Existing** - Posts that rank but could improve
- [x] **Quick Wins** - Position 8-15 queries (almost page 1)
- [x] **Long-tail Opportunities** - Specific queries to target

### Dashboard Integration
- [x] "AI Insights" section on dashboard (refresh weekly)
- [x] 3-5 actionable recommendations with priority
- [x] One-click to create blog from recommendation
- [x] "Why this matters" explanation for each

### Recommendation Card UI
- [x] Recommendation title
- [x] Target keyword(s)
- [x] Estimated opportunity (impressions)
- [x] Confidence score
- [x] Action button (Create / Optimize / Research)

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
- [x] AI receives correct GSC data
- [x] Recommendations are relevant to niche
- [x] JSON parsing works
- [x] Dashboard displays correctly
- [x] Action buttons work
- [x] Build passes

## Completion Evidence

**Completed:** 2024-12-09

### Files Created:
- `app/api/ai/content-suggestions/route.ts` - AI suggestions API with Gemini integration
- `components/dashboard/AIInsights.tsx` - Dashboard widget component
- `components/dashboard/RecommendationCard.tsx` - Individual recommendation cards

### Files Modified:
- `lib/schema.ts` - Added `aiRecommendations` table for caching
- `lib/gemini.ts` - Added AI content recommendations function
- `components/dashboard/dashboard-content.tsx` - Integrated AIInsights widget

### Features Delivered:
1. **AI Analysis**: Gemini analyzes GSC data + existing blog titles
2. **4 Recommendation Types**: new_post, optimize, quick_win, long_tail
3. **7-Day Caching**: Database cache with manual refresh
4. **Dashboard Widget**: Shows top 5 recommendations
5. **Action Buttons**: Route to blog editor with pre-filled data
6. **Confidence Scores**: High/Medium/Low with visual indicators

### Build Status:
✅ Production build passes with no errors
