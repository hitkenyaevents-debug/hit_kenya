# HIT KENYA — Vendor Facilitation image-quality update

## What this fixes
When the visitor clicks **Vendor Facilitation** or its gold arrow on `index.html`, the dedicated interactive **Turn Your Products & Services Into Opportunities** page opens. The previous low-resolution photos have been replaced with cleaner photo crops from the sharper user-supplied design screenshot.

The HTML is still interactive. The hero, cards, headings and buttons are **not** replaced by one flat image. The provided original high-resolution screenshot is included under `assets/vendor/vendor-page-reference-high-quality.png` for reference only.

## How to upload
Upload **`index.html` and the entire `assets/` directory** together to the same root folder on your web host. Do not upload `index.html` on its own: it references `assets/vendor/*`, merchandise images, and the Paystack add-on. Preserve any backend payment functions/configuration already on your site.

The vendor service's *Join Vendor*, *Explore Vendors* and *Request Vendor Management* actions are wired to the existing site workflows. Actual registration submissions require the site's production backend and appropriate verification.

## Scope
Only vendor-page image assets and a small set of vendor-specific CSS rules were changed. The Photography, Event Promotion, Merchandise and other homepage screens were not deliberately redesigned or redirected.

## Quality limitation
This is a source-upgrade from the best screenshot provided (1224x1285); original uncompressed camera photographs would allow still higher quality on very large desktop displays.
