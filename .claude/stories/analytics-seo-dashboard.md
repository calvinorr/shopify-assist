# Story: Analytics & SEO Dashboard

**Epic:** See `.claude/epic.md`
**Status:** complete
**Priority:** P1
**Created:** 2024-12-06
**Updated:** 2024-12-06 21:10

## Objective
Create an analytics dashboard focused on measuring content performance and SEO impact, helping users understand if their content creation efforts are driving visits, sales, and search rankings.

## Phase 1: Shopify Analytics ✅ COMPLETE

### Acceptance Criteria - Phase 1
- [x] Analytics dashboard page with overview cards
- [x] Total Products, Inventory Value, Revenue, Content Created stats
- [x] Sales trend chart (30-day revenue and orders)
- [x] Top products table → "Inventory Capital" (reframed)
- [x] Blog content metrics (total, published, drafts, review)
- [x] Instagram content metrics (total, posted, drafts, scheduled)
- [x] Shopify orders API integration
- [x] Content overview bar chart
- [x] Color extraction fix for product titles

### API Routes Created (Phase 1)
- `GET /api/analytics/overview` - Product/content stats
- `GET /api/analytics/products` - Top products, color distribution, low stock
- `GET /api/analytics/content` - Blog/Instagram by status
- `GET /api/analytics/sales?days=30` - Shopify order data

## Phase 2: Google Search Console ✅ COMPLETE

### Acceptance Criteria - Phase 2
- [x] Tabbed layout (Overview | SEO | Content) - no scrolling!
- [x] Google OAuth flow with Search Console API
- [x] OAuth credentials setup in Google Cloud Console
- [x] Token storage in database (google_tokens table)
- [x] SEO tab with connect button
- [x] SEO stats display (clicks, impressions, CTR, position)
- [x] Top search queries table

### API Routes Created (Phase 2)
- `GET /api/analytics/seo/connect` - Initiate OAuth flow
- `GET /api/analytics/seo/callback` - OAuth callback handler
- `GET /api/analytics/seo?check=true` - Check connection status
- `GET /api/analytics/seo?siteUrl=...` - Fetch SEO data
- `DELETE /api/analytics/seo` - Disconnect

### Files Created (Phase 2)
- `lib/google-search-console.ts` - OAuth helpers & API functions
- `app/api/analytics/seo/connect/route.ts`
- `app/api/analytics/seo/callback/route.ts`
- `app/api/analytics/seo/route.ts`
- `types/analytics.ts` - SEO types

## Implementation Notes

### Design Decision
User requested: "I hate scrolling - want immediate information on landing"
→ Implemented tabbed interface with Overview | SEO | Content tabs

### Google OAuth Setup Required
1. Google Cloud Console project with Search Console API enabled
2. OAuth credentials (Client ID & Secret)
3. Test user added in OAuth consent screen
4. Site verified in Google Search Console (URL prefix format)

### Environment Variables
- `GOOGLE_CLIENT_ID` - OAuth client ID
- `GOOGLE_CLIENT_SECRET` - OAuth client secret

## Test Plan
- [x] Analytics page loads without errors
- [x] Tab navigation works (Overview | SEO | Content)
- [x] Shopify data displays correctly
- [x] Google OAuth flow completes successfully
- [x] Tokens stored in database
- [x] SEO data displays after connection
- [x] Build passes with no TypeScript errors

## Completion Evidence
**Phase 1 Complete - 2024-12-06**
**Phase 2 Complete - 2024-12-06**

- Dashboard: `/dashboard/analytics`
- Tabbed layout with 3 tabs
- Google Search Console integrated
- OAuth flow tested and working
- Build: Passes successfully
