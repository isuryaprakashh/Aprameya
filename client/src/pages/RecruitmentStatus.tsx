import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, CheckCircle, XCircle,
  Calendar, MapPin, UserCheck, ShieldCheck
} from 'lucide-react';
import { RecruitmentApplication } from '@/lib/types';
import VoidAurora from '../components/backgrounds/VoidAurora';
import ChamferedButton from '@/components/ui/ChamferedButton';
import HudFrame from '@/components/ui/HudFrame';

type StatusMeta = {
  code: string;
  label: string;
  color: string;
  icon: any;
  message: string;
  stage: number; // 1 = submitted, 2 = interview, 3 = final
};

const STATUS_MAP: Record<string, StatusMeta> = {
  pending_review: {
    code: '202',
    label: 'APPLICATION_UNDER_REVIEW',
    color: 'text-amber-400',
    icon: Clock,
    message: 'Your application has been received and is currently under review by domain leads for Face-to-Face Interview shortlisting.',
    stage: 1,
  },
  interview_scheduled: {
    code: '206',
    label: 'F2F_INTERVIEW_SCHEDULED',
    color: 'text-cyan-400',
    icon: UserCheck,
    message: 'Congratulations! You have been shortlisted for the in-person Face-to-Face Interview round. Please review your schedule details below.',
    stage: 2,
  },
  accepted: {
    code: '200',
    label: 'INDUCTION_CONFIRMED',
    color: 'text-emerald-400',
    icon: CheckCircle,
    message: 'Welcome to Aprameya. Your candidate induction is officially confirmed. Review your designated wing assignment below.',
    stage: 3,
  },
  rejected: {
    code: '409',
    label: 'NOT_SELECTED',
    color: 'text-red-400',
    icon: XCircle,
    message: 'Your application was not selected for this recruitment cycle. We run induction rounds each semester — you are welcome to apply again.',
    stage: 3,
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
      <VoidAurora />
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-32 pb-24">

        <Link href="/recruitment">
          <button className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] mb-8 transition-colors">
            <ArrowLeft size={14} /> Back to Recruitment
          </button>
        </Link>

        <div className="mb-8">
          <p className="font-mono text-xs text-[hsl(var(--accent))] tracking-[0.2em] uppercase mb-2">
            TELEMETRY // CANDIDATE_STATUS
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            Application Pipeline
          </h1>
        </div>

        {isLoading && (
          <div className="p-12 text-center font-mono text-xs text-[var(--text-secondary)] animate-pulse">
            QUERYING CANDIDATE RECORD...
          </div>
        )}

        {!isLoading && (!app || error) && (
          <HudFrame label="LOOKUP_ERROR // 404" className="p-8 text-center">
            <p className="font-mono text-xs text-amber-400 mb-2">STATUS: 404 NO_APPLICATION_FOUND</p>
            <p className="text-[var(--text-secondary)] text-sm mb-6 font-mono">
              No recruitment application was found for your authenticated account.
            </p>
            <Link href="/recruitment/apply">
              <ChamferedButton variant="primary" size="md">
                Start New Application
              </ChamferedButton>
            </Link>
          </HudFrame>
        )}

        {app && meta && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* 3-Stage Progress Pipeline */}
            <HudFrame label="PIPELINE_PROGRESSION" status={`STAGE_${meta.stage}_OF_3`} className="p-6">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono mb-4">
                <div className={`p-2.5 rounded-lg border ${meta.stage >= 1 ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] font-bold' : 'border-[var(--border-color)] text-[var(--text-secondary)]'}`}>
                  1. Applied
                </div>
                <div className={`p-2.5 rounded-lg border ${meta.stage >= 2 ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400 font-bold' : 'border-[var(--border-color)] text-[var(--text-secondary)]'}`}>
                  2. F2F Interview
                </div>
                <div className={`p-2.5 rounded-lg border ${meta.stage >= 3 ? (app.status === 'accepted' ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400 font-bold' : 'border-red-400 bg-red-400/10 text-red-400 font-bold') : 'border-[var(--border-color)] text-[var(--text-secondary)]'}`}>
                  3. Decision
                </div>
              </div>

              {/* Status Header Chip */}
              <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-color)]">
                <meta.icon className={`w-5 h-5 ${meta.color} shrink-0`} />
                <div>
                  <span className={`text-xs font-mono font-bold ${meta.color}`}>
                    STATUS: {meta.code} {meta.label}
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] font-mono mt-1 leading-relaxed">
                    {meta.message}
                  </p>
                </div>
              </div>
            </HudFrame>

            {/* F2F Interview Scheduled Card (If Interview Scheduled) */}
            {app.status === 'interview_scheduled' && (
              <HudFrame label="INTERVIEW_SCHEDULE // IN_PERSON" status="CONFIRMED" className="p-6 border-cyan-500/40 bg-cyan-500/5">
                <h3 className="font-display text-base font-bold text-cyan-400 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Face-to-Face Interview Coordinates
                </h3>

                <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono mb-4">
                  <div className="p-3 rounded-lg bg-[var(--bg-body)] border border-[var(--border-color)]">
                    <span className="text-[var(--text-secondary)] block mb-1">DATE & TIME:</span>
                    <span className="text-[var(--text-primary)] font-bold">
                      {app.interviewDetails?.date || 'To be communicated by Lead'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[var(--bg-body)] border border-[var(--border-color)]">
                    <span className="text-[var(--text-secondary)] block mb-1">VENUE / LAB:</span>
                    <span className="text-[var(--text-primary)] font-bold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {app.interviewDetails?.venue || 'Aprameya Innovation Lab, KLU'}
                    </span>
                  </div>
                </div>

                {app.interviewDetails?.notes && (
                  <div className="p-3 rounded-lg bg-[var(--bg-body)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-secondary)] mb-4">
                    <span className="text-cyan-400 font-bold block mb-1">CANDIDATE INSTRUCTIONS:</span>
                    {app.interviewDetails.notes}
                  </div>
                )}

                <div className="text-[11px] font-mono text-[var(--text-secondary)]">
                  * Please carry your Student ID card and laptop / portfolio if applicable.
                </div>
              </HudFrame>
            )}

            {/* Induction Details Card (If Accepted) */}
            {app.status === 'accepted' && (
              <HudFrame label="INDUCTION_COORDINATES" status="OFFICIAL" className="p-6 border-emerald-500/40 bg-emerald-500/5">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">Designated Placement</span>
                    <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
                      {app.assignedDomain || app.wing} — {app.assignedTitle || 'Core Cadet'}
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
                  You have been assigned to the <strong>{app.track} ({app.wing})</strong> squad. Welcome to the flight crew.
                </p>
              </HudFrame>
            )}

            {/* Candidate Record Summary */}
            <HudFrame label="CANDIDATE_DOSSIER" className="p-6 space-y-3 font-mono text-xs text-[var(--text-secondary)]">
              <div className="flex justify-between pb-2 border-b border-[var(--border-color)]">
                <span>FULL NAME:</span>
                <span className="text-[var(--text-primary)] font-bold">{app.fullName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[var(--border-color)]">
                <span>STUDENT ID / ROLL NO:</span>
                <span className="text-[var(--text-primary)]">{app.rollNumber}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[var(--border-color)]">
                <span>CONTACT NUMBER:</span>
                <span className="text-[var(--text-primary)]">{app.mobileNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[var(--border-color)]">
                <span>DEPARTMENT & SPECIALIZATION:</span>
                <span className="text-[var(--text-primary)]">{app.department || app.branch} • {app.specialization || 'Core'}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[var(--border-color)]">
                <span>YEAR OF STUDY:</span>
                <span className="text-[var(--text-primary)]">{app.year} Year</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[var(--border-color)]">
                <span>SELECTED WING:</span>
                <span className="text-[hsl(var(--accent))] font-bold">{app.track || 'TECH'} // {app.wing}</span>
              </div>
              <div className="flex justify-between">
                <span>SUBMITTED AT:</span>
                <span className="text-[var(--text-primary)]">{new Date(app.appliedAt).toLocaleDateString()}</span>
              </div>
            </HudFrame>
          </motion.div>
        )}
      </div>
    </div>
  );
}
