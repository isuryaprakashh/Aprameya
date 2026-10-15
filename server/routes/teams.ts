import { Router } from "express";
import { storage } from "../storage";
import { insertTeamMemberSchema } from "../shared/schema";
import { isAdminOrCore, isAdmin } from "../middleware/auth";

const router = Router();

const DEFAULT_TEAM_MEMBERS = [
  {
    name: "Prof. Hari Kiran Vege",
    role: "Faculty Advisor & Mentor",
    category: "Faculty Mentors",
    department: "Computer Science & Engineering",
    year: "Faculty",
    image: "",
    email: "vegeharikiran@kluniversity.in",
    linkedin: "",
    github: "",
    bio: "Guiding core autonomy initiatives, academic research, and institutional laboratory facilities at KL University.",
    order: 1
  },
  {
    name: "Mr. Srikanth Annamareddy",
    role: "Technical Mentor",
    category: "Faculty Mentors",
    department: "Robotics & Autonomous Systems",
    year: "Faculty / Lead",
    image: "",
    email: "srikanth.a@kluniversity.in",
    linkedin: "",
    github: "",
    bio: "Mentoring embedded controls, hardware integration, and perception pipelines.",
    order: 2
  },
  {
    name: "Singavarapu Sai Revanth",
    role: "Core Team Lead",
    category: "Core Team",
    department: "Computer Science",
    year: "Core Team",
    image: "",
    email: "",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    bio: "Leading autonomous systems design, architecture, and competition engineering teams.",
    order: 3
  },
  {
    name: "Akula Venkata Praveen",
    role: "Perception & Vision Lead",
    category: "Core Team",
    department: "Computer Science",
    year: "Core Team",
    image: "",
    email: "",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    bio: "Specializing in multi-camera object detection, sensor calibration, and SLAM.",
    order: 4
  },
  {
    name: "Atmakuri Komal Sai Raj",
    role: "Embedded & Systems Lead",
    category: "Core Team",
    department: "Electronics & Computer Engineering",
    year: "Core Team",
    image: "",
    email: "",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    bio: "Architecting CAN-bus microcontrollers, power management, and real-time computing hardware.",
    order: 5
  },
  {
    name: "Kamsani Yashwanth Chowdary",
    role: "Integration & Testing Lead",
    category: "Core Team",
    department: "Computer Science",
    year: "Core Team",
    image: "",
    email: "",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    bio: "Directing vehicle field trials, software regression tests, and ROS 2 system verification.",
    order: 6
  }
];

// In-memory cache for high-speed delivery of team roster (eliminates 4.5s MongoDB Atlas latency)
let cachedTeamMembers: any[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export const invalidateTeamsCache = () => {
  cachedTeamMembers = null;
  lastCacheTime = 0;
};

export const preloadTeamsCache = async () => {
  try {
    const members = await storage.getAllTeamMembers();
    if (members && members.length > 0) {
      cachedTeamMembers = members;
      lastCacheTime = Date.now();
      console.log(`Preloaded ${members.length} team members into in-memory cache.`);
    }
  } catch (err) {
    console.error("Failed to preload team members cache:", err);
  }
};

// GET /api/teams - List all team members (auto-seeds defaults if empty)
router.get("/teams", async (_req, res) => {
  try {
    if (cachedTeamMembers && (Date.now() - lastCacheTime < CACHE_TTL_MS)) {
      res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      return res.json(cachedTeamMembers);
    }

    let members = await storage.getAllTeamMembers();

    if (members.length === 0) {
      console.log("Seeding default team members into database...");
      for (const m of DEFAULT_TEAM_MEMBERS) {
        await storage.createTeamMember(m);
      }
      members = await storage.getAllTeamMembers();
    }

    cachedTeamMembers = members;
    lastCacheTime = Date.now();

    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(members);
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    if (cachedTeamMembers) {
      res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      return res.json(cachedTeamMembers);
    }
    res.status(500).json({ error: "Failed to fetch team members" });
  }
});

// GET /api/teams/:id - Single team member details
router.get("/teams/:id", async (req, res) => {
  try {
    const member = await storage.getTeamMember(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Team member not found" });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch team member" });
  }
});

// POST /api/teams/reorder - Bulk update team member order (Core or Admin)
router.post("/teams/reorder", isAdminOrCore, async (req, res) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: "orders must be an array of { id, order }" });
    }

    for (const item of orders) {
      if (item.id && typeof item.order === 'number') {
        await storage.updateTeamMember(item.id, { order: item.order });
      }
    }

    invalidateTeamsCache();
    const updatedMembers = await storage.getAllTeamMembers();
    res.json({ success: true, members: updatedMembers });
  } catch (error) {
    console.error("Failed to reorder team members:", error);
    res.status(500).json({ error: "Failed to reorder team members" });
  }
});

// POST /api/teams - Create a new team member (Core or Admin)
router.post("/teams", isAdminOrCore, async (req, res) => {
  try {
    const parsed = insertTeamMemberSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation error", details: parsed.error });
    }

    const member = await storage.createTeamMember(parsed.data);
    invalidateTeamsCache();
    res.status(201).json(member);
  } catch (error) {
    console.error("Failed to create team member:", error);
    res.status(500).json({ error: "Failed to create team member" });
  }
});

// PUT / PATCH /api/teams/:id - Update existing team member
const handleUpdateTeamMember = async (req: any, res: any) => {
  try {
    const parsed = insertTeamMemberSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation error", details: parsed.error });
    }

    const updated = await storage.updateTeamMember(req.params.id, parsed.data);
    if (!updated) {
      return res.status(404).json({ error: "Team member not found" });
    }

    invalidateTeamsCache();
    res.json(updated);
  } catch (error) {
    console.error("Failed to update team member:", error);
    res.status(500).json({ error: "Failed to update team member" });
  }
};

router.put("/teams/:id", isAdminOrCore, handleUpdateTeamMember);
router.patch("/teams/:id", isAdminOrCore, handleUpdateTeamMember);

// DELETE /api/teams/:id - Remove team member (Admin only)
router.delete("/teams/:id", isAdmin, async (req, res) => {
  try {
    const success = await storage.deleteTeamMember(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Team member not found" });
    }
    invalidateTeamsCache();
    res.json({ success: true, message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Failed to delete team member:", error);
    res.status(500).json({ error: "Failed to delete team member" });
  }
});

export default router;
