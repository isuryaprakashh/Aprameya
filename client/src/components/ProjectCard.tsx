import { Project } from '../lib/types';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  onEdit?: (project: Project) => void;
  isAdmin?: boolean;
}

const ProjectCard = ({ project, onViewDetails, onEdit, isAdmin }: ProjectCardProps) => {
  // Radius tokens (geometry-correct)
  // outer radius = inner radius + padding (p-2 = 8px)
  const R_CARD = "rounded-[22px]";          // outer container
  const R_IMAGE = "rounded-[14px]";         // 22 - 8 = 14 → correct curve

  // Using CSS variables to map to user's requested logic
  // cardBg -> bg-[var(--card-bg)]
  // textMain -> text-[var(--text-primary)]
  // textSub/textMuted -> text-[var(--text-secondary)]
  // buttonPrimary -> bg-[var(--text-primary)] text-[var(--bg-body)]

  return (
    <div
      className={`w-full group ${R_CARD} bg-[var(--card-bg)] shadow-lg p-2 transition-colors border border-[var(--border-color)] cursor-pointer`}
      onClick={() => onViewDetails(project)}
    >
      <div className={`relative h-[200px] ${R_IMAGE} overflow-hidden bg-[var(--bg-body)]`}>
        <img
          src={project.image}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt={project.title}
        />
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-1">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
          {project.description}
        </p>
        <p className="mt-3 text-xs text-[var(--text-secondary)] font-mono">
          {(Array.isArray(project.technologies) ? project.technologies : (typeof project.technologies === 'string' ? (project.technologies as string).split(',') : []))
            .slice(0, 3)
            .map(t => t.trim())
            .join(' · ')}
        </p>

        <div className="mt-5 flex gap-2">
          <button className="w-full py-3 rounded-full font-medium bg-[var(--text-primary)] text-[var(--bg-body)] hover:opacity-90 transition-opacity text-sm">
            View Project
          </button>
          {isAdmin && onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(project); }}
              className="px-4 py-3 rounded-full font-medium border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-body)] transition-colors text-sm"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
