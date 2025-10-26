"use client";

import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { PostCard } from "@/components/blog/PostCard";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { trpc } from "@/lib/trpc/client";
import { useBlogStore } from "@/store/use-store";
import { Loader2 } from "lucide-react";

export default function BlogPage() {
  const { selectedCategoryId } = useBlogStore();

  const { data: posts, isLoading } = trpc.post.list.useQuery({
    published: true,
    categoryId: selectedCategoryId || undefined,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Blog</h1>
          <p className="text-gray-600">
            Discover our latest posts and insights
          </p>
        </div>

        <div className="mb-8">
          <CategoryFilter />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <PostCard key={post.id} post={post as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {selectedCategoryId
                ? "No posts found in this category."
                : "No posts published yet."}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
