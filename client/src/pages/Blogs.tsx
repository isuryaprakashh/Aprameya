import { Link } from 'wouter';
import { FaArrowRight, FaSearch, FaTag } from 'react-icons/fa';
import { blogPosts, blogCategories } from '../lib/data';
import BlogPostComponent from '../components/BlogPost';
import { motion } from 'framer-motion';
import MagneticVectorField from '../components/backgrounds/MagneticVectorField';
import { Input } from '@/components/ui/input';

const Blogs = () => {
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
            <div className="inline-flex items-center gap-2 mb-6 border border-[var(--border-color)] px-3 py-1 bg-[var(--bg-body)]">
              <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-[var(--text-primary)] tracking-widest">KNOWLEDGE_BASE</span>
            </div>
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
            <div className="lg:col-span-3 space-y-10">
              {blogPosts.map((post) => (
                <BlogPostComponent key={post.id} post={post} />
              ))}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Search */}
                <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                  <h3 className="font-mono font-bold text-[var(--text-primary)] mb-4 uppercase tracking-wider text-sm">Search</h3>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-3 h-3" />
                    <Input
                      placeholder="Search articles..."
                      className="pl-9 bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] h-10 text-xs"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                  <h3 className="font-mono font-bold text-[var(--text-primary)] mb-4 uppercase tracking-wider text-sm">Categories</h3>
                  <ul className="space-y-2">
                    {blogCategories.map((category, index) => (
                      <li key={index}>
                        <a href="#" className="group flex items-center justify-between text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] transition-colors text-sm">
                          <span className="flex items-center">
                            <FaTag className="w-3 h-3 mr-2 opacity-50 group-hover:opacity-100" />
                            {category}
                          </span>
                          <span className="bg-[var(--card-bg)] px-2 py-0.5 rounded text-[10px] border border-[var(--border-color)] group-hover:border-[hsl(var(--accent))]/30">
                            {/* Count not available in string array, using placeholder or removing */}
                            +
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recent Posts */}
                <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                  <h3 className="font-mono font-bold text-[var(--text-primary)] mb-4 uppercase tracking-wider text-sm">Recent Posts</h3>
                  <div className="space-y-4">
                    {blogPosts.slice(0, 3).map((post) => (
                      <div key={post.id} className="flex gap-3 group cursor-pointer">
                        <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden border border-[var(--border-color)]">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-[var(--text-primary)] text-sm line-clamp-2 mb-1 group-hover:text-[hsl(var(--accent))] transition-colors">{post.title}</h4>
                          <p className="text-[var(--text-secondary)] text-[10px] font-mono">{post.date}</p>
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
