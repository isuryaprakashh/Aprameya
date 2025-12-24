import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Eye,
  Shield,
  CheckCircle,
  Mail,
  MapPin,
  Users,
  Target,
  Lightbulb,
  Heart,
  Globe,
  ArrowRight,
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
            <div className="inline-flex items-center gap-2 mb-6 border border-[var(--border-color)] px-3 py-1 bg-[var(--bg-body)]">
              <Users className="w-3 h-3 text-[var(--text-primary)]" />
              <span className="text-xs font-bold text-[var(--text-primary)] tracking-widest">OUR_STORY</span>
            </div>
            <h1 className="font-bold text-5xl md:text-7xl mb-6 leading-[0.9]">
              ABOUT<br />APRAMEYA
            </h1>
            <p className="text-xl text-[hsl(var(--accent))] font-medium mb-6">
              Engineering Tomorrow's Autonomy Today
            </p>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 font-mono">
              Discover our journey, mission, and the passionate team driving innovation
              in autonomous vehicle technology at KL University.
            </p>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border-color)] border border-[var(--border-color)] max-w-4xl mx-auto">
              <div className="bg-[var(--card-bg)] p-6">
                <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">2019</div>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase">Founded</div>
              </div>
              <div className="bg-[var(--card-bg)] p-6">
                <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">50+</div>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase">Members</div>
              </div>
              <div className="bg-[var(--card-bg)] p-6">
                <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">15+</div>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase">Projects</div>
              </div>
              <div className="bg-[var(--card-bg)] p-6">
                <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">10+</div>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase">Awards</div>
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
            <Badge variant="outline" className="mb-4 text-[var(--text-primary)] border-[var(--border-color)]">
              <Target className="w-3 h-3 mr-1" />
              Our Purpose
            </Badge>
            <h2 className="font-bold text-3xl md:text-5xl mb-6 text-[var(--text-primary)]">
              <span className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent))]/70 bg-clip-text text-transparent">
                Our Mission
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="w-16 h-16 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center mb-6">
                      <Lightbulb className="w-8 h-8 text-[var(--bg-body)]" />
                    </div>
                    <h3 className="font-bold text-2xl mb-4 text-[var(--text-primary)]">Driving Innovation Forward</h3>


                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed mt-4">
                      Aprameya Club is dedicated to building a collaborative community of enthusiasts in
                      autonomous systems, where members can share knowledge, inspire each other, and work
                      together towards common goals. Through hands-on experience, members engage in real-world
                      projects focused on advancing autonomous technology, gaining practical insights into the field.
                    </p>
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed mt-4">
                      The club prioritizes deepening expertise in critical areas like AI, Machine Learning,
                      and the Internet of Things (IoT) to empower members with in-demand skills. Mastery of
                      essential tools and frameworks, including ROS, TensorFlow, OpenCV, and various simulation
                      environments, is a cornerstone of Aprameya’s learning approach.
                    </p>
                  </div>
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                      alt="Team collaboration"
                      className="rounded-2xl shadow-2xl w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(var(--accent))]/20 to-[hsl(var(--accent))]/20 rounded-2xl"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-24 px-4 bg-[var(--bg-body)]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border border-[var(--border-color)] shadow-xl bg-[var(--card-bg)]">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--accent))] flex items-center justify-center mr-4">
                      <Eye className="w-7 h-7 text-[var(--bg-body)]" />
                    </div>
                    <h3 className="font-bold text-2xl text-[var(--text-primary)]">Our Vision</h3>
                  </div>
                  <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
                    To harness autonomous technologies, AI, and advanced computing to shape a smarter, safer,
                    and more efficient world.
                  </p>
                  <div className="flex items-center text-[hsl(var(--accent))] font-medium">
                    <Globe className="w-5 h-5 mr-2" />
                    Global Impact Through Innovation
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border border-[var(--border-color)] shadow-xl bg-[var(--card-bg)]">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--accent))] flex items-center justify-center mr-4">
                      <Heart className="w-7 h-7 text-[var(--bg-body)]" />
                    </div>
                    <h3 className="font-bold text-2xl text-[var(--text-primary)]">Our Values</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Lightbulb,
                        title: "Innovation",
                        description: "Pushing boundaries through creative problem-solving and cutting-edge research"
                      },
                      {
                        icon: Users,
                        title: "Collaboration",
                        description: "Working together across disciplines to achieve common goals"
                      },
                      {
                        icon: Star,
                        title: "Excellence",
                        description: "Striving for the highest quality in everything we do"
                      },
                      {
                        icon: Globe,
                        title: "Inclusivity",
                        description: "Creating opportunities for all passionate students to contribute"
                      }
                    ].map((value, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-[hsl(var(--accent))]/10 rounded-lg flex items-center justify-center mt-1">
                          <value.icon className="w-4 h-4 text-[hsl(var(--accent))]" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1 text-[var(--text-primary)]">{value.title}</h4>
                          <p className="text-sm text-[var(--text-secondary)]">{value.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

      </section>

      {/* Club Structure Section */}
      <section className="py-24 px-4 bg-[var(--bg-body)] border-y border-[var(--border-color)]">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 mb-4 border border-[var(--border-color)] px-3 py-1 bg-[var(--card-bg)] rounded-full">
              <Shield className="w-3 h-3 text-[hsl(var(--accent))]" />
              <span className="text-xs font-bold text-[var(--text-primary)] tracking-widest uppercase">Collaborative Ecosystem</span>
            </div>
            <h2 className="font-bold text-3xl md:text-4xl mb-6 text-[var(--text-primary)]">Club Structure</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-[var(--card-bg)] border border-[var(--border-color)]">
              <CardContent className="p-8 md:p-12">
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
                  Aprameya - The Autonomous Systems Club is structured in a way that encourages everyone
                  to work together, share ideas, and feel included. Although there are specific roles to help
                  manage tasks and keep things organized, the club values the input of every member.
                </p>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  Decisions are made together, giving each member a chance to share their thoughts and
                  contribute. This approach helps everyone feel connected and responsible for the club's
                  success, making the club stronger and more united in achieving its goals and purpose.  
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4 bg-[var(--bg-body)]">
        <div className="container mx-auto max-w-6xl">
          {/* Operative Roster */}
          <div className="mb-16">
            <OperativeRoster />
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="py-16 bg-[var(--bg-body)]">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent))]/80 border-0 text-[var(--bg-body)]">
              <CardContent className="p-8 md:p-12">
                <div className="max-w-4xl mx-auto text-center">
                  <h3 className="font-bold text-2xl md:text-3xl mb-4 text-[var(--text-primary)]">Want to Join Our Team?</h3>
                  <p className="text-[var(--text-primary)]/90 mb-8 max-w-2xl mx-auto text-lg">
                    We're always looking for passionate individuals who want to make a difference in autonomous systems.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-[var(--card-bg)] text-[hsl(var(--accent))] hover:bg-[var(--card-bg)]/90 font-semibold">
                      <Link href="/signup">
                        <Users className="mr-2 h-5 w-5" />
                        Join Now
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-body)]/10">
                      <Link href="/events">
                        Upcoming Events
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 bg-[var(--bg-body)]">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 text-[var(--text-primary)] border-[var(--border-color)]">
              <Mail className="w-3 h-3 mr-1" />
              Get in Touch
            </Badge>
            <h2 className="font-bold text-3xl md:text-4xl mb-4 text-[var(--text-primary)]">Contact Us</h2>
            <p className="text-xl text-[var(--text-secondary)]">
              Have questions or want to get involved? We'd love to hear from you!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border border-[var(--border-color)] shadow-lg bg-[var(--card-bg)]">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-[hsl(var(--accent))]/10 rounded-xl flex items-center justify-center mr-4">
                      <Mail className="w-6 h-6 text-[hsl(var(--accent))]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[var(--text-primary)]">Email Us</h3>
                      <p className="text-[var(--text-secondary)]">Send us a message anytime</p>
                    </div>
                  </div>
                  <a
                    href="mailto:aprameya.techclub@kluniversity.in"
                    className="text-[hsl(var(--accent))] hover:underline font-medium text-lg"
                  >
                    aprameya.techclub@kluniversity.in
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border border-[var(--border-color)] shadow-lg bg-[var(--card-bg)]">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-[hsl(var(--accent))]/10 rounded-xl flex items-center justify-center mr-4">
                      <MapPin className="w-6 h-6 text-[hsl(var(--accent))]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[var(--text-primary)]">Visit Us</h3>
                      <p className="text-[var(--text-secondary)]">Find us on campus</p>
                    </div>
                  </div>
                  <p className="text-lg text-[var(--text-primary)]">
                    R609<br />
                    KL University<br />
                    Vaddeswaram, Guntur
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
