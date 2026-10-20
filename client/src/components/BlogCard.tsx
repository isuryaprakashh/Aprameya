import React from 'react';
import { BlogPost } from '@/lib/types';
import Detect from './ui/detect';
import { Tag } from './ui/badge';

interface BlogCardProps {
  post: BlogPost;
  onRead?: () => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onRead }) => {
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Archive';

  return (
    <Detect
      label="post"
      id={post.id || post._id || post.slug || post.title}
      as="article"
      className="group flex flex-col justify-between w-full rounded-[var(--r-3)] border border-hairline p-5 sm:p-6 bg-transparent text-left cursor-pointer transition-colors duration-fast"
      onClick={onRead}
    >
      <div>
        {/* Cover image (16:10) */}
        <div className="relative w-full aspect-[16/10] rounded-[var(--r-2)] overflow-hidden bg-surface-2 border border-hairline mb-4">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-slow ease-out group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-mute font-mono text-xs">
              NO COVER
            </div>
          )}

          {/* Topic tag */}
          {post.category && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <Tag size="dense" className="bg-ink/80 backdrop-blur-xs">
                {post.category}
              </Tag>
            </div>
          )}
        </div>

        {/* h3 title (2 lines max) */}
        <h3 className="font-sans font-medium text-[18px] sm:text-[20px] text-paper tracking-[-0.01em] mb-2 leading-snug line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt (2 lines) */}
        <p className="text-[14px] text-text-2 line-clamp-2 leading-relaxed mb-4">
          {post.excerpt || post.description || ''}
        </p>
      </div>

      {/* Footer: author / date in mono */}
      <div className="pt-3.5 border-t border-hairline flex items-center justify-between text-[13px] text-mute mt-auto">
        <div className="flex items-center gap-2 truncate">
          {post.author_avatar ? (
            <img
              src={post.author_avatar}
              alt={post.author || 'Author'}
              className="w-5 h-5 rounded-full object-cover border border-hairline"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-surface-2 border border-hairline flex items-center justify-center text-[10px] font-sans text-paper">
              {(post.author || 'A')[0]}
            </div>
          )}
          <span className="truncate font-sans text-[13px] text-paper/90">
            {post.author || 'Aprameya Team'}
          </span>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 font-mono text-[12px] text-mute tabular-nums">
          <span>{formattedDate}</span>
          {post.read_time && <span>· {post.read_time}</span>}
        </div>
      </div>
    </Detect>
  );
};

export default BlogCard;
