import { Project, BlogPost, ResearchItem, Event, TeamMember, StatItem } from "./types";

// Sample data for projects
export const projects: Project[] = [
  {
    id: "1",
    title: "Autonomous Navigation System",
    description: "Developed an advanced navigation system using computer vision and deep learning for real-world autonomous vehicle applications.",
    category: "Autonomous Driving",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    technologies: ["Python", "TensorFlow", "ROS", "OpenCV"],
    team: ["John Doe", "Jane Smith", "Robert Johnson"]
  },
  {
    id: "2",
    title: "Smart Traffic Management",
    description: "AI-powered traffic management system to reduce congestion and improve road safety using real-time data analysis.",
    category: "Smart City",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    technologies: ["Python", "Computer Vision", "IoT", "Machine Learning"],
    team: ["Michael Brown", "Sarah Williams", "David Miller"]
  },
  {
    id: "3",
    title: "Drone Delivery System",
    description: "Autonomous drone system for efficient package delivery in urban environments with obstacle avoidance.",
    category: "Drones",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    technologies: ["C++", "ROS", "Flight Control", "GPS Navigation"],
    team: ["Emily Johnson", "Mark Wilson", "Lisa Chen"]
  },
  {
    id: "4",
    title: "Vehicle-to-Vehicle Communication",
    description: "Developing V2V communication protocols for coordinated autonomous vehicle movement in traffic scenarios.",
    category: "Connected Vehicles",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    technologies: ["C++", "Networking", "Protocol Design", "Real-time Systems"],
    team: ["Alex Turner", "Maria Garcia", "James Wilson"]
  },
  {
    id: "5",
    title: "Autonomous Parking Assistant",
    description: "Smart parking system that automatically finds and navigates to available parking spaces using sensor fusion.",
    category: "Parking Solutions",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    technologies: ["Python", "Sensor Fusion", "Path Planning", "Computer Vision"],
    team: ["Sophie Chen", "Ryan Martinez", "Emma Thompson"]
  },
  {
    id: "6",
    title: "Predictive Maintenance System",
    description: "AI-driven system for predicting vehicle maintenance needs to ensure optimal performance and safety.",
    category: "Maintenance",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    technologies: ["Machine Learning", "Data Analytics", "IoT Sensors", "Python"],
    team: ["Daniel Kim", "Isabella Rodriguez", "Lucas Anderson"]
  }
];

// Sample data for blog posts
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Autonomous Vehicles",
    excerpt: "Exploring the potential impact of self-driving cars on urban transportation.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
    category: "Technology",
    date: "2023-04-15",
    image: "/images/blog1.jpg",
    author: "John Doe"
  },
  {
    id: "2",
    title: "Machine Learning in Autonomous Navigation",
    excerpt: "How AI is revolutionizing the way vehicles navigate complex environments.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
    category: "AI",
    date: "2023-05-22",
    image: "/images/blog2.jpg",
    author: "Jane Smith"
  },
  {
    id: "3",
    title: "Ethical Considerations in AI Transportation",
    excerpt: "Addressing the moral and ethical challenges of autonomous systems.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
    category: "Ethics",
    date: "2023-06-10",
    image: "/images/blog3.jpg",
    author: "Robert Johnson"
  }
];

// Sample data for research items
export const researchItems: ResearchItem[] = [
  {
    id: "1",
    title: "Advanced Perception Systems for Autonomous Vehicles",
    description: "Research on improving computer vision systems for adverse weather conditions.",
    category: "Computer Vision",
    date: "2023-03-15",
    image: "/images/research1.jpg",
    authors: ["Dr. John Doe", "Dr. Sarah Williams"],
    citations: 42
  },
  {
    id: "2",
    title: "Reinforcement Learning for Urban Navigation",
    description: "Novel approaches to teaching autonomous vehicles to navigate complex urban environments.",
    category: "Machine Learning",
    date: "2023-04-20",
    image: "/images/research2.jpg",
    authors: ["Dr. Michael Brown", "Dr. Lisa Chen"],
    citations: 28
  },
  {
    id: "3",
    title: "Cooperative Autonomous Systems",
    description: "Research on vehicle-to-vehicle communication for coordinated movement in traffic.",
    category: "Connected Vehicles",
    date: "2023-05-10",
    image: "/images/research3.jpg",
    authors: ["Dr. David Miller", "Dr. Emily Johnson"],
    citations: 35
  }
];

// Sample data for events
export const events: Event[] = [
  {
    id: "1",
    title: "Annual Autonomous Vehicle Symposium",
    type: "Conference",
    date: "2024-03-15",
    day: "15",
    month: "Mar",
    year: "2024",
    time: "9:00 AM - 5:00 PM",
    location: "Main Auditorium, KLU Campus",
    description: "Join us for our annual symposium showcasing the latest advancements in autonomous vehicle technology with industry experts and researchers.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "2",
    title: "Hackathon: Future Mobility Solutions",
    type: "Hackathon",
    date: "2024-04-10",
    day: "10",
    month: "Apr",
    year: "2024",
    time: "10:00 AM - 8:00 PM",
    location: "Innovation Hub, Engineering Block",
    description: "A 10-hour hackathon challenging participants to develop innovative solutions for future mobility challenges with exciting prizes.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "3",
    title: "Workshop on Sensor Fusion",
    type: "Workshop",
    date: "2024-05-05",
    day: "05",
    month: "May",
    year: "2024",
    time: "2:00 PM - 5:00 PM",
    location: "Lab 201, Technology Building",
    description: "Hands-on workshop on integrating multiple sensors for robust autonomous navigation systems with practical demonstrations.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "4",
    title: "Industry Panel: Future of Transportation",
    type: "Panel Discussion",
    date: "2024-06-20",
    day: "20",
    month: "Jun",
    year: "2024",
    time: "3:00 PM - 5:00 PM",
    location: "Virtual Event",
    description: "Panel discussion with industry leaders discussing the future of autonomous transportation and career opportunities.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

// Sample data for team members
export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Dr. John Doe",
    role: "Faculty Advisor",
    department: "Computer Science",
    year: "Professor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    socialLinks: {
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
      email: "john.doe@klu.ac.in"
    }
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "President",
    department: "Electrical Engineering",
    year: "4th Year",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    socialLinks: {
      linkedin: "https://linkedin.com/in/janesmith",
      github: "https://github.com/janesmith",
      email: "jane.smith@klu.ac.in"
    }
  },
  {
    id: "3",
    name: "Robert Johnson",
    role: "Technical Lead",
    department: "Mechanical Engineering",
    year: "3rd Year",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    socialLinks: {
      linkedin: "https://linkedin.com/in/robertjohnson",
      github: "https://github.com/robertjohnson",
      email: "robert.johnson@klu.ac.in"
    }
  },
  {
    id: "4",
    name: "Sarah Williams",
    role: "Research Coordinator",
    department: "Computer Science",
    year: "4th Year",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahwilliams",
      github: "https://github.com/sarahwilliams",
      email: "sarah.williams@klu.ac.in"
    }
  },
  {
    id: "5",
    name: "Michael Brown",
    role: "Event Coordinator",
    department: "Electronics Engineering",
    year: "3rd Year",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    socialLinks: {
      linkedin: "https://linkedin.com/in/michaelbrown",
      github: "https://github.com/michaelbrown",
      email: "michael.brown@klu.ac.in"
    }
  },
  {
    id: "6",
    name: "Emily Chen",
    role: "Marketing Lead",
    department: "Information Technology",
    year: "3rd Year",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    socialLinks: {
      linkedin: "https://linkedin.com/in/emilychen",
      github: "https://github.com/emilychen",
      email: "emily.chen@klu.ac.in"
    }
  }
];

// Sample data for statistics
export const stats: StatItem[] = [
  {
    value: "15+",
    label: "Projects Completed"
  },
  {
    value: "25+",
    label: "Team Members"
  },
  {
    value: "10+",
    label: "Awards Won"
  },
  {
    value: "5+",
    label: "Research Publications"
  }
];

// Sample data for blog categories
export const blogCategories = [
  "All",
  "Technology",
  "AI",
  "Ethics",
  "Research",
  "Case Studies"
];

// Sample data for upcoming events
export const upcomingEvents = [
  {
    id: "5",
    title: "Guest Lecture: Future of Mobility",
    day: "15",
    month: "Dec",
    date: "2024-12-15",
    location: "Virtual Event"
  },
  {
    id: "6",
    title: "Winter Project Showcase",
    day: "20",
    month: "Dec", 
    date: "2024-12-20",
    location: "Main Auditorium"
  },
  {
    id: "7",
    title: "New Year Tech Meetup",
    day: "05",
    month: "Jan",
    date: "2025-01-05",
    location: "Innovation Hub"
  }
];

// Sample data for featured items
export const featuredItems = [
  {
    id: "1",
    type: "project",
    title: "Autonomous Navigation System",
    description: "Developed an advanced navigation system using computer vision and deep learning for real-world autonomous vehicle applications.",
    category: "Autonomous Driving",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    link: "/projects"
  },
  {
    id: "2",
    type: "blog",
    title: "The Future of Autonomous Vehicles",
    description: "Exploring the potential impact of self-driving cars on urban transportation and the challenges ahead.",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1555353540-64580b51c258?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    link: "/blogs"
  },
  {
    id: "3",
    type: "research",
    title: "Advanced Perception Systems",
    description: "Research on improving computer vision systems for adverse weather conditions in autonomous vehicles.",
    category: "Computer Vision",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    link: "/research"
  }
];