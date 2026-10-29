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

-- Content & digital quotation requests (Cloudflare Pages D1 binding: DB).
CREATE TABLE IF NOT EXISTS quote_requests (
  reference TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL,
  platforms_json TEXT NOT NULL DEFAULT '[]',
  project_date TEXT NOT NULL,
  location TEXT NOT NULL,
  budget TEXT NOT NULL,
  brief TEXT NOT NULL,
  consent INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_quote_requests_email_created ON quote_requests(email,created_at);

-- Photography & videography enquiries. These are booking REQUESTS, not paid or confirmed bookings.
-- Reference images are stored in a private R2 bucket named by MEDIA_UPLOADS binding when enabled.
CREATE TABLE IF NOT EXISTS media_booking_requests (
  reference TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business TEXT NOT NULL DEFAULT '',
  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date TEXT NOT NULL,
  location TEXT NOT NULL,
  attendance INTEGER,
  coverage TEXT NOT NULL,
  services_json TEXT NOT NULL,
  style TEXT NOT NULL DEFAULT '',
  budget_kes INTEGER,
  notes TEXT NOT NULL DEFAULT '',
  reference_url TEXT NOT NULL DEFAULT '',
  reference_files_json TEXT NOT NULL DEFAULT '[]',
  duration TEXT NOT NULL,
  payment_preference TEXT NOT NULL,
  consent INTEGER NOT NULL DEFAULT 1,
  payment_status TEXT NOT NULL DEFAULT 'not_paid',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_media_bookings_email_created ON media_booking_requests(email,created_at);


-- Drone service booking enquiries (requests only; no payment is taken).
CREATE TABLE IF NOT EXISTS drone_booking_requests (
  reference TEXT PRIMARY KEY,
  project_name TEXT NOT NULL,
  service TEXT NOT NULL,
  package_name TEXT NOT NULL,
  event_date TEXT NOT NULL,
  location TEXT NOT NULL,
  duration TEXT NOT NULL,
  budget_kes INTEGER,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  description TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  special_requests TEXT NOT NULL DEFAULT '',
  delivery TEXT NOT NULL,
  payment_preference TEXT NOT NULL,
  consent INTEGER NOT NULL DEFAULT 1,
  payment_status TEXT NOT NULL DEFAULT 'not_paid',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_drone_booking_email_date ON drone_booking_requests(email, created_at);
