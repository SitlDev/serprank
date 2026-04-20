# SERPRank Documentation

**SERPRank** is a comprehensive SERP analysis and keyword research platform by **Knotstranded LLC**, designed to help SEOs and digital marketers find ranking opportunities their competitors missed.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Core Features](#core-features)
3. [How It Works](#how-it-works)
4. [API Reference](#api-reference)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)
7. [Support](#support)

---

## Getting Started

### Creating Your Account

1. Visit [SERPRank](https://serprank.io) and click **Sign Up**
2. Enter your email and create a secure password
3. Verify your email address
4. Start with 1,000 free credits immediately

### Dashboard Overview

Once logged in, you'll see:
- **Keywords**: Manage and analyze your target keywords
- **Trending**: Discover trending keywords from 11+ sources
- **SERP Analysis**: Deep dive into search results for any keyword
- **Campaigns**: Track keyword rankings over time
- **Account**: Manage your subscription and credits

---

## Core Features

### 1. SERP Analysis

**What it does:** Analyzes Google search results for any keyword to identify ranking opportunities.

**How to use:**
```
1. Search for a keyword in the search bar
2. View real-time SERP features (featured snippets, People Also Ask, etc.)
3. Analyze top 10 competitors ranking for that keyword
4. Get difficulty score based on actual ranking data
```

**Credits required:** 1 credit per keyword

**What you get:**
- Competitor domains ranking for keyword
- Current search volume (from Google Trends)
- Keyword difficulty score (0-100)
- SERP features breakdown
- Estimated traffic potential
- Content gap opportunities

### 2. Trending Keywords

**What it does:** Discovers trending and rising keywords across 11 different sources globally.

**Available sources:**
- **Google** (Global trending)
- **Bing** (US & International)
- **YouTube** (Video keywords)
- **TikTok** (Short-form video trends)
- **Instagram** (Hashtag trends)
- **Twitter/X** (Real-time topics)
- **Reddit** (Community discussions)
- **Pinterest** (Visual search trends)
- **Yandex** (Russia trending)
- **Baidu** (China trending)
- **Naver** (Korea trending)

**How to use:**
```
1. Go to Trending section
2. Select your desired source(s)
3. Filter by category (search-engine, social, video, etc.)
4. Export trends for analysis
5. Run SERP analysis on trending keywords
```

**Credits required:** Varies by bulk analysis size

### 3. Keyword Difficulty Scoring

**What it does:** Scores how difficult it is to rank for a keyword (0-100 scale).

**Scoring factors:**
- Domain authority of top 10 competitors
- Backlink profile strength
- Content quality analysis
- Search intent match
- Keyword specificity

**Score interpretation:**
- **0-15**: Easy (Quick wins for new sites)
- **16-40**: Low (Achievable with quality content)
- **41-60**: Medium (Requires strong SEO foundation)
- **61-85**: Hard (Competitive niche)
- **86-100**: Very Hard (Major brands competing)

### 4. Competitive Intelligence

**What it does:** Shows which keywords your competitors rank for.

**How to use:**
```
1. Enter competitor domain
2. View all keywords they rank for
3. Identify gaps in your own strategy
4. Find "low-hanging fruit" keywords
5. Monitor competitor rankings over time
```

**Use cases:**
- Find keywords you should target
- Discover competitor content strategy
- Identify new market opportunities
- Monitor competitor movements

### 5. Bulk Analysis

**What it does:** Analyze hundreds or thousands of keywords simultaneously.

**How to use:**
```
1. Upload CSV file or paste keyword list
2. SERPRank analyzes all keywords in batch
3. Get complete report with difficulty scores
4. Download results as CSV or PDF
5. Track performance over time
```

**Pricing:**
- 1-50 keywords: Standard (1 credit = 1 keyword)
- 51-500 keywords: 20% bulk discount
- 501+ keywords: 40% bulk discount
- Contact sales for enterprise pricing

### 6. Campaign Tracking

**What it does:** Automatically monitors your keyword rankings daily/weekly.

**How to set up:**
```
1. Create new campaign
2. Add keywords to track
3. Set tracking frequency (daily/weekly)
4. SERPRank monitors positions automatically
5. Get alerts when rankings change
```

**What you track:**
- Current position for each keyword
- Position changes over time
- Estimated traffic changes
- SERP feature changes
- Competitor movements

**Available on:**
- Starter: Up to 3 campaigns
- Pro: Unlimited campaigns

---

## How It Works

### The Algorithm

SERPRank combines multiple data sources to score keyword difficulty:

1. **Domain Authority Analysis**: Evaluates the authority of top-ranking domains using:
   - Backlink count and quality
   - Domain age and history
   - Brand signals
   - Citation flow

2. **Content Analysis**: Examines top-10 content:
   - Content length vs. keyword
   - Keyword usage frequency
   - Content structure and headers
   - Media and engagement signals

3. **Search Intent Matching**: Determines if your target audience matches:
   - Commercial intent (buying keywords)
   - Informational intent (research)
   - Navigational intent (brand searches)
   - Transactional intent (action-based)

4. **Real-time SERP Features**: Identifies:
   - Featured snippets (position 0)
   - People Also Ask boxes
   - Knowledge panels
   - Image packs
   - Local pack results
   - Ads placement

### Opportunity Scoring

Our unique **Opportunity Score** combines:
- Keyword volume × Traffic potential
- ÷ Difficulty score
- × Your content relevance
- × Niche competitiveness

**Result**: Keywords ranked by real ranking potential, not just search volume.

### Real-time Updates

- **Trending keywords**: Updated hourly
- **SERP data**: Updated when analyzed
- **Rankings**: Updated daily (Pro plan)
- **Competitor data**: Updated weekly

---

## API Reference

### Authentication

All API requests require a Bearer token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.serprank.io/v1/keyword/analyze
```

**Get your API key:**
1. Go to Settings → API Keys
2. Click "Generate New Key"
3. Copy and store securely

### Endpoints

#### Analyze Single Keyword

```
POST /v1/keyword/analyze
Content-Type: application/json

{
  "keyword": "best seo tools",
  "language": "en",
  "country": "US"
}

Response:
{
  "keyword": "best seo tools",
  "difficulty": 45,
  "searchVolume": 1200,
  "traffic": 89000,
  "competitorCount": 523,
  "serpFeatures": ["featured_snippet", "people_also_ask"],
  "topCompetitors": [
    {
      "domain": "ahrefs.com",
      "position": 1,
      "authority": 94,
      "backlinks": 125000
    }
  ]
}
```

#### Bulk Analyze Keywords

```
POST /v1/keyword/bulk-analyze
Content-Type: application/json

{
  "keywords": ["keyword 1", "keyword 2", "keyword 3"],
  "country": "US"
}

Response:
{
  "jobId": "bulk-123456",
  "status": "processing",
  "estimated_completion": "2026-04-20T14:30:00Z"
}
```

#### Get Trending Keywords

```
GET /v1/trending/keywords?source=google&limit=20

Response:
{
  "source": "google",
  "timestamp": "2026-04-20T13:00:00Z",
  "keywords": [
    {
      "keyword": "prompt engineering",
      "trend": "up",
      "volume": 5400,
      "growth": 45
    }
  ]
}
```

#### Track Campaign

```
POST /v1/campaigns/track
Content-Type: application/json

{
  "name": "Q2 SEO Campaign",
  "keywords": ["target keyword 1", "target keyword 2"],
  "trackingFrequency": "daily"
}

Response:
{
  "campaignId": "camp-789012",
  "status": "active",
  "created": "2026-04-20T13:00:00Z"
}
```

### Rate Limits

- **Free/Starter**: 100 requests/hour
- **Pro**: 1,000 requests/hour
- **Enterprise**: Custom limits

---

## Best Practices

### 1. Finding Low-Competition Keywords

**Strategy:**
1. Start with high-volume trending keywords
2. Filter by difficulty score (0-40)
3. Check search intent matches your content
4. Verify traffic potential is above 500/month
5. Run bulk analysis on 20-30 candidates
6. Choose top 5 to target

**Example workflow:**
- Trend source: Google (global)
- Filter: "difficulty < 30"
- Volume: "1000-5000/month"
- Add to campaign and monitor weekly

### 2. Competitive Analysis

**Strategy:**
1. Enter competitor domain
2. Export their keyword list
3. Identify high-traffic, low-difficulty keywords
4. Target those keywords instead
5. Create better content
6. Track their movements weekly

**Pro tip:** Monitor 3-5 competitors for early warning of keyword trend changes.

### 3. SERP Feature Optimization

**Strategy:**
1. Analyze keyword for SERP features
2. If featured snippet exists, optimize for it
3. If FAQ features exist, create FAQ section
4. If image pack, add quality images
5. Implement schema markup for features

**Result:** Better CTR and position improvements.

### 4. Content Gap Discovery

**Strategy:**
1. Find keywords competitors rank for
2. That you DON'T rank for
3. With difficulty < your site authority
4. Create better content targeting those gaps
5. Build backlinks to new content
6. Track results weekly

### 5. Campaign Optimization

**Frequency:** Review weekly
**Metrics:** Watch for:
- Position improvements (goal: +1-2 per week)
- Traffic increases (goal: +10-20% monthly)
- Competitor position changes (identify issues)
- New SERP features (adjust strategy)

---

## Troubleshooting

### "Insufficient Credits"

**Issue:** Can't perform analysis due to low credits.

**Solutions:**
- Upgrade your plan
- Use bulk discount (analyze 50+ keywords)
- Wait for monthly credits to reset
- Contact sales for additional credits

### "No Search Volume Data"

**Issue:** Keyword shows 0 search volume.

**Reasons:**
- Very new keyword (under 1 month old)
- Niche keyword with low searches
- Misspelled or low-intent keyword
- Geographic limitation

**Solution:** Check related keywords or broader terms.

### "SERP Data Outdated"

**Issue:** SERP results seem stale.

**Solution:**
- Free plan: Data cached for 24 hours
- Starter: Data cached for 12 hours
- Pro: Fresh analysis (live)

Click "Refresh" for latest data.

### "Campaign Not Tracking"

**Issue:** Rankings not updating.

**Solutions:**
1. Verify keywords are in Google index
2. Check keyword targeting correct country/language
3. Ensure campaign is "active" status
4. Wait 24 hours for first data point

### API Connection Issues

**Issue:** API requests failing.

**Check:**
1. API key is correct
2. Rate limits not exceeded
3. Authorization header format: `Bearer KEY`
4. Request body valid JSON
5. Endpoint URL is correct

**Debug:**
```bash
curl -v -H "Authorization: Bearer YOUR_KEY" \
  https://api.serprank.io/v1/keyword/analyze
```

---

## Support

### Documentation Resources

- **Getting Started**: https://docs.serprank.io/getting-started
- **API Docs**: https://docs.serprank.io/api
- **Video Tutorials**: https://youtube.com/@serprank
- **Blog**: https://blog.serprank.io

### Contact Support

- **Email**: support@serprank.io
- **Chat**: Available 9 AM - 6 PM EST, Monday-Friday
- **Phone**: +1-555-SERP-RANK (for Pro customers)

### Reporting Issues

Found a bug? Let us know:
1. Email: bugs@serprank.io
2. Include: Steps to reproduce, screenshots, browser/OS info
3. We typically respond within 24 hours

### Feature Requests

Have an idea? We'd love to hear it:
1. Visit: https://serprank.io/feedback
2. Upvote existing requests
3. We review feedback monthly and prioritize with highest demand

---

## About Knotstranded LLC

**SERPRank** is developed and maintained by **Knotstranded LLC**, a software company specializing in SEO tools and digital marketing solutions.

- **Website**: https://knotstranded.com
- **Email**: hello@knotstranded.com
- **Founded**: 2024
- **Location**: USA

### Privacy & Legal

- [Terms of Service](https://serprank.io/legal/terms)
- [Privacy Policy](https://serprank.io/legal/privacy)
- [Security Policy](https://serprank.io/legal/security)

---

## Version History

**Current Version:** 1.0.0
**Last Updated:** April 20, 2026

### Changelog

- **v1.0.0** (2026-04-20): Initial release
  - SERP Analysis
  - Trending Keywords (11 sources)
  - Keyword Difficulty Scoring
  - Campaign Tracking
  - Bulk Analysis
  - API Access

---

**Happy ranking! 🚀**

Questions? Contact [support@serprank.io](mailto:support@serprank.io)
