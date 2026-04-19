import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { SerpController } from '../controllers/serp';

const router = Router();

// Analyze keyword for opportunities
router.post('/analyze', authMiddleware, async (req: AuthRequest, res: Response) => {
  await SerpController.analyzeKeyword(req, res);
});

// Analyze multiple keywords in bulk
router.post('/analyze-bulk', authMiddleware, async (req: AuthRequest, res: Response) => {
  await SerpController.analyzeKeywordsBulk(req, res);
});

// Get SERP analysis results
router.get('/analysis/:keywordId', authMiddleware, async (req: AuthRequest, res: Response) => {
  await SerpController.getSerpAnalysis(req, res);
});

// Export analysis as CSV
router.get('/export/:keywordId', authMiddleware, async (req: AuthRequest, res: Response) => {
  await SerpController.exportAnalysisCSV(req, res);
});

export default router;
