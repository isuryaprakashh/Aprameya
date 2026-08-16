import { useState } from 'react';
import { Link } from 'wouter';
import { blogCategories } from '../lib/data';
import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/lib/types';
import { Search, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import VoidAurora from '../components/backgrounds/VoidAurora';
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
    <div className="fadeIn min-h-screen bg-[var(--bg-body)] font-sans">
      {/* Header Section */}
      <section className="relative py-24 px-4 border-b border-[var(--border-color)] overflow-hidden">
        <VoidAurora />
        <div className="absolute inset-0 dither-bg opacity-30 pointer-events-none"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] text-xs font-mono mb-6 uppercase tracking-wider">
              Engineering Dispatches & Field Notes
            </div>
            <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 leading-[0.9] text-[var(--text-primary)] tracking-tight">
              TECHNICAL<br />DISPATCHES
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto font-mono leading-relaxed">
              Deep dives, hardware integration notes, and system architecture breakdowns from the Aprameya development team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {blogPosts.length > 0 ? (
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Blog Posts Column */}
              <div className="lg:col-span-3 grid md:grid-cols-2 gap-8">
                {filteredBlogs.map((post, index) => (
                  <motion.div
                    key={post.id || (post as any)._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/blogs/${post.id || (post as any)._id}`} className="block h-full">
                      <BlogCard post={post} />
                    </Link>
                  </motion.div>
                ))}

                {filteredBlogs.length === 0 && (
                  <div className="col-span-full">
                    <p className="text-center text-sm font-mono text-[var(--text-secondary)] py-12">
                      No matching dispatches for "{searchTerm}"
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                  {/* Search */}
                  <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]">
                    <h3 className="font-mono font-bold text-[var(--text-primary)] mb-4 uppercase tracking-wider text-xs">Search</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-3.5 h-3.5" />
                      <Input
                        placeholder="Search articles..."
                        className="pl-9 bg-[var(--bg-body)] border-[var(--border-color)] text-[var(--text-primary)] h-10 text-xs font-mono"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]">
                    <h3 className="font-mono font-bold text-[var(--text-primary)] mb-4 uppercase tracking-wider text-xs">Categories</h3>
                    <ul className="space-y-2 font-mono">
                      {blogCategories.map((category, index) => (
                        <li key={index}>
                          <button
                            onClick={() => setSelectedCategory(category)}
                            className={`group flex items-center justify-between w-full text-xs transition-colors ${selectedCategory === category ? 'text-[hsl(var(--accent))] font-bold' : 'text-[var(--text-secondary)] hover:text-[hsl(var(--accent))]'}`}
                          >
                            <span className="flex items-center">
                              <Tag className="w-3 h-3 mr-2 opacity-50 group-hover:opacity-100" />
                              {category}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] border ${selectedCategory === category ? 'bg-[hsl(var(--accent))]/10 border-[hsl(var(--accent))]' : 'bg-[var(--bg-body)] border-[var(--border-color)] group-hover:border-[hsl(var(--accent))]/30'}`}>
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
              category="ENGINEERING DISPATCHES"
              title="Technical Field Notes In Preparation"
              subtitle="Peer Review & Documentation Cycle Active"
              description="The engineering leads are drafting technical post-mortems, hardware schematics, and architecture breakdowns for our autonomous systems. New articles will be published directly to this dispatch feed."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
