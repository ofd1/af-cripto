-- Tabela de notícias (todas as fontes convergem aqui)
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  url TEXT UNIQUE,
  source_name VARCHAR(255),
  source_type VARCHAR(50) NOT NULL,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_source_type ON news(source_type);
CREATE INDEX IF NOT EXISTS idx_news_tags ON news USING GIN(tags);

-- Resumos diários gerados pela IA
CREATE TABLE IF NOT EXISTS daily_summaries (
  id SERIAL PRIMARY KEY,
  summary_date DATE UNIQUE NOT NULL,
  content TEXT NOT NULL,
  model_used VARCHAR(50),
  news_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Alertas de preço BTC
CREATE TABLE IF NOT EXISTS price_alerts (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  target_price DECIMAL(12,2) NOT NULL,
  direction VARCHAR(10) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMP,
  email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_active ON price_alerts(is_active) WHERE is_active = true;

-- Histórico de preço BTC (para sparkline)
CREATE TABLE IF NOT EXISTS btc_price_history (
  id SERIAL PRIMARY KEY,
  price_usd DECIMAL(12,2) NOT NULL,
  price_brl DECIMAL(12,2),
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Assinantes da newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  frequency VARCHAR(10) NOT NULL DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly')),
  is_active BOOLEAN DEFAULT true,
  unsubscribe_token VARCHAR(64) NOT NULL,
  confirmed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscribers_active ON newsletter_subscribers(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_subscribers_frequency ON newsletter_subscribers(frequency);
CREATE INDEX IF NOT EXISTS idx_subscribers_token ON newsletter_subscribers(unsubscribe_token);

-- Edições da newsletter (histórico)
CREATE TABLE IF NOT EXISTS newsletter_editions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content_html TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  edition_date DATE NOT NULL,
  sent_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
