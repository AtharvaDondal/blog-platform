import { eq, desc, and } from "drizzle-orm";

import {
  createPostSchema,
  deletePostSchema,
  generateSlug,
  getPostBySlugSchema,
  listPostsSchema,
  updatePostSchema,
} from "../../lib/validations";
import { postCategories, posts } from "../db/schema";
import { db } from "../db";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from '@trpc/server'; 
import z from "zod";

export const postRouter = router({
  // List all posts with optional filters
  list: publicProcedure.input(listPostsSchema).query(async ({ input }) => {
    const conditions = [];

    if (input.published !== undefined) {
      conditions.push(eq(posts.published, input.published));
    }

    const allPosts = await db.query.posts.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        postCategories: {
          with: {
            category: true,
          },
        },
      },
      orderBy: [desc(posts.createdAt)],
      limit: input.limit,
      offset: input.offset,
    });

    // Filter by category if specified
    let filteredPosts = allPosts;
    if (input.categoryId) {
      filteredPosts = allPosts.filter((post) =>
        post.postCategories.some((pc) => pc.category.id === input.categoryId)
      );
    }

    return filteredPosts.map((post) => ({
      ...post,
      categories: post.postCategories.map((pc) => pc.category),
    }));
  }),

  // Get single post by slug
  getBySlug: publicProcedure
    .input(getPostBySlugSchema)
    .query(async ({ input }) => {
      const post = await db.query.posts.findFirst({
        where: eq(posts.slug, input.slug),
        with: {
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return {
        ...post,
        categories: post.postCategories.map((pc) => pc.category),
      };
    }),

  // Get post by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const post = await db.query.posts.findFirst({
        where: eq(posts.id, input.id),
        with: {
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return {
        ...post,
        categories: post.postCategories.map((pc) => pc.category),
      };
    }),

  // Create new post
  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ input }) => {
      const slug = generateSlug(input.title);

      // Check if slug already exists
      const existing = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A post with this title already exists",
        });
      }

      const [newPost] = await db
        .insert(posts)
        .values({
          title: input.title,
          slug,
          content: input.content,
          excerpt: input.excerpt,
          published: input.published,
        })
        .returning();

      // Associate categories
      if (input.categoryIds && input.categoryIds.length > 0) {
        await db.insert(postCategories).values(
          input.categoryIds.map((categoryId) => ({
            postId: newPost.id,
            categoryId,
          }))
        );
      }

      return newPost;
    }),

  // Update existing post
  update: publicProcedure
    .input(updatePostSchema)
    .mutation(async ({ input }) => {
      const { id, categoryIds, ...updateData } = input;

      // Generate new slug if title changed
      if (updateData.title) {
        updateData.slug = generateSlug(updateData.title);
      }

      const [updatedPost] = await db
        .update(posts)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, id))
        .returning();

      if (!updatedPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Update categories if provided
      if (categoryIds !== undefined) {
        // Delete existing associations
        await db.delete(postCategories).where(eq(postCategories.postId, id));

        // Create new associations
        if (categoryIds.length > 0) {
          await db.insert(postCategories).values(
            categoryIds.map((categoryId) => ({
              postId: id,
              categoryId,
            }))
          );
        }
      }

      return updatedPost;
    }),

  // Delete post
  delete: publicProcedure
    .input(deletePostSchema)
    .mutation(async ({ input }) => {
      const [deletedPost] = await db
        .delete(posts)
        .where(eq(posts.id, input.id))
        .returning();

      if (!deletedPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return { success: true };
    }),
});
