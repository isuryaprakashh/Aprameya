
import { Project } from '../lib/types';
import { ChevronRight } from 'lucide-react';
import { CleanCard } from './ui/v6-card';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  onEdit?: (project: Project) => void;
  isAdmin?: boolean;
}

const ProjectCard = ({ project, onViewDetails, onEdit, isAdmin }: ProjectCardProps) => {
  // Minimal card design - no slider, just the main image and details

  return (
    <CleanCard
      className="group h-full flex flex-col p-0 overflow-hidden cursor-pointer border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[hsl(var(--accent))]/30 transition-all duration-300"
      onClick={() => onViewDetails(project)}
    >
      {/* Main Image - Fixed aspect ratio */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient Overlay for text readability if needed, though mostly visual enhancement here */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-body)]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Category Badge - Absolute top left */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2 py-1 rounded inline-flex bg-[var(--bg-body)]/80 backdrop-blur-sm border border-[var(--border-color)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] shadow-sm">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col grow">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-[var(--text-primary)] leading-tight group-hover:text-[hsl(var(--accent))] transition-colors">
            {project.title}
          </h3>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed line-clamp-2 grow">
          {project.description}
        </p>

        {/* Tags - Minimal */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(Array.isArray(project.technologies) ? project.technologies : (typeof project.technologies === 'string' ? (project.technologies as string).split(',') : []))
            .slice(0, 3)
            .map((tech, index) => (
              <span key={index} className="text-[10px] px-1.5 py-0.5 bg-[var(--text-primary)]/5 rounded text-[var(--text-secondary)] border border-transparent hover:border-[var(--text-primary)]/10 transition-colors">
                {tech.trim()}
              </span>
            ))}
        </div>

        {/* Minimal Action Footer */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-[var(--border-color)]/50">
          <span className="text-xs text-[hsl(var(--accent))] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
            View Details <ChevronRight className="w-3 h-3" />
          </span>

          <div className="flex gap-2">
            {isAdmin && onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                className="text-xs px-2 py-1 rounded bg-[var(--text-primary)]/5 hover:bg-[var(--text-primary)]/10 text-[var(--text-secondary)] transition-colors"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </CleanCard>
  );
};

export default ProjectCard;
