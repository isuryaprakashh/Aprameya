import { Link } from 'wouter';
import { featuredItems, upcomingEvents } from '../lib/data';
import { motion, useInView, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ExternalLink, Award, ArrowRight, BookOpen, Cpu, Trophy, Sparkles } from 'lucide-react';
import ChamferedButton from '@/components/ui/ChamferedButton';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const STUDENT_PILLARS = [
  {
    tag: "RESEARCH & PUBLICATIONS",
    title: "Write Research Papers & Journals",
    desc: "From algorithmic formulation to simulation proofs and peer-reviewed conference submissions, we guide members to publish in IEEE and autonomy symposiums.",
    icon: BookOpen,
    badge: "Academic Writing"
  },
  {
    tag: "HARDWARE & SENSORS",
    title: "Build Real Autonomous Platforms",
    desc: "Hands-on engineering with drive-by-wire vehicles, LiDAR-camera sensor fusion, SLAM spatial localization, and ROS 2 compute stacks.",
    icon: Cpu,
    badge: "Hardware R&D"
  },
  {
    tag: "NATIONAL PODIUMS",
    title: "Win National Robotics Hackathons",
    desc: "Team Aprameya secured 3rd in India at IISc Bengaluru. We build under pressure, test rigorously, and compete on the national stage.",
    icon: Trophy,
    badge: "Competitions"
  },
  {
    tag: "MENTORSHIP & GROWTH",
    title: "Learn, Grow & Upskill Rapidly",
    desc: "Structured bootcamps in PyTorch, embedded Linux, NVIDIA Jetson edge inference, and collaborative GitHub workflows for every student.",
    icon: Sparkles,
    badge: "Engineering Track"
  }
];

const Home = () => {
  return (
    <main className="overflow-x-hidden w-full max-w-full bg-[var(--bg-body)]">

      {/* ─── HERO SECTION (DOCTOR DOOM SOVEREIGN LUXURY GREEN) ─── */}
      <section className="relative min-h-[90vh] flex items-center px-6 md:px-12 pt-32 pb-20 overflow-hidden">
        
        {/* Subtle Ambient Doom Glow at the top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#276738]/20 via-[#153c1f]/10 to-transparent blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">

          {/* Left: Typographic Stack */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Eyebrow badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-[#0C1710]/80 backdrop-blur-md text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-emerald-300 mb-6 shadow-sm shadow-emerald-950/40"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              KL University • Autonomous Systems & Robotics Lab
            </motion.div>

            {/* Headline with High-Contrast Typography Tension */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] tracking-tight text-[var(--text-primary)] leading-[1.02] mb-6"
            >
              <span className="font-serif italic font-normal text-[1.12em] text-[#94A3B8]">We are</span>{" "}
              <span className="font-display font-bold tracking-tight text-white">APRAMEYA</span>
              <br />
              <span className="font-serif italic font-normal text-[1.12em] text-[#94A3B8]">and we build</span>{" "}
              <span className="font-display font-bold tracking-tight text-emerald-400">autonomous systems.</span>
            </motion.h1>

            {/* Clear value statement */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-[var(--text-secondary)] font-sans max-w-xl leading-relaxed mb-8"
            >
              We empower student engineers to <span className="text-white font-medium">write research papers</span>, publish in <span className="text-white font-medium">tech journals</span>, build physical self-driving vehicles, compete in <span className="text-white font-medium">national hackathons</span>, and continuously <span className="text-white font-medium">learn, grow, and upskill</span>.
            </motion.p>

            {/* Action Group */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <Link href="/recruitment">
                <ChamferedButton variant="primary" size="lg">
                  Join Aprameya
                </ChamferedButton>
              </Link>

              <Link href="/projects">
                <ChamferedButton
                  variant="secondary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4 text-emerald-400" />}
                >
                  Explore Repositories
                </ChamferedButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Double-Bezel Framed Video with Doctor Doom Green Tone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            {/* Outer shell (Doppelrand / Double-Bezel) */}
            <div className="p-2 rounded-2xl border border-emerald-500/20 bg-[#0A120D] shadow-2xl shadow-[#0D2414]/50">
              {/* Inner core */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-black">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  src="/assets/hero-loop.mp4"
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-emerald-500/20 pointer-events-none" />
                
                {/* Floating caption pill */}
                <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-lg bg-black/85 backdrop-blur-md border border-emerald-500/25 text-[11px] text-[#94A3B8] flex items-center justify-between">
                  <span>Physical Autonomous Vehicle</span>
                  <span className="font-mono text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">KL-AV-01</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ─── STATS BAR ─── */}
      <section className="border-y border-emerald-500/10 bg-[#08100B]/70">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { n: "2019", l: "Founded at KL University" },
            { n: "50+",  l: "Active Student Engineers" },
            { n: "3rd",  l: "National Rank at IISc" },
            { n: "100%", l: "Applied Hardware R&D" }
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-bold text-white tabular-nums font-display mb-1">
                {s.n === "50+" ? <CountUp value={s.n} /> : s.n}
              </div>
              <div className="text-[11px] text-emerald-400/80 font-sans font-medium uppercase tracking-[0.08em]">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ─── STUDENT EMPOWERMENT / HOW WE HELP YOU GROW (BENTO MATRIX) ─── */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto border-b border-emerald-500/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-emerald-400 mb-2">
              Member Growth & Acceleration
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              <span className="font-serif italic font-normal text-[1.1em] text-[#94A3B8]">How we help you</span>{" "}
              <span className="font-display">learn, build & publish.</span>
            </h2>
          </div>
          <p className="text-xs text-[#94A3B8] max-w-xs mt-4 md:mt-0 leading-relaxed">
            Aprameya is an incubator for undergraduate autonomy engineering, academic paper writing, and competitive robotics.
          </p>
        </div>

        {/* 4-Pillar Grid with Doctor Doom Green Borders & Dark Pine Surfaces */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STUDENT_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl border border-emerald-500/15 bg-[#0B130E] flex flex-col justify-between hover:border-emerald-400/40 hover:bg-[#0E1A13] transition-all duration-300 group shadow-lg shadow-black/20"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs text-emerald-400/70 font-semibold tracking-wider">
                      0{idx + 1}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-500/25 flex items-center justify-center text-emerald-300 group-hover:text-white transition-colors">
                      <Icon size={18} />
                    </div>
                  </div>

                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-emerald-400 mb-2 block">
                    {pillar.badge}
                  </span>

                  <h3 className="font-display font-bold text-lg text-white mb-3 leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* ─── HACKATHON & BENCHMARK FEATURE ─── */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-emerald-400 mb-2">
            Verified National Honors
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            <span className="font-serif italic font-normal text-[1.1em] text-[#94A3B8]">National 3rd at</span>{" "}
            <span className="font-display">IISc Bengaluru</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-0 rounded-2xl border border-emerald-500/20 overflow-hidden bg-[#0A120D] shadow-2xl shadow-black/40">
          {/* Photo */}
          <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-[440px] overflow-hidden group">
            <img
              src="/assets/UVH.jpg"
              alt="Aprameya team receiving national awards at IISc Bengaluru"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060A07] via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-black/85 backdrop-blur-md border border-emerald-500/20 text-xs text-[#94A3B8]">
              Team Aprameya receiving national honors at the Urban Vision Autonomous Hackathon, IISc Bengaluru.
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-emerald-500/15">
            <div>
              <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-sans font-medium text-emerald-300">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Urban Vision Autonomous Challenge
              </div>

              <h3 className="font-display text-xl font-bold text-white mb-3">
                High-Density Autonomous Navigation
              </h3>

              <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                Real-time computer vision, lane tracking, dynamic obstacle avoidance, and path trajectory planning built for complex Indian traffic conditions.
              </p>

              <div className="space-y-4 text-xs border-t border-emerald-500/10 pt-5">
                <div>
                  <p className="text-emerald-400/80 mb-1 text-[10px] font-sans font-semibold uppercase tracking-[0.1em]">Core Student Cohort</p>
                  <p className="text-white leading-relaxed text-sm">
                    S. Sai Revanth, A. Venkata Praveen, A. Komal Sai Raj, K. Yashwanth Chowdary
                  </p>
                </div>
                <div>
                  <p className="text-emerald-400/80 mb-1 text-[10px] font-sans font-semibold uppercase tracking-[0.1em]">Faculty Mentorship</p>
                  <p className="text-white text-sm">
                    Prof. Hari Kiran Vege, Mr. Srikanth Annamareddy
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://www.apnnews.com/klef-team-aprameya-among-top-winners-in-indias-premier-ai-hackathon/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 self-start"
            >
              <ChamferedButton
                variant="secondary"
                size="sm"
                rightIcon={<ExternalLink className="w-3.5 h-3.5 text-emerald-400" />}
              >
                Read Press Coverage
              </ChamferedButton>
            </a>
          </div>
        </div>
      </section>


      {/* ─── R&D INITIATIVES ─── */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-emerald-500/10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-emerald-400 mb-2">
              Engineering Repositories
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              <span className="font-serif italic font-normal text-[1.1em] text-[#94A3B8]">Active</span>{" "}
              <span className="font-display">R&D Projects</span>
            </h2>
          </div>
          <Link href="/projects">
            <span className="text-xs font-sans font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer">
              All projects <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredItems.map((item) => (
            <Link key={item.id} href={item.link} className="block h-full">
              <div className="group h-full cursor-pointer">
                <div className="h-full flex flex-col border border-emerald-500/15 bg-[#0B130E] rounded-xl overflow-hidden hover:border-emerald-400/40 hover:bg-[#0E1A13] transition-all duration-300 shadow-lg shadow-black/20">
                  <div className="relative h-48 overflow-hidden bg-black">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-sm rounded border border-emerald-500/20 text-emerald-300 text-[10px] font-sans font-medium uppercase tracking-wider">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-white text-base mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-emerald-500/10 flex items-center justify-between text-xs text-[#64748B] group-hover:text-emerald-300 transition-colors">
                      <span className="font-sans font-medium">Explore stack</span>
                      <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* ─── WORKSHOPS & EXPLORE ─── */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-emerald-500/10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Upcoming */}
          <div>
            <p className="text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-emerald-400 mb-2">
              Sessions & Bootcamps
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-8">
              <span className="font-serif italic font-normal text-[1.1em] text-[#94A3B8]">Upcoming</span>{" "}
              <span className="font-display">Workshops</span>
            </h2>

            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <Link key={event.id} href="/events" className="block">
                  <div className="p-4 rounded-xl border border-emerald-500/15 bg-[#0B130E] flex items-center gap-4 hover:border-emerald-400/35 transition-colors group">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-emerald-950/40 border border-emerald-500/25 shrink-0">
                      <span className="text-[9px] uppercase font-semibold text-emerald-400/80">{event.month}</span>
                      <span className="text-lg font-bold text-white font-display">{event.day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-sm text-white truncate">{event.title}</h3>
                      <p className="text-xs text-[#64748B] mt-0.5 truncate">{event.location}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-400/60 group-hover:text-emerald-300 transition-colors shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-emerald-400 mb-2">
              Gateway
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-8">
              <span className="font-serif italic font-normal text-[1.1em] text-[#94A3B8]">Explore</span>{" "}
              <span className="font-display">Aprameya</span>
            </h2>

            <div className="space-y-3">
              {[
                { label: "Open Recruitment", desc: "Join Technical or Operations wings for this cycle", href: "/recruitment" },
                { label: "Technical Dispatches", desc: "Read research paper drafts and hardware field notes", href: "/blogs" },
                { label: "About Innovation Lab", desc: "Our laboratory history, faculty mentors, and roadmap", href: "/about" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block">
                  <div className="p-4 rounded-xl border border-emerald-500/15 bg-[#0B130E] flex items-center justify-between hover:border-emerald-400/35 transition-colors group">
                    <div>
                      <h3 className="font-display font-semibold text-sm text-white">{link.label}</h3>
                      <p className="text-xs text-[#64748B] mt-0.5">{link.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-400/60 group-hover:text-emerald-300 transition-colors shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

const CountUp = ({ value }: { value: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const num = parseInt(value.replace(/\D/g, ''));
      const suffix = value.replace(/\d/g, '');
      const controls = animate(0, num, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (v) => {
          if (ref.current) ref.current.textContent = Math.floor(v) + suffix;
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return <span ref={ref} className="tabular-nums">0{value.replace(/\d/g, '')}</span>;
};

export default Home;
