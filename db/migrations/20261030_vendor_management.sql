-- Idempotent migration: Vendor Management enquiries; non-paid and pending review.
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
