import { Link } from 'wouter';
import { featuredItems, upcomingEvents } from '../lib/data';
import { motion } from 'framer-motion';

import { ButtonViolet3D, ButtonDarkSpec } from '../components/ui/v6-buttons';
import { Trophy, ExternalLink, Award, ArrowRight } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
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
  return (
    <div className="min-h-screen w-full relative z-10 pb-32 pt-24 px-6 md:px-12 max-w-7xl mx-auto font-sans">

      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center items-start relative mb-24">
        <div className="hero-glow opacity-60"></div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative z-10"
        >
          <motion.div variants={fadeInUp} className="mb-6 flex items-center gap-3">
            <div className="h-[1px] w-8 bg-gradient-to-r from-[hsl(var(--accent))] to-transparent"></div>
            <span className="text-xs md:text-sm font-mono text-[hsl(var(--accent))] tracking-widest uppercase">
              Next Gen Autonomous Systems
            </span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tighter text-[var(--text-primary)] mb-8 leading-[0.9]">
            APRAMEYA
            <span className="block text-2xl md:text-4xl lg:text-5xl font-light text-[var(--text-secondary)] mt-2 tracking-normal">
              AI & Autonomous Club
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-[var(--text-secondary)] max-w-xl leading-relaxed mb-12 border-l-2 border-[var(--border-color)] pl-6">
            Pioneering the future of self-driving technology through research, innovation, and collaborative engineering.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
            <Link href="/projects">
              <ButtonViolet3D className="px-10 py-5 text-sm md:text-base font-medium">
                Explore Projects
              </ButtonViolet3D>
            </Link>

            <Link href="/signup">
              <ButtonDarkSpec className="px-10 py-5 text-sm md:text-base rounded-xl inline-flex items-center gap-2 group">
                <span className="relative z-10">Join the Team</span>
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 relative z-10" />
              </ButtonDarkSpec>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Recent Achievement Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="mb-32"
      >
        <div className="flex items-end justify-between mb-12 border-b border-[var(--border-color)] pb-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] border border-[hsl(var(--accent))]/20">
              <Trophy className="w-4 h-4" />
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight">Recent Honor</h2>
          </div>
          <span className="hidden md:block font-mono text-xs text-[var(--text-secondary)]">2025 HIGHLIGHT</span>
        </div>

        <div className="clean-card group relative grid md:grid-cols-12 gap-0 overflow-hidden border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[hsl(var(--accent))]/30 transition-all duration-500">
          {/* Achievement Content */}
          <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center relative z-10">
            <div className="inline-flex items-center gap-2 mb-8 self-start px-3 py-1 rounded-full bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] text-xs font-mono font-bold tracking-wide">
              <Award className="w-3 h-3" />
              <span>NATIONAL 3RD PLACE</span>
            </div>

            <h3 className="text-3xl md:text-5xl font-bold mb-6 text-[var(--text-primary)] leading-tight">
              Urban Vision Hackathon
            </h3>

            <p className="text-[var(--text-secondary)] mb-8 leading-relaxed max-w-xl">
              Secured excellence at IISc Bengaluru. Our team developed advanced AI models for urban mobility, competing against top institutions to solve real-world traffic challenges.
            </p>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h4 className="text-xs font-mono text-[var(--text-primary)] mb-4 uppercase tracking-wider opacity-60">Team</h4>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[hsl(var(--accent))] rounded-full" /> Singavarapu Sai Revanth</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[var(--border-color)] rounded-full" /> Akula Venkata Praveen</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[var(--border-color)] rounded-full" /> Atmakuri Komal Sai Raj</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[var(--border-color)] rounded-full" /> Kamsani Yashwanth Chowdary</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-mono text-[var(--text-primary)] mb-4 uppercase tracking-wider opacity-60">Mentors</h4>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>Prof. Hari Kiran Vege</li>
                  <li>Mr. Srikanth Annamareddy</li>
                </ul>
              </div>
            </div>

            <a href="https://www.apnnews.com/klef-team-aprameya-among-top-winners-in-indias-premier-ai-hackathon/" target="_blank" rel="noopener noreferrer">
              <ButtonViolet3D className="px-6 py-3 text-sm inline-flex items-center gap-2">
                Read Press Release <ExternalLink className="w-3 h-3" />
              </ButtonViolet3D>
            </a>
          </div>

          {/* Achievement Image */}
          <div className="md:col-span-5 relative h-full min-h-[300px] border-l border-[var(--border-color)]">
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-body)] via-transparent to-transparent z-10"></div>
            <img
              src="/assets/UVH.jpg"
              alt="UVH Challenge"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </motion.section>

      {/* Featured Section */}
      <section className="mb-32">
        <div className="flex items-end justify-between mb-12 border-b border-[var(--border-color)] pb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight">Key Initiatives</h2>
          <Link href="/projects">
            <span className="text-xs font-mono text-[var(--text-secondary)] cursor-pointer hover:text-[hsl(var(--accent))] transition-colors flex items-center gap-2">
              VIEW ALL <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {featuredItems.map((item) => (
            <Link key={item.id} href={item.link} className="block h-full">
              <motion.div variants={fadeInUp} className="group h-full cursor-pointer">
                <div className="clean-card h-full flex flex-col bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[hsl(var(--accent))] transition-colors duration-300">
                  <div className="relative h-56 overflow-hidden border-b border-[var(--border-color)]">
                    <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500" />
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-white text-[10px] font-mono tracking-widest uppercase">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-8 flex-grow flex flex-col">
                    <h3 className="font-semibold text-xl mb-3 text-[var(--text-primary)] group-hover:text-[hsl(var(--accent))] transition-colors w-fit">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-grow">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* Events & Grid Layout */}
      <div className="grid lg:grid-cols-2 gap-12 mb-32">
        {/* Upcoming Events */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))] animate-pulse"></div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Upcoming Events</h2>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="clean-card p-5 flex items-center gap-6 group hover:bg-[var(--btn-bg-hover)] transition-colors cursor-pointer border-transparent hover:border-[var(--border-color)]">
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] text-[var(--text-primary)] shrink-0">
                  <span className="text-[10px] uppercase font-bold text-[hsl(var(--accent))]">{event.month}</span>
                  <span className="text-xl font-bold">{event.day}</span>
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] group-hover:text-[hsl(var(--accent))] transition-colors">{event.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[var(--text-secondary)]"></span>
                    {event.location}
                  </p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-[hsl(var(--accent))]" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Grid */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)]"></div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">System Telemetry</h2>
          </div>

          <div className="grid grid-cols-2 gap-px bg-[var(--border-color)] border border-[var(--border-color)] w-full rounded-2xl overflow-hidden">
            {[
              { label: "Founded", value: "2019" },
              { label: "Members", value: "50+" },
              { label: "Active Projects", value: "15+" },
              { label: "Awards Won", value: "10+" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-[var(--card-bg)] p-8 hover:bg-[var(--bg-body)] transition-colors group">
                <div className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[hsl(var(--accent))] transition-colors font-mono">{stat.value}</div>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
};

export default Home;
