import { z } from "zod";

// Define user roles as enum for type safety
export const UserRole = {
  ASPIRANT: "ASPIRANT",
  CORE: "CORE",
  ADMIN: "ADMIN",
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  email: z.string().email("Invalid email address"),
  rollNumber: z.string().length(10, "Roll number must be exactly 10 digits").regex(/^\d{10}$/, "Roll number must contain only digits"),
});

export const updateUserProfileSchema = z.object({
  display_name: z.string().optional(),
  profile_image: z.string().optional(),
  department: z.string().optional(),
  year: z.string().optional(),
  role_title: z.string().optional(),
  tags: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  bio: z.string().optional(),
  // Add these for profile updates
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(1, "Password cannot be empty").optional(),
});

export const insertProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().min(1, "Image is required"),
  technologies: z.string().min(1, "Technologies are required"),
  team: z.string().min(1, "Team is required"),
  user_id: z.string().optional(), // Handled by backend
  is_featured: z.boolean().default(false).optional(),
});

export const insertBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().min(1, "Image is required"),
  user_id: z.string().optional(), // Handled by backend
});

export const insertResearchSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  authors: z.string().min(1, "Authors are required"),
  image: z.string().min(1, "Image is required"),
  user_id: z.string().optional(), // Handled by backend
});

export const insertEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  image: z.string().min(1, "Image is required"),
  user_id: z.string().optional(), // Handled by backend
  capacity: z.number().int().positive().nullable().optional(),
  registrationOpen: z.boolean().optional(),
  ticketEnabled: z.boolean().optional(),
});

export const insertEventRegistrationSchema = z.object({
  event_id: z.string().min(1, "Event ID is required"),
  message: z.string().optional(),
  user_id: z.string().optional(), // Handled by backend
});



export const insertMessageSchema = z.object({
  content: z.string().min(1, "Content is required"),
  user_id: z.string().optional(), // Handled by backend
});

export const insertTicketRegistrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100),
  rollNumber: z.string().length(10, "Roll number must be exactly 10 digits").regex(/^\d{10}$/, "Roll number must contain only digits"),
  year: z.number().int().min(1).max(4),
  eventId: z.string().min(1, "Event ID is required"),
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;

// We need to define the "Select" types manually or based on what Mongoose returns
// For simplicity, we'll define them as interfaces matching the Mongoose schema + _id
export interface User {
  _id: string;
  id: string;
  username: string;
  password?: string;
  email: string;
  rollNumber: string;
  role: string;
  created_at: Date | string;
  display_name?: string | null;
  profile_image?: string | null;
  department?: string | null;
  year?: string | null;
  role_title?: string | null;
  tags?: string | null;
  linkedin?: string | null;
  github?: string | null;
  bio?: string | null;
  domain?: string | null;
  title?: string | null;
}

export type InsertProject = z.infer<typeof insertProjectSchema>;
export interface Project {
  _id: string;
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  technologies: string;
  team: string;
  created_at: Date | string;
  user_id: string;
  is_featured?: boolean;
}

export type InsertBlog = z.infer<typeof insertBlogSchema>;
export interface Blog {
  _id: string;
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  date: Date | string;
  user_id: string;
}

export type InsertResearch = z.infer<typeof insertResearchSchema>;
export interface Research {
  _id: string;
  id: string;
  title: string;
  description: string;
  category: string;
  authors: string;
  image: string;
  date: Date | string;
  user_id: string;
}

export type InsertEvent = z.infer<typeof insertEventSchema>;
export interface Event {
  _id: string;
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  time: string;
  location: string;
  image: string;
  user_id: string;
  capacity?: number | null;
  registrationOpen?: boolean;
  ticketEnabled?: boolean;
}

export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;
export interface EventRegistration {
  _id: string;
  id: string;
  event_id: string;
  user_id: string;
  message?: string | null;
  created_at: Date | string;
}



export type InsertMessage = z.infer<typeof insertMessageSchema>;
export interface Message {
  _id: string;
  id: string;
  content: string;
  created_at: Date | string;
  user_id: string;
}

export type InsertTicketRegistration = z.infer<typeof insertTicketRegistrationSchema>;
export interface TicketRegistration {
  _id: string;
  id: string;
  eventId: string;
  userId: string;
  fullName: string;
  rollNumber: string;
  year: number;
  qrToken: string;
  entryCode: string;
  scanned: boolean;
  scannedAt: Date | string | null;
  scannedBy?: string | null;
  scannedByName?: string | null;
  createdAt: Date | string;
}

// Recruitment
export const CLUB_DOMAINS = [
  'Autonomy & Controls',
  'Perception & Computer Vision',
  'Embedded Systems & Hardware',
  'Software & AI/ML',
  'Mechanical & CAD',
  'Design & Content',
  'Operations & Sponsorship',
] as const;

export type ClubDomain = typeof CLUB_DOMAINS[number];

export const ApplicationStatus = {
  PENDING_REVIEW: 'pending_review',
  ACCEPTED: 'accepted',
  WAITLISTED: 'waitlisted',
  REJECTED: 'rejected',
} as const;
export type ApplicationStatusType = typeof ApplicationStatus[keyof typeof ApplicationStatus];

export const insertRecruitmentApplicationSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  branch: z.string().min(1, 'Branch is required'),
  year: z.enum(['1st', '2nd', '3rd', '4th']),
  domainPreferences: z.array(z.string()).min(1, 'Select at least one domain'),
  roleInterest: z.string().min(1, 'Role interest is required'),
  portfolioUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  motivation: z.string().min(10, 'Minimum 10 characters').max(500, 'Maximum 500 characters'),
});

export const applicationDecisionSchema = z.object({
  status: z.enum(['accepted', 'waitlisted', 'rejected']),
  assignedDomain: z.string().optional(),
  assignedTitle: z.string().optional(),
  reviewNotes: z.string().optional(),
});

export type InsertRecruitmentApplication = z.infer<typeof insertRecruitmentApplicationSchema>;
export type ApplicationDecision = z.infer<typeof applicationDecisionSchema>;

export interface RecruitmentApplication {
  _id: string;
  id: string;
  userId: string;
  fullName: string;
  rollNumber: string;
  branch: string;
  year: string;
  domainPreferences: string[];
  roleInterest: string;
  portfolioUrl?: string | null;
  motivation: string;
  status: ApplicationStatusType;
  assignedDomain?: string | null;
  assignedTitle?: string | null;
  reviewedBy?: string | null;
  reviewNotes?: string | null;
  appliedAt: Date | string;
  reviewedAt?: Date | string | null;
}

export interface RecruitmentSettings {
  _id: string;
  id: string;
  isOpen: boolean;
  openedAt?: Date | string | null;
  closedAt?: Date | string | null;
  updatedBy?: string | null;
}
