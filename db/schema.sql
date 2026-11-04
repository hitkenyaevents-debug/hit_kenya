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

-- Brand and Social Content quote enquiries (no charges or confirmed bookings).
CREATE TABLE IF NOT EXISTS content_requests (
 reference TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 email TEXT NOT NULL,
 phone TEXT NOT NULL,
 business TEXT NOT NULL,
 content_type TEXT NOT NULL,
 details TEXT NOT NULL,
 preferred_date TEXT NOT NULL,
 budget TEXT NOT NULL DEFAULT '',
 consent INTEGER NOT NULL DEFAULT 1,
 status TEXT NOT NULL DEFAULT 'new',
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_content_requests_email_date ON content_requests(email,created_at);

-- HIT KENYA vendor applications. Listings are private pending manual review.
-- Product/gallery images are stored privately in R2 (VENDOR_UPLOADS binding) if attached.
CREATE TABLE IF NOT EXISTS vendor_applications (
  reference TEXT PRIMARY KEY,
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  county TEXT NOT NULL,
  town TEXT NOT NULL,
  business_type TEXT NOT NULL,
  description TEXT NOT NULL,
  categories_json TEXT NOT NULL,
  products_json TEXT NOT NULL,
  services_json TEXT NOT NULL,
  images_json TEXT NOT NULL DEFAULT '[]',
  consent INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending_review',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_vendor_applications_created ON vendor_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_vendor_applications_email_created ON vendor_applications(email, created_at);

-- Private event-organiser vendor management enquiries. Not confirmed bookings.
-- Optional supporting documents are private R2 objects (VENDOR_MANAGEMENT_UPLOADS).
CREATE TABLE IF NOT EXISTS vendor_management_requests (
 reference TEXT PRIMARY KEY,
 full_name TEXT NOT NULL,
 organisation TEXT NOT NULL DEFAULT '',
 email TEXT NOT NULL,
 phone TEXT NOT NULL,
 event_name TEXT NOT NULL,
 event_type TEXT NOT NULL,
 event_date TEXT NOT NULL,
 alternative_date TEXT NOT NULL DEFAULT '',
 event_location TEXT NOT NULL,
 attendance TEXT NOT NULL,
 categories_json TEXT NOT NULL,
 other_category TEXT NOT NULL DEFAULT '',
 vendor_count TEXT NOT NULL,
 package_name TEXT NOT NULL,
 budget TEXT NOT NULL,
 fee_included TEXT NOT NULL,
 vendor_status TEXT NOT NULL,
 notes TEXT NOT NULL DEFAULT '',
 document_key TEXT NOT NULL DEFAULT '',
 consent INTEGER NOT NULL DEFAULT 0,
 status TEXT NOT NULL DEFAULT 'pending_review',
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_vendor_management_email_date ON vendor_management_requests(email, created_at);

-- HIT KENYA VERIFIED VENDOR MARKETPLACE
-- Public listings must be created ONLY after manual verification and explicit publication.
-- Never expose private application details or uploaded identity documents in this table.
CREATE TABLE IF NOT EXISTS vendor_public_profiles (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 display_name TEXT NOT NULL,
 category TEXT NOT NULL CHECK(category IN ('Food & Catering','Fashion & Beauty','Events & Equipment','Product Supply','Professional Services','Other Services')),
 county TEXT NOT NULL,
 town TEXT NOT NULL,
 description TEXT NOT NULL,
 services_json TEXT NOT NULL DEFAULT '[]',
 cover_url TEXT NOT NULL DEFAULT '',
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','suspended')),
 public_enabled INTEGER NOT NULL DEFAULT 0 CHECK(public_enabled IN (0,1)),
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_public_vendor_discovery ON vendor_public_profiles(status,public_enabled,category,county);

-- Customer requests for individually approved vendors; never charged or automatically confirmed.
CREATE TABLE IF NOT EXISTS vendor_booking_enquiries (
 reference TEXT PRIMARY KEY,
 vendor_id INTEGER NOT NULL REFERENCES vendor_public_profiles(id),
 customer_name TEXT NOT NULL,
 email TEXT NOT NULL,
 phone TEXT NOT NULL,
 event_date TEXT NOT NULL,
 event_location TEXT NOT NULL,
 details TEXT NOT NULL,
 consent INTEGER NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending_review',
 payment_status TEXT NOT NULL DEFAULT 'not_paid',
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_vendor_enquiries_email_created ON vendor_booking_enquiries(email,created_at);

-- Private artist applications, never published automatically.
CREATE TABLE IF NOT EXISTS artist_applications (
 reference TEXT PRIMARY KEY,
 stage_name TEXT NOT NULL,
 legal_name TEXT NOT NULL,
 category TEXT NOT NULL,
 email TEXT NOT NULL,
 phone TEXT NOT NULL,
 county TEXT NOT NULL,
 languages TEXT NOT NULL,
 bio TEXT NOT NULL,
 years_experience TEXT NOT NULL,
 fee_range TEXT NOT NULL,
 availability TEXT NOT NULL,
 genres_json TEXT NOT NULL,
 links_json TEXT NOT NULL,
 socials_json TEXT NOT NULL,
 additional_info TEXT NOT NULL DEFAULT '',
 files_json TEXT NOT NULL DEFAULT '[]',
 consent INTEGER NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending_review',
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_artist_applications_created ON artist_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_artist_applications_email ON artist_applications(email,created_at);
