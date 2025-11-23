import { researchItems } from '../lib/data';
import ResearchItemComponent from '../components/ResearchItem';
import VoidAurora from '../components/backgrounds/VoidAurora';

const Research = () => {
  return (
    <div className="fadeIn">
      {/* Header Section */}
      <section className="relative py-24 px-4 bg-[var(--bg-body)] border-b border-[var(--border-color)] overflow-hidden">
        <VoidAurora />
        <div className="absolute inset-0 dither-bg opacity-30 pointer-events-none"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center">
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
          {researchItems.map((item) => (
            <ResearchItemComponent key={item.id} research={item} />
          ))}

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-[var(--text-secondary)] italic">Research conducted by Aprameya members</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              For research collaboration inquiries, please contact{' '}
              <a href="mailto:research@aprameya.com" className="text-[hsl(var(--accent))] hover:underline">
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
