# HIT KENYA — Event Venues full-page update (GitHub-ready)

## What changed
Clicking **Event Venues**, either anywhere on its card or on its gold arrow, now opens `#event-venues` with the complete responsive **THE RIGHT SPACE FOR EVERY OCCASION** page. It does **not** open the old `FIND OR LIST A VENUE` popup.

The new page has a branded hero, three native HTML service cards (Find a Venue, List Your Venue, Book Through HIT KENYA), venue photographs, category footer, and the existing marketplace and application flows. The high-resolution photo crops are derived from an enhanced concept image, **not** verified images of real, bookable properties. Text remains real HTML, not flattened image text.

## GitHub upload
1. Extract the ZIP. Upload the **contents** to the GitHub repository root, not the wrapping ZIP or parent directory.
2. Replace `index.html` and upload the entire `assets/` folder, including `assets/venues/`. Also retain the supplied `functions/`, `db/` and other files, rather than deleting them.
3. Redeploy your hosting service and hard-refresh with Ctrl+Shift+R. Test clicking both Event Venues cards and direct navigation to `#event-venues`.
4. The three buttons use the existing marketplace listing filter, Venue Owner registration preview, and a new Venue Assistance enquiry preview.

## Important limitations
- The marketplace listings and booking availability are illustrative; none are confirmed as real-time live inventory.
- Venue owner registration and venue assistance forms are **frontend prototypes**. They do not actually send requests to a live server/database until a production backend is added. Do not collect sensitive IDs or documents through an unprotected static site.
- Previously bundled Paystack Cloudflare Pages Functions, schema and add-on are preserved from the prior version. Live payments still require secure Cloudflare/D1 setup and transaction verification. GitHub Pages by itself cannot execute Cloudflare Functions.
- Images from the generated concept are visual placeholders; replace them with authorized, high-resolution photographs of actual HIT KENYA venues before advertising specific inventory.
