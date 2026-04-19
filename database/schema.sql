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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_keyword (keyword)
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_keyword_position (keyword_id, position)
);

-- SERP features table
CREATE TABLE serp_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serp_result_id UUID REFERENCES serp_results(id) ON DELETE CASCADE,
  feature_type VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_feature_type (feature_type)
);

-- Weaknesses detected table
CREATE TABLE detected_weaknesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serp_result_id UUID REFERENCES serp_results(id) ON DELETE CASCADE,
  weakness_type VARCHAR(100) NOT NULL,
  severity VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_weakness_type (weakness_type)
);

-- Domain scores cache table
CREATE TABLE domain_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain VARCHAR(255) UNIQUE NOT NULL,
  score INT,
  backlinks INT,
  referring_domains INT,
  trust_score INT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_domain (domain)
);

-- User analyses history
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  analysis_type VARCHAR(50) NOT NULL,
  keywords_analyzed INT,
  credits_used INT,
  results JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_created (user_id, created_at)
);

-- Research collections
CREATE TABLE research_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  keyword_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id)
);

-- Collection keywords (many-to-many)
CREATE TABLE collection_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES research_collections(id) ON DELETE CASCADE,
  keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(collection_id, keyword_id)
);

-- Create indexes for performance
CREATE INDEX idx_keywords_created ON keywords(created_at);
CREATE INDEX idx_serp_results_created ON serp_results(created_at);
CREATE INDEX idx_analyses_created ON analyses(created_at);
CREATE INDEX idx_collections_created ON research_collections(created_at);
