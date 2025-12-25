import { useState } from 'react';
import { Link } from 'wouter';
import { blogCategories } from '../lib/data';
import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/lib/types';
import { Loader2, Search, Tag, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import MagneticVectorField from '../components/backgrounds/MagneticVectorField';
import { Input } from '@/components/ui/input';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { EmptyState } from '@/components/EmptyState';
import BlogCard from '@/components/BlogCard';

const Blogs = () => {
  const { data: blogPosts = [], isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blogs'],
  });
  // const { data: user } = useQuery<any>({ queryKey: ['/api/me'] }); // Unused
  // const [, setLocation] = useLocation(); // Unused
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter blogs based on search and category
  const filteredBlogs = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });


  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--accent))]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center text-[var(--text-secondary)]">
        Error loading blogs. Please try again later.
      </div>
    );
  }

  return (
    <div className="fadeIn min-h-screen bg-[var(--bg-body)]">
      {/* Header Section */}
      <section className="relative py-24 px-4 border-b border-[var(--border-color)] overflow-hidden">
        <MagneticVectorField />
        <div className="absolute inset-0 dither-bg opacity-30 pointer-events-none"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            <h1 className="font-bold text-5xl md:text-7xl mb-6 leading-[0.9] text-[var(--text-primary)]">
              BLOG &<br />INSIGHTS
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 font-mono">
              Stay updated with the latest trends, technologies, and breakthroughs in autonomous systems
              from our engineering team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <div className="py-16 px-4">
        <div className="container mx-auto">
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
                  <EmptyState
                    icon={FileText}
                    title="No blog posts found"
                    description="We currently don't have any blog posts published. Please check back later."
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Search */}
                <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                  <h3 className="font-mono font-bold text-[var(--text-primary)] mb-4 uppercase tracking-wider text-sm">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-3 h-3" />
                    <Input
                      placeholder="Search articles..."
                      className="pl-9 bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] h-10 text-xs"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                  <h3 className="font-mono font-bold text-[var(--text-primary)] mb-4 uppercase tracking-wider text-sm">Categories</h3>
                  <ul className="space-y-2">
                    {blogCategories.map((category, index) => (
                      <li key={index}>
                        <button
                          onClick={() => setSelectedCategory(category)}
                          className={`group flex items-center justify-between w-full text-sm transition-colors ${selectedCategory === category ? 'text-[hsl(var(--accent))] font-medium' : 'text-[var(--text-secondary)] hover:text-[hsl(var(--accent))]'}`}
                        >
                          <span className="flex items-center">
                            <Tag className="w-3 h-3 mr-2 opacity-50 group-hover:opacity-100" />
                            {category}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] border ${selectedCategory === category ? 'bg-[hsl(var(--accent))]/10 border-[hsl(var(--accent))]' : 'bg-[var(--card-bg)] border-[var(--border-color)] group-hover:border-[hsl(var(--accent))]/30'}`}>
                            {category === 'all' ? blogPosts.length : blogPosts.filter(p => p.category === category).length}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recent Posts */}
                <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                  <h3 className="font-mono font-bold text-[var(--text-primary)] mb-4 uppercase tracking-wider text-sm">Recent Posts</h3>
                  <div className="space-y-4">
                    {blogPosts?.slice(0, 3).map((post) => (
                      <div key={post.id || (post as any)._id} className="flex gap-3 group cursor-pointer">
                        <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden border border-[var(--border-color)]">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-[var(--text-primary)] text-sm line-clamp-2 mb-1 group-hover:text-[hsl(var(--accent))] transition-colors">{post.title}</h4>
                          <p className="text-[var(--text-secondary)] text-[10px] font-mono">{new Date(post.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
