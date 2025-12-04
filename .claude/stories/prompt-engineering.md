# Story: AI Prompt Engineering Review

**Epic:** See `.claude/epic.md`
**Status:** not-started
**Priority:** P2
**Created:** 2024-12-03
**Updated:** 2024-12-03

## Objective
Review and optimize all AI prompts to ensure consistent brand voice, better output quality, and more actionable content suggestions.

## Background
Currently using basic prompts across multiple features. Need to audit and improve for:
- Consistent "artisan voice" (educational, personal, storytelling, not hard-sell)
- Better use of context data (products, colors, seasonality)
- More specific, actionable outputs

## Current Prompts Audit

### 1. Instagram Post Ideas (`lib/gemini.ts`)
**Current:**
```
System: You are a content strategist for Herbarium Dyeworks, an artisan hand-dyed wool business.
Suggest Instagram post ideas that balance education, storytelling, and subtle promotion.
```
**Issues:** Generic, doesn't enforce output structure well
**Improvement:** Add specific tone guidelines, example outputs, format constraints

### 2. Caption Generation (`lib/gemini.ts`)
**Current:**
```
System: You are a content creator for Herbarium Dyeworks, an artisan hand-dyed wool business.
Write in an artisan voice: educational, personal, storytelling-focused. Never hard-sell.
```
**Good:** Has voice guidance
**Improvement:** Add Instagram-specific constraints (length, CTA patterns)

### 3. Blog Topic Suggestions (`api/ai/suggestions/route.ts`)
**Current:**
```
System: You are a content strategist for Herbarium Dyeworks...
Suggest SEO-focused blog topics that educate readers...
```
**Issues:** Doesn't leverage seasonal context enough
**Improvement:** Add SEO keyword research patterns, content pillar strategy

### 4. Excerpt Generation (`api/ai/blog/route.ts`)
**Current:** Basic summarization prompt
**Improvement:** Add SEO meta description best practices

### 5. Tag Suggestions (`api/ai/blog/route.ts`)
**Current:** Basic tag extraction
**Improvement:** Add tag taxonomy for natural dye niche

## Proposed Prompt Framework

### Standard Context Block (all prompts)
```
BRAND: Herbarium Dyeworks - artisan hand-dyed wool using natural dyes
VOICE: Educational, personal storytelling, behind-the-scenes craft focus
AVOID: Hard-sell language, promotional tone, generic advice
AUDIENCE: Knitters, fiber artists, craft enthusiasts (UK 45%, US 35%, Canada 15%)
```

### Data Context Template
```
TOP COLORS: {from Shopify}
RECENT PRODUCTS: {from Shopify}
SEASON: {current month context}
```

## Acceptance Criteria
- [ ] Document all current prompts in central location
- [ ] Create prompt template library (`lib/prompts.ts`)
- [ ] Update Instagram idea generation with improved prompt
- [ ] Update blog scaffold prompt with structure
- [ ] A/B test: Compare old vs new prompt outputs
- [ ] Document prompt patterns for future features

## Implementation Notes
- Create `lib/prompts.ts` as central prompt management
- Use template literals for dynamic data injection
- Consider prompt versioning for rollback capability

## Test Plan
- [ ] Generate 10 Instagram ideas with new prompts - assess quality
- [ ] Generate 5 blog scaffolds - assess structure and voice
- [ ] User reviews outputs for brand voice consistency

## Dependencies
- All AI features complete (to audit current prompts)
