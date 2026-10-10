import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, CheckCircle, XCircle,
  ShieldCheck, Search, RefreshCw, Calendar, MapPin
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
  interview_scheduled: {
    label: 'Interview Scheduled',
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    icon: Calendar,
    message: 'You have been shortlisted for an interview! Please see the scheduled date, time, and venue below.',
    isComplete: false,
  },
  accepted: {
    label: 'Accepted / Inducted',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    icon: CheckCircle,
    message: 'Congratulations! Your candidate induction is confirmed. Review your designated wing assignment below.',
    isComplete: true,
  },
  rejected: {
    label: 'Not Selected',
    badgeClass: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: XCircle,
    message: 'Your application was not selected for this recruitment cycle. We run induction rounds each semester — you are welcome to apply again in the future.',
    isComplete: true,
  },
};

export default function RecruitmentStatus() {
  const [searchRoll, setSearchRoll] = useState(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('rollNumber');
      return param || localStorage.getItem('recruitment_rollNumber') || '';
    }
    return '';
  });

  const [activeRoll, setActiveRoll] = useState(searchRoll);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('rollNumber');
    if (param) {
      setSearchRoll(param);
      setActiveRoll(param);
    }
  }, []);

  const { data: app, isLoading, error, refetch } = useQuery<RecruitmentApplication | null>({
    queryKey: ['/api/recruitment/applications/mine', activeRoll],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const url = activeRoll
        ? `${baseUrl}/api/recruitment/applications/mine?rollNumber=${encodeURIComponent(activeRoll.trim())}`
        : `${baseUrl}/api/recruitment/applications/mine`;
      const res = await fetch(url, { credentials: 'include' });
      if (res.status === 404) return null;
      if (!res.ok) {
        if (res.status === 400 || res.status === 401) return null;
        throw new Error('Failed to fetch application');
      }
      return res.json();
    },
    retry: false,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRoll.trim()) return;
    setActiveRoll(searchRoll.trim());
    localStorage.setItem('recruitment_rollNumber', searchRoll.trim());
  };

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
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Check the evaluation, interview schedule, and induction result for your application.
          </p>
        </div>

        {/* Roll Number Lookup Form */}
        <form onSubmit={handleSearchSubmit} className="mb-8 p-4 rounded-xl border border-white/[0.08] bg-[var(--card-bg)] flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Enter Student ID / Roll Number (e.g. 2300049169)"
              value={searchRoll}
              onChange={(e) => setSearchRoll(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-[var(--bg-body)] border border-white/[0.08] text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[hsl(var(--accent))]"
            />
          </div>
          <ChamferedButton
            type="submit"
            variant="primary"
            size="md"
            className="shrink-0"
            disabled={!searchRoll.trim() || isLoading}
          >
            Check Status
          </ChamferedButton>
        </form>

        {isLoading && (
          <div className="p-12 text-center text-xs text-[var(--text-secondary)] flex items-center justify-center gap-2 border border-white/[0.06] bg-[var(--card-bg)] rounded-xl">
            <RefreshCw className="w-4 h-4 animate-spin text-red-500" />
            Checking candidate record...
          </div>
        )}

        {!isLoading && (!app || error) && (
          <div className="border border-white/[0.06] bg-[var(--card-bg)] p-8 text-center rounded-xl">
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              {activeRoll
                ? `No recruitment application was found for Roll Number "${activeRoll}".`
                : 'Enter your Student ID / Roll Number above to track your application.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/recruitment/apply">
                <ChamferedButton variant="primary" size="md">
                  Apply for Open Roles
                </ChamferedButton>
              </Link>
            </div>
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
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${meta.badgeClass} mb-2`}>
                    {meta.label}
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {meta.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Interview Details Card (If Interview Scheduled) */}
            {app.interviewDetails && (app.interviewDetails.date || app.interviewDetails.venue) && (
              <div className="border border-cyan-500/20 bg-cyan-950/20 p-6 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
                  <Calendar className="w-4 h-4" /> Interview Schedule
                </div>
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  {app.interviewDetails.date && (
                    <div className="p-3 bg-black/40 rounded-lg border border-cyan-500/20">
                      <span className="text-[10px] text-cyan-400 block font-mono">DATE & TIME</span>
                      <span className="text-xs text-white font-medium">{app.interviewDetails.date}</span>
                    </div>
                  )}
                  {app.interviewDetails.venue && (
                    <div className="p-3 bg-black/40 rounded-lg border border-cyan-500/20">
                      <span className="text-[10px] text-cyan-400 block font-mono">VENUE / LOCATION</span>
                      <span className="text-xs text-white font-medium">{app.interviewDetails.venue}</span>
                    </div>
                  )}
                </div>
                {app.interviewDetails.notes && (
                  <p className="text-xs text-[#94A3B8] italic pt-1">
                    Note: {app.interviewDetails.notes}
                  </p>
                )}
              </div>
            )}

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
                  You have been inducted into the <strong>{app.track} ({app.wing})</strong> squad.
                </p>
              </div>
            )}

            {/* Candidate Record Summary */}
            <div className="border border-white/[0.06] bg-[var(--card-bg)] p-6 rounded-xl space-y-3 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Candidate Record</h3>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/[0.04]">
                <span>Full Name</span>
                <span className="text-[var(--text-primary)] font-semibold">{app.fullName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/[0.04]">
                <span>Student ID (Roll No)</span>
                <span className="text-[var(--text-primary)] font-mono">{app.rollNumber}</span>
              </div>
              {app.email && (
                <div className="flex justify-between pb-2 border-b border-white/[0.04]">
                  <span>Email</span>
                  <span className="text-[var(--text-primary)]">{app.email}</span>
                </div>
              )}
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
                <span>Applied Track & Wing</span>
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
