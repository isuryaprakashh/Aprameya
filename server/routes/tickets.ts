import { Router } from "express";
import { storage } from "../storage";
import { insertTicketRegistrationSchema } from "../shared/schema";
import { isAuthenticated, isAdminOrCore } from "../middleware/auth";
import { nanoid } from "nanoid";

const router = Router();

// Register for an event
router.post("/tickets/register", isAuthenticated, async (req, res) => {
    try {
        const ticketInput = insertTicketRegistrationSchema.safeParse(req.body);

        if (!ticketInput.success) {
            return res.status(400).json({ error: ticketInput.error });
        }

        const { eventId, fullName, rollNumber, year } = ticketInput.data;
        const userId = req.session.userId!;

        // Check if event exists
        const event = await storage.getEvent(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Check if registration is open
        if (event.registrationOpen === false) {
            return res.status(400).json({ error: "Registration is closed for this event" });
        }

        // Check for existing registration for this user
        const existingTicket = await storage.getTicketRegistrationByUserAndEvent(userId, eventId);
        if (existingTicket) {
            return res.status(400).json({ error: "You are already registered for this event" });
        }

        // Check for duplicate roll number (prevent double registration by same person with different account)
        const allTickets = await storage.getTicketRegistrationsByEvent(eventId);
        const duplicate = allTickets.find(t => t.rollNumber === rollNumber);
        if (duplicate) {
            return res.status(400).json({ error: "This Roll Number is already registered" });
        }

        // Check capacity if applicable
        if (event.capacity && allTickets.length >= event.capacity) {
            return res.status(400).json({ error: "Event capacity reached" });
        }

        // Generate tokens
        const qrToken = nanoid(32); // Long secure token for QR
        const entryCode = nanoid(3).toUpperCase(); // Short 3-char code for manual entry

        const ticket = await storage.createTicketRegistration({
            ...ticketInput.data,
            userId,
            qrToken,
            entryCode,
        });

        res.status(201).json({ ticket });
    } catch (error) {
        console.error("Ticket registration error:", error);
        res.status(500).json({ error: "Failed to register ticket" });
    }
});

// Get all my tickets
router.get("/tickets/my", isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId!;
        const tickets = await storage.getTicketRegistrationsByUser(userId);

        // Enhance tickets with event details
        const ticketsWithEvents = await Promise.all(tickets.map(async (ticket) => {
            const event = await storage.getEvent(ticket.eventId);
            return {
                ...ticket,
                event: event ? {
                    title: event.title,
                    date: event.date,
                    time: event.time,
                    location: event.location
                } : null
            };
        }));

        res.json(ticketsWithEvents);
    } catch (error) {
        console.error("Get my tickets error:", error);
        res.status(500).json({ error: "Failed to fetch tickets" });
    }
});

// Get my ticket for an event
router.get("/tickets/my/:eventId", isAuthenticated, async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.session.userId!;

        const ticket = await storage.getTicketRegistrationByUserAndEvent(userId, eventId);

        if (!ticket) {
            return res.json(null); // Return null if no ticket found, not 404
        }

        const event = await storage.getEvent(eventId);

        res.json({
            ...ticket,
            eventTitle: event?.title || "Unknown Event",
            eventDate: event?.date || ""
        });
    } catch (error) {
        console.error("Get my ticket error:", error);
        res.status(500).json({ error: "Failed to fetch ticket" });
    }
});

// Create a new ticket (Admin only) - KEEPING FOR BACKWARD COMPATIBILITY OR ADMIN OVERRIDE
router.post("/tickets", isAdminOrCore, async (req, res) => {
    try {
        const ticketInput = insertTicketRegistrationSchema.safeParse(req.body);

        if (!ticketInput.success) {
            return res.status(400).json({ error: ticketInput.error });
        }

        const { eventId, fullName, rollNumber, year } = ticketInput.data;

        // Check for existing registration
        const existingTickets = await storage.getTicketRegistrationsByEvent(eventId);
        const duplicate = existingTickets.find(t => t.rollNumber === rollNumber);

        if (duplicate) {
            return res.status(400).json({ error: "Student already registered for this event" });
        }

        // Generate tokens
        const qrToken = nanoid(32); // Long secure token for QR
        const entryCode = nanoid(3).toUpperCase(); // Short 3-char code for manual entry

        const ticket = await storage.createTicketRegistration({
            ...ticketInput.data,
            userId: req.session.userId!,
            qrToken,
            entryCode,
        });

        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ error: "Failed to create ticket" });
    }
});

// Scan a ticket
router.post("/tickets/scan", isAdminOrCore, async (req, res) => {
    try {
        const { token, expectedEventId } = req.body;

        if (!token) return res.status(400).json({ error: "Token is required" });

        // Try finding by QR token first, then by entry code
        let ticket = await storage.getTicketRegistrationByToken(token);
        if (!ticket) {
            ticket = await storage.getTicketRegistrationByEntryCode(token.toUpperCase());
        }

        if (!ticket) {
            return res.status(404).json({ error: "Invalid ticket" });
        }

        // Check event mismatch if specified
        if (expectedEventId && ticket.eventId.toString() !== expectedEventId) {
            return res.status(400).json({
                error: "Wrong Event",
                code: "WRONG_EVENT",
                ticket
            });
        }

        // Check if already scanned
        if (ticket.scanned) {
            return res.status(400).json({
                error: "Already Scanned",
                code: "ALREADY_SCANNED",
                scannedAt: ticket.scannedAt,
                ticket
            });
        }

        // Mark as scanned
        const scannerId = req.session.userId!;
        const scanner = await storage.getUser(scannerId);
        const scannerName = scanner ? scanner.username : "Unknown";

        const updatedTicket = await storage.updateTicketScanStatus(ticket.id, true, scannerId, scannerName);

        // Fetch event details for response
        const event = await storage.getEvent(ticket.eventId);

        res.json({
            success: true,
            ticket: {
                ...updatedTicket,
                eventTitle: event?.title || "Unknown Event"
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Scan failed" });
    }
});

// Get tickets for an event
router.get("/tickets/event/:eventId", isAdminOrCore, async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await storage.getEvent(eventId);

        if (!event) return res.status(404).json({ error: "Event not found" });

        const tickets = await storage.getTicketRegistrationsByEvent(eventId);

        res.json({
            event: { id: event.id, title: event.title, date: event.date },
            tickets,
            totalTickets: tickets.length,
            scannedCount: tickets.filter(t => t.scanned).length
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tickets" });
    }
});

// Export CSV
router.get("/tickets/event/:eventId/export", isAdminOrCore, async (req, res) => {
    try {
        const { eventId } = req.params;
        const tickets = await storage.getTicketRegistrationsByEvent(eventId);

        if (tickets.length === 0) {
            return res.status(404).send("No registrations found");
        }

        // Simple CSV generation
        const headers = ["Full Name", "Roll Number", "Year", "Entry Code", "Scanned", "Scanned At", "Scanned By"];
        const rows = tickets.map(t => [
            t.fullName,
            t.rollNumber,
            t.year,
            t.entryCode,
            t.scanned ? "Yes" : "No",
            t.scannedAt ? new Date(t.scannedAt).toLocaleString() : "",
            t.scannedByName || ""
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        res.header("Content-Type", "text/csv");
        res.header("Content-Disposition", `attachment; filename="registrations_${eventId}.csv"`);
        res.send(csvContent);
    } catch (error) {
        res.status(500).json({ error: "Export failed" });
    }
});

export default router;
