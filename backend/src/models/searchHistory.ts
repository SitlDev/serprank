import { query } from '../database/connection';

export interface SearchHistoryItem {
  id: string;
  userId: string;
  keyword: string;
  searchCount: number;
  lastSearched: string;
  createdAt: string;
}

export class SearchHistoryModel {
  /**
   * Add or update a search in history
   */
  static async addSearch(userId: string, keyword: string): Promise<SearchHistoryItem> {
    const result = await query(
      `INSERT INTO search_history (user_id, keyword, search_count, last_searched)
       VALUES ($1, $2, 1, NOW())
       ON CONFLICT (user_id, keyword)
       DO UPDATE SET search_count = search_count + 1, last_searched = NOW()
       RETURNING id, user_id, keyword, search_count, last_searched, created_at`,
      [userId, keyword]
    );

    if (!result.rows[0]) {
      throw new Error('Failed to add search to history');
    }

    return this.transformRow(result.rows[0]);
  }

  /**
   * Get recent searches for a user
   */
  static async getRecentSearches(userId: string, limit: number = 10): Promise<SearchHistoryItem[]> {
    const result = await query(
      `SELECT id, user_id, keyword, search_count, last_searched, created_at
       FROM search_history
       WHERE user_id = $1
       ORDER BY last_searched DESC
       LIMIT $2`,
      [userId, limit]
    );

    return result.rows.map((row) => this.transformRow(row));
  }

  /**
   * Delete a search from history
   */
  static async deleteSearch(userId: string, searchId: string): Promise<void> {
    await query(
      `DELETE FROM search_history WHERE id = $1 AND user_id = $2`,
      [searchId, userId]
    );
  }

  /**
   * Clear all search history for a user
   */
  static async clearHistory(userId: string): Promise<void> {
    await query(
      `DELETE FROM search_history WHERE user_id = $1`,
      [userId]
    );
  }

  /**
   * Transform database row to SearchHistoryItem
   */
  private static transformRow(row: any): SearchHistoryItem {
    return {
      id: row.id,
      userId: row.user_id,
      keyword: row.keyword,
      searchCount: row.search_count,
      lastSearched: row.last_searched,
      createdAt: row.created_at,
    };
  }
}
