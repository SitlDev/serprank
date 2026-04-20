import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { SerpScraperService } from '../services/serp-scraper';
import { DomainAuthorityService } from '../services/domain-authority';
import { WeaknessDetectionService, DetectedWeakness } from '../services/weakness-detection';
import { KeywordScoreService } from '../services/keyword-score';
import { KeywordModel, SerpResultModel, WeaknessModel, UserModel } from '../models/index';

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
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      if (user.credits < 10) {
        return res.status(402).json({ error: 'Insufficient credits', creditsNeeded: 10, creditsAvailable: user.credits });
      }

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

      // Advanced metrics
      const trafficBreakdown = KeywordScoreService.getTrafficBreakdown(mockSearchVolume);
      const competitiveGaps = KeywordScoreService.getCompetitiveGaps(
        domainScoresArray,
        analysisResults.map(r => r.metrics.backlinksCount),
        analysisResults.map(r => r.metrics.pageSpeed)
      );
      const entryDifficulty = KeywordScoreService.getEntryDifficulty(mockKeywordDifficulty, avgDomainScore);
      const marketSaturation = KeywordScoreService.getMarketSaturation(0, false, false, false, false);
      const opportunityMatrix = KeywordScoreService.getOpportunityMatrix();
      const roiPotential = KeywordScoreService.getRoiPotential(mockSearchVolume, 1);
      const trendAnalysis = KeywordScoreService.getTrendAnalysis(keyword);

      // Step 5: Save keyword score to database
      console.log('💾 Saving keyword score...');
      await KeywordModel.updateKeywordScore(
        keywordRecord.id,
        keywordScore,
        estimatedTraffic
      );

      // Step 6: Return comprehensive analysis
      console.log('✅ Analysis complete');

      // Deduct user credits
      await UserModel.updateCredits(req.userId!, -10);

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
        // Advanced Metrics
        advancedMetrics: {
          trafficBreakdown,
          competitiveGaps,
          entryDifficulty,
          marketSaturation,
          opportunityMatrix,
          roiPotential,
          trendAnalysis
        },
        timestamp: new Date().toISOString()
      });

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
        keywordScore: keyword.keywordScore,
        estimatedTraffic: keyword.estimatedTraffic,
        results: resultsWithWeaknesses,
        createdAt: keyword.createdAt,
        updatedAt: keyword.updatedAt
      });
    } catch (error) {
      console.error('Error retrieving analysis:', error);
      res.status(500).json({
        error: 'Failed to retrieve analysis'
      });
    }
  }

  /**
   * Analyze multiple keywords in bulk
   */
  static async analyzeKeywordsBulk(req: AuthRequest, res: Response) {
    try {
      const { keywords } = req.body;

      if (!Array.isArray(keywords) || keywords.length === 0) {
        return res.status(400).json({ error: 'Keywords array required' });
      }

      if (keywords.length > 100) {
        return res.status(400).json({ error: 'Maximum 100 keywords per request' });
      }

      // Check user credits
      const user = await UserModel.findById(req.userId!);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const creditsNeeded = keywords.length * 10;
      if (user.credits < creditsNeeded) {
        return res.status(402).json({
          error: 'Insufficient credits',
          creditsNeeded,
          creditsAvailable: user.credits,
          keywordsCanAnalyze: Math.floor(user.credits / 10)
        });
      }

      console.log(`📊 Bulk analyzing ${keywords.length} keywords...`);

      const results = [];
      let successCount = 0;
      let failureCount = 0;

      for (const keyword of keywords) {
        try {
          if (!keyword || keyword.trim().length === 0) {
            results.push({
              keyword,
              status: 'failed',
              error: 'Empty keyword'
            });
            failureCount++;
            continue;
          }

          // Fetch SERP results
          const serpResults = await SerpScraperService.fetchSearchResults(keyword, 10);

          if (serpResults.length === 0) {
            results.push({
              keyword,
              status: 'failed',
              error: 'No SERP results found'
            });
            failureCount++;
            continue;
          }

          // Create keyword record
          let keywordRecord = await KeywordModel.findByKeyword(keyword);
          if (!keywordRecord) {
            keywordRecord = await KeywordModel.create(keyword, 5000, 35);
          }

          // Clean previous results
          await WeaknessModel.deleteByKeyword(keywordRecord.id);
          await SerpResultModel.deleteByKeywordId(keywordRecord.id);

          // Analyze results
          const analysisResults = [];
          const domainScoresArray: number[] = [];
          let totalWeaknessScore = 0;

          for (const serpResult of serpResults) {
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

            const resultRecord = await SerpResultModel.create(
              keywordRecord.id,
              serpResult.position,
              serpResult.url,
              serpResult.title,
              serpResult.description,
              serpResult.domain
            );

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
              false,
              backlinksCount,
              referringDomains
            );

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
          }

          // Calculate score
          const avgDomainScore = domainScoresArray.reduce((a, b) => a + b, 0) / domainScoresArray.length;
          const avgWeaknessScore = totalWeaknessScore / serpResults.length;

          const keywordScore = KeywordScoreService.calculateKeywordScore(5000, 35, avgWeaknessScore, avgDomainScore);
          const opportunityLevel = KeywordScoreService.getOpportunityLevel(keywordScore);
          const estimatedTraffic = KeywordScoreService.estimateTraffic(5000, 1);

          await KeywordModel.updateKeywordScore(keywordRecord.id, keywordScore, estimatedTraffic);

          results.push({
            keyword,
            status: 'success',
            keywordScore,
            opportunityLevel,
            estimatedTraffic,
            avgDomainScore: Math.round(avgDomainScore)
          });

          successCount++;
        } catch (error) {
          console.error(`Error analyzing keyword "${keyword}":`, error);
          results.push({
            keyword,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          failureCount++;
        }
      }

      // Deduct credits
      await UserModel.updateCredits(req.userId!, -creditsNeeded);

      res.json({
        summary: {
          totalKeywords: keywords.length,
          successCount,
          failureCount,
          creditsDeducted: creditsNeeded
        },
        results
      });
    } catch (error) {
      console.error('Error in bulk analysis:', error);
      res.status(500).json({
        error: 'Failed to analyze keywords',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Export keyword analysis as CSV
   */
  static async exportAnalysisCSV(req: AuthRequest, res: Response) {
    try {
      const { keywordId } = req.params;

      const keyword = await KeywordModel.findById(keywordId);
      if (!keyword) {
        return res.status(404).json({ error: 'Keyword not found' });
      }

      const serpResults = await SerpResultModel.findByKeywordId(keywordId);

      // Build CSV header
      const csvHeaders = [
        'Position',
        'Domain',
        'Title',
        'URL',
        'Domain Authority',
        'Page Authority',
        'Spam Score',
        'Page Speed (ms)',
        'HTTPS',
        'Canonical',
        'Content Age (days)',
        'Weaknesses',
        'Weakness Severity'
      ];

      // Build CSV rows
      const csvRows = [];
      for (const result of serpResults) {
        const weaknesses = await WeaknessModel.findBySerpResultId(result.id);
        const weaknessTexts = weaknesses.map(w => w.description || w.weaknessType).join('; ');
        const severityTexts = weaknesses.map(w => w.severity).join('; ');

        csvRows.push([
          result.position,
          result.domain,
          `"${result.title.replace(/"/g, '""')}"`,
          result.url,
          (result as any).domainScore || 'N/A',
          (result as any).pageScore || 'N/A',
          (result as any).spamScore || 'N/A',
          (result as any).pageSpeed || 'N/A',
          (result as any).isHttps ? 'Yes' : 'No',
          (result as any).hasCanonical ? 'Yes' : 'No',
          (result as any).contentAgeDays || 'N/A',
          `"${weaknessTexts.replace(/"/g, '""')}"`,
          `"${severityTexts}"`
        ]);
      }

      // Generate CSV
      const csvContent = [
        `Keyword: ${keyword.keyword}`,
        `Keyword Score: ${keyword.keywordScore}`,
        `Estimated Traffic: ${keyword.estimatedTraffic}`,
        `Generated: ${new Date().toISOString()}`,
        '',
        csvHeaders.join(',')
      ].concat(csvRows.map(row => row.join(',')));

      const csv = csvContent.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="serp-analysis-${keyword.keyword.replace(/\s+/g, '-')}.csv"`);
      res.send(csv);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      res.status(500).json({
        error: 'Failed to export CSV'
      });
    }
  }
}

