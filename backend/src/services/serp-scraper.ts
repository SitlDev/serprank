import axios from 'axios';

export interface SerpResult {
  position: number;
  url: string;
  title: string;
  description: string;
  domain: string;
  displayUrl: string;
}

export interface SerpFeature {
  type: string;
  data: any;
}

/**
 * SERP Scraper Service
 * Fetches and parses Google search results using Serper.dev API
 * 
 * API: https://serper.dev
 * Pricing: 100/month free, then $10/month for 500 searches
 */
export class SerpScraperService {
  private static readonly SERPER_API_URL = 'https://google.serper.dev/search';
  private static readonly SERPER_API_KEY = process.env.SERPER_API_KEY;

  /**
   * Fetch organic search results from Google via Serper.dev
   */
  static async fetchSearchResults(keyword: string, limit: number = 10): Promise<SerpResult[]> {
    if (!this.SERPER_API_KEY) {
      console.warn('⚠️  SERPER_API_KEY not set. Using mock data. Get one at https://serper.dev');
      return this.getMockResults(keyword);
    }

    try {
      const results = await this.fetchWithSerperAPI(keyword, limit);
      return results;
    } catch (error) {
      console.error('Error fetching search results from Serper.dev:', error);
      // Fallback to mock data on error
      return this.getMockResults(keyword);
    }
  }

  /**
   * Fetch results from Serper.dev API
   */
  private static async fetchWithSerperAPI(keyword: string, limit: number = 10): Promise<SerpResult[]> {
    const response = await axios.post(
      this.SERPER_API_URL,
      {
        q: keyword,
        num: limit,
        autocorrect: true,
        gl: 'us',
        hl: 'en'
      },
      {
        headers: {
          'X-API-KEY': this.SERPER_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    // Transform Serper.dev response to our format
    return (response.data.organic || []).map((result: any, index: number) => ({
      position: index + 1,
      url: result.link,
      title: result.title,
      description: result.snippet,
      domain: new URL(result.link).hostname || '',
      displayUrl: result.link
    }));
  }

  /**
   * Mock SERP results for development
   */
  private static getMockResults(keyword: string): SerpResult[] {
    const domains = [
      'wikipedia.org',
      'example.com',
      'blog.example.com',
      'guide.example.com',
      'help.example.com',
      'forum.example.com',
      'news.example.com',
      'video.example.com',
      'shop.example.com',
      'community.example.com'
    ];

    return Array.from({ length: 10 }, (_, i) => ({
      position: i + 1,
      url: `https://${domains[i]}/article/${keyword.replace(/\s+/g, '-')}`,
      title: `${keyword} - Result ${i + 1}`,
      description: `Learn about ${keyword}. This is a comprehensive guide covering all aspects of ${keyword}.`,
      domain: domains[i],
      displayUrl: `${domains[i]} › article › ${keyword.replace(/\s+/g, '-')}`
    }));
  }

  /**
   * Detect SERP features in results
   */
  static detectSerpFeatures(html: string): SerpFeature[] {
    const features: SerpFeature[] = [];

    // These would be detected based on HTML structure
    const featurePatterns = {
      featured_snippet: /[Ff]eatured\s+[Ss]nippet/,
      knowledge_panel: /[Kk]nowledge\s+[Pp]anel/,
      local_pack: /[Ll]ocal\s+[Pp]ack/,
      news_box: /[Nn]ews\s+[Bb]ox/,
      shopping_results: /[Ss]hopping/,
      ads: /[Aa]dvertisements/,
      video_results: /[Vv]ideo/,
      related_searches: /[Rr]elated\s+[Ss]earches/,
      people_also_ask: /[Pp]eople\s+[Aa]lso\s+[Aa]sk/,
      sitelinks: /[Ss]itelinks/,
    };

    for (const [featureName, pattern] of Object.entries(featurePatterns)) {
      if (pattern.test(html)) {
        features.push({
          type: featureName,
          data: { detected: true }
        });
      }
    }

    return features;
  }

  /**
   * Extract featured snippet if present
   */
  static extractFeaturedSnippet(html: string): any | null {
    // Implementation would parse for featured snippet box
    return null;
  }

  /**
   * Extract knowledge panel data
   */
  static extractKnowledgePanel(html: string): any | null {
    // Implementation would parse knowledge panel
    return null;
  }

  /**
   * Extract People Also Ask questions
   */
  static extractPeopleAlsoAsk(html: string): string[] {
    // Implementation would parse PAA section
    return [];
  }
}
