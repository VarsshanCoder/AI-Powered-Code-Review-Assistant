import { Router } from 'express';

const router = Router();

router.post('/analyze', (req, res) => {
  res.json({ message: 'AI analyze endpoint' });
});

router.post('/explain', (req, res) => {
  res.json({ message: 'AI explain endpoint' });
});

router.post('/auto-fix', (req, res) => {
  res.json({ message: 'AI auto-fix endpoint' });
});

export default router;