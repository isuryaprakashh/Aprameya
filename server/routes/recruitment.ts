import { Router } from 'express';
import { storage } from '../storage';
import { isAuthenticated, isAdmin } from '../middleware/auth';
import {
  insertRecruitmentApplicationSchema,
  applicationDecisionSchema,
} from '../shared/schema';

const router = Router();

// GET /api/recruitment/settings — public
router.get('/recruitment/settings', async (_req, res) => {
  const settings = await storage.getRecruitmentSettings();
  res.json({ isOpen: settings?.isOpen ?? false });
});

// PUT /api/recruitment/settings — admin only
router.put('/recruitment/settings', isAdmin, async (req, res) => {
  try {
    const { isOpen } = req.body;
    if (typeof isOpen !== 'boolean') {
      return res.status(400).json({ error: 'isOpen must be a boolean' });
    }
    const settings = await storage.upsertRecruitmentSettings(isOpen, req.session.userId!);
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// POST /api/recruitment/applications — authenticated
router.post('/recruitment/applications', isAuthenticated, async (req, res) => {
  try {
    const settings = await storage.getRecruitmentSettings();
    if (!settings?.isOpen) {
      return res.status(423).json({ error: 'Recruitment is currently closed' });
    }

    const userId = req.session.userId!;
    const existing = await storage.getRecruitmentApplicationByUser(userId);
    if (existing) {
      return res.status(409).json({ error: 'Application already submitted' });
    }

    const data = insertRecruitmentApplicationSchema.parse(req.body);
    const app = await storage.createRecruitmentApplication({ ...data, userId });
    res.status(201).json(app);
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? 'Invalid application data' });
  }
});

// GET /api/recruitment/applications/mine — authenticated
router.get('/recruitment/applications/mine', isAuthenticated, async (req, res) => {
  const app = await storage.getRecruitmentApplicationByUser(req.session.userId!);
  if (!app) return res.status(404).json({ error: 'No application found' });
  res.json(app);
});

// GET /api/recruitment/applications — admin only
router.get('/recruitment/applications', isAdmin, async (req, res) => {
  const { status, domain } = req.query as { status?: string; domain?: string };
  const apps = await storage.getAllRecruitmentApplications({ status, domain });
  res.json(apps);
});

// GET /api/recruitment/applications/:id — admin only
router.get('/recruitment/applications/:id', isAdmin, async (req, res) => {
  const app = await storage.getRecruitmentApplication(req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found' });
  res.json(app);
});

// PATCH /api/recruitment/applications/:id/decision — admin only
router.patch('/recruitment/applications/:id/decision', isAdmin, async (req, res) => {
  try {
    const decision = applicationDecisionSchema.parse(req.body);
    if (decision.status === 'accepted' && (!decision.assignedDomain || !decision.assignedTitle)) {
      return res.status(400).json({ error: 'assignedDomain and assignedTitle are required when accepting' });
    }
    const result = await storage.decideRecruitmentApplication(req.params.id, decision, req.session.userId!);
    if (!result) return res.status(404).json({ error: 'Application not found' });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? 'Invalid decision data' });
  }
});

export default router;
