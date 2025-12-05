# Story: Blog Polish & Refinements

**Epic:** See `.claude/epic.md`
**Status:** not-started
**Priority:** P1
**Created:** 2024-12-05
**Updated:** 2024-12-05

## Objective
Polish the blog posting experience to 100% completion with product linking, image integration from Shopify, app branding, and remaining UX refinements.

## Context
Blog posting is currently ~80% complete. Core features are working:
- Ideas generation with DB persistence
- 3-card grid layout
- SEO panel with real-time hints
- Scheduling with calendar view
- Start This Post scaffolding

## New Features

### Product Linking in Blog Editor
- [ ] Create product picker modal (searchable list of synced products)
- [ ] Add "Insert Product" button to TipTap toolbar
- [ ] Create TipTap custom node for product cards (image + name + price + link)
- [ ] Wire up `shopifyProductLinks` field to track linked products
- [ ] Products display as styled cards in editor and preview

**Technical Notes:**
- Products already synced to DB via `services/shopify.ts`
- Schema has `shopifyProductLinks` JSON array field on `blogPosts`
- Use Shopify `read_products` scope (already configured)

### Image Integration from Shopify
- [ ] Add "Browse Product Images" to image insert flow
- [ ] Create image gallery modal showing products with their images
- [ ] Allow selecting images from any synced product
- [ ] Images insert directly into editor (no copy/paste needed)

**Shopify API Research:**
- Images fetched via GraphQL Admin API (already doing this)
- Up to 5 images per product stored in `products.imageUrls`
- Requires `read_products` scope only ✓
- Max 20MB per image, 20 megapixels limit
- See: [Shopify Product Media Docs](https://shopify.dev/docs/apps/build/online-store/product-media)

### App Branding
- [ ] Create custom favicon (yarn/wool themed icon)
- [ ] Update app title from "Create Next App" → "Herbarium Content Studio"
- [ ] Update meta description
- [ ] Consider Open Graph images for link previews

**Files to modify:**
- `app/layout.tsx` - Update metadata
- `app/favicon.ico` - Replace with custom icon
- Consider `app/icon.png` for higher-res favicon

## Remaining Work (Original 20%)

### UX Polish
- [ ] Review and test idea dismissal flow
- [ ] Ensure "Start This Post" correctly links idea to created post
- [ ] Test calendar drag-drop (if time permits - stretch goal)
- [ ] Verify mobile responsiveness of blog page

### Edge Cases
- [ ] Handle empty state when no ideas exist
- [ ] Handle API errors gracefully in ideas panel
- [ ] Test scheduling edge cases (past dates, timezone handling)
- [ ] Verify autosave doesn't conflict with manual save

### SEO Panel Refinements
- [ ] Test all 6 SEO criteria with real content
- [ ] Ensure hints update correctly as content changes
- [ ] Consider adding focus keyword field separate from tags

### Content Calendar
- [ ] Verify posts display on correct dates
- [ ] Test month navigation
- [ ] Ensure click-to-schedule creates draft correctly

### Performance
- [ ] Review API call frequency (avoid excessive regeneration)
- [ ] Ensure ideas fetch is fast (DB read, not AI generation)
- [ ] Profile page load time

## Implementation Plan

### Phase A: App Branding (Quick Win)
1. Create favicon using Gemini image gen or find suitable icon
2. Update `app/layout.tsx` metadata
3. Add Open Graph tags for social sharing

### Phase B: Product Linking
1. Create `components/editor/product-picker.tsx` modal
2. Add TipTap custom node `components/editor/product-node.tsx`
3. Add toolbar button to TipTap editor
4. Style product cards for editor/preview

### Phase C: Image Integration
1. Create `components/editor/image-gallery.tsx` modal
2. Add "From Products" tab to image insert dialog
3. Wire up product image selection flow

### Phase D: Polish & Testing
1. Work through UX polish items
2. Handle edge cases
3. Performance review

## Acceptance Criteria
- [ ] Users can insert product cards with images, name, price, link
- [ ] Users can browse and insert product images without copy/paste
- [ ] App shows custom favicon and proper branding
- [ ] All blog features work reliably without errors
- [ ] Mobile experience is usable
- [ ] SEO panel provides accurate, helpful feedback
- [ ] Ideas persist and don't regenerate unnecessarily
- [ ] User can go from idea → published post in < 5 minutes

## Test Plan
- [ ] Insert a product card from the picker → verify renders correctly
- [ ] Insert an image from product gallery → verify displays
- [ ] Check favicon shows in browser tab
- [ ] Create a blog post from idea → publish (full workflow)
- [ ] Test on mobile device
- [ ] Verify SEO score changes correctly as content is edited
- [ ] Check calendar shows correct posts on correct dates
- [ ] Confirm refresh generates new ideas, dismiss removes them

## Sources
- [Manage media for products](https://shopify.dev/docs/apps/build/online-store/product-media)
- [MediaImage - GraphQL Admin](https://shopify.dev/docs/api/admin-graphql/latest/objects/mediaimage)
- [Product - GraphQL Admin](https://shopify.dev/docs/api/admin-graphql/latest/objects/product)
