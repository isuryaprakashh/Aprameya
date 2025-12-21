import { Router } from "express";
import { storage } from "../storage";
import { insertUserSchema } from "../shared/schema";

const router = Router();

router.post("/register", async (req, res) => {
    try {
        const existingUser = await storage.getUserByUsername(req.body.username);
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const userData = insertUserSchema.parse(req.body);
        const user = await storage.createUser(userData);

        req.session.userId = user.id;
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: "Invalid registration data" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await storage.getUserByUsername(req.body.username);
        if (!user || user.password !== req.body.password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        req.session.userId = user.id;
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Logout failed" });
        }
        res.json({ success: true });
    });
});

router.get("/me", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
        return res.status(401).json({ error: "User not found" });
    }
    res.json(user);
});

export default router;
