import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';
import { RecruitmentApplication, RecruitmentSettings, CLUB_DOMAINS } from '@/lib/types';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const STATUS_COLORS: Record<string, string> = {
  pending_review: 'text-amber-400 border-amber-400/30 bg-amber-400/8',
  accepted: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/8',
  waitlisted: 'text-blue-400 border-blue-400/30 bg-blue-400/8',
  rejected: 'text-[var(--text-muted)] border-[var(--border-color)] bg-[var(--card-bg)]',
};

const STATUS_LABELS: Record<string, string> = {
  pending_review: '202 PENDING',
  accepted: '200 ACCEPTED',
  waitlisted: '423 WAITLISTED',
  rejected: '409 REJECTED',
};

function Drawer({ app, onClose }: { app: RecruitmentApplication; onClose: () => void }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [assignedDomain, setAssignedDomain] = useState(app.assignedDomain || '');
  const [assignedTitle, setAssignedTitle] = useState(app.assignedTitle || 'Member');
  const [reviewNotes, setReviewNotes] = useState(app.reviewNotes || '');

  const decideMutation = useMutation({
    mutationFn: async (status: 'accepted' | 'waitlisted' | 'rejected') => {
      const res = await apiRequest(`/api/recruitment/applications/${app.id}/decision`, {
        method: 'PATCH',
        body: JSON.stringify({
          status,
          ...(status === 'accepted' ? { assignedDomain, assignedTitle } : {}),
          reviewNotes: reviewNotes || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Decision failed');
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/recruitment/applications'] });
      onClose();
      toast({ title: 'Decision recorded' });
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-[var(--card-bg)] border-l border-[var(--border-color)] overflow-y-auto"
      >
        <div className="p-6 border-b border-[var(--border-color)] flex items-start justify-between">
          <div>
            <p className="font-bold text-lg">{app.fullName}</p>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-0.5">{app.rollNumber} · {app.branch} · {app.year} yr</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--border-color)] transition-colors"><X size={16} /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current status */}
          <div>
            <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Current status</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full border font-mono text-xs ${STATUS_COLORS[app.status]}`}>
              {STATUS_LABELS[app.status]}
            </span>
          </div>

          {/* Domain preferences */}
          <div>
            <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Domain preferences</p>
            <div className="flex flex-wrap gap-2">
              {app.domainPreferences.map((d, i) => (
                <span key={d} className="px-2.5 py-1 rounded-lg border border-[var(--border-color)] text-xs">
                  {i === 0 && <span className="text-[hsl(var(--accent))] mr-1">①</span>}{d}
                </span>
              ))}
            </div>
          </div>

          {/* Role interest */}
          <div>
            <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Role interest</p>
            <p className="text-sm">{app.roleInterest}</p>
          </div>

          {/* Portfolio */}
          {app.portfolioUrl && (
            <div>
              <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Portfolio</p>
              <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer"
                className="text-sm text-[hsl(var(--accent))] hover:underline break-all">{app.portfolioUrl}</a>
            </div>
          )}

          {/* Motivation */}
          <div>
            <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Motivation</p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{app.motivation}</p>
          </div>

          {/* Decision area */}
          {app.status === 'pending_review' && (
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-body)] p-5 space-y-4">
              <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">Decision</p>

              <div className="space-y-3">
                <div>
                  <label className="block font-mono text-xs text-[var(--text-muted)] mb-1.5">Assign domain (required for accept)</label>
                  <select
                    value={assignedDomain}
                    onChange={e => setAssignedDomain(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-[hsl(var(--accent))]/50 transition-colors"
                  >
                    <option value="">Select domain</option>
                    {CLUB_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-xs text-[var(--text-muted)] mb-1.5">Assign title</label>
                  <input
                    value={assignedTitle}
                    onChange={e => setAssignedTitle(e.target.value)}
                    placeholder="e.g. Member, Domain Lead"
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[hsl(var(--accent))]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-[var(--text-muted)] mb-1.5">Internal notes (not shown to applicant)</label>
                  <textarea
                    value={reviewNotes}
                    onChange={e => setReviewNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-sm resize-none focus:outline-none focus:border-[hsl(var(--accent))]/50 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => decideMutation.mutate('accepted')}
                  disabled={!assignedDomain || !assignedTitle || decideMutation.isPending}
                  className="py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold disabled:opacity-40 hover:bg-emerald-500/20 transition-colors"
                >Accept</button>
                <button
                  onClick={() => decideMutation.mutate('waitlisted')}
                  disabled={decideMutation.isPending}
                  className="py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold disabled:opacity-40 hover:bg-blue-500/20 transition-colors"
                >Waitlist</button>
                <button
                  onClick={() => decideMutation.mutate('rejected')}
                  disabled={decideMutation.isPending}
                  className="py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] text-xs font-semibold disabled:opacity-40 hover:border-red-500/30 hover:text-red-400 transition-colors"
                >Reject</button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

export default function RecruitmentView() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState<RecruitmentApplication | null>(null);

  const { data: settings } = useQuery<RecruitmentSettings>({
    queryKey: ['/api/recruitment/settings'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/recruitment/settings`);
      return res.json();
    },
  });

  const { data: apps = [], isLoading } = useQuery<RecruitmentApplication[]>({
    queryKey: ['/api/recruitment/applications', statusFilter, domainFilter],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (domainFilter) params.set('domain', domainFilter);
      const res = await fetch(`${baseUrl}/api/recruitment/applications?${params}`, { credentials: 'include' });
      return res.json();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (isOpen: boolean) => {
      const res = await apiRequest('/api/recruitment/settings', {
        method: 'PUT',
        body: JSON.stringify({ isOpen }),
      });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/recruitment/settings'] });
    },
    onError: () => {
      toast({ title: 'Failed to update settings', variant: 'destructive' });
    },
  });

  const counts = {
    total: apps.length,
    pending: apps.filter(a => a.status === 'pending_review').length,
    accepted: apps.filter(a => a.status === 'accepted').length,
    other: apps.filter(a => a.status === 'waitlisted' || a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header + toggle */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Recruitment</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">Application queue and window control</p>
        </div>
        <button
          onClick={() => toggleMutation.mutate(!settings?.isOpen)}
          disabled={toggleMutation.isPending}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            settings?.isOpen
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[hsl(var(--accent))]/30 hover:text-[hsl(var(--accent))]'
          }`}
        >
          {settings?.isOpen ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
          Recruitment window: {settings?.isOpen ? 'OPEN' : 'CLOSED'}
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: counts.total },
          { label: 'Pending', value: counts.pending },
          { label: 'Accepted', value: counts.accepted },
          { label: 'Waitlisted / Rejected', value: counts.other },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4">
            <p className="text-2xl font-bold font-mono">{s.value}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-[hsl(var(--accent))]/50 transition-colors"
        >
          <option value="">All statuses</option>
          <option value="pending_review">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="waitlisted">Waitlisted</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={domainFilter}
          onChange={e => setDomainFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-[hsl(var(--accent))]/50 transition-colors"
        >
          <option value="">All domains</option>
          {CLUB_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[var(--border-color)] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center font-mono text-xs text-[var(--text-muted)] animate-pulse">Loading applications...</div>
        ) : apps.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-mono text-xs text-[var(--text-muted)]">STATUS: 204 NO_CONTENT</p>
            <p className="text-sm text-[var(--text-secondary)] mt-2">No applications match this filter.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--card-bg)]">
                <th className="text-left px-4 py-3 font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell">Roll no.</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider hidden md:table-cell">Primary domain</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app, i) => (
                <tr key={app.id}
                  className={`border-b border-[var(--border-color)]/50 hover:bg-[hsl(var(--accent))]/3 cursor-pointer transition-colors ${i === apps.length - 1 ? 'border-b-0' : ''}`}
                  onClick={() => setSelectedApp(app)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{app.fullName}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{app.branch} · {app.year} yr</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)] hidden sm:table-cell">{app.rollNumber}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)] hidden md:table-cell">{app.domainPreferences[0]}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border font-mono text-[10px] ${STATUS_COLORS[app.status]}`}>
                      {STATUS_LABELS[app.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)]"><ChevronRight size={14} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {selectedApp && <Drawer app={selectedApp} onClose={() => setSelectedApp(null)} />}
      </AnimatePresence>
    </div>
  );
}
