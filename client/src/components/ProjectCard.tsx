import { useState } from 'react';
import { Project } from '../lib/types';
import { ChevronLeft, ChevronRight, Moon } from 'lucide-react';
import MagneticWrap from './ui/MagneticWrap';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  viewMode?: 'grid' | 'list';
}

const ProjectCard = ({ project, onViewDetails, viewMode = 'grid' }: ProjectCardProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use project image and some placeholders for the slider
  const slides = [
    project.image,
    "https://images.unsplash.com/photo-1501854140884-074bf6b243e7?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop"
  ];

  const moveSlide = (direction: number) => {
    setCurrentSlide((prev) => (prev + direction + slides.length) % slides.length);
  };

  return (
    <div className="clean-card group h-full flex flex-col">
      <div className="shimmer pointer-events-none"></div>

      {/* Image Slider */}
      <div className="relative h-[320px] w-full overflow-hidden">
        <div
          className="slide-track h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="slide-item">
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-700"
              />
            </div>
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

        {/* Controls */}
        <div className="absolute bottom-6 right-6 flex gap-2 z-20">
          <button
            onClick={(e) => { e.stopPropagation(); moveSlide(-1); }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 text-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); moveSlide(1); }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 text-white transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-6 left-6 z-20">
          <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-medium uppercase tracking-wider text-white">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col grow">
        <h3 className="text-2xl font-medium text-white mb-2">{project.title}</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-3 grow">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span key={index} className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded text-gray-400">
              {tech}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <MagneticWrap>
            <button
              onClick={() => onViewDetails(project)}
              className="w-full btn-primary py-3 text-sm flex items-center justify-between px-6 magnetic-target"
            >
              <span>View Details</span>
              <Moon className="w-4 h-4 text-gray-500" />
            </button>
          </MagneticWrap>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
