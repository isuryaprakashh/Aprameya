import { ResearchItem } from '../lib/types';
import { CleanCard } from './ui/v6-card';

interface ResearchItemProps {
  research: ResearchItem;
}

const ResearchItemComponent = ({ research }: ResearchItemProps) => {
  return (
    <CleanCard className="p-6 mb-10 group">
      <div className="shimmer pointer-events-none"></div>
      <div className="flex flex-col md:flex-row gap-6 relative z-10">
        <div className="md:w-2/3">
          <h2 className="font-mono font-bold text-2xl mb-3 text-[var(--text-primary)]">{research.title}</h2>
          <div className="flex items-center mb-4">
            <span className="text-[var(--text-secondary)] text-sm mr-4 font-mono">Published: {research.date}</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] border border-[hsl(var(--accent))]/20 uppercase tracking-wider">
              {research.category}
            </span>
          </div>
          <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
            {research.description}
          </p>
          <div className="flex items-center text-sm text-[var(--text-secondary)] mb-6 font-mono">
            <span className="mr-4">Authors: <span className="text-[var(--text-primary)]">{research.authors.join(', ')}</span></span>
            <span>Citations: <span className="text-[hsl(var(--accent))]">{research.citations}</span></span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="#"
              className="btn-primary px-6 py-2 text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download PDF
            </a>
            <button className="btn-secondary px-6 py-2 text-sm flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              View Details
            </button>
          </div>
        </div>
        <div className="md:w-1/3 flex justify-center items-center">
          <div className="rounded-lg overflow-hidden border border-[var(--border-color)] w-full max-h-48">
            <img
              src={research.image}
              alt={research.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        </div>
      </div>
    </CleanCard>
  );
};

export default ResearchItemComponent;
