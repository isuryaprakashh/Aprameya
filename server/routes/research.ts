import { Router } from "express";
import { storage } from "../storage";
import { insertResearchSchema, UserRole } from "../shared/schema";
import { isAdminOrCore } from "../middleware/auth";

const router = Router();

router.get("/research", async (req, res) => {
    try {
        const researchItems = await storage.getAllResearch();
        res.json(researchItems);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch research items" });
    }
});

router.get("/research/:id", async (req, res) => {
    try {
        const research = await storage.getResearch(req.params.id);
        if (!research) return res.status(404).json({ error: "Research item not found" });
        res.json(research);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch research item" });
    }
});

router.post("/research", isAdminOrCore, async (req, res) => {
    try {
        const userId = req.session?.userId;
        if (!userId) return res.status(401).json({ error: "Not authenticated" });

        const researchInput = insertResearchSchema.safeParse({
            ...req.body,
            user_id: userId
        });

        if (!researchInput.success) {
            const errorMessage = researchInput.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') || "Invalid research data";
            return res.status(400).json({ error: errorMessage });
        }

        const research = await storage.createResearch(researchInput.data);
        res.status(201).json(research);
    } catch (error: any) {
        console.error("Failed to create research item:", error);
        res.status(500).json({ error: error?.message || "Failed to create research item" });
    }
});

router.put("/research/:id", isAdminOrCore, async (req, res) => {
    try {
        const researchId = req.params.id;
        const research = await storage.getResearch(researchId);
        if (!research) return res.status(404).json({ error: "Research item not found" });

        const userId = req.session?.userId;
        const user = await storage.getUser(userId!);

        if (research.user_id?.toString() !== userId?.toString() && user?.role !== UserRole.ADMIN) {
            return res.status(403).json({ error: "Not authorized to update this research item" });
        }

        const { _id, id, user_id, ...updateData } = req.body;
        const updatedResearch = await storage.updateResearch(researchId, updateData);
        res.json(updatedResearch);
    } catch (error: any) {
        console.error("Failed to update research item:", error);
        res.status(500).json({ error: error?.message || "Failed to update research item" });
    }
});

router.delete("/research/:id", isAdminOrCore, async (req, res) => {
    try {
        const researchId = req.params.id;
        const research = await storage.getResearch(researchId);
        if (!research) return res.status(404).json({ error: "Research item not found" });

        const userId = req.session?.userId;
        const user = await storage.getUser(userId!);

        if (research.user_id?.toString() !== userId?.toString() && user?.role !== UserRole.ADMIN) {
            return res.status(403).json({ error: "Not authorized to delete this research item" });
        }

        await storage.deleteResearch(researchId);
        res.json({ success: true });
    } catch (error: any) {
        console.error("Failed to delete research item:", error);
        res.status(500).json({ error: error?.message || "Failed to delete research item" });
    }
});

export default router;
