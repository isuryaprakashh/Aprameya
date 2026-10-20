import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@/lib/types";
import { ArrowLeft, Share2, Twitter, Linkedin, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ChamferedButton from "@/components/ui/ChamferedButton";

const BlogDetails = () => {
  const [, params] = useRoute("/blogs/:id");
  const id = params?.id;
  const { toast } = useToast();
  const [readingProgress, setReadingProgress] = useState(0);

  const { data: blog, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blogs/${id}`],
    enabled: !!id,
  });

  // Track scroll for sticky 2px red reading-progress bar (Section 5.6)
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setReadingProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied", description: "Article URL copied to clipboard." });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <span className="font-mono text-xs text-text-3">LOADING ARTICLE...</span>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center text-text-2 gap-4 px-6">
        <span className="font-mono text-3xl text-text-3">404</span>
        <h1 className="font-display font-medium text-2xl text-text">Article not found</h1>
        <p className="text-sm text-text-3">The requested technical paper or blog post does not exist.</p>
        <Link href="/blogs">
          <ChamferedButton variant="primary" size="md">
            Back to blogs
          </ChamferedButton>
        </Link>
      </div>
    );
  }

  const formattedDate = blog.date
    ? new Date(blog.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).toUpperCase()
    : "ARTICLE";

  return (
    <main className="min-h-screen bg-bg text-text pt-24 pb-24">
      {/* Sticky 2px red reading-progress bar (Section 5.6) */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-red z-60 transition-all duration-75"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Centered 680px column (Section 2.9 & 5.6) */}
      <article className="max-w-[680px] mx-auto px-6">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs font-mono text-text-3 hover:text-text transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ALL ARTICLES</span>
          </Link>
        </div>

        {/* Topic Eyebrow */}
        <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 mb-3">
          {blog.category || "TECHNICAL DISPATCH"}
        </p>

        {/* Title: Space Grotesk 500, tight tracking */}
        <h1 className="font-display font-medium text-3xl sm:text-4xl lg:text-[40px] leading-[1.15] tracking-[-0.025em] text-text mb-6">
          {blog.title}
        </h1>

        {/* Byline Row: author avatar + name + date + reading time */}
        <div className="flex items-center justify-between pb-6 border-b border-border text-xs font-mono text-text-3 mb-8">
          <div className="flex items-center gap-2.5">
            {blog.author_avatar ? (
              <img
                src={blog.author_avatar}
                alt={blog.author || "Author"}
                className="w-6 h-6 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-surface-2 text-text-2 flex items-center justify-center text-[10px] uppercase">
                {(blog.author || "AP").slice(0, 2)}
              </div>
            )}
            <span className="text-text font-medium">{blog.author || "Aprameya Team"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{formattedDate}</span>
            {blog.read_time && <span>· {blog.read_time}</span>}
          </div>
        </div>

        {/* Cover Image in --r-lg frame with 1px border */}
        {blog.image && (
          <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-surface-2 border border-border mb-10">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body: 17–18px, line-height 1.7 (Section 5.6) */}
        <div className="text-[17px] text-text-2 leading-[1.7] space-y-6 font-body">
          <div className="whitespace-pre-wrap">
            {blog.content}
          </div>
        </div>

        {/* Footer of Article: Share & Author Card */}
        <div className="pt-10 mt-12 border-t border-border space-y-8">
          {/* Share row */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.06em] text-text-3">
              Share article
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-md border border-border hover:bg-surface-2 text-text-2 hover:text-text transition-colors cursor-pointer"
                title="Copy Link"
              >
                <Copy className="w-4 h-4" />
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md border border-border hover:bg-surface-2 text-text-2 hover:text-text transition-colors"
                title="Share on X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md border border-border hover:bg-surface-2 text-text-2 hover:text-text transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Back CTA */}
          <div className="pt-6 border-t border-border flex justify-between items-center">
            <Link
              href="/blogs"
              className="text-sm font-body text-text-2 hover:text-text transition-colors"
            >
              ← Back to all articles
            </Link>
            <Link href="/projects">
              <span className="text-sm font-body text-red-text hover:underline cursor-pointer">
                Explore related projects →
              </span>
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
};

export default BlogDetails;
