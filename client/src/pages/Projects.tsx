import { useState } from 'react';
import { Link, useLocation } from 'wouter';
// import { projects } from '../lib/data'; // Removed static import
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import { Project } from '../lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Users } from 'lucide-react';
import VoidAurora from '../components/backgrounds/VoidAurora';
import { motion } from 'framer-motion';
import { EmptyState } from '../components/EmptyState';
import { FolderOpen } from 'lucide-react';




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
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--accent))]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center text-[var(--text-secondary)]">
        Error loading projects. Please try again later.
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
            <div className="mb-6">
              {/* Breadcrumbs removed */}
            </div>

            <h1 className="font-bold text-4xl md:text-6xl mb-6 text-[var(--text-primary)] leading-none tracking-tighter">
              INNOVATIVE<br />PROJECTS
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto font-mono">
              Explore our cutting-edge autonomous vehicle projects and research initiatives
              that are shaping the future of transportation. From neural networks to hardware integration.
            </p>

            {/* Featured Project Highlight */}
            {featuredProject && (
              <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg max-w-2xl mx-auto text-left">
                <div className="w-12 h-12 bg-[hsl(var(--accent))]/10 flex items-center justify-center rounded-md border border-[hsl(var(--accent))]/20 shrink-0">
                  <Users className="w-6 h-6 text-[hsl(var(--accent))]" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-[hsl(var(--accent))] font-bold uppercase tracking-wider mb-1">Featured Project</div>
                  <div className="text-[var(--text-primary)] font-bold">{featuredProject.title}</div>
                  <div className="text-xs text-gray-400">{featuredProject.category} • Active Development</div>
                </div>
                <div className="flex gap-2 ml-auto w-full sm:w-auto">
                  {user?.role === 'ADMIN' && (
                    <Button variant="secondary" size="sm" onClick={() => setLocation(`/dashboard?view=projects&editId=${featuredProject.id}&type=project`)}>
                      Edit
                    </Button>
                  )}
                  <Button className="btn-primary flex-1 sm:flex-none" size="sm" onClick={() => handleViewDetails(featuredProject)}>
                    View Details
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-[var(--bg-body)]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="w-full relative max-w-2xl mx-auto mb-12">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-5 h-5" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 rounded-full bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] focus:border-[hsl(var(--accent))]/50 shadow-sm"
            />
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
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
              <div className="col-span-full">
                <EmptyState
                  icon={FolderOpen}
                  title="No projects found"
                  description={`We couldn't find any projects matching "${searchTerm}".`}
                  action={{
                    label: "Clear filters",
                    onClick: () => {
                      setSearchTerm('');
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* CTA Section */}
      <section className="py-16 px-4 bg-[var(--bg-body)]">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent))]/80 rounded-2xl p-8 md:p-12 text-[var(--bg-body)] text-center shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--bg-body)]">
                Ready to Build the Future?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto font-medium">
                Join our community of innovators and start your journey in autonomous systems.
                Whether you're a coder, designer, or hardware enthusiast, there's a place for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-[var(--card-bg)] text-[hsl(var(--accent))] hover:bg-[var(--card-bg)]/90 font-bold border-0">
                  <Link href="/signup">
                    <Users className="mr-2 h-5 w-5" />
                    Join Now
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent border-[var(--bg-body)] text-[var(--bg-body)] hover:bg-[var(--bg-body)]/10 hover:text-[var(--bg-body)]">
                  <Link href="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
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
