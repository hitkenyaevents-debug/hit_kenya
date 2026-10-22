# HIT KENYA — Premium website + Paystack merchandise checkout

**Version:** 19 October 2026 — secure checkout integration pack.  
**Status:** frontend and payment backend built; NOT DEPLOYED; real payments DISABLED by default.  
**Platform:** Cloudflare Pages (static website + Pages Functions) and Cloudflare D1 (orders database).  
**Payments:** Paystack redirect checkout in KES, with server-side transaction verification and signed webhook handling.

## 1. What was preserved and improved

The supplied full HTML was preserved as the foundation: HOME, EVENTS, MARKETPLACE, SERVICES, MEDIA, FOUNDATION, MERCHANDISE and INFLUENCER DASHBOARD. Improvements include:

- Extracting the original 1.6 MB merchandise image from CSS to an ordinary asset, significantly reducing HTML file size.
- Correcting the broken Women's Crop Top buy button; supporting the size actually selected rather than always adding a hard-coded size.
- A mobile-friendly merchandise basket, delivery-zone selector, server-priced checkout, Paystack hand-off, and payment-return page.
- Secure Pages Functions for checkout, public catalogue, order status, and Paystack webhook.
- Cloudflare D1 order records and verification rules that compare transaction **reference, amount, currency, email and test/live environment** before declaring payment successful.
- Preserving event ticketing as a **demo** (no issuance or accepted ticket payments), and labelling sample marketplace and influencer data.
- Consent-gated Google Analytics (no analytics script before visitors opt in).

The source markup still includes existing EmailJS and Firebase client configuration, but those public app configurations by themselves **do not** mean registration, bookings, account verification or newsletter delivery are live.

## 2. The correct file structure

```
public/
  index.html
  payment-result.html
  _headers
  assets/
    favicon.svg
    hit-commerce.js
    hit-kenya-merch-reference.png
functions/
  _lib/catalog.js
  _lib/http.js
  _lib/paystack.js
  api/store/catalog.js
  api/store/checkout.js
  api/store/order-status.js
  api/paystack/webhook.js
db/schema.sql
.dev.vars.example
package.json
tests/checkout.test.js
```

**Deploy `public/` as the static asset folder. Keep `functions/` OUTSIDE `public/`.** Cloudflare compiles Pages Functions from the top-level `functions/` folder.

## 3. Before enabling customer payments

Confirm the **real merchant details**: HIT KENYA's authorized Paystack business account, merchandise stock, actual prices, dispatch arrangements, exact delivery fees, refund/return rules, and the support email.

The HTML originally contained these **unverified merchandise prices**, reproduced in `functions/_lib/catalog.js`:

| SKU | Product | Existing HTML price | Sizes |
|---|---|---:|---|
| `tshirt` | HIT KENYA T-Shirt | KSh 1,500 | XS–XXL |
| `hoodie` | HIT KENYA Hoodie | KSh 3,500 | S–XXL |
| `cap` | HIT KENYA Cap | KSh 1,000 | ONE SIZE |
| `crop` | Women's Crop Top | KSh 1,800 | XS–XL |
| `backpack` | HIT KENYA Backpack | KSh 2,500 | ONE SIZE |
| `keychain` | HIT KENYA Keychain | KSh 500 | ONE SIZE |

Do not enable unavailable merchandise. `ACTIVE_PRODUCT_IDS` controls which SKUs can be sold. **There is no automatic inventory decrement or stock reservation yet; manage confirmed quantities manually during a controlled initial launch.**

## 4. Create the orders database

1. Log into Cloudflare, open **Workers & Pages > D1 SQL Database**, and create a database named `hit-kenya-orders` (or any name you choose).
2. Open that database's **Console** and run the contents of `db/schema.sql`, or from the project root run:

   ```bash
   npx wrangler login
   npx wrangler d1 execute hit-kenya-orders --remote --file=./db/schema.sql
   ```

3. In the existing HIT KENYA Pages project select **Settings > Bindings > Add binding > D1 database**. The binding name MUST be `DB`. Select the new database and save.

Do **not** expose this database through a public admin API. It contains purchaser contact details.

## 5. Deploy the real website with Cloudflare Pages

**Important:** Dashboard drag-and-drop deployment DOES NOT compile a `functions/` folder. Use Wrangler or a connected Git repository. Use Windows Git Bash / terminal commands like:

```bash
cd /path/to/hit-kenya-premium
npx wrangler login
npx wrangler pages deploy public --project-name YOUR_EXISTING_PAGES_PROJECT
```

Replace `YOUR_EXISTING_PAGES_PROJECT` with your actual Pages project name. For first use you may need to create the Pages project in the Cloudflare dashboard or `npx wrangler pages project create`.

For Git-connected Pages: commit the full project, set the build output directory to `public`, and keep the root `functions` directory available to the deployment system.

If HIT KENYA uses another hosting provider (rather than Cloudflare Pages), these Cloudflare backend functions cannot simply be uploaded as plain HTML. A compatible secure backend must be deployed or ported.

## 6. Configure test Paystack credentials safely

In **Cloudflare > Workers & Pages > HIT KENYA project > Settings > Variables and Secrets**, configure the following runtime values for Production (and Preview if testing there), then **redeploy**:

| Variable | Type | Example / instruction |
|---|---|---|
| `PAYSTACK_SECRET_KEY` | **Encrypted secret** | Your HIT KENYA **test secret key** (`sk_test_...`). Never paste into HTML. |
| `CHECKOUT_ENABLED` | Text | `true` after the database and products are confirmed. |
| `ACTIVE_PRODUCT_IDS` | Text | `tshirt,hoodie,cap,crop,backpack,keychain` ONLY if all are really for sale. |
| `DELIVERY_NAIROBI_KES` | Text | Merchant-confirmed Nairobi delivery fee, whole KES (e.g., replace with actual amount). |
| `DELIVERY_OTHER_KENYA_KES` | Text | Merchant-confirmed delivery fee to other Kenyan counties, whole KES. |
| `LIVE_PAYMENTS_APPROVED` | Text | `false` while using test credentials. |
| `DB` | **D1 binding** | Bind the `hit-kenya-orders` database under the exact name `DB`. |

No shipping rates are invented in this project. Both must be configured, even if the legitimate rate is zero (enter `0`). These are flat zones only; if different counties cost different amounts, extend the shipping engine before accepting those orders.

Check `https://YOUR_DOMAIN/api/store/catalog` — it should respond with `checkoutEnabled:true` after all required settings and bindings are correctly configured.

On the website, select merchandise, add to cart, enter buyer/delivery details, then use the hosted Paystack checkout page. Only **test transactions** should be performed with a test key.

## 7. Set up the Paystack webhook

In **Paystack Dashboard > Settings / Developers > Webhooks**, configure the public live/test webhook URL for the appropriate environment:

```
https://YOUR_LIVE_HIT_KENYA_DOMAIN/api/paystack/webhook
```

HIT KENYA's backend verifies the Paystack `x-paystack-signature` HMAC SHA-512, then independently verifies the transaction with Paystack. It only records a PAID order if the data match the stored server-side order.

Your Paystack merchant account must have the Kenyan M-Pesa payment channel enabled for M-Pesa to appear. Paystack's hosted checkout displays the merchant-enabled payment methods.

For a successful verified order, Cloudflare D1 Console can show:

```sql
SELECT reference, status, buyer_name, email, phone, items_json,
       amount_cents/100 AS total_kes, paid_at, county, town
FROM orders
ORDER BY created_at DESC
LIMIT 50;
```

**Order fulfillment is currently manual.** No automatic email, customer account, physical shipment, stock decrement, or ticket delivery is promised by the payment result page.

## 8. Enable LIVE M-Pesa / card payments after a successful test

1. Confirm the Paystack account is approved for the **HIT KENYA trading entity**, with settlement account and required business verification complete.
2. Test the full transaction path and both the successful and pending/error status screens.
3. Replace the test secret on Cloudflare with the HIT KENYA **live** Paystack secret (`sk_live_...`) as an **encrypted secret**.
4. Set `LIVE_PAYMENTS_APPROVED=true` and keep `CHECKOUT_ENABLED=true`.
5. Confirm activated products, availability, correct prices and real delivery fees. Redeploy.
6. Run a legitimate low-value live purchase, check Paystack dashboard, Cloudflare D1 order status and merchant settlement instructions.
7. Check webhook delivery. Monitor operational fulfillment and investigate pending orders before retrying payment.

To stop all new charges immediately set `CHECKOUT_ENABLED=false` and redeploy. This does not cancel existing pending/paid payments.

## 9. Still needed for a genuinely finished international-grade HIT KENYA platform

**Before a broad public launch:** merchant-verified product photos rather than concept renderings; legal review of privacy, terms, ticket/refund, delivery and returns policies; accessibility testing and browser QA on real devices; verified portfolio/brand claims; correct business contacts; production email confirmations; stock/fulfillment administration; spam/bot protection, operational alerting and reconciliation procedures.

**Future platform features:** event catalogue and ticket inventory sourced from approved organisers, authenticated ticket issuance and private QR scanning, role-based admin, actual Firebase signup/login flows, verified marketplace listings, safe documents/KYC workflow, genuine influencer analytics and payouts, event/media CMS, and complete booking notifications.

Those sections remain frontend demonstrations and are intentionally not connected to payment yet. Do not sell tickets or collect unapproved Foundation contributions until their separate legal and fulfillment workflows exist.

## 10. Basic developer tests

```bash
node --test tests/checkout.test.js
node --check public/assets/hit-commerce.js
```

The JavaScript tests use a **mocked payment provider** and test database. Passing these is **not** equivalent to performing a real transaction in Paystack or proving end-to-end browser behaviour.

## Official documentation

- Paystack: https://paystack.com/docs/payments/accept-payments/
- Paystack API: https://paystack.com/docs/api/transaction/
- Paystack M-Pesa: https://paystack.com/docs/payments/payment-channels/
- Webhooks: https://paystack.com/docs/payments/webhooks/
- Cloudflare Pages Functions: https://developers.cloudflare.com/pages/functions/get-started/
- Cloudflare D1 and secrets: https://developers.cloudflare.com/pages/functions/bindings/
- Cloudflare Direct Upload limitations: https://developers.cloudflare.com/pages/get-started/direct-upload/

**Security note:** never share the Paystack secret key, M-Pesa PIN or admin login credentials in chat, email or public HTML. Enter secrets in the hosting dashboard.
