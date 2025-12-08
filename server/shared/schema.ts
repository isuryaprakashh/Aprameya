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
});

export const insertProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().min(1, "Image is required"),
  technologies: z.string().min(1, "Technologies are required"),
  team: z.string().min(1, "Team is required"),
  user_id: z.string().optional(), // Handled by backend
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
});

export const insertEventRegistrationSchema = z.object({
  event_id: z.string().min(1, "Event ID is required"),
  message: z.string().optional(),
  user_id: z.string().optional(), // Handled by backend
});

export const insertCommentSchema = z.object({
  content: z.string().min(1, "Content is required"),
  project_id: z.string().optional(),
  blog_id: z.string().optional(),
  research_id: z.string().optional(),
  user_id: z.string().optional(), // Handled by backend
});

export const insertMessageSchema = z.object({
  content: z.string().min(1, "Content is required"),
  user_id: z.string().optional(), // Handled by backend
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
  citations: number;
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

export type InsertComment = z.infer<typeof insertCommentSchema>;
export interface Comment {
  _id: string;
  id: string;
  content: string;
  created_at: Date | string;
  user_id: string;
  project_id?: string | null;
  blog_id?: string | null;
  research_id?: string | null;
}

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export interface Message {
  _id: string;
  id: string;
  content: string;
  created_at: Date | string;
  user_id: string;
}
