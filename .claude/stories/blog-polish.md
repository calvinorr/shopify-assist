# Story: Blog Polish & Refinements

**Epic:** See `.claude/epic.md`
**Status:** complete
**Priority:** P1
**Created:** 2024-12-05
**Completed:** 2024-12-05

## Objective
Polish the blog posting experience to 100% completion with product linking, image integration from Shopify, app branding, and remaining UX refinements.

## Completed Features

### Product Linking in Blog Editor
- [x] Create product picker modal (searchable list of synced products)
- [x] Add "Insert Product" button to TipTap toolbar
- [x] Create TipTap custom node for product cards (image + name + price + link)
- [x] Products display as styled cards in editor and preview
- [x] **NEW:** Card alignment options (Left / Center / Full Width)
- [x] **NEW:** Proper price formatting with GBP currency symbol
- [x] **NEW:** Product URLs use SEO-friendly handles (`herbariumdyeworks.com/products/{handle}`)

### Image Integration from Shopify
- [x] Add "Browse Product Images" to image insert flow
- [x] Create image gallery modal showing products with their images
- [x] Allow selecting images from any synced product
- [x] Images insert directly into editor (no copy/paste needed)
- [x] **NEW:** Image size picker (Small 300px / Medium 500px / Large 800px / Full Width)
- [x] Images render with proper max-width constraints

### Shopify Data Quality (P0 Bug Fixes)
- [x] Fixed price display bug (was dividing by 100, showing wrong currency)
- [x] Added `handle` field to products schema and GraphQL sync
- [x] Added `currency` field to products (defaults to GBP)
- [x] Created `lib/format.ts` for consistent price formatting
- [x] Created `lib/shopify-urls.ts` for URL building with env var support
- [x] Re-synced 298 products with proper handle and currency

### Inventory Filtering
- [x] Both Product Picker and Image Gallery have "In stock only" filter
- [x] Filter is enabled by default (shows products with inventory > 0)
- [x] Users can toggle to see all products if needed

### App Branding
- [x] Create custom favicon (yarn/wool themed icon)
- [x] Update app title from "Create Next App" → "Herbarium Content Studio"
- [x] Update meta description

### Bug Fixes
- [x] Fixed image insertion error (`Invalid content for node paragraph`)
- [x] Fixed blog delete 500 error (foreign key constraint from blogIdeas)
- [x] Added backward compatibility for old product cards (reads `shopifyUrl` if `handle` missing)

## Files Modified

| File | Changes |
|------|---------|
| `lib/schema.ts` | Added `handle`, `currency` columns to products |
| `services/shopify.ts` | Fetches `handle` in GraphQL, stores with currency |
| `lib/format.ts` | **NEW** - Price formatting utility |
| `lib/shopify-urls.ts` | **NEW** - Product URL builder |
| `types/product.ts` | Added `handle`, `currency` to interface |
| `app/api/products/route.ts` | Returns `handle`, `currency` |
| `app/api/blog/[id]/route.ts` | Fixed delete (clears FK refs first) |
| `components/editor/product-picker.tsx` | Price formatting, alignment selector, inventory filter |
| `components/editor/product-card-view.tsx` | Uses formatPrice, getProductUrl, alignment |
| `components/editor/product-node.tsx` | Added `handle`, `currency`, `alignment` attributes |
| `components/editor/image-gallery.tsx` | Size picker, inventory filter |
| `components/editor/tiptap-editor.tsx` | Image size attribute, alignment handling |
| `app/dashboard/products/page.tsx` | Uses formatPrice |
| `.env.local` | Added `NEXT_PUBLIC_SHOPIFY_STORE_URL` |

## Acceptance Criteria - ALL MET
- [x] Users can insert product cards with images, name, price, link
- [x] Product cards link to correct Shopify store URLs
- [x] Users can browse and insert product images without copy/paste
- [x] Images can be sized (Small/Medium/Large/Full)
- [x] Product cards can be aligned (Left/Center/Full)
- [x] App shows custom favicon and proper branding
- [x] Only in-stock products shown by default
- [x] Prices display correctly in GBP (£)
- [x] Blog posts can be deleted without errors
