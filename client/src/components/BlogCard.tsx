import { BlogPost } from '@/lib/types';


interface BlogCardProps {
    post: BlogPost;
    onRead?: () => void;
}

const BlogCard = ({ post, onRead }: BlogCardProps) => {
    // Radius tokens (geometry-correct)
    const R_CARD = "rounded-[22px]";          // outer container
    const R_IMAGE = "rounded-[14px]";         // 22 - 8 = 14 → correct curve

    // Using CSS variables to map to user's requested logic
    return (
        <div className={`w-full ${R_CARD} bg-[var(--card-bg)] shadow-md p-2 transition-colors border border-[var(--border-color)] cursor-pointer group`}>
            <div className={`relative h-[180px] ${R_IMAGE} overflow-hidden bg-[var(--bg-body)]`}>
                <img
                    src={post.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={post.title}
                />
            </div>

            <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)] font-mono opacity-80">
                    {post.category || 'Article'}
                </p>
                <h3 className="mt-1 font-semibold text-lg text-[var(--text-primary)] leading-tight group-hover:text-[hsl(var(--accent))] transition-colors">
                    {post.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-3">
                    {post.excerpt}
                </p>

                <div className="mt-4 flex justify-between items-center">
                    <p className="text-xs text-[var(--text-secondary)] font-mono">
                        {new Date(post.date).toLocaleDateString()}
                    </p>
                    <button
                        className="px-4 py-2 rounded-full text-sm bg-[var(--text-primary)] text-[var(--bg-body)] hover:opacity-90 transition-opacity"
                        onClick={(e) => {
                            if (onRead) {
                                e.stopPropagation();
                                e.preventDefault();
                                onRead();
                            }
                        }}
                    >
                        Read Blog
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
