import { query } from '../database/connection';

export interface UserSettings {
  id: string;
  userId: string;
  showTrafficPotential: boolean;
  showPositionBreakdown: boolean;
  showCompetitiveGaps: boolean;
  showEntryDifficulty: boolean;
  showMarketSaturation: boolean;
  showSerpFeatures: boolean;
  showRoiPotential: boolean;
  showTrendAnalysis: boolean;
  showKeywordClusters: boolean;
  showOpportunityMatrix: boolean;
  showSearchVolumeTrend: boolean;
  showRankingProgress: boolean;
  showTrafficChart: boolean;
  showDifficultyTrend: boolean;
  showCompetitionIntensity: boolean;
  createdAt: string;
  updatedAt: string;
}

export class SettingsModel {
  /**
   * Transform database row to UserSettings with proper type casting
   */
  private static transformRow(row: any): UserSettings {
    console.log('=== transformRow START ===');
    console.log('Input row:', row);
    console.log('Row keys:', Object.keys(row));
    
    if (!row || typeof row !== 'object') {
      throw new Error(`Invalid row for transformation: ${JSON.stringify(row)}`);
    }
    
    // Build object step by step
    const result = {
      id: row.id,
      userId: row.user_id,
      showTrafficPotential: row.show_traffic_potential === true || row.show_traffic_potential === 1,
      showPositionBreakdown: row.show_position_breakdown === true || row.show_position_breakdown === 1,
      showCompetitiveGaps: row.show_competitive_gaps === true || row.show_competitive_gaps === 1,
      showEntryDifficulty: row.show_entry_difficulty === true || row.show_entry_difficulty === 1,
      showMarketSaturation: row.show_market_saturation === true || row.show_market_saturation === 1,
      showSerpFeatures: row.show_serp_features === true || row.show_serp_features === 1,
      showRoiPotential: row.show_roi_potential === true || row.show_roi_potential === 1,
      showTrendAnalysis: row.show_trend_analysis === true || row.show_trend_analysis === 1,
      showKeywordClusters: row.show_keyword_clusters === true || row.show_keyword_clusters === 1,
      showOpportunityMatrix: row.show_opportunity_matrix === true || row.show_opportunity_matrix === 1,
      showSearchVolumeTrend: row.show_search_volume_trend === true || row.show_search_volume_trend === 1,
      showRankingProgress: row.show_ranking_progress === true || row.show_ranking_progress === 1,
      showTrafficChart: row.show_traffic_chart === true || row.show_traffic_chart === 1,
      showDifficultyTrend: row.show_difficulty_trend === true || row.show_difficulty_trend === 1,
      showCompetitionIntensity: row.show_competition_intensity === true || row.show_competition_intensity === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
    
    console.log('Result object:', result);
    console.log('All properties:');
    Object.entries(result).forEach(([key, value]) => {
      console.log(`  ${key}: ${value} (${typeof value})`);
    });
    console.log('=== transformRow END ===');
    
    return result as UserSettings;
  }

  /**
   * Get user settings
   */
  static async findByUserId(userId: string): Promise<UserSettings | null> {
    console.log('findByUserId called for user:', userId);
    const result = await query(
      'SELECT * FROM user_settings WHERE user_id = $1',
      [userId]
    );
    
    console.log('Query result:', result);
    console.log('Number of rows:', result.rows.length);
    
    if (!result.rows[0]) {
      console.log('No settings found for user:', userId);
      return null;
    }
    
    console.log('Found row:', result.rows[0]);
    const transformed = this.transformRow(result.rows[0]);
    console.log('Transformed:', transformed);
    return transformed;
  }

  /**
   * Create default settings for new user
   */
  static async create(userId: string): Promise<UserSettings> {
    const result = await query(
      `INSERT INTO user_settings (user_id) VALUES ($1)
       RETURNING id, user_id, show_traffic_potential, show_position_breakdown,
                 show_competitive_gaps, show_entry_difficulty, show_market_saturation,
                 show_serp_features, show_roi_potential, show_trend_analysis,
                 show_keyword_clusters, show_opportunity_matrix, show_search_volume_trend,
                 show_ranking_progress, show_traffic_chart, show_difficulty_trend,
                 show_competition_intensity, created_at, updated_at`,
      [userId]
    );

    return this.transformRow(result.rows[0]);
  }

  /**
   * Update user settings
   */
  static async update(userId: string, settings: Partial<UserSettings>): Promise<UserSettings> {
    const updates = [];
    const values: (string | boolean)[] = [userId];
    let paramCount = 2;

    // Debug log
    console.log('Updating settings for user:', userId);
    console.log('Received settings object:', settings);
    console.log('Settings keys:', Object.keys(settings));
    
    // List of all possible settings
    const settingsKeys: (keyof UserSettings)[] = [
      'showTrafficPotential',
      'showPositionBreakdown',
      'showCompetitiveGaps',
      'showEntryDifficulty',
      'showMarketSaturation',
      'showSerpFeatures',
      'showRoiPotential',
      'showTrendAnalysis',
      'showKeywordClusters',
      'showOpportunityMatrix',
      'showSearchVolumeTrend',
      'showRankingProgress',
      'showTrafficChart',
      'showDifficultyTrend',
      'showCompetitionIntensity',
    ];

    for (const key of settingsKeys) {
      if (key in settings && settings[key] !== undefined) {
        const dbKey = key
          .replace(/([A-Z])/g, '_$1')
          .toLowerCase()
          .replace(/^_/, '');
        
        console.log(`Processing ${key} -> ${dbKey}: ${settings[key]} (${typeof settings[key]})`);
        
        updates.push(`${dbKey} = $${paramCount}`);
        values.push(Boolean(settings[key]));
        paramCount++;
      }
    }

    updates.push(`updated_at = NOW()`);
    
    console.log('SQL Updates:', updates);
    console.log('SQL Values:', values);

    const result = await query(
      `UPDATE user_settings 
       SET ${updates.join(', ')}
       WHERE user_id = $1
       RETURNING id, user_id, show_traffic_potential, show_position_breakdown,
                 show_competitive_gaps, show_entry_difficulty, show_market_saturation,
                 show_serp_features, show_roi_potential, show_trend_analysis,
                 show_keyword_clusters, show_opportunity_matrix, show_search_volume_trend,
                 show_ranking_progress, show_traffic_chart, show_difficulty_trend,
                 show_competition_intensity, created_at, updated_at`,
      values
    );

    if (!result.rows[0]) {
      throw new Error('Failed to update settings');
    }

    return this.transformRow(result.rows[0]);
  }
}
