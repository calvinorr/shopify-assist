# Story: Search Query Opportunities

**Epic:** `epics/seo-content-intelligence.md`
**Status:** not-started
**Priority:** P1
**Created:** 2024-12-08
**Updated:** 2024-12-08

## Objective
Surface search queries where Herbarium has impressions but low CTR or poor position - these are content opportunities.

## Acceptance Criteria

### Opportunity Detection
- [ ] Identify queries with high impressions but low CTR (<3%)
- [ ] Identify queries with good impressions but poor position (>10)
- [ ] Group queries by theme (color names, dyeing terms, product types)
- [ ] Show estimated traffic potential if improved

### Dashboard Widget
- [ ] "Content Opportunities" card on dashboard
- [ ] Top 5 opportunity queries with one-click action
- [ ] "Create Blog Post" button that pre-fills topic

### SEO Tab Enhancement
- [ ] "Opportunities" sub-section in SEO tab
- [ ] Filter: High Impressions / Low CTR / Poor Position
- [ ] Sortable table with all opportunity queries

### Blog Integration
- [ ] When creating blog, show relevant queries to target
- [ ] Suggest title/keywords based on opportunity queries

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
- [ ] Opportunity scoring algorithm works
- [ ] Queries correctly categorized
- [ ] Dashboard widget displays
- [ ] "Create Blog Post" action works
- [ ] Build passes

## Completion Evidence
_Filled when complete_
