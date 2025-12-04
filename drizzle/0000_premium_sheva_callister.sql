-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `ai_suggestions` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`suggestion` text NOT NULL,
	`reasoning` text,
	`used` integer DEFAULT false,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `analytics` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`top_colors_json` text,
	`audience_location_json` text,
	`peak_posting_time` text,
	`instagram_engagement_rate` real,
	`instagram_post_count` integer,
	`blog_views` integer,
	`blog_clicks_to_shop` integer,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`title` text NOT NULL,
	`slug` text,
	`content_html` text,
	`content_markdown` text,
	`featured_image_url` text,
	`meta_description` text,
	`focus_keywords` text,
	`status` text DEFAULT 'draft',
	`published_at` integer,
	`shopify_product_links` text,
	`created_at` integer,
	`updated_at` integer,
	`focus_keyword` text,
	`seo_score` integer DEFAULT 0,
	`scheduled_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `instagram_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`shopify_product_id` text,
	`caption` text,
	`image_urls` text,
	`hashtags` text,
	`scheduled_time` integer,
	`posted_time` integer,
	`status` text DEFAULT 'draft',
	`instagram_post_id` text,
	`likes` integer DEFAULT 0,
	`comments` integer DEFAULT 0,
	`saves` integer DEFAULT 0,
	`impressions` integer DEFAULT 0,
	`engagement_rate` real,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`shopify_product_id` text,
	`name` text NOT NULL,
	`description` text,
	`color` text,
	`tags` text,
	`image_urls` text,
	`inventory` integer,
	`price` real,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_shopify_product_id_unique` ON `products` (`shopify_product_id`);--> statement-breakpoint
CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `settings_key_unique` ON `settings` (`key`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`image` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
*/