import { Link } from 'wouter';
import { projects, upcomingEvents, stats } from '../lib/data';
import { ArrowRight, Car, Cpu, Plane, Calendar, MapPin } from 'lucide-react';
import ChamferedButton from '@/components/ui/ChamferedButton';
import StatusBadge from '@/components/ui/StatusBadge';
import ProjectCard from '@/components/ProjectCard';

const DOMAINS = [
  {
    icon: Car,
    title: "Autonomous Vehicles",
    desc: "Drive-by-wire conversion, multi-LiDAR perception, SLAM mapping, and path-planning algorithms.",
  },
  {
    icon: Plane,
    title: "Unmanned Aerial Systems",
    desc: "Autonomous drone telemetry, visual-inertial odometry, PX4 flight controllers, and aerial inspection.",
  },
  {
    icon: Cpu,
    title: "Robotics & Edge AI",
    desc: "Embedded inference on NVIDIA Jetson, ROS 2 distributed nodes, sensor fusion, and real-time control.",
  },
];

const JOIN_STEPS = [
  {
    step: "01",
    title: "Apply Online",
    desc: "Submit your domain interests, GitHub handle, and academic background through the portal.",
  },
  {
    step: "02",
    title: "Technical Task & Interview",
    desc: "Solve a practical autonomy challenge or hardware design problem, followed by a member interview.",
  },
  {
    step: "03",
    title: "Laboratory Onboarding",
    desc: "Gain access to the R609e laboratory workspace, compute hardware, and active project codebases.",
  },
];

const Home = () => {
  return (
    <main className="w-full bg-bg min-h-screen text-text">
      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative min-h-[calc(100vh-64px)] flex flex-col justify-center px-6 md:px-8 py-16 lg:py-20 max-w-[1240px] mx-auto w-full">
        <div className="w-full grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left: Text Stack */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Pill Eyebrow with Red Dot */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border bg-surface-2/60 text-xs font-mono text-text-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-red shrink-0" />
              <span>KL University • Autonomous Systems & Robotics Club</span>
            </div>

            {/* Display Headline: 4-line impactful typography matching reference */}
            <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-[62px] xl:text-[68px] leading-[1.08] tracking-[-0.03em] mb-6">
              <span className="text-text-3 font-normal">We are </span>
              <span className="text-white font-bold">APRAMEYA</span>
              <br />
              <span className="text-text-3 font-normal">and we build</span>
              <br />
              <span className="text-red-text font-bold block">autonomous</span>
              <span className="text-red-text font-bold block">systems.</span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-text-2 font-body max-w-xl leading-relaxed mb-8">
              We develop physical self-driving platforms, publish peer-reviewed papers in academic journals, compete in national autonomy hackathons, and train undergraduate engineers.
            </p>

            {/* Buttons: Primary Red + Secondary Explore Repositories */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/recruitment">
                <ChamferedButton variant="primary" size="lg">
                  Join Aprameya
                </ChamferedButton>
              </Link>
              <Link href="/projects">
                <ChamferedButton
                  variant="secondary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4 text-text-2" />}
                >
                  Explore Repositories
                </ChamferedButton>
              </Link>
            </div>
          </div>

          {/* Right: Visual Card with Autonomous Vehicle Video */}
          <div className="lg:col-span-5 w-full">
            <div className="rounded-2xl border border-border bg-surface p-2 sm:p-2.5">
              <div className="relative aspect-[4/3] lg:aspect-[1.22/1] rounded-xl overflow-hidden bg-bg border border-border group">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  src="/assets/hero-loop.mp4"
                />
                {/* Clean video scrim caption */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-bg/95 via-bg/60 to-transparent flex items-center justify-between text-xs font-mono text-text-2 z-10">
                  <span>Physical Autonomous Vehicle</span>
                  <span className="text-red-text font-medium">KL-AV-01</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stats Strip at Bottom of Hero */}
        <div className="w-full border-t border-border pt-12 mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl text-text tracking-tight mb-1">
                {stat.value}
              </span>
              <span className="font-mono text-xs text-text-3 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 2. ACHIEVEMENTS / TRUSTED STRIP ─── */}
      <section className="w-full border-y border-border py-6 px-6 md:px-8">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-6 font-mono text-xs text-text-3 uppercase tracking-[0.06em]">
          <span>IISc Bengaluru Urban Vision</span>
          <span className="hidden sm:inline">·</span>
          <span>KL University R&D Laboratory R609e</span>
          <span className="hidden md:inline">·</span>
          <span>IEEE & Autonomy Conferences</span>
          <span className="hidden lg:inline">·</span>
          <span>ROS 2 & Edge AI Ecosystem</span>
        </div>
      </section>

      {/* ─── 3. WHAT WE BUILD (3 DOMAIN CARDS) ─── */}
      <section className="py-20 lg:py-24 px-6 md:px-8 max-w-[1200px] mx-auto">
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 mb-2">
            01 — DOMAINS
          </p>
          <h2 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-text">
            What we build.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {DOMAINS.map((domain, idx) => {
            const Icon = domain.icon;
            return (
              <div
                key={idx}
                className="rounded-lg border border-border p-6 bg-transparent transition-colors duration-fast hover:border-border-strong hover:bg-surface flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-md border border-border bg-surface-2 flex items-center justify-center text-text mb-6">
                    <Icon className="w-5 h-5 text-text-2" />
                  </div>
                  <h3 className="font-display font-medium text-lg text-text tracking-tight mb-2">
                    {domain.title}
                  </h3>
                  <p className="text-sm text-text-2 leading-relaxed">
                    {domain.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 4. FEATURED PROJECTS ─── */}
      <section className="py-20 lg:py-24 px-6 md:px-8 max-w-[1200px] mx-auto border-t border-border">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 mb-2">
              02 — PROJECTS
            </p>
            <h2 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-text">
              Featured projects.
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-sm text-text-2 hover:text-text transition-colors duration-fast flex items-center gap-1.5 font-body"
          >
            <span>View all projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewDetails={() => (window.location.href = `/projects`)}
            />
          ))}
        </div>
      </section>

      {/* ─── 5. UPCOMING EVENTS (HORIZONTAL ROWS) ─── */}
      <section className="py-20 lg:py-24 px-6 md:px-8 max-w-[1200px] mx-auto border-t border-border">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 mb-2">
              03 — EVENTS
            </p>
            <h2 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-text">
              Upcoming events.
            </h2>
          </div>
          <Link
            href="/events"
            className="text-sm text-text-2 hover:text-text transition-colors duration-fast flex items-center gap-1.5 font-body"
          >
            <span>View calendar</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 1px dividers between rows, not boxed cards */}
        <div className="divide-y divide-border border-y border-border">
          {upcomingEvents.map((event) => (
            <Link
              key={event.id}
              href={`/events`}
              className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-surface/50 px-3 -mx-3 transition-colors duration-fast"
            >
              {/* Left: Date block + Title + Location */}
              <div className="flex items-center gap-5">
                <div className="shrink-0 w-14 text-center py-1.5 rounded border border-border bg-surface-2 font-mono">
                  <div className="text-[10px] text-text-3 uppercase tracking-wider">
                    {event.month}
                  </div>
                  <div className="font-display font-medium text-xl text-text leading-none mt-0.5">
                    {event.day}
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-medium text-base text-text tracking-tight group-hover:text-text transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-text-3 font-mono">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Right: Status badge + Arrow */}
              <div className="flex items-center gap-4 sm:self-center">
                <StatusBadge status="Upcoming" />
                <ArrowRight className="w-4 h-4 text-text-3 group-hover:text-text group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 6. HOW TO JOIN (3-STEP HORIZONTAL ROW) ─── */}
      <section className="py-20 lg:py-24 px-6 md:px-8 max-w-[1200px] mx-auto border-t border-border">
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 mb-2">
            04 — RECRUITMENT
          </p>
          <h2 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-text">
            How to join.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {JOIN_STEPS.map((step, idx) => (
            <div key={idx} className="flex flex-col items-start">
              <span className="font-mono text-sm text-text-3 mb-3">
                {step.step}
              </span>
              <h3 className="font-display font-medium text-lg text-text tracking-tight mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-text-2 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <Link href="/recruitment">
          <ChamferedButton variant="primary" size="md">
            Apply for recruitment
          </ChamferedButton>
        </Link>
      </section>

      {/* ─── 7. FINAL CTA BAND ─── */}
      <section className="w-full border-t border-border py-24 px-6 md:px-8 text-center bg-transparent">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight text-text mb-4">
            Build the future with us.
          </h2>
          <p className="text-base text-text-2 leading-relaxed mb-8 max-w-md">
            Join the autonomous systems and robotics engineering laboratory at KL University.
          </p>
          <Link href="/recruitment">
            <ChamferedButton variant="primary" size="lg">
              Join Aprameya
            </ChamferedButton>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
