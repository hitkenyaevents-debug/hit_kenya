# HIT KENYA — Event Promotion high-quality update (GitHub-ready)

This package is based on the latest Fun Base Coming Soon consolidated project and retains other website sections and the existing Paystack backend scaffolding.

## What changed

- `index.html`: The Event Promotion Strategy homepage card and the Book HIT Kenya service button both open the updated full Event Promotion webpage, rather than the old compact marketing popup.
- `event-promotion.html`: Standalone version of the same fully styled webpage.
- `assets/marketing/`: Locally bundled, higher-resolution background and campaign-concept images. The primary concert hero is 1648×928 source pixels and remains a background photograph, not a flattened image of the page.
- The headings, service cards, navigation, CTAs and forms are real HTML elements, retaining crisp text and interactions at various screen sizes.

## Deploy

1. Unzip the archive.
2. Upload the archive **contents**, not the surrounding directory, to the root of your GitHub repository.
3. Preserve the `assets` directory, `functions`, `db`, and environment/template files. Files under `functions` work on Cloudflare Pages Functions, not GitHub Pages.
4. Deploy and hard refresh the browser. Select **Event Promotion Strategy** (either homepage card or Book HIT Kenya menu).
5. Check `index.html` and `event-promotion.html` on desktop and mobile.

## Accuracy and production notes

- The concert hero and other image assets are **illustrative/AI-generated** and do not represent documented HIT KENYA client events.
- The original screenshot contained unverified performance totals and testimonials. Those were not copied into the working page as factual claims. Replace the illustrated categories with real approved campaign imagery, client testimonials and audited outcomes when available.
- Marketing support CTA uses the existing `openPartnerFlow('marketing')` frontend workflow and still needs a production submission backend.
- Paystack code is preserved but live processing requires configured credentials, a secure backend, and completed testing. Never put a Paystack secret key into frontend HTML.

# HIT KENYA — Fun Base Coming Soon (complete website)

This is the complete HIT KENYA website, updated from the latest realistic Event Venues package. **HIT KENYA Fun Base now opens the new full-screen COMING SOON view** when the user clicks its homepage card, gold arrow, service-menu card or work-section link. The existing site sections and previously prepared Cloudflare/Paystack code are retained.

## Publish to GitHub
1. Extract the ZIP file. Upload **all the contents** of this folder into the root of your repository, rather than uploading the ZIP itself.
2. Keep `index.html` and `assets/` side by side. Do not forget `assets/funbase/` or the approved photograph fragments will be missing.
3. Commit the changes and redeploy the hosting service. Then open `index.html#fun-base`, or click the Fun Base card, and confirm the Coming Soon page appears.
4. Check the website on a phone. Hard refresh if previously cached.

## What changed
- One new routed HTML section, `#fun-base`, with black/gold Coming Soon design and accessible text.
- Both visible Fun Base service-card click handlers and the Work-section Fun Base link now open that section.
- The legacy Fun Base detail handler also routes to the new Coming Soon view rather than exposing the unbuilt member chat.
- Added `assets/funbase/` with two background image crops from the approved concept design and a smaller copy of the full design for reference.
- All other existing page sections, commerce files, booking previews, other image assets and backend source files are preserved.

## Launch caution
Fun Base is **COMING SOON** only; live chats, authentication and member messaging have **not** been activated. Paystack integration source files remain included but payments require merchant configuration, server deployment, secrets and independent checkout verification before activation. Cloudflare Pages Functions cannot run on GitHub Pages alone. Never place Paystack secret keys in public HTML or GitHub.
