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

        // IMPORTANT: Use callback to ensure session is saved before responding
        req.session.save((err) => {
            if (err) {
                console.error('❌ Session save error on register:', err);
                return res.status(500).json({ error: "Session save failed" });
            }

            console.log('✅ Registration successful:', {
                userId: user.id,
                sessionID: req.sessionID,
            });

            res.status(201).json(user);
        });
    } catch (error) {
        console.error('❌ Registration error:', error);
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

        // IMPORTANT: Use callback to ensure session is saved before responding
        req.session.save((err) => {
            if (err) {
                console.error('❌ Session save error on login:', err);
                return res.status(500).json({ error: "Session save failed" });
            }

            console.log('🔐 Login successful:', {
                userId: user.id,
                username: user.username,
                sessionID: req.sessionID,
                cookie: req.headers.cookie
            });

            res.json(user);
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ error: "Login failed" });
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('❌ Logout error:', err);
            return res.status(500).json({ error: "Logout failed" });
        }

        // Clear the cookie
        res.clearCookie('aprameya.sid');
        res.json({ success: true });
    });
});

router.get("/me", async (req, res) => {
    console.log('👤 /api/me called:', {
        sessionID: req.sessionID,
        userId: req.session?.userId,
        hasSession: !!req.session,
        hasCookie: !!req.headers.cookie,
        cookie: req.headers.cookie
    });

    if (!req.session?.userId) {
        console.log('❌ No userId in session');
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const user = await storage.getUser(req.session.userId);
        if (!user) {
            console.log('❌ User not found in database');
            return res.status(401).json({ error: "User not found" });
        }

        console.log('✅ User authenticated:', user.username);
        res.json(user);
    } catch (error) {
        console.error('❌ Error fetching user:', error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

export default router;
