# Story: Analytics & SEO Dashboard

**Epic:** See `.claude/epic.md`
**Status:** not-started
**Priority:** P1
**Created:** 2024-12-06
**Updated:** 2024-12-06 15:30

## Objective
Create an analytics dashboard focused on measuring content performance and SEO impact, helping users understand if their content creation efforts are driving visits, sales, and search rankings.

## Acceptance Criteria

### SEO Performance (Google Search Console)
- [ ] OAuth connection to Google Search Console
- [ ] Display key metrics: Total impressions, clicks, average CTR, average position
- [ ] Top performing queries table (keyword, impressions, clicks, position)
- [ ] Top performing pages table (URL, impressions, clicks, position)
- [ ] Position change tracking (trending up/down indicators)
- [ ] Date range selector (7d, 28d, 90d)

### Blog Content Performance
- [ ] List of blog posts with performance metrics
- [ ] Views per post (if available from Shopify/GA)
- [ ] Search impressions per post (from Search Console)
- [ ] Identify high-performing vs underperforming content

### Content-to-Sales Attribution (Shopify)
- [ ] Track orders with blog referral source
- [ ] Revenue attributed to content
- [ ] Top converting blog posts

### Trend Analysis
- [ ] Week-over-week comparison
- [ ] Seasonal pattern identification
- [ ] Content gap analysis (keywords with impressions but no content)

## Implementation Notes

### Google Search Console Integration
```
OAuth 2.0 Scopes:
- https://www.googleapis.com/auth/webmasters.readonly

API Endpoints:
- searchanalytics.query - Get search performance data
- sites.list - List verified sites
```

### Data Storage
New tables:
- `seo_snapshots` - Daily SEO metrics snapshot
- `keyword_rankings` - Keyword position tracking over time
- `content_attribution` - Blog post to order attribution

### Dashboard Layout
1. **Overview Cards** - Key metrics at a glance
2. **Search Performance Chart** - Impressions/clicks over time
3. **Top Keywords Table** - Sortable, filterable
4. **Top Pages Table** - With blog post matching
5. **Content Opportunities** - Keywords without matching content

### API Routes
- `GET /api/analytics/seo` - SEO metrics summary
- `GET /api/analytics/seo/keywords` - Keyword performance
- `GET /api/analytics/seo/pages` - Page performance
- `POST /api/analytics/seo/connect` - Initiate Google OAuth
- `GET /api/analytics/content` - Blog post performance

### Dependencies
- Google Search Console API access
- Site must be verified in Search Console
- OAuth app setup in Google Cloud Console

## Value Proposition
This dashboard answers the key question: **"Is my content creation actually helping?"**

By tracking:
1. **Search visibility** - Are more people finding us?
2. **Ranking improvements** - Are we moving up for target keywords?
3. **Content ROI** - Which posts drive actual sales?

## Test Plan
- [ ] Google OAuth flow completes successfully
- [ ] SEO metrics display correctly for date ranges
- [ ] Keywords table sorts and filters
- [ ] Position changes show correct trend indicators
- [ ] Blog post matching works correctly

## Completion Evidence
_To be filled when complete_
