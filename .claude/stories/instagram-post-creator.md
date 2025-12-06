# Story: Instagram Post Creator UI

**Priority:** P2
**Status:** complete
**Epic:** Phase 2 - Instagram Intelligence
**Created:** 2024-12-05
**Updated:** 2024-12-05

## Objective

Build a functional Instagram post creator that works without OAuth (draft/export mode) but is architected to easily connect when OAuth is added.

## Design Principles

1. **OAuth-Ready** - All post data structured for Instagram Graph API
2. **Offline-First** - Works fully without connection (drafts, copy-paste export)
3. **AI-Powered** - Leverage existing caption generator
4. **Product-Linked** - Can attach products from Shopify inventory

## Acceptance Criteria

### Post Composer
- [x] Image upload/preview area (single image for MVP)
- [x] Caption textarea with character count (2,200 max)
- [x] AI caption generator integration (existing)
- [x] Hashtag suggestions (categorized)
- [ ] Product picker to link featured product (deferred)

### Draft Management
- [x] Save drafts to database
- [x] List view of drafts with status
- [x] Edit existing drafts
- [x] Delete drafts

### Export/Manual Post Flow
- [x] "Copy to Clipboard" button for caption
- [ ] Download image button (deferred - images are URLs)
- [x] Instructions for manual posting
- [x] Mark as "Posted" (manual confirmation)

### OAuth-Ready Architecture
- [x] `instagramPosts` table with fields for API (mediaUrl, caption, scheduledAt, postedAt, instagramMediaId)
- [ ] Service layer abstraction (`services/instagram.ts`) (deferred to OAuth story)
- [x] Connection status indicator in UI
- [x] "Connect Instagram" placeholder button

## Database Schema

```sql
instagramPosts (
  id TEXT PRIMARY KEY,
  caption TEXT,
  hashtags TEXT, -- JSON array
  imageUrl TEXT,
  productId TEXT, -- optional linked product
  status TEXT, -- draft | scheduled | posted | failed
  scheduledAt INTEGER,
  postedAt INTEGER,
  instagramMediaId TEXT, -- filled after OAuth posting
  createdAt INTEGER,
  updatedAt INTEGER
)
```

## Implementation Plan

1. Add `instagramPosts` table to schema
2. Create Instagram service layer (mock for now)
3. Build PostComposer component
4. Build DraftsList component
5. Wire up the Instagram page
6. Add export/copy functionality

## Out of Scope

- Carousel posts (multiple images)
- Reels/video
- Stories
- Actual Instagram API integration (separate OAuth story)

## Files to Create/Modify

- `lib/schema.ts` - Add instagramPosts table
- `services/instagram.ts` - Service abstraction
- `app/api/instagram/posts/route.ts` - CRUD API
- `components/instagram/post-composer.tsx`
- `components/instagram/drafts-list.tsx`
- `app/dashboard/instagram/page.tsx` - Main UI
