export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  team: string[];
  is_featured?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  image: string;
  author: string;
}

export interface ResearchItem {
  id: number;
  title: string;
  category: string;
  description: string;
  authors: string | string[];
  image: string;
  date: string;
  link?: string;
  content?: string;
}

export interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  day: string;
  month: string;
  year: string;
  time: string;
  location: string;
  description: string;
  image: string;
  capacity?: number | null;
  registrationOpen?: boolean;
  ticketEnabled?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  year: string;
  image: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

export interface StatItem {
  value: string;
  label: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  rollNumber?: string;
  password?: string;
  created_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registered_at?: string;
  event?: Event;
  user?: User;
}

export interface TicketRegistration {
  id: string;
  eventId: string;
  userId?: string;
  fullName: string;
  rollNumber: string;
  year: number;
  scanned: boolean;
  scannedAt: string | null;
  createdAt: string;
  qrDataUrl?: string;
  qrToken?: string;
  event?: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    image?: string;
    type?: string;
  } | null;
}
