import { Router, Request, Response } from 'express';
import { SerpScraperService } from '../services/serp-scraper';

const router = Router();

/**
 * Test endpoint to verify backend is running
 */
router.get('/test', (req: Request, res: Response) => {
  res.json({
    message: 'Backend is working! 🎉',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * Echo endpoint to test frontend-backend communication
 */
router.post('/echo', (req: Request, res: Response) => {
  res.json({
    message: 'Echo received!',
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

/**
 * Test SERP API integration
 */
router.get('/serp/:keyword', async (req: Request, res: Response) => {
  try {
    const { keyword } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!keyword || keyword.trim().length === 0) {
      return res.status(400).json({
        error: 'Keyword is required',
        example: '/api/test/serp/best%20laptops?limit=10'
      });
    }

    console.log(`Testing SERP API with keyword: "${keyword}"`);
    const results = await SerpScraperService.fetchSearchResults(keyword, limit);

    res.json({
      keyword,
      count: results.length,
      results,
      timestamp: new Date().toISOString(),
      note: process.env.SERPER_API_KEY ? '✅ Using Serper.dev API' : '⚠️  Using mock data (SERPER_API_KEY not set)'
    });
  } catch (error) {
    console.error('Error testing SERP API:', error);
    res.status(500).json({
      error: 'Failed to fetch SERP results',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
