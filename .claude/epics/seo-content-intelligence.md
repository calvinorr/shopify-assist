# Epic: SEO & Content Intelligence

**Created:** 2024-12-08
**Status:** active
**Parent:** Main epic (`epic.md`)

## Vision
Transform raw Google Search Console data into actionable content insights. Connect what people are searching for with what content to create, and measure which blog posts and Instagram content actually drive traffic.

## Core Problem
We have:
- Blog creation tools ✓
- Instagram content workflow ✓
- Google Search Console connected ✓
- Shopify product data ✓

We need:
- Insight into *what* is working (which content drives traffic)
- Understanding *why* it's working (which keywords, which products)
- Recommendations on *what to create next* based on search demand

## Target Outcome
A closed-loop content system where:
1. **Discover** → See what people are searching for (GSC queries)
2. **Create** → Blog/Instagram content targeting those searches
3. **Measure** → Track if that content ranks and drives traffic
4. **Optimize** → AI suggestions based on performance data

---

## Stories

### Phase 1: Content Performance Attribution

| Story | Priority | Status | File |
|-------|----------|--------|------|
| Blog Performance Tracking | P0 | not-started | `blog-performance-tracking.md` |
| Search Query Opportunities | P1 | not-started | `search-query-opportunities.md` |
| Content-to-Traffic Attribution | P1 | not-started | `content-traffic-attribution.md` |

### Phase 2: AI-Powered Recommendations

| Story | Priority | Status | File |
|-------|----------|--------|------|
| AI Content Suggestions from GSC | P1 | not-started | `ai-content-suggestions.md` |
| Keyword Gap Analysis | P2 | not-started | `keyword-gap-analysis.md` |

### Phase 3: Instagram Correlation

| Story | Priority | Status | File |
|-------|----------|--------|------|
| Instagram Traffic Attribution | P2 | not-started | `instagram-traffic-attribution.md` |
| Cross-Platform Content Calendar | P2 | not-started | `cross-platform-calendar.md` |

---

## Success Metrics

1. **User can answer:** "Which of my blog posts are driving the most organic traffic?"
2. **User can answer:** "What are people searching for that I should write about?"
3. **User can see:** AI-generated blog ideas based on real search queries
4. **User can track:** Did my new blog post start ranking for target keywords?

---

## Technical Dependencies

- Google Search Console OAuth ✓ (already built)
- Blog system ✓ (already built)
- Gemini AI ✓ (already built)
- New: Page-level GSC data (requires URL inspection or filtered queries)
- New: Link blog posts to GSC queries

---

## Notes

- GSC data has 2-3 day delay - set expectations in UI
- Initial focus on blog (easier to attribute than Instagram)
- Consider storing historical GSC snapshots for trend analysis
