import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get repositories' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Add repository' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get repository' });
});

export default router;