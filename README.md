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
