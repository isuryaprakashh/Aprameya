import { Router } from "express";
import { storage } from "../storage";
import { UserRole, updateUserProfileSchema } from "../shared/schema";
import { isAdmin } from "../middleware/auth";

const router = Router();

// Get current user details (more detailed than /api/me if needed, otherwise alias)
router.get("/users/me", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    try {
        const user = await storage.getUser(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

router.get("/users/core-team", async (req, res) => {
    try {
        const coreTeamMembers = await storage.getUsersByRole(UserRole.CORE);
        const membersWithoutPasswords = coreTeamMembers.map(member => {
            const { password, ...memberWithoutPassword } = member;
            return memberWithoutPassword;
        });
        res.json(membersWithoutPasswords);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch core team members" });
    }
});

router.patch("/users/profile", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    try {
        const profileData = updateUserProfileSchema.safeParse(req.body);
        if (!profileData.success) {
            return res.status(400).json({ error: "Invalid profile data", details: profileData.error });
        }

        const updatedUser = await storage.updateUserProfile(userId, profileData.data);
        if (!updatedUser) return res.status(500).json({ error: "Failed to update profile" });

        const { password, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user profile" });
    }
});

// Admin routes (accessed via /api/users given mounting)
router.get("/users", isAdmin, async (req, res) => {
    try {
        const users = await storage.getAllUsers();
        // Don't send passwords
        const safeUsers = users.map(u => {
            const { password, ...rest } = u;
            return rest;
        });
        res.json(safeUsers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// PATCH /api/users/:userId/role (Client usage)
router.patch("/users/:userId/role", isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        if (!Object.values(UserRole).includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }

        const updatedUser = await storage.updateUserRole(userId, role);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user role" });
    }
});

// Keep existing POST route just in case, or remove if confident. 
// Refactoring for cleanup: Client uses PATCH.

router.delete("/users/:id", isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        await storage.deleteUser(userId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

export default router;
