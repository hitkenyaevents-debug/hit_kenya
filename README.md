# HIT KENYA — Car Hire & Stays | GitHub-ready website

## Corrected behaviour
Click **Car Hire & Stays** (the card body or its gold arrow) on the homepage or in **View All Services**. It now opens the full **TRAVEL. STAY. MOVE.** page, not the old **BOOK OR BECOME A VERIFIED DEALER** popup. URL: `#travel-hire`.

The four cards are real HTML elements, not one flat image:
- **View Stays** → existing marketplace Stays category (`#stays`)
- **Explore Cars** → existing marketplace Transport category (`#cars`)
- **Become a Partner** → a choice of property/stay or car-hire dealer registration
- **Request Assistance** → a travel enquiry form (frontend prototype)

The generated photo design is the visual reference. Text, layout, buttons and navigation are native HTML so remain legible and responsive. The `assets/travel/` photographic crops were prepared from the enhanced reference; they are not original property or vehicle listings.

## Upload to GitHub
1. Extract `HIT-KENYA-CAR-HIRE-STAYS-GITHUB-READY.zip`.
2. Upload **all files and directories inside it** into the **repository root** (where your existing `index.html` lives). Do not upload the containing ZIP folder as a nested directory.
3. Replace existing `index.html` and upload/overwrite `assets/` including `assets/travel/`.
4. Keep any deployment/backend settings and separate Paystack secret values on your server/Cloudflare, never in GitHub HTML.
5. Redeploy your host and hard-refresh with Ctrl+Shift+R. Test the Car Hire & Stays card, its arrow, `#travel-hire` directly, and the buttons.

## Important production limitations
- Visible marketplace listings and rates are existing demonstration content; **availability, verification and quotes are not live-confirmed**.
- Dealer forms and travel assistance requests are frontend previews until connected to database and email/CRM services. Do not enter real ID documents or personal data for production use yet.
- The original Paystack Cloudflare Pages functions (`functions/`), D1 schema (`db/schema.sql`), callback (`payment-result.html`) and browser add-on (`assets/hit-kenya-paystack-addon.js`) are carried over **unchanged** from the earlier preserved Paystack package. **Payments are NOT live by default**. To activate, deploy with Cloudflare Pages Functions (GitHub Pages alone cannot run those endpoints), configure D1 and the environment secrets securely, confirm pricing and stock, and test server-side transaction verification. Never commit keys or customer documents.
- Other areas—Photography, Event Promotion, Vendor Facilitation, Artist Booking, Content & Digital and merchandise—remain in the code. Their live integrations must be tested independently.

## Files to confirm after upload
- `index.html` — the updated homepage with the complete Car Hire & Stays page and all prior sections
- `assets/travel/` — premium image assets and reference
- `assets/digital/`, `assets/artists/`, `assets/vendor/`, `assets/merch/` — prior sections' images
- `functions/`, `db/schema.sql`, `payment-result.html` — unchanged earlier Paystack backend components (Cloudflare Pages only)
- `CAR-HIRE-STAYS-1440-PREVIEW.png` and `CAR-HIRE-STAYS-390-PREVIEW.png` — screenshots of the isolated HTML travel page

Note: Hero/card imagery consists of crops from an enhanced/generated design reference, not photographs verified as actual properties or available cars. The visual screenshots are examples, not live listings or booking guarantees.
