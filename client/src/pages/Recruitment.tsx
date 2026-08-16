import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Cpu, CircuitBoard, Globe,
  Calendar, Palette, Video,
  ArrowRight, Users, CheckCircle, FileText
} from 'lucide-react';
import { RecruitmentSettings } from '@/lib/types';
import VoidAurora from '../components/backgrounds/VoidAurora';
import ChamferedButton from '@/components/ui/ChamferedButton';
import HudFrame from '@/components/ui/HudFrame';

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
    name: 'Website & Tech Support',
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
    title: 'Face-to-Face Interview',
    desc: 'Shortlisted candidates attend an in-person technical / domain evaluation with club leads.',
    icon: Users,
  },
  {
    step: '03',
    title: 'Final Induction',
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
      <VoidAurora />
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-32 pb-24 font-sans">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <p className="font-mono text-xs text-[hsl(var(--accent))] tracking-[0.2em] uppercase mb-4">
            APRAMEYA // CREW RECRUITMENT
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-4">
            Join the Flight Crew.
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl leading-relaxed font-mono text-sm md:text-base">
            We are looking for passionate engineers, designers, and operators across KL University. Choose between our Tech and Non-Tech tracks to begin your induction.
          </p>

          {/* Status pill */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] font-mono text-xs">
            {isOpen ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold">STATUS: 200 RECRUITMENT_OPEN</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[var(--text-muted)]" />
                <span className="text-[var(--text-secondary)]">STATUS: 423 RECRUITMENT_CLOSED</span>
              </>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-12">
          {/* Left Column: Tech & Non-Tech Tracks */}
          <div className="space-y-12">
            {/* Tech Track */}
            <div>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] font-mono text-xs font-bold border border-[hsl(var(--accent))]/30">
                    TRACK 01
                  </span>
                  <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
                    TECH TRACK
                  </h2>
                </div>
                <span className="text-xs font-mono text-[var(--text-secondary)]">3 SPECIALIZED WINGS</span>
              </div>

              <motion.div
                variants={stagger.container}
                initial="hidden"
                animate="show"
                className="grid sm:grid-cols-3 gap-4"
              >
                {TECH_DOMAINS.map(({ name, icon: Icon, desc, tag }) => (
                  <motion.div key={name} variants={stagger.item}>
                    <HudFrame label={tag} interactive className="p-5 h-full flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 flex items-center justify-center text-[hsl(var(--accent))] mb-4">
                          <Icon size={20} strokeWidth={1.75} />
                        </div>
                        <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-2">
                          {name}
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </HudFrame>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Non-Tech Track */}
            <div>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/30">
                    TRACK 02
                  </span>
                  <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
                    NON-TECH TRACK
                  </h2>
                </div>
                <span className="text-xs font-mono text-[var(--text-secondary)]">3 OPERATIONAL WINGS</span>
              </div>

              <motion.div
                variants={stagger.container}
                initial="hidden"
                animate="show"
                className="grid sm:grid-cols-3 gap-4"
              >
                {NON_TECH_DOMAINS.map(({ name, icon: Icon, desc, tag }) => (
                  <motion.div key={name} variants={stagger.item}>
                    <HudFrame label={tag} interactive className="p-5 h-full flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                          <Icon size={20} strokeWidth={1.75} />
                        </div>
                        <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-2">
                          {name}
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </HudFrame>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Right Column: 3-Step Pipeline & Actions */}
          <div className="space-y-8">
            {/* Timeline */}
            <HudFrame label="SELECTION // PROTOCOL" status="3_STAGE_PASS" className="p-6">
              <h3 className="font-display text-base font-bold text-[var(--text-primary)] mb-6">
                Recruitment Lifecycle
              </h3>
              <div className="space-y-6">
                {PIPELINE_STEPS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-lg border border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/10 flex items-center justify-center text-[hsl(var(--accent))] shrink-0 font-mono text-xs font-bold">
                          <Icon size={16} />
                        </div>
                        {idx < PIPELINE_STEPS.length - 1 && (
                          <div className="w-px flex-1 bg-[var(--border-color)] mt-3" />
                        )}
                      </div>
                      <div className="pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[hsl(var(--accent))] font-bold">STEP {item.step}</span>
                          <p className="font-display font-semibold text-sm text-[var(--text-primary)]">{item.title}</p>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] font-mono mt-1.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </HudFrame>

            {/* Action Card */}
            <HudFrame label="APPLICATION // GATEWAY" className="p-6">
              {isOpen ? (
                <div className="space-y-4">
                  <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
                    Portal is currently accepting submissions. Complete the form to queue your application for interview scheduling.
                  </p>
                  <Link href="/recruitment/apply" className="block">
                    <ChamferedButton variant="primary" size="lg" className="w-full" rightIcon={<ArrowRight size={16} />}>
                      Apply Now
                    </ChamferedButton>
                  </Link>
                  <Link href="/recruitment/status" className="block">
                    <ChamferedButton variant="secondary" size="md" className="w-full">
                      Track Application Status
                    </ChamferedButton>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
                    The recruitment window is currently closed. Follow our events page for technical workshops and upcoming cycle dates.
                  </p>
                  <Link href="/events" className="block">
                    <ChamferedButton variant="secondary" size="md" className="w-full" rightIcon={<ArrowRight size={16} />}>
                      Explore Events
                    </ChamferedButton>
                  </Link>
                  <Link href="/recruitment/status" className="block">
                    <ChamferedButton variant="ghost" size="sm" className="w-full text-[var(--text-secondary)]">
                      Check Existing Status
                    </ChamferedButton>
                  </Link>
                </div>
              )}
            </HudFrame>
          </div>
        </div>

      </div>
    </div>
  );
}
