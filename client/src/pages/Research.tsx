import { useQuery } from '@tanstack/react-query';
import { ResearchItem } from '@/lib/types';
import { Loader2, FolderSearch } from 'lucide-react';

import { EmptyState } from '../components/EmptyState';
import VoidAurora from '../components/backgrounds/VoidAurora';
import ResearchCard from '../components/ResearchCard';
import { motion } from 'framer-motion';

import { useToast } from "@/hooks/use-toast";

const Research = () => {
  const { toast } = useToast();
  const { data: researchItems = [], isLoading, error } = useQuery<ResearchItem[]>({
    queryKey: ['/api/research'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--accent))]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center text-[var(--text-secondary)]">
        Error loading research. Please try again later.
      </div>
    );
  }

  return (
    <div className="fadeIn">
      {/* Header Section */}
      <section className="relative py-24 px-4 bg-[var(--bg-body)] border-b border-[var(--border-color)] overflow-hidden">
        <VoidAurora />
        <div className="absolute inset-0 dither-bg opacity-30 pointer-events-none"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center">

            <h1 className="font-bold text-4xl md:text-6xl mb-6 text-[var(--text-primary)] leading-none tracking-tighter">
              ADVANCING<br />AUTONOMOUS TECH
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto font-mono">
              Our cutting-edge research contributes to the global community of autonomous systems development.
            </p>
          </div>
        </div>
      </section>

      {/* Research Content */}
      <div className="py-16 px-4 bg-[var(--bg-body)]">
        <div className="container mx-auto max-w-5xl">
          {/* Research Entries */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {researchItems.length > 0 ? (
              researchItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ResearchCard
                    item={item}
                    onReadMore={() => toast({
                      title: "Access Restricted",
                      description: "Full research paper access is currently limited to authorized members.",
                    })}
                  />
                </motion.div>
              ))
            ) : (
              <EmptyState
                icon={FolderSearch}
                title="No research items found"
                description="We currently don't have any research papers published. Please check back later."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;
