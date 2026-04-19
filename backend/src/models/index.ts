import { query } from './connection';
import { User, Keyword, SerpResult, DetectedWeakness, DomainScore } from '../types/index';
import { v4 as uuidv4 } from 'uuid';

// User Model
export class UserModel {
  static async create(email: string, passwordHash: string, firstName: string = '', lastName: string = ''): Promise<User> {
    const result = await query(
      `INSERT INTO users (id, email, password_hash, first_name, last_name) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, first_name, last_name, plan, credits, created_at, updated_at`,
      [uuidv4(), email, passwordHash, firstName, lastName]
    );
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async updateCredits(userId: string, amount: number): Promise<User> {
    const result = await query(
      `UPDATE users SET credits = credits + $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [amount, userId]
    );
    return result.rows[0];
  }

  static async getPasswordHash(email: string): Promise<string | null> {
    const result = await query('SELECT password_hash FROM users WHERE email = $1', [email]);
    return result.rows[0]?.password_hash || null;
  }
}

// Keyword Model
export class KeywordModel {
  static async create(keyword: string, searchVolume: number = 0, difficultyScore: number = 0): Promise<Keyword> {
    const result = await query(
      `INSERT INTO keywords (id, keyword, search_volume, difficulty_score, keyword_score) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [uuidv4(), keyword.toLowerCase().trim(), searchVolume, difficultyScore, 0]
    );
    return result.rows[0];
  }

  static async findByKeyword(keyword: string): Promise<Keyword | null> {
    const result = await query(
      'SELECT * FROM keywords WHERE LOWER(keyword) = $1',
      [keyword.toLowerCase().trim()]
    );
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<Keyword | null> {
    const result = await query('SELECT * FROM keywords WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async updateKeywordScore(keywordId: string, score: number, estimatedTraffic: number): Promise<Keyword> {
    const result = await query(
      `UPDATE keywords 
       SET keyword_score = $1, estimated_traffic = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [score, estimatedTraffic, keywordId]
    );
    return result.rows[0];
  }

  static async search(searchTerm: string, limit: number = 20): Promise<Keyword[]> {
    const result = await query(
      `SELECT * FROM keywords 
       WHERE LOWER(keyword) LIKE LOWER($1) 
       ORDER BY search_volume DESC 
       LIMIT $2`,
      [`%${searchTerm}%`, limit]
    );
    return result.rows;
  }
}

// SERP Result Model
export class SerpResultModel {
  static async create(
    keywordId: string,
    position: number,
    url: string,
    title: string,
    description: string,
    domain: string
  ): Promise<SerpResult> {
    const result = await query(
      `INSERT INTO serp_results (id, keyword_id, position, url, title, description, domain) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [uuidv4(), keywordId, position, url, title, description, domain]
    );
    return result.rows[0];
  }

  static async findByKeywordId(keywordId: string): Promise<SerpResult[]> {
    const result = await query(
      `SELECT * FROM serp_results 
       WHERE keyword_id = $1 
       ORDER BY position ASC`,
      [keywordId]
    );
    return result.rows;
  }

  static async updateMetrics(
    serpResultId: string,
    domainScore: number,
    pageScore: number,
    spamScore: number,
    pageSpeed: number,
    isHttps: boolean,
    hasCanonical: boolean,
    contentAgeDays: number
  ): Promise<SerpResult> {
    const result = await query(
      `UPDATE serp_results 
       SET domain_score = $1, page_score = $2, spam_score = $3, page_speed = $4, 
           is_https = $5, has_canonical = $6, content_age_days = $7, 
           last_updated = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $8 
       RETURNING *`,
      [domainScore, pageScore, spamScore, pageSpeed, isHttps, hasCanonical, contentAgeDays, serpResultId]
    );
    return result.rows[0];
  }
}

// Weakness Model
export class WeaknessModel {
  static async create(
    serpResultId: string,
    weaknessType: string,
    severity: 'critical' | 'high' | 'medium' | 'low',
    description: string = ''
  ): Promise<DetectedWeakness> {
    const result = await query(
      `INSERT INTO detected_weaknesses (id, serp_result_id, weakness_type, severity, description) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [uuidv4(), serpResultId, weaknessType, severity, description]
    );
    return result.rows[0];
  }

  static async findBySerpResultId(serpResultId: string): Promise<DetectedWeakness[]> {
    const result = await query(
      'SELECT * FROM detected_weaknesses WHERE serp_result_id = $1',
      [serpResultId]
    );
    return result.rows;
  }

  static async deleteByKeyword(keywordId: string): Promise<void> {
    await query(
      `DELETE FROM detected_weaknesses 
       WHERE serp_result_id IN (SELECT id FROM serp_results WHERE keyword_id = $1)`,
      [keywordId]
    );
  }
}

// Domain Score Model
export class DomainScoreModel {
  static async upsert(
    domain: string,
    score: number,
    backlinks: number,
    referringDomains: number,
    trustScore: number
  ): Promise<DomainScore> {
    const result = await query(
      `INSERT INTO domain_scores (id, domain, score, backlinks, referring_domains, trust_score) 
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (domain) DO UPDATE 
       SET score = $3, backlinks = $4, referring_domains = $5, trust_score = $6, last_updated = CURRENT_TIMESTAMP
       RETURNING *`,
      [uuidv4(), domain, score, backlinks, referringDomains, trustScore]
    );
    return result.rows[0];
  }

  static async findByDomain(domain: string): Promise<DomainScore | null> {
    const result = await query(
      'SELECT * FROM domain_scores WHERE domain = $1',
      [domain]
    );
    return result.rows[0] || null;
  }
}

// Analysis Model
export class AnalysisModel {
  static async create(
    userId: string,
    analysisType: string,
    keywordsAnalyzed: number,
    creditsUsed: number,
    results: any
  ) {
    const result = await query(
      `INSERT INTO analyses (id, user_id, analysis_type, keywords_analyzed, credits_used, results) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [uuidv4(), userId, analysisType, keywordsAnalyzed, creditsUsed, JSON.stringify(results)]
    );
    return result.rows[0];
  }

  static async findByUserId(userId: string, limit: number = 50) {
    const result = await query(
      `SELECT * FROM analyses 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  }
}
