import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-[var(--border-color)] rounded-xl bg-[var(--card-bg)]/20"
        >
            <div className="w-16 h-16 bg-[hsl(var(--accent))]/10 rounded-full flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-[hsl(var(--accent))]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{title}</h3>
            <p className="text-[var(--text-secondary)] max-w-sm mb-6">{description}</p>
            {action && (
                <Button onClick={action.onClick} className="btn-primary">
                    {action.label}
                </Button>
            )}
        </motion.div>
    );
};
