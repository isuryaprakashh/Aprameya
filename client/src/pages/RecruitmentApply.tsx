import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Lock, Cpu, Sparkles } from 'lucide-react';
import { TECH_WINGS, NON_TECH_WINGS, RecruitmentSettings, RecruitmentApplication } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import VoidAurora from '../components/backgrounds/VoidAurora';
import ChamferedButton from '@/components/ui/ChamferedButton';
import HudFrame from '@/components/ui/HudFrame';

const YEARS = ['1st', '2nd', '3rd', '4th'] as const;

const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Electronics & Communication Engineering (ECE)',
  'Electronics & Computer Science (ECS / ECM)',
  'Mechanical Engineering (MECH)',
  'Electrical & Electronics Engineering (EEE)',
  'Civil Engineering (CIVIL)',
  'Biotechnology / Other',
];

interface FormState {
  fullName: string;
  rollNumber: string;
  mobileNumber: string;
  department: string;
  specialization: string;
  year: '1st' | '2nd' | '3rd' | '4th' | '';
  track: 'TECH' | 'NON_TECH' | '';
  wing: string;
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
    fullName: user?.display_name || user?.username || '',
    rollNumber: user?.rollNumber || '',
    mobileNumber: '',
    department: user?.department || '',
    specialization: '',
    year: (user?.year as any) || '1st',
    track: 'TECH',
    wing: 'Software',
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
      // Clean portfolio URL so empty / whitespace string doesn't fail URL validation
      const cleanedUrl = data.portfolioUrl?.trim();
      const finalUrl = (!cleanedUrl || cleanedUrl === 'https://' || cleanedUrl === 'http://')
        ? undefined
        : (cleanedUrl.startsWith('http://') || cleanedUrl.startsWith('https://'))
          ? cleanedUrl
          : `https://${cleanedUrl}`;

      const payload = {
        fullName: data.fullName.trim(),
        rollNumber: data.rollNumber.trim(),
        mobileNumber: data.mobileNumber.trim(),
        department: data.department.trim(),
        specialization: data.specialization.trim(),
        year: data.year,
        track: data.track,
        wing: data.wing,
        motivation: data.motivation.trim(),
        portfolioUrl: finalUrl,
      };

      const res = await apiRequest('/api/recruitment/applications', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Submission failed');
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/recruitment/applications/mine'] });
      toast({
        title: "Application Submitted Successfully",
        description: "Your candidate profile has been queued for Face-to-Face Interview scheduling.",
      });
      setLocation('/recruitment/status');
    },
    onError: (err: Error) => {
      toast({ title: 'Submission Failed', description: err.message, variant: 'destructive' });
    },
  });

  if (settingsLoading) return null;

  if (!settings?.isOpen) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center px-6">
        <HudFrame label="GATEWAY // ACCESS_RESTRICTED" className="max-w-md w-full p-8 text-center">
          <Lock className="w-10 h-10 text-[var(--text-secondary)] mx-auto mb-4" />
          <h1 className="font-display text-xl font-bold mb-2">Recruitment Closed</h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono mb-6">
            The application window is currently closed. Keep an eye on our events and social channels for the next cycle.
          </p>
          <Link href="/recruitment">
            <ChamferedButton variant="secondary" size="md" className="w-full">
              Back to Overview
            </ChamferedButton>
          </Link>
        </HudFrame>
      </div>
    );
  }

  if (existing) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center px-6">
        <HudFrame label="APPLICATION // RECORD_FOUND" status="QUEUED" className="max-w-md w-full p-8 text-center">
          <Check className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
          <h1 className="font-display text-xl font-bold mb-2">Already Applied</h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono mb-6">
            You have already submitted an application for this recruitment cycle. Check your tracker for interview status.
          </p>
          <Link href="/recruitment/status">
            <ChamferedButton variant="primary" size="md" className="w-full">
              View Application Tracker
            </ChamferedButton>
          </Link>
        </HudFrame>
      </div>
    );
  }

  const validateStep1 = () => {
    if (!form.fullName.trim()) return 'Full name is required';
    if (!form.rollNumber.trim()) return 'Student ID / Roll number is required';
    if (!form.mobileNumber.trim() || form.mobileNumber.trim().length < 10) return 'Valid 10-digit mobile number is required';
    if (!form.department.trim()) return 'Please select or enter your department';
    if (!form.specialization.trim()) return 'Academic specialization is required (e.g. AI/DS, IoT, VLSI, Core)';
    if (!form.year) return 'Please select your current year of study';
    return null;
  };

  const validateStep2 = () => {
    if (!form.track) return 'Please select a track (TECH or NON-TECH)';
    if (!form.wing) return 'Please select your preferred wing';
    return null;
  };

  const validateStep3 = () => {
    if (!form.motivation.trim() || form.motivation.trim().length < 10) {
      return 'Please write a brief statement on why you want to join (min 10 characters)';
    }
    return null;
  };

  const handleNext = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        toast({ title: 'Incomplete Profile', description: err, variant: 'destructive' });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        toast({ title: 'Select Track & Wing', description: err, variant: 'destructive' });
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = () => {
    const err = validateStep3();
    if (err) {
      toast({ title: 'Motivation Required', description: err, variant: 'destructive' });
      return;
    }
    submitMutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)] font-sans">
      <VoidAurora />
      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-32 pb-24">

        {/* Step Progression Header */}
        <div className="mb-10 text-center">
          <p className="font-mono text-xs text-[hsl(var(--accent))] tracking-[0.2em] uppercase mb-2">
            APRAMEYA // CADET ENROLLMENT
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Candidate Application
          </h1>

          <div className="flex items-center justify-center gap-3 font-mono text-xs max-w-sm mx-auto">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${step === 1 ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] font-bold' : 'border-[var(--border-color)] text-[var(--text-secondary)]'}`}>
              <span>01</span>
              <span>Profile</span>
            </div>
            <span className="text-[var(--border-color)]">/</span>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${step === 2 ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] font-bold' : 'border-[var(--border-color)] text-[var(--text-secondary)]'}`}>
              <span>02</span>
              <span>Track & Wing</span>
            </div>
            <span className="text-[var(--border-color)]">/</span>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${step === 3 ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] font-bold' : 'border-[var(--border-color)] text-[var(--text-secondary)]'}`}>
              <span>03</span>
              <span>Statement</span>
            </div>
          </div>
        </div>

        <HudFrame label={`FORM_STEP // 0${step}_OF_03`} className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {/* STEP 1: Student Credentials */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-[var(--border-color)] pb-4 mb-6">
                  <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
                    Student Information
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">
                    Provide your university identification and direct contact coordinates.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono text-[var(--text-secondary)] mb-2 uppercase">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Singavarapu Sai Revanth"
                      value={form.fullName}
                      onChange={e => setForm({ ...form, fullName: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[hsl(var(--accent))]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[var(--text-secondary)] mb-2 uppercase">
                      Student ID (Roll Number) *
                    </label>
                    <input
                      type="text"
                      placeholder="2300049169"
                      value={form.rollNumber}
                      onChange={e => setForm({ ...form, rollNumber: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[hsl(var(--accent))]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[var(--text-secondary)] mb-2 uppercase">
                      Mobile Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={form.mobileNumber}
                      onChange={e => setForm({ ...form, mobileNumber: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[hsl(var(--accent))]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[var(--text-secondary)] mb-2 uppercase">
                      Year of Study *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {YEARS.map(y => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => setForm({ ...form, year: y })}
                          className={`h-11 rounded-xl text-xs font-mono font-bold transition-all border ${form.year === y ? 'bg-[hsl(var(--accent))] text-black border-[hsl(var(--accent))]' : 'bg-[var(--bg-body)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[var(--text-secondary)] mb-2 uppercase">
                      Department / Branch *
                    </label>
                    <select
                      value={form.department}
                      onChange={e => setForm({ ...form, department: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[hsl(var(--accent))]"
                    >
                      <option value="">Select Branch</option>
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d} className="bg-black text-white">{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[var(--text-secondary)] mb-2 uppercase">
                      Specialization / Elective Track *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AI & Data Science, IoT, VLSI, Robotics"
                      value={form.specialization}
                      onChange={e => setForm({ ...form, specialization: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[hsl(var(--accent))]"
                    />
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <ChamferedButton
                    variant="primary"
                    size="md"
                    onClick={handleNext}
                    rightIcon={<ArrowRight size={16} />}
                  >
                    Continue to Track Selection
                  </ChamferedButton>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Track & Wing Selection */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div className="border-b border-[var(--border-color)] pb-4">
                  <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
                    Domain Track Selection
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">
                    Choose whether you are applying for an Engineering (TECH) or Operations (NON-TECH) role.
                  </p>
                </div>

                {/* Track Selector Toggle */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, track: 'TECH', wing: TECH_WINGS[0] })}
                    className={`p-5 rounded-xl border text-left transition-all ${form.track === 'TECH' ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10 shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)]' : 'border-[var(--border-color)] bg-[var(--bg-body)] opacity-70 hover:opacity-100'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Cpu className={`w-5 h-5 ${form.track === 'TECH' ? 'text-[hsl(var(--accent))]' : 'text-[var(--text-secondary)]'}`} />
                        <span className="font-display font-bold text-base">TECH TRACK</span>
                      </div>
                      {form.track === 'TECH' && <Check className="w-4 h-4 text-[hsl(var(--accent))]" />}
                    </div>
                    <p className="text-xs font-mono text-[var(--text-secondary)]">
                      Autonomous software, embedded hardware, ROS 2 pipelines, web systems.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, track: 'NON_TECH', wing: NON_TECH_WINGS[0] })}
                    className={`p-5 rounded-xl border text-left transition-all ${form.track === 'NON_TECH' ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'border-[var(--border-color)] bg-[var(--bg-body)] opacity-70 hover:opacity-100'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className={`w-5 h-5 ${form.track === 'NON_TECH' ? 'text-cyan-400' : 'text-[var(--text-secondary)]'}`} />
                        <span className="font-display font-bold text-base">NON-TECH TRACK</span>
                      </div>
                      {form.track === 'NON_TECH' && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-xs font-mono text-[var(--text-secondary)]">
                      Event management, UI/UX designing, broadcasting, PR, media documentation.
                    </p>
                  </button>
                </div>

                {/* Sub-domain / Wing Choice */}
                <div>
                  <label className="block text-xs font-mono text-[var(--text-secondary)] mb-3 uppercase">
                    Select Your Specific Wing *
                  </label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {(form.track === 'TECH' ? TECH_WINGS : NON_TECH_WINGS).map(w => {
                      const isSelected = form.wing === w;
                      return (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setForm({ ...form, wing: w })}
                          className={`p-4 rounded-xl border text-center transition-all ${isSelected ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/15 text-[var(--text-primary)] font-bold shadow-[0_0_15px_rgba(var(--accent-rgb),0.25)]' : 'border-[var(--border-color)] bg-[var(--bg-body)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        >
                          <span className="font-display text-xs block mb-1">{w}</span>
                          <span className="text-[10px] font-mono text-[hsl(var(--accent))]">
                            {isSelected ? 'SELECTED WING' : 'CLICK TO SELECT'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 flex justify-between items-center border-t border-[var(--border-color)]">
                  <ChamferedButton
                    variant="secondary"
                    size="md"
                    onClick={() => setStep(1)}
                    leftIcon={<ArrowLeft size={16} />}
                  >
                    Back
                  </ChamferedButton>

                  <ChamferedButton
                    variant="primary"
                    size="md"
                    onClick={handleNext}
                    rightIcon={<ArrowRight size={16} />}
                  >
                    Continue to Statement
                  </ChamferedButton>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Motivation & Submit */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-[var(--border-color)] pb-4">
                  <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
                    Motivation & Links
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">
                    Explain why you want to join this wing and provide any relevant portfolio or project links.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--text-secondary)] mb-2 uppercase">
                    Why do you want to join this wing? *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your interests, past projects, hands-on experience, or what you hope to learn..."
                    value={form.motivation}
                    onChange={e => setForm({ ...form, motivation: e.target.value })}
                    className="w-full p-4 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[hsl(var(--accent))] font-sans leading-relaxed"
                  />
                  <div className="text-right text-[11px] font-mono text-[var(--text-secondary)] mt-1">
                    {form.motivation.length} / 1000 characters
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--text-secondary)] mb-2 uppercase">
                    Portfolio / GitHub / LinkedIn (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. github.com/username or linkedin.com/in/username"
                    value={form.portfolioUrl}
                    onChange={e => setForm({ ...form, portfolioUrl: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[hsl(var(--accent))]"
                  />
                  <p className="text-[11px] font-mono text-[var(--text-muted)] mt-1">
                    Leave blank if you do not have one yet.
                  </p>
                </div>

                {/* Candidate Summary Card */}
                <div className="p-5 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] space-y-2 font-mono text-xs text-[var(--text-secondary)]">
                  <div className="text-[10px] text-[hsl(var(--accent))] font-bold uppercase tracking-wider mb-2">
                    Application Summary
                  </div>
                  <div className="flex justify-between">
                    <span>CANDIDATE:</span>
                    <span className="text-[var(--text-primary)] font-bold">{form.fullName} ({form.rollNumber})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CONTACT:</span>
                    <span className="text-[var(--text-primary)]">{form.mobileNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ACADEMIC:</span>
                    <span className="text-[var(--text-primary)]">{form.department} • {form.specialization} ({form.year} Year)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SELECTED WING:</span>
                    <span className="text-[hsl(var(--accent))] font-bold">{form.track} // {form.wing}</span>
                  </div>
                </div>

                <div className="pt-6 flex justify-between items-center border-t border-[var(--border-color)]">
                  <ChamferedButton
                    variant="secondary"
                    size="md"
                    onClick={() => setStep(2)}
                    leftIcon={<ArrowLeft size={16} />}
                  >
                    Back
                  </ChamferedButton>

                  <ChamferedButton
                    variant="primary"
                    size="lg"
                    isLoading={submitMutation.isPending}
                    onClick={handleSubmit}
                    rightIcon={<Check size={16} />}
                  >
                    Submit Application
                  </ChamferedButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </HudFrame>
      </div>
    </div>
  );
}
