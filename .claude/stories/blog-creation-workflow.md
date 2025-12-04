# Story: Blog Creation Workflow Enhancement

**Epic:** See `.claude/epic.md`
**Status:** superseded (merged into blog-command-center.md)
**Priority:** P1
**Created:** 2024-12-03
**Updated:** 2024-12-03

## Objective
Enhance the blog creation workflow with AI scaffolding - clicking "Start This Post" on a blog topic generates a complete blog structure ready for editing.

## Background (from PRD Phase 3)
> "AI generates HTML blog post scaffold with: SEO-optimized headline (H1), Meta description (160 chars), 5-7 sections with suggested content structure, Internal links to relevant Shopify products, Call-to-action at end"

## Acceptance Criteria
- [ ] "Start This Post" button on blog topic card → creates new post with AI scaffold
- [ ] AI scaffold includes: title, meta description, 5-7 section headings with content hints
- [ ] Scaffold references actual Shopify products where relevant
- [ ] New post opens in editor with scaffold content ready to edit
- [ ] Loading state during scaffold generation

## Implementation Notes

### Workflow
1. User clicks "Start This Post" on dashboard blog topic card
2. API call to `/api/ai/blog-scaffold` with topic + keywords
3. Returns structured content: title, metaDescription, sections[], suggestedCTA
4. Creates new blog post in database with scaffold content
5. Redirects to `/dashboard/blog/[id]` to edit

### API Enhancement
Extend existing `generateBlogScaffold()` in `lib/gemini.ts`:
- Input: topic, suggestedKeywords, topColors, recentProducts
- Output: Full HTML scaffold with section structure

### Prompt Engineering Focus
The scaffold prompt should:
- Use Herbarium's artisan voice (educational, storytelling, not hard-sell)
- Reference actual product colors/names from Shopify data
- Include SEO best practices (keyword placement, heading structure)
- Suggest internal product links naturally within content

## Current Prompts (for review)

### Instagram Ideas (`lib/gemini.ts` - generatePostIdeas)
```
System: You are a content strategist for Herbarium Dyeworks, an artisan hand-dyed wool business.
Suggest Instagram post ideas that balance education, storytelling, and subtle promotion.
```

### Blog Topic (`api/ai/suggestions/route.ts`)
```
System: You are a content strategist for Herbarium Dyeworks, an artisan hand-dyed wool business.
Suggest SEO-focused blog topics that educate readers about natural dyeing, wool care, and fiber arts.
```

### Blog Scaffold (to be enhanced)
```
System: You are an SEO content writer for Herbarium Dyeworks, an artisan hand-dyed wool business.
Write educational, engaging blog content that ranks well for natural dyeing and hand-dyed wool keywords.
```

## Test Plan
- [ ] Click "Start This Post" creates new blog with scaffold
- [ ] Scaffold contains 5+ sections with real content hints
- [ ] Product references match actual Shopify inventory
- [ ] Generated content maintains artisan voice
- [ ] Redirect to editor works correctly

## Dependencies
- Blog AI Enhancements (in-progress) - excerpt/tag generation
- AI Idea Generation (complete) - provides blog topic
- Shopify Product Sync (complete) - product data for references
