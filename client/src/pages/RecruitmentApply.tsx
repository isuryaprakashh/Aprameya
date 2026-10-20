import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Lock, Cpu, Sparkles } from 'lucide-react';
import { TECH_WINGS, NON_TECH_WINGS, RecruitmentSettings } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';

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
  email: string;
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
    rollNumber: user?.rollNumber || localStorage.getItem('recruitment_rollNumber') || '',
    email: user?.email || '',
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

  const submitMutation = useMutation({
    mutationFn: async (data: FormState) => {
      const cleanedUrl = data.portfolioUrl?.trim();
      const finalUrl =
        !cleanedUrl || cleanedUrl === 'https://' || cleanedUrl === 'http://'
          ? undefined
          : cleanedUrl.startsWith('http://') || cleanedUrl.startsWith('https://')
          ? cleanedUrl
          : `https://${cleanedUrl}`;

      const payload = {
        fullName: data.fullName.trim(),
        rollNumber: data.rollNumber.trim(),
        email: data.email?.trim() || undefined,
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
      return { ...(await res.json()), submittedRollNumber: data.rollNumber.trim() };
    },
    onSuccess: (data) => {
      const roll = data.submittedRollNumber || form.rollNumber.trim();
      localStorage.setItem('recruitment_rollNumber', roll);
      qc.invalidateQueries({ queryKey: ['/api/recruitment/applications/mine'] });
      toast({
        title: "Application Submitted Successfully",
        description: "Your candidate profile has been queued for evaluation.",
      });
      setLocation(`/recruitment/status?rollNumber=${encodeURIComponent(roll)}`);
    },
    onError: (err: Error) => {
      toast({ title: 'Submission Failed', description: err.message, variant: 'destructive' });
    },
  });

  if (settingsLoading) return null;

  if (!settings?.isOpen) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <div className="max-w-md w-full p-8 text-center border border-border bg-surface rounded-lg">
          <Lock className="w-10 h-10 text-text-3 mx-auto mb-4" />
          <h1 className="font-display text-xl font-medium mb-2">Recruitment closed</h1>
          <p className="text-xs text-text-2 mb-6">
            The application window is currently closed. Stay tuned for future drives.
          </p>
          <Link href="/recruitment">
            <Button variant="secondary" size="md" className="w-full">
              Back to overview
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const validateStep1 = () => {
    if (!form.fullName.trim()) return 'Full name is required';
    if (!form.rollNumber.trim()) return 'Student ID (Roll Number) is required';
    if (!form.mobileNumber.trim()) return 'Mobile number is required';
    if (!form.department.trim()) return 'Branch selection is required';
    if (!form.specialization.trim()) return 'Specialization track is required';
    return null;
  };

  const handleNext = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        toast({ title: 'Missing required fields', description: err, variant: 'destructive' });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = () => {
    if (!form.motivation.trim()) {
      toast({
        title: 'Statement required',
        description: 'Please describe why you wish to join this wing.',
        variant: 'destructive',
      });
      return;
    }
    submitMutation.mutate(form);
  };

  return (
    <main className="min-h-screen bg-bg text-text font-body pt-24 pb-24">
      {/* Thin 2px progress bar at the top (Section 5.5) */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-border z-60">
        <div
          className="h-full bg-red transition-all duration-base"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-6">
        {/* Back Link */}
        <Link
          href="/recruitment"
          className="inline-flex items-center gap-2 text-xs font-mono text-text-3 hover:text-text transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO RECRUITMENT</span>
        </Link>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-3">
              STEP {step} OF 3
            </p>
            <span className="font-mono text-xs text-text-3">AUTOSAVED</span>
          </div>
          <h1 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-text">
            {step === 1 && 'Personal & academic information'}
            {step === 2 && 'Track & wing preference'}
            {step === 3 && 'Statement & portfolio'}
          </h1>
        </div>

        {/* Form Container */}
        <div className="rounded-lg border border-border p-6 sm:p-8 bg-surface">
          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-xs font-body font-medium text-text mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Singavarapu Sai Revanth"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full h-[44px] px-3.5 rounded-md border border-border-strong bg-transparent text-sm text-text placeholder:text-text-3 focus:outline-none focus:border-focus-ring"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body font-medium text-text mb-1.5">
                      Student ID (Roll Number) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2300049169"
                      value={form.rollNumber}
                      onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                      className="w-full h-[44px] px-3.5 rounded-md border border-border-strong bg-transparent text-sm font-mono text-text placeholder:text-text-3 focus:outline-none focus:border-focus-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body font-medium text-text mb-1.5">
                      Mobile Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={form.mobileNumber}
                      onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                      className="w-full h-[44px] px-3.5 rounded-md border border-border-strong bg-transparent text-sm font-mono text-text placeholder:text-text-3 focus:outline-none focus:border-focus-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-body font-medium text-text mb-1.5">
                    Official College Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="2300049169@kluniversity.in"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full h-[44px] px-3.5 rounded-md border border-border-strong bg-transparent text-sm text-text placeholder:text-text-3 focus:outline-none focus:border-focus-ring"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body font-medium text-text mb-1.5">
                      Year of Study *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {YEARS.map((y) => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => setForm({ ...form, year: y })}
                          className={`h-[44px] rounded-md text-xs font-mono transition-colors cursor-pointer border ${
                            form.year === y
                              ? 'border-red-line text-red-text bg-red-soft font-medium'
                              : 'border-border text-text-2 hover:border-border-strong'
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-body font-medium text-text mb-1.5">
                      Branch / Department *
                    </label>
                    <select
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full h-[44px] px-3.5 rounded-md border border-border-strong bg-transparent text-xs text-text focus:outline-none focus:border-focus-ring"
                    >
                      <option value="" className="bg-surface text-text">Select Branch</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d} className="bg-surface text-text">{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-body font-medium text-text mb-1.5">
                    Specialization or Elective Track *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI & Data Science, Embedded, Robotics, IoT"
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    className="w-full h-[44px] px-3.5 rounded-md border border-border-strong bg-transparent text-sm text-text placeholder:text-text-3 focus:outline-none focus:border-focus-ring"
                  />
                </div>

                <div className="pt-6 border-t border-border flex justify-end">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleNext}
                    className="gap-2"
                  >
                    <span>Continue to tracks</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-xs font-body font-medium text-text mb-3">
                    Choose Track *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, track: 'TECH', wing: TECH_WINGS[0] })}
                      className={`p-4 rounded-md border text-left transition-colors cursor-pointer ${
                        form.track === 'TECH'
                          ? 'border-red-line bg-red-soft'
                          : 'border-border hover:border-border-strong'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-display font-medium text-sm text-text">Technical</span>
                        {form.track === 'TECH' && <Check className="w-4 h-4 text-red-text" />}
                      </div>
                      <p className="text-xs text-text-2">Software, hardware, ROS 2, and embedded engineering.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setForm({ ...form, track: 'NON_TECH', wing: NON_TECH_WINGS[0] })}
                      className={`p-4 rounded-md border text-left transition-colors cursor-pointer ${
                        form.track === 'NON_TECH'
                          ? 'border-red-line bg-red-soft'
                          : 'border-border hover:border-border-strong'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-display font-medium text-sm text-text">Operations</span>
                        {form.track === 'NON_TECH' && <Check className="w-4 h-4 text-red-text" />}
                      </div>
                      <p className="text-xs text-text-2">Events, visual design, logistics, and media.</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-body font-medium text-text mb-3">
                    Choose Specific Squad / Wing *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(form.track === 'TECH' ? TECH_WINGS : NON_TECH_WINGS).map((w) => {
                      const isSelected = form.wing === w;
                      return (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setForm({ ...form, wing: w })}
                          className={`p-3.5 rounded-md border text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'border-red-line bg-red-soft font-medium text-text'
                              : 'border-border text-text-2 hover:border-border-strong hover:text-text'
                          }`}
                        >
                          <span className="text-xs block truncate">{w}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-border flex items-center justify-between">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setStep(1)}
                    className="gap-2"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Back</span>
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleNext}
                    className="gap-2"
                  >
                    <span>Continue to statement</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-xs font-body font-medium text-text mb-1.5">
                    Why do you wish to join this wing? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your technical curiosity, projects, or what you hope to build..."
                    value={form.motivation}
                    onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                    className="w-full min-h-[120px] p-3.5 rounded-md border border-border-strong bg-transparent text-sm text-text placeholder:text-text-3 focus:outline-none focus:border-focus-ring leading-relaxed"
                  />
                  <div className="text-right text-[11px] font-mono text-text-3 mt-1">
                    {form.motivation.length} / 1000 characters
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-body font-medium text-text mb-1.5">
                    Portfolio / GitHub / LinkedIn (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. github.com/username or linkedin.com/in/username"
                    value={form.portfolioUrl}
                    onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
                    className="w-full h-[44px] px-3.5 rounded-md border border-border-strong bg-transparent text-sm font-mono text-text placeholder:text-text-3 focus:outline-none focus:border-focus-ring"
                  />
                </div>

                {/* Candidate Summary */}
                <div className="p-4 rounded-md border border-border bg-surface-2 space-y-1.5 text-xs font-mono text-text-2">
                  <span className="text-text-3 uppercase tracking-wider block mb-2">SUMMARY</span>
                  <div>CANDIDATE: {form.fullName} ({form.rollNumber})</div>
                  <div>TRACK: {form.track} · {form.wing}</div>
                  <div>DEPARTMENT: {form.department} ({form.year} Year)</div>
                </div>

                <div className="pt-6 border-t border-border flex items-center justify-between">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setStep(2)}
                    className="gap-2"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Back</span>
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    loading={submitMutation.isPending}
                    onClick={handleSubmit}
                  >
                    Submit application
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
