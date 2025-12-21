import { Router } from "express";
import { storage } from "../storage";
import { insertProjectSchema, UserRole } from "../shared/schema";
import { isAdminOrCore } from "../middleware/auth";

const router = Router();

router.get("/projects", async (req, res) => {
    try {
        const projects = await storage.getAllProjects();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

router.get("/projects/:id", async (req, res) => {
    try {
        const project = await storage.getProject(req.params.id);
        if (!project) return res.status(404).json({ error: "Project not found" });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch project" });
    }
});

router.post("/projects", isAdminOrCore, async (req, res) => {
    try {
        const userId = req.session?.userId;
        if (!userId) return res.status(401).json({ error: "Not authenticated" });

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
        res.status(500).json({ error: "Failed to create project" });
    }
});

router.put("/projects/:id", isAdminOrCore, async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await storage.getProject(projectId);
        if (!project) return res.status(404).json({ error: "Project not found" });

        const userId = req.session?.userId;
        const user = await storage.getUser(userId!);

        if (project.user_id !== userId && user?.role !== UserRole.ADMIN) {
            return res.status(403).json({ error: "Not authorized to update this project" });
        }

        const updatedProject = await storage.updateProject(projectId, req.body);
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ error: "Failed to update project" });
    }
});

router.delete("/projects/:id", isAdminOrCore, async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await storage.getProject(projectId);
        if (!project) return res.status(404).json({ error: "Project not found" });

        const userId = req.session?.userId;
        const user = await storage.getUser(userId!);

        if (project.user_id !== userId && user?.role !== UserRole.ADMIN) {
            return res.status(403).json({ error: "Not authorized to delete this project" });
        }

        await storage.deleteProject(projectId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete project" });
    }
});

export default router;
