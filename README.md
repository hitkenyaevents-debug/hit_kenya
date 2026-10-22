# HIT KENYA — Vendor Facilitation correction

## What changed
Clicking the **Vendor Facilitation** card (or its gold arrow) now opens the complete **Turn Your Products & Services Into Opportunities** page shown in your latest third screenshot. It does not open the old vendor popup and does not redirect to merchandise.

The new vendor page is embedded in the corrected `index.html`, works via `#vendor-facilitation`, and contains three actionable services: vendor registration, vendor discovery, and vendor management requests. These reuse the existing HIT KENYA frontend forms and marketplace functions; they are not a live verified vendor database.

## Installation
Replace your current site's root `index.html` with this one and copy `assets/vendor` into the same website's `assets/vendor` directory. Preserve every other file and backend component already on your server. If deploying the whole package, note the included `assets/merch` pictures are kept from your prior merchandise design. Browser hard refresh: Ctrl+Shift+R.

## Preserved
Previously revised merchandise layout, photography page and portfolio, Event Promotion page, rest of site navigation and Paystack frontend JS are retained. No unrelated action handler is modified.

## Source image quality
For layout fidelity, vendor hero and card photos were cropped from the supplied screenshot (720px original). Higher-resolution vendor photos should replace them before final production publication.

## Testing
Static route checks can be performed against the HTML locally. Always test desktop and mobile click behaviour in your actual deployed browser. The existing partner registration forms are frontend demonstrations and require backend connection before they can accept live registrations.
