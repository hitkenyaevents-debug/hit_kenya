# HIT KENYA — Artist Booking Click and High-Quality Images

## What was fixed
The service card displayed as **Content & Digital** in the supplied first screenshot previously called `openServiceDetail('digital')` and could show an unwanted detail popup. Its card body and gold arrow, in both copies on the homepage, now open the premium full **Artist & DJ Booking** page in your third image: **CONNECT. BOOK. EXPERIENCE.**

**Artist Booking** itself also opens that full page. Its existing full-page design remains live HTML with links/buttons. The old *Discover & Book Talent* modal is bypassed for these entry points. The sharper image assets are taken from the full-size image the user supplied; they replace the tiny screenshot crops, but original professional photographs would still be even clearer.

## GitHub upload
- Open the ZIP and upload its **contents**, not the ZIP itself, to the **root** of your GitHub repository. `index.html` must appear in the root beside the `assets/` folder.
- Keep `assets/artists/*-hq.webp` because the artist page refers to these **new filenames** specifically. Upload all other `assets/` files and the three standalone pages too, keeping their folder structure intact.
- `ORIGINAL-BEFORE-THIS-FIX.html` is a backup provided only for comparison; it does not need to be published.
- If using GitHub Pages with a repository site, make sure Pages is configured to deploy from the branch and root containing `index.html`. Your payment backend requires a separate supported server runtime: **GitHub Pages alone cannot run Cloudflare Functions or safely contain Paystack secret keys**.
- After publishing, press Ctrl+Shift+R to reload. To test the artist page directly, open your site's `index.html#artist-booking`.

## Test steps
1. Open `index.html` and click the **Content & Digital** card or gold arrow: the new **CONNECT. BOOK. EXPERIENCE.** page should display (not a popup).
2. Return Home and click **Artist Booking**: the same artist booking page should display.
3. Check the three cards and image quality on desktop and mobile. Confirm `assets/artists/` is published.
4. **View Artists** opens the existing artist marketplace; **Register as an Artist** and **Request Artist Booking** open forms. Live verification, bookings, and payment still require the appropriate backend.

## Preservation
The original HIT KENYA header, homepage, Photography, Event Promotion, Vendor Facilitation, merchandise, Paystack add-on, and other sections are retained. No prices or payment credentials have been changed.
