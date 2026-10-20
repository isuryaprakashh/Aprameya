import React from 'react';
import { Project } from '@/lib/types';
import StatusBadge from './ui/StatusBadge';
import Detect from './ui/detect';
import { Tag } from './ui/badge';

interface ProjectCardProps {
  project: Project;
  onViewDetails?: (project: Project) => void;
  isAdmin?: boolean;
  onEdit?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewDetails,
  isAdmin,
  onEdit,
}) => {
  const techs = (
    Array.isArray(project.technologies)
      ? project.technologies
      : typeof project.technologies === 'string'
      ? (project.technologies as string).split(',')
      : []
  ).map((t) => t.trim()).filter(Boolean);

  const identifier = project.slug || project._id || project.title;

  return (
    <Detect
      label="project"
      id={identifier}
      as="article"
      className="group flex flex-col justify-between w-full rounded-[var(--r-3)] border border-hairline p-5 sm:p-6 bg-transparent text-left cursor-pointer transition-colors duration-fast"
      onClick={() => onViewDetails?.(project)}
    >
      <div>
        {/* 16:10 Image container */}
        <div className="relative w-full aspect-[16/10] rounded-[var(--r-2)] overflow-hidden bg-surface-2 border border-hairline mb-4">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-slow ease-out group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-mute font-mono text-xs">
              NO PREVIEW
            </div>
          )}

          {/* Status badge top-left on image */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <StatusBadge status={project.status || project.category || 'Live'} />
          </div>
        </div>

        {/* Title: h3 sans wght 500, line-clamp-2 */}
        <h3 className="font-sans font-medium text-[20px] text-paper tracking-[-0.01em] line-clamp-2 leading-snug mb-2">
          {project.title}
        </h3>

        {/* One-line summary */}
        <p className="text-[14px] text-text-2 line-clamp-1 leading-relaxed mb-4">
          {project.description}
        </p>
      </div>

      {/* Footer row: up to 3 tags left, year mono right */}
      <div className="pt-3.5 border-t border-hairline flex items-center justify-between gap-2 mt-auto">
        <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
          {techs.slice(0, 3).map((tech, idx) => (
            <Tag key={idx} size="dense">
              {tech}
            </Tag>
          ))}
          {techs.length > 3 && (
            <span className="text-[11px] font-mono text-mute">
              +{techs.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="text-[12px] font-mono text-mute hover:text-paper px-2 py-0.5 rounded-[var(--r-1)] hover:bg-surface-2 transition-colors cursor-pointer"
            >
              Edit
            </button>
          )}
          <span className="font-mono text-[13px] text-mute tabular-nums">
            {project.year || new Date().getFullYear()}
          </span>
        </div>
      </div>
    </Detect>
  );
};

export default ProjectCard;
