import { BlogPost } from '@/lib/types';

interface BlogCardProps {
  post: BlogPost;
  onRead?: () => void;
}

const BlogCard = ({ post, onRead }: BlogCardProps) => {
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).toUpperCase()
    : 'ARTICLE';

  return (
    <div
      onClick={onRead}
      className="group flex flex-col justify-between w-full rounded-lg border border-border p-6 transition-colors duration-fast hover:border-border-strong hover:bg-surface cursor-pointer text-left bg-transparent"
    >
      <div>
        {/* Cover image (16:10) */}
        <div className="relative w-full aspect-[16/10] rounded-md overflow-hidden bg-surface-2 border border-border mb-5">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-opacity duration-fast"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-3 font-mono text-xs">
              NO COVER
            </div>
          )}

          {/* Topic chip */}
          {post.category && (
            <div className="absolute top-3 left-3">
              <span className="h-6 px-2.5 rounded-full border border-border bg-bg/80 backdrop-blur-sm font-mono text-[11px] text-text-2 uppercase tracking-[0.06em] flex items-center">
                {post.category}
              </span>
            </div>
          )}
        </div>

        {/* h3 title (2 lines max) */}
        <h3 className="font-display font-medium text-lg text-text tracking-tight mb-2 group-hover:text-text transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt (2 lines) */}
        <p className="text-sm text-text-2 line-clamp-2 leading-relaxed mb-4">
          {post.excerpt || post.description || ''}
        </p>
      </div>

      {/* Footer: author / date in mono */}
      <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-text-3 mt-auto">
        <div className="flex items-center gap-2 truncate">
          {post.author_avatar && (
            <img
              src={post.author_avatar}
              alt={post.author || 'Author'}
              className="w-5 h-5 rounded-full object-cover border border-border"
            />
          )}
          <span className="truncate">{post.author || 'Aprameya Team'}</span>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span>{formattedDate}</span>
          {post.read_time && <span>· {post.read_time}</span>}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
