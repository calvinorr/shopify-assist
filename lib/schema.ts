import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Users table for authentication
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash"), // bcrypt hashed password
  name: text("name"),
  image: text("image"),
  isAdmin: integer("is_admin", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Allowed emails for registration (admin-controlled access)
export const allowedEmails = sqliteTable("allowed_emails", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  addedBy: text("added_by"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Products synced from Shopify
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  shopifyProductId: text("shopify_product_id").unique(),
  handle: text("handle"), // URL-friendly product slug from Shopify
  name: text("name").notNull(),
  description: text("description"),
  color: text("color"),
  tags: text("tags"), // JSON array
  imageUrls: text("image_urls"), // JSON array
  inventory: integer("inventory"),
  price: real("price"),
  currency: text("currency").default("GBP"), // Store currency (GBP for Herbarium)
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Instagram posts (scheduled and published)
export const instagramPosts = sqliteTable("instagram_posts", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  shopifyProductId: text("shopify_product_id"),
  caption: text("caption"),
  imageUrls: text("image_urls"), // JSON array
  hashtags: text("hashtags"), // JSON array
  scheduledTime: integer("scheduled_time", { mode: "timestamp" }),
  postedTime: integer("posted_time", { mode: "timestamp" }),
  status: text("status").$type<"draft" | "scheduled" | "posted" | "failed">().default("draft"),
  instagramPostId: text("instagram_post_id"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  saves: integer("saves").default(0),
  impressions: integer("impressions").default(0),
  engagementRate: real("engagement_rate"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Blog posts with full content
export const blogPosts = sqliteTable("blog_posts", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  title: text("title").notNull(),
  slug: text("slug").unique(),
  contentHtml: text("content_html"),
  contentMarkdown: text("content_markdown"),
  featuredImageUrl: text("featured_image_url"),
  metaDescription: text("meta_description"),
  focusKeywords: text("focus_keywords"), // JSON array
  focusKeyword: text("focus_keyword"), // Primary SEO keyword
  seoScore: integer("seo_score").default(0), // SEO score 0-100
  status: text("status").$type<"draft" | "review" | "published">().default("draft"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  scheduledAt: integer("scheduled_at", { mode: "timestamp" }), // Auto-publish scheduling
  shopifyProductLinks: text("shopify_product_links"), // JSON array
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Daily analytics snapshots
export const analytics = sqliteTable("analytics", {
  id: text("id").primaryKey(),
  date: text("date").notNull(), // YYYY-MM-DD format
  topColorsJson: text("top_colors_json"), // JSON with color sales by location
  audienceLocationJson: text("audience_location_json"), // JSON with location breakdown
  peakPostingTime: text("peak_posting_time"),
  instagramEngagementRate: real("instagram_engagement_rate"),
  instagramPostCount: integer("instagram_post_count"),
  blogViews: integer("blog_views"),
  blogClicksToShop: integer("blog_clicks_to_shop"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// App settings
export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  key: text("key").unique().notNull(),
  value: text("value"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// AI-generated suggestions
export const aiSuggestions = sqliteTable("ai_suggestions", {
  id: text("id").primaryKey(),
  type: text("type").$type<"instagram" | "blog">().notNull(),
  suggestion: text("suggestion").notNull(), // JSON with suggestion details
  reasoning: text("reasoning"),
  used: integer("used", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Blog ideas (persisted AI-generated topic suggestions)
export const blogIdeas = sqliteTable("blog_ideas", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  hook: text("hook").notNull(),
  keywords: text("keywords").notNull(), // JSON array
  type: text("type").notNull(), // how-to, guide, story, seasonal, product-spotlight
  seasonalRelevance: text("seasonal_relevance"),
  status: text("status").$type<"active" | "used" | "dismissed">().default("active"),
  generatedAt: integer("generated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  usedAt: integer("used_at", { mode: "timestamp" }),
  createdPostId: text("created_post_id").references(() => blogPosts.id), // Links to blog post if used
});
