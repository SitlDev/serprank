# API Keys Setup Guide

Complete instructions for obtaining API keys for all 11 trending sources.

---

## 1. **Google Trends** 🔍

### Prerequisites
- Google Cloud Project
- Billing enabled on the project

### Steps
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the **Trends API** (if available) or use **google-trends-api** npm package (already included)
4. Create a service account:
   - Go to **IAM & Admin** > **Service Accounts**
   - Click **Create Service Account**
   - Grant necessary permissions
   - Download JSON key
5. Set environment variable or use the npm package directly

### Environment Variable
```env
# No specific API key needed - uses google-trends-api package
# Already configured in package.json
```

---

## 2. **Bing Search** 🔵

### Prerequisites
- Microsoft Azure account
- Credit card for billing

### Steps
1. Go to [Azure Portal](https://portal.azure.com/)
2. Click **Create a resource**
3. Search for **Bing Search v7**
4. Click **Create**
5. Fill in the details:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or select existing
   - **Pricing Tier**: Free (up to 1K calls/month) or Standard
6. Click **Create**
7. Go to **Keys and Endpoint**
8. Copy **Key 1** or **Key 2**

### Environment Variable
```env
BING_SEARCH_API_KEY=your_key_here
```

---

## 3. **Yandex** 🔶 (Russia)

### Prerequisites
- Yandex account
- Yandex Webmaster account

### Steps
1. Go to [Yandex Webmaster](https://webmaster.yandex.com/)
2. Sign in with your Yandex account
3. Add your site or use existing
4. Go to **API** section in left menu
5. Create new app/token:
   - Click **Get token**
   - Accept terms
   - Copy the token
6. Save for later use in API calls

### Environment Variable
```env
YANDEX_API_KEY=your_yandex_token
```

### API Documentation
- [Yandex Wordstat API](https://yandex.com/dev/direct/)
- Region code for Russia: `225`

---

## 4. **Baidu** 🔍 (China)

### Prerequisites
- Baidu account
- Real-name verification (may be required)

### Steps
1. Go to [Baidu Index](https://index.baidu.com/)
2. Sign in or create account
3. Go to **API Documentation** or **开发者中心** (Developer Center)
4. Create application:
   - Go to **应用管理** (App Management)
   - Click **创建应用** (Create App)
   - Fill in app details
5. Get your **API Key** and **Secret Key**
6. Baidu Index API endpoint: `https://api.baidu.com/api.php`

### Environment Variable
```env
BAIDU_API_KEY=your_baidu_api_key
```

### API Documentation
- [Baidu Index API Docs](https://index.baidu.com/doc)

---

## 5. **Naver** 🟢 (Korea)

### Prerequisites
- Naver developer account
- Naver application registered

### Steps
1. Go to [Naver Developers](https://developers.naver.com/)
2. Sign in or create account
3. Go to **My Page** or **Application**
4. Register new application:
   - Click **Application Registration**
   - Fill in application details
   - Select **SEO Tool** or **Analytics Tool** as service type
5. Accept terms and register
6. Go to **Application Settings**
7. Copy **Client ID** and **Client Secret**
8. Note: May require email verification

### Environment Variable
```env
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```

### API Documentation
- [Naver Datalab API](https://developers.naver.com/docs/datalab/overview/)
- Endpoint: `https://openapi.naver.com/v1/datalab/search`

---

## 6. **Pinterest** 📌

### Prerequisites
- Pinterest account
- Pinterest Business account (recommended)

### Steps
1. Go to [Pinterest Developers](https://developers.pinterest.com/)
2. Sign in with your Pinterest account
3. Create new app:
   - Click **Create app**
   - Fill in app name and details
   - Accept terms
4. Go to **Settings** > **App ID** section
5. Generate **Access Token**:
   - Click **Generate Token**
   - Grant necessary permissions (read_public_data, read_pins)
   - Copy the token
6. Tokens are valid for 1 year and can be refreshed

### Environment Variable
```env
PINTEREST_ACCESS_TOKEN=your_pinterest_access_token
```

### API Documentation
- [Pinterest API Documentation](https://developers.pinterest.com/docs/api/overview/)
- Endpoint: `https://api.pinterest.com/v1/me/search/pins`

---

## 7. **YouTube** ▶️

### Prerequisites
- Google Cloud Project
- YouTube Data API v3 enabled
- Billing enabled

### Steps
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable **YouTube Data API v3**:
   - Go to **APIs & Services** > **Library**
   - Search for "YouTube Data API v3"
   - Click **Enable**
4. Create API key:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **API Key**
   - Copy the key
5. Restrict the key (optional but recommended):
   - Restrict to YouTube Data API v3
   - Restrict to IP addresses if needed

### Environment Variable
```env
YOUTUBE_API_KEY=your_youtube_api_key
```

### API Documentation
- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- Free quota: 10,000 units per day

---

## 8. **TikTok** 🎵

### Prerequisites
- TikTok account
- TikTok Developer Portal access
- Approved for API access (may take time)

### Steps
1. Go to [TikTok Developers](https://developers.tiktok.com/)
2. Sign in or create account
3. Create new app:
   - Go to **My Apps**
   - Click **Create an app**
   - Fill in app details and select app type
4. Wait for TikTok approval (24-48 hours typical)
5. Once approved, get your credentials:
   - **Client Key** (API Key)
   - **Client Secret**
6. Request API access for specific endpoints
7. Get **Access Token** via OAuth flow

### Environment Variable
```env
TIKTOK_API_KEY=your_tiktok_client_key
TIKTOK_API_SECRET=your_tiktok_client_secret
```

### API Documentation
- [TikTok API Documentation](https://developers.tiktok.com/doc)
- Endpoint: `https://open.tiktok.com/v1/video/search/`
- Note: TikTok API access is restricted and requires approval

---

## 9. **Instagram** 📷

### Prerequisites
- Facebook Developer Account
- Instagram Business Account
- Meta App created

### Steps
1. Go to [Meta Developers](https://developers.facebook.com/)
2. Create or select existing app
3. Add **Instagram Graph API** product
4. Create Instagram app:
   - Go to **Settings** > **Basic**
   - Add **App ID** and **App Secret**
5. Get **Business Account Access Token**:
   - Go to **Instagram Basic Display** or **Instagram Graph API**
   - Generate long-lived access token
6. Note your **Instagram Business Account ID**

### Environment Variable
```env
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id
```

### API Documentation
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- Endpoint: `https://graph.instagram.com/v18.0/{ig-user-id}/ig_hashtag_search`

---

## 10. **Twitter/X** 𝕏

### Prerequisites
- Twitter/X Developer Account
- Approved developer access
- Project created

### Steps
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Sign in with your Twitter/X account
3. Create new app:
   - Go to **Projects & Apps**
   - Click **Create App**
   - Fill in app name and details
4. Choose API access level:
   - **Free**: Limited (2M tweets/month)
   - **Pro/Business**: Higher limits
5. Generate keys:
   - Go to **Keys and Tokens** tab
   - Generate **API Key** (Consumer Key)
   - Generate **API Secret Key** (Consumer Secret)
   - Generate **Access Token** and **Access Token Secret**
   - Generate **Bearer Token**
6. Enable required permissions (Read and Search)

### Environment Variable
```env
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
```

### API Documentation
- [Twitter API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api)
- Endpoint: `https://api.twitter.com/2/trends/available`

---

## 11. **Reddit** 🔴

### Prerequisites
- Reddit account
- No special approval needed (public API)

### Steps
1. Go to [Reddit Apps](https://www.reddit.com/prefs/apps)
2. Scroll to bottom - **Developed Applications**
3. Click **Create App** or **Create Another App**
4. Fill in details:
   - **Name**: Your app name
   - **App type**: Select "script"
   - **Redirect URI**: `http://localhost:8000` (for testing)
   - **Description**: Optional
5. Click **Create app**
6. Copy your credentials:
   - **Client ID** (under app name)
   - **Client Secret** (shown after creation)
7. Reddit API doesn't require authentication for public data, but register for better rate limits

### Environment Variable
```env
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
```

### API Documentation
- [Reddit API Documentation](https://www.reddit.com/dev/api)
- Endpoint: `https://www.reddit.com/r/{subreddit}/trending.json` (public, no auth)

---

## Setup Instructions

### 1. Create `.env` File
```bash
cp backend/.env.example backend/.env
```

### 2. Fill in All API Keys
Edit `backend/.env` and add all credentials:

```env
# Search Engines
BING_SEARCH_API_KEY=xxx
YANDEX_API_KEY=xxx
BAIDU_API_KEY=xxx
NAVER_CLIENT_ID=xxx
NAVER_CLIENT_SECRET=xxx

# Video & Content
YOUTUBE_API_KEY=xxx
TIKTOK_API_KEY=xxx

# Social Media
TWITTER_API_KEY=xxx
TWITTER_API_SECRET=xxx
TWITTER_ACCESS_TOKEN=xxx
TWITTER_ACCESS_TOKEN_SECRET=xxx
TWITTER_BEARER_TOKEN=xxx

INSTAGRAM_ACCESS_TOKEN=xxx
INSTAGRAM_BUSINESS_ACCOUNT_ID=xxx

REDDIT_CLIENT_ID=xxx
REDDIT_CLIENT_SECRET=xxx

# E-commerce
PINTEREST_ACCESS_TOKEN=xxx
```

### 3. Test Configuration
```bash
cd backend
npm run dev
```

### 4. Test Each API
```bash
# Test a specific source
curl "http://localhost:3000/api/trending?source=bing&limit=10"
curl "http://localhost:3000/api/trending?source=youtube&limit=10"
```

---

## Security Tips

✅ **Do's:**
- Store keys in `.env` file (never commit to git)
- Add `.env` to `.gitignore` ✓ (already done)
- Rotate keys regularly
- Use separate apps for development/production
- Restrict API keys by IP if possible
- Use environment-specific keys

❌ **Don'ts:**
- Don't commit `.env` to version control
- Don't share keys via chat/email
- Don't use same key for multiple apps
- Don't hardcode keys in source code
- Don't expose keys in frontend code

---

## Rate Limits Summary

| Service | Free Tier | Limit Type |
|---------|-----------|-----------|
| Google Trends | Unlimited | Via npm package |
| Bing | 3 calls/sec | Per subscription |
| Yandex | Varies | Per token |
| Baidu | Varies | Per app |
| Naver | 100/day | Per IP |
| Pinterest | 200 calls/day | Per token |
| YouTube | 10,000 units/day | Per key |
| TikTok | Varies | Per approval |
| Instagram | 200 calls/day | Per token |
| Twitter | 300/15min (Free) | Per endpoint |
| Reddit | 60 requests/min | Public |

---

## Troubleshooting

### "Invalid API Key" Error
- Check the key is copied correctly (no extra spaces)
- Verify the key is active in the provider's dashboard
- Check if the key has required permissions enabled
- Confirm the key is for the correct API (not different product)

### Rate Limit Errors
- Check your usage in the provider's dashboard
- Wait before retrying
- Consider upgrading to paid tier
- Implement caching in your app

### CORS/Network Errors
- Verify API endpoint is correct
- Check if your IP is whitelisted (if required)
- Ensure backend has CORS headers set
- Test endpoint directly via `curl` or Postman

### Authentication Failures
- Verify token/key is still valid (may expire)
- Check required headers are set (Authorization, etc.)
- Confirm OAuth flow is complete (if applicable)
- Regenerate token if old

---

## Support Resources

- **General**: [Developer Documentation Guide](https://developers.google.com)
- **Backend Env Issues**: Check `backend/.env.example` for variable names
- **API Testing**: Use Postman or curl to test endpoints
- **Logs**: Check `backend/logs/` for debugging information

---

**Last Updated:** April 20, 2026

For questions or issues, refer to each service's official documentation or contact their developer support.
