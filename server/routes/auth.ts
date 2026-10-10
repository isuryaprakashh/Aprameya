import { Router } from "express";
import { storage } from "../storage";
import { insertUserSchema } from "../shared/schema";
import { sendPasswordResetOtpEmail } from "../emailService";

const router = Router();

// Helper to mask email address for privacy (e.g. s***h@kluniversity.in)
function maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return email;
    if (local.length <= 2) {
        return `${local[0]}*@${domain}`;
    }
    return `${local[0]}${'*'.repeat(Math.min(local.length - 2, 4))}${local[local.length - 1]}@${domain}`;
}

// Student & User Registration
router.post("/register", async (req, res) => {
    try {
        const username = req.body.username ? req.body.username.trim() : '';
        const email = req.body.email ? req.body.email.toLowerCase().trim() : '';
        const rollNumber = req.body.rollNumber ? req.body.rollNumber.trim() : username;

        if (!username) {
            return res.status(400).json({ error: "College ID Number (username) is required" });
        }
        if (!email) {
            return res.status(400).json({ error: "Email address is required" });
        }

        const existingUserByUsername = await storage.getUserByUsername(username);
        if (existingUserByUsername) {
            return res.status(400).json({ error: "An account with this College ID Number already exists" });
        }

        const existingUserByEmail = await storage.getUserByEmail(email);
        if (existingUserByEmail) {
            return res.status(400).json({ error: "An account with this email address already exists" });
        }

        const userData = insertUserSchema.parse({
            ...req.body,
            username,
            rollNumber,
            email
        });
        const user = await storage.createUser(userData);

        req.session.userId = user.id;

        req.session.save((err) => {
            if (err) {
                console.error('❌ Session save error on register:', err);
                return res.status(500).json({ error: "Session save failed" });
            }

            console.log('✅ Registration successful:', {
                userId: user.id,
                username: user.username,
                email: user.email,
                sessionID: req.sessionID,
            });

            res.status(201).json(user);
        });
    } catch (error: any) {
        console.error('❌ Registration error:', error);
        res.status(400).json({ error: error.message || "Invalid registration data" });
    }
});

// Login via College ID Number (or Email)
router.post("/login", async (req, res) => {
    try {
        const identifier = req.body.username || req.body.identifier;
        if (!identifier || !req.body.password) {
            return res.status(400).json({ error: "College ID Number / Email and password are required" });
        }

        const user = await storage.getUserByIdentifier(identifier);
        if (!user || user.password !== req.body.password) {
            return res.status(401).json({ error: "Invalid credentials. Please verify your College ID and password." });
        }

        req.session.userId = user.id;

        req.session.save((err) => {
            if (err) {
                console.error('❌ Session save error on login:', err);
                return res.status(500).json({ error: "Session save failed" });
            }

            console.log('🔐 Login successful:', {
                userId: user.id,
                username: user.username,
                sessionID: req.sessionID
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

        res.clearCookie('aprameya.sid');
        res.json({ success: true });
    });
});

router.get("/me", async (req, res) => {
    if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const user = await storage.getUser(req.session.userId);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error('❌ /api/me error:', error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// ==========================================
// PASSWORD RESET VIA OTP (Official Club Mail)
// ==========================================

// Request 6-digit OTP
router.post(["/forgot-password", "/auth/forgot-password"], async (req, res) => {
    try {
        const identifier = req.body.identifier || req.body.email || req.body.username;
        if (!identifier || typeof identifier !== 'string') {
            return res.status(400).json({ error: "Please enter your College ID Number or registered email address" });
        }

        const user = await storage.getUserByIdentifier(identifier);
        if (!user) {
            return res.status(404).json({ error: "No account found matching this College ID Number or Email" });
        }

        // Generate 6-digit numeric OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP record with 10-minute expiry
        await storage.createPasswordResetOtp(user.id, user.email, otp);

        // Dispatch Email from official club mail
        await sendPasswordResetOtpEmail({
            userEmail: user.email,
            userName: user.display_name || user.username,
            otp
        });

        res.json({
            success: true,
            message: `A 6-digit verification code has been dispatched to ${maskEmail(user.email)}.`,
            email: user.email,
            maskedEmail: maskEmail(user.email)
        });
    } catch (error: any) {
        console.error('❌ Forgot password error:', error);
        res.status(500).json({ error: "Failed to process password reset request. Please try again." });
    }
});

// Verify OTP
router.post(["/verify-otp", "/auth/verify-otp"], async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and verification OTP are required" });
        }

        const record = await storage.getValidPasswordResetOtp(email, otp);
        if (!record) {
            return res.status(400).json({ error: "Invalid or expired verification code. Please request a new one." });
        }

        res.json({ success: true, message: "Verification code confirmed" });
    } catch (error: any) {
        console.error('❌ Verify OTP error:', error);
        res.status(500).json({ error: "Failed to verify code" });
    }
});

// Reset Password with verified OTP
router.post(["/reset-password", "/auth/reset-password"], async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: "Email, OTP, and new password are required" });
        }

        if (typeof newPassword !== 'string' || newPassword.length < 6) {
            return res.status(400).json({ error: "New password must be at least 6 characters long" });
        }

        const record = await storage.getValidPasswordResetOtp(email, otp);
        if (!record) {
            return res.status(400).json({ error: "Invalid or expired verification code. Please request a new one." });
        }

        const user = await storage.getUser(record.userId.toString());
        if (!user) {
            return res.status(404).json({ error: "User account not found" });
        }

        await storage.updateUserPassword(user.id, newPassword);
        await storage.markPasswordResetOtpUsed(record._id.toString());

        console.log(`🔑 Password successfully reset for user ${user.username} (${user.email})`);

        res.json({
            success: true,
            message: "Your password has been successfully updated. You can now log in."
        });
    } catch (error: any) {
        console.error('❌ Reset password error:', error);
        res.status(500).json({ error: "Failed to reset password. Please try again." });
    }
});

export default router;
