import { z } from "zod";

// Helper function to generate slug
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Post validations
export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(500).optional(),
  published: z.boolean().default(false),
  categoryIds: z.array(z.string()).optional(),
});

export const updatePostSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().max(500).optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(z.string()).optional(),
});

export const getPostBySlugSchema = z.object({
  slug: z.string(),
});

export const deletePostSchema = z.object({
  id: z.string(),
});

export const listPostsSchema = z.object({
  published: z.boolean().optional(),
  categoryId: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

// Category validations
export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
});

export const updateCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const deleteCategorySchema = z.object({
  id: z.string(),
});
