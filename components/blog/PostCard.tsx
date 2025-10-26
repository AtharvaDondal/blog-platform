'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { calculateReadingTime, formatDate, truncateText } from '../../lib/utils';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    published: boolean;
    createdAt: Date;
    categories?: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
}

export function PostCard({ post }: PostCardProps) {
  const readingTime = calculateReadingTime(post.content);
  const displayExcerpt = post.excerpt || truncateText(post.content, 150);

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 mb-2">
          <Link href={`/blog/${post.slug}`} className="flex-1">
            <h3 className="text-xl font-bold hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>
          {!post.published && (
            <Badge variant="secondary">Draft</Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(post.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {readingTime} min read
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="text-gray-700 line-clamp-3">{displayExcerpt}</p>
      </CardContent>
      
      {post.categories && post.categories.length > 0 && (
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <Badge key={category.id} variant="outline">
                {category.name}
              </Badge>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}