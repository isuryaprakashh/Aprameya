import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight, ChevronDown, CheckCircle2 } from 'lucide-react';
import { RecruitmentSettings } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import ChamferedButton from '@/components/ui/ChamferedButton';

const DOMAIN_ROLES = [
  {
    domain: 'Autonomous Systems & Perception',
    track: 'Technical',
    desc: 'ROS 2 nodes, SLAM localization, LiDAR-camera sensor fusion, and path planning.',
    slots: 'Open',
  },
  {
    domain: 'Embedded Systems & Hardware',
    track: 'Technical',
    desc: 'PCB layout, microcontrollers, drive-by-wire interfacing, and power management.',
    slots: 'Open',
  },
  {
    domain: 'Unmanned Aerial Systems (Drones)',
    track: 'Technical',
    desc: 'PX4 autopilot, aerial telemetry, companion computer vision, and flight safety.',
    slots: 'Open',
  },
  {
    domain: 'Full-Stack & Cloud Infrastructure',
    track: 'Technical',
    desc: 'Web portal architecture, edge telemetry sync, database pipelines, and devops.',
    slots: 'Open',
  },
  {
    domain: 'Operations & Event Logistics',
    track: 'Operations',
    desc: 'National competition coordination, lab logistics, workshop hosting, and scheduling.',
    slots: 'Open',
  },
  {
    domain: 'Design & Visual Documentation',
    track: 'Operations',
    desc: 'Technical diagrams, brand systems, UI design, cinematography, and press articles.',
    slots: 'Open',
  },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Apply', date: 'Online Form', desc: 'Submit profile & domain preferences.' },
  { step: '02', title: 'Screening', date: 'Review', desc: 'Background & GitHub evaluation.' },
  { step: '03', title: 'Task', date: 'Practical', desc: 'Hands-on domain challenge.' },
  { step: '04', title: 'Interview', date: 'Technical', desc: 'Discussion with team leads.' },
  { step: '05', title: 'Result', date: 'Onboard', desc: 'Lab induction into R609e.' },
];

const FAQS = [
  {
    q: 'Who is eligible to apply?',
    a: 'Any undergraduate or postgraduate student at KL University with curiosity and dedication to robotics, embedded engineering, computer vision, web technologies, or operations.',
  },
  {
    q: 'Do I need prior robotics experience before joining?',
    a: 'No. Foundational programming knowledge or hardware curiosity is expected, but the club provides hands-on mentorship, workshops, and lab compute to help you learn.',
  },
  {
    q: 'What is the time commitment expected from members?',
    a: 'Active members spend approximately 6–10 hours per week working on project builds, attending lab meetups in R609e, and preparing for competitions.',
  },
  {
    q: 'Can I apply for multiple domains?',
    a: 'Yes, you can indicate primary and secondary interest areas in the application form.',
  },
];

export default function Recruitment() {
  const { data: settings } = useQuery<RecruitmentSettings>({
    queryKey: ['/api/recruitment/settings'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/recruitment/settings`);
      return res.json();
    },
  });

  const isOpen = settings?.isOpen ?? true;
  const deadline = settings?.deadline || '30 NOV 2026';
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="w-full bg-bg min-h-screen text-text">
      {/* ─── 1. PAGE HEADER (Section 5.5) ─── */}
      <section className="pt-24 pb-12 px-6 md:px-8 max-w-[1200px] mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 mb-2">
          04 — RECRUITMENT
        </p>
        <h1 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl tracking-tight text-text mb-3">
          Join the engineering laboratory.
        </h1>
        <p className="text-base text-text-2 max-w-xl leading-relaxed mb-6">
          We are recruiting undergraduate engineers, designers, and operations leads across KL University for active laboratory squads.
        </p>

        {/* Status badge + deadline in mono */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <StatusBadge status={isOpen ? 'Open' : 'Closed'} label={isOpen ? 'Applications Open' : 'Applications Closed'} />
          <span className="text-text-3">DEADLINE: {deadline}</span>
          <span className="text-text-3 hidden sm:inline">·</span>
          <span className="text-text-3">WORKSPACE: R609e R&D BLOCK</span>
        </div>
      </section>

      {/* ─── 2. ROLES / DOMAINS LIST (Dividers, no boxes) ─── */}
      <section className="py-12 px-6 md:px-8 max-w-[1200px] mx-auto border-t border-border">
        <div className="mb-8">
          <h2 className="font-display font-medium text-xl sm:text-2xl tracking-tight text-text mb-1">
            Open domains & tracks.
          </h2>
          <p className="text-sm text-text-2">
            Select the focus domain that matches your skillset or engineering ambitions.
          </p>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {DOMAIN_ROLES.map((item, idx) => (
            <div
              key={idx}
              className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface/40 px-3 -mx-3 transition-colors duration-fast"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-5 px-2 rounded-full border border-border text-[10px] font-mono uppercase text-text-3">
                    {item.track}
                  </span>
                  <h3 className="font-display font-medium text-base text-text tracking-tight">
                    {item.domain}
                  </h3>
                </div>
                <p className="text-xs text-text-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-4">
                <span className="font-mono text-xs text-text-3">{item.slots}</span>
                {isOpen && (
                  <Link href="/recruitment/apply">
                    <span className="text-xs font-body font-medium text-text hover:text-red-text transition-colors flex items-center gap-1 cursor-pointer">
                      Apply <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. PROCESS: HORIZONTAL STEPPER (Section 4.9 & 5.5) ─── */}
      <section className="py-12 px-6 md:px-8 max-w-[1200px] mx-auto border-t border-border">
        <div className="mb-8">
          <h2 className="font-display font-medium text-xl sm:text-2xl tracking-tight text-text mb-1">
            Selection process.
          </h2>
          <p className="text-sm text-text-2">
            A transparent 5-stage pipeline designed to evaluate practical problem-solving.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {PROCESS_STEPS.map((s, idx) => (
            <div key={idx} className="flex flex-col items-start border-l border-border pl-4">
              <span className="font-mono text-xs text-text-3 mb-2">{s.step}</span>
              <h3 className="font-display font-medium text-base text-text mb-1">{s.title}</h3>
              <span className="font-mono text-[11px] text-text-3 mb-2">{s.date}</span>
              <p className="text-xs text-text-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. ELIGIBILITY & WHAT WE LOOK FOR (Two simple columns) ─── */}
      <section className="py-12 px-6 md:px-8 max-w-[1200px] mx-auto border-t border-border">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-display font-medium text-lg text-text tracking-tight mb-4">
              Eligibility
            </h3>
            <ul className="space-y-3 text-sm text-text-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-text-3 shrink-0 mt-0.5" />
                <span>Currently enrolled in any B.Tech, M.Tech, or BCA/MCA program at KL University.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-text-3 shrink-0 mt-0.5" />
                <span>Open to all academic branches (CSE, ECE, Mechanical, AI&DS, Biotech, etc.).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-text-3 shrink-0 mt-0.5" />
                <span>Availability to participate in weekly lab work in R609e R&D block.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-medium text-lg text-text tracking-tight mb-4">
              What we look for
            </h3>
            <ul className="space-y-3 text-sm text-text-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-text-3 shrink-0 mt-0.5" />
                <span>Intrinsic engineering curiosity and consistency over credentials.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-text-3 shrink-0 mt-0.5" />
                <span>Hands-on comfort with coding, Linux, microcontrollers, CAD, or design tools.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-text-3 shrink-0 mt-0.5" />
                <span>Willingness to debug complex failures and collaborate openly with peers.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── 5. APPLY ACTION BAR (Section 5.5) ─── */}
      <section className="py-12 px-6 md:px-8 max-w-[1200px] mx-auto border-t border-border">
        <div className="rounded-lg border border-border p-8 bg-surface flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-medium text-2xl text-text tracking-tight mb-1">
              Ready to submit your application?
            </h3>
            <p className="text-sm text-text-2">
              Direct submission via portal. Have your GitHub, project links, or portfolio ready.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {isOpen ? (
              <>
                <Link href="/recruitment/apply">
                  <ChamferedButton variant="primary" size="md">
                    Start application
                  </ChamferedButton>
                </Link>
                <Link href="/recruitment/status">
                  <ChamferedButton variant="secondary" size="md">
                    Track status
                  </ChamferedButton>
                </Link>
              </>
            ) : (
              <Link href="/recruitment/status">
                <ChamferedButton variant="secondary" size="md">
                  Check application status
                </ChamferedButton>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ─── 6. FAQ ACCORDION (Section 4.14) ─── */}
      <section className="py-12 px-6 md:px-8 max-w-[1200px] mx-auto border-t border-border">
        <div className="mb-8">
          <h2 className="font-display font-medium text-xl sm:text-2xl tracking-tight text-text mb-1">
            Frequently asked questions.
          </h2>
          <p className="text-sm text-text-2">
            Details regarding applications, tasks, and lab onboarding.
          </p>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-body text-base font-medium text-text hover:text-white transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-text-2 transition-transform duration-base ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="pt-3 text-sm text-text-2 leading-relaxed max-w-2xl animate-in fade-in duration-fast">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. CONTACT LINE ─── */}
      <section className="pb-24 pt-6 px-6 md:px-8 max-w-[1200px] mx-auto text-center">
        <p className="text-xs text-text-3 font-mono">
          HAVE QUESTIONS REGARDING INDUCTION? WRITE TO{' '}
          <a
            href="mailto:aprameya.techclub@kluniversity.in"
            className="text-text hover:underline"
          >
            APRAMEYA.TECHCLUB@KLUNIVERSITY.IN
          </a>
        </p>
      </section>
    </main>
  );
}
