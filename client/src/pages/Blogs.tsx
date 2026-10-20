import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/lib/types';
import { Search, BookOpen } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import EmptyState from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

const TOPIC_CHIPS = ['All', 'Perception', 'Embedded', 'Controls', 'Culture'];

export default function Blogs() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');

  const { data: serverBlogs = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blogs'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/blogs`);
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000,
  });

  const allPosts = serverBlogs;

  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic =
      selectedTopic === 'All' ||
      post.category?.toLowerCase() === selectedTopic.toLowerCase();
    return matchesSearch && matchesTopic;
  });

  return (
    <main className="min-h-screen bg-ink text-paper pt-24 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto">
      {/* Page Hero (§7.8.2) */}
      <section className="mb-10 md:mb-14">
        <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-paper">
          Articles and dispatches
        </h1>
        <p className="mt-3 text-base md:text-lg text-text-2 max-w-2xl leading-relaxed">
          Hardware integration notes, perception architecture deep-dives, and research updates from Aprameya ASC.
        </p>
      </section>

      {/* Filter Chips & Search Bar (§8.7) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-10 border-b border-hairline">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {TOPIC_CHIPS.map((topic) => {
            const active = selectedTopic === topic;
            return (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`h-7 px-3 rounded-full text-xs transition-colors cursor-pointer ${
                  active
                    ? 'bg-signal text-white font-medium'
                    : 'border border-hairline text-text-2 hover:border-hairline-2 hover:text-paper'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-mute pointer-events-none" />
          <Input
            type="search"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && allPosts.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-hairline p-5 space-y-4">
              <Skeleton className="aspect-[16/10] w-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredPosts.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title={allPosts.length === 0 ? "No articles published yet" : "No articles found"}
          description={
            allPosts.length === 0
              ? "Research updates and technical dispatches from the Aprameya team will appear here."
              : "Try selecting another topic filter or clearing your search query."
          }
          action={
            allPosts.length > 0
              ? {
                  label: 'Show all articles',
                  onClick: () => {
                    setSearchTerm('');
                    setSelectedTopic('All');
                  },
                }
              : undefined
          }
        />
      )}

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <BlogCard
            key={post.id || (post as any)._id}
            post={post}
            onRead={() => setLocation(`/blogs/${post.id || (post as any)._id}`)}
          />
        ))}
      </div>
    </main>
  );
}
