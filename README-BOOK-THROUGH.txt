HIT KENYA — BOOK THROUGH HIT KENYA (3-STEP BOOKING)
===================================================

THIS IS AN ADD-ON PATCH, NOT A NEW WEBSITE.

Based on the previously provided HIT-KENYA-ARTIST-REGISTRATION-20261104 website.
Only the Book Through HIT KENYA card and artist-booking action were modified
in index.html. The Join as Artist page and all other existing sections are preserved.

FILES IN THIS ZIP (3 total):
  index.html                                Existing full homepage, minimally patched
  artist-booking.html                       New 3-step artist booking page
  README-BOOK-THROUGH.txt                   This guide

UPLOAD TO YOUR EXISTING GITHUB REPOSITORY:
1. FIRST: back up your current live index.html.
2. Extract this ZIP on your computer. DO NOT upload the ZIP itself to GitHub.
3. Upload artist-booking.html to your existing repository ROOT.
4. The booking photo is already inside artist-booking.html; no image folder needed.
5. If your current index.html is still the version we last worked on (artist
   registration version, 4 Nov 2026), upload the included patched index.html
   and allow GitHub to replace index.html. All other files remain untouched.
6. If you have since changed index.html, DO NOT overwrite it. Instead edit
   ONLY the existing BOOK THROUGH HIT KENYA button's onclick to:
      onclick="window.location.href='artist-booking.html'"
   You can also make its whole card clickable, but that is optional.
7. Commit changes and open your site: index.html#artist-booking. Click the
   Book Through HIT KENYA card or REQUEST ARTIST BOOKING button.
8. Confirm three steps: EVENT DETAILS -> ARTIST & BUDGET -> REVIEW & SEND.

WHAT THE BOOKING FORM DOES:
- Checks required fields and booking date.
- Collects event, contact, talent preference and budget information.
- Reviews entries on step 3.
- Opens WhatsApp with a prepared message to the number already on the HIT KENYA
  website: +254 797 068 736. The customer must press Send in WhatsApp.
- Does NOT store requests on a backend or confirm bookings/payments.

PHOTO:
- Uses a real Unsplash concert stock-photo URL as the main hero when online.
- Includes an embedded local WebP fallback reused from the previously supplied
  HIT KENYA website, so the page works without additional image files.
- Images are illustrative, not verified HIT KENYA events or talent.

DO NOT DELETE OR REPLACE YOUR EXISTING ASSETS OR OTHER HTML PAGES.
DO NOT UPLOAD THIS AS A NEW EMPTY REPOSITORY: IT IS AN ADD-ON TO YOUR SITE.
