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
