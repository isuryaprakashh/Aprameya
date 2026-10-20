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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-xl w-full border border-border bg-surface/50 p-8 md:p-10 rounded-lg text-center"
      >
        <div className="w-10 h-10 rounded-full bg-surface-2 border border-border flex items-center justify-center mx-auto mb-5 text-text-3">
          <FolderGit2 className="w-5 h-5" />
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 mb-2">
          {category}
        </p>

        <h2 className="text-2xl sm:text-3xl tracking-tight text-text mb-2 font-display font-medium">
          {title}
        </h2>
        
        <p className="text-xs font-mono text-text-3 mb-4">
          {subtitle}
        </p>

        <p className="text-sm text-text-2 leading-relaxed mb-8 max-w-md mx-auto">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border">
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
