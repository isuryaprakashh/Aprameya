import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, FolderGit2 } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag } from '@/components/ui/badge';
import EmptyState from '../components/EmptyState';
import { Project } from '../lib/types';
import { projects as fallbackProjects } from '../lib/data';

const TAGS = ['All', 'Autonomous', 'Drones', 'Robotics', 'Vision', 'Edge AI'];

export const Projects: React.FC = () => {
  const { data: dbProjects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
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

  const allProjects = dbProjects.length > 0 ? dbProjects : fallbackProjects;
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = allProjects.filter((project) => {
    const matchesTag =
      selectedTag === 'All' ||
      project.category?.toLowerCase().includes(selectedTag.toLowerCase()) ||
      (Array.isArray(project.technologies) &&
        project.technologies.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase())));
    const matchesSearch =
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const featured = allProjects.find((p) => p.is_featured) || allProjects[0];

  return (
    <div className="w-full bg-ink text-paper min-h-screen">
      {/* ─── PAGE HERO (§7.8.2) ─── */}
      <section className="pt-12 sm:pt-16 pb-8 px-5 sm:px-8 lg:px-12 max-w-container mx-auto text-left">
        <h1 className="font-sans font-medium text-[clamp(34px,4.8vw,60px)] tracking-[-0.03em] leading-tight text-paper mb-3">
          Projects
        </h1>
        <p className="font-sans text-[clamp(17px,1.4vw,20px)] text-text-2 max-w-2xl leading-relaxed mb-10">
          Self-driving platforms, embedded perception stacks, and autonomous robotics testbeds built by laboratory members.
        </p>

        {/* ─── FEATURED CARD (Horizontal 7 cols : 5 cols on lg) ─── */}
        {featured && selectedTag === 'All' && !searchTerm && (
          <div className="w-full rounded-[var(--r-4)] border border-hairline bg-surface-1 p-6 sm:p-8 mb-12">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="relative aspect-[16/10] rounded-[var(--r-3)] overflow-hidden bg-surface-2 border border-hairline">
                  {featured.image ? (
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-xs text-mute">
                      NO PREVIEW
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <StatusBadge status="Featured" />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between text-left">
                <div>
                  <h2 className="font-sans font-medium text-[24px] sm:text-[28px] text-paper tracking-[-0.02em] leading-snug mb-3">
                    {featured.title}
                  </h2>
                  <p className="font-sans text-[14px] text-text-2 leading-relaxed mb-6">
                    {featured.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-hairline flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[13px] text-mute mr-3">
                    {featured.year || '2026'}
                  </span>
                  {featured.technologies?.slice(0, 3).map((t: string, i: number) => (
                    <Tag key={i} size="dense">{t}</Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── FILTER BAR (§7.1.4 Chips & Input) ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {TAGS.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`h-7 px-3 rounded-[var(--r-full)] text-[12px] font-sans font-medium transition-colors cursor-pointer select-none border ${
                    isSelected
                      ? 'border-signal-line bg-signal-soft text-signal-text'
                      : 'border-hairline bg-transparent text-text-2 hover:border-hairline-2 hover:text-paper'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mute pointer-events-none" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 text-[13px]"
            />
          </div>
        </div>
      </section>

      {/* ─── GRID OF PROJECT CARDS ─── */}
      <section className="pb-24 px-5 sm:px-8 lg:px-12 max-w-container mx-auto text-left">
        {(() => {
          const gridProjects = (featured && selectedTag === 'All' && !searchTerm)
            ? filteredProjects.filter((p) => (p.slug || p.id || p._id) !== (featured.slug || featured.id || featured._id))
            : filteredProjects;

          if (gridProjects.length > 0) {
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridProjects.map((project) => (
                  <ProjectCard
                    key={project.slug || project._id || project.id || project.title}
                    project={project}
                  />
                ))}
              </div>
            );
          }

          if (featured && selectedTag === 'All' && !searchTerm) {
            return null; // Featured card is already shown above, no need for empty state
          }

          return (
            <EmptyState
              icon={FolderGit2}
              title="No projects found"
              description="No active repositories match your current search and tag filters."
            />
          );
        })()}
      </section>
    </div>
  );
};

export default Projects;
