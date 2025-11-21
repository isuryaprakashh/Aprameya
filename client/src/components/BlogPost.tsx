import { Link } from 'wouter';
import { BlogPost } from '../lib/types';
import SocialShare from './SocialShare';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCalendar, FaUser, FaTag } from 'react-icons/fa';

interface BlogPostProps {
  post: BlogPost;
}

const BlogPostComponent = ({ post }: BlogPostProps) => {
  // Create absolute URL for sharing
  const currentUrl = window.location.origin;
  const shareUrl = `${currentUrl}/blogs/${post.id}`;

  return (
    <motion.div
      className="clean-card p-0 overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid md:grid-cols-5 gap-0 h-full">
        {/* Image Section */}
        <div className="md:col-span-2 h-64 md:h-full relative overflow-hidden border-r border-[var(--border-color)]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 md:hidden"></div>
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-100"
          />
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center">
              <FaTag className="mr-2 w-3 h-3" />
              {post.category}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="md:col-span-3 p-8 flex flex-col justify-between relative">
          <div className="shimmer pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-xs text-gray-500 font-mono">
                <span className="flex items-center">
                  <FaCalendar className="mr-2" />
                  {post.date}
                </span>
                <span className="flex items-center">
                  <FaUser className="mr-2" />
                  {post.author}
                </span>
              </div>
              <SocialShare
                url={shareUrl}
                title={`Check out this blog post: ${post.title}`}
                description={post.excerpt}
                variant="minimal"
              />
            </div>

            <h2 className="font-mono font-bold text-2xl mb-4 text-white group-hover:text-emerald-400 transition-colors leading-tight">
              {post.title}
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              {post.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--border-color)]">
            <Link href={`/blogs/${post.id}`} className="btn-secondary px-6 py-2 text-xs flex items-center group/btn">
              Read Article
              <FaArrowRight className="ml-2 w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPostComponent;
