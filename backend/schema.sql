-- MkulimaHub database schema
-- Run against a fresh PostgreSQL database (e.g. `createdb mkulimahub`, or via a GUI tool)

-- ============================================================
-- People & access
-- ============================================================

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE farms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(150),
  total_size NUMERIC(10, 2),
  size_unit VARCHAR(20) DEFAULT 'acres',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE farm_members (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  farm_id INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'manager', 'worker')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, farm_id)
);

-- ============================================================
-- Land
-- ============================================================

CREATE TABLE fields (
  id SERIAL PRIMARY KEY,
  farm_id INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
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
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE inputs (
  id SERIAL PRIMARY KEY,
  farm_id INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES input_categories(id),
  name VARCHAR(100) NOT NULL,
  unit_of_measure VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE input_transactions (
  id SERIAL PRIMARY KEY,
  input_id INTEGER NOT NULL REFERENCES inputs(id) ON DELETE CASCADE,
  farm_id INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  field_id INTEGER REFERENCES fields(id) ON DELETE SET NULL,
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
  id SERIAL PRIMARY KEY,
  farm_id INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  unit_of_measure VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE stock_movements (
  id SERIAL PRIMARY KEY,
  stock_item_id INTEGER NOT NULL REFERENCES stock_items(id) ON DELETE CASCADE,
  farm_id INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  type VARCHAR(3) NOT NULL CHECK (type IN ('in', 'out')),
  quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
  reason TEXT,
  movement_date DATE DEFAULT CURRENT_DATE
);

-- ============================================================
-- Livestock
-- ============================================================

CREATE TABLE livestock_records (
  id SERIAL PRIMARY KEY,
  farm_id INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  field_id INTEGER REFERENCES fields(id) ON DELETE SET NULL,
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
  id SERIAL PRIMARY KEY,
  livestock_record_id INTEGER NOT NULL REFERENCES livestock_records(id) ON DELETE CASCADE,
  farm_id INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
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
-- Seed data
-- ============================================================

INSERT INTO input_categories (name) VALUES
  ('seed'), ('fertilizer'), ('pesticide'), ('feed'), ('other');
