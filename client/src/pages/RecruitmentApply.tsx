import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, ExternalLink } from 'lucide-react';
import { CLUB_DOMAINS, RecruitmentSettings, RecruitmentApplication } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import VoidAurora from '../components/backgrounds/VoidAurora';

const YEARS = ['1st', '2nd', '3rd', '4th'] as const;

interface FormState {
  fullName: string;
  rollNumber: string;
  branch: string;
  year: string;
  domainPreferences: string[];
  roleInterest: string;
  portfolioUrl: string;
  motivation: string;
}

export default function RecruitmentApply() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<FormState>({
    fullName: user?.display_name || '',
    rollNumber: user?.rollNumber || '',
    branch: user?.department || '',
    year: user?.year || '',
    domainPreferences: [],
    roleInterest: '',
    portfolioUrl: '',
    motivation: '',
  });

  const { data: settings, isLoading: settingsLoading } = useQuery<RecruitmentSettings>({
    queryKey: ['/api/recruitment/settings'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/recruitment/settings`);
      return res.json();
    },
  });

  // Check if user already has an application
  const { data: existing } = useQuery<RecruitmentApplication | null>({
    queryKey: ['/api/recruitment/applications/mine'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/recruitment/applications/mine`, { credentials: 'include' });
      if (res.status === 404) return null;
      return res.json();
    },
    retry: false,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormState) => {
      const res = await apiRequest('/api/recruitment/applications', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          portfolioUrl: data.portfolioUrl || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Submission failed');
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/recruitment/applications/mine'] });
      setLocation('/recruitment/status');
    },
    onError: (err: Error) => {
      toast({ title: 'Submission failed', description: err.message, variant: 'destructive' });
    },
  });

  const toggleDomain = (d: string) => {
    setForm(f => ({
      ...f,
      domainPreferences: f.domainPreferences.includes(d)
        ? f.domainPreferences.filter(x => x !== d)
        : [...f.domainPreferences, d],
    }));
  };

  if (settingsLoading) return null;

  if (!settings?.isOpen) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-xs text-[var(--text-muted)] mb-3">STATUS: 423 RECRUITMENT_CLOSED</p>
          <p className="text-[var(--text-secondary)]">Applications are not open right now.</p>
        </div>
      </div>
    );
  }

  if (existing) {
    setLocation('/recruitment/status');
    return null;
  }

  const canProceed1 = form.fullName && form.rollNumber && form.branch && form.year;
  const canProceed2 = form.domainPreferences.length > 0 && form.roleInterest;
  const canSubmit = canProceed1 && canProceed2 && form.motivation.length >= 10;

  const field = (label: string, key: keyof FormState, type = 'text', placeholder = '') => (
    <div>
      <label className="block font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase mb-2">{label}</label>
      <input
        type={type}
        value={form[key] as string}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[hsl(var(--accent))]/60 transition-colors"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)]">
      <VoidAurora />
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <p className="font-mono text-xs text-[var(--text-muted)] tracking-[0.2em] uppercase mb-2">Application</p>
          <h1 className="text-3xl font-bold tracking-tight mb-8">Join Aprameya</h1>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-10">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono border transition-all ${
                  s < step ? 'bg-[hsl(var(--accent))] border-[hsl(var(--accent))] text-[var(--bg-body)]' :
                  s === step ? 'border-[hsl(var(--accent))] text-[hsl(var(--accent))]' :
                  'border-[var(--border-color)] text-[var(--text-muted)]'
                }`}>
                  {s < step ? <Check size={12} /> : s}
                </div>
                {s < 3 && <div className={`h-px w-10 transition-colors ${s < step ? 'bg-[hsl(var(--accent))]' : 'bg-[var(--border-color)]'}`} />}
              </div>
            ))}
            <span className="ml-2 font-mono text-xs text-[var(--text-muted)]">
              {step === 1 ? 'Identity' : step === 2 ? 'Interest' : 'Motivation'}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-5">
                {field('Full name', 'fullName', 'text', 'As per KL University records')}
                {field('Roll number', 'rollNumber', 'text', '10-digit roll number')}
                {field('Branch', 'branch', 'text', 'e.g. CSE, ECE, Mechanical')}
                <div>
                  <label className="block font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase mb-2">Year</label>
                  <div className="grid grid-cols-4 gap-2">
                    {YEARS.map(y => (
                      <button key={y} type="button"
                        onClick={() => setForm(f => ({ ...f, year: y }))}
                        className={`py-2.5 rounded-xl border text-sm font-medium transition-all active:scale-[0.97] ${
                          form.year === y
                            ? 'bg-[hsl(var(--accent))]/10 border-[hsl(var(--accent))]/60 text-[hsl(var(--accent))]'
                            : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[hsl(var(--accent))]/30'
                        }`}>{y}</button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                <div>
                  <label className="block font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase mb-3">
                    Domain preferences <span className="normal-case text-[var(--text-muted)]">(select all that apply, drag to rank later)</span>
                  </label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {CLUB_DOMAINS.map(d => {
                      const idx = form.domainPreferences.indexOf(d);
                      return (
                        <button key={d} type="button" onClick={() => toggleDomain(d)}
                          className={`relative flex items-center gap-3 p-3 rounded-xl border text-sm text-left transition-all active:scale-[0.98] ${
                            idx >= 0
                              ? 'bg-[hsl(var(--accent))]/8 border-[hsl(var(--accent))]/50 text-[var(--text-primary)]'
                              : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[hsl(var(--accent))]/30'
                          }`}>
                          {idx >= 0 && (
                            <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[hsl(var(--accent))]/15 border border-[hsl(var(--accent))]/40 flex items-center justify-center font-mono text-[10px] text-[hsl(var(--accent))]">
                              {idx + 1}
                            </span>
                          )}
                          {d}
                        </button>
                      );
                    })}
                  </div>
                  {form.domainPreferences.length > 0 && (
                    <p className="mt-2 font-mono text-xs text-[var(--text-muted)]">
                      Primary preference: {form.domainPreferences[0]}
                    </p>
                  )}
                </div>
                {field('Role interest', 'roleInterest', 'text', 'e.g. ML Engineer, Embedded Dev, Designer')}
                {field('Portfolio / GitHub / LinkedIn (optional)', 'portfolioUrl', 'url', 'https://')}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                <div>
                  <label className="block font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase mb-2">
                    Why this domain? <span className="normal-case">(10–500 characters)</span>
                  </label>
                  <textarea
                    value={form.motivation}
                    onChange={e => setForm(f => ({ ...f, motivation: e.target.value }))}
                    maxLength={500}
                    rows={6}
                    placeholder="Be specific. What have you built, studied, or broken that's relevant? What do you want to work on inside the club?"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[hsl(var(--accent))]/60 transition-colors resize-none"
                  />
                  <p className="mt-1 font-mono text-xs text-[var(--text-muted)] text-right">{form.motivation.length}/500</p>
                </div>

                {/* Review summary */}
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 space-y-2 text-sm">
                  <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider mb-3">Review</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--text-muted)]">Name</span><span>{form.fullName || '—'}</span>
                    <span className="text-[var(--text-muted)]">Roll no.</span><span>{form.rollNumber || '—'}</span>
                    <span className="text-[var(--text-muted)]">Branch / Year</span><span>{form.branch || '—'} · {form.year || '—'}</span>
                    <span className="text-[var(--text-muted)]">Primary domain</span><span>{form.domainPreferences[0] || '—'}</span>
                  </div>
                  {form.portfolioUrl && (
                    <a href={form.portfolioUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-[hsl(var(--accent))] mt-1 hover:underline">
                      <ExternalLink size={11} /> Portfolio link
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <ArrowLeft size={15} /> Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={step === 1 ? !canProceed1 : !canProceed2}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[hsl(var(--accent))] text-[var(--bg-body)] text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-all">
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={() => submitMutation.mutate(form)}
                disabled={!canSubmit || submitMutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[hsl(var(--accent))] text-[var(--bg-body)] text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-all">
                {submitMutation.isPending ? 'Submitting...' : 'Submit application'}
                <Check size={15} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
