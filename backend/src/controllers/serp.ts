import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { SerpScraperService } from '../services/serp-scraper';
import { DomainAuthorityService } from '../services/domain-authority';
import { WeaknessDetectionService, DetectedWeakness } from '../services/weakness-detection';
import { KeywordScoreService } from '../services/keyword-score';
import { KeywordModel, SerpResultModel, WeaknessModel } from '../models/index';

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

      // TODO: Check user credits once user system is fully implemented
      // const user = await UserModel.findById(req.userId!);
      // if (!user || user.credits < 10) {
      //   return res.status(402).json({ error: 'Insufficient credits' });
      // }

      console.log(`📊 Analyzing keyword: "${keyword}"`);

      // Step 1: Fetch SERP results
      console.log('🔍 Fetching SERP results...');
      const serpResults = await SerpScraperService.fetchSearchResults(keyword, 10);

      if (serpResults.length === 0) {
        return res.status(400).json({ error: 'No SERP results found' });
      }

      // Step 2: Create/get keyword record
      console.log('💾 Saving keyword to database...');
      let keywordRecord = await KeywordModel.findByKeyword(keyword);
      if (!keywordRecord) {
        keywordRecord = await KeywordModel.create(keyword, 5000, 35); // Mock search volume and difficulty
      }

      // Delete previous analysis if exists
      await WeaknessModel.deleteByKeyword(keywordRecord.id);
      await SerpResultModel.deleteByKeywordId(keywordRecord.id);

      // Step 3: Analyze each SERP result
      console.log('🔎 Analyzing results for weaknesses...');
      const analysisResults = [];
      const domainScoresArray: number[] = [];
      let totalWeaknessScore = 0;

      for (const serpResult of serpResults) {
        // Fetch domain metrics for this result
        const domainScore = await DomainAuthorityService.getDomainScore(serpResult.domain);
        const pageScore = await DomainAuthorityService.getPageScore(serpResult.url);
        const spamScore = await DomainAuthorityService.getSpamScore(serpResult.domain);
        const pageSpeed = await DomainAuthorityService.getPageSpeed(serpResult.url);
        const isHttps = await DomainAuthorityService.checkHttps(serpResult.url);
        const hasCanonical = await DomainAuthorityService.checkCanonical(serpResult.url);
        const contentAgeDays = await DomainAuthorityService.getContentAge(serpResult.url);
        const isMobileFriendly = await DomainAuthorityService.checkMobileFriendly(serpResult.url);
        const backlinksCount = await DomainAuthorityService.getBacklinkCount(serpResult.domain);
        const referringDomains = await DomainAuthorityService.getReferringDomains(serpResult.domain);

        domainScoresArray.push(domainScore);

        // Create SERP result record
        const resultRecord = await SerpResultModel.create(
          keywordRecord.id,
          serpResult.position,
          serpResult.url,
          serpResult.title,
          serpResult.description,
          serpResult.domain
        );

        // Update with metrics
        await SerpResultModel.updateMetrics(
          resultRecord.id,
          domainScore,
          pageScore,
          spamScore,
          pageSpeed,
          isHttps,
          hasCanonical,
          contentAgeDays
        );

        // Detect weaknesses
        const weaknesses = WeaknessDetectionService.analyzeResult(
          serpResult.position,
          serpResult.domain,
          domainScore,
          pageScore,
          spamScore,
          pageSpeed,
          isHttps,
          hasCanonical,
          contentAgeDays,
          isMobileFriendly,
          false, // hasStructuredData
          backlinksCount,
          referringDomains
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

        const weaknessScore = WeaknessDetectionService.calculateTotalWeaknessScore(weaknesses);
        totalWeaknessScore += weaknessScore;

        analysisResults.push({
          position: serpResult.position,
          url: serpResult.url,
          title: serpResult.title,
          domain: serpResult.domain,
          metrics: {
            domainScore,
            pageScore,
            spamScore,
            pageSpeed,
            isHttps,
            hasCanonical,
            contentAgeDays,
            isMobileFriendly,
            backlinksCount,
            referringDomains
          },
          weaknesses: weaknesses,
          weaknessScore
        });
      }

      // Step 4: Calculate keyword score
      console.log('📈 Calculating KeywordScore...');
      const avgDomainScore = domainScoresArray.reduce((a, b) => a + b, 0) / domainScoresArray.length;
      const avgWeaknessScore = totalWeaknessScore / serpResults.length;

      // Mock search volume and difficulty (would come from keyword research API in production)
      const mockSearchVolume = 5000;
      const mockKeywordDifficulty = 35;

      const keywordScore = KeywordScoreService.calculateKeywordScore(
        mockSearchVolume,
        mockKeywordDifficulty,
        avgWeaknessScore,
        avgDomainScore
      );

      const opportunityLevel = KeywordScoreService.getOpportunityLevel(keywordScore);
      const estimatedTraffic = KeywordScoreService.estimateTraffic(mockSearchVolume, 1);

      const scoringBreakdown = KeywordScoreService.getScoringBreakdown(
        mockSearchVolume,
        mockKeywordDifficulty,
        avgWeaknessScore,
        avgDomainScore
      );

      // Step 5: Save keyword score to database
      console.log('💾 Saving keyword score...');
      await KeywordModel.updateKeywordScore(
        keywordRecord.id,
        keywordScore,
        estimatedTraffic
      );

      // Step 6: Return comprehensive analysis
      console.log('✅ Analysis complete');

      res.json({
        keyword,
        analysis: {
          keywordScore,
          opportunityLevel,
          estimatedTraffic,
          avgDomainScore: Math.round(avgDomainScore),
          avgWeaknessScore: Math.round(avgWeaknessScore)
        },
        scoringBreakdown,
        serpResults: analysisResults,
        timestamp: new Date().toISOString()
      });

      // TODO: Deduct user credits
      // await UserModel.updateCredits(req.userId!, -10);

    } catch (error) {
      console.error('❌ Error analyzing keyword:', error);
      res.status(500).json({
        error: 'Failed to analyze keyword',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Get saved analysis results
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
        results: resultsWithWeaknesses,
        createdAt: keyword.created_at,
        updatedAt: keyword.updated_at
      });
    } catch (error) {
      console.error('Error retrieving analysis:', error);
      res.status(500).json({
        error: 'Failed to retrieve analysis'
      });
    }
  }
}
