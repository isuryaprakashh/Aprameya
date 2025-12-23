import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@/lib/types";
import { Loader2, Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const BlogDetails = () => {
    const [match, params] = useRoute("/blogs/:id");
    const id = params?.id;

    const { data: blog, isLoading, error } = useQuery<BlogPost>({
        queryKey: [`/api/blogs/${id}`],
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--accent))]" />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-[var(--bg-body)] flex flex-col items-center justify-center text-[var(--text-secondary)] gap-4">
                <p>Blog post not found.</p>
                <Button asChild variant="outline">
                    <Link href="/blogs">Back to Blogs</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-body)] pb-20 pt-24">
            {/* Hero Header */}
            <div className="relative h-[400px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-body)] z-10"></div>
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full z-20 p-8">
                    <div className="container mx-auto">
                        <Button asChild size="sm" variant="secondary" className="mb-6 backdrop-blur-md bg-[var(--bg-body)]/50 border-[var(--border-color)]">
                            <Link href="/blogs">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
                            </Link>
                        </Button>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Badge className="bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90">
                                    {blog.category}
                                </Badge>
                                <div className="flex items-center text-sm text-[var(--text-primary)] font-mono bg-[var(--bg-body)]/50 backdrop-blur px-2 py-1 rounded">
                                    <Calendar className="w-4 h-4 mr-2 text-[hsl(var(--accent))]" />
                                    {new Date(blog.date).toLocaleDateString()}
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 leading-tight max-w-4xl">
                                {blog.title}
                            </h1>
                            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                <User className="w-4 h-4" />
                                <span>{blog.author || "Aprameya Team"}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-12">
                <div className="lg:w-2/3">
                    <article className="prose prose-invert prose-lg max-w-none">
                        {/* Using simple whitespace-pre-wrap for now to preserve formatting if it's plain text, 
                 or assuming it needs a markdown renderer. I'll stick to a safe container. */}
                        <div className="font-sans text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                            {blog.content}
                        </div>
                    </article>
                </div>

                {/* Sidebar */}
                <div className="lg:w-1/3 space-y-8">
                    <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] sticky top-24">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center">
                            <Share2 className="w-4 h-4 mr-2" /> Share this post
                        </h3>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">Twitter</Button>
                            <Button variant="outline" size="sm" className="flex-1">LinkedIn</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
