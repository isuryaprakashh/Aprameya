import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Cpu, CircuitBoard, Globe,
  Calendar, Palette, Video,
  ArrowRight, Users, CheckCircle, FileText
} from 'lucide-react';
import { RecruitmentSettings } from '@/lib/types';
import ChamferedButton from '@/components/ui/ChamferedButton';

const TECH_DOMAINS = [
  {
    name: 'Software',
    icon: Cpu,
    tag: 'TECH WING 01',
    desc: 'ROS 2 nodes, AI/ML inference pipelines, trajectory algorithms, and autonomous control software.',
  },
  {
    name: 'Hardware',
    icon: CircuitBoard,
    tag: 'TECH WING 02',
    desc: 'Microcontroller programming, PCB schematics, power distribution, sensors, and actuator integration.',
  },
  {
    name: 'Website & Infrastructure',
    icon: Globe,
    tag: 'TECH WING 03',
    desc: 'Club portal development, database architectures, server deployment, and technical laboratory support.',
  },
];

const NON_TECH_DOMAINS = [
  {
    name: 'Event Management',
    icon: Calendar,
    tag: 'OPS WING 01',
    desc: 'Symposia planning, workshop logistics, hackathon coordination, and live event operations.',
  },
  {
    name: 'Designing',
    icon: Palette,
    tag: 'OPS WING 02',
    desc: 'UI/UX design, visual identity, branding systems, technical poster graphics, and motion assets.',
  },
  {
    name: 'Broadcasting & Media',
    icon: Video,
    tag: 'OPS WING 03',
    desc: 'Cinematography, project video documentation, social storytelling, and public relations.',
  },
];

const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Profile Submission',
    desc: 'Submit student details, academic specialization, and select your preferred Tech or Non-Tech wing.',
    icon: FileText,
  },
  {
    step: '02',
    title: 'Technical Interview',
    desc: 'Shortlisted candidates attend an in-person technical / domain evaluation with club leads.',
    icon: Users,
  },
  {
    step: '03',
    title: 'Induction',
    desc: 'Selected candidates are onboarded directly into active engineering and operational squads.',
    icon: CheckCircle,
  },
];

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } },
};

export default function Recruitment() {
  const { data: settings } = useQuery<RecruitmentSettings>({
    queryKey: ['/api/recruitment/settings'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/recruitment/settings`);
      return res.json();
    },
  });

  const isOpen = settings?.isOpen ?? false;

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)]">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24 font-sans">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <p className="text-[11px] font-sans font-medium text-[var(--text-muted)] uppercase tracking-[0.15em] mb-3">
            Recruitment Drive
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-[var(--text-primary)] font-display">
            <span className="text-[var(--text-secondary)] font-normal">Join the</span>{" "}
            <span>Lab Crew</span>
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl leading-relaxed text-base">
            We are looking for passionate engineers, designers, and operators across KL University. Choose between our Tech and Non-Tech tracks to begin your induction.
          </p>

          {/* Status badge */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-white/[0.06] bg-[var(--card-bg)] text-xs font-medium">
              {isOpen ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[var(--text-primary)]">Applications Open</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-[var(--text-muted)]" />
                  <span className="text-[var(--text-secondary)]">Applications Closed</span>
                </>
              )}
            </div>
            {isOpen && (
              <span className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-950/20 text-red-300 text-xs font-mono">
                ⚡ Direct Apply • No Account Required
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          {/* Left Column: Tech & Non-Tech Tracks */}
          <div className="space-y-10">
            {/* Tech Track */}
            <div>
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[var(--text-primary)] text-[11px] font-semibold">
                    Track 01
                  </span>
                  <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
                    Technical Wings
                  </h2>
                </div>
                <span className="text-xs text-[var(--text-muted)]">3 Specializations</span>
              </div>

              <motion.div
                variants={stagger.container}
                initial="hidden"
                animate="show"
                className="grid sm:grid-cols-3 gap-4"
              >
                {TECH_DOMAINS.map(({ name, icon: Icon, desc }) => (
                  <motion.div key={name} variants={stagger.item}>
                    <div className="p-5 h-full flex flex-col justify-between morphic-metallic-card rounded-xl transition-all">
                      <div>
                        <div className="w-9 h-9 rounded-lg bg-red-950/60 border border-red-400/30 flex items-center justify-center text-red-300 mb-4 shadow-[inset_0_1px_1px_rgba(254,202,202,0.2)]">
                          <Icon size={18} />
                        </div>
                        <h3 className="font-display font-bold text-base text-white mb-2">
                          {name}
                        </h3>
                        <p className="text-xs text-[#94A3B8] leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Non-Tech Track */}
            <div>
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-red-500/10">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30 text-red-300 text-[11px] font-semibold">
                    Track 02
                  </span>
                  <h2 className="font-display text-lg font-bold text-white">
                    Operations Wings
                  </h2>
                </div>
                <span className="text-xs text-[#64748B]">3 Specializations</span>
              </div>

              <motion.div
                variants={stagger.container}
                initial="hidden"
                animate="show"
                className="grid sm:grid-cols-3 gap-4"
              >
                {NON_TECH_DOMAINS.map(({ name, icon: Icon, desc }) => (
                  <motion.div key={name} variants={stagger.item}>
                    <div className="p-5 h-full flex flex-col justify-between morphic-metallic-card rounded-xl transition-all">
                      <div>
                        <div className="w-9 h-9 rounded-lg bg-red-950/60 border border-red-400/30 flex items-center justify-center text-red-300 mb-4 shadow-[inset_0_1px_1px_rgba(254,202,202,0.2)]">
                          <Icon size={18} />
                        </div>
                        <h3 className="font-display font-bold text-base text-white mb-2">
                          {name}
                        </h3>
                        <p className="text-xs text-[#94A3B8] leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Right Column: 3-Step Pipeline & Actions */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className="p-6 morphic-metallic-card rounded-xl">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-6">
                Selection Process
              </h3>
              <div className="space-y-5">
                {PIPELINE_STEPS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.step} className="flex gap-3.5">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-md border border-red-400/30 bg-red-950/60 flex items-center justify-center text-red-300 shrink-0 text-xs font-semibold shadow-[inset_0_1px_1px_rgba(254,202,202,0.2)]">
                          <Icon size={14} />
                        </div>
                        {idx < PIPELINE_STEPS.length - 1 && (
                          <div className="w-px flex-1 bg-red-500/20 mt-2.5" />
                        )}
                      </div>
                      <div className="pb-2">
                        <p className="font-semibold text-sm text-white">{item.title}</p>
                        <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Application CTA Card */}
            <div className="p-6 morphic-metallic-card rounded-xl">
              <h3 className="font-display text-base font-bold text-white mb-2">
                {isOpen ? 'Ready to Apply?' : 'Recruitment Closed'}
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-6">
                {isOpen
                  ? 'Complete your profile and choose your focus tracks for the current intake cycle.'
                  : 'Applications for this intake cycle are currently closed. Stay tuned for future drives.'}
              </p>

              {isOpen ? (
                <div className="space-y-3">
                  <Link href="/recruitment/apply">
                    <ChamferedButton
                      variant="primary"
                      size="md"
                      className="w-full"
                      rightIcon={<ArrowRight size={14} />}
                    >
                      Start Application
                    </ChamferedButton>
                  </Link>
                  <Link href="/recruitment/status">
                    <ChamferedButton
                      variant="secondary"
                      size="md"
                      className="w-full"
                    >
                      Check Status
                    </ChamferedButton>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href="/recruitment/status">
                    <ChamferedButton
                      variant="secondary"
                      size="md"
                      className="w-full"
                    >
                      Check Application Status
                    </ChamferedButton>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
