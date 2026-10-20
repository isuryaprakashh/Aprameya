import { Link } from 'wouter';
import { Mail, MapPin, Lightbulb, Users, Trophy } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import ChamferedButton from '@/components/ui/ChamferedButton';

const STATS = [
  { value: "2019", label: "FOUNDED AT KL UNIVERSITY" },
  { value: "50+", label: "ACTIVE STUDENT ENGINEERS" },
  { value: "3RD", label: "NATIONAL BENCHMARK AT IISC" },
  { value: "100%", label: "PHYSICAL HARDWARE R&D" },
];

const VALUES = [
  {
    icon: Lightbulb,
    title: "First-principles rigor",
    desc: "Validating navigation algorithms through empirical hardware testing rather than synthetic assumptions.",
  },
  {
    icon: Users,
    title: "Cross-disciplinary collaboration",
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
    year: "2021",
    title: "Drive-by-Wire Platform",
    desc: "Engineered our first physical self-driving testbed with LiDAR odometry and CAN-bus control.",
  },
  {
    year: "2023",
    title: "IISc Bengaluru National Podium",
    desc: "Secured 3rd place in India at the Urban Vision Autonomous Hackathon against premier institutions.",
  },
  {
    year: "2026",
    title: "Research Publications & Expansion",
    desc: "Publishing peer-reviewed autonomy papers and expanding sensor-fusion research cohorts.",
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
  {
    year: "2025",
    title: "Drive-by-Wire Full Autonomy Demonstration",
    badge: "Verified",
    type: "accepted",
  },
];

export default function About() {
  return (
    <main className="w-full bg-bg min-h-screen text-text">
      {/* ─── 1. PAGE HEADER WITH MISSION AS H1 (Section 5.7) ─── */}
      <section className="pt-24 pb-12 px-6 md:px-8 max-w-[1200px] mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 mb-3">
          06 — ABOUT APRAMEYA
        </p>
        <h1 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl tracking-tight text-text max-w-4xl leading-[1.12] mb-6">
          Building physical autonomous platforms and engineering the next generation of robotics researchers.
        </h1>
        <p className="text-base text-text-2 max-w-2xl leading-relaxed">
          Aprameya is the premier autonomous systems and robotics research club at KL University, operating out of the R609e laboratory in the R&D block.
        </p>
      </section>

      {/* ─── 2. STORY: TWO-COLUMN (Section 5.7) ─── */}
      <section className="py-16 px-6 md:px-8 max-w-[1200px] mx-auto border-t border-border">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <h2 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-text leading-snug">
              From academic curiosity to physical autonomy on Indian roads.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 text-sm text-text-2 leading-relaxed font-body">
            <p>
              Founded in 2019, Aprameya started with a small group of undergraduate engineers eager to take robotics beyond theoretical simulations. By converting standard electric carts to full drive-by-wire capability, the team began addressing real-world perception and control challenges under Indian road dynamics.
            </p>
            <p>
              Today, the lab unites students across Computer Science, Electronics, and Mechanical Engineering. Our teams build multi-sensor fusion stacks, deploy neural networks on NVIDIA Jetson embedded hardware, and compete at premier national autonomy benchmarks.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 3. NUMBERS ROW: 4 STATS WITH 1PX VERTICAL LINES (Section 5.7) ─── */}
      <section className="w-full border-y border-border py-12 px-6 md:px-8 bg-surface/30">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-border">
          {STATS.map((s, idx) => (
            <div key={idx} className={idx !== 0 ? 'md:pl-8' : ''}>
              <div className="font-display font-medium text-3xl sm:text-4xl text-text tracking-tight mb-1">
                {s.value}
              </div>
              <div className="font-mono text-xs text-text-3 uppercase tracking-[0.06em]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. VALUES: OPEN LAYOUT, NO CARD BOXES (Section 5.7) ─── */}
      <section className="py-16 px-6 md:px-8 max-w-[1200px] mx-auto">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 mb-2">
            OPERATING PRINCIPLES
          </p>
          <h2 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-text">
            Core values.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="flex flex-col items-start">
                <div className="w-10 h-10 rounded-md border border-border bg-surface-2 flex items-center justify-center text-text mb-4">
                  <Icon className="w-5 h-5 text-text-2" />
                </div>
                <h3 className="font-display font-medium text-lg text-text tracking-tight mb-2">
                  {val.title}
                </h3>
                <p className="text-sm text-text-2 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 5. TIMELINE: VERTICAL 1PX LINE, MONO YEARS (Section 5.7) ─── */}
      <section className="py-16 px-6 md:px-8 max-w-[1200px] mx-auto border-t border-border">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 mb-2">
            MILESTONES
          </p>
          <h2 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-text">
            Laboratory history.
          </h2>
        </div>

        <div className="relative pl-6 border-l border-border space-y-10 max-w-2xl">
          {TIMELINE.map((item, idx) => (
            <div key={idx} className="relative">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-text-3 border-2 border-bg" />
              <span className="font-mono text-xs text-text-3 uppercase tracking-wider block mb-1">
                {item.year}
              </span>
              <h3 className="font-display font-medium text-base text-text mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-text-2 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. ACHIEVEMENTS LIST: ROWS WITH RESULT BADGE (Section 5.7) ─── */}
      <section className="py-16 px-6 md:px-8 max-w-[1200px] mx-auto border-t border-border">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 mb-2">
            HONORS
          </p>
          <h2 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-text">
            Verified achievements.
          </h2>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {ACHIEVEMENTS.map((ach, idx) => (
            <div
              key={idx}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-text-3">{ach.year}</span>
                <span className="font-body text-sm text-text font-medium">{ach.title}</span>
              </div>
              <StatusBadge status={ach.type} label={ach.badge} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. LOCATION & CONTACT BLOCK (Section 5.7) ─── */}
      <section id="contact" className="py-16 px-6 md:px-8 max-w-[1200px] mx-auto border-t border-border">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-lg border border-border p-6 bg-surface">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-4 h-4 text-text-3" />
              <h3 className="font-display font-medium text-base text-text">Direct Correspondence</h3>
            </div>
            <p className="text-sm text-text-2 mb-4 leading-relaxed">
              For research collaborations, sponsorships, or guest lectures, write to our faculty and student coordinators.
            </p>
            <a
              href="mailto:aprameya.techclub@kluniversity.in"
              className="font-mono text-xs text-red-text hover:underline"
            >
              aprameya.techclub@kluniversity.in
            </a>
          </div>

          <div className="rounded-lg border border-border p-6 bg-surface">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-4 h-4 text-text-3" />
              <h3 className="font-display font-medium text-base text-text">Workspace R609e</h3>
            </div>
            <p className="text-sm text-text-2 mb-4 leading-relaxed font-mono text-xs">
              Room 609e, R&D Block<br />
              Department of Computer Science & Engineering<br />
              KL Deemed to be University, Vaddeswaram, AP - 522302
            </p>
            <Link href="/recruitment">
              <ChamferedButton variant="secondary" size="sm">
                Apply to visit or join
              </ChamferedButton>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
