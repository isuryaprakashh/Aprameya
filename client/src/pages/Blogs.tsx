import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/lib/types';
import { Search, BookOpen } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import EmptyState from '@/components/EmptyState';
import { blogCategories } from '../lib/data';

export default function Blogs() {
  const [, setLocation] = useLocation();
  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ['/api/blogs'],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${baseUrl}/api/blogs`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) return [];
        return res.json();
      } catch {
        clearTimeout(timeoutId);
        return [];
      }
    },
    staleTime: 60000,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBlogs = blogPosts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      post.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const featuredPost =
    blogPosts.find((p) => p.is_featured) || (blogPosts.length > 0 ? blogPosts[0] : null);

  return (
    <main className="w-full bg-bg min-h-screen text-text">
      {/* ─── PAGE HEADER (Section 5.6 & 5) ─── */}
      <section className="pt-24 pb-8 px-6 md:px-8 max-w-[1200px] mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 mb-2">
          05 — DISPATCHES
        </p>
        <h1 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl tracking-tight text-text mb-3">
          Technical articles & research.
        </h1>
        <p className="text-base text-text-2 max-w-xl leading-relaxed mb-10">
          Hardware integration field notes, perception architecture breakdowns, and research publications from Aprameya Lab.
        </p>

        {/* ─── TOPIC CHIPS & SEARCH (Section 4.7 & 5.6) ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {blogCategories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`h-6 px-3 rounded-full text-xs font-mono uppercase tracking-[0.06em] whitespace-nowrap transition-colors duration-fast cursor-pointer ${
                    active
                      ? 'border border-red-line text-red-text bg-red-soft font-medium'
                      : 'border border-border text-text-2 hover:border-border-strong hover:text-text'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-60 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-md border border-border-strong bg-transparent text-xs text-text placeholder:text-text-3 focus:outline-none focus:border-focus-ring"
            />
          </div>
        </div>
      </section>

      {/* ─── 3-COLUMN POST GRID (Section 5.6) ─── */}
      <section className="pb-24 px-6 md:px-8 max-w-[1200px] mx-auto">
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((post) => (
              <BlogCard
                key={post.id || (post as any)._id}
                post={post}
                onRead={() => setLocation(`/blogs/${post.id || (post as any)._id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No dispatches found"
            description="Our engineering team is actively documenting upcoming autonomous systems writeups. Check back shortly."
            action={{
              label: "Explore all topics",
              onClick: () => {
                setSearchTerm('');
                setSelectedCategory('All');
              },
            }}
          />
        )}
      </section>
    </main>
  );
}
