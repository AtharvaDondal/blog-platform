'use client';

import { PostForm } from "@/components/forms/PostForm";
import { Navbar } from "@/components/layout/Navbar";



export default function NewPostPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <PostForm mode="create" />
      </main>
    </div>
  );
}