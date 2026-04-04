import { Router } from 'express';
import { requireApiKey } from '../middleware/auth.js';

const router = Router();

router.use(requireApiKey);

router.get('/api/admin/stats', (_req, res) => {
  res.json({
    totalRequests: 12345,
    activeUsers: 42,
    uptime: process.uptime(),
  });
});

export default router;
