# HIT KENYA — Full website deployment package

This release preserves the existing homepage, other service pages, vendor marketplace, artist registration, merchandise, Paystack integration files, Cloudflare Pages Functions and database schema. The only changes to the homepage are to connect **Content Creation** and **Book Through HIT KENYA** to their new pages. No homepage redesign or replacement has been introduced.

## Upload to GitHub (small release)

1. Back up your existing repository before uploading. In GitHub, open your website repository and choose **Add file → Upload files**.
2. Extract the ZIP on your computer. Upload **all extracted contents** to the **repository root** (where `index.html` belongs). Do not upload the ZIP itself, and do not put the files inside an extra enclosing folder.
3. Commit the changes. Keep the `assets/`, `functions/` and `db/` paths intact. Do not delete your existing repository files unless you intend to replace them.
4. For a public static site: **Settings → Pages → Deploy from a branch**, select the correct branch and `/(root)` folder. Wait for GitHub Pages to publish. If you use Cloudflare Pages, connect the same repository to Cloudflare instead.
5. Check the homepage and both new journeys. If your GitHub repository is a project site, relative links will work under its repository path.

## New linked pages

- `index.html` — existing site, preserved with only the two new card destinations wired in.
- `content-creation.html` — full Content Creation services page.
- `content-request.html` — customer content brief, validation, review and WhatsApp handoff.
- `artist-booking.html` — three-step event, artist/budget and review booking enquiry.

### Customer contact

The new static enquiry flows use the existing HIT KENYA WhatsApp number `+254 797 068 736`. They open WhatsApp with the customer's completed enquiry; **the customer must press Send**. A successful form review alone is not a submitted enquiry. The booking is not confirmed until HIT KENYA confirms it.

### Hosting and production backend — important

**GitHub Pages is static hosting.** It will serve the HTML, CSS, JavaScript, image assets and WhatsApp enquiry links, but it cannot execute the included `functions/api/*` backend, D1 database, Paystack server-side checkout, vendor approval workflows or private file uploads. Existing functions are included for Cloudflare Pages, not for GitHub Pages.

To activate the existing backend:

1. Connect the GitHub repository to **Cloudflare Pages** (rather than GitHub Pages).
2. Create and bind a Cloudflare **D1 database** as `DB`, then apply `db/schema.sql` and the relevant migrations to the database.
3. Configure any other bindings required by individual endpoints (e.g. R2 `VENDOR_UPLOADS`) and your **own** production Paystack secret/public keys and verified webhook. Do not put keys in GitHub.
4. Set up real domain, privacy policy, security/rate limits, authorised admin review, payment catalog/delivery terms and complete a real end-to-end test before accepting live payments or sensitive uploads.

The two newly added pages use a WhatsApp handoff and do not depend on Cloudflare Functions. Existing backend endpoints are preserved, but **this package does not itself create a Cloudflare account, database, payment merchant account or live deployed URL**.

### Photography

The two new Content Creation pages and the artist booking page use **external Unsplash photographs** for their primary banners/cards. The package also includes fallbacks from the existing site's media assets if those external photos are unavailable. Unsplash photos require an internet connection. They are illustrative and should not be labelled as completed HIT KENYA client projects without verification.

### Quick verification checklist

- `index.html` loads with existing home sections, menus and service cards.
- Open Content & Digital → **Content Creation** → **Get Content Solutions** → content brief → review → WhatsApp.
- Open Artist & DJ Booking → **Book Through HIT KENYA** → event details → artist & budget → review → WhatsApp.
- Test the other existing service pages and marketplace routes.
- Test on desktop and mobile. Confirm WhatsApp is installed or web WhatsApp opens.
- Test Cloudflare-only features **only after** configuring their required backend resources.

## Safety

Do not commit `.dev.vars`, `.env`, private credentials or real customer information. Avoid replacing your existing site with an HTML-only package; the complete ZIP is the deployable source.
