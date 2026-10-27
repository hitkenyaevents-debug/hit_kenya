# HIT KENYA | Consolidated website | Event Venues photographic update

This is the complete website, based on the latest Event Venues GitHub-ready version, with its **venue images replaced using the more natural-looking approved reference**. It does not replace pages with screenshots: hero copy, cards, navigation, enquiry buttons, and forms remain HTML/JavaScript.

## GitHub deployment

1. Download and extract the ZIP. Upload the **contents** of the extracted folder to the root of your GitHub repository (not the ZIP file itself).
2. The root must contain `index.html`, `assets/`, `functions/`, `db/`, `payment-result.html`, and the other supplied files.
3. Commit changes; trigger a fresh deployment. If you use Cloudflare Pages, connect the repository and set up its Pages Functions and D1 database separately before enabling payments.
4. Reload the live website (Ctrl+Shift+R). Click the **Event Venues** card: it should open **THE RIGHT SPACE FOR EVERY OCCASION**, not the old “Find or List a Venue” popup.
5. Test navigation and mobile screens. The photography, vendor, artist, digital, transport, event promotion and merchandise sections are still included.

## Image notes

- `assets/venues/venue-hero.webp` and six venue-card images are exported from the more natural-looking reference design supplied in the conversation. The original reference is included as `assets/venues/EVENT-VENUES-APPROVED-REALISTIC-DESIGN.png`.
- These are **illustrative concept images**, not authentic listings or photographs proving particular venues exist. Replace with authorized original venue photography before representing any property as genuinely available or verified.
- The source reference is a flattened image; making some areas clearer through resizing does **not** restore detail that was absent in that source. The navigation and important text remain real HTML.

## Payment and functional status

Paystack integration code and Cloudflare Pages Functions are retained from the prior project, but **live payments are not enabled** until the merchant config, verified prices, D1 binding, secret keys and live checkout/webhook testing are completed. Do not put Paystack secret keys in the HTML or the GitHub repository. Some directory, onboarding and booking features remain frontend demonstrations.

## Files

- `index.html` — the exact updated main homepage; also downloadable separately
- `assets/venues/` — approved realistic artwork cropped for the interactive venue page
- Other `assets/`, `photography.html`, `event-promotion.html`, `photography-portfolio.html` — preserved
- `functions/`, `db/`, `.dev.vars.example`, `package.json` — prior Paystack backend files preserved
