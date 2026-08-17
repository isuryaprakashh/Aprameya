import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, FolderGit2 } from 'lucide-react';
import ChamferedButton from '@/components/ui/ChamferedButton';

interface UnderConstructionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  category?: string;
}

export const UnderConstruction = ({
  title = "In Active Development",
  subtitle = "Documentation & Release In Progress",
  description = "The engineering team is actively building, documenting, and validating items for this section. Content will be published once benchmarks and reviews are complete.",
  category = "LABORATORY"
}: UnderConstructionProps) => {
  return (
    <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl w-full border border-white/[0.06] bg-[var(--card-bg)] p-8 md:p-10 rounded-xl text-center"
      >
        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-6 text-[var(--text-secondary)]">
          <FolderGit2 className="w-5 h-5" />
        </div>

        <p className="text-[11px] font-sans font-medium text-[var(--text-muted)] uppercase tracking-[0.15em] mb-2">
          {category}
        </p>

        <h2 className="text-2xl sm:text-3xl tracking-tight text-[var(--text-primary)] mb-2">
          <span className="font-serif italic font-normal text-[1.1em] text-[var(--text-secondary)]">In</span>{" "}
          <span className="font-display font-bold">Active R&D</span>
        </h2>
        
        <p className="text-xs text-[var(--text-muted)] mb-4">
          {subtitle}
        </p>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8 max-w-md mx-auto">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-white/[0.04]">
          <Link href="/">
            <ChamferedButton variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Return Home
            </ChamferedButton>
          </Link>
          <ChamferedButton
            variant="ghost"
            size="sm"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </ChamferedButton>
        </div>
      </motion.div>
    </div>
  );
};

export default UnderConstruction;
