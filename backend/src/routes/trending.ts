import { Router, Request, Response } from 'express'
import TrendingService from '../services/trending'

const router = Router()

/**
 * GET /api/trending
 * Get trending keywords from specified source
 * Query params:
 *  - source: 'google' | 'platform' | 'twitter' | 'tiktok' | 'instagram' | 'pinterest' | 'reddit' | 'youtube' (default: 'google')
 *  - limit: number (default: 20)
 *  - period: 'day' | 'week' | 'month' (default: 'week')
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const source = (req.query.source as string) || 'google'
    const limit = parseInt(req.query.limit as string) || 20
    const period = (req.query.period as 'day' | 'week' | 'month') || 'week'

    const keywords = await TrendingService.getTrendingKeywords(
      source as any,
      limit,
      period
    )

    res.json({
      success: true,
      data: keywords,
      source,
      period
    })
  } catch (error) {
    console.error('Error fetching trending keywords:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending keywords'
    })
  }
})

/**
 * GET /api/trending/categories
 * Get trending keywords grouped by category
 * Query params:
 *  - source: 'google' | 'platform' | 'twitter' | 'tiktok' | 'instagram' | 'pinterest' | 'reddit' | 'youtube' (default: 'platform')
 *  - limit: number (default: 10)
 *  - period: 'day' | 'week' | 'month' (default: 'week')
 */
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const source = (req.query.source as string) || 'platform'
    const limit = parseInt(req.query.limit as string) || 10
    const period = (req.query.period as 'day' | 'week' | 'month') || 'week'

    const categories = await TrendingService.getTrendingByCategory(
      source as any,
      limit,
      period
    )

    res.json({
      success: true,
      data: categories,
      source,
      period
    })
  } catch (error) {
    console.error('Error fetching trending by category:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending keywords by category'
    })
  }
})

/**
 * GET /api/trending/with-growth
 * Get trending keywords with growth metrics
 * Query params:
 *  - source: 'google' | 'platform' | 'twitter' | 'tiktok' | 'instagram' | 'pinterest' | 'reddit' | 'youtube' (default: 'platform')
 *  - limit: number (default: 20)
 *  - period: 'week' | 'month' (default: 'week')
 */
router.get('/with-growth', async (req: Request, res: Response) => {
  try {
    const source = (req.query.source as string) || 'platform'
    const limit = parseInt(req.query.limit as string) || 20
    const period = (req.query.period as 'week' | 'month') || 'week'

    const keywords = await TrendingService.getTrendingWithGrowth(
      source as any,
      limit,
      period
    )

    res.json({
      success: true,
      data: keywords,
      source,
      period
    })
  } catch (error) {
    console.error('Error fetching trending with growth:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending keywords with growth'
    })
  }
})

/**
 * GET /api/trending/spiking
 * Get keywords that are spiking
 * Query params:
 *  - source: 'google' | 'platform' | 'twitter' | 'tiktok' | 'instagram' | 'pinterest' | 'reddit' | 'youtube' (default: 'platform')
 *  - limit: number (default: 10)
 */
router.get('/spiking', async (req: Request, res: Response) => {
  try {
    const source = (req.query.source as string) || 'platform'
    const limit = parseInt(req.query.limit as string) || 10

    const keywords = await TrendingService.getSpikingKeywords(source as any, limit)

    res.json({
      success: true,
      data: keywords,
      source
    })
  } catch (error) {
    console.error('Error fetching spiking keywords:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch spiking keywords'
    })
  }
})

/**
 * GET /api/trending/sources
 * Get available trending data sources
 */
router.get('/sources', async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: 'google',
        name: 'Google',
        icon: '🔍',
        description: 'Trending searches from Google Search',
        category: 'search-engine',
        coming_soon: false
      },
      {
        id: 'bing',
        name: 'Bing',
        icon: '🔵',
        description: 'Trending searches from Bing Search',
        category: 'search-engine',
        coming_soon: false
      },
      {
        id: 'pinterest',
        name: 'Pinterest',
        icon: '📌',
        description: 'Trending pins and searches from Pinterest',
        category: 'social-commerce',
        coming_soon: false
      },
      {
        id: 'youtube',
        name: 'YouTube',
        icon: '▶️',
        description: 'Trending videos and searches from YouTube',
        category: 'video',
        coming_soon: false
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        icon: '🎵',
        description: 'Trending sounds and searches from TikTok',
        category: 'short-video',
        coming_soon: false
      },
      {
        id: 'instagram',
        name: 'Instagram',
        icon: '📷',
        description: 'Trending hashtags and searches from Instagram',
        category: 'social',
        coming_soon: false
      },
      {
        id: 'twitter',
        name: 'Twitter',
        icon: '𝕏',
        description: 'Trending topics and searches from Twitter/X',
        category: 'social',
        coming_soon: false
      },
      {
        id: 'reddit',
        name: 'Reddit',
        icon: '🔴',
        description: 'Trending topics and searches from Reddit',
        category: 'community',
        coming_soon: false
      },
      {
        id: 'yandex',
        name: 'Yandex',
        icon: '🔶',
        description: 'Trending searches from Yandex (Russia)',
        category: 'search-engine',
        coming_soon: false
      },
      {
        id: 'baidu',
        name: 'Baidu',
        icon: '🔍',
        description: 'Trending searches from Baidu (China)',
        category: 'search-engine',
        coming_soon: false
      },
      {
        id: 'naver',
        name: 'Naver',
        icon: '🟢',
        description: 'Trending searches from Naver (Korea)',
        category: 'search-engine',
        coming_soon: false
      }
    ]
  })
})

export default router
