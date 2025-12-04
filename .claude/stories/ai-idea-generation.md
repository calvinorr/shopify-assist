# Story: AI Idea Generation

**Epic:** See `.claude/epic.md`
**Status:** complete
**Priority:** P1
**Created:** 2024-12-03
**Updated:** 2024-12-03

## Objective
Replace mock AI suggestions on the dashboard with real Gemini-powered content ideas based on Shopify product data, seasonal trends, and artisan brand voice.

## Acceptance Criteria
- [ ] API endpoint `/api/ai/suggestions` returns Instagram and blog ideas
- [ ] Ideas are based on actual product data (trending colors, recent products)
- [ ] Suggestions include reasoning explaining why each idea is relevant
- [ ] Ideas reflect artisan brand voice (educational, personal, storytelling)
- [ ] Refresh button to generate new suggestions
- [ ] Loading state while generating
- [ ] Error handling with fallback to cached/mock suggestions

## Implementation Notes

### Data Context for AI
Pass to Gemini:
- Top 5 trending colors from product inventory
- 3 most recent products added
- Current season/month
- Day of week (for timing suggestions)

### Prompt Structure
```
You are a content strategist for Herbarium Dyeworks, a hand-dyed wool artisan business.

Context:
- Trending colors: {colors}
- Recent products: {products}
- Season: {season}
- Brand voice: Educational, personal storytelling, behind-the-scenes, not hard-sell

Generate 3 Instagram post ideas and 1 blog topic suggestion.
Each idea should include:
- Title (catchy, concise)
- Description (2-3 sentences of what to post)
- Reasoning (why this idea works now)

For blog topic, also include:
- Suggested SEO keywords (4-5 terms)
```

### API Structure
```typescript
// POST /api/ai/suggestions
// Request: { refresh?: boolean }
// Response: {
//   instagram: Array<{ title, description, reasoning }>,
//   blog: { title, description, reasoning, suggestedKeywords }
// }
```

### Components to Update
- `components/dashboard/ai-suggestions/index.tsx` - Add refresh button, fetch from API
- `components/dashboard/dashboard-content.tsx` - Remove mock data, use API

## Test Plan
- [ ] API returns valid JSON with expected structure
- [ ] Ideas reference actual product colors/names
- [ ] Refresh generates different suggestions
- [ ] Error state shows gracefully
- [ ] Loading spinner displays during generation

## Dependencies
- Gemini API key configured (GOOGLE_AI_API_KEY)
- Product stats API (`/api/products/stats`)
- `lib/gemini.ts` helper functions

## Notes
- Cache suggestions for 1 hour to reduce API costs
- Consider storing generated ideas in database for history
- Future: Add user feedback (thumbs up/down) to improve suggestions
