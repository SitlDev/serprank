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

  /**
   * Generate traffic potential breakdown for positions 1-10
   */
  static getTrafficBreakdown(searchVolume: number): Array<{
    position: number;
    ctr: number;
    estimatedMonthlyVisitors: number;
  }> {
    const breakdown = [];
    for (let pos = 1; pos <= 10; pos++) {
      const ctrByPosition: Record<number, number> = {
        1: 0.28, 2: 0.16, 3: 0.12, 4: 0.10, 5: 0.08,
        6: 0.07, 7: 0.06, 8: 0.05, 9: 0.04, 10: 0.03
      };
      const ctr = ctrByPosition[pos] || 0.02;
      breakdown.push({
        position: pos,
        ctr: Math.round(ctr * 100),
        estimatedMonthlyVisitors: Math.round(searchVolume * ctr)
      });
    }
    return breakdown;
  }

  /**
   * Calculate competitive gaps based on domain metrics
   */
  static getCompetitiveGaps(
    topDomainScores: number[],
    topBacklinks: number[],
    topPageSpeeds: number[]
  ): {
    domainAuthorityGap: number;
    backlinkGap: number;
    pageSpeedGap: number;
    summary: string;
  } {
    const avgDomainScore = topDomainScores.reduce((a, b) => a + b, 0) / topDomainScores.length;
    const avgBacklinks = topBacklinks.reduce((a, b) => a + b, 0) / topBacklinks.length;
    const avgPageSpeed = topPageSpeeds.reduce((a, b) => a + b, 0) / topPageSpeeds.length;

    // Assume user domain (mock for now)
    const userDomainScore = 15;
    const userBacklinks = 50;
    const userPageSpeed = 1.5;

    return {
      domainAuthorityGap: Math.round(avgDomainScore - userDomainScore),
      backlinkGap: Math.round(avgBacklinks - userBacklinks),
      pageSpeedGap: Math.round((avgPageSpeed - userPageSpeed) * 10) / 10,
      summary: `You need ~${Math.round(avgDomainScore - userDomainScore)} more DA, ${Math.round(avgBacklinks - userBacklinks)} more backlinks, and ${Math.round((avgPageSpeed - userPageSpeed) * 10) / 10}s faster page speed to match top competitors.`
    };
  }

  /**
   * Calculate entry difficulty (how long to rank)
   */
  static getEntryDifficulty(
    keywordDifficulty: number,
    avgCompetitorDA: number
  ): {
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
    estimatedMonthsToRank: {
      position10: number;
      position5: number;
      position1: number;
    };
    recommendation: string;
  } {
    const daDifference = Math.max(0, avgCompetitorDA - 15); // Assume user DA is 15

    let difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
    let monthMultiplier: number;

    if (daDifference < 10) {
      difficulty = 'Easy';
      monthMultiplier = 0.5;
    } else if (daDifference < 20) {
      difficulty = 'Medium';
      monthMultiplier = 1;
    } else if (daDifference < 30) {
      difficulty = 'Hard';
      monthMultiplier = 1.5;
    } else {
      difficulty = 'Very Hard';
      monthMultiplier = 2;
    }

    return {
      difficulty,
      estimatedMonthsToRank: {
        position10: Math.round(3 * monthMultiplier),
        position5: Math.round(6 * monthMultiplier),
        position1: Math.round(12 * monthMultiplier)
      },
      recommendation: difficulty === 'Easy' || difficulty === 'Medium' 
        ? 'This keyword is achievable for your domain. Consider targeting it.' 
        : 'This keyword is challenging. Consider starting with related long-tail keywords.'
    };
  }

  /**
   * Analyze market saturation (SERP features impact)
   */
  static getMarketSaturation(
    hasAds: number,
    hasFeaturedSnippet: boolean,
    hasKnowledgePanel: boolean,
    hasLocalPack: boolean,
    hasPAA: boolean
  ): {
    saturatedFeatures: string[];
    ctrReduction: number;
    adjustedTraffic: (baseTraffic: number) => number;
    difficulty: string;
  } {
    const saturatedFeatures = [];
    let ctrReduction = 0;

    if (hasAds > 0) {
      saturatedFeatures.push(`${hasAds} ads above organic results (-${15 * hasAds}% CTR)`);
      ctrReduction += 15 * hasAds;
    }
    if (hasFeaturedSnippet) {
      saturatedFeatures.push('Featured snippet present (-5% CTR)');
      ctrReduction += 5;
    }
    if (hasKnowledgePanel) {
      saturatedFeatures.push('Knowledge panel present (-3% CTR)');
      ctrReduction += 3;
    }
    if (hasLocalPack) {
      saturatedFeatures.push('Local pack present (-8% CTR)');
      ctrReduction += 8;
    }
    if (hasPAA) {
      saturatedFeatures.push('People Also Ask present (-3% CTR)');
      ctrReduction += 3;
    }

    return {
      saturatedFeatures,
      ctrReduction,
      adjustedTraffic: (baseTraffic: number) => Math.round(baseTraffic * (1 - ctrReduction / 100)),
      difficulty: ctrReduction > 30 ? 'Very High' : ctrReduction > 15 ? 'High' : 'Moderate'
    };
  }

  /**
   * Generate opportunity matrix data
   */
  static getOpportunityMatrix(): {
    goldZone: string;
    strongZone: string;
    nicheZone: string;
    avoidZone: string;
    description: string;
  } {
    return {
      goldZone: 'High volume + Low difficulty = Rank fast, get lots of traffic',
      strongZone: 'High volume + High difficulty = Tough competition but high rewards',
      nicheZone: 'Low volume + Low difficulty = Easy to rank but limited traffic',
      avoidZone: 'Low volume + High difficulty = Not worth the effort',
      description: 'Sweet spot: Search volume > 1000 + Difficulty < 40'
    };
  }

  /**
   * Calculate ROI potential
   */
  static getRoiPotential(searchVolume: number, position: number = 1): {
    estimatedMonthlyVisitors: number;
    assumedConversionRate: number;
    estimatedMonthlyLeads: number;
    assumedLeadValue: number;
    estimatedMonthlyRevenue: number;
  } {
    const ctrByPosition: Record<number, number> = {
      1: 0.28, 2: 0.16, 3: 0.12, 4: 0.10, 5: 0.08,
      6: 0.07, 7: 0.06, 8: 0.05, 9: 0.04, 10: 0.03
    };
    
    const ctr = ctrByPosition[position] || 0.02;
    const estimatedMonthlyVisitors = Math.round(searchVolume * ctr);
    const assumedConversionRate = 0.02; // 2% conversion
    const estimatedMonthlyLeads = Math.round(estimatedMonthlyVisitors * assumedConversionRate);
    const assumedLeadValue = 500; // $500 per lead (customize by industry)
    const estimatedMonthlyRevenue = estimatedMonthlyLeads * assumedLeadValue;

    return {
      estimatedMonthlyVisitors,
      assumedConversionRate,
      estimatedMonthlyLeads,
      assumedLeadValue,
      estimatedMonthlyRevenue
    };
  }

  /**
   * Trend analysis (mock - would use historical data in production)
   */
  static getTrendAnalysis(keyword: string): {
    trend: 'growing' | 'stable' | 'declining';
    percentageChange: number;
    quarterChange: number;
    recommendation: string;
  } {
    // Mock trend data - in production this would use real historical search volume
    const mockTrends: Record<string, number> = {
      'best': 2, // Growing 2% per quarter
      'ai': 5,   // AI topics growing fast
      'crypto': -3, // Declining
    };

    let percentageChange = 0;
    for (const [key, change] of Object.entries(mockTrends)) {
      if (keyword.toLowerCase().includes(key)) {
        percentageChange = change;
        break;
      }
    }

    const trend: 'growing' | 'stable' | 'declining' = 
      percentageChange > 1 ? 'growing' : percentageChange < -1 ? 'declining' : 'stable';

    return {
      trend,
      percentageChange,
      quarterChange: Math.round(percentageChange * 100) / 100,
      recommendation: trend === 'growing' 
        ? 'High momentum keyword - act quickly' 
        : trend === 'declining'
        ? 'Declining trend - focus on growing keywords instead'
        : 'Stable keyword - good for long-term content'
    };
  }
}
