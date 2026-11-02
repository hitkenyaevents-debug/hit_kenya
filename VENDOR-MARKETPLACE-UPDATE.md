# HIT KENYA – Find & Book a Vendor marketplace (November 2026)

## What was actually changed

- The **Find & Book a Vendor** card (and its **Explore Vendors** gold button) in `index.html` now opens **`vendor-marketplace.html`** instead of `vendor-registration.html#services`.
- `vendor-marketplace.html` is an independent responsive marketplace with genuine photographic illustrations from Unsplash, searchable service categories, a location filter, an approved vendor results area, and a booking-enquiry form for genuine approved profiles.
- **Become a HIT KENYA Vendor** keeps its **Business Profile → Services & Products → Review & Submit** application workflow.
- **Vendor Management for Events** still opens `vendor-management.html`.
- All other existing pages, image assets and Paystack code are preserved from the latest supplied consolidated ZIP.

## Marketplace business rules

1. Do not publish registrations automatically. The private `vendor_applications` table includes private contact and application data and must not be exposed publicly.
2. The new `vendor_public_profiles` table contains only display-safe details entered by an administrator *after verifying and obtaining the vendor's consent to publish*. `status='approved'` **and** `public_enabled=1` are required before profiles appear.
3. Photos in the six **service-category cards** are REAL STOCK PHOTOGRAPHS, illustrating categories only. They are not photos of particular HIT KENYA businesses and are not AI-generated. The photos are served from `images.unsplash.com` over HTTPS and **are not bundled inside the ZIP**. An internet connection is needed for these source photographs. The page has dark colour fallback surfaces if external photos fail. For fully offline photos and guaranteed long-term ownership, replace the links with original photographs for which HIT KENYA has commercial rights, and place those files under `assets/vendor-marketplace/`.
4. The D1 vendor directory starts **empty**, because no verified vendor profiles were supplied. No business name, rating, price or review has been invented. Visitors can browse service categories, search and request managed vendor sourcing while the directory is populated.
5. Customer booking enquiries are only enabled for *approved and publicly published* vendor records. Requests are stored privately, marked `pending_review`, and are **not confirmed bookings or payments**. No transaction or payment prompt is initiated.

## Deploy on GitHub + Cloudflare Pages

1. Extract the complete ZIP and upload the **contents** to the GitHub repository root. `index.html`, `vendor-marketplace.html`, `vendor-registration.html`, `vendor-management.html`, `assets/`, `functions/` and `db/` must remain in their relative positions.
2. For frontend-only preview, GitHub Pages can serve the marketplace and category photos. It cannot provide the database-backed vendor directory or accept enquiries.
3. Deploy the same repository to Cloudflare Pages, attach the existing D1 database using the binding name **`DB`** under Pages settings, and apply `db/migrations/20261102_vendor_marketplace.sql` to your **existing** D1 database. If creating a clean D1 database, `db/schema.sql` already includes these tables.
4. Once a vendor is vetted and has consented, an administrator can add its public details to `vendor_public_profiles`, using the appropriate category name; leave `status='pending'` and `public_enabled=0` until approved and ready to publish. The code deliberately contains **no public administrative approval endpoint** because creating one without proper authentication would expose sensitive vendor applications.
5. Verify: visit `vendor-marketplace.html`, select a category, search; check `GET /api/vendors` returns public approved profiles only. Open an approved listing and submit a test booking enquiry; it should return a reference if the D1 backend is correctly configured. Check no applicant phone/email appears in the public response.
6. Check the latest deploy on mobile and desktop. The original Paystack backend requires its separate credentials and deployment before any live payments can be accepted.

## Real photography sources

Photos supplied at runtime through the Unsplash CDN, and their use is subject to the [Unsplash License](https://unsplash.com/license):
- `https://images.unsplash.com/photo-1511795409834-ef04bbd61622` — event table and flower details, hero/decor
- `https://images.unsplash.com/photo-1555244162-803834f70033` — catering buffet
- `https://images.unsplash.com/photo-1441986300917-64674bd600d8` — clothing store and retail
- `https://images.unsplash.com/photo-1760727467662-5f0943d196a8` — craft marketplace photo (product supply; fallback to clothing shop image if unavailable)
- `https://images.unsplash.com/photo-1531058020387-3be344556be6` — event/conference
- `https://images.unsplash.com/photo-1542038784456-1ea8e935640e` — photographer

An Unsplash image may contain people, logos or other rights; do not claim that those photographed represent the HIT KENYA brand or a specific vendor.

## Files

- `index.html` — patched full original homepage
- `vendor-marketplace.html` — NEW marketplace
- `functions/api/vendors.js` — NEW approved vendor directory endpoint (GET)
- `functions/api/vendor-enquiries.js` — NEW approved-vendor booking enquiry endpoint (POST)
- `db/migrations/20261102_vendor_marketplace.sql` — NEW migration
- `db/schema.sql` — updated clean-install schema

### Important limitations

This is a real functioning front end and a deployable backend implementation, but there are no approved vendor profiles or vendor-specific photographs yet. Live operation requires Cloudflare D1 configuration and manually verified vendor records. Public business profiles should be added only after the businesses consent. The photo-category images are remote, so a network connection is needed to load them.
