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
      className={`w-full group rounded-xl bg-[#0B130E] p-2 transition-all duration-300 border border-emerald-500/15 hover:border-emerald-400/40 hover:bg-[#0E1A13] shadow-lg shadow-black/20 cursor-pointer`}
      onClick={() => onViewDetails(project)}
    >
      <div className={`relative h-[200px] rounded-lg overflow-hidden bg-black`}>
        <img
          src={project.image}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt={project.title}
        />
      </div>

      <div className="p-5">
        <h3 className="font-display font-bold text-lg text-white mb-1">
          {project.title}
        </h3>
        <p className="mt-2 text-xs text-[#94A3B8] line-clamp-3 leading-relaxed">
          {project.description}
        </p>
        <p className="mt-3 text-[11px] text-emerald-400/80 font-mono">
          {(Array.isArray(project.technologies) ? project.technologies : (typeof project.technologies === 'string' ? (project.technologies as string).split(',') : []))
            .slice(0, 3)
            .map(t => t.trim())
            .join(' · ')}
        </p>

        <div className="mt-5 flex gap-2">
          <button className="w-full py-2.5 rounded-lg font-medium text-xs bg-gradient-to-b from-[#2A723E] to-[#1C512A] border border-[#4ADE80]/30 text-white hover:from-[#32874A] hover:to-[#226334] shadow-md shadow-[#1C512A]/30 transition-all">
            View Project
          </button>
          {isAdmin && onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(project); }}
              className="px-4 py-2.5 rounded-lg font-medium border border-emerald-500/20 text-[#94A3B8] hover:text-white hover:bg-emerald-950/30 transition-colors text-xs"
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
