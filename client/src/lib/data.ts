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

// Club Events (empty by default; populated dynamically from MongoDB)
export const events: Event[] = [];

// Verified Faculty Mentors and Core Team Leads (loaded dynamically from MongoDB)
export const teamMembers: TeamMember[] = [];

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

export const upcomingEvents: any[] = [];

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