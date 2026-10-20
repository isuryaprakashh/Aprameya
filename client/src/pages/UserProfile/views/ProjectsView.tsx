import { motion } from 'framer-motion';
import { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaProjectDiagram, FaPlus, FaTrash, FaArrowRight } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { Project } from '@/lib/types';
import { projects as fallbackProjects } from '@/lib/data';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import ProjectModal from '@/components/ProjectModal';

interface ProjectsViewProps {
    handleEdit: (item: Project, type: string) => void;
    handleCreate: (type: string) => void;
    handleDelete: (id: string, type: string) => void;
}

export default function ProjectsView({ handleEdit, handleCreate, handleDelete }: ProjectsViewProps) {
    const { user: currentUser } = useAuth();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: projects = [] } = useQuery<Project[]>({
        queryKey: ['/api/projects'],
        initialData: fallbackProjects,
        staleTime: 60000,
    });

    const handleViewDetails = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    // Admin View
    if (currentUser?.role === 'ADMIN') {
        return (
            <div className="animate-in fade-in space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-display font-medium text-[var(--text)] tracking-tight">Projects</h2>
                    <Button onClick={() => handleCreate('project')} className="bg-[var(--red)] hover:bg-[var(--red-hover)] text-white text-xs h-9 rounded-[var(--r-md)]"><FaPlus className="mr-2" /> New Project</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <div key={project.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-lg)] overflow-hidden hover:border-[var(--border-strong)] transition-colors">
                            <div className="relative aspect-video">
                                {project.image ? (
                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[var(--surface-2)]">
                                        <FaProjectDiagram className="text-5xl text-[var(--text-3)]" />
                                    </div>
                                )}
                                <Badge className="absolute top-3 left-3 bg-[var(--surface)]/90 backdrop-blur-sm text-[var(--text-2)] border border-[var(--border)] text-xs font-mono">
                                    {project.category}
                                </Badge>
                            </div>
                            <div className="p-4">
                                <h3 className="text-base font-display font-medium text-[var(--text)] mb-2 line-clamp-1">{project.title}</h3>
                                <p className="text-sm text-[var(--text-2)] line-clamp-2 mb-3">{project.description}</p>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleEdit(project, 'project')} className="flex-1 h-8 text-xs rounded-[var(--r-sm)] border-[var(--border)]" variant="outline">Edit</Button>
                                    <Button onClick={() => handleDelete(project.id || (project as any)._id, 'project')} className="h-8 w-8 p-0 rounded-[var(--r-sm)]" variant="destructive"><FaTrash className="w-3 h-3" /></Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // User View
    return (
        <div className="space-y-6">
            <div className="bg-[var(--surface)] p-6 rounded-[var(--r-lg)] border border-[var(--border)]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-[var(--r-sm)] bg-[var(--red-soft)] border border-[var(--red-line)] text-[var(--red-text)]">
                        <FaProjectDiagram className="text-xl text-[var(--red)]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-medium text-[var(--text)] tracking-tight">Explore Our Projects</h2>
                        <p className="text-[var(--text-2)] text-sm">Discover innovative projects by our community</p>
                    </div>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-[var(--r-md)] bg-[var(--surface-2)]/30">
                        <FaProjectDiagram className="mx-auto text-4xl text-[var(--text-3)] mb-4" />
                        <p className="text-[var(--text-2)] text-base">No projects found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-[var(--r-lg)] overflow-hidden group h-full flex flex-col transition-colors"
                            >
                                {project.image && (
                                    <div className="h-48 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/90 to-transparent z-10" />
                                        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute top-4 right-4 z-20">
                                            <span className="px-2.5 py-1 rounded-[var(--r-sm)] bg-[var(--surface)]/90 backdrop-blur-md text-xs font-mono text-[var(--text-2)] border border-[var(--border)]">
                                                {project.category}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <CardHeader className="relative z-10 pb-2">
                                    <CardTitle className="text-lg font-display font-medium text-[var(--text)] group-hover:text-[var(--red-text)] transition-colors">{project.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow relative z-10 pb-4">
                                    <p className="text-[var(--text-2)] line-clamp-3 text-sm leading-relaxed mb-4">{project.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(project.technologies) && project.technologies.map((tech: string, idx: number) => (
                                            <span key={idx} className="px-2 py-0.5 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-3)] text-xs font-mono">
                                                {tech.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t border-[var(--border)] bg-[var(--surface-2)]/30 p-3 relative z-10">
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleViewDetails(project)}
                                        className="w-full text-xs text-[var(--text-2)] hover:text-[var(--red-text)] hover:bg-[var(--surface-2)] transition-colors justify-between"
                                    >
                                        View Details <FaArrowRight className="ml-2 w-3 h-3 text-[var(--red)]" />
                                    </Button>
                                </CardFooter>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                project={selectedProject}
            />
        </div>
    );
}
