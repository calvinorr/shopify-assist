# Story: Blog Command Center

**Epic:** See `.claude/epic.md`
**Status:** complete
**Priority:** P0
**Created:** 2024-12-04
**Updated:** 2024-12-04
**Completed:** 2024-12-04

## Objective
Transform the blog page into a professional-grade command center that an expert blogger with millions of followers would expect - combining content management, AI-powered ideation, scheduling, and SEO optimization in one powerful interface.

## Rationale
Blog content is SEO gold - it compounds over time, drives organic traffic, and establishes expertise. An expert blogger needs:
- Quick idea generation (no staring at blank pages)
- Visual content calendar (see the pipeline at a glance)
- Scheduling + reminders (consistent publishing cadence)
- One-click from idea → scaffolded draft (reduce friction)
- SEO visibility (which posts need attention)

## Acceptance Criteria

### Section 1: Quick Ideas Panel (Top of Page)
- [x] "Fresh Ideas" section showing 5 AI-generated blog topics
- [x] Ideas are contextual based on:
  - Current season (winter/spring/summer/fall)
  - Upcoming holidays (Christmas, Easter, Mother's Day, etc.)
  - Nature events (solstice, lambing season, dye plant harvests)
  - Shopify data (trending colors, bestsellers, new arrivals)
- [x] Each idea card shows: title, hook sentence, suggested keywords
- [x] "Refresh Ideas" button to generate new batch
- [x] "Start This Post" button → creates scaffolded draft and opens editor
- [x] Ideas persist in localStorage until dismissed or started

### Section 2: Content Calendar View
- [x] Toggle between "List" and "Calendar" view
- [x] Calendar shows posts by scheduled/published date
- [x] Color coding: Draft (gray), Review (yellow), Published (green)
- [x] Click date to create post scheduled for that day
- [ ] Drag-drop posts to reschedule (stretch goal - future enhancement)

### Section 3: Enhanced Post Management
- [x] Filter by status: All | Draft | Scheduled | Published | Needs Attention
- [x] Sort by: Date Created | Date Updated | Title | Scheduled Date
- [x] Search posts by title or content
- [x] Bulk actions: Select All, Delete Selected, Change Status (Draft/Review/Published)
- [x] Post cards show: title, excerpt preview, status badge, scheduled date, SEO score indicator

### Section 4: Scheduling System
- [x] "Schedule" field in blog editor (date/time picker with quick presets)
- [x] Scheduled posts show countdown ("Publishes in 3 days")
- [x] Database schema update: `scheduled_at` column on blog_posts
- [x] API endpoint to fetch posts by schedule status

### Section 5: SEO Health Indicators
- [x] Simple SEO score per post (0-100) based on:
  - Has meta description (20 pts)
  - Meta description is 150-160 chars (10 pts)
  - Has focus keyword (20 pts)
  - Title includes keyword (20 pts)
  - Content length > 500 words (15 pts)
  - Has internal links (15 pts)
- [x] Visual indicator: Red (<50), Yellow (50-75), Green (75+)
- [x] "Needs Attention" filter to show low-SEO posts

### Section 6: Start This Post Flow
- [x] Clicking "Start This Post" on idea card:
  1. Shows loading state
  2. Calls AI to generate full scaffold (title, meta, 5-7 sections)
  3. Creates draft in database with scaffold content
  4. Redirects to editor with content ready to edit
- [x] Scaffold includes actual Shopify product references where relevant
- [x] Uses Herbarium's artisan voice (educational, storytelling)

## Implementation Notes

### Database Changes
```sql
ALTER TABLE blog_posts ADD COLUMN scheduled_at TIMESTAMP;
ALTER TABLE blog_posts ADD COLUMN focus_keyword TEXT;
ALTER TABLE blog_posts ADD COLUMN seo_score INTEGER DEFAULT 0;
```

### New API Endpoints
- `GET /api/blog/ideas` - Generate contextual blog ideas
- `POST /api/blog/scaffold` - Generate full post scaffold from idea
- `GET /api/blog?status=scheduled` - Filter by status
- `PATCH /api/blog/[id]/schedule` - Update schedule date

### Component Structure
```
app/dashboard/blog/
├── page.tsx              # Blog Command Center (redesigned)
├── new/page.tsx          # Existing editor
├── [id]/page.tsx         # Existing edit page
└── calendar/page.tsx     # Optional: dedicated calendar view

components/blog/
├── ideas-panel.tsx       # Quick ideas section
├── content-calendar.tsx  # Calendar view component
├── post-card.tsx         # Enhanced post card with SEO indicator
├── post-filters.tsx      # Filter/sort controls
└── seo-score.tsx         # SEO score badge component
```

### AI Prompts (lib/gemini.ts additions)

**Blog Ideas Generation:**
```
You are a content strategist for Herbarium Dyeworks, an artisan hand-dyed wool business.

Current context:
- Season: {season}
- Upcoming: {holidays}
- Top colors this month: {topColors}
- Bestselling products: {products}

Generate 5 blog post ideas that:
1. Target long-tail SEO keywords fiber artists search for
2. Tie naturally to our products without being salesy
3. Provide genuine educational value
4. Have evergreen potential OR are timely/seasonal

For each idea provide:
- title: SEO-friendly headline (include primary keyword)
- hook: One compelling sentence to intrigue readers
- keywords: 3-5 target keywords
- type: "how-to" | "guide" | "story" | "seasonal" | "product-spotlight"
```

**Blog Scaffold Generation:**
```
You are an SEO content writer for Herbarium Dyeworks, an artisan hand-dyed wool business specializing in naturally dyed wool yarns and rovings.

Write a blog post scaffold for: "{topic}"

Include:
1. SEO-optimized title (H1) with primary keyword
2. Meta description (exactly 155-160 characters)
3. 5-7 section headings (H2) with 2-3 sentence content hints under each
4. Natural mentions of these products where relevant: {relevantProducts}
5. Internal linking suggestions to product pages
6. Suggested call-to-action for the conclusion

Voice guidelines:
- Educational and informative, not salesy
- Personal storytelling when appropriate
- Expert but accessible
- Passionate about the craft
```

## Test Plan
- [ ] Ideas panel loads with 5 contextual suggestions
- [ ] "Start This Post" creates scaffolded draft correctly
- [ ] Calendar view displays posts on correct dates
- [ ] Scheduling a post updates `scheduled_at` in database
- [ ] SEO score calculates correctly based on criteria
- [ ] Filters and sorting work as expected
- [ ] Search finds posts by title and content
- [ ] Mobile responsive (ideas collapse, calendar scrolls)

## Dependencies
- Gemini API (existing)
- Shopify product data (existing)
- Blog API endpoints (existing, needs extension)

## Supersedes
This story combines and replaces:
- `stories/blog-creation-workflow.md` (not-started)
- Phase 3: AI Blog Topic Suggestions (planned)
- Phase 3: Blog Post Scaffolding (planned)
- Phase 3: Enhanced Blog Editor (planned)

## Success Metrics
- Time from "blank page" to "editing scaffold" < 30 seconds
- 100% of posts have SEO score visible
- User can see next 30 days of content at a glance

## Notes
- Calendar drag-drop is a stretch goal - start with click-to-reschedule
- Consider adding "Content Streak" gamification later
- Reminders could be browser notifications or email (Phase 2 of this feature)
