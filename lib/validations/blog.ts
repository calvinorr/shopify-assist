import { z } from "zod";

export const createBlogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().max(500000).optional(),
  excerpt: z.string().max(500).optional(),
  tags: z.string().max(1000).optional(),
  status: z.enum(["draft", "review", "published"]).default("draft"),
  scheduledAt: z.number().optional(),
});

export const updateBlogPostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().max(500000).optional(),
  excerpt: z.string().max(500).optional(),
  tags: z.string().max(1000).optional(),
  status: z.enum(["draft", "review", "published"]).optional(),
  scheduledAt: z.number().nullable().optional(),
  focusKeyword: z.string().max(100).optional(),
  metaDescription: z.string().max(160).optional(),
});

export const blogIdeaUpdateSchema = z.object({
  status: z.enum(["active", "used", "dismissed"]).optional(),
  createdPostId: z.string().optional(),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
