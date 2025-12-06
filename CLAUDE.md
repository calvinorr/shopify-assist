# Shopify Assist - Herbarium Content Automation Engine

## Project Overview

Content automation tool for Herbarium Dyeworks (hand-dyed wool e-commerce) connecting:
- **Shopify** - Product inventory, sales data, color trending
- **Instagram** - Analytics, scheduling, posting
- **Blog CMS** - WYSIWYG editor with AI scaffolding
- **Gemini Flash API** - Content generation (captions, blog posts, ideas)

**Goal**: Reduce marketing time to 45 mins/week (Instagram) + 2-3 hours/month (blog) while maintaining consistent, high-quality content.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: Turso (SQLite edge) with Drizzle ORM
- **Auth**: NextAuth v5 with dev bypass mode
- **Editor**: TipTap (WYSIWYG)
- **State**: Zustand + SWR
- **Icons**: Lucide React

## Project Structure

```
app/
├── api/                    # API routes
│   ├── auth/[...nextauth]/ # NextAuth handlers
│   ├── shopify/            # Shopify sync endpoints
│   ├── instagram/          # Instagram API endpoints
│   └── ai/                 # Gemini API endpoints
├── dashboard/              # Main app pages
│   ├── page.tsx            # Dashboard home
│   ├── instagram/          # Instagram content creator
│   ├── blog/               # Blog post editor
│   ├── products/           # Product management
│   ├── analytics/          # Analytics views
│   └── settings/           # App settings
├── layout.tsx
└── page.tsx                # Redirects to dashboard

components/
├── ui/                     # Base UI components (button, card, etc.)
├── layout/                 # Sidebar, header, etc.
├── editor/                 # TipTap editor components
├── instagram/              # Instagram-specific components
└── blog/                   # Blog-specific components

lib/
├── db.ts                   # Turso/Drizzle connection
├── schema.ts               # Database schema
├── auth.ts                 # NextAuth config with dev bypass
└── utils.ts                # Utility functions

types/                      # TypeScript type definitions
services/                   # API service functions
hooks/                      # Custom React hooks
drizzle/                    # Database migrations
```

## Current Session Progress

**Last updated**: Dec 5, 2025

### Completed This Session
- [x] Project scaffolded with Next.js 14+, Tailwind v4, TypeScript
- [x] Turso database created (`shopify-assist-db`) and schema pushed
- [x] NextAuth v5 configured with dev bypass mode (`DEV_BYPASS_AUTH=true`)
- [x] Dashboard layout with sidebar navigation
- [x] Switched from Claude API to Gemini Flash (cost savings)
- [x] Created `lib/gemini.ts` with AI helper functions
- [x] GitHub repo created: https://github.com/calvinorr/shopify-assist

### API Keys Configured
- [x] `DATABASE_URL` + `DATABASE_AUTH_TOKEN` (Turso)
- [x] `SHOPIFY_ACCESS_TOKEN` (shpat_...) - scopes: read_products, read_orders, read_analytics, read_inventory
- [x] `GOOGLE_AI_API_KEY` (Gemini Flash)
- [ ] Instagram (Phase 2)

### Next Steps
1. **Instagram OAuth** - Connect to Instagram Business Account (P1)
2. **Instagram Analytics** - Track post engagement (P2)
3. **Product Enhancements** - Best sellers filter, sales data sync (P3)

### Recently Completed (Dec 5)
- Dashboard Redesign (QuickActions, ContentStats, ActivityFeed)
- Design System (Select, Textarea, Badge, Skeleton components)
- Instagram Post Creator UI (composer, drafts, manual posting workflow)
- Products page "In Stock" filter

## Development Phases

### Phase 1: MVP (Current)
- [x] Project scaffolding
- [x] Database schema setup
- [x] Auth with dev bypass
- [x] Gemini AI integration (`lib/gemini.ts`)
- [ ] Shopify product sync ← **START HERE**
- [ ] Basic dashboard with real data
- [ ] Basic blog editor (TipTap)

### Phase 2: Instagram Intelligence
- [ ] Instagram OAuth connection
- [ ] AI idea generation (Gemini Flash)
- [ ] Caption generator
- [ ] Instagram post creator UI
- [ ] Scheduling via Instagram API

### Phase 3: Blog Intelligence
- [ ] AI blog topic suggestions
- [ ] Blog post scaffolding
- [ ] Enhanced editor (SEO fields, product linker)
- [ ] Version history

### Phase 4: Analytics Loop
- [ ] Instagram performance tracking
- [ ] Blog analytics
- [ ] Seasonal pattern recognition
- [ ] Advanced dashboard visualizations

## Key Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:push      # Push schema to Turso
npm run db:studio    # Open Drizzle Studio
npm run db:generate  # Generate migrations
```

## Environment Variables

Required in `.env.local`:
- `DATABASE_URL` - Turso database URL
- `DATABASE_AUTH_TOKEN` - Turso auth token
- `AUTH_SECRET` - NextAuth secret
- `DEV_BYPASS_AUTH` - Set to "true" for dev mode

Optional (configure when ready):
- `SHOPIFY_ACCESS_TOKEN` - Shopify Admin API token
- `INSTAGRAM_CLIENT_ID/SECRET` - Instagram OAuth
- `GOOGLE_AI_API_KEY` - Gemini API key

## Dev Bypass Mode

When `DEV_BYPASS_AUTH=true`:
- All routes are accessible without login
- Session returns a dev user (`dev@shopify-assist.local`)
- Yellow indicator shown in sidebar
- Set to `false` to test real auth flow

## API Integration Notes

### Shopify Admin API (GraphQL)
- Base: `https://herbariumdyeworks.myshopify.com/admin/api/2024-12/graphql.json`
- Rate limit: 2000 points/minute
- Fetch: Products, variants, images, sales data

### Instagram Graph API
- Version: v19.0+
- Requires Business Account
- Rate limit: 200 calls/hour
- Endpoints: insights, media, media_publish

### Gemini API (Google AI)
- Model: `gemini-2.0-flash` (fast, cost-effective)
- SDK: `@google/generative-ai`
- Use for: Caption generation, blog scaffolding, idea suggestions

## Design Principles

1. **Approval before automation** - User reviews all content before publishing
2. **Data-driven suggestions** - AI recommendations based on Shopify/Instagram data
3. **Artisan voice** - Content tone: educational, personal, storytelling (not hard-sell)
4. **SEO focus** - Blog posts optimized for search discovery
5. **Time efficiency** - Minimize clicks, maximize AI assistance

## Reference

Full PRD available at: `herbarium-prd.md`
