import { Router, Response } from 'express';
import { KeywordModel } from '../models/index';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// Search keywords
router.get('/search', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const keywords = await KeywordModel.search(q as string, parseInt(limit as string));
    res.json(keywords);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get keyword by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const keyword = await KeywordModel.findById(id);

    if (!keyword) {
      return res.status(404).json({ error: 'Keyword not found' });
    }

    res.json(keyword);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
