'use client';

import { PostForm } from '@/components/forms/PostForm';
import { Navbar } from '@/components/layout/Navbar';
import { trpc } from '@/lib/trpc/client';
import { use } from 'react';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: post, isLoading } = trpc.post.getById.useQuery({
    id: resolvedParams.id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Loading post...</div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div>Post not found</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <PostForm mode="edit" initialData={post} />
      </main>
    </div>
  );
}