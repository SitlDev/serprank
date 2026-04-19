import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { 
  KeywordModel, 
  SerpResultModel, 
  WeaknessModel, 
  DomainScoreModel, 
  AnalysisModel,
  UserModel 
} from '../models/index';
import { SerpScraperService } from '../services/serp-scraper';
import { DomainAuthorityService } from '../services/domain-authority';
import { WeaknessDetectionService } from '../services/weakness-detection';

export class SerpController {
  /**
   * Analyze a keyword - fetches SERP, detects weaknesses, calculates score
   */
  static async analyzeKeyword(req: AuthRequest, res: Response) {
    try {
      const { keyword } = req.body;

      if (!keyword || keyword.trim().length === 0) {
        return res.status(400).json({ error: 'Keyword required' });
      }

      // Check user credits
      const user = await UserModel.findById(req.userId!);
      if (!user || user.credits < 10) {
        return res.status(402).json({ error: 'Insufficient credits' });
      }

      // Get or create keyword
      let keywordRecord = await KeywordModel.findByKeyword(keyword);
      if (!keywordRecord) {
        keywordRecord = await KeywordModel.create(keyword, 1000, 45); // Mock data
      }

      // Fetch SERP results
      const serpResults = await SerpScraperService.fetchSearchResults(keyword, 10);

      // Clear previous analysis
      await WeaknessModel.deleteByKeyword(keywordRecord.id);

      // Analyze each result
      const analysisResults = [];
      const domainScores: number[] = [];

      for (const serpResult of serpResults) {
        // Create SERP result record
        let resultRecord = await SerpResultModel.create(
          keywordRecord.id,
          serpResult.position,
          serpResult.url,
          serpResult.title,
          serpResult.description,
          serpResult.domain
        );

        // Fetch metrics
        const domainScore = await DomainAuthorityService.getDomainScore(serpResult.domain);
        const pageScore = await DomainAuthorityService.getPageScore(serpResult.url);
        const spamScore = await DomainAuthorityService.getSpamScore(serpResult.domain);
        const pageSpeed = await DomainAuthorityService.getPageSpeed(serpResult.url);
        const isHttps = await DomainAuthorityService.checkHttps(serpResult.url);
        const hasCanonical = await DomainAuthorityService.hasCanonical(serpResult.url);
        const contentAge = await DomainAuthorityService.getContentAge(serpResult.url);

        domainScores.push(domainScore);

        // Update result with metrics
        resultRecord = await SerpResultModel.updateMetrics(
          resultRecord.id,
          domainScore,
          pageScore,
          spamScore,
          pageSpeed,
          isHttps,
          hasCanonical,
          contentAge
        );

        // Detect weaknesses
        const weaknesses = await WeaknessDetectionService.analyzeSerpResult(
          serpResult,
          domainScore,
          pageScore,
          spamScore,
          pageSpeed,
          isHttps,
          hasCanonical,
          contentAge
        );

        // Save weaknesses to database
        for (const weakness of weaknesses) {
          await WeaknessModel.create(
            resultRecord.id,
            weakness.weaknessType,
            weakness.severity,
            weakness.description
          );
        }

        analysisResults.push({
          position: serpResult.position,
          domain: serpResult.domain,
          url: serpResult.url,
          domainScore,
          pageScore,
          weaknesses: weaknesses.map(w => ({ type: w.weaknessType, severity: w.severity })),
          weaknessCount: weaknesses.length
        });
      }

      // Calculate average domain score
      const avgDomainScore = domainScores.length > 0 
        ? Math.round(domainScores.reduce((a, b) => a + b, 0) / domainScores.length)
        : 0;

      // Calculate keyword score (opportunity score)
      const allWeaknesses = analysisResults.flatMap(r => r.weaknesses);
      const keywordScore = WeaknessDetectionService.calculateKeywordScore(
        allWeaknesses.map((w, i) => ({
          weaknessType: w.type as any,
          severity: w.severity,
          description: '',
          points: 1
        })),
        keywordRecord.search_volume || 1000,
        keywordRecord.difficulty_score || 45,
        avgDomainScore
      );

      // Update keyword with score
      await KeywordModel.updateKeywordScore(
        keywordRecord.id,
        keywordScore,
        Math.round(keywordScore * 18.2) // Rough traffic estimate
      );

      // Deduct credits
      const creditsCost = 10;
      await UserModel.updateCredits(req.userId!, -creditsCost);

      // Save analysis
      await AnalysisModel.create(
        req.userId!,
        'keyword_analysis',
        1,
        creditsCost,
        { keyword, keywordScore, analysisResults }
      );

      res.json({
        keyword,
        keywordScore,
        avgDomainScore,
        totalWeaknesses: allWeaknesses.length,
        results: analysisResults,
        recommendation: this.getRecommendation(keywordScore)
      });
    } catch (error: any) {
      console.error('Error analyzing keyword:', error);
      res.status(500).json({ error: error.message || 'Error analyzing keyword' });
    }
  }

  /**
   * Get recommendation based on keyword score
   */
  private static getRecommendation(score: number): string {
    if (score >= 90) return '🌟 Exceptional opportunity - High probability of ranking';
    if (score >= 70) return '✅ Strong opportunity - Good chance to rank';
    if (score >= 50) return '⚠️  Moderate opportunity - Some competition';
    if (score >= 30) return '❌ Challenging - Significant competition';
    return '🚫 Very difficult - Strong competitors in SERP';
  }

  /**
   * Get SERP analysis for a keyword
   */
  static async getSerpAnalysis(req: AuthRequest, res: Response) {
    try {
      const { keywordId } = req.params;

      const keyword = await KeywordModel.findById(keywordId);
      if (!keyword) {
        return res.status(404).json({ error: 'Keyword not found' });
      }

      const serpResults = await SerpResultModel.findByKeywordId(keywordId);
      
      // Get weaknesses for each result
      const resultsWithWeaknesses = await Promise.all(
        serpResults.map(async (result) => {
          const weaknesses = await WeaknessModel.findBySerpResultId(result.id);
          return { ...result, weaknesses };
        })
      );

      res.json({
        keyword: keyword.keyword,
        keywordScore: keyword.keyword_score,
        estimatedTraffic: keyword.estimated_traffic,
        results: resultsWithWeaknesses
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
