import { Router } from "express";
import { storage } from "../storage";
import { insertBlogSchema, UserRole } from "../shared/schema";
import { isAdminOrCore } from "../middleware/auth";

const router = Router();

console.log()
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
            return res.status(400).json({ error: blogInput.error });
        }

        const blog = await storage.createBlog(blogInput.data);
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ error: "Failed to create blog" });
    }
});

router.put("/blogs/:id", isAdminOrCore, async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await storage.getBlog(blogId);
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        const userId = req.session?.userId;
        const user = await storage.getUser(userId!);

        if (blog.user_id !== userId && user?.role !== UserRole.ADMIN) {
            return res.status(403).json({ error: "Not authorized to update this blog" });
        }

        const updatedBlog = await storage.updateBlog(blogId, req.body);
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ error: "Failed to update blog" });
    }
});

router.delete("/blogs/:id", isAdminOrCore, async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await storage.getBlog(blogId);
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        const userId = req.session?.userId;
        const user = await storage.getUser(userId!);

        if (blog.user_id !== userId && user?.role !== UserRole.ADMIN) {
            return res.status(403).json({ error: "Not authorized to delete this blog" });
        }

        await storage.deleteBlog(blogId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete blog" });
    }
});

export default router;
