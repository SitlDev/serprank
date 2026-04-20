import { query } from '../database/connection';

export interface KeywordHistoryRecord {
  id: string;
  keywordId: string;
  userId: string;
  searchVolume: number;
  difficultyScore: number;
  keywordScore: number;
  opportunityScore: number;
  recordedAt: string;
}

export interface RankingHistoryRecord {
  id: string;
  keywordId: string;
  userId: string;
  position: number;
  estimatedTraffic: number;
  domainUrl: string;
  recordedAt: string;
}

export interface TrafficHistoryRecord {
  id: string;
  keywordId: string;
  userId: string;
  estimatedMonthlyVisitors: number;
  position: number;
  recordedAt: string;
}

export interface CompetitionHistoryRecord {
  id: string;
  keywordId: string;
  userId: string;
  avgDomainAuthority: number;
  avgBacklinks: number;
  avgPageSpeed: number;
  top10Count: number;
  recordedAt: string;
}

export class HistoryModel {
  /**
   * Record keyword metrics for a point in time
   */
  static async recordKeywordMetrics(
    keywordId: string,
    userId: string,
    metrics: {
      searchVolume: number;
      difficultyScore: number;
      keywordScore: number;
      opportunityScore: number;
    }
  ): Promise<KeywordHistoryRecord> {
    const result = await query(
      `INSERT INTO keyword_history (keyword_id, user_id, search_volume, difficulty_score, keyword_score, opportunity_score)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, keyword_id as "keywordId", user_id as "userId", search_volume as "searchVolume",
                 difficulty_score as "difficultyScore", keyword_score as "keywordScore",
                 opportunity_score as "opportunityScore", recorded_at as "recordedAt"`,
      [keywordId, userId, metrics.searchVolume, metrics.difficultyScore, metrics.keywordScore, metrics.opportunityScore]
    );
    return result.rows[0];
  }

  /**
   * Record ranking position history
   */
  static async recordRankingMetrics(
    keywordId: string,
    userId: string,
    metrics: {
      position: number;
      estimatedTraffic: number;
      domainUrl: string;
    }
  ): Promise<RankingHistoryRecord> {
    const result = await query(
      `INSERT INTO ranking_history (keyword_id, user_id, position, estimated_traffic, domain_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, keyword_id as "keywordId", user_id as "userId", position,
                 estimated_traffic as "estimatedTraffic", domain_url as "domainUrl",
                 recorded_at as "recordedAt"`,
      [keywordId, userId, metrics.position, metrics.estimatedTraffic, metrics.domainUrl]
    );
    return result.rows[0];
  }

  /**
   * Record traffic estimates
   */
  static async recordTrafficMetrics(
    keywordId: string,
    userId: string,
    metrics: {
      estimatedMonthlyVisitors: number;
      position: number;
    }
  ): Promise<TrafficHistoryRecord> {
    const result = await query(
      `INSERT INTO traffic_history (keyword_id, user_id, estimated_monthly_visitors, position)
       VALUES ($1, $2, $3, $4)
       RETURNING id, keyword_id as "keywordId", user_id as "userId",
                 estimated_monthly_visitors as "estimatedMonthlyVisitors", position,
                 recorded_at as "recordedAt"`,
      [keywordId, userId, metrics.estimatedMonthlyVisitors, metrics.position]
    );
    return result.rows[0];
  }

  /**
   * Record competition metrics
   */
  static async recordCompetitionMetrics(
    keywordId: string,
    userId: string,
    metrics: {
      avgDomainAuthority: number;
      avgBacklinks: number;
      avgPageSpeed: number;
      top10Count: number;
    }
  ): Promise<CompetitionHistoryRecord> {
    const result = await query(
      `INSERT INTO competition_history (keyword_id, user_id, avg_domain_authority, avg_backlinks, avg_page_speed, top_10_count)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, keyword_id as "keywordId", user_id as "userId",
                 avg_domain_authority as "avgDomainAuthority", avg_backlinks as "avgBacklinks",
                 avg_page_speed as "avgPageSpeed", top_10_count as "top10Count",
                 recorded_at as "recordedAt"`,
      [keywordId, userId, metrics.avgDomainAuthority, metrics.avgBacklinks, metrics.avgPageSpeed, metrics.top10Count]
    );
    return result.rows[0];
  }

  /**
   * Get keyword history for a date range
   */
  static async getKeywordHistory(
    keywordId: string,
    userId: string,
    daysBack: number = 30
  ): Promise<KeywordHistoryRecord[]> {
    const result = await query(
      `SELECT id, keyword_id as "keywordId", user_id as "userId", search_volume as "searchVolume",
              difficulty_score as "difficultyScore", keyword_score as "keywordScore",
              opportunity_score as "opportunityScore", recorded_at as "recordedAt"
       FROM keyword_history
       WHERE keyword_id = $1 AND user_id = $2 AND recorded_at >= NOW() - INTERVAL '1 day' * $3
       ORDER BY recorded_at ASC`,
      [keywordId, userId, daysBack]
    );
    return result.rows;
  }

  /**
   * Get ranking history for a date range
   */
  static async getRankingHistory(
    keywordId: string,
    userId: string,
    daysBack: number = 30
  ): Promise<RankingHistoryRecord[]> {
    const result = await query(
      `SELECT id, keyword_id as "keywordId", user_id as "userId", position,
              estimated_traffic as "estimatedTraffic", domain_url as "domainUrl",
              recorded_at as "recordedAt"
       FROM ranking_history
       WHERE keyword_id = $1 AND user_id = $2 AND recorded_at >= NOW() - INTERVAL '1 day' * $3
       ORDER BY recorded_at ASC`,
      [keywordId, userId, daysBack]
    );
    return result.rows;
  }

  /**
   * Get traffic history for a date range
   */
  static async getTrafficHistory(
    keywordId: string,
    userId: string,
    daysBack: number = 30
  ): Promise<TrafficHistoryRecord[]> {
    const result = await query(
      `SELECT id, keyword_id as "keywordId", user_id as "userId",
              estimated_monthly_visitors as "estimatedMonthlyVisitors", position,
              recorded_at as "recordedAt"
       FROM traffic_history
       WHERE keyword_id = $1 AND user_id = $2 AND recorded_at >= NOW() - INTERVAL '1 day' * $3
       ORDER BY recorded_at ASC`,
      [keywordId, userId, daysBack]
    );
    return result.rows;
  }

  /**
   * Get competition history for a date range
   */
  static async getCompetitionHistory(
    keywordId: string,
    userId: string,
    daysBack: number = 30
  ): Promise<CompetitionHistoryRecord[]> {
    const result = await query(
      `SELECT id, keyword_id as "keywordId", user_id as "userId",
              avg_domain_authority as "avgDomainAuthority", avg_backlinks as "avgBacklinks",
              avg_page_speed as "avgPageSpeed", top_10_count as "top10Count",
              recorded_at as "recordedAt"
       FROM competition_history
       WHERE keyword_id = $1 AND user_id = $2 AND recorded_at >= NOW() - INTERVAL '1 day' * $3
       ORDER BY recorded_at ASC`,
      [keywordId, userId, daysBack]
    );
    return result.rows;
  }
}
