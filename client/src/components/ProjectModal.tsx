import { Project } from '../lib/types';
import { GlassPanel, CleanCard } from './ui/v6-card';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  if (!project) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-[var(--bg-body)]/80 backdrop-blur-md" onClick={onClose}></div>
      <GlassPanel className="border border-[var(--border-color)] rounded-xl shadow-2xl max-w-3xl w-full mx-4 z-10 overflow-hidden relative p-0">
        <div className="h-64 bg-[var(--card-bg)] relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-body)] to-transparent z-10"></div>
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-80"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-[var(--bg-body)]/50 hover:bg-[var(--text-primary)]/10 text-[var(--text-primary)] p-2 rounded-full transition-colors z-20 border border-[var(--text-primary)]/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="p-8 relative z-20 -mt-12">
          <span className="inline-block px-3 py-1 text-[10px] font-bold rounded-full bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] border border-[hsl(var(--accent))]/20 uppercase tracking-wider mb-4">
            {project.category}
          </span>
          <h3 className="font-mono font-bold text-3xl mb-2 text-[var(--text-primary)]">{project.title}</h3>
          <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">{project.description}</p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <CleanCard className="p-6 rounded-lg">
              <h4 className="font-mono font-bold text-sm text-[var(--text-primary)] mb-4 uppercase tracking-wider">Technologies Used</h4>
              <ul className="space-y-2">
                {project.technologies.map((tech, index) => (
                  <li key={index} className="text-sm text-[var(--text-secondary)] flex items-center">
                    <span className="w-1.5 h-1.5 bg-[hsl(var(--accent))] rounded-full mr-2"></span>
                    {tech}
                  </li>
                ))}
              </ul>
            </CleanCard>
            <CleanCard className="p-6 rounded-lg">
              <h4 className="font-mono font-bold text-sm text-[var(--text-primary)] mb-4 uppercase tracking-wider">Team Members</h4>
              <ul className="space-y-2">
                {project.team.map((member, index) => (
                  <li key={index} className="text-sm text-[var(--text-secondary)] flex items-center">
                    <span className="w-1.5 h-1.5 bg-[hsl(var(--accent))] rounded-full mr-2"></span>
                    {member}
                  </li>
                ))}
              </ul>
            </CleanCard>
          </div>

          <div className="flex justify-end">
            <button className="btn-primary px-8 py-3 text-sm font-medium flex items-center">
              Contact Team
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

export default ProjectModal;
