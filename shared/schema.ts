import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Define user roles as enum for type safety
export const UserRole = {
  ASPIRANT: "ASPIRANT",
  CORE: "CORE",
  ADMIN: "ADMIN",
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

// Define all tables first without relations
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default(UserRole.ASPIRANT),
  created_at: text("created_at").notNull().default(new Date().toISOString()),
  // Team member additional fields
  display_name: text("display_name"),
  profile_image: text("profile_image"),
  department: text("department"),
  year: text("year"),
  role_title: text("role_title"), // Position/title in the team
  tags: text("tags"), // Comma-separated tags (skills or specialties)
  linkedin: text("linkedin"),
  github: text("github"),
  bio: text("bio"),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  technologies: text("technologies").notNull(), // Comma-separated list
  team: text("team").notNull(), // Comma-separated list
  created_at: text("created_at").notNull().default(new Date().toISOString()),
  user_id: integer("user_id").references(() => users.id).notNull(),
});

export const blogs = sqliteTable("blogs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  date: text("date").notNull().default(new Date().toISOString()),
  user_id: integer("user_id").references(() => users.id).notNull(),
});

export const researchItems = sqliteTable("research_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  authors: text("authors").notNull(), // Comma-separated list
  citations: integer("citations").default(0).notNull(),
  image: text("image").notNull(),
  date: text("date").notNull().default(new Date().toISOString()),
  user_id: integer("user_id").references(() => users.id).notNull(),
});

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  image: text("image").notNull(),
  user_id: integer("user_id").references(() => users.id).notNull(),
});

export const eventRegistrations = sqliteTable("event_registrations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  event_id: integer("event_id").references(() => events.id).notNull(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  message: text("message"), // Optional message from user about why they're interested
  created_at: text("created_at").notNull().default(new Date().toISOString()),
});

export const comments = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  created_at: text("created_at").notNull().default(new Date().toISOString()),
  user_id: integer("user_id").references(() => users.id).notNull(),
  project_id: integer("project_id").references(() => projects.id),
  blog_id: integer("blog_id").references(() => blogs.id),
  research_id: integer("research_id").references(() => researchItems.id),
});

// Define a messages table for core team communication
export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  created_at: text("created_at").notNull().default(new Date().toISOString()),
  user_id: integer("user_id").references(() => users.id).notNull(),
});

// Now define all relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  blogs: many(blogs),
  researchItems: many(researchItems),
  comments: many(comments),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  creator: one(users, {
    fields: [projects.user_id],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const blogsRelations = relations(blogs, ({ one, many }) => ({
  author: one(users, {
    fields: [blogs.user_id],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const researchItemsRelations = relations(researchItems, ({ one, many }) => ({
  creator: one(users, {
    fields: [researchItems.user_id],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, {
    fields: [events.user_id],
    references: [users.id],
  }),
  registrations: many(eventRegistrations),
}));

export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
  event: one(events, {
    fields: [eventRegistrations.event_id],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventRegistrations.user_id],
    references: [users.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.user_id],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [comments.project_id],
    references: [projects.id],
  }),
  blog: one(blogs, {
    fields: [comments.blog_id],
    references: [blogs.id],
  }),
  research: one(researchItems, {
    fields: [comments.research_id],
    references: [researchItems.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.user_id],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  // Note: role is not included as it defaults to "aspirant"
});

export const updateUserProfileSchema = createInsertSchema(users).pick({
  display_name: true,
  profile_image: true,
  department: true,
  year: true,
  role_title: true,
  tags: true,
  linkedin: true,
  github: true,
  bio: true,
}).partial();

// Insert schemas for all entities
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export const insertBlogSchema = createInsertSchema(blogs).omit({ id: true });
export const insertResearchSchema = createInsertSchema(researchItems).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true });
export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).omit({ id: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true });

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type Blog = typeof blogs.$inferSelect;

export type InsertResearch = z.infer<typeof insertResearchSchema>;
export type Research = typeof researchItems.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;
export type EventRegistration = typeof eventRegistrations.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
