import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { UserRole } from "../shared/schema";

// Middleware to check if user is authenticated (any role)
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session?.userId;

    if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    next();
};

// Middleware to check if user is admin
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session?.userId;

    if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(userId);

    if (!user || user.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized" });
    }

    next();
};

// Middleware to check if user is admin or core team member
export const isAdminOrCore = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session?.userId;

    if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(userId);

    if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.CORE)) {
        return res.status(403).json({ error: "Not authorized" });
    }

    next();
};
