import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Bot, Eye, CircuitBoard, Cpu, Ruler, Palette, Users,
  ArrowRight, Clock, CheckCircle, FileText
} from 'lucide-react';
import { RecruitmentSettings } from '@/lib/types';
import VoidAurora from '../components/backgrounds/VoidAurora';

const DOMAINS = [
  { name: 'Autonomy & Controls', icon: Bot, desc: 'Path planning, control systems, autonomous navigation.' },
  { name: 'Perception & Computer Vision', icon: Eye, desc: 'Object detection, SLAM, sensor fusion, visual odometry.' },
  { name: 'Embedded Systems & Hardware', icon: CircuitBoard, desc: 'MCU programming, PCB design, actuator control.' },
  { name: 'Software & AI/ML', icon: Cpu, desc: 'Model training, inference pipelines, backend architecture.' },
  { name: 'Mechanical & CAD', desc: 'Chassis design, simulation, structural analysis.', icon: Ruler },
  { name: 'Design & Content', icon: Palette, desc: 'Brand identity, technical documentation, media production.' },
  { name: 'Operations & Sponsorship', icon: Users, desc: 'Logistics, partnerships, event management, finance.' },
];

const TIMELINE = [
  { code: '202', label: 'Apply', desc: 'Fill the 3-step application form.' },
  { code: '202', label: 'Review', desc: 'Core team reviews within 2 weeks.' },
  { code: '200', label: 'Decision', desc: 'Status visible on your dashboard.' },
];

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.06 } } },
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
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <p className="font-mono text-xs text-[var(--text-muted)] tracking-[0.2em] uppercase mb-4">
            Aprameya · AI & Autonomous Club
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
            Join the lab.
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl leading-relaxed font-mono text-sm">
            We build autonomous systems — robots, perception pipelines, and the infrastructure that makes them work. 
            Applications open to KL University students across all years and branches.
          </p>

          {/* Status pill */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] font-mono text-xs">
            {isOpen ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400">STATUS: 200 RECRUITMENT_OPEN</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
                <span className="text-[var(--text-muted)]">STATUS: 423 RECRUITMENT_CLOSED</span>
              </>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-12">
          {/* Left — Domains */}
          <div>
            <p className="font-mono text-xs text-[var(--text-muted)] tracking-[0.15em] uppercase mb-6">
              Open domains
            </p>
            <motion.div
              variants={stagger.container}
              initial="hidden"
              animate="show"
              className="grid sm:grid-cols-2 gap-3"
            >
              {DOMAINS.map(({ name, icon: Icon, desc }) => (
                <motion.div
                  key={name}
                  variants={stagger.item}
                  className="hud-card group p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[hsl(var(--accent))]/40 transition-colors duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-2 rounded-lg bg-[hsl(var(--accent))]/8 text-[hsl(var(--accent))] shrink-0 group-hover:bg-[hsl(var(--accent))]/15 transition-colors">
                      <Icon size={16} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">{name}</p>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — Timeline + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* Timeline */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
              <p className="font-mono text-xs text-[var(--text-muted)] tracking-[0.15em] uppercase mb-5">
                Application process
              </p>
              <div className="space-y-4">
                {TIMELINE.map(({ label, desc }, i) => (
                  <div key={label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full border border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/8 flex items-center justify-center shrink-0">
                        {i === 0 ? <FileText size={12} className="text-[hsl(var(--accent))]" /> :
                         i === 1 ? <Clock size={12} className="text-[hsl(var(--accent))]" /> :
                         <CheckCircle size={12} className="text-[hsl(var(--accent))]" />}
                      </div>
                      {i < TIMELINE.length - 1 && (
                        <div className="w-px flex-1 bg-[var(--border-color)] mt-2" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
              {isOpen ? (
                <>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Applications are open. Sign in to submit yours.
                  </p>
                  <Link href="/recruitment/apply">
                    <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[hsl(var(--accent))] text-[var(--bg-body)] font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all">
                      Apply now <ArrowRight size={16} />
                    </button>
                  </Link>
                  <Link href="/recruitment/status">
                    <button className="w-full mt-2 px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] text-sm hover:text-[var(--text-primary)] hover:border-[hsl(var(--accent))]/40 transition-colors">
                      Check my application
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Recruitment is closed. Follow our events page for announcements about the next cycle.
                  </p>
                  <Link href="/events">
                    <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[var(--border-color)] text-sm hover:border-[hsl(var(--accent))]/40 hover:text-[hsl(var(--accent))] transition-colors">
                      View events <ArrowRight size={16} />
                    </button>
                  </Link>
                  <Link href="/recruitment/status">
                    <button className="w-full mt-2 px-5 py-2.5 rounded-xl text-[var(--text-muted)] text-sm hover:text-[var(--text-secondary)] transition-colors">
                      Check existing application
                    </button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
