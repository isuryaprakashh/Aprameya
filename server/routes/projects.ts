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
            const errorMessage = projectInput.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') || "Invalid project data";
            return res.status(400).json({ error: errorMessage });
        }

        const project = await storage.createProject(projectInput.data);
        res.status(201).json(project);
    } catch (error: any) {
        console.error("Failed to create project:", error);
        res.status(500).json({ error: error?.message || "Failed to create project" });
    }
});

router.put("/projects/:id", isAdminOrCore, async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await storage.getProject(projectId);
        if (!project) return res.status(404).json({ error: "Project not found" });

        const userId = req.session?.userId;
        const user = await storage.getUser(userId!);

        if (project.user_id?.toString() !== userId?.toString() && user?.role !== UserRole.ADMIN) {
            return res.status(403).json({ error: "Not authorized to update this project" });
        }

        const { _id, id, user_id, ...updateData } = req.body;
        const updatedProject = await storage.updateProject(projectId, updateData);
        res.json(updatedProject);
    } catch (error: any) {
        console.error("Failed to update project:", error);
        res.status(500).json({ error: error?.message || "Failed to update project" });
    }
});

router.delete("/projects/:id", isAdminOrCore, async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await storage.getProject(projectId);
        if (!project) return res.status(404).json({ error: "Project not found" });

        const userId = req.session?.userId;
        const user = await storage.getUser(userId!);

        if (project.user_id?.toString() !== userId?.toString() && user?.role !== UserRole.ADMIN) {
            return res.status(403).json({ error: "Not authorized to delete this project" });
        }

        await storage.deleteProject(projectId);
        res.json({ success: true });
    } catch (error: any) {
        console.error("Failed to delete project:", error);
        res.status(500).json({ error: error?.message || "Failed to delete project" });
    }
});

export default router;
