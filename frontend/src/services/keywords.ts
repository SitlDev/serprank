import apiClient from './api'

export interface KeywordAnalysis {
  keyword: string
  analysis: {
    keywordScore: number
    opportunityLevel: 'exceptional' | 'strong' | 'moderate' | 'challenging'
    estimatedTraffic: number
    avgDomainScore: number
    avgWeaknessScore: number
  }
  scoringBreakdown: {
    volumeScore: number
    difficultyScore: number
    weaknessOpportunityScore: number
    competitionScore: number
    weights: Record<string, number>
    explanation: string
  }
  serpResults: SerpResult[]
  timestamp: string
}

export interface SerpResult {
  position: number
  url: string
  title: string
  domain: string
  metrics: {
    domainScore: number
    pageScore: number
    spamScore: number
    pageSpeed: number
    isHttps: boolean
    hasCanonical: boolean
    contentAgeDays: number
    isMobileFriendly: boolean
    backlinksCount: number
    referringDomains: number
  }
  weaknesses: Weakness[]
  weaknessScore: number
}

export interface Weakness {
  id: string
  weaknessType: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  points: number
}

export interface Keyword {
  id: string
  keyword: string
  searchVolume: number
  difficultyScore: number
  keywordScore: number
  estimatedTraffic: number
  createdAt: string
  updatedAt: string
}

export class KeywordService {
  static async searchKeywords(query: string, limit: number = 20): Promise<Keyword[]> {
    const response = await apiClient.get<Keyword[]>('/keywords/search', {
      params: { q: query, limit },
    })
    return response.data
  }

  static async getKeyword(id: string): Promise<Keyword> {
    const response = await apiClient.get<Keyword>(`/keywords/${id}`)
    return response.data
  }

  static async analyzeKeyword(keyword: string): Promise<KeywordAnalysis> {
    const response = await apiClient.post<KeywordAnalysis>('/serp/analyze', {
      keyword,
    })
    return response.data
  }

  static async getSerpAnalysis(keywordId: string): Promise<KeywordAnalysis> {
    const response = await apiClient.get<KeywordAnalysis>(`/serp/analysis/${keywordId}`)
    return response.data
  }
}
