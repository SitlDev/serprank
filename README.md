# ClearSERP Clone

A comprehensive SERP analysis and keyword opportunity discovery platform that identifies weaknesses in search results to help SEOs find realistic ranking opportunities.

## Project Structure

```
ClearSERP-clone/
├── frontend/                 # React + TypeScript frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client services
│   │   ├── types/          # TypeScript interfaces
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
├── backend/                  # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Entry point
│   ├── package.json
│   └── tsconfig.json
├── database/
│   ├── migrations/         # Database migrations
│   └── schema.sql          # Initial schema
├── docker-compose.yml      # Docker services (PostgreSQL, Redis)
├── .gitignore
└── README.md
```

## Tech Stack

### Frontend
- React 18+
- TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- TanStack Query (data fetching)
- Recharts (data visualization)

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL (database)
- Redis (job queue, caching)
- Puppeteer (web scraping)
- Bull (background jobs)

### Data Sources
- Google SERP scraping
- Backlink analysis APIs
- Domain authority metrics
- Page metrics (speed, security, etc.)

## Key Features to Implement

### 1. SERP Weakness Detection
- Analyze top 10 organic results for 17+ weakness types
- Authority weaknesses (low domain score, no backlinks)
- Technical SEO weaknesses (speed, security, canonical)
- Content quality weaknesses (outdated, mismatch, intent)
- SERP composition analysis (UGC-heavy)

### 2. KeywordScore Algorithm
- Proprietary 0-100 metric
- Combines weaknesses, search volume, difficulty, authority
- Identifies opportunity level (exceptional, strong, moderate, challenging)

### 3. Research Modes
- **Keyword Research**: Discover variations with filtering
- **Domain Research**: Find keywords associated with domains
- **Competitor Research**: Analyze competitor keyword rankings
- **Gap Analysis**: Find ranking gaps between domains

### 4. Additional Features
- SERP feature detection (57+ types)
- Traffic estimates
- Bulk keyword analysis (1,000+ keywords)
- CSV export
- Research collections & history
- Real-time analysis with progress tracking

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use docker-compose)
- Redis (or use docker-compose)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd ClearSERP-clone
   ```

2. **Start database services**
   ```bash
   docker-compose up -d
   ```

3. **Setup backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run migrate
   npm run dev
   ```

4. **Setup frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000
   - API Docs: http://localhost:3000/api/docs

## Environment Variables

See `.env.example` files in both `frontend/` and `backend/` directories.

## Development

### Backend
```bash
cd backend
npm run dev       # Start development server
npm run build     # Build for production
npm run test      # Run tests
```

### Frontend
```bash
cd frontend
npm run dev       # Start dev server
npm run build     # Build for production
npm run test      # Run tests
```

## API Documentation

Key endpoints:
- `POST /api/keywords/research` - Perform keyword research
- `POST /api/keywords/analyze` - Analyze keyword SERP
- `POST /api/domains/analyze` - Analyze domain keywords
- `POST /api/competitors/research` - Analyze competitors
- `POST /api/keywords/gap-analysis` - Compare domains

## Database Schema

Key tables:
- `users` - User accounts
- `keywords` - Keyword data
- `serp_results` - Top 10 ranking results
- `domain_scores` - Domain authority metrics
- `analyses` - User analysis history
- `research_collections` - Saved keyword groups

## Contributing

1. Create a feature branch
2. Commit changes
3. Push to branch
4. Open a pull request

## License

MIT
