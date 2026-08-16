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

// GET /api/recruitment/export — admin only (CSV export)
router.get('/recruitment/export', isAdmin, async (_req, res) => {
  try {
    const apps = await storage.getAllRecruitmentApplications();
    
    // Generate clean CSV with all candidate columns
    const headers = [
      'Full Name',
      'Student ID (Roll No)',
      'Mobile Number',
      'Department',
      'Specialization',
      'Year',
      'Track',
      'Wing',
      'Status',
      'Interview Date',
      'Interview Venue',
      'Interview Notes',
      'Motivation',
      'Portfolio Link',
      'Applied At'
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = apps.map(a => [
      escapeCsv(a.fullName),
      escapeCsv(a.rollNumber),
      escapeCsv(a.mobileNumber || ''),
      escapeCsv(a.department || a.branch || ''),
      escapeCsv(a.specialization || ''),
      escapeCsv(a.year),
      escapeCsv(a.track || 'TECH'),
      escapeCsv(a.wing || a.assignedDomain || ''),
      escapeCsv(a.status),
      escapeCsv(a.interviewDetails?.date || ''),
      escapeCsv(a.interviewDetails?.venue || ''),
      escapeCsv(a.interviewDetails?.notes || ''),
      escapeCsv(a.motivation),
      escapeCsv(a.portfolioUrl || ''),
      escapeCsv(a.appliedAt ? new Date(a.appliedAt).toLocaleString() : '')
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="aprameya_recruitment_applicants.csv"');
    res.send(csvContent);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to export applicants' });
  }
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
    if (decision.status === 'accepted' && !decision.assignedDomain) {
      decision.assignedDomain = 'Member';
    }
    const result = await storage.decideRecruitmentApplication(req.params.id, decision, req.session.userId!);
    if (!result) return res.status(404).json({ error: 'Application not found' });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? 'Invalid decision data' });
  }
});

export default router;
