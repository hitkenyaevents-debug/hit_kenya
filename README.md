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
