# Herbarium Content Automation App - PRD

**Project Name**: Herbarium Content Automation Engine  
**Author**: Calvin Orr  
**Date**: December 2, 2025  
**Status**: Ready for Development  
**Audience**: Solo developer building own personal productivity tool  

---

## 1. EXECUTIVE SUMMARY

### Problem Statement
Herbarium Dyeworks (hand-dyed wool e-commerce store) struggles to drive customer traffic due to:
- Time constraints (production takes priority over marketing)
- Outdated marketing channels (Ravelry, email lists no longer dominant)
- Content creation bottleneck (manual Instagram posts, no blog strategy, YouTube/TikTok unexplored)
- Need for consistent, high-quality content across platforms

### Solution
**Herbarium Content Automation Engine** = personal productivity app connecting:
- **Shopify store** (product inventory, sales data, color trending)
- **Instagram** (analytics, scheduling, posting)
- **Blog CMS** (cloud-hosted blog content with WYSIWYG editor)
- **AI content generation** (Gemini Flash API for ideas, captions, blog scaffolding)

**Core focus**: Instagram weekly rhythm + monthly blog posts for SEO, powered by Shopify data intelligence.

### Expected Outcomes
- **Weekly**: 2-3 Instagram posts auto-scheduled (45 mins of your time)
- **Monthly**: 1-2 blog posts published to Shopify + Instagram cross-promotion (2-3 hours)
- **Analytics loop**: Track audience location, best-selling colors, content performance
- **Long-term**: Blog SEO traffic drives discovery; Instagram drives engagement; both funnel to Shopify

---

## 2. PRODUCT OVERVIEW

### Core Features

#### **A. Dashboard (Home Screen)**
Central hub showing real-time insights from Shopify + Instagram:

**Section 1: Weekly at a Glance**
- Last 7 days best-selling colors (with location breakdown: UK %, US %, Canada %)
- Recent product additions to Shopify (last 5 products)
- Instagram engagement summary (total likes, comments, saves last week)
- Peak posting times for your audience (e.g., "7pm GMT = highest engagement")
- Top 3 performing posts (by engagement rate)

**Section 2: Monthly Trends**
- Top 5 colors by revenue (30-day rolling window)
- Seasonal patterns (e.g., "Gift-buying spike detected in Dec")
- Audience location breakdown (pie chart: UK 45%, US 35%, Canada 15%, Other 5%)
- Blog traffic summary (if integrated)

**Section 3: Action Items**
- "3 suggested Instagram post ideas for this week"
- "1 recommended blog topic for this month"
- "Optimal posting time: Tomorrow 7pm"
- Quick buttons: "Create Instagram Post", "Start Blog Post"

#### **B. Instagram Content Creator**

**Workflow:**
1. **Idea Suggestion** (AI-powered)
   - App analyzes: Recent product additions, top colors, peak engagement times, Instagram analytics
   - AI generates 3 post ideas with reasoning
   - Example: "Carousel post about Madder Red (trending, 40% UK audience, carousel posts get 25% more engagement)"

2. **Content Composer**
   - **Image handler**: Upload 1-4 images (from Shopify product photos OR your own photos)
   - **Image editor**: Crop, caption overlays, optimization for IG
   - **Carousel builder**: Arrange images, add text overlays for each slide
   - **Caption generator**: AI writes 3 caption variations (artisan voice)
   - **You select & edit**: Pick favorite caption, tweak as needed
   - **Hashtag suggester**: AI suggests 20-30 relevant hashtags grouped by strategy (brand, product, community, trending)

3. **Approval & Scheduling**
   - Preview post on phone mockup (how it looks on Instagram)
   - Approve caption, images, hashtags
   - Choose posting option:
     - **Schedule now**: App uses Instagram API to schedule (Instagram Business Account required)
     - **Create draft**: Save as draft for manual posting later
   - Confirmation: "Post scheduled for tomorrow 7pm GMT"

4. **Analytics Tracking**
   - After posting, app tracks: Likes, comments, saves, impressions, engagement rate
   - Feeds into dashboard for next week's suggestions

---

#### **C. Blog Post Creator (Full Editor)**

**Workflow:**

1. **Topic Selection**
   - AI suggests monthly blog topics (based on best-selling colors, seasonal calendar, SEO keywords)
   - Example suggestions:
     - "Deep Blue Indigo: Why December is Peak Dyeing Season"
     - "Madder Root to Finished Wool: Our 3-Week Process"
     - "Gift Guide: Artisan Wool for Knitters"
   - You select topic or propose your own

2. **AI Scaffold Generation**
   - App queries: Product data (color, dye process, inventory), Shopify tags, blog best practices
   - AI generates HTML blog post scaffold with:
     - SEO-optimized headline (H1)
     - Meta description (160 chars)
     - 5-7 sections with suggested content structure
     - Internal links to relevant Shopify products (e.g., "Try our Madder Deep Red")
     - Call-to-action at end ("Shop this color")
     - Suggested images/captions
   - Post appears in editor ready for editing

3. **Full WYSIWYG Editor**
   - **Rich text editing**: Headings, bold, italic, lists, blockquotes
   - **Image management**:
     - Insert images from Shopify product library
     - Upload your own photos (process shots, finished products, dyevat photos)
     - Image optimization (auto-resize for web)
     - Alt text generation
   - **Link management**: Add internal links to Shopify products (with product selector)
   - **Preview mode**: See exactly how post will look when published
   - **Draft saving**: Auto-save to Turso every 30 seconds
   - **Version history**: Track edits (optional: revert to previous versions)

4. **Formatting & Structure**
   - App generates valid HTML ready for Shopify blog
   - Formatting saved in database: HTML (for Shopify), Markdown (for your archive), Plain text (for export)
   - SEO meta tags included (headline, description, keywords)

5. **Approval & Publishing**
   - Review preview one final time
   - Mark as "Ready to Publish"
   - Publishing options:
     - **Export as HTML**: Copy/paste into Shopify admin blog editor
     - **Turso storage**: Blog lives in database for your records
     - **File download**: Save as .html or .md file for backup
   - Status tracking: "Draft" → "Ready for Review" → "Published"

6. **Blog Post Metadata**
   - Title, slug (URL), publish date, author, featured image
   - Tags/categories (auto-populated from Shopify product tags)
   - SEO fields: Meta description, focus keywords, reading time
   - Internal links to products (tracked for analytics)

---

#### **D. Analytics & Insights**

**Dashboard Visualizations:**

1. **Best-Selling Colors by Location**
   - Table: Color name | UK sales | US sales | Canada sales | Other | Total
   - Filter by: Last 7 days, 30 days, 90 days
   - Graph: Pie chart of audience location breakdown
   - Insight: "Deep Blue trending strongest in UK (45% of sales)"

2. **Instagram Performance**
   - Chart: Engagement rate by post type (carousel vs. single image)
   - Chart: Posting time vs. engagement (when should you post?)
   - Table: Last 20 posts with likes, comments, saves, engagement rate
   - Trend: "Carousel posts get 25% more engagement"

3. **Product Performance**
   - Table: Product name | Shopify sales | Instagram mentions | Blog mentions | Total awareness
   - Insight: Which products are winning? Which need storytelling boost?

4. **Seasonal Patterns**
   - Timeline: Sales/engagement patterns by month
   - Insight: "December = 60% of annual revenue (gifting)"

5. **Blog Analytics** (if integrated later)
   - Page views, click-throughs to Shopify, time on page
   - Top-performing blog topics
   - SEO keywords driving traffic

---

#### **E. Settings & Configuration**

**User Settings:**
- Shopify store credentials (API key, access token)
- Instagram Business Account connection (OAuth)
- Turso database connection
- Gemini API key (for AI generation)
- Brand voice guidelines (app learns your tone)
- Posting preferences (best times, frequency)

**Data Management:**
- Manual sync button: "Refresh Shopify data now"
- Export data: Download all blog posts as .zip
- Privacy/security: Data stored in Turso, encrypted in transit

---

## 3. USER STORIES

### Story 1: Weekly Instagram Workflow
**As a** busy artisan dyer  
**I want to** create and schedule Instagram posts in under 45 minutes per week  
**So that** I maintain consistent presence without sacrificing production time

**Acceptance Criteria:**
- Dashboard shows 3 suggested post ideas (AI-powered) ✓
- I can upload images and edit captions in <10 minutes ✓
- App auto-generates 3 caption variations (artisan tone) ✓
- Post can be scheduled via Instagram API for future date ✓
- Next week's dashboard shows engagement metrics from last week's posts ✓

---

### Story 2: Monthly Blog Strategy
**As a** solopreneur building SEO traffic  
**I want to** create professional blog posts with AI scaffolding and full editing control  
**So that** I rank for natural dyeing keywords without spending hours writing

**Acceptance Criteria:**
- AI suggests 4-6 monthly blog topics based on best-selling colors ✓
- App generates HTML blog post structure (headline, sections, links) ✓
- Full WYSIWYG editor lets me edit, add images, tweak content ✓
- Blog posts saved to Turso with version history ✓
- Export as HTML ready to paste into Shopify blog ✓

---

### Story 3: Data-Driven Decisions
**As a** data-conscious business owner  
**I want to** see which colors/products are trending and where my audience is located  
**So that** I can tailor content to what actually sells

**Acceptance Criteria:**
- Dashboard shows top-selling colors by location (UK, US, Canada breakdown) ✓
- Analytics track Instagram engagement by post type (carousel vs. single) ✓
- Trends identify seasonal patterns (e.g., Dec = gifting spike) ✓
- Insights suggest content direction (e.g., "Double down on Madder Red") ✓

---

### Story 4: Approval Before Automation
**As a** cautious business owner  
**I want to** review all content (Instagram, blog) before it publishes  
**So that** I maintain brand voice and catch errors

**Acceptance Criteria:**
- Instagram posts appear as drafts for my approval ✓
- Blog posts marked "Ready for Review" before publishing ✓
- I can edit captions, images, text anytime before approval ✓
- Clear "Approve & Schedule" button prevents accidental posts ✓

---

### Story 5: Image Management
**As a** visual creator  
**I want to** use both Shopify product images AND my own photography  
**So that** I can mix product shots with process photos and behind-the-scenes content

**Acceptance Criteria:**
- Image browser shows Shopify product library ✓
- Upload button lets me add my own photos ✓
- Carousel builder organizes multiple images with captions ✓
- Images auto-optimized for Instagram dimensions ✓
- Blog editor embeds images with alt text ✓

---

## 4. FEATURE BREAKDOWN

### Phase 1: MVP (Weeks 1-4) - Foundation

**Priority: CRITICAL**

#### 4.1.1 Shopify Integration
- OAuth connection to Shopify store
- Fetch products via GraphQL API: name, title, description, variants (colors), images, tags, inventory, sales data
- Store Shopify data in Turso (sync daily or on-demand)
- Display product list with color tagging

#### 4.1.2 Instagram Analytics Connection
- OAuth connection to Instagram Business Account
- Fetch insights via Graph API v19: Last 30 posts metrics, account insights, follower demographics, peak times
- Store Instagram analytics in Turso (sync daily)
- Display analytics dashboard

#### 4.1.3 Turso Database Setup
- Create database schema: products, instagram_posts, blog_posts, analytics, settings
- Test read/write operations
- Implement auto-backup strategy

#### 4.1.4 Dashboard (MVP Version)
- Display: Best-selling colors (location breakdown), recent products, Instagram summary, peak posting time
- Basic charts: Pie chart for audience location, bar chart for top colors

#### 4.1.5 Basic Blog Post Editor
- WYSIWYG editor (TipTap or similar)
- Text formatting: headings, bold, italic, lists, links
- Image upload: From file or Shopify products
- Save to Turso as HTML + Markdown
- Preview mode
- Status workflow: Draft → Ready for Review

---

### Phase 2: Instagram Intelligence (Weeks 5-8)

#### 4.2.1 AI Idea Generation (Gemini Flash API)
- Weekly suggestion generation: Input recent products, best colors, Instagram analytics
- Output: 3 Instagram post ideas with reasoning
- Store suggestions in Turso

#### 4.2.2 Caption Generation
- AI generates 3 caption variations (artisan tone)
- Hashtag suggestions grouped by: Brand, Product, Community, Trending

#### 4.2.3 Instagram Post Creator UI
- Step-by-step workflow: Select idea → Upload images → Edit caption → Preview → Schedule
- Image editor (crop, optimize)
- Phone mockup preview

#### 4.2.4 Instagram API Integration (Posting)
- POST request to schedule posts
- Carousel support (1080x1350px, 8 images max)
- Draft option if not ready

---

### Phase 3: Blog Intelligence & Optimization (Weeks 9-12)

#### 4.3.1 AI Blog Topic Suggestions
- Monthly suggestion engine
- Input: Best-selling colors, seasonal calendar, SEO keywords
- Output: 4-6 blog post ideas

#### 4.3.2 AI Blog Post Scaffolding
- Generates complete blog structure: H1, meta description, 5-7 sections, internal links, CTA
- Valid HTML for Shopify

#### 4.3.3 Enhanced Blog Editor
- SEO fields: Meta description, keywords, reading time
- Product linker: Search/insert Shopify products
- Image library: Browse Shopify or upload custom
- Version history: Track edits, revert if needed
- Metadata: Title, slug, featured image, publish date

#### 4.3.4 Blog Post Templates
- Pre-built templates: Product spotlight, How-to guide, Behind-the-scenes, Gift guide

---

### Phase 4: Analytics Loop (Weeks 13-16)

#### 4.4.1 Instagram Performance Analytics
- Track engagement by post type, posting time, color featured
- Provide insights to next week's suggestions

#### 4.4.2 Blog Analytics
- Page views, click-throughs, time on page
- Link blog topics to product sales

#### 4.4.3 Seasonal Pattern Recognition
- Historical analysis: Sales by month, colors by season
- Auto-generate seasonal content calendar

#### 4.4.4 Advanced Dashboard
- Heatmap: Posting time vs. engagement
- Trends over time
- Correlations: Blog topics to sales
- Predictive insights

---

## 5. DATA MODELS

### Turso Database Schema

```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  shopify_product_id TEXT UNIQUE,
  name TEXT NOT NULL,
  color TEXT,
  tags TEXT,
  image_urls TEXT,
  inventory INTEGER,
  price DECIMAL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE instagram_posts (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  shopify_product_id TEXT,
  caption TEXT,
  image_urls TEXT,
  hashtags TEXT,
  scheduled_time TIMESTAMP,
  posted_time TIMESTAMP,
  status TEXT,
  instagram_post_id TEXT,
  likes INTEGER,
  comments INTEGER,
  saves INTEGER,
  impressions INTEGER,
  engagement_rate DECIMAL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content_html TEXT,
  content_markdown TEXT,
  featured_image_url TEXT,
  meta_description TEXT,
  focus_keywords TEXT,
  status TEXT,
  published_at TIMESTAMP,
  shopify_product_links TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE analytics (
  id TEXT PRIMARY KEY,
  date DATE,
  top_colors_json TEXT,
  audience_location_json TEXT,
  peak_posting_time TEXT,
  instagram_engagement_rate DECIMAL,
  instagram_post_count INTEGER,
  blog_views INTEGER,
  blog_clicks_to_shop INTEGER,
  created_at TIMESTAMP
);

CREATE TABLE settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE,
  value TEXT,
  updated_at TIMESTAMP
);
```

---

## 6. API SPECIFICATIONS

### Shopify Admin GraphQL API
- Auth: OAuth 2.0
- Base URL: `https://herbariumdyeworks.myshopify.com/admin/api/2024-12/graphql.json`
- Endpoints: GetProducts, GetProductMetrics
- Rate Limit: 2000 points/minute

### Instagram Graph API
- Auth: OAuth 2.0
- Base URL: `https://graph.instagram.com/v19.0`
- Endpoints: GET insights, GET media, POST media_publish
- Rate Limit: 200 calls/hour

### Gemini API (Google AI)
- Auth: API key
- Base URL: `https://generativelanguage.googleapis.com/v1beta`
- Model: `gemini-2.0-flash` (cost-effective, fast)
- Endpoint: POST generateContent

### Turso Database
- Auth: Database token
- Operations: SQL queries (SELECT, INSERT, UPDATE)

---

## 7. SUCCESS METRICS

### App Usage Metrics
- Weekly Instagram posts created: 2-3/week
- Time on Instagram creation: <45 mins/week
- Instagram posts scheduled via app: 80%+
- Monthly blog posts: 1-2/month
- Time on blog creation: 2-3 hours/month
- Blog posts using AI scaffolding: 100%

### Business Metrics
- Instagram followers: +200/quarter
- Instagram engagement rate: 4%+
- Blog traffic: 500+ views/month (goal month 3)
- Blog-driven clicks: 20%+ of blog traffic
- Sales lift on featured colors: +15%
- Audience location accuracy: 90%+

### Content Quality
- Brand voice consistency: 90%+
- Blog SEO score: 80+
- Readability: Grade 8-10
- Product link accuracy: 100%

---

## 8. DEVELOPMENT ROADMAP

### Phase 1: MVP (Weeks 1-4)
Shopify integration, Instagram OAuth, Turso database, basic dashboard, simple blog editor

### Phase 2: Instagram Intelligence (Weeks 5-8)
Gemini Flash API integration, AI suggestions, caption generation, Instagram posting, hashtag engine

### Phase 3: Blog Intelligence (Weeks 9-12)
AI blog topics, post scaffolding, enhanced editor, SEO fields, product linker

### Phase 4: Analytics & Optimization (Weeks 13-16)
Performance tracking, blog analytics, seasonal patterns, advanced dashboard

### Phase 5: Polish & Iteration (Week 17+)
Bug fixes, user feedback, performance optimization, documentation

---

## 9. TECH STACK RECOMMENDATIONS

### Frontend
- Framework: React or Vue
- Styling: TailwindCSS
- Editor: TipTap (WYSIWYG)
- State Management: Zustand or Pinia
- API Client: Axios + SWR/React Query

### Backend/Database
- Database: Turso (SQLite)
- ORM: Drizzle or sql.js
- API Framework: Node.js Express (optional serverless)
- Auth: OAuth libraries

### APIs
- Shopify: GraphQL Admin API v2024-12
- Instagram: Graph API v19.0+
- Gemini: Google AI SDK (@google/generative-ai)

### Deployment
- Frontend: Vercel or Netlify
- Serverless: Vercel Functions
- Database: Turso (hosted)

### Development Tools
- Editor: VS Code + Cline
- Version Control: GitHub
- Monitoring: Vercel Analytics

---

## 10. RISKS & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Instagram API rate limits | Post delays | Queue system; batch requests |
| Shopify data sync delays | Outdated dashboard | Retry logic; manual "Sync Now" |
| Gemini API costs | Unexpected expenses | Monitor usage; Gemini Flash is cost-effective |
| Brand voice inconsistency | Captions feel off | Fine-tune prompts over time |
| Blog HTML formatting issues | Shopify breakage | Test exports; Markdown alternative |
| Turso storage limits | Database full | Monitor usage; archival strategy |
| Instagram token expiry | App stops posting | Auto-refresh; user notifications |
| Draft pile-up | Forgotten approvals | Draft cleanup; notifications |

---

## 11. GLOSSARY

- **Artisan Voice**: Storytelling-focused, educational, personal, never hard-sell
- **Carousel Post**: Multi-image Instagram post (2-10 images)
- **Engagement Rate**: (Likes + Comments + Saves) / Impressions × 100
- **Graph API**: Meta's API for Instagram/Facebook data
- **GraphQL**: Query language (Shopify Admin API)
- **WYSIWYG**: Visual editor (not code)
- **OAuth**: Secure authentication protocol
- **Turso**: Hosted SQLite database
- **API Rate Limit**: Maximum API calls per time period
- **Meta Description**: 160-char search result snippet
- **SEO Keywords**: Words/phrases for search ranking

---

## 12. NEXT STEPS

1. Review this PRD
2. Clarify any ambiguities
3. Confirm tech stack
4. Create GitHub repository with project structure
5. Set up Turso database with schema
6. Begin Phase 1 development with Claude Code/Cline
7. Deploy MVP to Vercel

---

**END OF PRD**

This PRD is ready for Claude Code (Cline). Upload to GitHub and reference specific sections when requesting features.
