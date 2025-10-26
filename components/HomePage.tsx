import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Zap, Users, ArrowRight } from 'lucide-react';
import { Navbar } from './layout/Navbar';
import { Footer } from './layout/Footer';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to BlogPlatform
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              A modern, powerful blogging platform built with cutting-edge technologies. 
              Create, manage, and share your stories with the world.
            </p>
            <div className="flex gap-4 justify-center">
              <Button className='cursor-pointer' asChild size="lg">
                <Link href="/blog">
                  Explore Posts
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button className='cursor-pointer' asChild size="lg" variant="outline">
                <Link href="/dashboard/posts/new">Start Writing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features for Modern Blogging
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rich Content Editor</h3>
              <p className="text-gray-600">
                Write beautiful posts with our markdown-powered editor. 
                Format text, add code blocks, and create stunning content.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Built with Next.js 15 and optimized for speed. 
                Experience instant page loads and seamless navigation.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-Category Support</h3>
              <p className="text-gray-600">
                Organize your content with multiple categories. 
                Make it easy for readers to find what they love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Blogging?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our platform and share your ideas with the world.
          </p>
          <Button className='cursor-pointer' asChild size="lg" variant="secondary">
            <Link  href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}