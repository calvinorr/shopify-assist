import { z } from "zod";

export const createInstagramPostSchema = z.object({
  caption: z.string().max(2200).optional(),
  imageUrls: z.array(z.string().url()).max(10).optional(),
  hashtags: z.array(z.string()).max(30).optional(),
  shopifyProductId: z.string().optional(),
  status: z.enum(["draft", "scheduled", "posted", "failed"]).default("draft"),
  scheduledTime: z.number().optional(),
});

export const updateInstagramPostSchema = z.object({
  caption: z.string().max(2200).optional(),
  imageUrls: z.array(z.string().url()).max(10).optional(),
  hashtags: z.array(z.string()).max(30).optional(),
  status: z.enum(["draft", "scheduled", "posted", "failed"]).optional(),
  scheduledTime: z.number().nullable().optional(),
});

export type CreateInstagramPostInput = z.infer<typeof createInstagramPostSchema>;
export type UpdateInstagramPostInput = z.infer<typeof updateInstagramPostSchema>;
