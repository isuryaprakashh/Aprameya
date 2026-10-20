import React from 'react';
import { Link } from 'wouter';
import { Mail, MapPin, Lightbulb, Users, Trophy } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { NumberTicker } from '@/components/StatsCard';

const STATS = [
  { value: "2019", label: "Founded at KL University" },
  { value: "48", label: "Active engineering members" },
  { value: "3rd", label: "National benchmark at IISc" },
  { value: "100%", label: "Physical hardware builds" },
];

const VALUES = [
  {
    icon: Lightbulb,
    title: "First-principles rigor",
    desc: "Validating navigation algorithms through empirical hardware testing rather than synthetic simulations.",
  },
  {
    icon: Users,
    title: "Cross-disciplinary squads",
    desc: "Uniting computer vision, embedded firmware, mechanical fabrication, and operational squads seamlessly.",
  },
  {
    icon: Trophy,
    title: "Open knowledge dissemination",
    desc: "Publishing research papers, releasing reproducible codebases, and training next-generation robotics talent.",
  },
];

const TIMELINE = [
  {
    year: "2019",
    title: "Founded at KL University",
    desc: "Established as the Autonomous Systems & Robotics technical laboratory in R609e R&D block.",
  },
  {
    year: "2023",
    title: "IISc Bengaluru National Podium",
    desc: "Secured 3rd place in India at the Urban Vision Autonomous Hackathon against premier institutions.",
  },
  {
    year: "2026",
    title: "Research Publications & Expansion",
    desc: "Publishing peer-reviewed autonomy papers and expanding multi-sensor perception cohorts.",
  },
];

const ACHIEVEMENTS = [
  {
    year: "2023",
    title: "Urban Vision Autonomous Navigation Challenge (IISc Bengaluru)",
    badge: "National 3rd",
    type: "accepted",
  },
  {
    year: "2024",
    title: "IEEE Academic Research Submissions & Peer Review",
    badge: "Published",
    type: "open",
  },
];

export const About: React.FC = () => {
  return (
    <div className="w-full bg-ink text-paper min-h-screen">
      {/* ─── 1. MISSION AS H1 (§8.9) ─── */}
      <section className="pt-12 sm:pt-16 pb-12 px-5 sm:px-8 lg:px-12 max-w-container mx-auto text-left">
        <h1 className="font-sans font-medium text-[clamp(34px,4.8vw,60px)] tracking-[-0.03em] text-paper max-w-4xl leading-[1.08] mb-6">
          Building physical autonomous platforms and engineering the next generation of robotics researchers.
        </h1>
        <p className="font-sans text-[clamp(17px,1.4vw,20px)] text-text-2 max-w-2xl leading-relaxed">
          Aprameya is the autonomous systems and robotics technical laboratory at KL University, operating out of room R609e in the central R&D block.
        </p>
      </section>

      {/* ─── 2. STORY (§8.9) ─── */}
      <section className="py-16 px-5 sm:px-8 lg:px-12 max-w-container mx-auto border-t border-hairline text-left">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <h2 className="font-sans font-medium text-[clamp(24px,3vw,36px)] tracking-[-0.02em] text-paper leading-snug">
              From academic curiosity to physical autonomy on Indian roads.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 font-sans text-[15px] text-text-2 leading-relaxed">
            <p>
              Founded in 2019, our lab began as an experiment: what if undergraduate engineers weren't confined to virtual simulators, but given the sensors, compute boards, and chassis to build real autonomous systems?
            </p>
            <p>
              Today, Aprameya deploys ROS 2 compute stacks, writes custom LiDAR-camera calibration routines, and benchmarks visual odometry pipelines on custom embedded hardware.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 3. STATS ROW (§8.9) ─── */}
      <section className="py-12 border-y border-hairline bg-surface-1/30">
        <div className="max-w-container mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            {STATS.map((s, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="font-mono text-[clamp(28px,3.6vw,48px)] font-light leading-none text-paper tabular-nums mb-1">
                  <NumberTicker value={s.value} />
                </div>
                <div className="font-sans text-[13px] text-mute">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. VALUES (§8.9) ─── */}
      <section className="py-16 sm:py-24 px-5 sm:px-8 lg:px-12 max-w-container mx-auto text-left">
        <div className="flex items-baseline justify-between border-b border-hairline pb-4 mb-10">
          <h2 className="font-sans font-medium text-[clamp(24px,3vw,36px)] tracking-[-0.02em] text-paper">
            Laboratory values
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="flex flex-col items-start">
                <div className="w-10 h-10 rounded-[var(--r-2)] border border-hairline bg-surface-2 flex items-center justify-center text-signal-text mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-medium text-[20px] text-paper mb-2">
                  {val.title}
                </h3>
                <p className="font-sans text-[14px] text-text-2 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 5. TIMELINE (§8.9) ─── */}
      <section className="py-16 sm:py-24 border-t border-hairline px-5 sm:px-8 lg:px-12 max-w-container mx-auto text-left">
        <div className="flex items-baseline justify-between border-b border-hairline pb-4 mb-10">
          <h2 className="font-sans font-medium text-[clamp(24px,3vw,36px)] tracking-[-0.02em] text-paper">
            Milestones
          </h2>
          <span className="font-mono text-[13px] text-mute">2019 — 2026</span>
        </div>

        <div className="divide-y divide-hairline">
          {TIMELINE.map((item, idx) => (
            <div key={idx} className="py-6 grid md:grid-cols-12 gap-4 items-baseline">
              <div className="md:col-span-3 font-mono text-[18px] text-mute tabular-nums">
                {item.year}
              </div>
              <div className="md:col-span-9">
                <h3 className="font-sans font-medium text-[18px] text-paper mb-1">
                  {item.title}
                </h3>
                <p className="font-sans text-[14px] text-text-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. ACHIEVEMENTS (§8.9) ─── */}
      <section className="py-16 border-t border-hairline px-5 sm:px-8 lg:px-12 max-w-container mx-auto text-left">
        <div className="flex items-baseline justify-between border-b border-hairline pb-4 mb-8">
          <h2 className="font-sans font-medium text-[clamp(24px,3vw,36px)] tracking-[-0.02em] text-paper">
            Key recognitions
          </h2>
        </div>

        <div className="divide-y divide-hairline">
          {ACHIEVEMENTS.map((ach, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-mono text-[13px] text-mute tabular-nums shrink-0">
                  {ach.year}
                </span>
                <span className="font-sans text-[15px] text-paper truncate">
                  {ach.title}
                </span>
              </div>
              <StatusBadge status={ach.badge} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. CONTACT & CTA (§8.9) ─── */}
      <section className="py-16 sm:py-24 border-t border-hairline bg-surface-1/40 px-5 sm:px-8 lg:px-12 max-w-container mx-auto text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h3 className="font-sans font-medium text-[24px] text-paper mb-2">
              Visit our lab or collaborate
            </h3>
            <p className="font-sans text-[14px] text-text-2 max-w-lg leading-relaxed">
              Laboratory R609e, R&D Block, KL University, Vaddeswaram, Andhra Pradesh. Open to prospective researchers and academic sponsors.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/recruitment">
              <Button variant="primary" size="lg">
                See open roles
              </Button>
            </Link>
            <a href="mailto:aprameya.techclub@kluniversity.in">
              <Button variant="secondary" size="lg">
                Email coordinators
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
