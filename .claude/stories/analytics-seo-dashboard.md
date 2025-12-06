# Story: Analytics & SEO Dashboard

**Epic:** See `.claude/epic.md`
**Status:** in-progress
**Priority:** P1
**Created:** 2024-12-06
**Updated:** 2024-12-06 17:30

## Objective
Create an analytics dashboard focused on measuring content performance and SEO impact, helping users understand if their content creation efforts are driving visits, sales, and search rankings.

## Phase 1: Shopify Analytics (COMPLETE)

### Acceptance Criteria - Phase 1
- [x] Analytics dashboard page with overview cards
- [x] Total Products, Inventory Value, Revenue, Content Created stats
- [x] Sales trend chart (30-day revenue and orders)
- [x] Top products table by inventory value
- [x] Blog content metrics (total, published, drafts, review)
- [x] Instagram content metrics (total, posted, drafts, scheduled)
- [x] Shopify orders API integration
- [x] Content overview bar chart

### API Routes Created
- `GET /api/analytics/overview` - Product/content stats
- `GET /api/analytics/products` - Top products, color distribution, low stock
- `GET /api/analytics/content` - Blog/Instagram by status
- `GET /api/analytics/sales?days=30` - Shopify order data

## Phase 2: Google Search Console (DEFERRED)

### Acceptance Criteria - Phase 2
- [ ] OAuth connection to Google Search Console
- [ ] Display key metrics: Total impressions, clicks, average CTR, average position
- [ ] Top performing queries table (keyword, impressions, clicks, position)
- [ ] Top performing pages table (URL, impressions, clicks, position)
- [ ] Position change tracking (trending up/down indicators)
- [ ] Date range selector (7d, 28d, 90d)

### Dependencies for Phase 2
- Google Cloud Console project setup
- OAuth consent screen configuration
- Credentials (client ID/secret) generation
- Site verification in Search Console

## Implementation Notes

### Completed (Phase 1)
- Recharts library installed for data visualization
- AreaChart for sales trends (revenue + orders)
- BarChart for content overview (blog vs Instagram)
- Responsive grid layout with 4 stat cards
- Top 10 products table with inventory value
- Content metrics cards with status breakdowns

### Dashboard Layout
1. **Overview Cards** - Key metrics at a glance (4 cards)
2. **Sales Trend Chart** - 30-day revenue and orders
3. **Content Overview Chart** - Blog vs Instagram published/drafts
4. **Top Products Table** - By inventory value
5. **Content Metrics** - Blog and Instagram performance cards

## Test Plan
Phase 1:
- [x] Analytics page loads without errors
- [x] Overview stats display real data from database
- [x] Sales chart shows Shopify order data
- [x] Products table shows top inventory items
- [x] Content metrics show correct status counts
- [x] Build passes with no TypeScript errors

Phase 2:
- [ ] Google OAuth flow completes successfully
- [ ] SEO metrics display correctly for date ranges
- [ ] Keywords table sorts and filters
- [ ] Position changes show correct trend indicators

## Completion Evidence
**Phase 1 Complete - 2024-12-06**
- Dashboard: `/dashboard/analytics`
- API Routes: 4 endpoints created
- Charts: Recharts AreaChart + BarChart
- Build: Passes successfully
- Files created/modified:
  - `app/dashboard/analytics/page.tsx`
  - `app/api/analytics/overview/route.ts`
  - `app/api/analytics/products/route.ts`
  - `app/api/analytics/content/route.ts`
  - `app/api/analytics/sales/route.ts`
  - `services/shopify.ts` (orders fetching)
  - `types/shopify.ts` (new types)
