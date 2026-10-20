import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowLeft, Search, RefreshCw, Calendar, MapPin, User, Mail, Phone, Cpu } from 'lucide-react';
import { RecruitmentApplication } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import ChamferedButton from '@/components/ui/ChamferedButton';

const STATUS_CONFIG: Record<string, { label: string; badgeStatus: string; message: string }> = {
  pending_review: {
    label: 'Under Review',
    badgeStatus: 'in review',
    message: 'Your candidate profile has been received and is currently under review by our core engineering squads.',
  },
  interview_scheduled: {
    label: 'Interview Scheduled',
    badgeStatus: 'upcoming',
    message: 'You have been shortlisted for domain evaluation. Please see the interview logistics below.',
  },
  accepted: {
    label: 'Accepted / Inducted',
    badgeStatus: 'accepted',
    message: 'Congratulations! Your candidate induction is confirmed. Review your squad assignment below.',
  },
  rejected: {
    label: 'Not Selected',
    badgeStatus: 'rejected',
    message: 'Your application was not selected for this recruitment cycle. We run induction rounds each semester.',
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

  const { data: app, isLoading, refetch } = useQuery<RecruitmentApplication | null>({
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

  const statusMeta = app ? (STATUS_CONFIG[app.status] || STATUS_CONFIG.pending_review) : null;

  return (
    <main className="min-h-screen bg-bg text-text pt-24 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        {/* Back Link */}
        <Link
          href="/recruitment"
          className="inline-flex items-center gap-2 text-xs font-mono text-text-3 hover:text-text transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO RECRUITMENT</span>
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 mb-2">
            APPLICATION TRACKER
          </p>
          <h1 className="font-display font-medium text-3xl sm:text-4xl tracking-tight text-text mb-2">
            Application status.
          </h1>
          <p className="text-sm text-text-2 leading-relaxed">
            Track evaluation telemetry, interview schedules, and induction decisions.
          </p>
        </div>

        {/* Search Input Box */}
        <form
          onSubmit={handleSearchSubmit}
          className="p-4 rounded-lg border border-border bg-surface flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
            <input
              type="text"
              placeholder="Enter Student Roll Number (e.g. 2300049169)"
              value={searchRoll}
              onChange={(e) => setSearchRoll(e.target.value)}
              className="w-full h-10 pl-10 pr-3 rounded-md border border-border-strong bg-transparent text-xs font-mono text-text placeholder:text-text-3 focus:outline-none focus:border-focus-ring"
            />
          </div>
          <ChamferedButton
            type="submit"
            variant="primary"
            size="md"
            className="shrink-0"
            disabled={!searchRoll.trim() || isLoading}
          >
            Check status
          </ChamferedButton>
        </form>

        {/* Result Area */}
        {isLoading ? (
          <div className="p-12 text-center border border-border rounded-lg bg-surface/50 font-mono text-xs text-text-3">
            RETRIEVING EVALUATION TELEMETRY...
          </div>
        ) : app ? (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="rounded-lg border border-border p-6 bg-surface">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-4">
                <div>
                  <span className="font-mono text-xs text-text-3 uppercase tracking-[0.06em] block mb-1">
                    CANDIDATE
                  </span>
                  <h2 className="font-display font-medium text-xl text-text">
                    {app.fullName}
                  </h2>
                  <span className="font-mono text-xs text-text-3">
                    {app.rollNumber} · {app.year} Year
                  </span>
                </div>

                <div className="sm:self-start">
                  <StatusBadge status={statusMeta?.badgeStatus || 'pending'} label={statusMeta?.label} />
                </div>
              </div>

              <p className="text-sm text-text-2 leading-relaxed mb-6">
                {statusMeta?.message}
              </p>

              {/* Stepper (Section 4.9) */}
              <div className="py-4 border-t border-border">
                <span className="font-mono text-[11px] text-text-3 uppercase tracking-wider block mb-4">
                  PROGRESSION STAGES
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-text mb-2" />
                    <span className="text-text">Submitted</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mb-2 ${app.status !== 'pending_review' ? 'bg-text' : 'bg-red ring-4 ring-red-soft'}`} />
                    <span className={app.status !== 'pending_review' ? 'text-text' : 'text-red-text font-medium'}>Screening</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mb-2 ${app.status === 'interview_scheduled' ? 'bg-red ring-4 ring-red-soft' : app.status === 'accepted' ? 'bg-text' : 'border border-border-strong'}`} />
                    <span className={app.status === 'interview_scheduled' ? 'text-red-text font-medium' : 'text-text-3'}>Interview</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mb-2 ${app.status === 'accepted' ? 'bg-text' : 'border border-border-strong'}`} />
                    <span className={app.status === 'accepted' ? 'text-text font-medium' : 'text-text-3'}>Result</span>
                  </div>
                </div>
              </div>

              {/* Interview info if scheduled */}
              {app.status === 'interview_scheduled' && (app.interview_date || app.interview_venue) && (
                <div className="mt-4 p-4 rounded-md border border-border bg-surface-2 text-xs font-mono space-y-2">
                  <span className="text-text font-medium block">INTERVIEW LOGISTICS</span>
                  {app.interview_date && (
                    <div className="flex items-center gap-2 text-text-2">
                      <Calendar className="w-3.5 h-3.5 text-text-3" />
                      <span>{app.interview_date}</span>
                    </div>
                  )}
                  {app.interview_venue && (
                    <div className="flex items-center gap-2 text-text-2">
                      <MapPin className="w-3.5 h-3.5 text-text-3" />
                      <span>{app.interview_venue}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Summary Card */}
            <div className="rounded-lg border border-border p-6 bg-surface space-y-4 text-xs font-mono">
              <span className="text-text-3 uppercase tracking-wider block">SUBMITTED COORDINATES</span>
              <div className="grid sm:grid-cols-2 gap-3 text-text-2">
                <div>
                  <span className="text-text-3 block text-[10px]">TRACK & WING</span>
                  <span className="text-text">{app.track} · {app.wing}</span>
                </div>
                <div>
                  <span className="text-text-3 block text-[10px]">DEPARTMENT</span>
                  <span className="text-text truncate block">{app.department}</span>
                </div>
                {app.email && (
                  <div>
                    <span className="text-text-3 block text-[10px]">EMAIL</span>
                    <span className="text-text truncate block">{app.email}</span>
                  </div>
                )}
                {app.mobileNumber && (
                  <div>
                    <span className="text-text-3 block text-[10px]">PHONE</span>
                    <span className="text-text">{app.mobileNumber}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <ChamferedButton
                variant="secondary"
                size="sm"
                onClick={() => refetch()}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Refresh status
              </ChamferedButton>
            </div>
          </div>
        ) : activeRoll ? (
          <div className="p-8 text-center border border-border rounded-lg bg-surface">
            <h3 className="font-display font-medium text-lg text-text mb-1">
              No application found
            </h3>
            <p className="text-xs text-text-2 mb-6">
              No record found for ID "{activeRoll}". Please verify your roll number.
            </p>
            <Link href="/recruitment/apply">
              <ChamferedButton variant="primary" size="md">
                Submit an application
              </ChamferedButton>
            </Link>
          </div>
        ) : (
          <div className="p-8 text-center border border-border rounded-lg bg-surface text-xs font-mono text-text-3">
            ENTER YOUR ROLL NUMBER ABOVE TO TRACK YOUR EVALUATION
          </div>
        )}
      </div>
    </main>
  );
}
