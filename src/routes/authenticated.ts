import { Router } from 'express';
import { extractUser, requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(extractUser);
router.use(requireAuth);

router.get('/api/user/profile', (req, res) => {
  const userId = (req as unknown as Record<string, unknown>).userId as string;
  res.json({
    userId,
    name: 'Test User',
    plan: 'pro',
  });
});

export default router;
