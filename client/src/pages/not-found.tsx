import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ChamferedButton from '@/components/ui/ChamferedButton';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-6 py-16 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md text-center border border-white/[0.06] bg-[var(--card-bg)] p-8 sm:p-10 rounded-xl"
      >
        <p className="text-[11px] font-sans font-medium text-[var(--text-muted)] uppercase tracking-[0.15em] mb-2">
          Error 404
        </p>

        <h1 className="text-4xl sm:text-5xl tracking-tight text-[var(--text-primary)] mb-3">
          <span className="font-serif italic font-normal text-[1.1em] text-[var(--text-secondary)]">Page</span>{" "}
          <span className="font-display font-bold">Not Found</span>
        </h1>
        
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="flex justify-center">
          <Link href="/">
            <ChamferedButton variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return Home
            </ChamferedButton>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
