# Trending Keywords API Setup Guide

All 10 trending sources (excluding Google) have been implemented with full API integration. This guide shows what environment variables and API credentials you need to configure.

## Environment Variables Required

Add these to your `.env` file in the backend directory:

### Search Engines

#### Bing
```bash
BING_SEARCH_API_KEY=your_bing_api_key
```
- Get API key from: https://www.microsoft.com/en-us/bing/apis/bing-web-search-api
- API: Cognitive Services REST API
- Endpoint: `https://api.cognitive.microsoft.com/bing/v7.0/trends`

#### Yandex (Russia)
```bash
YANDEX_API_KEY=your_yandex_api_key
```
- Get API key from: https://yandex.com/dev/metrica/
- API: Yandex Wordstat API
- Endpoint: `https://api.yandex.com/v4/stat/data/bytime`
- Region: Russia (225)

#### Baidu (China)
```bash
BAIDU_API_KEY=your_baidu_api_key
```
- Get API key from: https://index.baidu.com/api
- API: Baidu Index API
- Endpoint: `https://index.baidu.com/api/SearchIndex/index`
- Supports: Simplified Chinese keywords

#### Naver (Korea)
```bash
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```
- Get credentials from: https://developers.naver.com/products/naver-login/
- API: Naver Datalab API
- Endpoint: `https://openapi.naver.com/v1/datalab/search`

### Social & Commerce

#### Twitter/X
```bash
TWITTER_API_KEY=your_twitter_api_key
```
- Get API key from: https://developer.twitter.com/
- API: Twitter API v2
- Endpoint: `https://api.twitter.com/2/trends/`
- Note: Requires authentication token (Bearer token)

#### YouTube
```bash
YOUTUBE_API_KEY=your_youtube_api_key
```
- Get API key from: https://console.cloud.google.com/
- API: YouTube Data API v3
- Endpoint: `https://www.googleapis.com/youtube/v3/videos?chart=mostPopular`
- Region: US (configurable)

#### TikTok
```bash
TIKTOK_API_KEY=your_tiktok_api_key
```
- Get API key from: https://open.tiktok.com/
- API: TikTok API
- Endpoint: `https://api.tiktok.com/v1/trending`
- Note: Limited public API access, consider third-party solution

#### Instagram
```bash
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_account_id
```
- Get tokens from: https://developers.facebook.com/docs/instagram-api
- API: Instagram Graph API
- Endpoint: `https://graph.instagram.com/ig_hashtag_search`
- Note: Requires Business Account

#### Pinterest
```bash
PINTEREST_ACCESS_TOKEN=your_pinterest_access_token
```
- Get token from: https://developers.pinterest.com/
- API: Pinterest API
- Endpoint: `https://api.pinterest.com/v1/`
- Note: Has fallback to public endpoint

#### Reddit
```bash
# No authentication required for public data
# Optional for higher rate limits:
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
```
- Info: https://www.reddit.com/dev/api
- API: Reddit API
- Endpoint: `https://www.reddit.com/r/all/rising.json`
- Public data readable without authentication

## Example .env Configuration

```env
# Search Engines
BING_SEARCH_API_KEY=your_bing_api_key
YANDEX_API_KEY=your_yandex_api_key
BAIDU_API_KEY=your_baidu_api_key
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret

# Social & Commerce
TWITTER_API_KEY=your_twitter_api_key
YOUTUBE_API_KEY=your_youtube_api_key
TIKTOK_API_KEY=your_tiktok_api_key
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_account_id
PINTEREST_ACCESS_TOKEN=your_pinterest_access_token
```

## Implementation Details

### Google Trends (Already Implemented)
- Uses `google-trends-api` npm package
- No API key required
- Endpoint: Official Google Trends data
- Status: ✅ Fully integrated

### Other Sources Implementation

All other sources follow this pattern:

1. **API Request**: Uses axios to fetch data from each platform's API
2. **Error Handling**: Graceful fallback with console warnings if API keys are missing
3. **Data Transformation**: Converts platform-specific data to standardized `TrendingKeyword` format
4. **Rate Limiting**: Built-in error handling for rate limits

### Data Structure

All trending keywords are returned in this format:
```typescript
interface TrendingKeyword {
  keyword: string          // The trending term
  searches: number         // Approximate search volume
  trending: 'up' | 'stable' | 'down'  // Trend direction
  volume: number          // Search volume from API
  difficulty: number      // Estimated difficulty (0-100)
  trend_percentage: number // Growth percentage
  source: string         // Source name (google, twitter, etc.)
}
```

## API Rate Limits

Each API has different rate limits:

| API | Rate Limit | Requests |
|-----|-----------|----------|
| Google | ~100/min | No official limit |
| Bing | 7,000/month | Basic plan |
| Yandex | 100/day | Free tier |
| Baidu | 1,000/day | Standard |
| Naver | 100,000/month | API key based |
| Twitter | Varies by tier | Auth required |
| YouTube | 10,000/day | Quota system |
| TikTok | Limited | Not officially supported |
| Instagram | 200/hour | Business account |
| Pinterest | 1,000/day | API key based |
| Reddit | Unlim (no auth) | 60/min (public) |

## Testing API Integration

To test a specific source:
```bash
# Start the backend server
npm run dev

# Make a request to any trending endpoint
curl "http://localhost:5000/api/trending?source=twitter&limit=10"
```

## Troubleshooting

### API Key Not Working
- Verify key is correctly set in `.env`
- Check API credentials haven't expired
- Ensure key has necessary permissions

### "API key not configured" Warning
- This is normal if you haven't set that API's credentials
- The system will gracefully return empty results
- Configure the key in `.env` to enable that source

### Rate Limit Errors
- Implement caching to reduce API calls
- Use Redis queue for background syncing
- Spread requests across time periods

## Future Improvements

1. **Caching Layer**: Store results in Redis to reduce API calls
2. **Queue System**: Use Bull queue for async API updates
3. **Fallback Sources**: Implement secondary APIs for reliability
4. **Data Enrichment**: Add difficulty scoring from your analytics database
5. **Geographic Variations**: Support multiple regions per source
