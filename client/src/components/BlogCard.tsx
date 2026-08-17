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
        <div className="w-full rounded-xl morphic-metallic-card p-2 transition-all duration-300 cursor-pointer group">
            <div className="relative h-[180px] rounded-lg overflow-hidden bg-black">
                <img
                    src={post.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={post.title}
                />
            </div>

            <div className="p-5">
                <p className="text-[10px] uppercase tracking-wider text-metallic-green font-mono font-bold">
                    {post.category || 'Article'}
                </p>
                <h3 className="mt-1 font-display font-bold text-lg text-white leading-tight group-hover:text-metallic-green transition-all">
                    {post.title}
                </h3>
                <p className="mt-2 text-xs text-[#94A3B8] line-clamp-3 leading-relaxed">
                    {post.excerpt}
                </p>

                <div className="mt-5 pt-4 border-t border-emerald-500/15 flex justify-between items-center">
                    <p className="text-[11px] text-[#64748B] font-mono">
                        {new Date(post.date).toLocaleDateString()}
                    </p>
                    <button
                        className="px-3.5 py-1.5 rounded-lg text-xs btn-metallic-green"
                        onClick={(e) => {
                            if (onRead) {
                                e.stopPropagation();
                                e.preventDefault();
                                onRead();
                            }
                        }}
                    >
                        Read Article
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
