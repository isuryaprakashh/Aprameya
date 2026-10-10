import { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  isAdmin?: boolean;
  onEdit?: (project: Project) => void;
}

const ProjectCard = ({ project, onViewDetails, isAdmin, onEdit }: ProjectCardProps) => {
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
        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-black/80 backdrop-blur-md rounded border border-red-400/30 text-red-300 text-[10px] font-sans font-bold uppercase tracking-wider shadow">
          {project.category}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display font-bold text-lg text-white mb-1 group-hover:text-metallic-red transition-all">
          {project.title}
        </h3>
        <p className="mt-2 text-xs text-[#94A3B8] line-clamp-3 leading-relaxed">
          {project.description}
        </p>
        <p className="mt-3 text-[11px] text-red-400 font-mono">
          {(Array.isArray(project.technologies) ? project.technologies : (typeof project.technologies === 'string' ? (project.technologies as string).split(',') : []))
            .slice(0, 3)
            .map(t => t.trim())
            .join(' · ')}
        </p>

        <div className="mt-5 flex gap-2">
          <button className="w-full py-2.5 rounded-lg text-xs btn-metallic-red cursor-pointer">
            View Project
          </button>
          {isAdmin && onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(project); }}
              className="px-4 py-2.5 rounded-lg text-xs btn-metallic-ghost cursor-pointer"
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
