import { useQuery } from '@tanstack/react-query';
import { ResearchItem } from '@/lib/types';
import { Loader2, FolderSearch } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { EmptyState } from '../components/EmptyState';
// import { researchItems } from '../lib/data'; // Removed static import
import VoidAurora from '../components/backgrounds/VoidAurora';
import { CleanCard } from '../components/ui/v6-card';
import { Button } from '@/components/ui/button';
import { ButtonScan } from '../components/ui/v6-buttons';
import MagneticWrap from '../components/ui/MagneticWrap';
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
            <div className="mb-6 flex justify-center">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-[hsl(var(--accent))]">Research</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="inline-flex items-center gap-2 mb-6 border border-[var(--border-color)] px-3 py-1 bg-[var(--bg-body)]">
              <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-[var(--text-primary)] tracking-widest">R&D_DIVISION</span>
            </div>
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
          <div className="grid gap-8">
            {researchItems.length > 0 ? (
              researchItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CleanCard className="flex flex-col md:flex-row overflow-hidden group">
                    {/* Image Section */}
                    <div className="md:w-1/3 relative overflow-hidden min-h-[200px]">
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-body)]/50 to-transparent z-10 md:hidden"></div>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-700 group-hover:scale-105"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] border border-[hsl(var(--accent))]/20 rounded">
                            {item.category}
                          </span>
                          <span className="text-xs text-[var(--text-secondary)] font-mono">
                            {item.date}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[hsl(var(--accent))] transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-xs text-[var(--text-secondary)] font-mono mb-6">
                          <div>
                            <span className="text-[var(--text-primary)] font-bold">AUTHORS:</span> {Array.isArray(item.authors) ? item.authors.join(", ") : item.authors}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[var(--text-primary)] font-bold">CITATIONS:</span> {item.citations}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <MagneticWrap>
                          <ButtonScan
                            className="px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[hsl(var(--accent))] hover:text-[var(--bg-body)]"
                            onClick={() => toast({
                              title: "Access Restricted",
                              description: "Full research paper access is currently limited to authorized members.",
                            })}
                          >
                            Read Paper
                          </ButtonScan>
                        </MagneticWrap>
                        <Button
                          variant="ghost"
                          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-4 py-2 text-xs uppercase tracking-widest"
                          onClick={() => toast({
                            title: "Download Started",
                            description: "Your download will begin shortly.",
                          })}
                        >
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </CleanCard>
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

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <p className="text-[var(--text-secondary)] italic font-mono text-sm opacity-60">Research conducted by Aprameya members</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              For research collaboration inquiries, please contact{' '}
              <a href="mailto:research@aprameya.com" className="text-[hsl(var(--accent))] hover:underline decoration-[hsl(var(--accent))]/50 underline-offset-4">
                research@aprameya.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;
