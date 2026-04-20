import apiClient from './api'

export interface SearchHistoryItem {
  id: string
  userId: string
  keyword: string
  searchCount: number
  lastSearched: string
  createdAt: string
}

export class SearchHistoryService {
  static async getRecentSearches(limit: number = 10): Promise<SearchHistoryItem[]> {
    const response = await apiClient.get<SearchHistoryItem[]>('/search-history', {
      params: { limit },
    })
    return response.data
  }

  static async addSearch(keyword: string): Promise<SearchHistoryItem> {
    const response = await apiClient.post<SearchHistoryItem>('/search-history', {
      keyword,
    })
    return response.data
  }

  static async deleteSearch(searchId: string): Promise<void> {
    await apiClient.delete(`/search-history/${searchId}`)
  }

  static async clearHistory(): Promise<void> {
    await apiClient.delete('/search-history')
  }
}
