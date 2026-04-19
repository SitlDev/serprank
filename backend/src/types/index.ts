export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  plan: 'starter' | 'professional' | 'enterprise';
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Keyword {
  id: string;
  keyword: string;
  searchVolume: number;
  difficultyScore: number;
  keywordScore: number;
  estimatedTraffic: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SerpResult {
  id: string;
  keywordId: string;
  position: number;
  url: string;
  title: string;
  description: string;
  domain: string;
  domainScore: number;
  pageScore: number;
  spamScore: number;
  pageSpeed: number;
  isHttps: boolean;
  hasCanonical: boolean;
  lastUpdated: Date;
  contentAgeDays: number;
  weaknesses: DetectedWeakness[];
  serpFeatures: SerpFeature[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SerpFeature {
  id: string;
  serpResultId: string;
  featureType: string;
  description: string;
  createdAt: Date;
}

export interface DetectedWeakness {
  id: string;
  serpResultId: string;
  weaknessType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  createdAt: Date;
}

export interface DomainScore {
  id: string;
  domain: string;
  score: number;
  backlinks: number;
  referringDomains: number;
  trustScore: number;
  lastUpdated: Date;
}

export interface Analysis {
  id: string;
  userId: string;
  analysisType: string;
  keywordsAnalyzed: number;
  creditsUsed: number;
  results: any;
  createdAt: Date;
}

export interface ResearchCollection {
  id: string;
  userId: string;
  name: string;
  description: string;
  keywordCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type WeaknessType = 
  | 'low_domain_score'
  | 'low_page_score'
  | 'no_backlinks'
  | 'slow_page_speed'
  | 'high_spam_score'
  | 'no_https'
  | 'broken_page'
  | 'missing_canonical'
  | 'old_content'
  | 'title_mismatch'
  | 'keyword_not_in_headings'
  | 'missing_headings'
  | 'intent_mismatch'
  | 'ugc_heavy_serp'
  | 'flash_or_frames'
  | 'missing_h1'
  | 'duplicate_content';
