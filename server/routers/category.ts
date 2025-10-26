import { router, publicProcedure } from '../trpc';
import { eq, desc } from 'drizzle-orm';

import { TRPCError } from '@trpc/server';
import { categories } from '../db/schema';
import { z } from 'zod';
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  generateSlug,
} from '../../lib/validations';
import { db } from '../db';

export const categoryRouter = router({
  // List all categories
  list: publicProcedure.query(async () => {
    return await db.query.categories.findMany({
      orderBy: [desc(categories.createdAt)],
      with: {
        postCategories: true,
      },
    });
  }),

  // Get single category
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const category = await db.query.categories.findFirst({
        where: eq(categories.id, input.id),
        with: {
          postCategories: {
            with: {
              post: true,
            },
          },
        },
      });

      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      return category;
    }),

  // Create category
  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ input }) => {
      try {
        const slug = generateSlug(input.name);

        const existing = await db.query.categories.findFirst({
          where: eq(categories.slug, slug),
        });

        if (existing) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A category with this name already exists',
          });
        }

        const [newCategory] = await db.insert(categories).values({
          name: input.name,
          slug,
          description: input.description,
        }).returning();

        return newCategory;
      } catch (err) {
        console.error('category.create error:', err);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database error creating category',
        });
      }
    }),

  // Update category
  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;

      const setData = {
        ...updateData,
        ...(updateData.name ? { slug: generateSlug(updateData.name) } : {}),
      };

      const [updatedCategory] = await db
        .update(categories)
        .set(setData)
        .where(eq(categories.id, id))
        .returning();

      if (!updatedCategory) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      return updatedCategory;
    }),

  // Delete category
  delete: publicProcedure
    .input(deleteCategorySchema)
    .mutation(async ({ input }) => {
      const [deletedCategory] = await db
        .delete(categories)
        .where(eq(categories.id, input.id))
        .returning();

      if (!deletedCategory) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      return { success: true };
    }),
});
