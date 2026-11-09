# HIT KENYA — Social Media & Digital Campaigns release

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
