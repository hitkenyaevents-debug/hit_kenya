# HIT KENYA | Get a Marketing Plan — final navigation update

## What was changed

Click **Event Promotion Strategy** on the HIT KENYA homepage, then click **GET A MARKETING PLAN**. The website opens the full **GET YOUR CUSTOM MARKETING PLAN** request page, not the old generic enquiry popup.

The form includes customer details, promotion type, campaign date, location, budget, campaign goals, description, privacy consent, and **WHAT HAPPENS NEXT?**. The page is built in actual responsive HTML with a higher-resolution illustrative concert image; text, fields, and buttons are not part of a low-quality screenshot.

The form is both embedded inside `index.html` (for the full-screen click flow) and available as a standalone page at `marketing-plan.html`. The `event-promotion.html` standalone page also links to it. **BACK** returns to Event Promotion.

All other existing website sections, images, and previous merchandise/Paystack source files are preserved.

## How to upload to GitHub

1. Extract this ZIP archive.
2. Copy **all its contents**, including `index.html`, `event-promotion.html`, `marketing-plan.html`, `assets/`, `functions/`, and `db/`, to the ROOT of your existing HIT KENYA repository. Do not upload the ZIP itself as a single GitHub file.
3. Commit and redeploy your web host from that repository.
4. Refresh your live website (Ctrl + Shift + R) and test: **Event Promotion Strategy → Get a Marketing Plan → complete form → Back**.

## To receive customer requests in production

The form calls `POST /api/marketing/requests`, implemented as a Cloudflare Pages Function in `functions/api/marketing/requests.js`.

- Deploy through **Cloudflare Pages with Functions enabled**, connected to your GitHub repository. GitHub Pages alone serves static files and **cannot process these submissions**.
- Bind a Cloudflare D1 database to the Pages project as `DB` and apply `db/schema.sql`. Store submitted briefs in the `marketing_requests` table.
- Configure private admin access and a follow-up process to read requests and contact customers; automatic email notifications are not included.
- Apply appropriate privacy protection and anti-spam/rate limiting before accepting public submissions.
- Test with a controlled, non-sensitive submission and confirm database storage before going live. If the function or database is unavailable, the page says the request **was not submitted** and does not falsely claim success.

The Paystack merchandise backend files are preserved, but live payments require separate configuration and live transaction verification. Do not place Paystack secret keys in `index.html` or a public GitHub repository.

## Checks completed

- The two-step navigation and Back action were tested in an isolated Chromium browser harness using the actual page templates.
- Responsive form rendered at 1440px and 390px without horizontal overflow.
- The Cloudflare marketing endpoint responded correctly to valid requests, invalid email, and unconfigured database scenarios in local unit-style checks.
- The embedded and standalone marketing-plan markup matches exactly.

**Limit:** The entire HIT KENYA homepage could not be visited at a local URL due to an environment-level browser restriction, and this build has not been tested on your public production domain.

## Latest image revision

The hero background at `assets/marketing/concert-hero.webp` was replaced with the approved more natural-looking concert scene. The complete PNG original is also included as `assets/marketing/concert-hero-full-resolution.png`. Both the embedded marketing-plan view in `index.html` and the standalone `marketing-plan.html` use this WebP asset. The scene is generated illustrative artwork, not documentary photography of a real HIT KENYA event. No other website sections were intentionally redesigned in this revision.
