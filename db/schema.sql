-- Deploy once in Cloudflare D1 before enabling checkout.
CREATE TABLE IF NOT EXISTS orders (
  reference TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK(status IN ('pending','initialization_failed','paid','refunded','cancelled','review_required')),
  email TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  county TEXT NOT NULL,
  town TEXT NOT NULL,
  address TEXT NOT NULL,
  zone TEXT NOT NULL,
  items_json TEXT NOT NULL,
  subtotal_cents INTEGER NOT NULL,
  delivery_cents INTEGER NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  paystack_transaction_id TEXT,
  payment_channel TEXT,
  paid_at TEXT,
  fulfilled_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status,created_at);


-- Marketing brief submissions (Cloudflare Pages D1 binding: DB).
-- Personally identifiable information: restrict dashboard access to authorized administrators.
CREATE TABLE IF NOT EXISTS marketing_requests (
  reference TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  promotion_type TEXT NOT NULL,
  campaign_date TEXT NOT NULL,
  location TEXT NOT NULL,
  budget TEXT NOT NULL,
  goal TEXT NOT NULL,
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_marketing_requests_created ON marketing_requests(created_at);
