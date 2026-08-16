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
import MagneticVectorField from '../components/backgrounds/MagneticVectorField';
import OperativeRoster from '../components/OperativeRoster';

const About = () => {
  return (
    <div className="fadeIn">
      {/* Header Section */}
      <section className="relative py-24 px-4 bg-[var(--bg-body)] border-b border-[var(--border-color)] overflow-hidden">
        <MagneticVectorField />
        <div className="absolute inset-0 dither-bg opacity-30 pointer-events-none"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center text-[var(--text-primary)]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] text-xs font-mono mb-6 uppercase tracking-wider">
              Innovation & Autonomous Systems Lab
            </div>

            <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 leading-[0.9] tracking-tight">
              ABOUT<br />APRAMEYA
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 font-mono">
              Founded in 2019 at KL University. Dedicated to advancing autonomous robotics, sensor fusion, and embedded AI through student-led research and competitive engineering.
            </p>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border-color)] border border-[var(--border-color)] max-w-4xl mx-auto rounded-xl overflow-hidden">
              <div className="bg-[var(--card-bg)] p-6">
                <div className="font-display text-3xl font-bold text-[var(--text-primary)] mb-1">2019</div>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-mono">Founded</div>
              </div>
              <div className="bg-[var(--card-bg)] p-6">
                <div className="font-display text-3xl font-bold text-[var(--text-primary)] mb-1">50+</div>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-mono">Members</div>
              </div>
              <div className="bg-[var(--card-bg)] p-6">
                <div className="font-display text-3xl font-bold text-[var(--text-primary)] mb-1">3rd</div>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-mono">National (IISc)</div>
              </div>
              <div className="bg-[var(--card-bg)] p-6">
                <div className="font-display text-3xl font-bold text-[var(--text-primary)] mb-1">100%</div>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-mono">Hands-on R&D</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-4 bg-[var(--bg-body)]">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-bold text-3xl md:text-5xl mb-6 text-[var(--text-primary)] tracking-tight">
              Our Core Mission
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl">
              <CardContent className="p-8 md:p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="w-14 h-14 bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 rounded-xl flex items-center justify-center mb-6">
                      <Lightbulb className="w-7 h-7 text-[hsl(var(--accent))]" />
                    </div>
                    <h3 className="font-bold text-2xl mb-4 text-[var(--text-primary)]">Applied Autonomous Engineering</h3>

                    <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-4">
                      Aprameya provides an intensive, project-driven laboratory environment where student engineers collaborate across computer science, electronics, and mechanical engineering. Members build real hardware prototypes and run simulation workloads in ROS 2, Gazebo, and PyTorch.
                    </p>
                    <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                      We focus on core autonomy pillars: LiDAR-camera sensor fusion, SLAM spatial localization, embedded edge acceleration (NVIDIA Jetson, Coral TPU), and CAN-bus control systems.
                    </p>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-[var(--border-color)] bg-black/40">
                    <img
                      src="/assets/UVH.jpg"
                      alt="Aprameya Engineering Team at Hackathon"
                      className="w-full h-full object-cover min-h-[300px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-24 px-4 bg-[var(--bg-body)] border-t border-[var(--border-color)]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border border-[var(--border-color)] bg-[var(--card-bg)] rounded-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 flex items-center justify-center mr-4">
                      <Eye className="w-6 h-6 text-[hsl(var(--accent))]" />
                    </div>
                    <h3 className="font-bold text-2xl text-[var(--text-primary)]">Our Vision</h3>
                  </div>
                  <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-6">
                    To establish a premier student research and prototyping lab that incubates impactful autonomous mobility solutions, fosters rigorous research publications, and competes at national and international autonomy benchmarks.
                  </p>
                  <div className="flex items-center text-[hsl(var(--accent))] text-sm font-mono">
                    <Globe className="w-4 h-4 mr-2" />
                    Rigorous Engineering & Autonomous Safety
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border border-[var(--border-color)] bg-[var(--card-bg)] rounded-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 flex items-center justify-center mr-4">
                      <Heart className="w-6 h-6 text-[hsl(var(--accent))]" />
                    </div>
                    <h3 className="font-bold text-2xl text-[var(--text-primary)]">Core Principles</h3>
                  </div>
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
                        <div className="flex-shrink-0 w-8 h-8 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg flex items-center justify-center mt-1">
                          <value.icon className="w-4 h-4 text-[hsl(var(--accent))]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-[var(--text-primary)]">{value.title}</h4>
                          <p className="text-xs text-[var(--text-secondary)]">{value.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Operative Roster */}
      <section className="py-24 px-4 bg-[var(--bg-body)] border-t border-[var(--border-color)]">
        <div className="container mx-auto max-w-6xl">
          <OperativeRoster />
        </div>
      </section>

      {/* Lab Location & Contact */}
      <section className="py-24 px-4 bg-[var(--bg-body)] border-t border-[var(--border-color)]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl mb-4 text-[var(--text-primary)]">Laboratory Headquarters</h2>
            <p className="text-sm font-mono text-[var(--text-secondary)]">
              Innovation & Autonomous Systems Lab • KL University
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="h-full border border-[var(--border-color)] bg-[var(--card-bg)] rounded-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 rounded-xl flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-[hsl(var(--accent))]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[var(--text-primary)]">Contact Lab</h3>
                    <p className="text-xs text-[var(--text-secondary)] font-mono">Official Communications</p>
                  </div>
                </div>
                <a
                  href="mailto:aprameya.techclub@kluniversity.in"
                  className="text-[hsl(var(--accent))] hover:underline font-mono text-sm break-all"
                >
                  aprameya.techclub@kluniversity.in
                </a>
              </CardContent>
            </Card>

            <Card className="h-full border border-[var(--border-color)] bg-[var(--card-bg)] rounded-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 rounded-xl flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-[hsl(var(--accent))]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[var(--text-primary)]">Physical Lab</h3>
                    <p className="text-xs text-[var(--text-secondary)] font-mono">Campus Location</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Room R609, Innovation Block<br />
                  KL Deemed to be University<br />
                  Green Fields, Vaddeswaram, Andhra Pradesh - 522302
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
