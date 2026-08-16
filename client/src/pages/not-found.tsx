import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Radio, ArrowLeft, ShieldAlert } from 'lucide-react';
import HudFrame from '@/components/ui/HudFrame';
import ScanlineDivider from '@/components/ScanlineDivider';

export default function NotFound() {
  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl"
      >
        <HudFrame
          label="DIAGNOSTIC_BUS // NAV_FAULT"
          status="CARRIER_LOST"
          className="p-8 md:p-10"
        >
          {/* Header Status Chip */}
          <div className="flex items-center justify-between mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-red-400" />
              STATUS: 404 SIGNAL_LOST
            </div>
            <div className="text-[11px] font-mono text-[var(--text-secondary)]">
              ERR_VECTOR_UNRESOLVED
            </div>
          </div>

          {/* Big Display Title */}
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-3 leading-none">
            WAYPOINT VOID
          </h1>
          <p className="text-[var(--text-secondary)] font-mono text-xs md:text-sm leading-relaxed mb-6">
            The requested coordinate does not exist in current telemetry mapping. Either the route was decommissioned, or guidance packet was dropped in transit.
          </p>

          <ScanlineDivider className="my-6" />

          {/* Diagnostic telemetry mock block */}
          <div className="p-4 rounded-lg bg-[var(--bg-body)] border border-[var(--border-color)] font-mono text-xs text-[var(--text-secondary)] space-y-1.5 mb-8">
            <div className="flex justify-between">
              <span className="text-[hsl(var(--accent))]">VECTOR_TARGET:</span>
              <span>UNKNOWN_NODE</span>
            </div>
            <div className="flex justify-between">
              <span>LATENCY:</span>
              <span>INF ms (TIMEOUT)</span>
            </div>
            <div className="flex justify-between">
              <span>RECOVERY_ACTION:</span>
              <span className="text-[var(--text-primary)]">RETURN_TO_BASE</span>
            </div>
          </div>

          {/* Navigation Recovery CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/" className="w-full sm:w-auto flex-1">
              <button className="w-full px-6 py-3.5 rounded-xl bg-[hsl(var(--accent))] text-black font-display text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <ArrowLeft className="w-4 h-4" />
                Return to Command
              </button>
            </Link>

            <Link href="/recruitment" className="w-full sm:w-auto flex-1">
              <button className="w-full px-6 py-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-primary)] font-display text-xs tracking-wider uppercase font-medium flex items-center justify-center gap-2 hover:bg-[var(--bg-body)] transition-colors">
                <Radio className="w-4 h-4 text-[hsl(var(--accent))]" />
                Join Flight Crew
              </button>
            </Link>
          </div>
        </HudFrame>
      </motion.div>
    </div>
  );
}
