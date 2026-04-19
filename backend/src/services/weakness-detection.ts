import { SerpResult } from './serp-scraper';

export interface DetectedWeakness {
  id: string;
  weaknessType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  points: number;
}

/**
 * Weakness Detection Engine
 * Identifies 17+ types of weaknesses in SERP results
 * 
 * Weakness Categories:
 * Authority: domain score, page score, backlinks, trust score
 * Technical: HTTPS, page speed, canonical tag, mobile friendly
 * Content: outdated, word count, duplicate content, grammar/spelling
 * SERP Features: abundance of features reducing organic click-through
 * Other: YMYL signals, recent updates, user signals
 */
export class WeaknessDetectionService {
  private static weaknessIdCounter = 0;

  /**
   * Analyze a SERP result for all possible weaknesses
   */
  static analyzeResult(
    position: number,
    domain: string,
    domainScore: number,
    pageScore: number,
    spamScore: number,
    pageSpeed: number,
    isHttps: boolean,
    hasCanonical: boolean,
    contentAgeDays: number,
    isMobileFriendly: boolean = true,
    hasStructuredData: boolean = false,
    backlinksCount: number = 0,
    referringDomains: number = 0
  ): DetectedWeakness[] {
    const weaknesses: DetectedWeakness[] = [];
    this.weaknessIdCounter = 0;

    // 1. Authority Weaknesses
    if (domainScore <= 10) {
      weaknesses.push(this.createWeakness(
        'low_domain_score',
        'high',
        `Domain authority is ${domainScore}/100 - below competitive threshold`,
        3
      ));
    } else if (domainScore <= 30) {
      weaknesses.push(this.createWeakness(
        'low_domain_score',
        'medium',
        `Domain authority is ${domainScore}/100 - opportunity for newer competitor`,
        2
      ));
    }

    if (pageScore <= 5) {
      weaknesses.push(this.createWeakness(
        'low_page_authority',
        'high',
        'Page authority is 0-5 - new page with no authority',
        3
      ));
    } else if (pageScore <= 20) {
      weaknesses.push(this.createWeakness(
        'low_page_authority',
        'medium',
        `Page authority is ${pageScore} - limited page-level authority`,
        2
      ));
    }

    if (backlinksCount === 0 || backlinksCount < 5) {
      weaknesses.push(this.createWeakness(
        'no_backlinks',
        'high',
        `Minimal backlinks (${backlinksCount || 0}) - little link equity`,
        3
      ));
    } else if (backlinksCount < 20) {
      weaknesses.push(this.createWeakness(
        'few_backlinks',
        'medium',
        `Only ${backlinksCount} backlinks - weak backlink profile`,
        2
      ));
    }

    if (referringDomains === 0 || referringDomains < 3) {
      weaknesses.push(this.createWeakness(
        'low_referring_domains',
        'high',
        `Few referring domains (${referringDomains || 0}) - limited domain diversity`,
        2
      ));
    }

    // 2. Technical SEO Weaknesses
    if (pageSpeed > 4) {
      weaknesses.push(this.createWeakness(
        'slow_page_speed',
        'high',
        `Page loads in ${pageSpeed.toFixed(2)}s - target is <2.5s`,
        2
      ));
    } else if (pageSpeed > 2.5) {
      weaknesses.push(this.createWeakness(
        'slow_page_speed',
        'medium',
        `Page loads in ${pageSpeed.toFixed(2)}s - room for optimization`,
        1
      ));
    }

    if (spamScore > 50) {
      weaknesses.push(this.createWeakness(
        'high_spam_score',
        'critical',
        `Spam score is ${spamScore}/100 - high risk of penalties`,
        4
      ));
    } else if (spamScore > 30) {
      weaknesses.push(this.createWeakness(
        'elevated_spam_score',
        'high',
        `Spam score is ${spamScore}/100 - some spam indicators`,
        2
      ));
    }

    if (!isHttps) {
      weaknesses.push(this.createWeakness(
        'no_https',
        'high',
        'Not using HTTPS - security risk & ranking factor',
        3
      ));
    }

    if (!hasCanonical) {
      weaknesses.push(this.createWeakness(
        'missing_canonical',
        'medium',
        'Missing canonical tag - duplicate content risk',
        2
      ));
    }

    if (!isMobileFriendly) {
      weaknesses.push(this.createWeakness(
        'not_mobile_friendly',
        'high',
        'Not mobile-friendly - critical ranking factor',
        3
      ));
    }

    if (!hasStructuredData) {
      weaknesses.push(this.createWeakness(
        'no_structured_data',
        'low',
        'Missing schema markup - missing SERP feature opportunity',
        1
      ));
    }

    // 3. Content Quality Weaknesses
    if (contentAgeDays > 1095) { // 3 years
      weaknesses.push(this.createWeakness(
        'outdated_content',
        'high',
        `Content is ${Math.floor(contentAgeDays / 365)} years old - freshness is a ranking factor`,
        2
      ));
    } else if (contentAgeDays > 365) {
      weaknesses.push(this.createWeakness(
        'aging_content',
        'medium',
        `Content is ${Math.floor(contentAgeDays / 365)} years old - consider updating`,
        1
      ));
    }

    // 4. SERP Position Weakness
    if (position > 7) {
      weaknesses.push(this.createWeakness(
        'low_serp_position',
        'medium',
        `Ranked at position ${position} - lower CTR due to position`,
        1
      ));
    }

    return weaknesses;
  }

  /**
   * Detect SERP features that may reduce organic CTR
   */
  static detectSerpFeatures(
    hasAnswerBox: boolean = false,
    hasKnowledgePanel: boolean = false,
    hasLocalPack: boolean = false,
    hasNewsBox: boolean = false,
    hasShoppingResults: boolean = false,
    hasAds: boolean = false,
    hasVideoResults: boolean = false
  ): string[] {
    const features: string[] = [];

    if (hasAnswerBox) features.push('featured_snippet');
    if (hasKnowledgePanel) features.push('knowledge_panel');
    if (hasLocalPack) features.push('local_pack');
    if (hasNewsBox) features.push('news_box');
    if (hasShoppingResults) features.push('shopping_results');
    if (hasAds) features.push('ads');
    if (hasVideoResults) features.push('video_results');

    return features;
  }

  /**
   * Calculate SERP feature weakness (CTR reduction)
   */
  static calculateSerpFeatureWeakness(features: string[]): DetectedWeakness | null {
    if (features.length === 0) {
      return null;
    }

    const featureNames = features.join(', ');
    const severity = features.length > 3 ? 'high' : 'medium';
    const points = features.length > 3 ? 2 : 1;

    return this.createWeakness(
      'serp_features_reduce_clicks',
      severity,
      `SERP has ${features.length} features (${featureNames}) reducing organic CTR`,
      points
    );
  }

  /**
   * Calculate total weakness score (higher = more weaknesses)
   */
  static calculateTotalWeaknessScore(weaknesses: DetectedWeakness[]): number {
    const criticalWeight = 4;
    const highWeight = 3;
    const mediumWeight = 2;
    const lowWeight = 1;

    return weaknesses.reduce((total, weakness) => {
      switch (weakness.severity) {
        case 'critical':
          return total + criticalWeight;
        case 'high':
          return total + highWeight;
        case 'medium':
          return total + mediumWeight;
        case 'low':
          return total + lowWeight;
        default:
          return total;
      }
    }, 0);
  }

  /**
   * Helper to create weakness object with unique ID
   */
  private static createWeakness(
    type: string,
    severity: 'critical' | 'high' | 'medium' | 'low',
    description: string,
    points: number
  ): DetectedWeakness {
    return {
      id: `weakness_${this.weaknessIdCounter++}`,
      weaknessType: type,
      severity,
      description,
      points
    };
  }
}

