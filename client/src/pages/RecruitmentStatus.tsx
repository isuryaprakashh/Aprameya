import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowLeft, Search, RefreshCw, Calendar, MapPin, User, Mail, Phone, Cpu } from 'lucide-react';
import { RecruitmentApplication } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Ring } from '@/components/ui/ring';

const STATUS_CONFIG: Record<string, { label: string; badgeStatus: string; message: string }> = {
  pending_review: {
    label: 'Under review',
    badgeStatus: 'in review',
    message: 'Your candidate profile has been received and is currently under review by our core engineering squads.',
  },
  interview_scheduled: {
    label: 'Interview scheduled',
    badgeStatus: 'upcoming',
    message: 'You have been shortlisted for domain evaluation. Please see the interview logistics below.',
  },
  accepted: {
    label: 'Accepted / inducted',
    badgeStatus: 'accepted',
    message: 'Congratulations! Your candidate induction is confirmed. Review your squad assignment below.',
  },
  rejected: {
    label: 'Not selected',
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
    queryKey: [`/api/recruitment/applications/${activeRoll}`],
    queryFn: async () => {
      if (!activeRoll.trim()) return null;
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/recruitment/applications/${activeRoll.trim()}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to retrieve application status');
      }
      return res.json();
    },
    enabled: Boolean(activeRoll.trim()),
    retry: 1,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRoll.trim()) return;
    setActiveRoll(searchRoll.trim());
    if (typeof window !== 'undefined') {
      localStorage.setItem('recruitment_rollNumber', searchRoll.trim());
    }
  };

  const statusInfo = app
    ? STATUS_CONFIG[app.status] || {
        label: app.status,
        badgeStatus: 'default',
        message: 'Status update pending.',
      }
    : null;

  return (
    <main className="min-h-screen bg-ink text-paper pt-28 pb-24 px-6 md:px-12 max-w-[800px] mx-auto">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/recruitment"
          className="inline-flex items-center gap-2 text-xs text-mute hover:text-paper transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to recruitment overview</span>
        </Link>
      </div>

      {/* Header */}
      <section className="mb-10">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-paper">
          Application status
        </h1>
        <p className="mt-2 text-sm text-text-2">
          Track the evaluation progress of your Aprameya candidacy across review stages.
        </p>
      </section>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-mute pointer-events-none" />
          <Input
            type="text"
            placeholder="Enter student roll number (e.g. 2300049169)"
            value={searchRoll}
            onChange={(e) => setSearchRoll(e.target.value)}
            className="pl-10 font-mono text-xs"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!searchRoll.trim() || isLoading}
        >
          Check status
        </Button>
      </form>

      {/* Result Area */}
      {isLoading ? (
        <div className="p-16 text-center border border-hairline bg-surface-1 flex flex-col items-center justify-center gap-3">
          <Ring size={20} />
          <span className="text-xs text-mute font-sans">Checking candidate queue...</span>
        </div>
      ) : app ? (
        <div className="space-y-6">
          {/* Status Card */}
          <div className="border border-hairline p-6 bg-surface-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-hairline">
              <div>
                <span className="text-xs text-mute block mb-1">
                  Candidate ID
                </span>
                <span className="font-mono text-base font-semibold text-paper">
                  {app.rollNumber}
                </span>
              </div>
              <StatusBadge status={statusInfo?.badgeStatus || 'default'}>
                {statusInfo?.label}
              </StatusBadge>
            </div>

            <p className="text-sm text-text-2 leading-relaxed">
              {statusInfo?.message}
            </p>

            {/* Candidate summary grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-hairline text-xs">
              <div>
                <span className="text-mute block text-[11px]">Name</span>
                <span className="text-paper font-medium">{app.fullName}</span>
              </div>
              <div>
                <span className="text-mute block text-[11px]">Domain</span>
                <span className="text-paper font-medium">{app.wing}</span>
              </div>
              <div>
                <span className="text-mute block text-[11px]">Department</span>
                <span className="text-paper">{app.department}</span>
              </div>
              <div>
                <span className="text-mute block text-[11px]">Year</span>
                <span className="text-paper">{app.year}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              className="gap-1.5 text-xs"
            >
              <RefreshCw className="size-3.5" />
              <span>Refresh status</span>
            </Button>
          </div>
        </div>
      ) : activeRoll ? (
        <div className="p-10 text-center border border-hairline bg-surface-1">
          <h2 className="text-lg font-medium text-paper mb-1">
            No application found
          </h2>
          <p className="text-xs text-text-2 mb-6">
            No record found for ID "{activeRoll}". Please verify your roll number.
          </p>
          <Link href="/recruitment/apply">
            <Button variant="primary" size="md">
              Submit an application
            </Button>
          </Link>
        </div>
      ) : (
        <div className="p-12 text-center border border-hairline bg-surface-1 text-xs text-mute font-sans">
          Enter your student roll number above to track your candidacy status.
        </div>
      )}
    </main>
  );
}
