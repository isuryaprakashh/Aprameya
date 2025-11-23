import { useState } from 'react';
import { Link } from 'wouter';
import { projects } from '../lib/data';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import { Project } from '../lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Users } from 'lucide-react';
import ProximityMatrix from '../components/backgrounds/ProximityMatrix';
import { motion } from 'framer-motion';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Filter projects based on search and category
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  return (
    <div className="fadeIn">
      {/* Header Section */}
      <section className="relative py-24 px-4 bg-[var(--bg-body)] border-b border-[var(--border-color)] overflow-hidden">
        <ProximityMatrix />
        <div className="absolute inset-0 dither-bg opacity-30 pointer-events-none"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-[var(--text-primary)] text-[var(--bg-body)] px-1 text-xs font-bold">02</span>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">INNOVATION_LAB</h2>
            </div>
            <h1 className="font-bold text-5xl md:text-7xl mb-6 leading-[0.9] text-[var(--text-primary)]">
              INNOVATIVE<br />PROJECTS
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-xl mb-12 font-mono leading-relaxed">
              Explore our cutting-edge autonomous vehicle projects and research initiatives
              that are shaping the future of transportation. From neural networks to hardware integration.
            </p>

            {/* Featured Project Highlight */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg max-w-2xl">
              <div className="w-12 h-12 bg-[hsl(var(--accent))]/10 flex items-center justify-center rounded-md border border-[hsl(var(--accent))]/20 shrink-0">
                <Users className="w-6 h-6 text-[hsl(var(--accent))]" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-[hsl(var(--accent))] font-bold uppercase tracking-wider mb-1">Featured Project</div>
                <div className="text-[var(--text-primary)] font-bold">Autonomous Navigation System v2.0</div>
                <div className="text-xs text-gray-400">AI/ML • Active Development</div>
              </div>
              <Button className="w-full sm:w-auto ml-auto btn-primary" size="sm" onClick={() => {
                const project = projects.find(p => p.id === '1');
                if (project) handleViewDetails(project);
              }}>
                View Details
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-[var(--bg-body)]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-5 h-5" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] focus:border-[hsl(var(--accent))]/50"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px] bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ProjectCard
                    project={project}
                    onViewDetails={handleViewDetails}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-[var(--text-secondary)]">No projects found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* CTA Section */}
      <section className="py-16 px-4 bg-[var(--bg-body)]">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent))]/80 rounded-2xl p-8 md:p-12 text-[var(--bg-body)] text-center shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--bg-body)]">
                Ready to Build the Future?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto font-medium">
                Join our community of innovators and start your journey in autonomous systems.
                Whether you're a coder, designer, or hardware enthusiast, there's a place for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-[var(--card-bg)] text-[hsl(var(--accent))] hover:bg-[var(--card-bg)]/90 font-bold border-0">
                  <Link href="/signup">
                    <Users className="mr-2 h-5 w-5" />
                    Join Now
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent border-[var(--bg-body)] text-[var(--bg-body)] hover:bg-[var(--bg-body)]/10 hover:text-[var(--bg-body)]">
                  <Link href="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Projects;
