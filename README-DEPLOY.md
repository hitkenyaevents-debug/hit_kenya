# HIT Kenya Marketplace visual update (10 November 2026)

The marketplace at `index.html#marketplace` has been redesigned to match the supplied compact black-and-gold mobile reference. It now has a compact header, search, location and category filters, price/date filters, sorting, saved listings and two-column mobile cards.

Photos use genuine Unsplash photographic image URLs already present in the previous website, with bundled local WebP images as fallbacks. Photos are illustrative, not claims that a particular photo depicts the listed business or event. The demo listings, reviews and prices are examples, not verified live bookings. No payment, reservation or identity-verification backend was added.

**GitHub Pages:** Extract the ZIP, upload all its contents to the repository root, and open the existing site with `#marketplace`. Keep all files and folders at their existing relative paths. External photos need an internet connection; local images display when they cannot load.

**Changes:** Only the marketplace section and its related CSS/JS inside `index.html` were changed. Other pages and Cloudflare Functions are preserved.

---

# HIT KENYA — Complete Website with Venue Registration

**Current update (9 November 2026):** Clicking **LIST YOUR VENUE** on the HIT KENYA website now opens the new `venue-registration.html` page. The full website is preserved in this compact package. See the Venue Registration section at the end for form/backend deployment details.

## Previous release notes: Social Media & Digital Campaigns

This full website release preserves the previous pages and connects only the **Social Media & Digital Campaigns** card's **START A CAMPAIGN** button to `social-media-campaigns.html`. The homepage is otherwise unchanged apart from an internal deduplication of a concert image path.

## Install on GitHub

1. Back up your current repository first.
2. Extract the ZIP and upload its **contents** (not the ZIP) into your website repository's publishing branch, with `index.html` at the repository root.
3. Preserve the `assets/`, `functions/` and `db/` folders. Commit changes.
4. In GitHub Pages, wait for publishing, then refresh with Ctrl+Shift+R.
5. From your homepage, select **Social Media & Digital Campaigns → START A CAMPAIGN** and test the form.

## This update

- `social-media-campaigns.html` is the new responsive, single-page campaign landing page with services, example campaign concepts, and a working WhatsApp enquiry form.
- `index.html` has only the campaign CTA destination changed.
- The previous duplicate `assets/marketing/concert-hero.webp` is removed; references now point to the retained `assets/marketing/concert-hero-full-resolution.webp` (same scene, same 1536 × 1024 resolution). This keeps the complete package within 92 files.
- Existing Content Creation, Brand & Digital Growth, Artist Booking, Vendor Marketplace, goal forms and backend source files are preserved.
- Real Unsplash stock photographs are loaded remotely for the campaign hero and two sample cards. Local fallback photographs from existing assets are included. The samples are illustrative concepts, not claims of HIT KENYA campaign results.

## Enquiries and backend

The new form validates inputs and prepares a message for HIT KENYA WhatsApp (+254 797 068 736). The customer must **press Send in WhatsApp**; it does not write to a server or database. A copy-message fallback is included.

GitHub Pages serves static files only. The included Cloudflare Functions, database migrations and Paystack-related source require a separately configured backend, appropriate credentials and end-to-end testing. They are not activated merely by uploading this ZIP.

## Photo source

Unsplash (free stock photography):
- https://unsplash.com/photos/person-using-smartphone-and-macbook-UTw3j_aoIKM
- https://images.unsplash.com/photo-1492684223066-81342ee5ff30
- https://images.unsplash.com/photo-1500530855697-b586d89ba3ee

## Note

If your repository has changed since the previous complete website ZIP, compare or merge those changes before overwriting.


## 2026-11-09 — Join as a Partner page
- `join-as-a-partner.html` is a new responsive, single-page partner landing page.
- The original homepage `BECOME A PARTNER` button now opens this page instead of a popup.
- Property / Stay and Car Hire buttons link back to the existing registration modals on `index.html`.
- Existing registration forms in this site are frontend previews; production application submission / verification requires backend implementation. No working backend is falsely claimed here.
- No external libraries, external photo hosts, or new photo assets are needed: the page uses existing high-resolution local photographs.
- Existing website pages, backend functions, Paystack integration and database files are preserved.
- Existing WebP photographs have been lossily re-encoded for smaller GitHub uploads. The large embedded merchandise reference PNG was converted to WebP in-place.
- Extract the ZIP and upload its CONTENTS to your GitHub repository root. Do not upload the ZIP itself. If GitHub browser upload limits the number of files, use GitHub Desktop or Git; preserve all directories.

## 2026-11-09 — List Your Venue / Register Your Venue
- `venue-registration.html` is a new fully responsive, single-page venue application page matching the black-and-gold HIT KENYA design, with existing local venue photographs (no new generated imagery or external photo downloads).
- All `LIST YOUR VENUE` / `REGISTER AS VENUE OWNER` actions that call `openPartnerFlow('venue')` now navigate to `venue-registration.html` instead of the old modal.
- The form includes venue information, facilities and capacity, venue photos and optional video, pricing, contact details, private ID front/back/face uploads and applicant consent.
- The frontend checks required fields, Kenyan mobile numbers, file formats and upload limits. It previews selected venue photos locally. No identity documents are stored in the browser or sent to WhatsApp.
- A Cloudflare Pages Function is included at `functions/api/venue-applications.js` for secure application submission, with manual approval status. It requires BOTH a Cloudflare D1 binding named `DB` and a **private** R2 bucket binding named `VENUE_UPLOADS`.
- Run `db/migrations/20261109_venue_applications.sql` on the existing D1 database before enabling the endpoint. `db/schema.sql` includes the table for new databases. Keep the R2 bucket private and restrict access to verification documents to authorised reviewers.
- IMPORTANT: GitHub Pages hosts the frontend but **does not run Cloudflare Pages Functions**. If hosted on GitHub Pages alone, the venue page and form display correctly but secure form submission is unavailable; the form will show an honest error and will NOT pretend the application was received. Deploy the backend on Cloudflare Pages with the bindings above, or integrate your own secure backend, before accepting real applications.
- The original website pages, assets, payment code and other existing features are preserved.
- Extract the ZIP, upload its **contents** to the repository root. For GitHub browser upload issues use GitHub Desktop or Git; a ZIP is not itself a published website.


## 2026-11-09 — Event Ushering & Hostess Services
- New `event-ushering-hostess.html` page with black/gold design inspired by the provided screenshot.
- A new **Event Ushering & Hostess Services** card appears in the homepage Our Services grid and View All Services dialog. Clicking it opens the dedicated page.
- The page has a hero, service category photo cards, service information, and a functional four-step enquiry form (event details, staffing, budget, review).
- Form validation runs in the browser. On the final step, **Open WhatsApp** prepares an enquiry for the existing HIT KENYA number (+254 797 068 736); the customer must press Send. No server submission or booking confirmation is implied.
- The page uses genuine existing local HIT KENYA brand and event-setting photographs, not AI-generated images. Photos are illustrative and do not establish the identities or availability of specific ushering staff.
- Five redundant photographic copies were removed and their references updated to the retained equivalent images to reduce the GitHub file count and ZIP size. All other website pages and backend source files remain in the archive.
- Extract the ZIP and upload **its contents** (with `index.html` at the repository root), not the ZIP itself. For GitHub browser upload issues, use GitHub Desktop or Git.


## 2026-11-10 — Plan Your Guest Experience
- New `plan-your-guest-experience.html` detailed event-team enquiry page with black/gold styling and **existing local photographic event images** (no AI-generated images).
- On `event-ushering-hostess.html`, clicking **LET'S PLAN YOUR GUEST EXPERIENCE** or **REQUEST ASSISTANCE** opens the new page.
- Sections: client details, event details, assistance services, staff quantities, uniform preference/reference preview, working arrangements, budget, notes and review.
- Front-end validation, review dialog, WhatsApp message preparation to the existing HIT KENYA contact +254 797 068 736, and copy fallback. No enquiry is sent automatically; visitors must press **Send** in WhatsApp. Uniform images are previews only and must be sent separately.
- Static GitHub Pages cannot securely store submissions or uploaded files. A backend is required for that.
- To stay at **92 files**, `assets/vendor-management/vendor-management.js` was inlined unchanged into its only consuming page, `vendor-management.html`. Its functionality is preserved.
- Extract the ZIP and upload the contents to your GitHub repository root; do not upload the ZIP itself.
