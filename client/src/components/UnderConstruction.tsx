import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Terminal, ShieldAlert } from 'lucide-react';
import ChamferedButton from '@/components/ui/ChamferedButton';

interface UnderConstructionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  category?: string;
}

export const UnderConstruction = ({
  title = "Module In Active R&D",
  subtitle = "Deployment & Verification In Progress",
  description = "The engineering team is actively building, documenting, and validating items for this section. No speculative or placeholder content is displayed until hardware-tested benchmarks and peer reviews are completed.",
  category = "LAB OPERATIONS"
}: UnderConstructionProps) => {
  return (
    <div className="w-full py-20 px-6 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full border border-[var(--border-color)] bg-[var(--card-bg)] p-8 md:p-12 rounded-2xl relative overflow-hidden"
      >
        {/* Top status bar */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-8 text-xs font-mono text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="uppercase tracking-widest text-[hsl(var(--accent))]">{category}</span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span>STATUS: 204 NO_CONTENT</span>
          </div>
        </div>

        {/* Center Icon badge */}
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-body)] border border-[var(--border-color)] flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-[hsl(var(--accent))]" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-3">
          {title}
        </h2>
        <p className="text-sm font-mono text-[hsl(var(--accent))] mb-4 uppercase tracking-wider">
          {subtitle}
        </p>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8 max-w-lg mx-auto">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[var(--border-color)]">
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
            Check Sync Status
          </ChamferedButton>
        </div>
      </motion.div>
    </div>
  );
};

export default UnderConstruction;
