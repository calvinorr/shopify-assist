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

### Phase 1: MVP Foundation - COMPLETE

| Story | Priority | Status | File |
|-------|----------|--------|------|
| Shopify Product Sync | P0 | complete | `stories/shopify-product-sync.md` |
| Dashboard with Real Data | P1 | complete | `stories/dashboard-real-data.md` |
| Products Page | P1 | complete | `stories/products-page.md` |
| Basic Blog Editor | P1 | complete | `stories/basic-blog-editor.md` |
| Frontpage Design | P0 | complete | `stories/frontpage-design.md` |
| Blog AI Enhancements | P2 | complete | `stories/blog-ai-enhancements.md` |

### Phase 2: Instagram Intelligence - PARTIAL

| Story | Priority | Status | File |
|-------|----------|--------|------|
| Instagram Creation Flow | P0 | complete | `stories/instagram-creation-flow.md` |
| Instagram OAuth Connection | P1 | deferred (pending PM approval) | `stories/instagram-oauth.md` |
| AI Idea Generation | P1 | complete | `stories/ai-idea-generation.md` |
| Mobile App (Instagram workaround) | P3 | backlog | `stories/mobile-app.md` |
| Caption Generator | P2 | complete | `stories/caption-generator.md` |
| Instagram Post Creator UI | P2 | complete | `stories/instagram-post-creator.md` |

### Phase 3: Blog Intelligence - COMPLETE

| Story | Priority | Status | File |
|-------|----------|--------|------|
| Blog Command Center | P0 | complete | `stories/blog-command-center.md` |
| Blog Post UX Design | P1 | complete | `stories/blog-post-ux-design.md` |
| Blog Polish & Refinements | P1 | complete | `stories/blog-polish.md` |
| Blog New Post Consistency | P0 | complete | `stories/blog-new-post-consistency.md` |

### Phase 4: Analytics Loop - PARTIAL

| Story | Priority | Status | File |
|-------|----------|--------|------|
| Instagram Performance Analytics | P2 | not-started | `stories/instagram-analytics.md` |
| Seasonal Pattern Recognition | P3 | not-started | `stories/seasonal-patterns.md` |

### Phase 8: SEO & Content Intelligence - IN PROGRESS

**Epic:** `epics/seo-content-intelligence.md`

| Story | Priority | Status | File |
|-------|----------|--------|------|
| Blog Performance Tracking | P0 | complete | `stories/seo/blog-performance-tracking.md` |
| Search Query Opportunities | P1 | complete | `stories/seo/search-query-opportunities.md` |
| AI Content Suggestions from GSC | P1 | not-started | `stories/seo/ai-content-suggestions.md` |
| Content-to-Traffic Attribution | P2 | not-started | `stories/seo/content-traffic-attribution.md` |
| Keyword Gap Analysis | P2 | not-started | `stories/seo/keyword-gap-analysis.md` |

### Phase 5: UX/UI Professional Polish - COMPLETE

| Story | Priority | Status | File |
|-------|----------|--------|------|
| Dashboard Redesign | P1 | complete | `stories/ux-dashboard-redesign.md` |
| Design System Standardization | P1 | complete | `stories/ux-design-system.md` |
| Loading States & Progress | P2 | complete | `stories/ux-loading-states.md` |
| Dashboard Rewrite | P0 | complete | `stories/ux-dashboard-rewrite.md` |

### Phase 6: Production Readiness - COMPLETE

| Story | Priority | Status | File |
|-------|----------|--------|------|
| Production Readiness | P0 | complete | `stories/production-readiness.md` |

### Phase 7: App Completion - COMPLETE

| Story | Priority | Status | File |
|-------|----------|--------|------|
| Settings Page | P1 | complete | `stories/settings-page.md` |
| Analytics & SEO Dashboard | P1 | complete | `stories/analytics-seo-dashboard.md` |

## Completed Stories (Chronological)
- [x] **Shopify Product Sync** (P0) - 298 products synced - 2024-12-02
- [x] **Dashboard with Real Data** (P1) - Live stats + recent products - 2024-12-02
- [x] **Products Page** (P1) - Grid view with search/filter - 2024-12-02
- [x] **Basic Blog Editor** (P1) - TipTap WYSIWYG with auto-save, preview, export - 2024-12-03
- [x] **Frontpage Design** (P0) - Content-focused dashboard with AI suggestions - 2024-12-03
- [x] **AI Idea Generation** (P1) - Gemini-powered Instagram & blog ideas - 2024-12-03
- [x] **Caption Generator** (P2) - Modal with 3 captions + categorized hashtags - 2024-12-03
- [x] **Blog AI Enhancements** (P2) - Generate excerpt + suggest tags buttons - 2024-12-03
- [x] **Blog Command Center** (P0) - Full blog management with calendar, scheduling, SEO scoring - 2024-12-04
- [x] **Blog Post UX Design** (P1) - DB-backed ideas, 3-card grid, SEO panel with hints - 2024-12-05
- [x] **Blog Polish & Refinements** (P1) - Product cards, image gallery, sizing/alignment, data quality - 2024-12-05
- [x] **Dashboard Redesign** (P1) - Quick actions, content stats, activity feed - 2024-12-05
- [x] **Design System Standardization** (P1) - Select, Textarea, Badge components, spacing polish - 2024-12-05
- [x] **Loading States & Progress** (P2) - Skeleton loaders, progress component, save indicator - 2024-12-05
- [x] **Instagram Post Creator UI** (P2) - Composer, drafts, manual posting workflow - 2024-12-05
- [x] **Dashboard Rewrite** (P0) - Content-focused hub with 3 blog + 3 Instagram idea cards - 2024-12-05
- [x] **Instagram Creation Flow** (P0) - Product image picker, caption refinement, hashtag suggestions - 2024-12-05
- [x] **Settings Page** (P1) - User profile, password change, admin controls, Shopify status - 2024-12-06
- [x] **Analytics & SEO Dashboard** (P1) - Tabbed layout, Shopify sales data, Google Search Console integration - 2024-12-06
- [x] **Blog New Post Consistency** (P0) - Dashboard → Blog page with AI ideas, "start blank" option - 2024-12-08

---

## Outstanding Work (Not Started)

### Instagram (Phase 2 Remaining)
1. **Instagram OAuth Connection** (P1) - Connect to Instagram Business Account

### Analytics (Phase 4)
- **SEO Fix** (P0) - Fix broken SEO analytics connection
- **Instagram Performance Analytics** (P2) - Track post engagement
- **Seasonal Pattern Recognition** (P3) - Identify trending colors by season

### Future Considerations
- **Mobile App** (P3) - Native app for Instagram posting workaround (if OAuth remains blocked)

---

## Current State Summary

**Blog System: 100% Complete**
- Full WYSIWYG editor with TipTap
- Product cards with proper Shopify links
- Image gallery with size controls
- SEO panel with real-time scoring
- AI-powered ideas and scaffolding
- Scheduling with calendar view
- Export to HTML

**Instagram System: ~80% Complete**
- AI idea generation ✓
- Caption generator ✓
- Post creator UI ✓
- Creation flow with product picker ✓
- OAuth connection ✗ (manual posting workflow available)

**UX/UI Polish: 100% Complete**
- Dashboard redesign ✓
- Design system standardization ✓
- Loading states & progress ✓

**Analytics: 100% Complete**
- Tabbed dashboard (Overview | SEO | Content) ✓
- Shopify sales data with 30-day trends ✓
- Inventory capital analysis ✓
- Google Search Console OAuth integration ✓
- SEO metrics (clicks, impressions, CTR, position) ✓
- Top search queries display ✓

---

## Notes
- Use `/manage` to work through stories
- Use `/story-new` to add stories
- Use `/story-complete` to verify and close stories
- Shopify API already configured: `SHOPIFY_ACCESS_TOKEN` with read_products, read_orders, read_analytics, read_inventory scopes
- Store URL: `herbariumdyeworks.com`
