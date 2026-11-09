-- HIT KENYA venue registrations. Apply to the D1 DB before enabling the venue form.
-- Identity files are stored in PRIVATE R2 under VENUE_UPLOADS; never expose object keys publicly.
CREATE TABLE IF NOT EXISTS venue_applications (
  reference TEXT PRIMARY KEY,
  venue_name TEXT NOT NULL,
  category TEXT NOT NULL,
  county TEXT NOT NULL,
  town TEXT NOT NULL,
  description TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  facilities_json TEXT NOT NULL DEFAULT '[]',
  price_kes INTEGER NOT NULL,
  pricing_unit TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  files_json TEXT NOT NULL DEFAULT '[]',
  consent INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending_review',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_venue_applications_email_date ON venue_applications(email,created_at);
CREATE INDEX IF NOT EXISTS idx_venue_applications_status_date ON venue_applications(status,created_at);
