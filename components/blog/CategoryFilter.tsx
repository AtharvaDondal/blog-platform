'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { trpc } from '../../lib/trpc/client';
import { useBlogStore } from '../../store/use-store';

export function CategoryFilter() {
  const { data: categories, isLoading } = trpc.category.list.useQuery();
  const { selectedCategoryId, setSelectedCategoryId } = useBlogStore();

  if (isLoading) {
    return <div className="animate-pulse h-10 bg-gray-200 rounded" />;
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filter by Category</h3>
        {selectedCategoryId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCategoryId(null)}
            className="h-8 cursor-pointer"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategoryId === category.id ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => setSelectedCategoryId(
              selectedCategoryId === category.id ? null : category.id
            )}
          >
            {category.name}
            <span className="ml-1.5 text-xs opacity-70">
              ({category.postCategories.length})
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
}