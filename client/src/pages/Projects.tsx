import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Search, ShieldCheck, ArrowRight } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import UnderConstruction from '../components/UnderConstruction';
import AprameyaLoader from '../components/AprameyaLoader';
import { Project } from '../lib/types';
import { Input } from '@/components/ui/input';
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
    <div className="fadeIn min-h-screen bg-[var(--bg-body)]">
      {/* Header Section */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 border-b border-red-500/15">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.15em] text-red-400 mb-3">
              Research & Hardware
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl mb-4 tracking-tight text-white font-display font-bold">
              <span className="text-[#94A3B8] font-normal">Laboratory</span>{" "}
              <span>Projects</span>
            </h1>
            <p className="text-base text-[#94A3B8] max-w-xl leading-relaxed">
              Hardware integrations, computer vision pipelines, and robotics systems built and tested by Aprameya members.
            </p>

            {/* Featured Project Highlight */}
            {featuredProject && (
              <div className="mt-8 max-w-2xl morphic-metallic-card p-5 rounded-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-10 h-10 bg-red-950/60 flex items-center justify-center rounded-lg border border-red-400/30 shrink-0 text-red-300 shadow-[inset_0_1px_1px_rgba(254,202,202,0.2)]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-red-400 font-semibold uppercase tracking-wider mb-0.5">Featured Project</div>
                    <div className="text-white font-display font-bold text-base">{featuredProject.title}</div>
                    <div className="text-xs text-[#94A3B8]">{featuredProject.category}</div>
                  </div>
                  <div className="flex gap-2 ml-auto w-full sm:w-auto">
                    {user?.role === 'ADMIN' && (
                      <ChamferedButton variant="secondary" size="sm" onClick={() => setLocation(`/dashboard?view=projects&editId=${featuredProject.id}&type=project`)}>
                        Edit
                      </ChamferedButton>
                    )}
                    <ChamferedButton variant="primary" size="sm" onClick={() => handleViewDetails(featuredProject)}>
                      View Project
                    </ChamferedButton>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {projects.length > 0 ? (
            <>
              <div className="w-full relative max-w-md mb-8">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-red-400/60 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Filter by title, stack, or domain..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 rounded-lg bg-[#1A050A]/70 border-red-500/20 text-white focus:border-red-400/50 text-sm font-sans"
                />
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
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
                  <div className="col-span-full text-center py-12 text-sm text-[var(--text-secondary)]">
                    No projects matching "{searchTerm}"
                  </div>
                )}
              </div>
            </>
          ) : (
            <UnderConstruction
              category="LABORATORY"
              title="Projects in Review"
              subtitle="ROS 2 Pipelines & Hardware Builds"
              description="Engineering squads are compiling ROS 2 software packages and hardware integration schematics. Verified builds will appear here once benchmarking and testing are complete."
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
