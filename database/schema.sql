-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  plan VARCHAR(50) DEFAULT 'starter',
  credits INT DEFAULT 1000,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Keywords table
CREATE TABLE keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword VARCHAR(500) NOT NULL,
  search_volume INT,
  difficulty_score INT,
  keyword_score INT,
  estimated_traffic INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SERP results table
CREATE TABLE serp_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
  position INT NOT NULL,
  url VARCHAR(1000) NOT NULL,
  title VARCHAR(500),
  description TEXT,
  domain VARCHAR(255),
  domain_score INT,
  page_score INT,
  spam_score INT,
  page_speed FLOAT,
  is_https BOOLEAN,
  has_canonical BOOLEAN,
  last_updated TIMESTAMP,
  content_age_days INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SERP features table
CREATE TABLE serp_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serp_result_id UUID REFERENCES serp_results(id) ON DELETE CASCADE,
  feature_type VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weaknesses detected table
CREATE TABLE detected_weaknesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serp_result_id UUID REFERENCES serp_results(id) ON DELETE CASCADE,
  weakness_type VARCHAR(100) NOT NULL,
  severity VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Domain scores cache table
CREATE TABLE domain_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain VARCHAR(255) UNIQUE NOT NULL,
  score INT,
  backlinks INT,
  referring_domains INT,
  trust_score INT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User analyses history
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  analysis_type VARCHAR(50) NOT NULL,
  keywords_analyzed INT,
  credits_used INT,
  results JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Research collections
CREATE TABLE research_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  keyword_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Collection keywords (many-to-many)
CREATE TABLE collection_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES research_collections(id) ON DELETE CASCADE,
  keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(collection_id, keyword_id)
);

-- User settings for dashboard customization
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  show_traffic_potential BOOLEAN DEFAULT TRUE,
  show_position_breakdown BOOLEAN DEFAULT TRUE,
  show_competitive_gaps BOOLEAN DEFAULT TRUE,
  show_entry_difficulty BOOLEAN DEFAULT TRUE,
  show_market_saturation BOOLEAN DEFAULT FALSE,
  show_serp_features BOOLEAN DEFAULT FALSE,
  show_roi_potential BOOLEAN DEFAULT TRUE,
  show_trend_analysis BOOLEAN DEFAULT TRUE,
  show_keyword_clusters BOOLEAN DEFAULT FALSE,
  show_opportunity_matrix BOOLEAN DEFAULT FALSE,
  show_search_volume_trend BOOLEAN DEFAULT TRUE,
  show_ranking_progress BOOLEAN DEFAULT TRUE,
  show_traffic_chart BOOLEAN DEFAULT TRUE,
  show_difficulty_trend BOOLEAN DEFAULT FALSE,
  show_competition_intensity BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_keyword ON keywords(keyword);
CREATE INDEX idx_keywords_created ON keywords(created_at);
CREATE INDEX idx_keyword_position ON serp_results(keyword_id, position);
CREATE INDEX idx_serp_results_created ON serp_results(created_at);
CREATE INDEX idx_feature_type ON serp_features(feature_type);
CREATE INDEX idx_weakness_type ON detected_weaknesses(weakness_type);
CREATE INDEX idx_domain ON domain_scores(domain);
CREATE INDEX idx_user_created ON analyses(user_id, created_at);
CREATE INDEX idx_user_id ON research_collections(user_id);
CREATE INDEX idx_analyses_created ON analyses(created_at);
CREATE INDEX idx_collections_created ON research_collections(created_at);

-- Historical tracking tables for trend analysis
CREATE TABLE keyword_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  search_volume INT,
  difficulty_score INT,
  keyword_score INT,
  opportunity_score INT,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ranking_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  position INT,
  estimated_traffic INT,
  domain_url VARCHAR(1000),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE traffic_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  estimated_monthly_visitors INT,
  position INT,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE competition_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  avg_domain_authority INT,
  avg_backlinks INT,
  avg_page_speed FLOAT,
  top_10_count INT,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for historical data queries
CREATE INDEX idx_keyword_history_keyword ON keyword_history(keyword_id, recorded_at);
CREATE INDEX idx_keyword_history_user ON keyword_history(user_id, recorded_at);
CREATE INDEX idx_ranking_history_keyword ON ranking_history(keyword_id, recorded_at);
CREATE INDEX idx_ranking_history_user ON ranking_history(user_id, recorded_at);
CREATE INDEX idx_traffic_history_keyword ON traffic_history(keyword_id, recorded_at);
CREATE INDEX idx_traffic_history_user ON traffic_history(user_id, recorded_at);
CREATE INDEX idx_competition_history_keyword ON competition_history(keyword_id, recorded_at);
CREATE INDEX idx_competition_history_user ON competition_history(user_id, recorded_at);

-- Trending sources table
CREATE TABLE trending_sources (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(100),
  description VARCHAR(255),
  category VARCHAR(50),
  coming_soon BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed trending sources (search engines, social media, and commerce only)
INSERT INTO trending_sources (id, name, icon, description, category, coming_soon) VALUES
  ('google', 'Google', '🔍', 'Trending searches from Google Search', 'search-engine', FALSE),
  ('bing', 'Bing', '🔵', 'Trending searches from Bing Search', 'search-engine', FALSE),
  ('yandex', 'Yandex', '🔶', 'Trending searches from Yandex (Russia)', 'search-engine', FALSE),
  ('baidu', 'Baidu', '🔍', 'Trending searches from Baidu (China)', 'search-engine', FALSE),
  ('naver', 'Naver', '🟢', 'Trending searches from Naver (Korea)', 'search-engine', FALSE),
  ('pinterest', 'Pinterest', '📌', 'Trending pins and searches from Pinterest', 'social-commerce', FALSE),
  ('youtube', 'YouTube', '▶️', 'Trending videos and searches from YouTube', 'video', FALSE),
  ('tiktok', 'TikTok', '🎵', 'Trending sounds and searches from TikTok', 'short-video', FALSE),
  ('instagram', 'Instagram', '📷', 'Trending hashtags and searches from Instagram', 'social', FALSE),
  ('twitter', 'Twitter', '𝕏', 'Trending topics and searches from Twitter/X', 'social', FALSE),
  ('reddit', 'Reddit', '🔴', 'Trending topics and searches from Reddit', 'community', FALSE);
