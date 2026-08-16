import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { RecruitmentApplication } from '@/lib/types';
import VoidAurora from '../components/backgrounds/VoidAurora';

type StatusMeta = {
  code: string;
  label: string;
  color: string;
  icon: typeof Clock;
  message: string;
};

const STATUS_MAP: Record<string, StatusMeta> = {
  pending_review: {
    code: '202',
    label: 'PENDING_REVIEW',
    color: 'text-amber-400',
    icon: Clock,
    message: 'Your application is with the core team. Decisions are made within 2 weeks of the cycle closing.',
  },
  accepted: {
    code: '200',
    label: 'ACCEPTED',
    color: 'text-emerald-400',
    icon: CheckCircle,
    message: 'Welcome to Aprameya. Check your assigned domain and title below. Further onboarding details will follow from your domain lead.',
  },
  waitlisted: {
    code: '423',
    label: 'WAITLISTED',
    color: 'text-blue-400',
    icon: AlertCircle,
    message: 'You are on the waitlist. We will reach out if a position opens. Continue engaging through our events.',
  },
  rejected: {
    code: '409',
    label: 'NOT_SELECTED',
    color: 'text-[var(--text-muted)]',
    icon: XCircle,
    message: 'Your application was not selected for this cycle. We run recruitment each semester — you are welcome to apply again.',
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

  const meta = app ? STATUS_MAP[app.status] : null;

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)]">
      <VoidAurora />
      <div className="relative z-10 max-w-xl mx-auto px-6 pt-32 pb-24">
        <Link href="/recruitment">
          <button className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-10 transition-colors">
            <ArrowLeft size={14} /> Recruitment
          </button>
        </Link>

        <p className="font-mono text-xs text-[var(--text-muted)] tracking-[0.2em] uppercase mb-2">Application status</p>
        <h1 className="text-3xl font-bold tracking-tight mb-8">My application</h1>

        {isLoading && (
          <div className="font-mono text-xs text-[var(--text-muted)] animate-pulse">Fetching record...</div>
        )}

        {!isLoading && (!app || error) && (
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-8 text-center">
            <p className="font-mono text-xs text-[var(--text-muted)] mb-2">STATUS: 404 NO_APPLICATION</p>
            <p className="text-[var(--text-secondary)] text-sm mb-6">No application found for your account.</p>
            <Link href="/recruitment/apply">
              <button className="px-5 py-2.5 rounded-xl bg-[hsl(var(--accent))] text-[var(--bg-body)] text-sm font-semibold hover:opacity-90 transition-opacity">
                Apply now
              </button>
            </Link>
          </div>
        )}

        {app && meta && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            {/* Status card */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
              <div className="flex items-start gap-4">
                <meta.icon size={20} className={`mt-0.5 shrink-0 ${meta.color}`} />
                <div>
                  <p className={`font-mono text-xs tracking-widest mb-1 ${meta.color}`}>
                    STATUS: {meta.code} {meta.label}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{meta.message}</p>
                </div>
              </div>
            </div>

            {/* Assigned domain/title (on accept) */}
            {app.status === 'accepted' && app.assignedDomain && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-3">
                <p className="font-mono text-xs text-emerald-400 tracking-wider uppercase">Assignment</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[var(--text-muted)] text-xs mb-1">Domain</p>
                    <p className="font-semibold">{app.assignedDomain}</p>
                  </div>
                  {app.assignedTitle && (
                    <div>
                      <p className="text-[var(--text-muted)] text-xs mb-1">Title</p>
                      <p className="font-semibold">{app.assignedTitle}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Application details */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
              <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider mb-4">Submitted details</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <span className="text-[var(--text-muted)]">Name</span>
                <span>{app.fullName}</span>
                <span className="text-[var(--text-muted)]">Roll no.</span>
                <span>{app.rollNumber}</span>
                <span className="text-[var(--text-muted)]">Branch / Year</span>
                <span>{app.branch} · {app.year}</span>
                <span className="text-[var(--text-muted)]">Domain pref.</span>
                <span>{app.domainPreferences.join(', ')}</span>
                <span className="text-[var(--text-muted)]">Role interest</span>
                <span>{app.roleInterest}</span>
                <span className="text-[var(--text-muted)]">Applied</span>
                <span>{new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
