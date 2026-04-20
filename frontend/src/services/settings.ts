import apiClient from './api'

export interface UserSettings {
  id: string
  userId: string
  showTrafficPotential: boolean
  showPositionBreakdown: boolean
  showCompetitiveGaps: boolean
  showEntryDifficulty: boolean
  showMarketSaturation: boolean
  showSerpFeatures: boolean
  showRoiPotential: boolean
  showTrendAnalysis: boolean
  showKeywordClusters: boolean
  showOpportunityMatrix: boolean
  showSearchVolumeTrend: boolean
  showRankingProgress: boolean
  showTrafficChart: boolean
  showDifficultyTrend: boolean
  showCompetitionIntensity: boolean
  createdAt: string
  updatedAt: string
}

export class SettingsService {
  static async getSettings(): Promise<UserSettings> {
    const response = await apiClient.get<UserSettings>('/settings')
    return response.data
  }

  static async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const response = await apiClient.put<UserSettings>('/settings', settings)
    return response.data
  }
}
