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
    image: "/assets/team_avatar_1.png",
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
    image: "/assets/team_avatar_2.png",
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
    image: "/assets/team_avatar_3.png",
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
    image: "/assets/team_avatar_4.png",
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
    image: "/assets/team_avatar_1.png",
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
    image: "/assets/team_avatar_2.png",
    email: "",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    bio: "Directing vehicle field trials, software regression tests, and ROS 2 system verification.",
    order: 6
  }
];

// GET /api/teams - List all team members (auto-seeds defaults if empty)
router.get("/teams", async (_req, res) => {
  try {
    let members = await storage.getAllTeamMembers();

    if (members.length === 0) {
      console.log("Seeding default team members into database...");
      for (const m of DEFAULT_TEAM_MEMBERS) {
        await storage.createTeamMember(m);
      }
      members = await storage.getAllTeamMembers();
    }

    res.json(members);
  } catch (error) {
    console.error("Failed to fetch team members:", error);
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

// POST /api/teams - Create a new team member (Core or Admin)
router.post("/teams", isAdminOrCore, async (req, res) => {
  try {
    const parsed = insertTeamMemberSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation error", details: parsed.error });
    }

    const member = await storage.createTeamMember(parsed.data);
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
    res.json({ success: true, message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Failed to delete team member:", error);
    res.status(500).json({ error: "Failed to delete team member" });
  }
});

export default router;
