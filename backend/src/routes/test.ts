import { Router, Request, Response } from 'express';

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

export default router;
