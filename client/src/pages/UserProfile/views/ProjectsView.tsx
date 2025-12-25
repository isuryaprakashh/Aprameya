import { motion } from 'framer-motion';
import { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaProjectDiagram, FaPlus, FaTrash, FaArrowRight } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { Project } from '@/lib/types';
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
        staleTime: 5000,
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
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h2>
                    <Button onClick={() => handleCreate('project')} className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90"><FaPlus className="mr-2" /> New Project</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <div key={project.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative aspect-video">
                                {project.image ? (
                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[var(--bg-body)]">
                                        <FaProjectDiagram className="text-5xl text-[var(--text-secondary)]/20" />
                                    </div>
                                )}
                                <Badge className="absolute top-3 left-3 bg-[var(--bg-body)] text-[var(--text-primary)] border shadow-sm">
                                    {project.category}
                                </Badge>
                            </div>
                            <div className="p-4">
                                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2 line-clamp-1">{project.title}</h3>
                                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">{project.description}</p>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleEdit(project, 'project')} className="flex-1 h-8 text-xs" variant="outline">Edit</Button>
                                    <Button onClick={() => handleDelete(project.id, 'project')} className="h-8 w-8 p-0" variant="destructive"><FaTrash className="w-3 h-3" /></Button>
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
            <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
                        <FaProjectDiagram className="text-2xl text-[hsl(var(--accent))]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Explore Our Projects</h2>
                        <p className="text-[var(--text-secondary)] text-sm">Discover innovative projects by our community</p>
                    </div>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--card-bg)]/20">
                        <FaProjectDiagram className="mx-auto text-4xl text-[var(--text-secondary)] mb-4" />
                        <p className="text-[var(--text-secondary)] text-lg">No projects found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="clean-card group h-full flex flex-col"
                            >
                                {project.image && (
                                    <div className="h-48 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-body)]/80 to-transparent z-10" />
                                        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100" />
                                        <div className="absolute top-4 right-4 z-20">
                                            <span className="px-3 py-1 rounded-full bg-[var(--bg-body)]/70 backdrop-blur-md text-xs font-mono text-[hsl(var(--accent))] border border-[hsl(var(--accent))]/30">
                                                {project.category}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <CardHeader className="relative z-10">
                                    <CardTitle className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[hsl(var(--accent))] transition-colors">{project.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow relative z-10">
                                    <p className="text-[var(--text-secondary)] line-clamp-3 text-sm leading-relaxed mb-4">{project.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(project.technologies) && project.technologies.map((tech: string, idx: number) => (
                                            <span key={idx} className="px-2 py-1 rounded bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] text-xs font-mono">
                                                {tech.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t border-[var(--border-color)] bg-[var(--card-bg)]/20 p-4 relative z-10">
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleViewDetails(project)}
                                        className="w-full text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]/80 hover:bg-[hsl(var(--accent))]/10 group-hover:translate-x-1 transition-all"
                                    >
                                        View Details <FaArrowRight className="ml-2" />
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
