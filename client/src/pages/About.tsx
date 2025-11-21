import { Link } from 'wouter';
import { teamMembers } from '../lib/data';
import TeamMemberCard from '../components/TeamMemberCard';
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
            className="text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 mb-6 border border-[var(--border-color)] px-3 py-1 bg-black">
              <Users className="w-3 h-3 text-white" />
              <span className="text-xs font-bold text-white tracking-widest">OUR_STORY</span>
            </div>
            <h1 className="font-bold text-5xl md:text-7xl mb-6 leading-[0.9]">
              ABOUT<br />APRAMEYA
            </h1>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto mb-12 font-mono">
              Discover our journey, mission, and the passionate team driving innovation
              in autonomous vehicle technology at KL University.
            </p>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border-color)] border border-[var(--border-color)] max-w-4xl mx-auto">
              <div className="bg-[var(--card-bg)] p-6">
                <div className="text-3xl font-bold text-white mb-1">2019</div>
                <div className="text-[10px] text-gray-500 uppercase">Founded</div>
              </div>
              <div className="bg-[var(--card-bg)] p-6">
                <div className="text-3xl font-bold text-white mb-1">200+</div>
                <div className="text-[10px] text-gray-500 uppercase">Members</div>
              </div>
              <div className="bg-[var(--card-bg)] p-6">
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-[10px] text-gray-500 uppercase">Projects</div>
              </div>
              <div className="bg-[var(--card-bg)] p-6">
                <div className="text-3xl font-bold text-white mb-1">15+</div>
                <div className="text-[10px] text-gray-500 uppercase">Awards</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">
              <Target className="w-3 h-3 mr-1" />
              Our Purpose
            </Badge>
            <h2 className="font-bold text-3xl md:text-5xl mb-6">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border-0 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                      <Lightbulb className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-2xl mb-4">Driving Innovation Forward</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      We are a student-led community at KL University dedicated to advancing autonomous
                      vehicle technology through hands-on projects, cutting-edge research, and collaborative
                      innovation. Our mission is to bridge the gap between academic learning and real-world
                      application in the rapidly evolving field of autonomous systems.
                    </p>
                  </div>
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                      alt="Team collaboration"
                      className="rounded-2xl shadow-2xl w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-24 px-4 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mr-4">
                      <Eye className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-2xl">Our Vision</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    To become a leading student community in autonomous vehicle technology,
                    recognized globally for innovative solutions and producing industry-ready
                    professionals who shape the future of transportation and robotics.
                  </p>
                  <div className="flex items-center text-blue-600 font-medium">
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
              <Card className="h-full border-0 shadow-xl bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-600 flex items-center justify-center mr-4">
                      <Heart className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-2xl">Our Values</h3>
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
                        <div className="flex-shrink-0 w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mt-1">
                          <value.icon className="w-4 h-4 text-cyan-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{value.title}</h4>
                          <p className="text-sm text-muted-foreground">{value.description}</p>
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

      {/* Team Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto max-w-6xl">
          {/* Operative Roster */}
          <div className="mb-16">
            <OperativeRoster />
          </div>



          {/* Join Team CTA */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 border-0 text-white">
              <CardContent className="p-8 md:p-12">
                <h3 className="font-bold text-2xl md:text-3xl mb-4">Want to Join Our Team?</h3>
                <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                  We're always looking for passionate students who want to make a difference
                  in autonomous vehicle technology. Join us and be part of something amazing!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                    <Link href="/signup">
                      Join Aprameya
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    <Link href="/events">
                      Upcoming Events
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">
              <Mail className="w-3 h-3 mr-1" />
              Get in Touch
            </Badge>
            <h2 className="font-bold text-3xl md:text-4xl mb-4">Contact Us</h2>
            <p className="text-xl text-muted-foreground">
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
              <Card className="h-full border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mr-4">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email Us</h3>
                      <p className="text-muted-foreground">Send us a message anytime</p>
                    </div>
                  </div>
                  <a
                    href="mailto:contact@aprameya.com"
                    className="text-blue-600 hover:text-blue-700 font-medium text-lg"
                  >
                    contact@aprameya.com
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
              <Card className="h-full border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center mr-4">
                      <MapPin className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Visit Us</h3>
                      <p className="text-muted-foreground">Find us on campus</p>
                    </div>
                  </div>
                  <p className="text-lg">
                    Tech Hub, Innovation Center<br />
                    KL University Campus<br />
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
