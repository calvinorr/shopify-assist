# Story: Search Query Opportunities

**Epic:** `epics/seo-content-intelligence.md`
**Status:** complete
**Priority:** P1
**Created:** 2024-12-08
**Updated:** 2024-12-09 12:00

## Objective
Surface search queries where Herbarium has impressions but low CTR or poor position - these are content opportunities.

## Acceptance Criteria

### Opportunity Detection
- [x] Identify queries with high impressions but low CTR (<3%)
- [x] Identify queries with good impressions but poor position (>10)
- [x] Group queries by theme (color names, dyeing terms, product types)
- [x] Show estimated traffic potential if improved

### Dashboard Widget
- [x] "Content Opportunities" card on dashboard
- [x] Top 5 opportunity queries with one-click action
- [x] "Create Blog Post" button that pre-fills topic

### SEO Tab Enhancement
- [x] "Opportunities" sub-section in SEO tab
- [x] Filter: High Impressions / Low CTR / Poor Position
- [x] Sortable table with all opportunity queries

### Blog Integration
- [x] When creating blog, show relevant queries to target
- [x] Suggest title/keywords based on opportunity queries

## Implementation Notes

### Opportunity Scoring
```
score = impressions * (1 - ctr) * (position / 10)
```
Higher score = bigger opportunity

### Query Grouping (AI or Rules)
- Color queries: "natural indigo dye", "plant-based blue dye"
- How-to queries: "how to dye wool naturally"
- Product queries: "hand dyed yarn", "botanical dyed wool"

### Threshold Defaults
- Min impressions: 10/month
- CTR threshold: <5% (below average)
- Position threshold: >5 (not in top 5)

## Test Plan
- [x] Opportunity scoring algorithm works
- [x] Queries correctly categorized
- [x] Dashboard widget displays
- [x] "Create Blog Post" action works
- [x] Build passes

## Completion Evidence

**Completed:** 2024-12-09

### Files Created:
- `app/api/analytics/seo/opportunities/route.ts` - Opportunities API with scoring algorithm
- `components/dashboard/ContentOpportunities.tsx` - Dashboard widget
- `components/blog/suggested-keywords.tsx` - Blog editor keyword suggestions

### Files Modified:
- `app/dashboard/analytics/page.tsx` - Added Opportunities section to SEO tab
- `app/dashboard/blog/new/page.tsx` - Added keyword pre-fill and suggestions
- `app/dashboard/blog/[id]/page.tsx` - Added suggestions to edit page
- `components/dashboard/dashboard-content.tsx` - Integrated opportunities widget
- `components/blog/index.tsx` - Exported new component

### Features Delivered:
1. **Opportunity Scoring**: `score = impressions * (1 - ctr) * (position / 10)`
2. **Category Grouping**: color, how-to, product, general
3. **Dashboard Widget**: Top 5 opportunities with "Write Post" action
4. **SEO Tab**: Filterable/sortable opportunities table
5. **Blog Integration**: URL keyword pre-fill + suggested keywords panel

### Build Status:
✅ Production build passes with no errors
