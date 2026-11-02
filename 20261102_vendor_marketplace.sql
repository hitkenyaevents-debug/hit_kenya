-- Run on your existing Cloudflare D1 database before enabling the public directory.
-- Keep vendor_applications private. Only manually approved profiles go public.
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
