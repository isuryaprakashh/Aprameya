import { Project, BlogPost, ResearchItem, Event, TeamMember, StatItem } from "./types";

// Real projects verified from repository records and active development
// If empty, pages dynamically render the UnderConstruction state.
export const projects: Project[] = [
  {
    id: "1",
    title: "Urban Vision AI & Autonomous Mobility",
    description: "Multi-camera object detection, lane tracking, and spatial path-planning pipeline built for real-world urban navigation challenges. Awarded National 3rd Place at IISc Bengaluru.",
    category: "Autonomous Systems",
    image: "/assets/UVH.jpg",
    technologies: ["Python", "ROS 2", "Computer Vision", "PyTorch", "SLAM"],
    team: [
      "Singavarapu Sai Revanth",
      "Akula Venkata Praveen",
      "Atmakuri Komal Sai Raj",
      "Kamsani Yashwanth Chowdary"
    ],
    is_featured: true
  }
];

// Verified blog writeups (empty by default; populated via DB or markdown drafts)
export const blogPosts: BlogPost[] = [];

// Verified research publications (empty by default; populated via peer-reviewed DB entries)
export const researchItems: ResearchItem[] = [];

// Club Events
export const events: Event[] = [
  {
    id: "1",
    title: "Autonomous Navigation & Perception Workshop",
    type: "Workshop",
    date: "2026-09-20",
    day: "20",
    month: "Sep",
    year: "2026",
    time: "10:00 AM - 4:00 PM",
    location: "R&D Block 609E, KL University",
    description: "Hands-on session covering ROS 2 nodes, LiDAR point-cloud processing, and camera-sensor calibration for autonomous mobility platforms.",
    image: "/assets/UVH.jpg",
    capacity: 60,
    registrationOpen: true,
    ticketEnabled: true
  }
];

// Verified Faculty Mentors and Core Team Leads
export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Prof. Hari Kiran Vege",
    role: "Faculty Advisor & Mentor",
    department: "Computer Science & Engineering",
    year: "Faculty",
    image: "/assets/team_avatar_1.png",
    socialLinks: {
      email: "vegeharikiran@kluniversity.in"
    }
  },
  {
    id: "2",
    name: "Mr. Srikanth Annamareddy",
    role: "Technical Mentor",
    department: "Robotics & Autonomous Systems",
    year: "Faculty / Lead",
    image: "/assets/team_avatar_2.png",
    socialLinks: {
      email: "srikanth.a@kluniversity.in"
    }
  },
  {
    id: "3",
    name: "Singavarapu Sai Revanth",
    role: "Core Team Lead",
    department: "Computer Science",
    year: "Core Team",
    image: "/assets/team_avatar_3.png",
    socialLinks: {
      linkedin: "https://linkedin.com",
      github: "https://github.com"
    }
  },
  {
    id: "4",
    name: "Akula Venkata Praveen",
    role: "Perception & Vision Lead",
    department: "Computer Science",
    year: "Core Team",
    image: "/assets/team_avatar_4.png",
    socialLinks: {
      linkedin: "https://linkedin.com",
      github: "https://github.com"
    }
  },
  {
    id: "5",
    name: "Atmakuri Komal Sai Raj",
    role: "Embedded & Systems Lead",
    department: "Electronics & Computer Engineering",
    year: "Core Team",
    image: "/assets/team_avatar_1.png",
    socialLinks: {
      linkedin: "https://linkedin.com",
      github: "https://github.com"
    }
  },
  {
    id: "6",
    name: "Kamsani Yashwanth Chowdary",
    role: "Integration & Testing Lead",
    department: "Computer Science",
    year: "Core Team",
    image: "/assets/team_avatar_2.png",
    socialLinks: {
      linkedin: "https://linkedin.com",
      github: "https://github.com"
    }
  }
];

// Verified club metrics
export const stats: StatItem[] = [
  {
    value: "2019",
    label: "Founded"
  },
  {
    value: "50+",
    label: "Active Members"
  },
  {
    value: "3rd",
    label: "National Rank (IISc)"
  },
  {
    value: "100%",
    label: "Hands-on Engineering"
  }
];

export const blogCategories = [
  "All",
  "Autonomous Systems",
  "Computer Vision",
  "Robotics & Control",
  "Edge AI",
  "Field Notes"
];

export const upcomingEvents = [
  {
    id: "1",
    title: "Autonomous Navigation & Perception Workshop",
    day: "20",
    month: "Sep",
    date: "2026-09-20",
    location: "R&D Block 609E, KL University"
  }
];

export const featuredItems = [
  {
    id: "1",
    type: "project",
    title: "Urban Vision AI & Autonomous Mobility",
    description: "Multi-camera computer vision, object detection, and spatial path-planning pipeline that secured National 3rd Place at IISc Bengaluru.",
    category: "Autonomous Systems",
    image: "/assets/UVH.jpg",
    link: "/projects"
  }
];