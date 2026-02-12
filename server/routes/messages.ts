import { Router } from "express";
import { storage } from "../storage";
import { insertMessageSchema, UserRole } from "../shared/schema";

const router = Router();

// Middleware inside router to ensure core/admin for all message routes? 
// Or apply per route. Original code applied per route.
// Let's apply per route to match exact logic, or use a router-level middleware if all routes match.
// GET /api/db/messages -> Core/Admin
// POST /api/db/messages -> Core/Admin
// DELETE /api/db/messages -> Admin or Sender (Core/Admin)

const isCoreOrAdmin = async (req: any, res: any, next: any) => {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const user = await storage.getUser(userId);
    if (!user || (user.role !== UserRole.CORE && user.role !== UserRole.ADMIN)) {
        return res.status(403).json({ error: "[DEBUG] Only core team members and admins can access messages" });
    }
    next();
};

router.get("/db/messages", isCoreOrAdmin, async (req, res) => {
    try {
        const messages = await storage.getAllMessages();

        // Populate user information for each message
        const messagesWithUsers = await Promise.all(
            messages.map(async (message) => {
                const messageUser = await storage.getUser(message.user_id);
                return {
                    ...message,
                    user: messageUser ? {
                        id: messageUser.id,
                        username: messageUser.username,
                        display_name: messageUser.display_name,
                        role: messageUser.role
                    } : null
                };
            })
        );

        res.json(messagesWithUsers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

router.post("/db/messages", isCoreOrAdmin, async (req, res) => {
    try {
        const userId = req.session?.userId!;
        // User role check already done by middleware

        const messageInput = insertMessageSchema.safeParse({
            content: req.body.content,
            user_id: userId
        });

        if (!messageInput.success) {
            return res.status(400).json({ error: messageInput.error });
        }

        const message = await storage.createMessage(messageInput.data);
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: "Failed to send message" });
    }
});

router.delete("/db/messages/:id", isCoreOrAdmin, async (req, res) => {
    try {
        const messageId = req.params.id;
        const message = await storage.getMessage(messageId);
        if (!message) return res.status(404).json({ error: "Message not found" });

        const userId = req.session?.userId!;
        const user = await storage.getUser(userId);

        // Middleware ensures user is Core or Admin.
        // Further check: Only allow the sender or admin to delete.
        if (message.user_id !== userId && user?.role !== UserRole.ADMIN) {
            return res.status(403).json({ error: "Not authorized to delete this message" });
        }

        await storage.deleteMessage(messageId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete message" });
    }
});

export default router;
