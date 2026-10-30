# HIT KENYA — Vendor Services & Products / Review & Submit

This package is the **complete HIT KENYA website** based on the previous Brand & Social Content release, updated with the Vendor Registration workflow. It preserves existing Photography, Drone, Event Promotion, Campaign Showcase, Merchandise, Brand Content and other site sections and their supporting images.

## New navigation

- Main site → **Vendor Facilitation** → **Find & Book a Vendor** → **Explore Vendors**: opens `vendor-registration.html#services` (the requested **Services & Products** stage).
- Main site → **Vendor Facilitation** → **Become a HIT Kenya Vendor / Join the Vendor Network**: opens `vendor-registration.html#profile` to collect the required Business Profile.
- Vendor registration stages are **1. Business Profile → 2. Services & Products → 3. Review & Submit**. The Services & Products stage is directly accessible, but a valid Business Profile must be completed before submission.
- **Edit** actions from the review screen return to their respective stages without losing entries. Vendor services/products and selected images are previewed locally.

**Clarification:** The pictured “Find & Book a Vendor” card was intentionally pointed at the new vendor registration stage, as instructed for this design change. This is not yet a live vendor-directory search or customer booking system. Verified/public vendor listings require an approved-vendor directory and separate admin process.

## Website files

`index.html` — complete updated homepage.

`vendor-registration.html` — dedicated vendor registration, products, services, gallery and review pages.

`assets/vendor/vendor-registration.css` and `.js` — styling and interactive UI.

`assets/vendor/vendor-registration-hero.webp` — local vendor hero picture.

`functions/api/vendor-applications.js` — backend application endpoint.

`db/schema.sql` — existing tables plus new `vendor_applications` table.

## Publishing on GitHub and Cloudflare Pages

1. Extract the ZIP. Upload **all contents of the extracted folder** to the root of your GitHub repository. `index.html`, `vendor-registration.html`, `assets/`, `functions/`, and `db/` must remain in the same relative structure. Do **not** upload only `index.html` or upload the enclosing folder as a second nested directory.
2. Connect that repository to Cloudflare Pages if customer forms and Paystack endpoints are to run. GitHub Pages alone serves the static design, but **cannot execute Cloudflare Pages Functions**.
3. Bind a Cloudflare D1 database to the Pages project using binding name **`DB`**, and execute the full `db/schema.sql` against the production database, for example:

   `npx wrangler d1 execute YOUR_DATABASE_NAME --remote --file=db/schema.sql`

4. For private product/gallery image uploads, create a Cloudflare R2 bucket and bind it to Pages as **`VENDOR_UPLOADS`**. Without R2, applications with images will return an explicit configuration error. Applications **without images** can save with D1 alone.
5. Redeploy. Test a vendor application with non-sensitive sample details, check the returned reference and confirm a row in `vendor_applications` with `status='pending_review'`.
6. Restrict D1 and R2 access to administrators. Establish an approval process, privacy policy, data retention rules and abuse protection before launching registrations publicly.

The website has **no automatic public approval**, no verified vendor directory generated from submissions, and no automated email notification or live vendor booking confirmation. The R2 image objects are private and are not exposed as public URLs. The reference images and optional example photos are illustrative, not evidence of verified HIT KENYA clients.

## Test notes

- Checked desktop and mobile rendering with an isolated Chromium test at 1440px and 390px: no horizontal overflow, no JavaScript page errors.
- Tested step navigation, adding a product and photograph, gallery upload, and rendering supplied profile information on the review page.
- Tested backend using Node mock bindings: successful JSON and multipart applications, rejected invalid email, and missing-D1 error; checked database schema against SQLite.
- These are **local/isolated checks only**. Live Cloudflare deployment and real admin review workflows need verification by the website owner.

## Existing Paystack integration

Existing Paystack backend code is preserved but **not activated** by this update. Payments are not collected during vendor registration. Live Paystack merchant onboarding, private keys and server-side payment verification remain separate configuration steps.
