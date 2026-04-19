import { DetectedWeakness } from './weakness-detection';

export interface KeywordMetrics {
  keyword: string;
  searchVolume: number;
  keywordDifficulty: number; // 0-100, higher = harder to rank
  keywordScore: number; // 0-100, our proprietary score
  opportunityLevel: 'exceptional' | 'strong' | 'moderate' | 'challenging';
}

/**
 * KeywordScore Algorithm
 * Proprietary 0-100 score combining:
 * - Search volume (higher is better)
 * - Keyword difficulty (lower is better)
 * - SERP weaknesses (more weaknesses = better opportunity)
 * - Position gaps (lower positions in SERP = easier to target)
 */
export class KeywordScoreService {
  /**
   * Calculate KeywordScore (0-100)
   * 
   * Factors:
   * - Search Volume: More searches = more potential traffic
   * - Keyword Difficulty: Lower difficulty = easier to rank
   * - Weaknesses Score: More weaknesses = better opportunity
   * - Competition: Average domain authority of top 10 = competition level
   */
  static calculateKeywordScore(
    searchVolume: number,
    keywordDifficulty: number,
    weaknessScore: number, // Total weakness points detected
    avgDomainAuthorityInSerp: number // Average DA of top 10
  ): number {
    // Normalize inputs to 0-100 scale
    
    // Volume score: Log scale (100-10k volume = 50-100 score)
    const volumeScore = Math.min(100, Math.max(0, Math.log(searchVolume) / Math.log(10000) * 100));

    // Difficulty score: Inverse (lower difficulty = higher score)
    const difficultyScore = 100 - Math.min(100, keywordDifficulty);

    // Weakness score: Direct (more weaknesses = higher opportunity)
    // Normalize weakness score (0-20 = 0-100)
    const weaknessOpportunityScore = Math.min(100, (weaknessScore / 20) * 100);

    // Competition score: Inverse of avg domain authority
    // If avg DA is 50, score is 50. If DA is 20, score is 80
    const competitionScore = 100 - Math.min(100, avgDomainAuthorityInSerp);

    // Weighted average
    const weights = {
      volume: 0.25,      // 25% - search volume
      difficulty: 0.25,  // 25% - keyword difficulty
      weaknesses: 0.30,  // 30% - SERP weaknesses (most important)
      competition: 0.20  // 20% - competition level
    };

    const keywordScore = Math.round(
      (volumeScore * weights.volume) +
      (difficultyScore * weights.difficulty) +
      (weaknessOpportunityScore * weights.weaknesses) +
      (competitionScore * weights.competition)
    );

    return Math.max(0, Math.min(100, keywordScore));
  }

  /**
   * Determine opportunity level based on KeywordScore
   */
  static getOpportunityLevel(
    keywordScore: number
  ): 'exceptional' | 'strong' | 'moderate' | 'challenging' {
    if (keywordScore >= 80) {
      return 'exceptional';
    } else if (keywordScore >= 60) {
      return 'strong';
    } else if (keywordScore >= 40) {
      return 'moderate';
    } else {
      return 'challenging';
    }
  }

  /**
   * Generate detailed scoring breakdown
   */
  static getScoringBreakdown(
    searchVolume: number,
    keywordDifficulty: number,
    weaknessScore: number,
    avgDomainAuthorityInSerp: number
  ): {
    volumeScore: number;
    difficultyScore: number;
    weaknessOpportunityScore: number;
    competitionScore: number;
    weights: Record<string, number>;
    explanation: string;
  } {
    const volumeScore = Math.min(100, Math.max(0, Math.log(searchVolume) / Math.log(10000) * 100));
    const difficultyScore = 100 - Math.min(100, keywordDifficulty);
    const weaknessOpportunityScore = Math.min(100, (weaknessScore / 20) * 100);
    const competitionScore = 100 - Math.min(100, avgDomainAuthorityInSerp);

    const weights = {
      volume: 0.25,
      difficulty: 0.25,
      weaknesses: 0.30,
      competition: 0.20
    };

    let explanation = '';
    if (volumeScore > 80) explanation += `High search volume (${searchVolume} searches/month). `;
    if (difficultyScore > 80) explanation += `Low keyword difficulty (${100 - difficultyScore}/100). `;
    if (weaknessOpportunityScore > 70) explanation += `Top 10 results have significant weaknesses. `;
    if (competitionScore > 70) explanation += `Low average domain authority in top 10 (${avgDomainAuthorityInSerp}/100).`;

    return {
      volumeScore: Math.round(volumeScore),
      difficultyScore: Math.round(difficultyScore),
      weaknessOpportunityScore: Math.round(weaknessOpportunityScore),
      competitionScore: Math.round(competitionScore),
      weights,
      explanation
    };
  }

  /**
   * Estimate traffic potential based on position & CTR
   */
  static estimateTraffic(
    searchVolume: number,
    position: number
  ): number {
    // Approximate CTR by position (based on industry data)
    const ctrByPosition: Record<number, number> = {
      1: 0.28,
      2: 0.16,
      3: 0.12,
      4: 0.10,
      5: 0.08,
      6: 0.07,
      7: 0.06,
      8: 0.05,
      9: 0.04,
      10: 0.03
    };

    const ctr = ctrByPosition[position] || 0.02;
    return Math.round(searchVolume * ctr);
  }
}
