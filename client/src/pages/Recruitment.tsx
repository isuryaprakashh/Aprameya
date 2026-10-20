import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight, ChevronDown, Check, Clock, ShieldCheck, Cpu } from 'lucide-react';
import { RecruitmentSettings } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/badge';

const DOMAIN_ROLES = [
  {
    domain: 'Autonomous Systems & Perception',
    track: 'Technical',
    desc: 'ROS 2 nodes, SLAM localization, LiDAR-camera sensor fusion, and path planning.',
  },
  {
    domain: 'Embedded Systems & Hardware',
    track: 'Technical',
    desc: 'PCB layout, microcontrollers, CAN bus interfacing, and power management.',
  },
  {
    domain: 'Unmanned Aerial Systems (Drones)',
    track: 'Technical',
    desc: 'PX4 autopilot, aerial telemetry, companion computer vision, and flight safety.',
  },
  {
    domain: 'Full-Stack & Cloud Infrastructure',
    track: 'Technical',
    desc: 'Web portal architecture, edge telemetry sync, database pipelines, and devops.',
  },
  {
    domain: 'Operations & Event Logistics',
    track: 'Operations',
    desc: 'National competition coordination, lab logistics, workshop hosting, and scheduling.',
  },
  {
    domain: 'Design & Visual Documentation',
    track: 'Operations',
    desc: 'Technical diagrams, brand systems, UI design, cinematography, and press articles.',
  },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Apply online', desc: 'Submit profile, domain preferences, and past projects.' },
  { step: '02', title: 'Technical challenge', desc: 'Practical hands-on task relevant to your chosen domain.' },
  { step: '03', title: 'Lead interview', desc: 'In-person technical discussion with domain heads.' },
  { step: '04', title: 'Lab induction', desc: 'Access badge granted to laboratory R609e testbeds.' },
];

const FAQS = [
  {
    q: 'Who is eligible to apply?',
    a: 'Any undergraduate or postgraduate student enrolled at KL University with dedication to robotics, embedded engineering, computer vision, web technologies, or operations.',
  },
  {
    q: 'Do I need prior robotics experience before joining?',
    a: 'No. Foundational curiosity and willingness to build are what matter. The club provides hands-on mentorship, workshops, and access to lab compute.',
  },
  {
    q: 'What is the expected weekly time commitment?',
    a: 'Active members spend approximately 6–10 hours per week working on project builds, attending lab meetups in R609e, and preparing for competitions.',
  },
  {
    q: 'Can I apply for multiple domains?',
    a: 'Yes, you can specify primary and secondary tracks on the application form.',
  },
];

export const Recruitment: React.FC = () => {
  const { data: settings } = useQuery<RecruitmentSettings>({
    queryKey: ['/api/recruitment/settings'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/recruitment/settings`);
      return res.json();
    },
  });

  const isOpen = settings?.isOpen ?? true;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="w-full bg-ink text-paper min-h-screen">
      {/* ─── 1. PAGE HERO (§7.8.2 & §8.8) ─── */}
      <section className="pt-12 sm:pt-16 pb-8 px-5 sm:px-8 lg:px-12 max-w-container mx-auto text-left">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <StatusBadge status={isOpen ? "Live" : "Closed"} isLive={isOpen} />
          {settings?.deadline && (
            <span className="font-mono text-[13px] text-mute tabular-nums">
              Deadline: {settings.deadline}
            </span>
          )}
        </div>

        <h1 className="font-sans font-medium text-[clamp(34px,4.8vw,60px)] tracking-[-0.03em] leading-tight text-paper mb-3">
          Recruitment
        </h1>
        <p className="font-sans text-[clamp(17px,1.4vw,20px)] text-text-2 max-w-2xl leading-relaxed mb-8">
          Join active engineering squads building autonomous cars, aerial telemetry drones, and perception pipelines in laboratory R609e.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/recruitment/apply">
            <Button variant="primary" size="lg">
              Start application
            </Button>
          </Link>
          <Link href="/recruitment/status">
            <Button variant="secondary" size="lg">
              Check status
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── 2. DOMAIN TRACKS ─── */}
      <section className="py-16 border-t border-hairline px-5 sm:px-8 lg:px-12 max-w-container mx-auto text-left">
        <div className="flex items-baseline justify-between border-b border-hairline pb-4 mb-8">
          <h2 className="font-sans font-medium text-[clamp(24px,3vw,36px)] tracking-[-0.02em] text-paper">
            Open domains
          </h2>
          <span className="font-mono text-[13px] text-mute">06 tracks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOMAIN_ROLES.map((role, idx) => (
            <div
              key={idx}
              className="p-6 rounded-[var(--r-3)] border border-hairline bg-surface-1 flex flex-col justify-between hover:border-hairline-2 transition-colors duration-fast"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Tag size="dense">{role.track}</Tag>
                </div>
                <h3 className="font-sans font-medium text-[18px] text-paper tracking-[-0.01em] mb-2">
                  {role.domain}
                </h3>
                <p className="font-sans text-[13px] text-text-2 leading-relaxed">
                  {role.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-hairline">
                <Link href="/recruitment/apply" className="w-full block">
                  <Button variant="secondary" size="sm" className="w-full">
                    Apply for this domain
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. PROCESS STEPPER ─── */}
      <section className="py-16 border-t border-hairline px-5 sm:px-8 lg:px-12 max-w-container mx-auto text-left">
        <div className="flex items-baseline justify-between border-b border-hairline pb-4 mb-10">
          <h2 className="font-sans font-medium text-[clamp(24px,3vw,36px)] tracking-[-0.02em] text-paper">
            Selection process
          </h2>
          <span className="font-mono text-[13px] text-mute">4 stages</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-[var(--r-3)] border border-hairline bg-surface-1 flex flex-col justify-between"
            >
              <div>
                <div className="font-mono text-[22px] font-light text-mute mb-3">
                  {step.step}
                </div>
                <h3 className="font-sans font-medium text-[18px] text-paper mb-2">
                  {step.title}
                </h3>
                <p className="font-sans text-[14px] text-text-2 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. WHAT WE LOOK FOR ─── */}
      <section className="py-16 border-t border-hairline px-5 sm:px-8 lg:px-12 max-w-container mx-auto text-left">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="p-8 rounded-[var(--r-3)] border border-hairline bg-surface-1/40">
            <h3 className="font-sans font-medium text-[22px] text-paper mb-3">
              Engineering mindset
            </h3>
            <p className="font-sans text-[14px] text-text-2 leading-relaxed mb-4">
              We look for students who tinker beyond assignments. Whether you run Linux on your laptop, design circuits in KiCAD, or benchmark vision models on Colab, we value hands-on curiosity.
            </p>
            <ul className="space-y-2 text-[13px] text-mute font-sans">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-ok" />
                Commitment to attend evening laboratory sessions in R609e
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-ok" />
                Version control proficiency with Git & GitHub
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-[var(--r-3)] border border-hairline bg-surface-1/40">
            <h3 className="font-sans font-medium text-[22px] text-paper mb-3">
              Laboratory access
            </h3>
            <p className="font-sans text-[14px] text-text-2 leading-relaxed mb-4">
              Inducted members gain physical workspace access, NVIDIA Jetson edge compute, battery testbenches, and travel funding for national competitions.
            </p>
            <ul className="space-y-2 text-[13px] text-mute font-sans">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-ok" />
                Direct mentorship from senior students & faculty advisors
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-ok" />
                Co-authorship on peer-reviewed research publications
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── 5. FAQ ACCORDION ─── */}
      <section className="py-16 border-t border-hairline px-5 sm:px-8 lg:px-12 max-w-container mx-auto text-left">
        <div className="flex items-baseline justify-between border-b border-hairline pb-4 mb-8">
          <h2 className="font-sans font-medium text-[clamp(24px,3vw,36px)] tracking-[-0.02em] text-paper">
            Frequently asked questions
          </h2>
        </div>

        <div className="divide-y divide-hairline">
          {FAQS.map((faq, idx) => {
            const isOpenFaq = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpenFaq ? null : idx)}
                  className="w-full flex items-center justify-between text-left py-2 font-sans font-medium text-[16px] text-paper cursor-pointer select-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-mute transition-transform duration-fast ${
                      isOpenFaq ? 'rotate-180 text-paper' : ''
                    }`}
                  />
                </button>
                {isOpenFaq && (
                  <p className="font-sans text-[14px] text-text-2 leading-relaxed pt-2 pb-3 max-w-2xl">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Recruitment;
