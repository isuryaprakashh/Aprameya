import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  updateUserProfileSchema,
  insertProjectSchema,
  insertBlogSchema,
  insertResearchSchema,
  insertEventSchema,
  insertCommentSchema,
  insertEventRegistrationSchema,
  insertMessageSchema,
  UserRole,
  type UpdateUserProfile
} from "@shared/schema";
import { z } from "zod";
import 'express-session';

// Middleware to check if user is admin
const isAdmin = async (req: Request, res: Response, next: Function) => {
  // Get the user ID from session
  const userId = req.session?.userId;

  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = await storage.getUser(userId);

  if (!user || user.role !== UserRole.ADMIN) {
    return res.status(403).json({ error: "Not authorized" });
  }

  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // User registration
  app.post("/api/register", async (req, res) => {
    try {
      // Validate request body
      const userInput = insertUserSchema.safeParse(req.body);

      if (!userInput.success) {
        return res.status(400).json({ error: userInput.error });
      }

      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userInput.data.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Create user (will default to ASPIRANT role)
      const user = await storage.createUser(userInput.data);

      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;

      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // User login
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);

      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Set user ID in session
      req.session.userId = user.id;

      // Don't send password back to client
      const { password: _, ...userWithoutPassword } = user;

      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Failed to log in" });
    }
  });

  // User logout
  app.post("/api/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to logout" });
        }
        res.json({ success: true });
      });
    } else {
      res.json({ success: true });
    }
  });

  // Get current user
  app.get("/api/me", async (req, res) => {
    const userId = req.session?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;

      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Admin route: Get all users
  // Get current user role
  app.get("/api/user/role", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ role: user.role });
    } catch (error) {
      console.error("Error fetching user role:", error);
      res.status(500).json({ error: "Failed to fetch user role" });
    }
  });

  // Core team can view all aspirants
  app.get("/api/aspirants", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(userId);
      if (!user || (user.role !== UserRole.CORE && user.role !== UserRole.ADMIN)) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const aspirants = await storage.getUsersByRole(UserRole.ASPIRANT);
      const aspirantsWithoutPasswords = aspirants.map(({ password, ...rest }) => rest);
      res.json(aspirantsWithoutPasswords);
    } catch (error) {
      console.error("Error fetching aspirants:", error);
      res.status(500).json({ error: "Failed to fetch aspirants" });
    }
  });

  app.get("/api/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();

      // Remove passwords from response
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Admin route: Update user role
  app.patch("/api/users/:userId/role", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { role } = req.body;

      if (!role || !Object.values(UserRole).includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await storage.updateUserRole(userId, role);

      if (!updatedUser) {
        return res.status(500).json({ error: "Failed to update user role" });
      }

      // Don't send password back to client
      const { password, ...userWithoutPassword } = updatedUser;

      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ error: "Failed to update user role" });
    }
  });

  // For the admin dashboard, we need to create new routes to manage content

  // Middleware to check if user is admin or core team member
  const isAdminOrCore = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(userId);

    if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.CORE)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    next();
  };

  // For backwards compatibility, we'll provide API endpoints that map to the database versions

  // Projects compatibility endpoints
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", isAdminOrCore, async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const projectInput = insertProjectSchema.safeParse({
        ...req.body,
        user_id: userId
      });

      if (!projectInput.success) {
        return res.status(400).json({ error: projectInput.error });
      }

      const project = await storage.createProject(projectInput.data);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", isAdminOrCore, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Only allow the creator or admin to update
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (project.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to update this project" });
      }

      const updatedProject = await storage.updateProject(projectId, req.body);
      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", isAdminOrCore, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Only allow the creator or admin to delete
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (project.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to delete this project" });
      }

      await storage.deleteProject(projectId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Blogs compatibility endpoints
  app.get("/api/blogs", async (req, res) => {
    try {
      const blogs = await storage.getAllBlogs();
      res.json(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({ error: "Failed to fetch blogs" });
    }
  });

  app.get("/api/blogs/:id", async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      const blog = await storage.getBlog(blogId);

      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      res.json(blog);
    } catch (error) {
      console.error("Error fetching blog:", error);
      res.status(500).json({ error: "Failed to fetch blog" });
    }
  });

  app.post("/api/blogs", isAdminOrCore, async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const blogInput = insertBlogSchema.safeParse({
        ...req.body,
        user_id: userId
      });

      if (!blogInput.success) {
        return res.status(400).json({ error: blogInput.error });
      }

      const blog = await storage.createBlog(blogInput.data);
      res.status(201).json(blog);
    } catch (error) {
      console.error("Error creating blog:", error);
      res.status(500).json({ error: "Failed to create blog" });
    }
  });

  app.put("/api/blogs/:id", isAdminOrCore, async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      const blog = await storage.getBlog(blogId);

      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      // Only allow the creator or admin to update
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (blog.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to update this blog" });
      }

      const updatedBlog = await storage.updateBlog(blogId, req.body);
      res.json(updatedBlog);
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ error: "Failed to update blog" });
    }
  });

  app.delete("/api/blogs/:id", isAdminOrCore, async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      const blog = await storage.getBlog(blogId);

      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      // Only allow the creator or admin to delete
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (blog.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to delete this blog" });
      }

      await storage.deleteBlog(blogId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({ error: "Failed to delete blog" });
    }
  });

  // Research compatibility endpoints
  app.get("/api/research", async (req, res) => {
    try {
      const researchItems = await storage.getAllResearch();
      res.json(researchItems);
    } catch (error) {
      console.error("Error fetching research items:", error);
      res.status(500).json({ error: "Failed to fetch research items" });
    }
  });

  app.get("/api/research/:id", async (req, res) => {
    try {
      const researchId = parseInt(req.params.id);
      const research = await storage.getResearch(researchId);

      if (!research) {
        return res.status(404).json({ error: "Research item not found" });
      }

      res.json(research);
    } catch (error) {
      console.error("Error fetching research item:", error);
      res.status(500).json({ error: "Failed to fetch research item" });
    }
  });

  app.post("/api/research", isAdminOrCore, async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const researchInput = insertResearchSchema.safeParse({
        ...req.body,
        user_id: userId
      });

      if (!researchInput.success) {
        return res.status(400).json({ error: researchInput.error });
      }

      const research = await storage.createResearch(researchInput.data);
      res.status(201).json(research);
    } catch (error) {
      console.error("Error creating research item:", error);
      res.status(500).json({ error: "Failed to create research item" });
    }
  });

  app.put("/api/research/:id", isAdminOrCore, async (req, res) => {
    try {
      const researchId = parseInt(req.params.id);
      const research = await storage.getResearch(researchId);

      if (!research) {
        return res.status(404).json({ error: "Research item not found" });
      }

      // Only allow the creator or admin to update
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (research.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to update this research item" });
      }

      const updatedResearch = await storage.updateResearch(researchId, req.body);
      res.json(updatedResearch);
    } catch (error) {
      console.error("Error updating research item:", error);
      res.status(500).json({ error: "Failed to update research item" });
    }
  });

  app.delete("/api/research/:id", isAdminOrCore, async (req, res) => {
    try {
      const researchId = parseInt(req.params.id);
      const research = await storage.getResearch(researchId);

      if (!research) {
        return res.status(404).json({ error: "Research item not found" });
      }

      // Only allow the creator or admin to delete
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (research.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to delete this research item" });
      }

      await storage.deleteResearch(researchId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting research item:", error);
      res.status(500).json({ error: "Failed to delete research item" });
    }
  });

  // Events compatibility endpoints
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.post("/api/events", isAdminOrCore, async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const eventInput = insertEventSchema.safeParse({
        ...req.body,
        user_id: userId
      });

      if (!eventInput.success) {
        return res.status(400).json({ error: eventInput.error });
      }

      const event = await storage.createEvent(eventInput.data);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  app.put("/api/events/:id", isAdminOrCore, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Only allow the creator or admin to update
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (event.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to update this event" });
      }

      const updatedEvent = await storage.updateEvent(eventId, req.body);
      res.json(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ error: "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", isAdminOrCore, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Only allow the creator or admin to delete
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (event.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to delete this event" });
      }

      await storage.deleteEvent(eventId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // User role update endpoint to be used from admin dashboard
  app.put("/api/users/:userId/role", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { role } = req.body;

      if (!role || !Object.values(UserRole).includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await storage.updateUserRole(userId, role);

      if (!updatedUser) {
        return res.status(500).json({ error: "Failed to update user role" });
      }

      // Don't send password back to client
      const { password, ...userWithoutPassword } = updatedUser;

      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ error: "Failed to update user role" });
    }
  });

  // Replace the old in-memory API endpoints with database-backed ones

  // Projects API endpoints (database-backed)
  app.get("/api/db/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/db/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/db/projects", isAdminOrCore, async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const projectInput = insertProjectSchema.safeParse({
        ...req.body,
        user_id: userId
      });

      if (!projectInput.success) {
        return res.status(400).json({ error: projectInput.error });
      }

      const project = await storage.createProject(projectInput.data);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.put("/api/db/projects/:id", isAdminOrCore, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Only allow the creator or admin to update
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (project.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to update this project" });
      }

      const updatedProject = await storage.updateProject(projectId, req.body);
      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/db/projects/:id", isAdminOrCore, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Only allow the creator or admin to delete
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (project.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to delete this project" });
      }

      await storage.deleteProject(projectId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Blogs API endpoints (database-backed)
  app.get("/api/db/blogs", async (req, res) => {
    try {
      const blogs = await storage.getAllBlogs();
      res.json(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({ error: "Failed to fetch blogs" });
    }
  });

  app.get("/api/db/blogs/:id", async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      const blog = await storage.getBlog(blogId);

      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      res.json(blog);
    } catch (error) {
      console.error("Error fetching blog:", error);
      res.status(500).json({ error: "Failed to fetch blog" });
    }
  });

  app.post("/api/db/blogs", isAdminOrCore, async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const blogInput = insertBlogSchema.safeParse({
        ...req.body,
        user_id: userId
      });

      if (!blogInput.success) {
        return res.status(400).json({ error: blogInput.error });
      }

      const blog = await storage.createBlog(blogInput.data);
      res.status(201).json(blog);
    } catch (error) {
      console.error("Error creating blog:", error);
      res.status(500).json({ error: "Failed to create blog" });
    }
  });

  app.put("/api/db/blogs/:id", isAdminOrCore, async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      const blog = await storage.getBlog(blogId);

      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      // Only allow the creator or admin to update
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (blog.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to update this blog" });
      }

      const updatedBlog = await storage.updateBlog(blogId, req.body);
      res.json(updatedBlog);
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ error: "Failed to update blog" });
    }
  });

  app.delete("/api/db/blogs/:id", isAdminOrCore, async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      const blog = await storage.getBlog(blogId);

      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      // Only allow the creator or admin to delete
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (blog.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to delete this blog" });
      }

      await storage.deleteBlog(blogId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({ error: "Failed to delete blog" });
    }
  });

  // Research API endpoints (database-backed)
  app.get("/api/db/research", async (req, res) => {
    try {
      const researchItems = await storage.getAllResearch();
      res.json(researchItems);
    } catch (error) {
      console.error("Error fetching research items:", error);
      res.status(500).json({ error: "Failed to fetch research items" });
    }
  });

  app.get("/api/db/research/:id", async (req, res) => {
    try {
      const researchId = parseInt(req.params.id);
      const research = await storage.getResearch(researchId);

      if (!research) {
        return res.status(404).json({ error: "Research item not found" });
      }

      res.json(research);
    } catch (error) {
      console.error("Error fetching research item:", error);
      res.status(500).json({ error: "Failed to fetch research item" });
    }
  });

  app.post("/api/db/research", isAdminOrCore, async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const researchInput = insertResearchSchema.safeParse({
        ...req.body,
        user_id: userId
      });

      if (!researchInput.success) {
        return res.status(400).json({ error: researchInput.error });
      }

      const research = await storage.createResearch(researchInput.data);
      res.status(201).json(research);
    } catch (error) {
      console.error("Error creating research item:", error);
      res.status(500).json({ error: "Failed to create research item" });
    }
  });

  app.put("/api/db/research/:id", isAdminOrCore, async (req, res) => {
    try {
      const researchId = parseInt(req.params.id);
      const research = await storage.getResearch(researchId);

      if (!research) {
        return res.status(404).json({ error: "Research item not found" });
      }

      // Only allow the creator or admin to update
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (research.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to update this research item" });
      }

      const updatedResearch = await storage.updateResearch(researchId, req.body);
      res.json(updatedResearch);
    } catch (error) {
      console.error("Error updating research item:", error);
      res.status(500).json({ error: "Failed to update research item" });
    }
  });

  app.delete("/api/db/research/:id", isAdminOrCore, async (req, res) => {
    try {
      const researchId = parseInt(req.params.id);
      const research = await storage.getResearch(researchId);

      if (!research) {
        return res.status(404).json({ error: "Research item not found" });
      }

      // Only allow the creator or admin to delete
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (research.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to delete this research item" });
      }

      await storage.deleteResearch(researchId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting research item:", error);
      res.status(500).json({ error: "Failed to delete research item" });
    }
  });

  // Events API endpoints (database-backed)
  app.get("/api/db/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/db/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.post("/api/db/events", isAdminOrCore, async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const eventInput = insertEventSchema.safeParse({
        ...req.body,
        user_id: userId
      });

      if (!eventInput.success) {
        return res.status(400).json({ error: eventInput.error });
      }

      const event = await storage.createEvent(eventInput.data);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  app.put("/api/db/events/:id", isAdminOrCore, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Only allow the creator or admin to update
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (event.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to update this event" });
      }

      const updatedEvent = await storage.updateEvent(eventId, req.body);
      res.json(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ error: "Failed to update event" });
    }
  });

  app.delete("/api/db/events/:id", isAdminOrCore, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Only allow the creator or admin to delete
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (event.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to delete this event" });
      }

      await storage.deleteEvent(eventId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // Event Registration API endpoints
  app.post("/api/db/event-registrations", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { event_id } = req.body;

      if (!event_id) {
        return res.status(400).json({ error: "Event ID is required" });
      }

      // Check if user has already registered for this event
      const existingRegistration = await storage.getEventRegistrationByUserAndEvent(userId, event_id);
      if (existingRegistration) {
        return res.status(400).json({ error: "You have already registered for this event" });
      }

      const registrationInput = insertEventRegistrationSchema.safeParse({
        event_id,
        user_id: userId
      });

      if (!registrationInput.success) {
        return res.status(400).json({ error: registrationInput.error });
      }

      const registration = await storage.createEventRegistration(registrationInput.data);
      res.status(201).json(registration);
    } catch (error) {
      console.error("Error registering for event:", error);
      res.status(500).json({ error: "Failed to register for event" });
    }
  });

  app.get("/api/db/event-registrations/user", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const registrations = await storage.getEventRegistrationsByUser(userId);
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching user event registrations:", error);
      res.status(500).json({ error: "Failed to fetch user event registrations" });
    }
  });

  app.get("/api/db/event-registrations/event/:eventId", isAdminOrCore, async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const registrations = await storage.getEventRegistrationsByEvent(eventId);
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching event registrations:", error);
      res.status(500).json({ error: "Failed to fetch event registrations" });
    }
  });

  app.delete("/api/db/event-registrations/:id", async (req, res) => {
    try {
      const registrationId = parseInt(req.params.id);
      const registration = await storage.getEventRegistration(registrationId);

      if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
      }

      // Only allow the registered user or admin to cancel registration
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (registration.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to cancel this registration" });
      }

      await storage.deleteEventRegistration(registrationId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error canceling event registration:", error);
      res.status(500).json({ error: "Failed to cancel event registration" });
    }
  });

  // Comment API endpoints
  app.post("/api/db/comments", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const commentInput = insertCommentSchema.safeParse({
        ...req.body,
        user_id: userId
      });

      if (!commentInput.success) {
        return res.status(400).json({ error: commentInput.error });
      }

      const comment = await storage.createComment(commentInput.data);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  app.get("/api/db/comments/project/:projectId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const comments = await storage.getCommentsByProject(projectId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching project comments:", error);
      res.status(500).json({ error: "Failed to fetch project comments" });
    }
  });

  app.get("/api/db/comments/blog/:blogId", async (req, res) => {
    try {
      const blogId = parseInt(req.params.blogId);
      const comments = await storage.getCommentsByBlog(blogId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching blog comments:", error);
      res.status(500).json({ error: "Failed to fetch blog comments" });
    }
  });

  app.get("/api/db/comments/research/:researchId", async (req, res) => {
    try {
      const researchId = parseInt(req.params.researchId);
      const comments = await storage.getCommentsByResearch(researchId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching research comments:", error);
      res.status(500).json({ error: "Failed to fetch research comments" });
    }
  });

  app.put("/api/db/comments/:id", async (req, res) => {
    try {
      const commentId = parseInt(req.params.id);
      const comment = await storage.getComment(commentId);

      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      // Only allow the commenter or admin to update
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (comment.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to update this comment" });
      }

      const updatedComment = await storage.updateComment(commentId, { content: req.body.content });
      res.json(updatedComment);
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ error: "Failed to update comment" });
    }
  });

  app.delete("/api/db/comments/:id", async (req, res) => {
    try {
      const commentId = parseInt(req.params.id);
      const comment = await storage.getComment(commentId);

      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      // Only allow the commenter or admin to delete
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (comment.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to delete this comment" });
      }

      await storage.deleteComment(commentId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  });

  // Core Team Private Messages (only for core team and admin)
  app.post("/api/db/messages", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user || (user.role !== UserRole.CORE && user.role !== UserRole.ADMIN)) {
        return res.status(403).json({ error: "Only core team members and admins can send messages" });
      }

      const messageInput = insertMessageSchema.safeParse({
        content: req.body.content,
        user_id: userId
      });

      if (!messageInput.success) {
        return res.status(400).json({ error: messageInput.error });
      }

      const message = await storage.createMessage(messageInput.data);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.get("/api/db/messages", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user || (user.role !== UserRole.CORE && user.role !== UserRole.ADMIN)) {
        return res.status(403).json({ error: "Only core team members and admins can view messages" });
      }

      const messages = await storage.getAllMessages();

      // Populate user information for each message
      const messagesWithUsers = await Promise.all(
        messages.map(async (message) => {
          const messageUser = await storage.getUser(message.user_id);
          return {
            ...message,
            user: messageUser ? {
              id: messageUser.id,
              username: messageUser.username,
              display_name: messageUser.display_name,
              role: messageUser.role
            } : null
          };
        })
      );

      res.json(messagesWithUsers);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.delete("/api/db/messages/:id", async (req, res) => {
    try {
      const messageId = parseInt(req.params.id);
      const message = await storage.getMessage(messageId);

      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }

      // Only allow the sender or admin to delete
      const userId = req.session?.userId;
      const user = await storage.getUser(userId!);

      if (message.user_id !== userId && user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized to delete this message" });
      }

      await storage.deleteMessage(messageId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ error: "Failed to delete message" });
    }
  });

  // API endpoint to check if current user is logged in and get their details
  app.get("/api/users/me", async (req, res) => {
    const userId = req.session?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;

      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // API endpoint to get all core team members
  app.get("/api/users/core-team", async (req, res) => {
    try {
      const coreTeamMembers = await storage.getUsersByRole(UserRole.CORE);

      // Don't send passwords back to client
      const membersWithoutPasswords = coreTeamMembers.map(member => {
        const { password, ...memberWithoutPassword } = member;
        return memberWithoutPassword;
      });

      res.json(membersWithoutPasswords);
    } catch (error) {
      console.error("Error fetching core team members:", error);
      res.status(500).json({ error: "Failed to fetch core team members" });
    }
  });

  // API endpoint to update a user's profile information
  app.patch("/api/users/profile", async (req, res) => {
    const userId = req.session?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      // Validate the profile update data
      const profileData = updateUserProfileSchema.safeParse(req.body);

      if (!profileData.success) {
        return res.status(400).json({ error: "Invalid profile data", details: profileData.error });
      }

      // Update user profile
      const updatedUser = await storage.updateUserProfile(userId, profileData.data);

      if (!updatedUser) {
        return res.status(500).json({ error: "Failed to update profile" });
      }

      // Don't send password back to client
      const { password, ...userWithoutPassword } = updatedUser;

      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });

  // Event Registration Endpoints

  // Register interest for an event
  app.post("/api/event-registrations", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { eventId, message } = req.body;

      if (!eventId) {
        return res.status(400).json({ error: "Event ID is required" });
      }

      // Check if event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Check if user already registered for this event
      const existingRegistration = await storage.getEventRegistrationByUserAndEvent(userId, eventId);
      if (existingRegistration) {
        return res.status(400).json({ error: "You have already registered for this event" });
      }

      // Create registration
      const registrationData = {
        event_id: eventId,
        user_id: userId,
        // Optional: store additional message/notes
        ...(message && { message })
      };

      const registration = await storage.createEventRegistration(registrationData);

      // Get user details for email
      const user = await storage.getUser(userId);

      // TODO: Send confirmation email (implement later)
      /*
      try {
        await sendEventRegistrationEmail({
          userEmail: user.email,
          userName: user.username,
          eventTitle: event.title,
          eventDate: event.date,
          eventTime: event.time,
          eventLocation: event.location
        });
        console.log(`Confirmation email sent to ${user.email} for event: ${event.title}`);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the registration if email fails
      }
      */

      res.status(201).json({
        success: true,
        message: "Successfully registered for event",
        registration: {
          id: registration.id,
          eventTitle: event.title,
          eventDate: event.date,
          registeredAt: registration.created_at
        }
      });

    } catch (error) {
      console.error("Error registering for event:", error);
      res.status(500).json({ error: "Failed to register for event" });
    }
  });

  // Get user's event registrations
  app.get("/api/event-registrations/my", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const registrations = await storage.getEventRegistrationsByUser(userId);

      // Get event details for each registration
      const registrationsWithEvents = await Promise.all(
        registrations.map(async (registration) => {
          const event = await storage.getEvent(registration.event_id);
          return {
            id: registration.id,
            registeredAt: registration.created_at,
            event: event ? {
              id: event.id,
              title: event.title,
              date: event.date,
              time: event.time,
              location: event.location,
              image: event.image
            } : null
          };
        })
      );

      res.json(registrationsWithEvents);
    } catch (error) {
      console.error("Error fetching user registrations:", error);
      res.status(500).json({ error: "Failed to fetch registrations" });
    }
  });

  // Cancel event registration
  app.delete("/api/event-registrations/:registrationId", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const registrationId = parseInt(req.params.registrationId);
      const registration = await storage.getEventRegistration(registrationId);

      if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
      }

      // Check if user owns this registration
      if (registration.user_id !== userId) {
        return res.status(403).json({ error: "Not authorized to cancel this registration" });
      }

      await storage.deleteEventRegistration(registrationId);

      // TODO: Send cancellation email (implement later)
      /*
      const user = await storage.getUser(userId);
      const event = await storage.getEvent(registration.event_id);
      
      try {
        await sendEventCancellationEmail({
          userEmail: user.email,
          userName: user.username,
          eventTitle: event.title,
          eventDate: event.date
        });
        console.log(`Cancellation email sent to ${user.email} for event: ${event.title}`);
      } catch (emailError) {
        console.error('Failed to send cancellation email:', emailError);
      }
      */

      res.json({ success: true, message: "Registration cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling registration:", error);
      res.status(500).json({ error: "Failed to cancel registration" });
    }
  });

  // Admin: Get all registrations for an event
  app.get("/api/events/:eventId/registrations", isAdminOrCore, async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);

      // Check if event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const registrations = await storage.getEventRegistrationsByEvent(eventId);

      // Get user details for each registration
      const registrationsWithUsers = await Promise.all(
        registrations.map(async (registration) => {
          const user = await storage.getUser(registration.user_id);
          return {
            id: registration.id,
            registeredAt: registration.created_at,
            user: user ? {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
              display_name: user.display_name
            } : null
          };
        })
      );

      res.json({
        event: {
          id: event.id,
          title: event.title,
          date: event.date,
          time: event.time,
          location: event.location
        },
        registrations: registrationsWithUsers,
        totalRegistrations: registrationsWithUsers.length
      });
    } catch (error) {
      console.error("Error fetching event registrations:", error);
      res.status(500).json({ error: "Failed to fetch event registrations" });
    }
  });

  // Admin: Get all registrations across all events
  app.get("/api/admin/event-registrations", isAdmin, async (req, res) => {
    try {
      const allRegistrations = await storage.getAllEventRegistrations();

      // Get event and user details for each registration
      const registrationsWithDetails = await Promise.all(
        allRegistrations.map(async (registration) => {
          const [event, user] = await Promise.all([
            storage.getEvent(registration.event_id),
            storage.getUser(registration.user_id)
          ]);

          return {
            id: registration.id,
            registeredAt: registration.created_at,
            event: event ? {
              id: event.id,
              title: event.title,
              date: event.date,
              time: event.time,
              location: event.location
            } : null,
            user: user ? {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
              display_name: user.display_name
            } : null
          };
        })
      );

      res.json({
        registrations: registrationsWithDetails,
        totalRegistrations: registrationsWithDetails.length
      });
    } catch (error) {
      console.error("Error fetching all registrations:", error);
      res.status(500).json({ error: "Failed to fetch registrations" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
