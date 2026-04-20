import express, { Router, Response } from 'express';
import { HistoryModel } from '../models/history';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Middleware to verify auth
router.use(authMiddleware);

/**
 * GET /api/history/keyword/:keywordId
 * Get keyword metrics history for a keyword
 */
router.get('/keyword/:keywordId', async (req: AuthRequest, res: Response) => {
  try {
    const { keywordId } = req.params;
    const { days = 30 } = req.query;
    const daysBack = Math.min(Number(days) || 30, 365); // Max 1 year

    const history = await HistoryModel.getKeywordHistory(
      keywordId,
      req.userId!,
      daysBack
    );

    // Transform for chart display (date format for x-axis)
    const chartData = history.map((record) => ({
      date: new Date(record.recordedAt).toLocaleDateString(),
      searchVolume: record.searchVolume,
      difficulty: record.difficultyScore,
      opportunityScore: record.opportunityScore,
      keywordScore: record.keywordScore,
    }));

    res.json({
      keyword: keywordId,
      daysBack,
      data: chartData,
      count: chartData.length,
    });
  } catch (error) {
    console.error('Error fetching keyword history:', error);
    res.status(500).json({ error: 'Failed to fetch keyword history' });
  }
});

/**
 * GET /api/history/ranking/:keywordId
 * Get ranking position history
 */
router.get('/ranking/:keywordId', async (req: AuthRequest, res: Response) => {
  try {
    const { keywordId } = req.params;
    const { days = 30 } = req.query;
    const daysBack = Math.min(Number(days) || 30, 365);

    const history = await HistoryModel.getRankingHistory(
      keywordId,
      req.userId!,
      daysBack
    );

    const chartData = history.map((record) => ({
      date: new Date(record.recordedAt).toLocaleDateString(),
      position: record.position,
      estimatedTraffic: record.estimatedTraffic,
    }));

    res.json({
      keyword: keywordId,
      daysBack,
      data: chartData,
      count: chartData.length,
    });
  } catch (error) {
    console.error('Error fetching ranking history:', error);
    res.status(500).json({ error: 'Failed to fetch ranking history' });
  }
});

/**
 * GET /api/history/traffic/:keywordId
 * Get traffic estimate history
 */
router.get('/traffic/:keywordId', async (req: AuthRequest, res: Response) => {
  try {
    const { keywordId } = req.params;
    const { days = 30 } = req.query;
    const daysBack = Math.min(Number(days) || 30, 365);

    const history = await HistoryModel.getTrafficHistory(
      keywordId,
      req.userId!,
      daysBack
    );

    const chartData = history.map((record) => ({
      date: new Date(record.recordedAt).toLocaleDateString(),
      estimatedTraffic: record.estimatedMonthlyVisitors,
      position: record.position,
    }));

    res.json({
      keyword: keywordId,
      daysBack,
      data: chartData,
      count: chartData.length,
    });
  } catch (error) {
    console.error('Error fetching traffic history:', error);
    res.status(500).json({ error: 'Failed to fetch traffic history' });
  }
});

/**
 * GET /api/history/competition/:keywordId
 * Get competition metrics history
 */
router.get('/competition/:keywordId', async (req: AuthRequest, res: Response) => {
  try {
    const { keywordId } = req.params;
    const { days = 30 } = req.query;
    const daysBack = Math.min(Number(days) || 30, 365);

    const history = await HistoryModel.getCompetitionHistory(
      keywordId,
      req.userId!,
      daysBack
    );

    const chartData = history.map((record) => ({
      date: new Date(record.recordedAt).toLocaleDateString(),
      avgDomainAuthority: record.avgDomainAuthority,
      avgBacklinks: record.avgBacklinks,
      avgPageSpeed: record.avgPageSpeed,
    }));

    res.json({
      keyword: keywordId,
      daysBack,
      data: chartData,
      count: chartData.length,
    });
  } catch (error) {
    console.error('Error fetching competition history:', error);
    res.status(500).json({ error: 'Failed to fetch competition history' });
  }
});

/**
 * POST /api/history/record
 * Record current metrics snapshot for a keyword (called after analysis)
 */
router.post('/record', async (req: AuthRequest, res: Response) => {
  try {
    const {
      keywordId,
      searchVolume,
      difficulty,
      keywordScore,
      opportunityScore,
      position,
      estimatedTraffic,
      avgDomainAuthority,
      avgBacklinks,
    } = req.body;

    if (!keywordId) {
      return res.status(400).json({ error: 'keywordId is required' });
    }

    // Record all metrics
    const [keywordHistory, rankingHistory, trafficHistory, competitionHistory] =
      await Promise.all([
        HistoryModel.recordKeywordMetrics(keywordId, req.userId!, {
          searchVolume: searchVolume || 0,
          difficultyScore: difficulty || 0,
          keywordScore: keywordScore || 0,
          opportunityScore: opportunityScore || 0,
        }),
        HistoryModel.recordRankingMetrics(keywordId, req.userId!, {
          position: position || 0,
          estimatedTraffic: estimatedTraffic || 0,
          domainUrl: 'your-domain.com',
        }),
        HistoryModel.recordTrafficMetrics(keywordId, req.userId!, {
          estimatedMonthlyVisitors: estimatedTraffic || 0,
          position: position || 0,
        }),
        HistoryModel.recordCompetitionMetrics(keywordId, req.userId!, {
          avgDomainAuthority: avgDomainAuthority || 0,
          avgBacklinks: avgBacklinks || 0,
          avgPageSpeed: 1.5,
          top10Count: 10,
        }),
      ]);

    res.json({
      success: true,
      message: 'Metrics recorded successfully',
      recorded: {
        keyword: keywordHistory,
        ranking: rankingHistory,
        traffic: trafficHistory,
        competition: competitionHistory,
      },
    });
  } catch (error) {
    console.error('Error recording metrics:', error);
    res.status(500).json({ error: 'Failed to record metrics' });
  }
});

export default router;
