import { useQuery } from '@tanstack/react-query';
import { ResearchItem } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import VoidAurora from '../components/backgrounds/VoidAurora';
import ResearchCard from '../components/ResearchCard';
import UnderConstruction from '../components/UnderConstruction';
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
        Unable to load research records. Please check your connection.
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] text-xs font-mono mb-6 uppercase tracking-wider">
              Autonomous Systems & Perception
            </div>
            <h1 className="font-bold text-4xl md:text-6xl mb-6 text-[var(--text-primary)] leading-none tracking-tighter">
              RESEARCH &<br />PUBLICATIONS
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto font-mono">
              Empirical investigations, sensor fusion benchmarks, and algorithmic models produced by Aprameya researchers at KL University.
            </p>
          </div>
        </div>
      </section>

      {/* Research Content */}
      <div className="py-16 px-4 bg-[var(--bg-body)]">
        <div className="container mx-auto max-w-5xl">
          {researchItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {researchItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ResearchCard
                    item={item}
                    onReadMore={() => toast({
                      title: "Access Restricted",
                      description: "Full research paper access is currently limited to verified laboratory members.",
                    })}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <UnderConstruction
              category="RESEARCH & PUBLICATIONS"
              title="Peer-Reviewed Research In Progress"
              subtitle="Dataset Validation & Manuscript Drafting"
              description="The research cohort is currently finalizing simulation benchmarks and experimental test data for upcoming autonomy symposiums. Manuscripts will be indexed here upon peer review approval."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Research;
