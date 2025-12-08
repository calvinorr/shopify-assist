# Story: SEO Fix

**Epic:** See `.claude/epic.md`
**Status:** complete
**Priority:** P0
**Created:** 2024-12-08
**Updated:** 2024-12-08

## Objective
Fix the broken SEO analytics connection in the Analytics dashboard.

## Acceptance Criteria
- [x] SEO connection to Google Search Console works correctly
- [x] SEO metrics (clicks, impressions, CTR, position) display properly
- [x] No errors in console or API responses

## Implementation Notes
- Root cause: Domain ownership not verified with `calvin.orr@gmail.com` in Google Search Console
- Fixed by verifying domain ownership via TXT record in Shopify DNS
- Updated frontend data mapping to match API response structure (`aggregated` vs `totals`)
- Changed site URL to use domain property format (`sc-domain:herbariumdyeworks.com`)
- Added `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to Vercel production env

## Test Plan
- [x] API returns `siteOwner` permission level
- [x] SEO data fetches successfully with real metrics
- [x] Frontend displays clicks, impressions, CTR, position
- [x] Top search queries table populated

## Completion Evidence
- Local API test: 1 click, 12 impressions, 20% CTR, position 21.8
- Top queries: "herbarium dyeworks", "debbie orr", "bfl sock"
- Production deployed with Google OAuth credentials
- Setup guide created: `docs/setup-seo.md`
