import apiClient from './api'

export interface KeywordAnalysis {
  keyword: string
  keywordScore: number
  avgDomainScore: number
  totalWeaknesses: number
  results: SerpResult[]
  recommendation: string
}

export interface SerpResult {
  position: number
  domain: string
  url: string
  domainScore: number
  pageScore: number
  weaknesses: Weakness[]
  weaknessCount: number
}

export interface Weakness {
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
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
