import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { SerpController } from '../controllers/serp';

const router = Router();

// Analyze keyword for opportunities
router.post('/analyze', authMiddleware, async (req: AuthRequest, res: Response) => {
  await SerpController.analyzeKeyword(req, res);
});

// Get SERP analysis results
router.get('/analysis/:keywordId', authMiddleware, async (req: AuthRequest, res: Response) => {
  await SerpController.getSerpAnalysis(req, res);
});

export default router;
