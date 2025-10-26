'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';


export function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              BlogPlatform
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button className='cursor-pointer' asChild variant="default">
              <Link href="/dashboard/posts/new">Write Post</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}