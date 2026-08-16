import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Search, Users, ShieldCheck } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import UnderConstruction from '../components/UnderConstruction';
import AprameyaLoader from '../components/AprameyaLoader';
import HudFrame from '../components/ui/HudFrame';
import { Project } from '../lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VoidAurora from '../components/backgrounds/VoidAurora';
import { motion } from 'framer-motion';

const Projects = () => {
  const { data: projects = [], isLoading, error } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });
  const { data: user } = useQuery<any>({ queryKey: ['/api/me'] });
  const [, setLocation] = useLocation();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Filter projects based on search
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const featuredProject = projects.find(p => p.is_featured) || projects[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center">
        <AprameyaLoader size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center text-[var(--text-secondary)] font-mono text-sm">
        STATUS: 500 TELEMETRY_UNAVAILABLE // Unable to load projects.
      </div>
    );
  }

  return (
    <div className="fadeIn">
      {/* Header Section */}
      <section className="relative py-24 px-4 bg-[var(--bg-body)] border-b border-[var(--border-color)] overflow-hidden">
        <VoidAurora />
        <div className="absolute inset-0 dither-bg opacity-30 pointer-events-none"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center"
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] text-xs font-mono mb-6 uppercase tracking-wider">
              Autonomous Systems & Engineering
            </div>

            <h1 className="font-display font-bold text-4xl md:text-6xl mb-6 text-[var(--text-primary)] leading-none tracking-tight">
              LABORATORY<br />PROJECTS
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto font-mono">
              Hardware integrations, computer vision pipelines, and robotics systems built and tested by Aprameya members.
            </p>

            {/* Featured Project Highlight */}
            {featuredProject && (
              <div className="mt-12 max-w-2xl mx-auto">
                <HudFrame label="FEATURED_BUILD // VERIFIED" status="ONLINE" className="p-5 text-left">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-12 h-12 bg-[hsl(var(--accent))]/10 flex items-center justify-center rounded-lg border border-[hsl(var(--accent))]/20 shrink-0">
                      <ShieldCheck className="w-6 h-6 text-[hsl(var(--accent))]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-[hsl(var(--accent))] font-bold uppercase tracking-wider mb-1 font-mono">Featured Initiative</div>
                      <div className="text-[var(--text-primary)] font-display font-bold text-base">{featuredProject.title}</div>
                      <div className="text-xs text-[var(--text-secondary)] font-mono">{featuredProject.category} • Verified Build</div>
                    </div>
                    <div className="flex gap-2 ml-auto w-full sm:w-auto">
                      {user?.role === 'ADMIN' && (
                        <Button variant="secondary" size="sm" onClick={() => setLocation(`/dashboard?view=projects&editId=${featuredProject.id}&type=project`)}>
                          Edit
                        </Button>
                      )}
                      <Button className="btn-primary flex-1 sm:flex-none text-xs font-display tracking-wider uppercase" size="sm" onClick={() => handleViewDetails(featuredProject)}>
                        View Stack
                      </Button>
                    </div>
                  </div>
                </HudFrame>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 bg-[var(--bg-body)]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {projects.length > 0 ? (
            <>
              <div className="w-full relative max-w-xl mx-auto mb-12">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Filter by title, stack, or domain..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] focus:border-[hsl(var(--accent))]/50 text-sm"
                />
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <ProjectCard
                        project={project}
                        onViewDetails={handleViewDetails}
                        isAdmin={user?.role === 'ADMIN'}
                        onEdit={() => setLocation(`/dashboard?view=projects&editId=${project.id}&type=project`)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-sm font-mono text-[var(--text-secondary)]">
                    No projects matching "{searchTerm}"
                  </div>
                )}
              </div>
            </>
          ) : (
            <UnderConstruction
              category="PROJECTS REPOSITORY"
              title="Active Hardware & Software Development"
              subtitle="Benchmarking & Repository Verification"
              description="Laboratory projects are undergoing physical integration tests and ROS 2 package verification. Verified builds will be listed here with schematics, demo links, and component breakdowns."
            />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 border-t border-[var(--border-color)] bg-[var(--bg-body)]">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] text-center relative overflow-hidden"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--text-primary)] tracking-tight">
              Collaborate on Autonomous Systems
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-xl mx-auto leading-relaxed">
              Aprameya welcomes student engineers from computer science, electronics, robotics, and mechanical disciplines at KL University.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-[hsl(var(--accent))] text-[var(--bg-body)] font-semibold rounded-xl hover:opacity-90">
                  <Users className="mr-2 h-4 w-4" />
                  Join the Lab
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="rounded-xl border-[var(--border-color)] text-[var(--text-primary)]">
                  Explore Mission
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Projects;
