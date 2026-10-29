# HIT KENYA | Website + working quote-request integration

This is the consolidated HIT KENYA site. Upload the **contents of this ZIP directly to your GitHub repository root**; `index.html`, `event-promotion.html`, `quote-request.html`, `marketing-plan.html`, `assets/`, `functions/`, and `db/` must remain at the same relative paths. Do not upload only the `index.html` or keep the files inside a second nested folder.

## User journeys completed in this update

1. Homepage **Event Promotion Strategy** → full Event Promotion page.
2. Event Promotion **GET A QUOTE**, **CONTACT**, **REQUEST MARKETING SUPPORT**, and **BOOK A CALL** → dedicated **REQUEST A QUOTE** form. The last action requests contact regarding a call; it does not schedule a time automatically.
3. **Back** from the embedded quote form → Event Promotion page.
4. **GET A MARKETING PLAN** → its separate, pre-existing marketing brief form. This destination has not been replaced.
5. The standalone `event-promotion.html` also links to `quote-request.html` and `marketing-plan.html`.

The quote form is real HTML with required fields and accessible controls. A valid submission sends JSON to `POST /api/quotes`. If the function and database return success, customers see their stored reference number. If the site is hosted statically, unavailable or misconfigured, the form **does not show a false success message**.

## Set up customer quote submissions (required before public launch)

This package includes `functions/api/quotes.js` and the `quote_requests` database table in `db/schema.sql`.

1. Connect the GitHub repository to **Cloudflare Pages** with Functions support. GitHub Pages alone cannot execute `/api/quotes` or Paystack server endpoints.
2. Create a Cloudflare D1 database and bind it to the Pages project using the exact binding name **`DB`**. Make sure the binding is applied to the production environment.
3. Apply `db/schema.sql` to that database before accepting submissions. For Wrangler CLI deployment, a typical command is `npx wrangler d1 execute YOUR_DATABASE_NAME --remote --file=db/schema.sql` (substitute your actual D1 database name). The SQL is idempotent and retains existing orders and marketing requests.
4. Redeploy the Cloudflare Pages project after configuring bindings.
5. Test one quote request with non-sensitive details. Confirm the success reference and confirm that a row was saved in the D1 `quote_requests` table.
6. Restrict database console access to authorized HIT KENYA administrators and establish a workflow to review the new enquiries. **Automatic email notifications and a public admin dashboard are not included**.
7. Before public launch, configure Cloudflare WAF/Turnstile or other rate limiting and complete privacy-policy and retention controls for customer contact details. A hidden honeypot and per-email rate check are included but are not comprehensive spam protection.

The quote form stores names, contact details, project details and consent state. Do not commit production credentials, API keys, client details, or `.dev.vars` files to GitHub.

## Photography for the quote hero

The primary quote-page banner loads a **real photographic image** by Jakob Owens, hosted at Unsplash (`photo-1635360381874-edd74cbd57f3`), under the Unsplash License: https://unsplash.com/photos/a-man-holding-a-camera-and-recording-a-video-4WoyTPMYb_E

The hero includes a small local fallback crop from the design screenshot provided for the project. That crop cannot have the true detail of the larger photograph; an internet connection is needed to load the primary full-resolution Unsplash asset. Text, navigation and form controls are rendered by the browser, not baked into the image.

## Existing features preserved

All the previously packaged website sections and their supporting images are included. The existing Cloudflare Paystack files and D1 `orders` table are retained. **Paystack still requires your own merchant keys, live merchant activation, catalog/delivery configuration and live transaction verification**. The quote update does not enable live payment collection on its own. Other demonstration workflows on the website remain subject to their existing backend limitations.

## Verification performed

- Confirmed the event-promotion → quote → back interaction in an isolated Chromium test using the actual embedded templates.
- Rendered the quote page at 1440px and 390px wide with no horizontal overflow.
- Validated `db/schema.sql` against SQLite and confirmed `orders`, `marketing_requests`, and `quote_requests` tables are created.
- Exercised the quote handler with mocked D1 for valid enquiry (201), invalid data (400), and absent D1 binding (503).
- Full live deployment and real Cloudflare D1 submissions are **not yet tested**, and the hosting environment in this session blocked direct visits to localhost.

## Checklist after publishing

- Open homepage → Event Promotion Strategy → Get a Quote → Back.
- Test Contact and Request Marketing Support entry points.
- Verify Get a Marketing Plan still opens its separate form.
- Confirm the quote banner image, `assets/` pictures and mobile layout display.
- Configure D1 and confirm a test quote is stored.
- Activate merchant payments separately when ready.


## October 28, 2026 Campaign Showcase update

On the Event Promotion Strategy page, the top-right action beside **CAMPAIGN SHOWCASE** is now **ALL OF OUR CAMPAIGNS SHOWCASE →**. It opens a complete, full-page showcase matching the design language of the supplied reference, from both the embedded homepage view and the standalone `event-promotion.html`. The new destination is `campaign-showcase.html` for direct links, or the embedded template inside `index.html` for the existing modal/page system. Its Back control returns to Event Promotion. Quote and Marketing Plan actions still lead to their respective forms.

### Photography and claims

The campaign showcase uses bundled event imagery immediately, and asynchronously replaces it with real photographic assets loaded from `images.unsplash.com` when available. These are licensed illustrative event photographs, **not** evidence of actual completed HIT KENYA client campaigns. No unverified customer testimonials or outcome figures are asserted. The Unsplash photographs need an internet connection to load; the provided local fallbacks prevent broken images offline. The photo credits are in the showcase footer. For an authentic published portfolio, replace these with owned/approved images of completed HIT KENYA campaigns.

### GitHub

Upload the contents of the ZIP (not the enclosing ZIP itself), including `index.html`, `campaign-showcase.html` and `assets/`, to your repository root. Existing Cloudflare Pages functions and Paystack integration are retained but not activated by this design-only update.


### Campaign Showcase redesign (2026-10-28)
- `campaign-showcase.html` is the six-category portfolio design based on the supplied reference.
- In the homepage's embedded Event Promotion page, **ALL OF OUR CAMPAIGNS SHOWCASE →** opens this same design via `hk-campaign-showcase-template`.
- Each **VIEW CAMPAIGN →** button opens a service-description panel; **GET INVOLVED** opens the existing quote request.
- All six category photographs are local bundled assets, not separately fetched remote images.
- Portfolio content is **illustrative**; do not treat the examples as evidence of completed HIT KENYA campaigns.
- All other pages and Cloudflare/Paystack code remain as supplied in the previous consolidated ZIP.


## October 28, 2026 — Event Promotion: How We Work / Closing Section

The Event Promotion Strategy page now includes three wide process panels:
Understand Your Brief, Create the Campaign, Measure & Improve. They use
three high-resolution local assets at `assets/process/`. The closing
call-to-action has a concert background and three functional links:

- REQUEST SUPPORT → the existing custom marketing plan form.
- CHAT ON WHATSAPP → the previously configured HIT KENYA WhatsApp account.
- BOOK A CALL → the existing quote/enquiry form for staff to arrange a call;
  this is not a live calendar reservation.

Both `index.html` (embedded Event Promotion view) and `event-promotion.html`
contain the same updated HTML. The rest of the project is unchanged.

The three process images are newly generated illustrative photography; do
not represent them as documentary photos of actual HIT KENYA operations.
Publish all ZIP contents, including the `assets` directory, to the site root.
Paystack still requires separate production keys, configuration and testing.

## Photo & Video Booking — new three-stage customer flow (October 28, 2026)

The **BOOK PHOTO / VIDEO** button in the photography portfolio and the front photography page now opens `photo-video-booking.html` in the embedded homepage viewer. Standalone photography pages link to the same file. The booking process has three fully responsive stages:

1. **Your Booking** — event/project information, customer contact details, requested media services, requirements and optional references.
2. **Duration & Payment Preference** — coverage duration and preferred future payment method (M-Pesa or bank transfer).
3. **Review & Submit** — editable booking summary and consent checkbox. The form POSTs multipart data to `/api/media-bookings`, a Cloudflare Pages Function. Only a successful D1 insert displays a booking request reference.

**Critical:** No payment is collected, no M-Pesa STK prompt is issued and no booking is confirmed at this stage. Pricing is requested, not predetermined; it would be misleading to initiate a charge or claim payment without an agreed amount. After the team confirms availability and pricing, set up a dedicated payment checkout with a server-side, verified Paystack or M-Pesa integration. Existing Paystack code remains unchanged, and it is for merchandise rather than this booking flow.

**Cloudflare configuration:** Bind a D1 database as `DB`, execute `db/schema.sql` with Wrangler, and redeploy. The new `media_booking_requests` table stores booking enquiries. To enable optional JPG/PNG/WebP reference-photo uploads, bind a **private R2 bucket** to the Pages Functions environment as `MEDIA_UPLOADS`. Without R2, users can submit without images or provide an external reference URL; attempting to submit selected files returns an explicit error and does not claim success. Files: max 3 images, max 4MB each. Restrict D1 and R2 administrative access and establish contact-detail retention/deletion practices and Turnstile/WAF protections before launch.

**GitHub Pages alone** cannot run the Cloudflare Pages Functions. Deploy through Cloudflare Pages using the connected GitHub repository and the actual D1/R2 bindings. Test at least one booking and verify the saved D1 record using a test email. Files and the booking interface are functional as code but do not prove that your live production configuration is completed.
