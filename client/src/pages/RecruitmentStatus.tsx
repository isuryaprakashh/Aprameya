import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, CheckCircle, XCircle,
  ShieldCheck
} from 'lucide-react';
import { RecruitmentApplication } from '@/lib/types';
import ChamferedButton from '@/components/ui/ChamferedButton';

type StatusMeta = {
  label: string;
  badgeClass: string;
  icon: any;
  message: string;
  isComplete: boolean;
};

const STATUS_MAP: Record<string, StatusMeta> = {
  pending_review: {
    label: 'Under Review',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: Clock,
    message: 'Your application has been received and is currently under evaluation by the core team.',
    isComplete: false,
  },
  accepted: {
    label: 'Accepted',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    icon: CheckCircle,
    message: 'Welcome to Aprameya. Your candidate induction is confirmed. Review your designated wing assignment below.',
    isComplete: true,
  },
  rejected: {
    label: 'Not Selected',
    badgeClass: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: XCircle,
    message: 'Your application was not selected for this recruitment cycle. We run induction rounds each semester — you are welcome to apply again.',
    isComplete: true,
  },
};

export default function RecruitmentStatus() {
  const { data: app, isLoading, error } = useQuery<RecruitmentApplication | null>({
    queryKey: ['/api/recruitment/applications/mine'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/recruitment/applications/mine`, { credentials: 'include' });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    retry: false,
  });

  const meta = app ? (STATUS_MAP[app.status] || STATUS_MAP.pending_review) : null;

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)] font-sans">
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-32 pb-24">

        <Link href="/recruitment">
          <button className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-8 transition-colors cursor-pointer">
            <ArrowLeft size={14} /> Back to Recruitment
          </button>
        </Link>

        <div className="mb-8">
          <p className="text-[11px] font-sans font-medium text-[var(--text-muted)] uppercase tracking-[0.12em] mb-2">
            Status Tracker
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            Application Status
          </h1>
        </div>

        {isLoading && (
          <div className="p-12 text-center text-xs text-[var(--text-secondary)]">
            Loading candidate record...
          </div>
        )}

        {!isLoading && (!app || error) && (
          <div className="border border-white/[0.06] bg-[var(--card-bg)] p-8 text-center rounded-xl">
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              No recruitment application was found for your account.
            </p>
            <Link href="/recruitment/apply">
              <ChamferedButton variant="primary" size="md">
                Start New Application
              </ChamferedButton>
            </Link>
          </div>
        )}

        {app && meta && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* Status Header Card */}
            <div className="border border-white/[0.06] bg-[var(--card-bg)] p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg border ${meta.badgeClass}`}>
                  <meta.icon className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${meta.badgeClass} mb-2`}>
                    {meta.label}
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {meta.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Induction Details Card (If Accepted) */}
            {app.status === 'accepted' && (
              <div className="border border-emerald-500/20 bg-emerald-950/20 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Designated Placement</span>
                    <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
                      {app.assignedDomain || app.wing} — {app.assignedTitle || 'Core Member'}
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  You have been assigned to the <strong>{app.track} ({app.wing})</strong> squad.
                </p>
              </div>
            )}

            {/* Candidate Record Summary */}
            <div className="border border-white/[0.06] bg-[var(--card-bg)] p-6 rounded-xl space-y-3 text-xs text-[var(--text-secondary)]">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Application Details</h3>
              <div className="flex justify-between pb-2 border-b border-white/[0.04]">
                <span>Full Name</span>
                <span className="text-[var(--text-primary)] font-semibold">{app.fullName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/[0.04]">
                <span>College ID / Roll No</span>
                <span className="text-[var(--text-primary)]">{app.rollNumber}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/[0.04]">
                <span>Contact</span>
                <span className="text-[var(--text-primary)]">{app.mobileNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/[0.04]">
                <span>Branch & Specialization</span>
                <span className="text-[var(--text-primary)]">{app.department || app.branch} • {app.specialization || 'Core'}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/[0.04]">
                <span>Year of Study</span>
                <span className="text-[var(--text-primary)]">{app.year} Year</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/[0.04]">
                <span>Selected Track</span>
                <span className="text-[var(--text-primary)] font-semibold">{app.track || 'TECH'} — {app.wing}</span>
              </div>
              <div className="flex justify-between">
                <span>Submitted At</span>
                <span className="text-[var(--text-primary)]">{new Date(app.appliedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
