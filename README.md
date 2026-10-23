# HIT KENYA — Artist Booking Page Correction

## Exact change
- Click **Artist Booking** (either service-card location or the gold arrow) in `index.html` to open the new **CONNECT. BOOK. EXPERIENCE.** Artist & DJ Booking page instead of the old **DISCOVER & BOOK TALENT** popup.
- This page is contained **inside index.html** as an interactive, responsive HTML/CSS page (not a static image).
- Opening the homepage at `index.html#artist-booking` opens the artist page directly.
- The three existing paths are wired: **VIEW ARTISTS** opens the current artist-filtered directory; **REGISTER AS AN ARTIST** opens a separate registration enquiry form; **REQUEST ARTIST BOOKING** opens the existing booking-request enquiry form. These are existing enquiry flows, not a verified booking/payment backend.
- Photography, Event Promotion, Vendor Facilitation, merchandise and Paystack-related assets are unchanged.

## Files to upload
Upload **index.html** AND the entire **assets/** directory together. Do not upload only `index.html` because the page requires `assets/artists/` images.
Other standalone pages are also included and should stay alongside `index.html`.

## Preview
Open `index.html` in a browser; click the Artist Booking tile. Confirm you see CONNECT. BOOK. EXPERIENCE., the three artist cards and the HIT KENYA ARTIST NETWORK strip. Test on a mobile viewport and the back-to-home action.

## Reference limitations
The supplied artist-page screenshot was **720×480 px**. Its concert/studio/event photographic regions are extracted and upscaled as reference-faithful placeholders. These cannot reproduce the detail of original high-resolution photographs. The page headings, buttons and descriptions are clean HTML/CSS and remain sharp at normal browser resolutions. Replace the image files in `assets/artists/` with original photography for production-quality visuals.

## Deployment
Replace your published `index.html` and upload `assets/artists/`. If using Cloudflare Pages, deploy the project together with existing Functions and Paystack files; do not expose secret API credentials in HTML. Hard refresh with Ctrl+Shift+R after deployment.

## Verification
Source-code/navigation/assets/syntax checks performed. No live deployment or payment/booking transaction was performed.
