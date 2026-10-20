import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowRight, FolderGit2 } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import StatusBadge from '@/components/ui/StatusBadge';
import ChamferedButton from '@/components/ui/ChamferedButton';
import EmptyState from '../components/EmptyState';
import { Project } from '../lib/types';
import { projects as fallbackProjects } from '../lib/data';

const CATEGORIES = ['All', 'Autonomous Systems', 'Drones', 'Robotics', 'Computer Vision', 'Edge AI'];

const Projects = () => {
  const { data: dbProjects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${baseUrl}/api/projects`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch {
        clearTimeout(timeoutId);
        return [];
      }
    },
    staleTime: 30000,
  });

  const projects = dbProjects.length > 0 ? dbProjects : fallbackProjects;
  const { data: user } = useQuery<any>({ queryKey: ['/api/me'] });
  const [, setLocation] = useLocation();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      project.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredProject =
    projects.find((p) => p.is_featured) || (projects.length > 0 ? projects[0] : null);

  return (
    <main className="w-full bg-bg min-h-screen text-text">
      {/* ─── PAGE HEADER (Section 5.2 & 5) ─── */}
      <section className="pt-24 pb-12 px-6 md:px-8 max-w-[1200px] mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 mb-2">
          01 — PROJECTS
        </p>
        <h1 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl tracking-tight text-text mb-3">
          Engineering repositories.
        </h1>
        <p className="text-base text-text-2 max-w-xl leading-relaxed">
          Physical robotics platforms, autonomy pipelines, and hardware builds created by Aprameya laboratory members.
        </p>

        {/* ─── FEATURED PROJECT CARD (Section 5.2) ─── */}
        {featuredProject && (
          <div className="mt-10 rounded-lg border border-border p-6 bg-surface hover:border-border-strong transition-colors duration-fast">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Image 55% */}
              <div className="lg:col-span-7">
                <div className="relative aspect-[16/10] rounded-md overflow-hidden bg-surface-2 border border-border">
                  {featuredProject.image ? (
                    <img
                      src={featuredProject.image}
                      alt={featuredProject.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-xs text-text-3">
                      NO PREVIEW
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <StatusBadge status="Featured" />
                  </div>
                </div>
              </div>

              {/* Text 45% */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs text-text-3 uppercase tracking-[0.06em] mb-2">
                    {featuredProject.category}
                  </div>
                  <h2 className="font-display font-medium text-2xl text-text tracking-tight mb-3">
                    {featuredProject.title}
                  </h2>
                  <p className="text-sm text-text-2 leading-relaxed mb-6 line-clamp-3">
                    {featuredProject.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <ChamferedButton
                    variant="primary"
                    size="md"
                    onClick={() => handleViewDetails(featuredProject)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    View project
                  </ChamferedButton>

                  {user?.role === 'ADMIN' && (
                    <ChamferedButton
                      variant="secondary"
                      size="md"
                      onClick={() =>
                        setLocation(
                          `/dashboard?view=projects&editId=${featuredProject.id}&type=project`
                        )
                      }
                    >
                      Edit
                    </ChamferedButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ─── FILTER BAR & SEARCH (Section 4.7 & 5.2) ─── */}
      <section className="py-6 px-6 md:px-8 max-w-[1200px] mx-auto border-t border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Scrollable Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`h-6 px-3 rounded-full text-xs font-mono uppercase tracking-[0.06em] whitespace-nowrap transition-colors duration-fast cursor-pointer ${
                    active
                      ? 'border border-red-line text-red-text bg-red-soft font-medium'
                      : 'border border-border text-text-2 hover:border-border-strong hover:text-text'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input (240px) */}
          <div className="relative w-full md:w-60 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-md border border-border-strong bg-transparent text-xs text-text placeholder:text-text-3 focus:outline-none focus:border-focus-ring"
            />
          </div>
        </div>
      </section>

      {/* ─── 3-COLUMN PROJECT GRID (Section 5.2) ─── */}
      <section className="pb-24 px-6 md:px-8 max-w-[1200px] mx-auto">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={handleViewDetails}
                isAdmin={user?.role === 'ADMIN'}
                onEdit={(p) =>
                  setLocation(`/dashboard?view=projects&editId=${p.id}&type=project`)
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FolderGit2}
            title="No matching projects"
            description="No repository records match your filter criteria. Try clearing search keywords."
            action={{
              label: "Reset filters",
              onClick: () => {
                setSearchTerm('');
                setSelectedCategory('All');
              },
            }}
          />
        )}
      </section>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </main>
  );
};

export default Projects;
