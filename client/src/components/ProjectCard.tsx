import { Project } from '@/lib/types';
import StatusBadge from './ui/StatusBadge';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  isAdmin?: boolean;
  onEdit?: (project: Project) => void;
}

const ProjectCard = ({ project, onViewDetails, isAdmin, onEdit }: ProjectCardProps) => {
  const techs = (
    Array.isArray(project.technologies)
      ? project.technologies
      : typeof project.technologies === 'string'
      ? (project.technologies as string).split(',')
      : []
  ).map((t) => t.trim());

  return (
    <div
      onClick={() => onViewDetails(project)}
      className="group flex flex-col justify-between w-full rounded-lg border border-border p-6 transition-colors duration-fast hover:border-border-strong hover:bg-surface cursor-pointer text-left bg-transparent"
    >
      <div>
        {/* 16:10 Image container */}
        <div className="relative w-full aspect-[16/10] rounded-md overflow-hidden bg-surface-2 border border-border mb-5">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-opacity duration-fast"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-3 font-mono text-xs">
              NO PREVIEW
            </div>
          )}

          {/* Status or Category badge top-left */}
          <div className="absolute top-3 left-3">
            <StatusBadge status={project.status || project.category || 'Active'} />
          </div>
        </div>

        {/* Title: Space Grotesk 500 20px */}
        <h3 className="font-display font-medium text-lg text-text tracking-tight mb-2 group-hover:text-text transition-colors">
          {project.title}
        </h3>

        {/* 2-line summary */}
        <p className="text-sm text-text-2 line-clamp-2 leading-relaxed mb-4">
          {project.description}
        </p>
      </div>

      {/* Footer row: tags left, year / action right */}
      <div className="pt-4 border-t border-border flex items-center justify-between gap-2 mt-auto">
        <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
          {techs.slice(0, 2).map((tech, idx) => (
            <span
              key={idx}
              className="h-6 px-2.5 rounded-full border border-border font-mono text-[11px] text-text-2 flex items-center"
            >
              {tech}
            </span>
          ))}
          {techs.length > 2 && (
            <span className="text-[11px] font-mono text-text-3">
              +{techs.length - 2}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="text-xs font-mono text-text-3 hover:text-text px-2 py-1 rounded hover:bg-surface-2 transition-colors cursor-pointer"
            >
              Edit
            </button>
          )}
          <span className="font-mono text-xs text-text-3">
            {project.year || new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
