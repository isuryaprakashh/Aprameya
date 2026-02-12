import type { Express } from "express";
import { createServer, type Server } from "http";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import projectsRouter from "./routes/projects";
import blogsRouter from "./routes/blogs";
import researchRouter from "./routes/research";
import eventsRouter from "./routes/events";
import messagesRouter from "./routes/messages";
import ticketsRouter from "./routes/tickets";

import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Root endpoint
  app.get("/", (req, res) => {
    res.json({ message: "Backend server running" });
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      message: "Server is running",
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Mount routers
  app.use("/api", authRouter);
  app.use("/api", usersRouter);
  app.use("/api", projectsRouter);
  app.use("/api", blogsRouter);
  app.use("/api", researchRouter);
  app.use("/api", eventsRouter);
  app.use("/api", messagesRouter);
  app.use("/api", ticketsRouter);

  const httpServer = createServer(app);

  return httpServer;
}
