# Story: Shopify Product Sync

**Epic:** See `.claude/epic.md`
**Status:** complete
**Priority:** P0
**Created:** 2024-12-02
**Updated:** 2024-12-02 20:28

## Objective
Fetch products from Shopify Admin GraphQL API and sync to Turso database for use across the app.

## Acceptance Criteria
- [x] API route `/api/shopify/sync` fetches all products via GraphQL
- [x] Products stored in Turso `products` table with: id, shopify_product_id, name, color, tags, image_urls, inventory, price
- [x] Sync extracts color from product title/tags (Herbarium naming convention)
- [x] Manual "Sync Now" button triggers sync from dashboard
- [x] Sync handles pagination (cursor-based) for large catalogs
- [x] Error handling for rate limits and API failures

## Implementation Notes

### Shopify GraphQL Query
```graphql
query GetProducts($cursor: String) {
  products(first: 50, after: $cursor) {
    edges {
      node {
        id
        title
        description
        tags
        variants(first: 10) {
          edges {
            node {
              id
              title
              price
              inventoryQuantity
            }
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
    }
  }
}
```

### API Configuration
- Base URL: `https://herbariumdyeworks.myshopify.com/admin/api/2024-12/graphql.json`
- Header: `X-Shopify-Access-Token: ${SHOPIFY_ACCESS_TOKEN}`
- Scopes needed: read_products (already configured)

### Color Extraction
Herbarium products use color names in titles (e.g., "Madder Red BFL", "Indigo Deep Merino"). Extract color by:
1. Check `tags` for color tag
2. Parse title for known color names
3. Store as `color` field for analytics

### Files to Create/Modify
- `app/api/shopify/sync/route.ts` - Sync endpoint
- `lib/shopify.ts` - GraphQL client helper
- `services/shopify.ts` - Business logic for product sync

## Test Plan
- [ ] Mock Shopify API response, verify products inserted to DB
- [ ] Test pagination with multiple pages
- [ ] Test color extraction from various title formats
- [ ] Test error handling (rate limit, network failure)

## Completion Evidence

**Tested:** 2024-12-02 20:28

- Sync API successfully fetched and stored **298 products** from Shopify
- Pagination working (298 products fetched across multiple API calls)
- Rate limit handling implemented with retry logic
- Color extraction active for known Herbarium colors

**Files Created:**
- `lib/shopify.ts` - GraphQL client with rate limiting
- `services/shopify.ts` - Product sync logic + color extraction
- `app/api/shopify/sync/route.ts` - POST endpoint
- `components/shopify/sync-button.tsx` - Dashboard UI

**Config Fix:** Updated `SHOPIFY_STORE_DOMAIN` to `2dd032-85.myshopify.com` (discovered from site headers)
