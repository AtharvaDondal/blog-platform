export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-3">BlogPlatform</h3>
            <p className="text-sm text-gray-600">
              A modern blogging platform built with Next.js, tRPC, and
              PostgreSQL.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="/blog"
                  className="hover:text-primary transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="hover:text-primary transition-colors"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Built With</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Next.js 15</li>
              <li>tRPC & React Query</li>
              <li>PostgreSQL & Drizzle ORM</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-600">
          © 2025 BlogPlatform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
