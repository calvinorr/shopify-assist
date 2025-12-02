# Epic: Herbarium Content Automation Engine

**Created:** 2024-12-02
**Status:** active
**PRD:** `herbarium-prd.md`

## Vision
Reduce Herbarium Dyeworks marketing time to 45 mins/week (Instagram) + 2-3 hours/month (blog) while maintaining consistent, high-quality content driven by Shopify data intelligence.

## Target Outcome
A fully integrated content automation tool connecting Shopify → Instagram → Blog with AI-powered suggestions, enabling data-driven marketing decisions without sacrificing production time.

## Completed Setup
- [x] Project scaffolding (Next.js 14+, Tailwind v4, TypeScript)
- [x] Turso database created (`shopify-assist-db`) with schema
- [x] NextAuth v5 with dev bypass mode
- [x] Dashboard layout with sidebar navigation
- [x] Gemini AI integration (`lib/gemini.ts`)
- [x] GitHub repo: https://github.com/calvinorr/shopify-assist

## Stories

### Phase 1: MVP Foundation

| Story | Priority | Status | File |
|-------|----------|--------|------|
| Shopify Product Sync | P0 | complete | `stories/shopify-product-sync.md` |
| Dashboard with Real Data | P1 | complete | `stories/dashboard-real-data.md` |
| Products Page | P1 | complete | `stories/products-page.md` |
| Basic Blog Editor | P1 | complete | `stories/basic-blog-editor.md` |

### Phase 2: Instagram Intelligence

| Story | Priority | Status | File |
|-------|----------|--------|------|
| Instagram OAuth Connection | P1 | not-started | `stories/instagram-oauth.md` |
| AI Idea Generation | P1 | not-started | `stories/ai-idea-generation.md` |
| Caption Generator | P2 | not-started | `stories/caption-generator.md` |
| Instagram Post Creator UI | P2 | not-started | `stories/instagram-post-creator.md` |

### Phase 3: Blog Intelligence

| Story | Priority | Status | File |
|-------|----------|--------|------|
| AI Blog Topic Suggestions | P2 | not-started | `stories/ai-blog-topics.md` |
| Blog Post Scaffolding | P2 | not-started | `stories/blog-scaffolding.md` |
| Enhanced Blog Editor | P2 | not-started | `stories/enhanced-blog-editor.md` |

### Phase 4: Analytics Loop

| Story | Priority | Status | File |
|-------|----------|--------|------|
| Instagram Performance Analytics | P2 | not-started | `stories/instagram-analytics.md` |
| Seasonal Pattern Recognition | P3 | not-started | `stories/seasonal-patterns.md` |

## Completed Stories
- [x] **Shopify Product Sync** (P0) - 298 products synced - 2024-12-02
- [x] **Dashboard with Real Data** (P1) - Live stats + recent products - 2024-12-02
- [x] **Products Page** (P1) - Grid view with search/filter - 2024-12-02
- [x] **Basic Blog Editor** (P1) - TipTap WYSIWYG editor - 2024-12-02

## Notes
- Use `/manage` to work through stories
- Use `/story-new` to add stories
- Use `/story-complete` to verify and close stories
- Shopify API already configured: `SHOPIFY_ACCESS_TOKEN` with read_products, read_orders, read_analytics, read_inventory scopes
