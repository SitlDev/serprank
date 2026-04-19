import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { SerpScraperService } from '../services/serp-scraper';
import { DomainAuthorityService } from '../services/domain-authority';
import { WeaknessDetectionService, DetectedWeakness } from '../services/weakness-detection';
import { KeywordScoreService } from '../services/keyword-score';

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

      // Step 2: Analyze each SERP result
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
          false, // hasStructuredData - would detect in real implementation
          backlinksCount,
          referringDomains
        );

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

      // Step 3: Calculate keyword score
      console.log('📈 Calculating KeywordScore...');
      const avgDomainScore = domainScoresArray.reduce((a, b) => a + b, 0) / domainScoresArray.length;
      const avgWeaknessScore = totalWeaknessScore / serpResults.length;

      // Mock search volume and difficulty (would come from keyword research API in production)
      const mockSearchVolume = 5000; // placeholder
      const mockKeywordDifficulty = 35; // placeholder

      const keywordScore = KeywordScoreService.calculateKeywordScore(
        mockSearchVolume,
        mockKeywordDifficulty,
        avgWeaknessScore,
        avgDomainScore
      );

      const opportunityLevel = KeywordScoreService.getOpportunityLevel(keywordScore);
      const estimatedTraffic = KeywordScoreService.estimateTraffic(mockSearchVolume, 1); // Assumes we can rank #1

      const scoringBreakdown = KeywordScoreService.getScoringBreakdown(
        mockSearchVolume,
        mockKeywordDifficulty,
        avgWeaknessScore,
        avgDomainScore
      );

      // Step 4: Return comprehensive analysis
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

      // TODO: Save to database and deduct credits
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
      
      // TODO: Implement database query to fetch saved analysis
      // For now, return a placeholder
      
      res.json({
        message: 'Analysis retrieval not yet implemented',
        keywordId
      });
    } catch (error) {
      console.error('Error retrieving analysis:', error);
      res.status(500).json({
        error: 'Failed to retrieve analysis'
      });
    }
  }
}
