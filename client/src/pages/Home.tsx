import { Link } from 'wouter';
import { featuredItems, upcomingEvents } from '../lib/data';
import { motion, useInView, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ExternalLink, Award, ArrowRight, BookOpen, Cpu, Trophy, Sparkles } from 'lucide-react';
import ChamferedButton from '@/components/ui/ChamferedButton';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const STUDENT_PILLARS = [
  {
    tag: "RESEARCH & PUBLICATIONS",
    title: "Write Research Papers",
    desc: "Formulate algorithms, run simulations, and submit verified findings to IEEE and autonomy conferences.",
    icon: BookOpen,
    badge: "Academic Writing"
  },
  {
    tag: "HARDWARE & SENSORS",
    title: "Build Autonomous Platforms",
    desc: "Engineer drive-by-wire vehicles with LiDAR-camera fusion, SLAM localization, and ROS 2 compute stacks.",
    icon: Cpu,
    badge: "Hardware R&D"
  },
  {
    tag: "NATIONAL PODIUMS",
    title: "Compete at National Hackathons",
    desc: "Team Aprameya ranked 3rd in India at IISc Bengaluru, testing autonomy algorithms under tight benchmark constraints.",
    icon: Trophy,
    badge: "Competitions"
  },
  {
    tag: "MENTORSHIP & SKILLS",
    title: "Upskill in Robotics & AI",
    desc: "Hands-on training in PyTorch, embedded Linux, NVIDIA Jetson edge inference, and collaborative GitHub workflows.",
    icon: Sparkles,
    badge: "Engineering Track"
  }
];

const Home = () => {
  return (
    <main className="overflow-x-hidden w-full max-w-full bg-black min-h-screen">

      {/* ─── HERO SECTION (CLEAN SOLID BLACK & RED) ─── */}
      <section className="relative min-h-[85vh] flex items-center px-6 md:px-12 pt-32 pb-20">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Left: Typographic Stack */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Clean Solid Pill Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#111111] text-[11px] font-mono text-zinc-300 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              KL University • Autonomous Systems & Robotics Lab
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] tracking-tight text-white leading-[1.04] mb-6"
            >
              <span className="font-serif italic font-normal text-[1.1em] text-zinc-400">We are</span>{" "}
              <span className="font-display font-bold tracking-tight text-white">APRAMEYA</span>
              <br />
              <span className="font-serif italic font-normal text-[1.1em] text-zinc-400">and we build</span>{" "}
              <span className="font-display font-bold tracking-tight text-red-500">autonomous systems.</span>
            </motion.h1>

            {/* Clean Direct Value Statement (stop-slop) */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-zinc-400 font-sans max-w-xl leading-relaxed mb-8"
            >
              We develop physical self-driving platforms, publish peer-reviewed papers in academic journals, compete in national autonomy hackathons, and train undergraduate engineers.
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
                  rightIcon={<ArrowRight className="w-4 h-4 text-zinc-400" />}
                >
                  Explore Repositories
                </ChamferedButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Clean Solid Framed Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="p-2 rounded-xl border border-white/10 bg-[#0A0A0A]">
              <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-black">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  src="/assets/hero-loop.mp4"
                />
                <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10 pointer-events-none" />
                
                {/* Clean Caption Pill */}
                <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded bg-black/90 border border-white/10 text-[11px] text-zinc-300 flex items-center justify-between">
                  <span>Physical Autonomous Vehicle</span>
                  <span className="font-mono text-[10px] text-red-400 font-bold">KL-AV-01</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ─── STATS BAR (CLEAN SOLID BLACK) ─── */}
      <section className="border-y border-white/10 bg-black">
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
              <div className="text-[11px] text-zinc-400 font-sans font-semibold uppercase tracking-[0.08em]">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ─── STUDENT EMPOWERMENT / HOW WE HELP YOU GROW ─── */}
      <section className="py-20 md:py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.15em] text-red-400 mb-2">
              Member Growth & Acceleration
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              <span className="font-serif italic font-normal text-[1.1em] text-zinc-400">How we help you</span>{" "}
              <span className="font-display">learn, build & publish.</span>
            </h2>
          </div>
          <p className="text-xs text-zinc-400 max-w-xs mt-4 md:mt-0 leading-relaxed">
            Aprameya trains undergraduates in autonomy engineering, academic paper writing, and competitive robotics.
          </p>
        </div>

        {/* 4-Pillar Grid with Clean Solid Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STUDENT_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl border border-white/10 bg-[#0A0A0A] hover:bg-[#111111] hover:border-white/20 flex flex-col justify-between transition-colors duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs text-red-400 font-bold">
                      0{idx + 1}
                    </span>
                    <div className="w-8 h-8 rounded bg-[#161616] border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white">
                      <Icon size={16} />
                    </div>
                  </div>

                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-red-400 mb-2 block">
                    {pillar.badge}
                  </span>

                  <h3 className="font-display font-bold text-base text-white mb-2 leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* ─── HACKATHON & BENCHMARK FEATURE ─── */}
      <section className="py-20 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.15em] text-red-400 mb-2">
            Verified National Honors
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            <span className="font-serif italic font-normal text-[1.1em] text-zinc-400">National 3rd at</span>{" "}
            <span className="font-display">IISc Bengaluru</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-0 rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden">
          {/* Photo */}
          <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-[400px] overflow-hidden group">
            <img
              src="/assets/UVH.jpg"
              alt="Aprameya team receiving national awards at IISc Bengaluru"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded bg-black/90 border border-white/10 text-xs text-zinc-300">
              Team Aprameya receiving national honors at the Urban Vision Autonomous Hackathon, IISc Bengaluru.
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0A0A0A]">
            <div>
              <div className="inline-flex items-center gap-2 mb-5 px-2.5 py-1 rounded bg-[#161616] border border-white/10 text-[11px] font-sans text-zinc-300">
                <Award className="w-3.5 h-3.5 text-red-400" />
                Urban Vision Autonomous Challenge
              </div>

              <h3 className="font-display text-xl font-bold text-white mb-3">
                High-Density Autonomous Navigation
              </h3>

              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Real-time computer vision, lane tracking, dynamic obstacle avoidance, and path trajectory planning built for complex Indian traffic conditions.
              </p>

              <div className="space-y-3 text-xs border-t border-white/10 pt-5">
                <div>
                  <p className="text-zinc-500 font-sans font-semibold uppercase tracking-[0.08em] text-[10px] mb-0.5">Core Student Cohort</p>
                  <p className="text-white text-sm">
                    S. Sai Revanth, A. Venkata Praveen, A. Komal Sai Raj, K. Yashwanth Chowdary
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500 font-sans font-semibold uppercase tracking-[0.08em] text-[10px] mb-0.5">Faculty Mentorship</p>
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
                rightIcon={<ExternalLink className="w-3.5 h-3.5 text-zinc-400" />}
              >
                Read Press Coverage
              </ChamferedButton>
            </a>
          </div>
        </div>
      </section>


      {/* ─── R&D INITIATIVES ─── */}
      <section className="py-20 md:py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.15em] text-red-400 mb-2">
              Engineering Repositories
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              <span className="font-serif italic font-normal text-[1.1em] text-zinc-400">Active</span>{" "}
              <span className="font-display">R&D Projects</span>
            </h2>
          </div>
          <Link href="/projects">
            <span className="text-xs font-sans font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
              All projects <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredItems.map((item) => (
            <Link key={item.id} href={item.link} className="block h-full">
              <div className="group h-full cursor-pointer">
                <div className="h-full flex flex-col rounded-xl border border-white/10 bg-[#0A0A0A] hover:bg-[#111111] hover:border-white/20 overflow-hidden transition-colors duration-200">
                  <div className="relative h-48 overflow-hidden bg-black">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/90 rounded border border-white/10 text-white text-[10px] font-sans font-semibold uppercase tracking-wider">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-bold text-white text-base mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 group-hover:text-white transition-colors">
                      <span className="font-sans font-medium">Explore stack</span>
                      <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* ─── WORKSHOPS & EXPLORE ─── */}
      <section className="py-20 md:py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Upcoming */}
          <div>
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.15em] text-red-400 mb-2">
              Sessions & Bootcamps
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-8">
              <span className="font-serif italic font-normal text-[1.1em] text-zinc-400">Upcoming</span>{" "}
              <span className="font-display">Workshops</span>
            </h2>

            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <Link key={event.id} href="/events" className="block">
                  <div className="p-4 rounded-xl border border-white/10 bg-[#0A0A0A] hover:bg-[#111111] hover:border-white/20 flex items-center gap-4 group transition-colors">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-[#141414] border border-white/10 shrink-0">
                      <span className="text-[9px] uppercase font-bold text-red-400">{event.month}</span>
                      <span className="text-lg font-bold text-white font-display">{event.day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-sm text-white truncate">{event.title}</h3>
                      <p className="text-xs text-zinc-400 mt-0.5 truncate">{event.location}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.15em] text-red-400 mb-2">
              Gateway
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-8">
              <span className="font-serif italic font-normal text-[1.1em] text-zinc-400">Explore</span>{" "}
              <span className="font-display">Aprameya</span>
            </h2>

            <div className="space-y-3">
              {[
                { label: "Open Recruitment", desc: "Join Technical or Operations wings for this cycle", href: "/recruitment" },
                { label: "Technical Dispatches", desc: "Read research paper drafts and hardware field notes", href: "/blogs" },
                { label: "About Innovation Lab", desc: "Our laboratory history, faculty mentors, and roadmap", href: "/about" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block">
                  <div className="p-4 rounded-xl border border-white/10 bg-[#0A0A0A] hover:bg-[#111111] hover:border-white/20 flex items-center justify-between group transition-colors">
                    <div>
                      <h3 className="font-display font-bold text-sm text-white">{link.label}</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">{link.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
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
        duration: 1.2,
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
