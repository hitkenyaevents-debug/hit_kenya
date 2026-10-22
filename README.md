## Photography and videography navigation (22 October 2026)

See **PHOTOGRAPHY-CHANGE-SUMMARY.txt**. The original photography popup no longer opens from either photography service card; a new photo/video main page opens first, while portfolio is a second page. Everything else is retained.

---

# HIT KENYA — ORIGINAL DESIGN PRESERVED, PAYSTACK CONNECTOR ADDED

**This is a correction to the earlier redesign, NOT another redesign.**

## What was and was NOT changed

- `ORIGINAL-UNMODIFIED.html` is a byte-for-byte copy of the complete HTML you supplied, including the embedded artwork. It is provided for comparison and safekeeping.
- `public/index.html` retains all original colour styling, typography, sections, photos, navigation, merchandise cards, event layouts, influencer dashboard, email configuration, Firebase configuration, Google Analytics and social links.
- The **ONLY** edits inside `public/index.html` are six `ADD TO CART` button handlers (they now use the currently selected product size, and the apostrophe in Women's Crop Top no longer breaks the button) and **one added script reference** before `</body>`.
- `public/assets/hit-kenya-paystack-addon.js` is separate code for the corrected size selection and secure Paystack handoff. It reuses the original cart, modals and message styling. It adds **no new CSS** and performs **no visual redesign**.
- `public/payment-result.html` is a separate new payment-status page; it is not part of or a replacement for the original homepage.
- Backend (`functions/`, `db/`) and tests are new files. They do not replace the original website's Firebase app settings or other sections.

**Important:** The original Events/Ticket Verification, influencer balances, organiser applications, newsletter, media data, and sample booking screens are still frontend demos. We did NOT turn them into production systems or certify them as real. In particular, the original sample ticket verifier MUST be replaced by a real authenticated verifier before real tickets are issued or accepted.

## Paystack connection (Cloudflare Pages + Cloudflare D1)

Paystack checkout is connected in source code but is OFF by default. Nobody can be charged until the real merchant explicitly configures the backend and enables checkout. Never put an `sk_test_` or `sk_live_` secret in the public HTML, Firebase web config, client-side script or Git repository.

### Step 1 — Confirm product availability, prices and shipping

Confirm these prices reproduced **unchanged from the original HTML**. They are **NOT verified live product prices**:

| Product | KES | Sizes/Options |
| --- | ---: | --- |
| HIT KENYA T-Shirt | 1,500 | XS, S, M, L, XL, XXL |
| HIT KENYA Hoodie | 3,500 | S, M, L, XL, XXL |
| HIT KENYA Cap | 1,000 | ONE SIZE |
| Women's Crop Top | 1,800 | XS, S, M, L, XL |
| HIT KENYA Backpack | 2,500 | ONE SIZE |
| HIT KENYA Keychain | 500 | ONE SIZE |

The merchant-controlled prices are in `functions/_lib/catalog.js`. Only product IDs explicitly listed in `ACTIVE_PRODUCT_IDS` may be sold. There is NO automatic real-time inventory management yet: keep unavailable goods disabled and reconcile stock manually before accepting paid orders. You must supply confirmed delivery charges for Nairobi and all other Kenyan counties; **no shipping prices have been invented**. A flat fee outside Nairobi is unsuitable unless you can honour it for all accepted destinations. For detailed per-town charges, extend the shipping calculation before activation.

### Step 2 — Prepare Cloudflare Pages and D1

Cloudflare Pages is used for the secure backend in this package. If HIT KENYA is hosted on Firebase Hosting or elsewhere, the payment backend will need porting/deployment rather than just copying the HTML. An ordinary HTML upload will NOT activate the payment endpoints.

1. In Cloudflare > Workers & Pages > D1, create a database (e.g. `hit-kenya-orders`).
2. Execute `db/schema.sql` against it using the D1 Console, OR using Wrangler CLI:

```bash
npx wrangler login
npx wrangler d1 execute hit-kenya-orders --remote --file=./db/schema.sql
```

3. In the HIT KENYA Cloudflare Pages project settings, bind the D1 database under the exact variable name `DB`.
4. Use Git-integrated deployment with root `functions/` and static output directory `public`, or use Wrangler deployment. **Cloudflare dashboard drag-and-drop does not deploy Pages Functions.**

```bash
npx wrangler pages deploy public --project-name YOUR_ACTUAL_PAGES_PROJECT
```

Do not execute this with `YOUR_ACTUAL_PAGES_PROJECT` unchanged. The exact project name must be confirmed first. This package does not deploy itself.

### Step 3 — Add server-side settings (never in HTML)

In Cloudflare Pages > Settings > Variables and Secrets set these for your test environment, and redeploy:

| Name | Test-stage instruction |
| --- | --- |
| `PAYSTACK_SECRET_KEY` | Your private Paystack **TEST** secret key, configured as a secret |
| `CHECKOUT_ENABLED` | `true` only when your test data/stock/shipping are ready; otherwise `false` |
| `LIVE_PAYMENTS_APPROVED` | `false` until final merchant approval and live testing |
| `ACTIVE_PRODUCT_IDS` | Only confirmed, available SKUs, e.g. `tshirt,hoodie` |
| `DELIVERY_NAIROBI_KES` | **Real approved amount**; do not invent it |
| `DELIVERY_OTHER_KENYA_KES` | **Real approved amount** for every location you accept |
| `DB` | D1 binding, NOT a text variable |

See `.dev.vars.example` for placeholders. Configure the Paystack webhook endpoint as `https://YOUR-REAL-DOMAIN/api/paystack/webhook` on the Paystack dashboard. There is no Paystack secret key in the ZIP.

### Step 4 — Test customer flow

1. Open the original-looking website > **Merch**.
2. Select a size; `ADD TO CART` now retains the selected variant.
3. Open cart > checkout; enter genuine buyer/delivery details.
4. The customer sees merchandise, delivery and total before approving checkout.
5. The backend saves a pending order in D1, calculates prices independently and initializes Paystack using the private server-side key.
6. Hosted Paystack checkout accepts only payment methods enabled for your merchant. Choosing M-Pesa in the original field requests the `mobile_money` channel. Kenyan merchant M-Pesa availability must be enabled on your Paystack account.
7. The customer returns to `payment-result.html`. A webhook and a server-side Paystack verification check the reference, paid status, exact amount, currency, customer email, and test/live mode before an order can be marked paid. Merely visiting the result URL never marks an order paid.
8. Confirm the order in D1/Paystack and complete fulfilment manually after verified payment.

**Do not enable LIVE payments** until all merchandise prices, stock availability, delivery service coverage, return/refund terms, order fulfilment and end-to-end M-Pesa test outcomes are confirmed. To enable live charges, install your `sk_live_` secret, set `LIVE_PAYMENTS_APPROVED=true` and `CHECKOUT_ENABLED=true` only after approval.

### Step 5 — Automated checks

```bash
node --test tests/*.test.js
```

The tests cover HTML preservation, selected-size handling, disabled payments, server-side calculations, bad basket rejection, correct transaction verification and unsigned webhook rejection. Live provider end-to-end payments and actual device/browser testing have NOT been completed.

## Structure

```
ORIGINAL-UNMODIFIED.html              # Your supplied file without changes
public/index.html                    # Same design; 6 button fixes + 1 extra script tag
public/assets/hit-kenya-paystack-addon.js
public/payment-result.html           # New isolated receipt/status page
functions/_lib/*                     # Secure server-only catalogue and Paystack utilities
functions/api/store/*                # Catalogue, checkout, payment status
functions/api/paystack/webhook.js    # Signed Paystack event handler
 db/schema.sql                       # D1 order records
tests/*.test.js
.dev.vars.example                    # Placeholder-only variables (NO real keys)
```

## Official documentation
- https://paystack.com/docs/payments/accept-payments/
- https://paystack.com/docs/payments/webhooks/
- https://paystack.com/docs/payments/payment-channels/
- https://developers.cloudflare.com/pages/functions/get-started/
- https://developers.cloudflare.com/pages/functions/bindings/
