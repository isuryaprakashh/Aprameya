import { useState } from 'react';
import { Link } from 'wouter';
import { blogCategories } from '../lib/data';
import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/lib/types';
import { Search, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import UnderConstruction from '@/components/UnderConstruction';
import BlogCard from '@/components/BlogCard';
import AprameyaLoader from '@/components/AprameyaLoader';

const Blogs = () => {
  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blogs'],
    queryFn: async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${baseUrl}/api/blogs`);
        if (!res.ok) return [];
        return res.json();
      } catch {
        return [];
      }
    },
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter blogs based on search and category
  const filteredBlogs = blogPosts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center">
        <AprameyaLoader size={40} />
      </div>
    );
  }

  return (
    <div className="fadeIn min-h-screen bg-[var(--bg-body)]">
      {/* Header Section */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-[var(--text-muted)] mb-3">
              Research & Notes
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl mb-4 tracking-tight text-[var(--text-primary)]">
              <span className="font-serif italic font-normal text-[1.08em] text-[var(--text-secondary)]">Technical</span>{" "}
              <span className="font-display font-bold">Blogs & Journals</span>
            </h1>
            <p className="text-base text-[var(--text-secondary)] max-w-xl leading-relaxed">
              Deep dives, hardware integration notes, and system architecture breakdowns from the Aprameya development team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <div className="py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {blogPosts.length > 0 ? (
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Blog Posts Column */}
              <div className="lg:col-span-3 grid md:grid-cols-2 gap-6">
                {filteredBlogs.map((post, index) => (
                  <motion.div
                    key={post.id || (post as any)._id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/blogs/${post.id || (post as any)._id}`} className="block h-full">
                      <BlogCard post={post} />
                    </Link>
                  </motion.div>
                ))}

                {filteredBlogs.length === 0 && (
                  <div className="col-span-full">
                    <p className="text-center text-sm text-[var(--text-secondary)] py-12">
                      No matching dispatches for "{searchTerm}"
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Search */}
                  <div className="p-5 rounded-xl border border-white/[0.06] bg-[var(--card-bg)]">
                    <h3 className="font-sans font-semibold text-[var(--text-primary)] mb-3 text-xs uppercase tracking-wider">Search</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-3.5 h-3.5" />
                      <Input
                        placeholder="Search articles..."
                        className="pl-9 bg-white/[0.02] border-white/[0.06] text-[var(--text-primary)] h-9 text-xs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="p-5 rounded-xl border border-white/[0.06] bg-[var(--card-bg)]">
                    <h3 className="font-sans font-semibold text-[var(--text-primary)] mb-3 text-xs uppercase tracking-wider">Categories</h3>
                    <ul className="space-y-1.5">
                      {blogCategories.map((category, index) => (
                        <li key={index}>
                          <button
                            onClick={() => setSelectedCategory(category)}
                            className={`group flex items-center justify-between w-full text-xs py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${selectedCategory === category ? 'bg-white/[0.06] text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                          >
                            <span className="flex items-center">
                              <Tag className="w-3 h-3 mr-2 opacity-50" />
                              {category}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)]">
                              {category === 'all' ? blogPosts.length : blogPosts.filter(p => p.category === category).length}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <UnderConstruction
              category="TECHNICAL BLOGS"
              title="Articles in Review"
              subtitle="Peer Review & Documentation Cycle Active"
              description="Engineering leads are drafting technical post-mortems, hardware schematics, and architecture breakdowns for our autonomous systems."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
