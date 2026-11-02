# HIT KENYA — corrected Vendor Management page

**Revision: 30 October 2026**

This release corrects the third card under **Vendor Facilitation → Vendor Management for Events → Request Vendor Management**. It does not replace **Become a HIT Kenya Vendor** or **Find & Book a Vendor**, and it does not change the other previously developed website sections.

## What was incorrect in the previous release

The previous page used the generic concert banner, different panel organisation, and an additional "Review & Send" panel not shown in the supplied design. The corrected version recreates the reference's two-column content arrangement, wording and four-step navigation. The request button is part of the Additional Information panel as shown in the supplied image. A final customer review now appears only when the button is clicked, before the request is submitted.

## Exact corrected workflow

1. From the homepage, open **Vendor Facilitation**.
2. On **Vendor Management for Events**, click **REQUEST VENDOR MANAGEMENT**. This opens `vendor-management.html`.
3. Complete the sections **Event Details**, **Vendor Requirements**, and **Budget & Additional Info**. The form includes all 12 vendor categories, three service-package levels, estimated vendor budget, whether the management fee is included, and whether the organiser already has vendors.
4. Complete the **Event Requirements** field (10–500 characters) and optionally attach one valid PDF, DOC, DOCX, JPG or PNG up to 10 MB.
5. Click **SUBMIT VENDOR MANAGEMENT REQUEST** to open a review showing the customer's entered details. Click **EDIT DETAILS** to make corrections, or **CONFIRM & SEND REQUEST** to transmit the form.
6. A reference is displayed **only if the server confirms the request was saved**. This is a pending enquiry, not an accepted booking and not a payment.

## Files and photo quality

- `index.html`: retains the original website and points the Vendor Management button to `vendor-management.html`.
- `vendor-management.html`: the complete, corrected standalone form.
- `assets/vendor-management/vendor-management.css`: responsive layout and all design elements.
- `assets/vendor-management/vendor-management.js`: field validation, optional drag-and-drop upload, review summary and submission logic.
- `assets/vendor-management/event-management-hero.webp`: local high-resolution illustrative concert background, 1,500 × 830 pixels.
- `assets/vendor-management/event-management-footer.webp`: local illustrative skyline photo.
- `functions/api/vendor-management.js`: Cloudflare Pages Function which validates and stores pending requests.
- `db/schema.sql`: includes the `vendor_management_requests` table.
- `db/migrations/20261030_vendor_management.sql`: standalone, idempotent migration for this table.

The photographs are **illustrative visuals**, not verified photographs of HIT KENYA projects. Text, buttons, form labels and branding are real HTML/CSS rather than text baked into an image.

## Deploy correctly to GitHub and Cloudflare Pages

1. **Extract the ZIP and upload its contents (not the enclosing folder)** to the root of your GitHub repository. The folders `assets`, `functions`, and `db` must sit alongside `index.html`.
2. Connect the GitHub repository to **Cloudflare Pages** to run backend Functions; **GitHub Pages on its own will not save enquiries**.
3. Configure a Cloudflare **D1 database binding named `DB`**, and apply the SQL schema or the standalone migration after reviewing/backing up your production database. One option is `npx wrangler d1 execute YOUR_DATABASE_NAME --remote --file=db/migrations/20261030_vendor_management.sql`.
4. If accepting supporting files, configure a **private Cloudflare R2 bucket binding named `VENDOR_MANAGEMENT_UPLOADS`**. Without it, requests with no attachment can still work once D1 is configured. An attached file will produce a clear error if this storage is unavailable.
5. Deploy, open the website and test **Vendor Facilitation → Request Vendor Management**. Submit a harmless test request, confirm a saved reference is returned and verify the row in D1.
6. Before receiving actual customer enquiries, ensure staff have an authorised way to review applications, access private documents, follow up and comply with privacy/retention requirements. This update does not provide an administrative dashboard, automatic email notification, automatic approval, confirmed vendor availability, or live Paystack payments.

## Checks performed

- Rebuilt-page rendering at desktop (1440px), tablet (720px), and mobile (390px) widths; no horizontal overflow or JavaScript page errors in the isolated browser test.
- Form entry, package selection, final-review dialog and simulated successful server response.
- Backend tests: valid request accepted (201), invalid email rejected (400), empty categories rejected (400), too-short notes rejected (400), unavailable D1 returned 503, unavailable optional R2 returned 503.
- Local image references and ZIP integrity checks.

The isolated local browser test is **not** evidence that a deployed GitHub/Cloudflare production website is fully configured. Live deployment and database bindings must be verified separately.
