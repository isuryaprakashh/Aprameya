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
      className="w-full group rounded-xl morphic-metallic-card p-2 transition-all duration-300 cursor-pointer"
      onClick={() => onViewDetails(project)}
    >
      <div className="relative h-[200px] rounded-lg overflow-hidden bg-black">
        <img
          src={project.image}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt={project.title}
        />
      </div>

      <div className="p-5">
        <h3 className="font-display font-bold text-lg text-white mb-1 group-hover:text-metallic-green transition-all">
          {project.title}
        </h3>
        <p className="mt-2 text-xs text-[#94A3B8] line-clamp-3 leading-relaxed">
          {project.description}
        </p>
        <p className="mt-3 text-[11px] text-emerald-400 font-mono">
          {(Array.isArray(project.technologies) ? project.technologies : (typeof project.technologies === 'string' ? (project.technologies as string).split(',') : []))
            .slice(0, 3)
            .map(t => t.trim())
            .join(' · ')}
        </p>

        <div className="mt-5 flex gap-2">
          <button className="w-full py-2.5 rounded-lg text-xs btn-metallic-green">
            View Project
          </button>
          {isAdmin && onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(project); }}
              className="px-4 py-2.5 rounded-lg text-xs btn-metallic-ghost"
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
