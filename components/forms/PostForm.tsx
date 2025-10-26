'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { trpc } from '../../lib/trpc/client';
import { toast } from 'sonner';

// Dynamic import for markdown editor
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface PostFormProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
    excerpt?: string | null;
    published: boolean;
    categories: Array<{ id: string; name: string }>;
  };
  mode: 'create' | 'edit';
}

export function PostForm({ initialData, mode }: PostFormProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [published, setPublished] = useState(initialData?.published || false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.categories.map(c => c.id) || []
  );

  const { data: categories } = trpc.category.list.useQuery();

  const createPost = trpc.post.create.useMutation({
    onSuccess: () => {
      toast.success("Post created successfully!");
      utils.post.list.invalidate();
      router.push('/dashboard/posts');
    },
    onError: (error) => {
     toast.error(`Error creating post: ${error.message}`);
    },
  });

  const updatePost = trpc.post.update.useMutation({
    onSuccess: () => {
     toast.success("Post updated successfully!");
      utils.post.list.invalidate();
      router.push('/dashboard/posts');
    },
    onError: (error) => {
      toast.error(`Error updating post: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent, saveAsPublished = false) => {
    e.preventDefault();

    const postData = {
      title,
      content,
      excerpt: excerpt || undefined,
      published: saveAsPublished,
      categoryIds: selectedCategories,
    };

    if (mode === 'create') {
      createPost.mutate(postData);
    } else if (initialData) {
      updatePost.mutate({
        id: initialData.id,
        ...postData,
      });
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isLoading = createPost.isPending || updatePost.isPending;

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Create New Post' : 'Edit Post'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              required
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary of the post (optional)"
              rows={3}
            />
          </div>

          {/* Content (Markdown Editor) */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <div data-color-mode="light">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || '')}
                preview="edit"
                height={400}
              />
            </div>
          </div>

          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategories.includes(category.id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.name}
                    {selectedCategories.includes(category.id) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading || !title || !content}
          className="flex-1 cursor-pointer"
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save as Draft
        </Button>
        <Button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={isLoading || !title || !content}
          variant="default"
          className="flex-1 cursor-pointer"
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Publish
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
          className="cursor-pointer"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}