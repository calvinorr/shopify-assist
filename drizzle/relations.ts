import { relations } from "drizzle-orm/relations";
import { users, blogPosts, instagramPosts } from "./schema";

export const blogPostsRelations = relations(blogPosts, ({one}) => ({
	user: one(users, {
		fields: [blogPosts.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	blogPosts: many(blogPosts),
	instagramPosts: many(instagramPosts),
}));

export const instagramPostsRelations = relations(instagramPosts, ({one}) => ({
	user: one(users, {
		fields: [instagramPosts.userId],
		references: [users.id]
	}),
}));