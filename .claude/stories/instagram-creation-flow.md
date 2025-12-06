# Story: Instagram Creation Flow

**Epic:** See `.claude/epic.md`
**Status:** complete
**Priority:** P0
**Created:** 2024-12-05
**Updated:** 2024-12-05 10:15

## Objective
Connect Instagram ideas from the dashboard to a full Instagram creation experience, allowing users to build inspirational posts with shop product images, captions, and hashtags.

## Acceptance Criteria
- [x] Clicking an Instagram idea from dashboard pre-fills the composer with the idea content
- [x] Product image picker: browse and select images from Shopify products
- [x] Selected product image displays in the post preview
- [x] Caption is pre-populated from the idea (title + description)
- [x] AI can enhance/refine the caption based on selected product
- [x] Hashtags are suggested based on the idea and selected product
- [x] Save as draft works with all the above data
- [x] "Copy to Clipboard" includes caption + hashtags for manual Instagram posting

## Implementation Notes

### Current State
- Dashboard passes `?newPost=true&title=...&description=...` to Instagram page
- Instagram page has `PostComposer` component but doesn't fully utilize the passed params
- Image selection is manual URL input only

### What Needs to Change
1. **Image Picker Component** - Grid of product images from Shopify
2. **PostComposer Enhancement** - Accept pre-filled caption, integrate image picker
3. **API Enhancement** - Endpoint to fetch product images for picker
4. **Caption Refinement** - AI endpoint to refine caption based on selected product

### Flow
```
Dashboard Idea Card → Instagram Page (composer auto-opens)
                    → Pre-filled caption from idea
                    → User selects product image from picker
                    → AI refines caption for selected product (optional)
                    → Add/adjust hashtags
                    → Save Draft or Copy to Clipboard
```

## Test Plan
- [x] Click Instagram idea from dashboard → composer opens with caption
- [x] Product image picker loads images from Shopify
- [x] Selecting image updates preview
- [x] Caption refinement works with product context
- [x] Save draft persists all data correctly
- [x] Copy to clipboard includes full caption + hashtags

## Completion Evidence
- **Build:** Passes (`npm run build`)
- **TypeScript:** No errors (`npx tsc --noEmit`)
- **Files Created:**
  - `components/instagram/product-image-picker.tsx` - Modal grid of product images
  - `app/api/products/images/route.ts` - Lightweight endpoint for image picker
  - `app/api/ai/caption/refine/route.ts` - AI caption refinement with product context
- **Files Modified:**
  - `components/instagram/post-composer.tsx` - Integrated picker, refine button, product hashtags
  - `lib/gemini.ts` - Added `refineCaption()` function
  - `app/dashboard/instagram/page.tsx` - Added Suspense boundary
  - `app/dashboard/blog/new/page.tsx` - Added Suspense boundary (pre-existing issue)
