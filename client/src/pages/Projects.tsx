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
      <section className="relative py-24 bg-[var(--bg-body)] border-b border-[var(--border-color)] overflow-hidden">
        <div className="absolute inset-0">
          <ProximityMatrix />
        </div>
        <div className="absolute inset-0 dither-bg opacity-30 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <motion.div
            className="text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4 border-[hsl(var(--accent))] text-[hsl(var(--accent))]">
              Our Work
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[var(--text-primary)]">
              Innovative Projects
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
              Explore our cutting-edge autonomous vehicle projects and research initiatives
              that are shaping the future of transportation.
            </p>
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
      <section className="py-16 bg-[var(--bg-body)]">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-[var(--text-primary)]">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Build the Future?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Join our community of innovators and start your journey in autonomous systems.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-[var(--card-bg)] text-[hsl(var(--accent))] hover:bg-[var(--card-bg)]/90 font-semibold">
                  <Link href="/signup">
                    <Users className="mr-2 h-5 w-5" />
                    Join Now
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-body)]/10">
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
