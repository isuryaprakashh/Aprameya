import { motion } from 'framer-motion';
import { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaNewspaper, FaPlus, FaTrash, FaArrowRight, FaBlog } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

interface BlogsViewProps {
    handleEdit: (item: BlogPost, type: string) => void;
    handleCreate: (type: string) => void;
    handleDelete: (id: string, type: string) => void;
}

export default function BlogsView({ handleEdit, handleCreate, handleDelete }: BlogsViewProps) {
    const { user: currentUser } = useAuth();

    const { data: blogs = [] } = useQuery<BlogPost[]>({
        queryKey: ['/api/blogs'],
        staleTime: 5000,
    });

    // Admin View
    if (currentUser?.role === 'ADMIN') {
        return (
            <div className="animate-in fade-in space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-display font-medium text-[var(--text)] tracking-tight">Blogs</h2>
                    <Button onClick={() => handleCreate('blog')} className="bg-[var(--red)] hover:bg-[var(--red-hover)] text-white text-xs h-9 rounded-[var(--r-md)]"><FaPlus className="mr-2" /> New Blog</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map(blog => (
                        <div key={blog.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-lg)] overflow-hidden hover:border-[var(--border-strong)] transition-colors">
                            <div className="relative aspect-video">
                                {blog.image ? (
                                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[var(--surface-2)]">
                                        <FaBlog className="text-5xl text-[var(--text-3)]" />
                                    </div>
                                )}
                                <Badge className="absolute top-3 left-3 bg-[var(--surface)]/90 backdrop-blur-sm text-[var(--text-2)] border border-[var(--border)] text-xs font-mono">
                                    {blog.category}
                                </Badge>
                            </div>
                            <div className="p-4">
                                <h3 className="text-base font-display font-medium text-[var(--text)] mb-2 line-clamp-1">{blog.title}</h3>
                                <p className="text-sm text-[var(--text-2)] line-clamp-2 mb-3">{blog.excerpt}</p>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleEdit(blog, 'blog')} className="flex-1 h-8 text-xs rounded-[var(--r-sm)] border-[var(--border)]" variant="outline">Edit</Button>
                                    <Button onClick={() => handleDelete(blog.id || (blog as any)._id, 'blog')} className="h-8 w-8 p-0 rounded-[var(--r-sm)]" variant="destructive"><FaTrash className="w-3 h-3" /></Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // User View
    return (
        <div className="space-y-6">
            <div className="bg-[var(--surface)] p-6 rounded-[var(--r-lg)] border border-[var(--border)]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-[var(--r-sm)] bg-[var(--red-soft)] border border-[var(--red-line)] text-[var(--red-text)]">
                        <FaNewspaper className="text-xl text-[var(--red)]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-medium text-[var(--text)] tracking-tight">Latest Blogs</h2>
                        <p className="text-[var(--text-2)] text-sm">Read articles and updates from our team</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog, index) => (
                        <motion.div
                            key={blog.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-[var(--r-lg)] overflow-hidden group h-full flex flex-col transition-colors"
                        >
                            {blog.image && (
                                <div className="h-48 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/90 to-transparent z-10" />
                                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute top-4 right-4 z-20">
                                        <span className="px-2.5 py-1 rounded-[var(--r-sm)] bg-[var(--surface)]/90 backdrop-blur-md text-xs font-mono text-[var(--text-2)] border border-[var(--border)]">
                                            {blog.category}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <CardHeader className="relative z-10 pb-2">
                                <CardTitle className="text-lg font-display font-medium text-[var(--text)] group-hover:text-[var(--red-text)] transition-colors">{blog.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow relative z-10 pb-4">
                                <p className="text-[var(--text-2)] line-clamp-3 text-sm leading-relaxed">{blog.excerpt}</p>
                            </CardContent>
                            <CardFooter className="border-t border-[var(--border)] bg-[var(--surface-2)]/30 p-3 relative z-10">
                                <Button variant="ghost" className="w-full text-xs text-[var(--text-2)] hover:text-[var(--red-text)] hover:bg-[var(--surface-2)] transition-colors justify-between">
                                    Read More <FaArrowRight className="ml-2 w-3 h-3 text-[var(--red)]" />
                                </Button>
                            </CardFooter>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
