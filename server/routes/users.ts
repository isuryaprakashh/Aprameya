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

router.patch(["/users/profile", "/user/profile"], async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    try {
        const profileData = updateUserProfileSchema.safeParse(req.body);
        if (!profileData.success) {
            return res.status(400).json({ error: "Invalid profile data", details: profileData.error });
        }

        const dataToUpdate = { ...profileData.data };

        // Validate username uniqueness if provided
        if (dataToUpdate.username) {
            const trimmedUsername = dataToUpdate.username.trim();
            const existing = await storage.getUserByUsername(trimmedUsername);
            if (existing && existing.id !== userId) {
                return res.status(400).json({ error: "Username is already taken by another account" });
            }
            dataToUpdate.username = trimmedUsername;
        }

        // Validate email uniqueness if provided
        if (dataToUpdate.email) {
            const cleanEmail = dataToUpdate.email.toLowerCase().trim();
            const existing = await storage.getUserByEmail(cleanEmail);
            if (existing && existing.id !== userId) {
                return res.status(400).json({ error: "Email is already taken by another account" });
            }
            dataToUpdate.email = cleanEmail;
        }

        const updatedUser = await storage.updateUserProfile(userId, dataToUpdate);
        if (!updatedUser) return res.status(500).json({ error: "Failed to update profile" });

        const { password, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error("Error in updateUserProfile:", error);
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

// Admin edit user details: PATCH /api/users/:userId
router.patch("/users/:userId", isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const targetUser = await storage.getUser(userId);
        if (!targetUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const {
            username,
            email,
            rollNumber,
            role,
            display_name,
            profile_image,
            bio,
            department,
            year
        } = req.body;

        const updateData: any = {};

        if (username !== undefined && username.trim() !== targetUser.username) {
            const trimmed = username.trim();
            if (!trimmed) return res.status(400).json({ error: "Username cannot be empty" });
            const existing = await storage.getUserByUsername(trimmed);
            if (existing && existing.id !== userId) {
                return res.status(400).json({ error: "Username is already taken" });
            }
            updateData.username = trimmed;
        }

        if (email !== undefined && email.toLowerCase().trim() !== targetUser.email) {
            const cleanEmail = email.toLowerCase().trim();
            if (!cleanEmail) return res.status(400).json({ error: "Email cannot be empty" });
            const existing = await storage.getUserByEmail(cleanEmail);
            if (existing && existing.id !== userId) {
                return res.status(400).json({ error: "Email is already taken" });
            }
            updateData.email = cleanEmail;
        }

        if (rollNumber !== undefined) updateData.rollNumber = rollNumber.trim();
        if (display_name !== undefined) updateData.display_name = display_name;
        if (profile_image !== undefined) updateData.profile_image = profile_image;
        if (bio !== undefined) updateData.bio = bio;
        if (department !== undefined) updateData.department = department;
        if (year !== undefined) updateData.year = year;

        if (role && Object.values(UserRole).includes(role)) {
            updateData.role = role;
        }

        const updatedUser = await storage.updateUserProfile(userId, updateData);
        if (!updatedUser) return res.status(500).json({ error: "Failed to update user" });

        const { password, ...safeUser } = updatedUser;
        res.json(safeUser);
    } catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({ error: "Failed to update user details" });
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
