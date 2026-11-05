# HIT KENYA — Artist Booking Request

This is a lightweight, responsive, three-step artist booking enquiry page.

## Files
- `index.html` — complete page. CSS and JavaScript are included in this file.
- No build tools, package installation, or framework required.

## Add it to your existing HIT KENYA website
1. Extract the `artist-booking` folder into the root of your website repository.
2. Link the **REQUEST ARTIST BOOKING** card/button to:
   `artist-booking/index.html`

Example:
```html
<a href="artist-booking/index.html">REQUEST ARTIST BOOKING →</a>
```

If the page is placed somewhere else, update that link to the correct relative path. The header/footer Back links currently point to `../index.html`.

## Images and file size
The page uses photographic image URLs hosted by Unsplash, rather than bundling large image files. This keeps the download small. An internet connection is required for the photos and Google Fonts to load.

## Important before going live
The form validates all three steps and saves a demonstration enquiry in the visitor's browser (`localStorage`). It does not yet email HIT KENYA or send data to a server. Connect the submit handler in `index.html` to your real form endpoint, CRM, or backend before accepting live bookings.

## Photo assets
The hero and event imagery are photographic Unsplash assets (photo IDs `1493225457124-a3eb161ffa5f` and `1501386761578-eac5c94b800a`). They are loaded remotely to keep the ZIP lightweight.
