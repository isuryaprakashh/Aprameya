import { Project } from '../lib/types';
import { X, ExternalLink, Github, Users, Wrench } from 'lucide-react';
import StatusBadge from './ui/StatusBadge';
import ChamferedButton from './ui/ChamferedButton';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  if (!project || !isOpen) return null;

  const techs = (
    Array.isArray(project.technologies)
      ? project.technologies
      : typeof project.technologies === 'string'
      ? (project.technologies as string).split(',')
      : []
  ).map((t) => t.trim());

  const team = (
    Array.isArray(project.team)
      ? project.team
      : typeof project.team === 'string'
      ? (project.team as string).split(',')
      : []
  ).map((t) => t.trim());

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
      {/* Backdrop (Section 2.6) */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card (Section 4.11) */}
      <div className="relative w-full max-w-2xl bg-surface border border-border-strong rounded-lg p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="mb-2">
              <StatusBadge status={project.status || project.category || 'Active'} />
            </div>
            <h3 className="font-display font-medium text-2xl text-text tracking-tight">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-text-3 hover:text-text hover:bg-surface-2 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero image frame (Section 5.2) */}
        {project.image && (
          <div className="relative w-full aspect-[16/10] rounded-md overflow-hidden bg-surface-2 border border-border mb-6">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Long-form description */}
        <p className="text-sm text-text-2 leading-relaxed mb-6">
          {project.description}
        </p>

        {/* Two-column metadata */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {/* Tech stack chips */}
          <div className="p-4 rounded-md border border-border bg-bg/50">
            <div className="flex items-center gap-1.5 font-mono text-xs text-text-3 uppercase tracking-[0.06em] mb-3">
              <Wrench className="w-3.5 h-3.5" />
              <span>Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {techs.map((tech, idx) => (
                <span
                  key={idx}
                  className="h-6 px-2.5 rounded-full border border-border bg-surface-2 font-mono text-[11px] text-text-2 flex items-center"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Team members */}
          <div className="p-4 rounded-md border border-border bg-bg/50">
            <div className="flex items-center gap-1.5 font-mono text-xs text-text-3 uppercase tracking-[0.06em] mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>Project Team</span>
            </div>
            <div className="space-y-1.5">
              {team.map((member, idx) => (
                <div key={idx} className="text-xs text-text-2 font-body">
                  • {member}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer buttons (Section 4.11): secondary then primary */}
        <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
          <ChamferedButton variant="secondary" size="md" onClick={onClose}>
            Close
          </ChamferedButton>
          <a
            href="https://github.com/KL-Aprameya"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ChamferedButton
              variant="primary"
              size="md"
              rightIcon={<ExternalLink className="w-4 h-4" />}
            >
              View on GitHub
            </ChamferedButton>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
