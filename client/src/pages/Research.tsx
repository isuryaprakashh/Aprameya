import { useQuery } from '@tanstack/react-query';
import { ResearchItem } from '@/lib/types';
import AprameyaLoader from '../components/AprameyaLoader';
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
        <AprameyaLoader size={40} />
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
    <div className="fadeIn min-h-screen bg-black">
      {/* Header Section */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 border-b border-red-500/15">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.15em] text-red-400 mb-3">
              Publications & Benchmarks
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl mb-4 tracking-tight text-white font-display font-bold">
              <span className="text-[#94A3B8] font-normal">Research &</span>{" "}
              <span>Publications</span>
            </h1>
            <p className="text-base text-[#94A3B8] max-w-xl leading-relaxed">
              Empirical investigations, sensor fusion benchmarks, and algorithmic models produced by Aprameya researchers at KL University.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Research Content */}
      <div className="py-12 px-6 md:px-12 bg-black">
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
                      title: "Access Notice",
                      description: "Full research paper access is currently limited to verified laboratory members.",
                    })}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <UnderConstruction
              category="PUBLICATIONS"
              title="Manuscripts in Preparation"
              subtitle="Dataset Validation & Manuscript Drafting"
              description="The research cohort is finalizing simulation benchmarks and experimental test data for upcoming symposiums."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Research;
