# HIT KENYA — Artist Registration update (4 November 2026)

## What has changed
- The Join as an Artist card's REGISTER AS AN ARTIST button in `index.html` now opens `artist-registration.html`, not the generic partner popup.
- `artist-registration.html` has three interactive screens: Artist Details, Media & Genres, and Review & Submit. Fields remain editable, and the review page displays only the applicant's information.
- Files are private until HIT KENYA reviews them. The page uses a licensed real stock-photo URL from Dwayne joe / Unsplash as its hero, with a bundled local fallback. This photo is illustrative and does not depict a verified HIT KENYA artist.
- No payment is charged. Applications are not approved or published automatically.

## GitHub upload (smallest option)
Unzip `HIT-KENYA-ARTIST-REGISTRATION-PATCH.zip` and upload the extracted contents into the root of your **existing** website repository. It contains a corrected `index.html`, `artist-registration.html`, the new Cloudflare function and SQL schema, plus one existing local image fallback. Retain your previously uploaded site images and all other files.

## Full website upload
Unzip `HIT-KENYA-ARTIST-REGISTRATION-COMPLETE-LIGHT.zip` and upload **all extracted contents** to your repository root. No folder has more than 92 files. If your GitHub browser uploader hangs when selecting many files at once, use the two split upload batch ZIP files instead, preserving paths and uploading Batch 1 before Batch 2.

## Enable real applications on Cloudflare Pages
1. Connect your GitHub repository to Cloudflare Pages. Plain GitHub Pages can show the forms but **cannot execute** `functions/api/artist-applications.js`.
2. Create/attach a Cloudflare D1 database with the binding **DB**.
3. Run `db/migrations/20261104_artist_applications.sql` against the D1 database (or the full `db/schema.sql` on a new database).
4. If enabling profile-photo/video/press-kit uploads, create a **private** R2 bucket and bind it as **ARTIST_UPLOADS**. Without that binding, users can still submit links-only applications, but selected file uploads will show an error.
5. Deploy and submit a test application. Check your private D1 `artist_applications` table for its `HK-A-...` reference and status `pending_review`. Only create public profiles after manual review.
6. Configure moderation, retention, privacy wording, access controls and email notifications separately. Submitting an application stores a record, not an email notification.

## File sizes
- Profile photo: JPG, PNG or WebP, max 4 MB.
- Performance clip: MP4 or WebM, max 15 MB.
- Press kit: PDF, DOC or DOCX, max 8 MB.
- For a lightweight application, use a YouTube/Spotify/SoundCloud or other portfolio link instead of file uploads.

## Verification
JavaScript syntax, D1 SQL schema, and mock submission tests passed (valid request, invalid email, missing DB). The headless browser in this environment blocks local file navigation, so **production visual testing and deployment have not been verified**. Please test on your own hosted domain after publishing.

Photo source: https://unsplash.com/photos/a-man-standing-in-front-of-a-microphone-in-a-recording-studio-C8VidHnIysM (Dwayne joe, Unsplash License). The external source requires an internet connection; a bundled local fallback remains available.
