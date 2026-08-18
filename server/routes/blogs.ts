import { Router } from "express";
import { storage } from "../storage";
import { insertBlogSchema, UserRole } from "../shared/schema";
import { isAdminOrCore } from "../middleware/auth";

const router = Router();


router.get("/blogs", async (req, res) => {
    try {
        const blogs = await storage.getAllBlogs();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

router.get("/blogs/:id", async (req, res) => {
    try {
        const blog = await storage.getBlog(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blog" });
    }
});

router.post("/blogs", isAdminOrCore, async (req, res) => {
    try {
        const userId = req.session?.userId;
        if (!userId) return res.status(401).json({ error: "Not authenticated" });

        const blogInput = insertBlogSchema.safeParse({
            ...req.body,
            user_id: userId
        });

        if (!blogInput.success) {
            const errorMessage = blogInput.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') || "Invalid blog data";
            return res.status(400).json({ error: errorMessage });
        }

        const blog = await storage.createBlog(blogInput.data);
        res.status(201).json(blog);
    } catch (error: any) {
        console.error("Failed to create blog:", error);
        res.status(500).json({ error: error?.message || "Failed to create blog" });
    }
});

router.put("/blogs/:id", isAdminOrCore, async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await storage.getBlog(blogId);
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        const userId = req.session?.userId;
        const user = await storage.getUser(userId!);

        if (blog.user_id?.toString() !== userId?.toString() && user?.role !== UserRole.ADMIN) {
            return res.status(403).json({ error: "Not authorized to update this blog" });
        }

        const { _id, id, user_id, ...updateData } = req.body;
        const updatedBlog = await storage.updateBlog(blogId, updateData);
        res.json(updatedBlog);
    } catch (error: any) {
        console.error("Failed to update blog:", error);
        res.status(500).json({ error: error?.message || "Failed to update blog" });
    }
});

router.delete("/blogs/:id", isAdminOrCore, async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await storage.getBlog(blogId);
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        const userId = req.session?.userId;
        const user = await storage.getUser(userId!);

        if (blog.user_id?.toString() !== userId?.toString() && user?.role !== UserRole.ADMIN) {
            return res.status(403).json({ error: "Not authorized to delete this blog" });
        }

        await storage.deleteBlog(blogId);
        res.json({ success: true });
    } catch (error: any) {
        console.error("Failed to delete blog:", error);
        res.status(500).json({ error: error?.message || "Failed to delete blog" });
    }
});

export default router;
