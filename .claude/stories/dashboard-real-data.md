# Story: Dashboard with Real Data

**Epic:** See `.claude/epic.md`
**Status:** complete
**Priority:** P1
**Created:** 2024-12-02
**Updated:** 2024-12-02 20:50

## Objective
Wire the dashboard to display real Shopify product data from Turso, replacing placeholder content.

## Acceptance Criteria
- [x] Dashboard shows top-selling colors (from synced products)
- [x] Recent products section displays last 5 products added
- [x] Product count and inventory summary displayed
- [x] Data fetched via API routes, not direct DB calls from client
- [x] Loading states while data fetches
- [x] Empty states when no data available

## Implementation Notes

### Dashboard Sections (MVP)
1. **Product Summary Card** - Total products, total inventory
2. **Recent Products** - Last 5 products with image, name, color, price
3. **Color Distribution** - Simple list of colors with product counts
4. **Quick Actions** - "Sync Products", "View All Products"

### API Routes Needed
- `GET /api/products` - List products (paginated)
- `GET /api/products/stats` - Aggregated stats (counts, top colors)

### Data Flow
```
Dashboard Page → SWR/fetch → API Routes → Drizzle → Turso
```

### Dependencies
- Requires `shopify-product-sync` story to be complete (needs data in DB)

## Test Plan
- [ ] Dashboard loads with real product data
- [ ] Loading spinner shows while fetching
- [ ] Empty state shows if no products synced
- [ ] Stats calculate correctly from DB data

## Completion Evidence

**Tested:** 2024-12-02 20:50

- Dashboard displays 298 products, 93 total inventory
- Color distribution shows Lac (12), Logwood (6), Indigo (3), Walnut (1), Iron (1)
- Recent products with images from Shopify CDN
- Loading spinner during fetch
- Empty states for unpopulated sections

**Files Created:**
- `app/api/products/stats/route.ts` - Stats aggregation endpoint
- `app/api/products/route.ts` - Product list endpoint
- `components/dashboard/dashboard-content.tsx` - Client component with data fetching
- Updated `next.config.ts` for Shopify CDN images
