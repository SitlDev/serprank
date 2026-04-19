# Serper.dev Integration Guide

## Setup

### 1. Get API Key
1. Go to https://serper.dev
2. Sign up (free account)
3. Go to dashboard and copy your API key
4. You get 100 free searches/month

### 2. Add to Environment Variables

**Local Development:**
```bash
# backend/.env
SERPER_API_KEY=your-api-key-here
```

**Railway Production:**
1. Go to Railway dashboard → serprank → backend
2. Variables tab
3. New Variable:
   - Name: `SERPER_API_KEY`
   - Value: `your-api-key-here`

### 3. Test the Integration

**API Endpoint:**
```
GET /api/test/serp/{keyword}?limit=10
```

**Example:**
```bash
curl "http://localhost:3000/api/test/serp/best%20laptops?limit=10"
```

**Response:**
```json
{
  "keyword": "best laptops",
  "count": 10,
  "results": [
    {
      "position": 1,
      "url": "https://example.com/...",
      "title": "Best Laptops 2024",
      "description": "Top laptops reviewed...",
      "domain": "example.com",
      "displayUrl": "example.com/..."
    }
  ],
  "note": "✅ Using Serper.dev API"
}
```

## API Limits

**Free Tier:**
- 100 searches/month
- Perfect for MVP and testing

**Paid Plans:**
- Starter: $10/month → 500 searches
- Professional: $50/month → 10,000 searches

## Troubleshooting

### Getting mock data instead of real results
- Check if `SERPER_API_KEY` is set
- Check API key is correct
- Check API quota (100/month)

### API Key errors
```
Invalid API Key → Double-check the key in Serper.dev dashboard
Rate limit exceeded → You've used your monthly quota
```

## Next Steps

1. Integrate into main analysis endpoint
2. Store results in PostgreSQL
3. Build weakness detection algorithm
4. Calculate KeywordScore

## Documentation
- Serper.dev API Docs: https://serper.dev/api
- Google SERP Features: https://www.serper.dev/reference
