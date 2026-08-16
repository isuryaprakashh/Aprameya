import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Search, ShieldCheck } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import UnderConstruction from '../components/UnderConstruction';
import AprameyaLoader from '../components/AprameyaLoader';
import HudFrame from '../components/ui/HudFrame';
import { Project } from '../lib/types';
import { Input } from '@/components/ui/input';
import VoidAurora from '../components/backgrounds/VoidAurora';
import ChamferedButton from '@/components/ui/ChamferedButton';
import { motion } from 'framer-motion';

const Projects = () => {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    queryFn: async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${baseUrl}/api/projects`);
        if (!res.ok) return [];
        return res.json();
      } catch {
        return [];
      }
    },
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
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const featuredProject = projects.find(p => p.is_featured) || (projects.length > 0 ? projects[0] : null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center">
        <AprameyaLoader size={40} />
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] text-xs font-mono mb-6 uppercase tracking-wider">
              Autonomous Systems & Engineering
            </div>

            <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 text-[var(--text-primary)] leading-[0.9] tracking-tight">
              LABORATORY<br />PROJECTS
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto font-mono leading-relaxed">
              Hardware integrations, computer vision pipelines, and robotics systems built and tested by Aprameya members.
            </p>

            {/* Featured Project Highlight (if projects exist) */}
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
                        <ChamferedButton variant="secondary" size="sm" onClick={() => setLocation(`/dashboard?view=projects&editId=${featuredProject.id}&type=project`)}>
                          Edit
                        </ChamferedButton>
                      )}
                      <ChamferedButton variant="primary" size="sm" onClick={() => handleViewDetails(featuredProject)}>
                        View Stack
                      </ChamferedButton>
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
                  className="pl-10 h-11 rounded-xl bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] focus:border-[hsl(var(--accent))]/50 text-sm font-mono"
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
              category="LABORATORY INITIATIVES"
              title="Repositories In Preparation"
              subtitle="ROS 2 Pipelines & Hardware Benchmarking"
              description="Laboratory engineering squads are compiling ROS 2 software packages and hardware integration schematics. Verified builds will appear here once physical testing and peer review are finalized."
            />
          )}
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
