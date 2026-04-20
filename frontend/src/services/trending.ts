import api from './api'

export interface TrendingKeyword {
  keyword: string
  searches: number
  trending: 'up' | 'stable' | 'down'
  volume: number
  difficulty: number
  trend_percentage: number
  source?: string
}

export interface TrendingCategory {
  category: string
  keywords: TrendingKeyword[]
}

export interface TrendingSource {
  id: string
  name: string
  icon: string
  description: string
  category: string
  comingSoon?: boolean
}

export type TrendingSourceType = 'google' | 'bing' | 'pinterest' | 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'reddit' | 'yandex' | 'baidu' | 'naver'

export class TrendingService {
  /**
   * Get available trending sources
   */
  static async getTrendingSources(): Promise<TrendingSource[]> {
    const response = await api.get('/trending/sources')
    return (response.data as any).data
  }

  /**
   * Get trending keywords from specified source
   */
  static async getTrendingKeywords(
    source: TrendingSourceType = 'google',
    limit: number = 20,
    period: 'day' | 'week' | 'month' = 'week'
  ): Promise<TrendingKeyword[]> {
    const response = await api.get('/trending', {
      params: { source, limit, period }
    })
    return (response.data as any).data
  }

  /**
   * Get trending keywords grouped by category
   */
  static async getTrendingByCategory(
    source: TrendingSourceType = 'google',
    limit: number = 10,
    period: 'day' | 'week' | 'month' = 'week'
  ): Promise<TrendingCategory[]> {
    const response = await api.get('/trending/categories', {
      params: { source, limit, period }
    })
    return (response.data as any).data
  }

  /**
   * Get trending keywords with growth metrics
   */
  static async getTrendingWithGrowth(
    source: TrendingSourceType = 'google',
    limit: number = 20,
    period: 'week' | 'month' = 'week'
  ): Promise<TrendingKeyword[]> {
    const response = await api.get('/trending/with-growth', {
      params: { source, limit, period }
    })
    return (response.data as any).data
  }

  /**
   * Get keywords that are spiking
   */
  static async getSpikingKeywords(
    source: TrendingSourceType = 'google',
    limit: number = 10
  ): Promise<TrendingKeyword[]> {
    const response = await api.get('/trending/spiking', {
      params: { source, limit }
    })
    return (response.data as any).data
  }
}
