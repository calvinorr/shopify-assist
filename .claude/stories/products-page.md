# Story: Products Page

**Epic:** See `.claude/epic.md`
**Status:** complete
**Priority:** P1
**Created:** 2024-12-02
**Updated:** 2024-12-06 10:30

## Objective
Create a dedicated products page to browse, search, and filter all synced Shopify products.

## Acceptance Criteria
- [x] `/dashboard/products` route displays all products in grid view
- [x] Product cards show: image, name, color, price, inventory status
- [x] Search by product name (client-side filtering)
- [x] Filter by color (server-side with dropdown)
- [x] In Stock toggle filter (bonus feature)
- [ ] Sort by: name, price, date added, inventory (deferred)
- [x] Loads 50 products at a time
- [ ] Click product to view details (deferred)

## Implementation Notes

### UI Components
- `ProductCard` - Displays single product with image, details
- `ProductGrid` - Grid layout of ProductCards
- `ProductFilters` - Search input, color dropdown, sort select
- `ProductDetail` - Modal or page showing full product info

### API Requirements
- `GET /api/products?search=&color=&sort=&page=` - Filtered product list

### Color Filter
Extract unique colors from products table for dropdown options.

### Dependencies
- Requires `shopify-product-sync` story complete
- Uses existing UI components from `components/ui/`

## Test Plan
- [ ] Products page loads all synced products
- [ ] Search filters products by name
- [ ] Color filter works correctly
- [ ] Sorting changes order appropriately
- [ ] Pagination loads more products

## Completion Evidence
- **Page:** `app/dashboard/products/page.tsx` (388 lines)
- **API:** `GET /api/products` with color and inStock filters
- **Features:** Grid view, search, color filter, In Stock toggle, skeleton loading
- **Completed:** 2024-12-02 (story file updated 2024-12-06)
