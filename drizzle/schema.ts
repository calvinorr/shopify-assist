import { sqliteTable, AnySQLiteColumn, text, integer, real, uniqueIndex, foreignKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const aiSuggestions = sqliteTable("ai_suggestions", {
	id: text().primaryKey().notNull(),
	type: text().notNull(),
	suggestion: text().notNull(),
	reasoning: text(),
	used: integer().default(0),
	createdAt: integer("created_at"),
});

export const analytics = sqliteTable("analytics", {
	id: text().primaryKey().notNull(),
	date: text().notNull(),
	topColorsJson: text("top_colors_json"),
	audienceLocationJson: text("audience_location_json"),
	peakPostingTime: text("peak_posting_time"),
	instagramEngagementRate: real("instagram_engagement_rate"),
	instagramPostCount: integer("instagram_post_count"),
	blogViews: integer("blog_views"),
	blogClicksToShop: integer("blog_clicks_to_shop"),
	createdAt: integer("created_at"),
});

export const blogPosts = sqliteTable("blog_posts", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").references(() => users.id),
	title: text().notNull(),
	slug: text(),
	contentHtml: text("content_html"),
	contentMarkdown: text("content_markdown"),
	featuredImageUrl: text("featured_image_url"),
	metaDescription: text("meta_description"),
	focusKeywords: text("focus_keywords"),
	status: text().default("draft"),
	publishedAt: integer("published_at"),
	shopifyProductLinks: text("shopify_product_links"),
	createdAt: integer("created_at"),
	updatedAt: integer("updated_at"),
	focusKeyword: text("focus_keyword"),
	seoScore: integer("seo_score").default(0),
	scheduledAt: integer("scheduled_at"),
},
(table) => [
	uniqueIndex("blog_posts_slug_unique").on(table.slug),
]);

export const instagramPosts = sqliteTable("instagram_posts", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").references(() => users.id),
	shopifyProductId: text("shopify_product_id"),
	caption: text(),
	imageUrls: text("image_urls"),
	hashtags: text(),
	scheduledTime: integer("scheduled_time"),
	postedTime: integer("posted_time"),
	status: text().default("draft"),
	instagramPostId: text("instagram_post_id"),
	likes: integer().default(0),
	comments: integer().default(0),
	saves: integer().default(0),
	impressions: integer().default(0),
	engagementRate: real("engagement_rate"),
	createdAt: integer("created_at"),
	updatedAt: integer("updated_at"),
});

export const products = sqliteTable("products", {
	id: text().primaryKey().notNull(),
	shopifyProductId: text("shopify_product_id"),
	name: text().notNull(),
	description: text(),
	color: text(),
	tags: text(),
	imageUrls: text("image_urls"),
	inventory: integer(),
	price: real(),
	createdAt: integer("created_at"),
	updatedAt: integer("updated_at"),
},
(table) => [
	uniqueIndex("products_shopify_product_id_unique").on(table.shopifyProductId),
]);

export const settings = sqliteTable("settings", {
	id: text().primaryKey().notNull(),
	key: text().notNull(),
	value: text(),
	updatedAt: integer("updated_at"),
},
(table) => [
	uniqueIndex("settings_key_unique").on(table.key),
]);

export const users = sqliteTable("users", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	name: text(),
	image: text(),
	createdAt: integer("created_at"),
	updatedAt: integer("updated_at"),
},
(table) => [
	uniqueIndex("users_email_unique").on(table.email),
]);

