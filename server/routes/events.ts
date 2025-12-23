import { Router } from "express";
import { storage } from "../storage";
import { insertEventSchema, insertEventRegistrationSchema, UserRole } from "../shared/schema";
import { isAdmin, isAdminOrCore } from "../middleware/auth";

const router = Router();

// --- Event CRUD ---

router.get("/events", async (req, res) => {
    try {
        const events = await storage.getAllEvents();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

router.get("/events/:id", async (req, res) => {
    try {
        const event = await storage.getEvent(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch event" });
    }
});

router.post("/events", isAdminOrCore, async (req, res) => {
    try {
        const userId = req.session?.userId;
        if (!userId) return res.status(401).json({ error: "Not authenticated" });

        const eventInput = insertEventSchema.safeParse({
            ...req.body,
            user_id: userId
        });

        if (!eventInput.success) {
            return res.status(400).json({ error: eventInput.error });
        }

        const event = await storage.createEvent(eventInput.data);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: "Failed to create event" });
    }
});

router.put("/events/:id", isAdminOrCore, async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await storage.getEvent(eventId);
        if (!event) return res.status(404).json({ error: "Event not found" });

        const userId = req.session?.userId;
        const user = await storage.getUser(userId!);

        if (event.user_id !== userId && user?.role !== UserRole.ADMIN) {
            return res.status(403).json({ error: "Not authorized to update this event" });
        }

        const updatedEvent = await storage.updateEvent(eventId, req.body);
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ error: "Failed to update event" });
    }
});

router.delete("/events/:id", isAdminOrCore, async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await storage.getEvent(eventId);
        if (!event) return res.status(404).json({ error: "Event not found" });

        const userId = req.session?.userId;
        const user = await storage.getUser(userId!);

        if (event.user_id !== userId && user?.role !== UserRole.ADMIN) {
            return res.status(403).json({ error: "Not authorized to delete this event" });
        }

        await storage.deleteEvent(eventId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete event" });
    }
});

// --- Event Registrations ---

router.post("/event-registrations", async (req, res) => {
    try {
        const userId = req.session?.userId;
        if (!userId) return res.status(401).json({ error: "Not authenticated" });

        // Support both camelCase (frontend) and snake_case (legacy/db)
        const eventId = req.body.eventId || req.body.event_id;
        const message = req.body.message;

        if (!eventId) return res.status(400).json({ error: "Event ID is required" });

        const event = await storage.getEvent(eventId);
        if (!event) return res.status(404).json({ error: "Event not found" });

        const existingRegistration = await storage.getEventRegistrationByUserAndEvent(userId, eventId);
        if (existingRegistration) {
            return res.status(400).json({ error: "You have already registered for this event" });
        }

        // Create registration
        const registrationInput = {
            event_id: eventId,
            user_id: userId,
            ...(message && { message }) // Optional message
        };

        // Validate with schema just in case, though structure is simple
        const result = insertEventRegistrationSchema.safeParse(registrationInput);
        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        const registration = await storage.createEventRegistration(result.data);

        res.status(201).json({
            success: true,
            message: "Successfully registered for event",
            registration: {
                id: registration.id,
                eventTitle: event.title,
                eventDate: event.date,
                registeredAt: registration.created_at
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to register for event" });
    }
});

router.get("/event-registrations/my", async (req, res) => {
    try {
        const userId = req.session?.userId;
        if (!userId) return res.status(401).json({ error: "Not authenticated" });

        const registrations = await storage.getEventRegistrationsByUser(userId);

        const registrationsWithEvents = await Promise.all(
            registrations.map(async (registration) => {
                const event = await storage.getEvent(registration.event_id);
                return {
                    ...registration,
                    registered_at: registration.created_at,
                    registeredAt: registration.created_at,
                    event: event ? {
                        id: event.id,
                        title: event.title,
                        date: event.date,
                        time: event.time,
                        location: event.location,
                        image: event.image
                    } : null
                };
            })
        );
        res.json(registrationsWithEvents);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch registrations" });
    }
});

router.delete("/event-registrations/:registrationId", async (req, res) => {
    try {
        const userId = req.session?.userId;
        if (!userId) return res.status(401).json({ error: "Not authenticated" });

        const registrationId = req.params.registrationId;
        const registration = await storage.getEventRegistration(registrationId);
        if (!registration) return res.status(404).json({ error: "Registration not found" });

        const user = await storage.getUser(userId!);
        if (registration.user_id !== userId && user?.role !== UserRole.ADMIN) {
            return res.status(403).json({ error: "Not authorized to cancel this registration" });
        }

        await storage.deleteEventRegistration(registrationId);
        res.json({ success: true, message: "Registration cancelled successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to cancel registration" });
    }
});

router.get("/events/:eventId/registrations", isAdminOrCore, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await storage.getEvent(eventId);
        if (!event) return res.status(404).json({ error: "Event not found" });

        const registrations = await storage.getEventRegistrationsByEvent(eventId);
        const registrationsWithUsers = await Promise.all(
            registrations.map(async (registration) => {
                const user = await storage.getUser(registration.user_id);
                return {
                    id: registration.id,
                    registeredAt: registration.created_at,
                    user: user ? (() => {
                        const { password, ...userWithoutPassword } = user;
                        return userWithoutPassword;
                    })() : null
                };
            })
        );

        res.json({
            event: {
                id: event.id,
                title: event.title,
                date: event.date,
                time: event.time,
                location: event.location
            },
            registrations: registrationsWithUsers,
            totalRegistrations: registrationsWithUsers.length
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch event registrations" });
    }
});

router.get("/admin/event-registrations", isAdmin, async (req, res) => {
    try {
        const allRegistrations = await storage.getAllEventRegistrations();
        const registrationsWithDetails = await Promise.all(
            allRegistrations.map(async (registration) => {
                const [event, user] = await Promise.all([
                    storage.getEvent(registration.event_id),
                    storage.getUser(registration.user_id)
                ]);
                return {
                    id: registration.id,
                    registeredAt: registration.created_at,
                    event: event ? {
                        id: event.id,
                        title: event.title,
                        date: event.date,
                        time: event.time,
                        location: event.location
                    } : null,
                    user: user ? (() => {
                        const { password, ...userWithoutPassword } = user;
                        return userWithoutPassword;
                    })() : null
                };
            })
        );

        res.json({
            registrations: registrationsWithDetails,
            totalRegistrations: registrationsWithDetails.length
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch registrations" });
    }
});

export default router;
