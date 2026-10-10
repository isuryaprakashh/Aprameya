import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaFlask, FaPlus, FaTrash } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import ResearchCard from '@/components/ResearchCard';
import { ResearchItem } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

interface ResearchViewProps {
    handleEdit: (item: any, type: string) => void;
    handleCreate: (type: string) => void;
    handleDelete: (id: string, type: string) => void;
}

export default function ResearchView({ handleEdit, handleCreate, handleDelete }: ResearchViewProps) {
    const { user: currentUser } = useAuth();

    const { data: research = [] } = useQuery<ResearchItem[]>({
        queryKey: ['/api/research'],
        staleTime: 5000,
    });

    // Admin View
    if (currentUser?.role === 'ADMIN') {
        return (
            <div className="animate-in fade-in space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Research</h2>
                    <Button onClick={() => handleCreate('research')} className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90"><FaPlus className="mr-2" /> New Research</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {research.map(item => (
                        <div key={item.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative aspect-video">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[var(--bg-body)]">
                                        <FaFlask className="text-5xl text-[var(--text-secondary)]/20" />
                                    </div>
                                )}
                                <Badge className="absolute top-3 left-3 bg-[var(--bg-body)] text-[var(--text-primary)] border shadow-sm">
                                    {item.category}
                                </Badge>
                            </div>
                            <div className="p-4">
                                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2 line-clamp-1">{item.title}</h3>
                                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">{item.description}</p>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleEdit(item, 'research')} className="flex-1 h-8 text-xs" variant="outline">Edit</Button>
                                    <Button onClick={() => handleDelete(String(item.id), 'research')} className="h-8 w-8 p-0" variant="destructive"><FaTrash className="w-3 h-3" /></Button>
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
            <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
                        <FaFlask className="text-2xl text-[hsl(var(--accent))]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Research Publications</h2>
                        <p className="text-[var(--text-secondary)] text-sm">Explore our latest research findings</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {research.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <ResearchCard
                                item={item}
                                onReadMore={() => {
                                    // Optional: Add logic here if needed, or leave empty if handled mainly by link
                                }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
