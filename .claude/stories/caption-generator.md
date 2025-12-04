# Story: Caption Generator

**Epic:** See `.claude/epic.md`
**Status:** complete
**Priority:** P2
**Created:** 2024-12-03
**Updated:** 2024-12-03

## Objective
Add AI-powered caption generation to the Instagram idea cards, allowing users to generate ready-to-use captions with hashtags for their posts.

## Acceptance Criteria
- [x] "Use This" button on Instagram idea cards opens caption generator
- [ ] Caption generator shows product selector (optional) - DEFERRED
- [x] Generates 3 caption variations with different tones
- [x] Generates categorized hashtag suggestions
- [x] One-click copy for captions and hashtags
- [x] Loading state during generation

## Implementation Notes

### Existing Functions (in lib/gemini.ts)
- `generateCaptions(productName, description, color, context)` - returns 3 captions
- `generateHashtags(productName, color, category)` - returns categorized hashtags

### Component Structure
```
components/
  instagram/
    caption-modal.tsx       # Modal for caption generation
    caption-card.tsx        # Individual caption with copy button
    hashtag-section.tsx     # Hashtag display with copy all
```

### API Endpoint
```typescript
// POST /api/ai/caption
// Request: { productId?: string, ideaTitle: string, ideaDescription: string }
// Response: {
//   captions: string[],
//   hashtags: { brand, product, community, trending }
// }
```

## Test Plan
- [ ] Modal opens when clicking "Use This" on Instagram idea
- [ ] Captions generate successfully
- [ ] Hashtags display in categories
- [ ] Copy buttons work correctly
- [ ] Loading state shows during generation

## Dependencies
- AI Idea Generation (complete)
- lib/gemini.ts functions
