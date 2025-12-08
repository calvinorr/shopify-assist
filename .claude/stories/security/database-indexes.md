# Story: Database Indexes

**Epic:** `epics/security-hardening.md`
**Status:** complete
**Priority:** P0
**Created:** 2024-12-08

## Objective
Add missing database indexes to prevent full table scans on common queries.

## Problem
No indexes defined in `lib/schema.ts`. At scale, queries become increasingly slow:
- User lookup by email (auth) - full scan
- Blog posts by userId - full scan
- Products by color - full scan
- Posts by status - full scan

## Acceptance Criteria
- [ ] Add indexes to frequently queried columns
- [ ] Generate and run migration
- [ ] Verify query performance improvement
- [ ] Document index strategy

## Implementation

### Update Schema
```typescript
// lib/schema.ts

// Users table - add index on email
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  // ...
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
}));

// Blog posts - add indexes
export const blogPosts = sqliteTable("blog_posts", {
  // ...
}, (table) => ({
  userIdIdx: index("blog_posts_user_id_idx").on(table.userId),
  statusIdx: index("blog_posts_status_idx").on(table.status),
  createdAtIdx: index("blog_posts_created_at_idx").on(table.createdAt),
}));

// Instagram posts - add indexes
export const instagramPosts = sqliteTable("instagram_posts", {
  // ...
}, (table) => ({
  userIdIdx: index("instagram_posts_user_id_idx").on(table.userId),
  statusIdx: index("instagram_posts_status_idx").on(table.status),
}));

// Products - add indexes
export const products = sqliteTable("products", {
  // ...
}, (table) => ({
  shopifyIdIdx: index("products_shopify_id_idx").on(table.shopifyProductId),
  colorIdx: index("products_color_idx").on(table.color),
  inventoryIdx: index("products_inventory_idx").on(table.inventory),
}));

// AI Suggestions - add index
export const aiSuggestions = sqliteTable("ai_suggestions", {
  // ...
}, (table) => ({
  typeIdx: index("ai_suggestions_type_idx").on(table.type),
}));

// Allowed emails - add index
export const allowedEmails = sqliteTable("allowed_emails", {
  // ...
}, (table) => ({
  emailIdx: index("allowed_emails_email_idx").on(table.email),
}));
```

### Required Import
```typescript
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
```

### Generate Migration
```bash
npm run db:generate
npm run db:push
```

## Index Summary

| Table | Column | Query Pattern |
|-------|--------|---------------|
| users | email | Auth lookup |
| blog_posts | userId | User's posts |
| blog_posts | status | Filter by status |
| blog_posts | createdAt | Sort by date |
| instagram_posts | userId | User's posts |
| instagram_posts | status | Filter by status |
| products | shopifyProductId | Sync lookup |
| products | color | Color filter |
| products | inventory | Stock filter |
| ai_suggestions | type | Type filter |
| allowed_emails | email | Registration check |

## Test Plan
1. Run `EXPLAIN QUERY PLAN` before/after to verify index usage
2. Time queries on products table with 500+ rows
3. Verify migrations run without data loss
