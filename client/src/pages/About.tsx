import { Card, CardContent } from '@/components/ui/card';
import {
  Eye,
  Mail,
  MapPin,
  Users,
  Lightbulb,
  Heart,
  Globe,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import OperativeRoster from '../components/OperativeRoster';

const About = () => {
  return (
    <div className="fadeIn min-h-screen bg-[var(--bg-body)]">
      {/* Header Section */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-[var(--text-muted)] mb-3">
              Organization & Team
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl mb-4 tracking-tight text-[var(--text-primary)] font-display font-bold">
              <span className="text-[var(--text-secondary)] font-normal">About</span>{" "}
              <span>Aprameya</span>
            </h1>
            <p className="text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-10">
              Founded in 2019 at KL University. Dedicated to advancing autonomous robotics, sensor fusion, and embedded AI through student-led research and competitive engineering.
            </p>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              {[
                { n: "2019", l: "Founded" },
                { n: "50+", l: "Members" },
                { n: "3rd", l: "National (IISc)" },
                { n: "100%", l: "Hands-on R&D" },
              ].map((s, i) => (
                <div key={i} className="border border-white/[0.06] bg-[var(--card-bg)] p-5 rounded-xl">
                  <div className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1">{s.n}</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 md:px-12 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="morphic-metallic-card rounded-xl p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.15em] text-red-400 mb-2">
                    Our Mission
                  </p>
                  <h3 className="text-2xl md:text-3xl sm:text-4xl mb-4 text-white font-display font-bold">
                    <span className="text-[#94A3B8] font-normal">Applied</span>{" "}
                    <span>Autonomy Engineering</span>
                  </h3>

                  <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
                    Aprameya provides an intensive, project-driven laboratory environment where student engineers collaborate across computer science, electronics, and mechanical engineering. Members build real hardware prototypes and run simulation workloads in ROS 2, Gazebo, and PyTorch.
                  </p>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    We focus on core autonomy pillars: LiDAR-camera sensor fusion, SLAM spatial localization, embedded edge acceleration (NVIDIA Jetson, Coral TPU), and CAN-bus control systems.
                  </p>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-red-500/20 bg-black aspect-[4/3]">
                  <img
                    src="/assets/UVH.jpg"
                    alt="Aprameya Engineering Team at Hackathon"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-16 px-6 md:px-12 bg-black border-t border-red-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="h-full morphic-metallic-card rounded-xl p-8 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.15em] text-red-400 mb-2">
                    Long-Term Trajectory
                  </p>
                  <h3 className="text-2xl sm:text-3xl text-white mb-4 font-display font-bold">
                    <span className="text-[#94A3B8] font-normal">Our</span>{" "}
                    <span>Vision</span>
                  </h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                    To establish a premier student research and prototyping lab that incubates impactful autonomous mobility solutions, fosters rigorous research publications, and competes at national and international autonomy benchmarks.
                  </p>
                </div>
                <div className="flex items-center text-xs text-red-400 font-medium pt-4 border-t border-red-500/10">
                  <Globe className="w-4 h-4 mr-2" />
                  Rigorous Engineering & Autonomous Safety
                </div>
              </div>
            </motion.div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="h-full morphic-metallic-card rounded-xl p-8">
                <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.15em] text-red-400 mb-2">
                  Operating Principles
                </p>
                <h3 className="text-2xl sm:text-3xl text-white mb-6 font-display font-bold">
                  <span className="text-[#94A3B8] font-normal">Core</span>{" "}
                  <span>Values</span>
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Lightbulb,
                      title: "First-Principles Rigor",
                      description: "Validating algorithms with empirical hardware tests rather than speculation."
                    },
                    {
                      icon: Users,
                      title: "Cross-Disciplinary Teamwork",
                      description: "Integrating software, mechanical design, and embedded electronics seamlessly."
                    },
                    {
                      icon: Star,
                      title: "Open Knowledge Sharing",
                      description: "Conducting peer workshops, open-sourcing modules, and mentoring incoming batches."
                    }
                  ].map((value, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-950/60 border border-red-500/25 rounded-lg flex items-center justify-center mt-0.5 text-red-400">
                        <value.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white">{value.title}</h4>
                        <p className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Operative Roster */}
      <section className="py-16 px-6 md:px-12 bg-black border-t border-red-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.15em] text-red-400 mb-2">
              Leadership & Members
            </p>
            <h2 className="text-3xl md:text-4xl text-white tracking-tight font-display font-bold">
              <span className="text-[#94A3B8] font-normal">Lab Leads &</span>{" "}
              <span>Faculty Mentors</span>
            </h2>
          </div>
          <OperativeRoster />
        </div>
      </section>

      {/* Lab Location & Contact */}
      <section className="py-16 px-6 md:px-12 bg-black border-t border-red-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.15em] text-red-400 mb-2">
              Campus Presence
            </p>
            <h2 className="text-3xl text-white font-display font-bold">
              <span className="text-[#94A3B8] font-normal">Laboratory</span>{" "}
              <span>Headquarters</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <div className="border border-white/[0.06] bg-[var(--card-bg)] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-white/[0.03] border border-white/[0.06] rounded-lg flex items-center justify-center text-[var(--text-primary)]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[var(--text-primary)]">Official Contact</h3>
                  <p className="text-xs text-[var(--text-muted)]">Communications</p>
                </div>
              </div>
              <a
                href="mailto:aprameya.techclub@kluniversity.in"
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors break-all"
              >
                aprameya.techclub@kluniversity.in
              </a>
            </div>

            <div className="border border-white/10 bg-[#0A0A0A] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-[#141414] border border-white/10 rounded-lg flex items-center justify-center text-zinc-300">
                  <MapPin className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">Club Workspace</h3>
                  <p className="text-xs text-zinc-400">Campus Location</p>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                R&D Block 609E<br />
                KL Deemed to be University<br />
                Green Fields, Vaddeswaram, AP - 522302
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
