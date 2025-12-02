# Story: Products Page

**Epic:** See `.claude/epic.md`
**Status:** not-started
**Priority:** P1
**Created:** 2024-12-02
**Updated:** 2024-12-02

## Objective
Create a dedicated products page to browse, search, and filter all synced Shopify products.

## Acceptance Criteria
- [ ] `/dashboard/products` route displays all products in grid/list view
- [ ] Product cards show: image, name, color, price, inventory status
- [ ] Search by product name
- [ ] Filter by color
- [ ] Sort by: name, price, date added, inventory
- [ ] Pagination or infinite scroll for large catalogs
- [ ] Click product to view details (modal or detail page)

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
_To be filled when complete_
