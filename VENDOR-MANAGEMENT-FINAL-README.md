# HIT KENYA — Vendor Management HTML Release (2 November 2026)

## What changed
- In the full Vendor Facilitation page, the **Vendor Management for Events** card and **REQUEST VENDOR MANAGEMENT** button both open `vendor-management.html?release=20261102`.
- The standalone `vendor-management.html` includes the full HTML form (not a screenshot) with event details, 12 vendor categories, package selection, budget, document upload, and a separate review-before-send step.
- The page has an updated high-resolution local hero, enhanced responsive presentation and versioned CSS and JavaScript to avoid stale browser caches.
- The existing **Explore Vendors → Vendor Marketplace** fix and the other HIT KENYA pages have been retained.

## How to publish
1. Extract the **complete** ZIP.
2. Upload its **contents** to your repository root; do not upload the enclosing folder.
3. Ensure `index.html`, `vendor-management.html`, `assets/`, `functions/` and `db/` are at their original relative paths.
4. Replace earlier files, commit and redeploy; hard-refresh if needed.
5. On your live site, open Vendor Facilitation and click **REQUEST VENDOR MANAGEMENT**. You should see the dedicated REQUEST VENDOR MANAGEMENT form, not the old popup.

## Production requirements
- GitHub Pages is static hosting only. The form POST endpoint `/api/vendor-management` requires Cloudflare Pages Functions and a D1 database `DB`, with SQL migrations applied.
- For attachments, configure private R2 bucket binding `VENDOR_MANAGEMENT_UPLOADS`.
- Until configured, the interface shows an error rather than falsely saying an application was received.
- The photo is a bundled illustrative event image, not a claim that the photographed event is a HIT KENYA project. Replace it with an authorised real HIT KENYA event photograph when available.
- Submissions are **pending review**, not confirmed bookings and no payments are collected on this form.

## GitHub file-count constraint
No directory in this ZIP should exceed 92 files. If your GitHub upload interface limits the number of files per upload, the two optional upload-batch ZIPs can be extracted and uploaded sequentially to the **same** repository root.
