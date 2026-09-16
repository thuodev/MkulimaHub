-- MkulimaHub database schema
-- Run against a fresh PostgreSQL database (e.g. `createdb mkulimahub`, or via a GUI tool)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- People & access
-- ============================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  account_type VARCHAR(20) NOT NULL DEFAULT 'self_registered', -- 'self_registered' or 'invited'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  location VARCHAR(150),
  total_size NUMERIC(10, 2),
  size_unit VARCHAR(20) DEFAULT 'acres',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE farm_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'manager', 'worker')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, farm_id)
);

-- ============================================================
-- Land
-- ============================================================

CREATE TABLE fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  size NUMERIC(10, 2),
  size_unit VARCHAR(20) DEFAULT 'acres',
  current_crop VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Inputs (seed, fertilizer, pesticide, feed, etc.)
-- ============================================================

CREATE TABLE input_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE inputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  category_id UUID REFERENCES input_categories(id),
  name VARCHAR(100) NOT NULL,
  unit_of_measure VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE input_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  input_id UUID NOT NULL REFERENCES inputs(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  field_id UUID REFERENCES fields(id) ON DELETE SET NULL,
  type VARCHAR(3) NOT NULL CHECK (type IN ('in', 'out')),
  quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
  cost NUMERIC(10, 2),
  transaction_date DATE DEFAULT CURRENT_DATE,
  notes TEXT
);

-- ============================================================
-- Stock / general inventory
-- ============================================================

CREATE TABLE stock_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  unit_of_measure VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_item_id UUID NOT NULL REFERENCES stock_items(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  type VARCHAR(3) NOT NULL CHECK (type IN ('in', 'out')),
  quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
  reason TEXT,
  movement_date DATE DEFAULT CURRENT_DATE
);

-- ============================================================
-- Livestock
-- ============================================================

CREATE TABLE livestock_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  field_id UUID REFERENCES fields(id) ON DELETE SET NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('individual', 'batch')),
  species VARCHAR(50) NOT NULL,
  tag_id VARCHAR(50),
  birth_date DATE,
  sex VARCHAR(10) CHECK (sex IN ('male', 'female') OR sex IS NULL),
  quantity INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  CHECK (
    (type = 'individual' AND quantity IS NULL) OR
    (type = 'batch' AND tag_id IS NULL AND sex IS NULL)
  )
);

CREATE TABLE livestock_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  livestock_record_id UUID NOT NULL REFERENCES livestock_records(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  event_type VARCHAR(20) NOT NULL CHECK (
    event_type IN ('birth', 'death', 'sale', 'purchase', 'vet_visit', 'weight_check', 'quantity_adjustment')
  ),
  event_date DATE DEFAULT CURRENT_DATE,
  quantity_change INTEGER,
  weight NUMERIC(10, 2),
  value NUMERIC(10, 2),
  notes TEXT
);

-- ============================================================
-- Password reset
-- ============================================================

CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token UUID NOT NULL DEFAULT gen_random_uuid(),
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Seed data
-- ============================================================

INSERT INTO input_categories (name) VALUES
  ('seed'), ('fertilizer'), ('pesticide'), ('feed'), ('other');