import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronRight, ToggleLeft, ToggleRight, Download,
  Check, Phone, ExternalLink, Filter
} from 'lucide-react';
import { RecruitmentApplication, RecruitmentSettings, CLUB_DOMAINS } from '@/lib/types';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import ChamferedButton from '@/components/ui/ChamferedButton';

const STATUS_COLORS: Record<string, string> = {
  pending_review: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  accepted: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  rejected: 'text-red-400 border-red-400/30 bg-red-400/10',
};

const STATUS_LABELS: Record<string, string> = {
  pending_review: '202 PENDING',
  accepted: '200 ACCEPTED',
  rejected: '409 REJECTED',
};

function Drawer({ app, onClose }: { app: RecruitmentApplication; onClose: () => void }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [assignedDomain, setAssignedDomain] = useState(app.assignedDomain || app.wing || '');
  const [assignedTitle, setAssignedTitle] = useState(app.assignedTitle || 'Core Cadet');
  const [reviewNotes, setReviewNotes] = useState(app.reviewNotes || '');

  const decideMutation = useMutation({
    mutationFn: async (status: 'accepted' | 'rejected') => {
      const payload: Record<string, any> = {
        status,
        reviewNotes: reviewNotes || undefined,
      };

      if (status === 'accepted') {
        payload.assignedDomain = assignedDomain || app.wing;
        payload.assignedTitle = assignedTitle || 'Core Cadet';
      }

      const res = await apiRequest(`/api/recruitment/applications/${app.id}/decision`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Decision failed');
      }
      return res.json();
    },
    onSuccess: (_, status) => {
      qc.invalidateQueries({ queryKey: ['/api/recruitment/applications'] });
      onClose();
      toast({
        title: status === 'accepted' ? 'Candidate Inducted' : 'Application Rejected',
      });
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed top-0 right-0 z-50 h-full w-full max-w-xl bg-[var(--card-bg)] border-l border-[var(--border-color)] overflow-y-auto font-sans"
      >
        <div className="p-6 border-b border-[var(--border-color)] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${app.track === 'TECH' ? 'bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] border border-[hsl(var(--accent))]/30' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'}`}>
                {app.track} // {app.wing}
              </span>
            </div>
            <h2 className="font-display font-bold text-xl text-[var(--text-primary)] mt-1">{app.fullName}</h2>
            <p className="font-mono text-xs text-[var(--text-secondary)] mt-0.5">
              ID: {app.rollNumber} • {app.department || app.branch} ({app.year} yr)
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--border-color)] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Status */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)]">
            <div>
              <p className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-wider mb-1">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full border font-mono text-xs font-bold ${STATUS_COLORS[app.status] || STATUS_COLORS.pending_review}`}>
                {STATUS_LABELS[app.status] || '202 PENDING'}
              </span>
            </div>
            <div className="text-right font-mono text-xs text-[var(--text-secondary)]">
              <div>APPLIED: {new Date(app.appliedAt).toLocaleDateString()}</div>
              {app.reviewedAt && <div>REVIEWED: {new Date(app.reviewedAt).toLocaleDateString()}</div>}
            </div>
          </div>

          {/* Contact Coordinates */}
          <div className="p-4 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] space-y-2 text-xs font-mono">
            <p className="text-[10px] text-[hsl(var(--accent))] uppercase tracking-wider font-bold mb-2">Candidate Details</p>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">MOBILE NUMBER:</span>
              <span className="text-[var(--text-primary)] font-bold flex items-center gap-1.5">
                <Phone size={12} className="text-[hsl(var(--accent))]" />
                {app.mobileNumber || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">SPECIALIZATION:</span>
              <span className="text-[var(--text-primary)]">{app.specialization || 'Core'}</span>
            </div>
            {app.portfolioUrl && (
              <div className="flex justify-between items-center pt-2 border-t border-[var(--border-color)]">
                <span className="text-[var(--text-secondary)]">PORTFOLIO / PROFILE:</span>
                <a
                  href={app.portfolioUrl.startsWith('http') ? app.portfolioUrl : `https://${app.portfolioUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--accent))] hover:underline flex items-center gap-1"
                >
                  Open Link <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>

          {/* Statement of Motivation */}
          <div>
            <p className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              Candidate Motivation
            </p>
            <div className="p-4 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] leading-relaxed font-mono whitespace-pre-wrap">
              {app.motivation}
            </div>
          </div>

          {/* Acceptance & Induction Section */}
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-4">
            <div className="flex items-center gap-2">
              <Check size={18} className="text-emerald-400" />
              <h3 className="font-display font-bold text-sm text-emerald-400">
                Confirm Candidate Induction (Accept)
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-[var(--text-secondary)] mb-1">ASSIGNED WING</label>
                <select
                  value={assignedDomain}
                  onChange={e => setAssignedDomain(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[var(--bg-body)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                >
                  {CLUB_DOMAINS.map(d => (
                    <option key={d} value={d} className="bg-black text-white">{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[var(--text-secondary)] mb-1">TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Core Member, Trainee"
                  value={assignedTitle}
                  onChange={e => setAssignedTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[var(--bg-body)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                />
              </div>
            </div>

            <ChamferedButton
              variant="primary"
              size="sm"
              isLoading={decideMutation.isPending}
              onClick={() => decideMutation.mutate('accepted')}
              className="w-full"
              leftIcon={<Check size={14} />}
            >
              ACCEPT & INDUCT CANDIDATE
            </ChamferedButton>
          </div>

          {/* Rejection Section */}
          <div className="pt-2 space-y-2">
            <input
              type="text"
              placeholder="Rejection note (optional)"
              value={reviewNotes}
              onChange={e => setReviewNotes(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-[var(--bg-body)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)]"
            />
            <ChamferedButton
              variant="destructive"
              size="sm"
              isLoading={decideMutation.isPending}
              onClick={() => decideMutation.mutate('rejected')}
              className="w-full"
            >
              Reject Application
            </ChamferedButton>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default function RecruitmentView() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selectedApp, setSelectedApp] = useState<RecruitmentApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [trackFilter, setTrackFilter] = useState<string>('all');

  const { data: settings } = useQuery<RecruitmentSettings>({
    queryKey: ['/api/recruitment/settings'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/recruitment/settings`);
      return res.json();
    },
  });

  const { data: applications = [], isLoading } = useQuery<RecruitmentApplication[]>({
    queryKey: ['/api/recruitment/applications'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/recruitment/applications`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (isOpen: boolean) => {
      const res = await apiRequest('/api/recruitment/settings', {
        method: 'PUT',
        body: JSON.stringify({ isOpen }),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: data => {
      qc.invalidateQueries({ queryKey: ['/api/recruitment/settings'] });
      toast({ title: data.isOpen ? 'Recruitment is now OPEN' : 'Recruitment is now CLOSED' });
    },
  });

  const handleExportCsv = () => {
    const baseUrl = import.meta.env.VITE_API_URL || '';
    window.open(`${baseUrl}/api/recruitment/export`, '_blank');
  };

  const filtered = applications.filter(a => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesTrack = trackFilter === 'all' || (a.track === trackFilter) || (trackFilter === 'TECH' && !a.track);
    return matchesStatus && matchesTrack;
  });

  const counts = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending_review').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header & Live Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">
              Recruitment Console
            </h1>
            <span className="text-xs font-mono text-[hsl(var(--accent))] px-2 py-0.5 rounded bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/30">
              V2_PIPELINE
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">
            Review candidate profiles, confirm squad inductions, and export student rosters.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ChamferedButton
            variant="command"
            size="md"
            onClick={handleExportCsv}
            leftIcon={<Download size={14} className="text-[hsl(var(--accent))]" />}
          >
            EXPORT EXCEL / CSV
          </ChamferedButton>

          <button
            onClick={() => toggleMutation.mutate(!settings?.isOpen)}
            disabled={toggleMutation.isPending}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
              settings?.isOpen
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : 'border-[var(--border-color)] bg-[var(--bg-body)] text-[var(--text-secondary)]'
            }`}
          >
            {settings?.isOpen ? <ToggleRight size={20} className="text-emerald-400" /> : <ToggleLeft size={20} />}
            <span>{settings?.isOpen ? 'WINDOW OPEN' : 'WINDOW CLOSED'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'TOTAL APPLICANTS', count: counts.total, color: 'text-[var(--text-primary)]' },
          { label: 'PENDING REVIEW', count: counts.pending, color: 'text-amber-400' },
          { label: 'ACCEPTED', count: counts.accepted, color: 'text-emerald-400' },
          { label: 'REJECTED', count: counts.rejected, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)]">
            <div className={`font-display text-2xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-[10px] font-mono text-[var(--text-secondary)] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[var(--text-secondary)]" />
          <span className="text-xs font-mono text-[var(--text-secondary)] uppercase">TRACK:</span>
          <div className="flex gap-1">
            {['all', 'TECH', 'NON_TECH'].map(t => (
              <button
                key={t}
                onClick={() => setTrackFilter(t)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  trackFilter === t
                    ? 'bg-[hsl(var(--accent))] text-black font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {t === 'all' ? 'ALL TRACKS' : t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--text-secondary)] uppercase">STATUS:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-8 px-3 rounded-lg bg-[var(--bg-body)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)]"
          >
            <option value="all">All Statuses</option>
            <option value="pending_review">Pending Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applicants Queue Table */}
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-mono text-[var(--text-secondary)] animate-pulse">
            LOADING CANDIDATE QUEUE...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-[var(--text-secondary)]">
            NO CANDIDATES MATCH CURRENT FILTERS
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-[var(--border-color)] bg-[var(--bg-body)]/50 text-[var(--text-secondary)] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Academic Details</th>
                  <th className="py-3.5 px-4">Track / Wing</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Applied</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filtered.map(app => (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="hover:bg-[var(--bg-body)]/60 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-bold font-sans text-sm text-[var(--text-primary)]">{app.fullName}</div>
                      <div className="text-[11px] text-[var(--text-secondary)] font-mono">{app.rollNumber}</div>
                    </td>
                    <td className="py-4 px-4 text-[var(--text-secondary)]">
                      <div>{app.mobileNumber || '—'}</div>
                    </td>
                    <td className="py-4 px-4 text-[var(--text-secondary)]">
                      <div>{app.department || app.branch} • {app.year} yr</div>
                      <div className="text-[10px] text-[hsl(var(--accent))]">{app.specialization || 'Core'}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${app.track === 'TECH' ? 'bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]' : 'bg-cyan-500/10 text-cyan-400'}`}>
                        {app.track || 'TECH'} // {app.wing}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_COLORS[app.status] || STATUS_COLORS.pending_review}`}>
                        {STATUS_LABELS[app.status] || '202 PENDING'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[var(--text-secondary)] text-[11px]">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <ChevronRight size={16} className="inline text-[var(--text-secondary)]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over Detail Drawer */}
      <AnimatePresence>
        {selectedApp && (
          <Drawer
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
