# HIT KENYA — Request Vendor Management update (30 October 2026)

## Updated navigation

Home → Vendor Facilitation → **Vendor Management for Events** → **Request Vendor Management** → `vendor-management.html`.

This is a separate event-organiser request form. The **Become a Vendor** application (`vendor-registration.html`) remains unchanged. The **Find & Book a Vendor** card is also left unchanged by this update. Only the third Vendor Facilitation card opens the new vendor management form.

## New files

- `vendor-management.html`
- `assets/vendor-management/vendor-management.css`
- `assets/vendor-management/vendor-management.js`
- `functions/api/vendor-management.js`
- `db/schema.sql` has one appended `vendor_management_requests` table and an index.
- `index.html` now routes Vendor Management to the new standalone page. All previously supplied site sections and local photos are retained.

## Deployment

1. Extract the ZIP. Upload **the contents** into the repository root (not an extra nested folder). Ensure `index.html`, `vendor-management.html`, `assets`, `functions` and `db` are siblings.
2. Deploy using **Cloudflare Pages connected to GitHub**. GitHub Pages alone cannot execute the Cloudflare Functions API. Configure the Pages D1 database binding with the exact variable name `DB`.
3. Apply the schema update to the production D1 database, for example: `npx wrangler d1 execute YOUR_DATABASE_NAME --remote --file=db/schema.sql`. Replace the placeholder with the configured database name. Review migrations and back up production data first.
4. If supporting document uploads are wanted, bind a **private** Cloudflare R2 bucket to the Pages project using the exact binding name `VENDOR_MANAGEMENT_UPLOADS`. Without R2, submitting **without** a document still works once D1 is configured; attaching a document returns a clear storage-configuration error.
5. Redeploy the site after updating bindings. Submit a harmless test request. Check that the page shows a reference and that the corresponding row exists in `vendor_management_requests`.
6. Establish internal review, privacy policy, retention, access and anti-spam protections before collecting real customer information. Add staff notification/admin workflows as required. The database is not a customer-facing booking system.

## What works and what does not

- The new page is responsive HTML, not a screenshot. Text, fields, selections, upload control, navigation and submission button are real browser elements.
- It validates names, contact details, event information, budget, vendor categories, and package; accepts one optional PDF/DOC/DOCX/JPG/PNG document up to 10 MB.
- A successful request is stored as **pending review**, not approved, priced, paid, or confirmed. The form creates no Paystack payment or M-Pesa prompt.
- No invented fixed prices, vendor availability or guaranteed response time are published.
- The concert banner is **illustrative imagery**, not evidence of a verified HIT KENYA event or client project.
- The Cloudflare API passed mocked validation/storage tests in this build; live D1/R2 and deployed browser tests remain necessary.

## Visual assets

The new page uses the local high-resolution `assets/marketing/concert-hero.webp` and `assets/marketing/audience-atmosphere.webp` included in the ZIP. The photos remain in `assets/` and must be uploaded with the HTML; do not upload only `index.html`.
