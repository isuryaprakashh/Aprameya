import { Project, BlogPost, ResearchItem, Event, TeamMember, StatItem } from "./types";

// Sample data for projects
export const projects: Project[] = [
  {
    id: "1",
    title: "Autonomous Navigation System",
    description: "Developed an advanced navigation system using computer vision and deep learning for real-world autonomous vehicle applications.",
    category: "Autonomous Driving",
    image: "/assets/feature_navigation.png",
    technologies: ["Python", "TensorFlow", "ROS", "OpenCV"],
    team: ["John Doe", "Jane Smith", "Robert Johnson"]
  },
  {
    id: "2",
    title: "Smart Traffic Management",
    description: "AI-powered traffic management system to reduce congestion and improve road safety using real-time data analysis.",
    category: "Smart City",
    image: "/assets/project_traffic_mgmt.png",
    technologies: ["Python", "Computer Vision", "IoT", "Machine Learning"],
    team: ["Michael Brown", "Sarah Williams", "David Miller"]
  },
  {
    id: "3",
    title: "Drone Delivery System",
    description: "Autonomous drone system for efficient package delivery in urban environments with obstacle avoidance.",
    category: "Drones",
    image: "/assets/project_drone_delivery.png",
    technologies: ["C++", "ROS", "Flight Control", "GPS Navigation"],
    team: ["Emily Johnson", "Mark Wilson", "Lisa Chen"]
  },
  {
    id: "4",
    title: "Vehicle-to-Vehicle Communication",
    description: "Developing V2V communication protocols for coordinated autonomous vehicle movement in traffic scenarios.",
    category: "Connected Vehicles",
    image: "/assets/project_v2v_comm.png",
    technologies: ["C++", "Networking", "Protocol Design", "Real-time Systems"],
    team: ["Alex Turner", "Maria Garcia", "James Wilson"]
  },
  {
    id: "5",
    title: "Autonomous Parking Assistant",
    description: "Smart parking system that automatically finds and navigates to available parking spaces using sensor fusion.",
    category: "Parking Solutions",
    image: "/assets/project_smart_parking.png",
    technologies: ["Python", "Sensor Fusion", "Path Planning", "Computer Vision"],
    team: ["Sophie Chen", "Ryan Martinez", "Emma Thompson"]
  },
  {
    id: "6",
    title: "Predictive Maintenance System",
    description: "AI-driven system for predicting vehicle maintenance needs to ensure optimal performance and safety.",
    category: "Maintenance",
    image: "/assets/project_predictive_maint.png",
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
    image: "/assets/feature_vehicle.png",
    author: "John Doe"
  },
  {
    id: "2",
    title: "Machine Learning in Autonomous Navigation",
    excerpt: "How AI is revolutionizing the way vehicles navigate complex environments.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
    category: "AI",
    date: "2023-05-22",
    image: "/assets/blog_ml_nav.png",
    author: "Jane Smith"
  },
  {
    id: "3",
    title: "Ethical Considerations in AI Transportation",
    excerpt: "Addressing the moral and ethical challenges of autonomous systems.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
    category: "Ethics",
    date: "2023-06-10",
    image: "/assets/blog_ethics.png",
    author: "Robert Johnson"
  }
];

// Sample data for research items
export const researchItems: ResearchItem[] = [
  {
    id: 1,
    title: "Autonomous Navigation in Unstructured Environments",
    category: "Robotics",
    description: "A novel approach to path planning and obstacle avoidance in complex, unstructured terrains using deep reinforcement learning.",
    authors: ["S. Prakash", "Research Team"],
    image: "https://images.unsplash.com/photo-1549637642-90187f64f420",
    date: "2024",
    link: "#",
  },
  {
    id: 2,
    title: "Eco-Friendly Propulsion Systems",
    category: "Sustainability",
    description: "Investigation into high-efficiency electric propulsion systems for next-generation autonomous vehicles.",
    authors: ["Green Tech Lab"],
    image: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e",
    date: "2023",
    link: "#",
  },
  {
    id: 3,
    title: "Swarm Intelligence in Drone Fleets",
    category: "AI",
    description: "Analyzing the efficiency of bio-inspired swarm algorithms for coordinated drone missions in search and rescue operations.",
    authors: ["DeepMind Team"],
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
    date: "2025",
    link: "#",
  },
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
    image: "/assets/event_symposium.png"
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
    image: "/assets/event_hackathon.png"
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
    image: "/assets/event_workshop.png"
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
    image: "/assets/event_panel.png"
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
    image: "/assets/team_avatar_1.png",
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
    image: "/assets/team_avatar_2.png",
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
    image: "/assets/team_avatar_3.png",
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
    image: "/assets/team_avatar_4.png",
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
    image: "/assets/feature_navigation.png",
    link: "/projects"
  },
  {
    id: "2",
    type: "blog",
    title: "The Future of Autonomous Vehicles",
    description: "Exploring the potential impact of self-driving cars on urban transportation and the challenges ahead.",
    category: "Technology",
    image: "/assets/feature_vehicle.png",
    link: "/blogs"
  },
  {
    id: "3",
    type: "research",
    title: "Advanced Perception Systems",
    description: "Research on improving computer vision systems for adverse weather conditions in autonomous vehicles.",
    category: "Computer Vision",
    image: "/assets/feature_perception.png",
    link: "/research"
  }
];