import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";

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
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
}));

// Allowed emails for registration (admin-controlled access)
export const allowedEmails = sqliteTable("allowed_emails", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  addedBy: text("added_by"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, (table) => ({
  emailIdx: index("allowed_emails_email_idx").on(table.email),
}));

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
}, (table) => ({
  shopifyIdIdx: index("products_shopify_id_idx").on(table.shopifyProductId),
  colorIdx: index("products_color_idx").on(table.color),
  inventoryIdx: index("products_inventory_idx").on(table.inventory),
}));

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
}, (table) => ({
  userIdIdx: index("instagram_posts_user_id_idx").on(table.userId),
  statusIdx: index("instagram_posts_status_idx").on(table.status),
}));

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
}, (table) => ({
  userIdIdx: index("blog_posts_user_id_idx").on(table.userId),
  statusIdx: index("blog_posts_status_idx").on(table.status),
  createdAtIdx: index("blog_posts_created_at_idx").on(table.createdAt),
}));

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
}, (table) => ({
  typeIdx: index("ai_suggestions_type_idx").on(table.type),
}));

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
}, (table) => ({
  statusIdx: index("blog_ideas_status_idx").on(table.status),
}));

// Google OAuth tokens for Search Console integration
export const googleTokens = sqliteTable("google_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  scope: text("scope").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// AI content recommendations cache (SEO opportunities)
export const aiRecommendations = sqliteTable("ai_recommendations", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  type: text("type").$type<"new_post" | "optimize" | "quick_win" | "long_tail">().notNull(),
  title: text("title").notNull(),
  targetKeyword: text("target_keyword").notNull(),
  suggestedTitle: text("suggested_title"),
  explanation: text("explanation").notNull(),
  estimatedOpportunity: integer("estimated_opportunity").notNull(),
  confidence: text("confidence").$type<"high" | "medium" | "low">().notNull(),
  priority: text("priority").$type<"high" | "medium" | "low">().notNull(),
  relatedQueries: text("related_queries"), // JSON array
  existingPostId: text("existing_post_id").references(() => blogPosts.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
}, (table) => ({
  userIdIdx: index("ai_recommendations_user_id_idx").on(table.userId),
  expiresAtIdx: index("ai_recommendations_expires_at_idx").on(table.expiresAt),
}));
