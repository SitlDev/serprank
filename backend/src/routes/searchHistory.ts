import { Router } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { SearchHistoryModel } from '../models/index';

const router = Router();

// Get recent searches
router.get('/search-history', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const searches = await SearchHistoryModel.getRecentSearches(req.userId!, limit);
    res.json(searches);
  } catch (error: any) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add search to history
router.post('/search-history', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { keyword } = req.body;
    
    if (!keyword || typeof keyword !== 'string' || keyword.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid keyword' });
    }

    const search = await SearchHistoryModel.addSearch(req.userId!, keyword.trim());
    res.json(search);
  } catch (error: any) {
    console.error('Error adding to search history:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a search from history
router.delete('/search-history/:searchId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { searchId } = req.params;
    await SearchHistoryModel.deleteSearch(req.userId!, searchId);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting from search history:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clear all search history
router.delete('/search-history', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await SearchHistoryModel.clearHistory(req.userId!);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error clearing search history:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
