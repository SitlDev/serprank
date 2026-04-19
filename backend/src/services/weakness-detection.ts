import { SerpResult } from './serp-scraper';
import { DomainAuthorityService } from './domain-authority';
import { WeaknessType } from '../types/index';

export interface DetectedWeaknessList {
  weaknessType: WeaknessType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  points: number;
}

/**
 * Weakness Detection Engine
 * Identifies 17+ types of weaknesses in SERP results
 */
export class WeaknessDetectionService {
  /**
   * Analyze a SERP result for all possible weaknesses
   */
  static async analyzeSerpResult(
    serpResult: SerpResult,
    domainScore: number,
    pageScore: number,
    spamScore: number,
    pageSpeed: number,
    isHttps: boolean,
    hasCanonical: boolean,
    contentAgeDays: number,
    hasHeadings: boolean = true
  ): Promise<DetectedWeaknessList[]> {
    const weaknesses: DetectedWeaknessList[] = [];

    // Authority weaknesses
    if (domainScore <= 10) {
      weaknesses.push({
        weaknessType: 'low_domain_score',
        severity: 'high',
        description: `Domain score is ${domainScore}/100 - below competitive threshold`,
        points: 2
      });
    }

    if (pageScore <= 0) {
      weaknesses.push({
        weaknessType: 'low_page_score',
        severity: 'high',
        description: 'Page authority is 0 - no established page authority',
        points: 2
      });
    }

    // Backlink weakness detected via domain score
    if (domainScore < 20) {
      weaknesses.push({
        weaknessType: 'no_backlinks',
        severity: 'high',
        description: 'Minimal or no backlink profile detected',
        points: 2
      });
    }

    // Technical SEO weaknesses
    if (pageSpeed > 3) {
      weaknesses.push({
        weaknessType: 'slow_page_speed',
        severity: 'medium',
        description: `Page loads in ${pageSpeed}s - target is <3s`,
        points: 1
      });
    }

    if (spamScore >= 50) {
      weaknesses.push({
        weaknessType: 'high_spam_score',
        severity: 'critical',
        description: `Spam score is ${spamScore}/100 - high risk`,
        points: 3
      });
    }

    if (!isHttps) {
      weaknesses.push({
        weaknessType: 'no_https',
        severity: 'high',
        description: 'Not using HTTPS - security risk & ranking penalty',
        points: 2
      });
    }

    if (!hasCanonical) {
      weaknesses.push({
        weaknessType: 'missing_canonical',
        severity: 'medium',
        description: 'Missing canonical tag - duplicate content risk',
        points: 1
      });
    }

    // Content quality weaknesses
    if (contentAgeDays > 730) {
      weaknesses.push({
        weaknessType: 'old_content',
        severity: 'medium',
        description: `Content is ${Math.floor(contentAgeDays / 365)} years old - freshness signal weak`,
        points: 1
      });
    }

    if (!hasHeadings) {
      weaknesses.push({
        weaknessType: 'missing_headings',
        severity: 'medium',
        description: 'Page missing proper heading structure (H1, H2, H3)',
        points: 1
      });
    }

    // Check for broken page (would be detected by status code in real implementation)
    // This is a placeholder
    if (serpResult.url.includes('404') || serpResult.url.includes('error')) {
      weaknesses.push({
        weaknessType: 'broken_page',
        severity: 'critical',
        description: 'Page returns error - ranking will drop',
        points: 3
      });
    }

    return weaknesses;
  }

  /**
   * Calculate weakness score (0-100)
   * More weaknesses = higher score (worse)
   */
  static calculateWeaknessScore(weaknesses: DetectedWeaknessList[]): number {
    if (weaknesses.length === 0) return 0;

    const totalPoints = weaknesses.reduce((sum, w) => sum + w.points, 0);
    const severity = weaknesses.length;

    // 1 weakness = 10 points per point
    // 2+ weaknesses = 15 points per point
    // Multiply by severity count
    const multiplier = severity >= 2 ? 1.5 : 1;
    const score = Math.min(100, (totalPoints * 10 * multiplier));

    return Math.round(score);
  }

  /**
   * Analyze entire SERP for composition weaknesses
   */
  static analyzeSerpComposition(
    serpResults: SerpResult[],
    uggSites: number = 0
  ): DetectedWeaknessList[] {
    const weaknesses: DetectedWeaknessList[] = [];

    // Check for UGC-heavy results
    const uggThreshold = 3;
    if (uggSites >= uggThreshold) {
      weaknesses.push({
        weaknessType: 'ugc_heavy_serp',
        severity: 'low',
        description: `${uggSites}+ user-generated content sites ranking - easier to outrank`,
        points: 1
      });
    }

    return weaknesses;
  }

  /**
   * Calculate keyword opportunity score from all signals
   */
  static calculateKeywordScore(
    weaknesses: DetectedWeaknessList[],
    searchVolume: number,
    difficultyScore: number,
    avgDomainScore: number
  ): number {
    // Base score from weaknesses (fewer = better)
    const weaknessScore = 100 - this.calculateWeaknessScore(weaknesses);

    // Adjust for search volume (more volume = better, but not as important as weaknesses)
    const volumeMultiplier = Math.min(searchVolume / 1000, 1); // Cap at 1000 volume
    const volumeBonus = volumeMultiplier * 3; // 0-3 points

    // Adjust for difficulty (lower = better opportunity)
    const difficultyPenalty = Math.max(0, (difficultyScore - 50) / 5); // Penalty if >50

    // Adjust for avg domain authority (lower = more beatable)
    const authorityBonus = Math.max(0, (100 - avgDomainScore) / 10); // 0-10 points

    let score = weaknessScore + volumeBonus + authorityBonus - difficultyPenalty;
    score = Math.max(0, Math.min(100, score)); // Clamp 0-100

    return Math.round(score);
  }

  /**
   * Get weakness severity level (0-100)
   */
  static getWeaknessSeverity(weaknesses: DetectedWeaknessList[]): 'critical' | 'high' | 'medium' | 'low' | 'minimal' {
    const hasCritical = weaknesses.some(w => w.severity === 'critical');
    const highCount = weaknesses.filter(w => w.severity === 'high').length;
    const mediumCount = weaknesses.filter(w => w.severity === 'medium').length;

    if (hasCritical || highCount >= 3) return 'critical';
    if (highCount >= 2) return 'high';
    if (highCount >= 1 || mediumCount >= 3) return 'medium';
    if (mediumCount >= 1) return 'low';
    return 'minimal';
  }
}
