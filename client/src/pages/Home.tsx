import { Link } from 'wouter';
import { featuredItems, upcomingEvents } from '../lib/data';
import { motion, useInView, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Trophy, ExternalLink, Award, ArrowRight, Activity } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import HudFrame from '@/components/ui/HudFrame';
import ChamferedButton from '@/components/ui/ChamferedButton';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Home = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen w-full relative z-10 pb-32 pt-32 px-6 md:px-12 max-w-7xl mx-auto font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center items-start relative mb-24">
        <div className="hero-glow opacity-50 pointer-events-none"></div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="lg:col-span-7 relative z-10"
          >
            <motion.div variants={fadeInUp} className="mb-6 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] animate-pulse"></span>
              <span className="text-xs font-mono text-[hsl(var(--accent))] tracking-widest uppercase">
                KL University • Innovation Lab
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[var(--text-primary)] mb-6 leading-[0.95] max-w-5xl">
              APRAMEYA
              <span className="block font-sans text-2xl sm:text-4xl font-normal text-[var(--text-secondary)] mt-3 tracking-normal">
                Autonomous Systems & AI Laboratory
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed mb-10 border-l-2 border-[var(--border-color)] pl-5 font-mono text-sm">
              Undergraduate research, ROS 2 software pipelines, and hardware prototyping for next-generation autonomous mobility platforms.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
              <Link href="/recruitment">
                <ChamferedButton variant="primary" size="lg">
                  Join The Flight Crew
                </ChamferedButton>
              </Link>

              <Link href="/projects">
                <ChamferedButton variant="secondary" size="lg" rightIcon={<ArrowRight className="w-4 h-4 text-[hsl(var(--accent))]" />}>
                  Laboratory Stacks
                </ChamferedButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Logo / Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex lg:col-span-5 items-center justify-center relative z-10"
          >
            <HudFrame
              label="SYS_EMBLEM // VECTOR"
              status="ACTIVE"
              className="p-8 w-full max-w-sm"
            >
              <img
                src={theme === 'dark' ? '/logo-white.png' : '/logo-black.png'}
                alt="Aprameya Club Emblem"
                className="w-full max-w-xs xl:max-w-sm object-contain py-4"
              />
              <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
                <span>LAB EST. 2019</span>
                <span className="text-[hsl(var(--accent))] flex items-center gap-1.5">
                  <Activity className="w-3 h-3" /> ACTIVE NODE
                </span>
              </div>
            </HudFrame>
          </motion.div>
        </div>
      </section>

      {/* Verified Achievement Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInUp}
        className="mb-32"
      >
        <div className="flex items-end justify-between mb-8 border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] border border-[hsl(var(--accent))]/20">
              <Trophy className="w-3.5 h-3.5" />
            </span>
            <h2 className="font-display text-xl md:text-2xl font-bold text-[var(--text-primary)] tracking-tight">Verified Honors</h2>
          </div>
          <span className="font-mono text-xs text-[var(--text-secondary)] uppercase">National Benchmark</span>
        </div>

        <HudFrame label="HONOR_INDEX // 01" status="BENCHMARK_TOP_3" className="overflow-hidden p-0">
          <div className="grid md:grid-cols-12 gap-0">
            {/* Achievement Content */}
            <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center relative z-10">
              <div className="inline-flex items-center gap-2 mb-6 self-start px-3 py-1 rounded-full bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] text-xs font-mono font-bold tracking-wide">
                <Award className="w-3.5 h-3.5" />
                <span>NATIONAL 3RD PLACE • IISC BENGALURU</span>
              </div>

              <h3 className="font-display text-2xl md:text-4xl font-bold mb-4 text-[var(--text-primary)] leading-tight">
                Urban Vision Autonomous Hackathon
              </h3>

              <p className="text-[var(--text-secondary)] mb-6 text-sm leading-relaxed max-w-xl font-mono">
                The Aprameya team engineered real-time computer vision and trajectory-planning models for complex urban traffic density, securing national top honors among premier institutes across India.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8 border-t border-[var(--border-color)] pt-6">
                <div>
                  <h4 className="text-[11px] font-mono text-[var(--text-primary)] mb-3 uppercase tracking-wider opacity-60">Competing Team</h4>
                  <ul className="space-y-1.5 text-xs text-[var(--text-secondary)] font-mono">
                    <li>• Singavarapu Sai Revanth</li>
                    <li>• Akula Venkata Praveen</li>
                    <li>• Atmakuri Komal Sai Raj</li>
                    <li>• Kamsani Yashwanth Chowdary</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[11px] font-mono text-[var(--text-primary)] mb-3 uppercase tracking-wider opacity-60">Mentorship</h4>
                  <ul className="space-y-1.5 text-xs text-[var(--text-secondary)] font-mono">
                    <li>• Prof. Hari Kiran Vege</li>
                    <li>• Mr. Srikanth Annamareddy</li>
                  </ul>
                </div>
              </div>

              <a href="https://www.apnnews.com/klef-team-aprameya-among-top-winners-in-indias-premier-ai-hackathon/" target="_blank" rel="noopener noreferrer" className="self-start">
                <ChamferedButton variant="secondary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />}>
                  Press Coverage
                </ChamferedButton>
              </a>
            </div>

            {/* Achievement Image */}
            <div className="md:col-span-5 relative h-full min-h-[280px] border-t md:border-t-0 md:border-l border-[var(--border-color)] bg-black/40">
              <img
                src="/assets/UVH.jpg"
                alt="Urban Vision Hackathon Team at IISc Bengaluru"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </HudFrame>
      </motion.section>

      {/* Featured Section */}
      <section className="mb-32">
        <div className="flex items-end justify-between mb-8 border-b border-[var(--border-color)] pb-4">
          <h2 className="font-display text-xl md:text-2xl font-bold text-[var(--text-primary)] tracking-tight">Active R&D Initiatives</h2>
          <Link href="/projects">
            <span className="text-xs font-mono text-[var(--text-secondary)] cursor-pointer hover:text-[hsl(var(--accent))] transition-colors flex items-center gap-1.5">
              ALL PROJECTS <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
        >
          {featuredItems.map((item) => (
            <Link key={item.id} href={item.link} className="block h-full">
              <motion.div variants={fadeInUp} className="group h-full cursor-pointer">
                <div className="hud-card machined-panel h-full flex flex-col hover:border-[hsl(var(--accent))]/50 transition-colors duration-300 rounded-xl overflow-hidden">
                  <div className="relative h-48 overflow-hidden border-b border-[var(--border-color)] bg-black/40">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-md border border-white/10 text-white text-[10px] font-mono tracking-wider uppercase">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="font-display font-bold text-lg mb-2 text-[var(--text-primary)] group-hover:text-[hsl(var(--accent))] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex-grow line-clamp-3 font-mono">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* Events & Telemetry Grid */}
      <div className="grid lg:grid-cols-2 gap-12 mb-24">
        {/* Upcoming Events */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] animate-pulse"></div>
            <h2 className="font-display text-lg font-bold text-[var(--text-primary)] tracking-tight">Scheduled Workshops</h2>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="hud-card machined-panel p-5 flex items-center gap-5 rounded-xl group hover:border-[hsl(var(--accent))]/50 transition-colors">
                <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-[var(--bg-body)] border border-[var(--border-color)] shrink-0">
                  <span className="text-[10px] uppercase font-bold text-[hsl(var(--accent))] font-mono">{event.month}</span>
                  <span className="text-lg font-bold text-[var(--text-primary)] font-mono">{event.day}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-sm text-[var(--text-primary)] group-hover:text-[hsl(var(--accent))] transition-colors">{event.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">{event.location}</p>
                </div>
                <Link href="/events">
                  <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[hsl(var(--accent))] transition-colors" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* System Telemetry */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-4 h-4 text-[var(--text-secondary)]" />
            <h2 className="font-display text-lg font-bold text-[var(--text-primary)] tracking-tight">Laboratory Metrics</h2>
          </div>

          <div className="grid grid-cols-2 gap-px bg-[var(--border-color)] border border-[var(--border-color)] w-full rounded-2xl overflow-hidden">
            {[
              { label: "FOUNDED", value: "2019" },
              { label: "ACTIVE MEMBERS", value: "50+" },
              { label: "NATIONAL RANK", value: "3rd" },
              { label: "HANDS-ON R&D", value: "100%" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-[var(--card-bg)] p-6 hover:bg-[var(--bg-body)] transition-colors group">
                <div className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1 group-hover:text-[hsl(var(--accent))] transition-colors">
                  {stat.label === "FOUNDED" || stat.label === "NATIONAL RANK" || stat.label === "HANDS-ON R&D" ? (
                    stat.value
                  ) : (
                    <CountUp value={stat.value} />
                  )}
                </div>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const CountUp = ({ value }: { value: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const numericValue = parseInt(value.replace(/\D/g, ''));
      const suffix = value.replace(/\d/g, '');

      const controls = animate(0, numericValue, {
        duration: 2.0,
        ease: "easeOut",
        onUpdate: (latest) => {
          if (ref.current) {
            ref.current.textContent = Math.floor(latest).toString() + suffix;
          }
        },
      });

      return () => controls.stop();
    }
  }, [isInView, value]);

  return <span ref={ref} className="tabular-nums">0{value.replace(/\d/g, '')}</span>;
};

export default Home;
