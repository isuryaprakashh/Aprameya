import { Router } from "express";
import { TicketRegistration } from "../models";
import { Event } from "../models";
import { isAuthenticated, isAdminOrCore } from "../middleware/auth";
import { insertTicketRegistrationSchema } from "../shared/schema";
import { generateTicketToken, verifyTicketToken, generateQRDataUrl } from "../services/qrService";
import { storage } from "../storage";

const router = Router();

// Helper: generate a random 3-char alphanumeric entry code, unique per event
const ENTRY_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid confusion

async function generateUniqueEntryCode(eventId: string): Promise<string> {
    for (let attempt = 0; attempt < 20; attempt++) {
        let code = '';
        for (let i = 0; i < 3; i++) {
            code += ENTRY_CODE_CHARS[Math.floor(Math.random() * ENTRY_CODE_CHARS.length)];
        }
        const exists = await TicketRegistration.findOne({ eventId, entryCode: code }).lean();
        if (!exists) return code;
    }
    throw new Error('Failed to generate unique entry code after 20 attempts');
}

// ==========================================
// POST /tickets/register — Register for event ticket
// ==========================================
router.post("/tickets/register", isAuthenticated, async (req, res) => {
    try {
        const userId = req.session?.userId;
        if (!userId) return res.status(401).json({ error: "Not authenticated" });

        // Validate input
        const parsed = insertTicketRegistrationSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: parsed.error.flatten().fieldErrors,
            });
        }

        const { fullName, rollNumber, year, eventId } = parsed.data;

        // Check event exists
        const event = await Event.findById(eventId).lean();
        if (!event) return res.status(404).json({ error: "Event not found" });

        // Check registration is open
        if (event.registrationOpen === false) {
            return res.status(400).json({ error: "Registration is closed for this event" });
        }

        // Check capacity (if set)
        if (event.capacity && event.capacity > 0) {
            const currentCount = await TicketRegistration.countDocuments({ eventId });
            if (currentCount >= event.capacity) {
                return res.status(400).json({ error: "Event is full. No more seats available." });
            }
        }

        // Generate unique entry code for this event
        const entryCode = await generateUniqueEntryCode(eventId);

        // Create a placeholder token first, will be updated after save
        const tempToken = "pending";

        try {
            // Create registration — compound unique index handles duplicates
            const registration = new TicketRegistration({
                eventId,
                userId,
                fullName: fullName.trim(),
                rollNumber,
                year,
                qrToken: tempToken,
                entryCode,
            });

            await registration.save();

            // Now generate the real JWT token with the registration ID
            const qrToken = generateTicketToken(
                registration._id.toString(),
                eventId,
                rollNumber
            );

            // Update the registration with the real token
            registration.qrToken = qrToken;
            await registration.save();

            // Generate QR code data URL (NOT stored in DB)
            const qrDataUrl = await generateQRDataUrl(qrToken);

            res.status(201).json({
                success: true,
                message: "Successfully registered for event",
                ticket: {
                    id: registration._id.toString(),
                    eventTitle: (event as any).title,
                    eventDate: (event as any).date,
                    fullName: registration.fullName,
                    rollNumber: registration.rollNumber,
                    year: registration.year,
                    entryCode: registration.entryCode,
                    qrDataUrl,
                    qrToken,
                    registeredAt: registration.createdAt,
                },
            });
        } catch (err: any) {
            // Handle duplicate key error (MongoDB 11000)
            if (err.code === 11000) {
                return res.status(409).json({
                    error: "This roll number is already registered for this event",
                });
            }
            throw err;
        }
    } catch (error) {
        console.error("Ticket registration error:", error);
        res.status(500).json({ error: "Failed to register for event" });
    }
});

// ==========================================
// GET /tickets/my — Get all my tickets
// ==========================================
router.get("/tickets/my", isAuthenticated, async (req, res) => {
    try {
        const userId = req.session?.userId;
        if (!userId) return res.status(401).json({ error: "Not authenticated" });

        const tickets = await TicketRegistration.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        // Enrich with event details and regenerate QR data URLs on the fly
        const ticketsWithDetails = await Promise.all(
            tickets.map(async (ticket) => {
                const event = await Event.findById(ticket.eventId).lean();
                let qrDataUrl = '';
                try {
                    qrDataUrl = await generateQRDataUrl(ticket.qrToken);
                } catch (e) {
                    console.error("QR Generation failed for ticket", ticket._id, e);
                }

                return {
                    id: ticket._id.toString(),
                    eventId: ticket.eventId.toString(),
                    fullName: ticket.fullName,
                    rollNumber: ticket.rollNumber,
                    year: ticket.year,
                    entryCode: ticket.entryCode,
                    scanned: ticket.scanned,
                    scannedAt: ticket.scannedAt,
                    createdAt: ticket.createdAt,
                    qrDataUrl,
                    qrToken: ticket.qrToken,
                    event: event
                        ? {
                            id: (event as any)._id.toString(),
                            title: (event as any).title,
                            date: (event as any).date,
                            time: (event as any).time,
                            location: (event as any).location,
                            image: (event as any).image,
                            type: (event as any).type,
                        }
                        : null,
                };
            })
        );

        res.json(ticketsWithDetails);
    } catch (error) {
        console.error("Fetch tickets error:", error);
        res.status(500).json({ error: "Failed to fetch tickets" });
    }
});

// ==========================================
// GET /tickets/my/:eventId — Get my ticket for a specific event
// ==========================================
router.get("/tickets/my/:eventId", isAuthenticated, async (req, res) => {
    try {
        const userId = req.session?.userId;
        if (!userId) return res.status(401).json({ error: "Not authenticated" });

        const ticket = await TicketRegistration.findOne({
            userId,
            eventId: req.params.eventId,
        }).lean();

        if (!ticket) return res.status(404).json({ error: "Ticket not found" });

        const event = await Event.findById(ticket.eventId).lean();
        const qrDataUrl = await generateQRDataUrl(ticket.qrToken);

        res.json({
            id: ticket._id.toString(),
            eventId: ticket.eventId.toString(),
            fullName: ticket.fullName,
            rollNumber: ticket.rollNumber,
            year: ticket.year,
            entryCode: ticket.entryCode,
            scanned: ticket.scanned,
            scannedAt: ticket.scannedAt,
            createdAt: ticket.createdAt,
            qrDataUrl,
            qrToken: ticket.qrToken,
            event: event
                ? {
                    id: (event as any)._id.toString(),
                    title: (event as any).title,
                    date: (event as any).date,
                    time: (event as any).time,
                    location: (event as any).location,
                }
                : null,
        });
    } catch (error) {
        console.error("Fetch ticket error:", error);
        res.status(500).json({ error: "Failed to fetch ticket" });
    }
});

// ==========================================
// POST /tickets/scan — Admin scans a QR code
// ==========================================
router.post("/tickets/scan", isAdminOrCore, async (req, res) => {
    try {
        const { token, expectedEventId } = req.body;

        if (!token) {
            return res.status(400).json({ error: "QR token or entry code is required" });
        }

        const trimmed = token.trim().toUpperCase();
        const isEntryCode = trimmed.length <= 6; // Entry codes are 4 chars, JWTs are 100+ chars

        let query: any;

        if (isEntryCode) {
            // Entry code mode — requires an event to be selected
            if (!expectedEventId) {
                return res.status(400).json({
                    error: "Please select an event first when using an entry code",
                    code: "EVENT_REQUIRED",
                });
            }
            query = { entryCode: trimmed, eventId: expectedEventId };
        } else {
            // QR token mode — verify JWT
            let decoded;
            try {
                decoded = verifyTicketToken(token);
            } catch (err: any) {
                if (err.name === "TokenExpiredError") {
                    return res.status(400).json({ error: "QR code has expired", code: "EXPIRED" });
                }
                return res.status(400).json({ error: "Invalid or tampered QR code", code: "INVALID" });
            }

            // If expectedEventId is provided, check for cross-event misuse
            if (expectedEventId && decoded.eventId !== expectedEventId) {
                return res.status(400).json({
                    error: "This QR code is for a different event",
                    code: "WRONG_EVENT",
                });
            }

            query = { _id: decoded.registrationId, eventId: decoded.eventId };
        }

        // Atomic scan: find the ticket that hasn't been scanned yet and mark it
        const result = await TicketRegistration.findOneAndUpdate(
            {
                ...query,
                scanned: false,
            },
            {
                $set: {
                    scanned: true,
                    scannedAt: new Date(),
                },
            },
            { new: true }
        ).lean();

        if (!result) {
            // Check if it exists but was already scanned
            const existing = await TicketRegistration.findOne(query).lean();
            if (!existing) {
                return res.status(404).json({ error: isEntryCode ? "Entry code not found" : "Registration not found", code: "NOT_FOUND" });
            }
            if (existing.scanned) {
                return res.status(409).json({
                    error: "This ticket has already been scanned",
                    code: "ALREADY_SCANNED",
                    scannedAt: existing.scannedAt,
                });
            }
            return res.status(400).json({ error: "Scan failed", code: "SCAN_FAILED" });
        }

        // Get event details for response
        const event = await Event.findById(result.eventId).lean();

        res.json({
            success: true,
            message: "Ticket scanned successfully",
            ticket: {
                id: result._id.toString(),
                fullName: result.fullName,
                rollNumber: result.rollNumber,
                year: result.year,
                scannedAt: result.scannedAt,
                eventTitle: event ? (event as any).title : "Unknown Event",
            },
        });
    } catch (error) {
        console.error("Scan error:", error);
        res.status(500).json({ error: "Failed to scan ticket" });
    }
});

// ==========================================
// GET /tickets/event/:eventId — List all registrations for an event
// ==========================================
router.get("/tickets/event/:eventId", isAdminOrCore, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId).lean();
        if (!event) return res.status(404).json({ error: "Event not found" });

        const tickets = await TicketRegistration.find({ eventId })
            .sort({ createdAt: -1 })
            .lean();

        const ticketList = tickets.map((t) => ({
            id: t._id.toString(),
            fullName: t.fullName,
            rollNumber: t.rollNumber,
            year: t.year,
            entryCode: t.entryCode,
            scanned: t.scanned,
            scannedAt: t.scannedAt,
            createdAt: t.createdAt,
        }));

        res.json({
            event: {
                id: (event as any)._id.toString(),
                title: (event as any).title,
                date: (event as any).date,
                time: (event as any).time,
                location: (event as any).location,
                capacity: (event as any).capacity,
                registrationOpen: (event as any).registrationOpen,
            },
            tickets: ticketList,
            totalTickets: ticketList.length,
            scannedCount: ticketList.filter((t) => t.scanned).length,
        });
    } catch (error) {
        console.error("Fetch event tickets error:", error);
        res.status(500).json({ error: "Failed to fetch event tickets" });
    }
});

// ==========================================
// GET /tickets/event/:eventId/export — Export registrations as CSV
// ==========================================
router.get("/tickets/event/:eventId/export", isAdminOrCore, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId).lean();
        if (!event) return res.status(404).json({ error: "Event not found" });

        const tickets = await TicketRegistration.find({ eventId })
            .sort({ createdAt: 1 })
            .lean();

        // Build CSV
        const header = "Name,Roll Number,Year,Scanned,Scanned Time,Registered At\n";
        const rows = tickets.map((t) => {
            const scannedStatus = t.scanned ? "Yes" : "No";
            const formatDate = (d: Date) => d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

            const scannedTime = t.scannedAt
                ? `"${formatDate(new Date(t.scannedAt))}"`
                : "";
            const registeredAt = `"${formatDate(new Date(t.createdAt))}"`;

            // Escape commas in name
            const name = `"${t.fullName.replace(/"/g, '""')}"`;
            return `${name},${t.rollNumber},${t.year},${scannedStatus},${scannedTime},${registeredAt}`;
        });

        const csv = header + rows.join("\n");
        const eventTitle = (event as any).title.replace(/[^a-zA-Z0-9\-_]/g, "_");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${eventTitle}.csv"`
        );
        res.send(csv);
    } catch (error) {
        console.error("Export CSV error:", error);
        res.status(500).json({ error: "Failed to export registrations" });
    }
});

export default router;
