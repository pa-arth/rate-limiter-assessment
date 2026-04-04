import { Router } from 'express';

const router = Router();

router.get('/api/public', (_req, res) => {
  res.json({
    message: 'Hello! This is a public endpoint.',
    timestamp: new Date().toISOString(),
  });
});

router.get('/api/public/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default router;
