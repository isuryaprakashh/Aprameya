import { useQuery } from '@tanstack/react-query';
import { ResearchItem } from '@/lib/types';
import WanderingEyesLoader from '../components/WanderingEyesLoader';
import ResearchCard from '../components/ResearchCard';
import UnderConstruction from '../components/UnderConstruction';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";

const Research = () => {
  const { toast } = useToast();
  const { data: researchItems = [], isLoading, error } = useQuery<ResearchItem[]>({
    queryKey: ['/api/research'],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${baseUrl}/api/research`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) return [];
        return res.json();
      } catch {
        clearTimeout(timeoutId);
        return [];
      }
    },
    staleTime: 60000,
  });

  if (isLoading && researchItems.length === 0) {
    return (
      <WanderingEyesLoader
        fullPage
        size="md"
        text="SEARCHING RESEARCH PUBLICATIONS"
        subtext="FETCHING WHITEPAPERS, CITATIONS & PATENTS"
      />
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Header Section */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-mono text-xs uppercase text-[var(--text-3)] tracking-wider mb-2">
              Publications & benchmarks
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl mb-3 tracking-tight text-[var(--text)] font-display font-medium">
              Research & publications
            </h1>
            <p className="text-base text-[var(--text-2)] max-w-xl leading-relaxed">
              Empirical investigations, sensor fusion benchmarks, and algorithmic models produced by Aprameya researchers at KL University.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Research Content */}
      <div className="py-12 px-6 md:px-12 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto">
          {researchItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  viewport={{ once: true }}
                >
                  <ResearchCard
                    item={item}
                    onReadMore={() => toast({
                      title: "Access notice",
                      description: "Full research paper access is currently limited to verified laboratory members.",
                    })}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <UnderConstruction
              category="PUBLICATIONS"
              title="Manuscripts in preparation"
              subtitle="Dataset validation & manuscript drafting"
              description="The research cohort is finalizing simulation benchmarks and experimental test data for upcoming symposiums."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Research;
