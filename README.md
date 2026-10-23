# HIT KENYA – Content & Digital Marketing (GitHub upload)

## Exact correction
The **Content & Digital** service card (both on the homepage and inside the services popup) now opens the complete **CREATE. ENGAGE. GROW.** page within `index.html` via the `#content-digital` route. It no longer launches Artist Booking or a generic service popup. The Artist Booking card continues to open the Artist Booking page. Vendor Facilitation, Event Promotion, Photography and Merchandise remain in place.

## GitHub deployment
1. Extract `HIT-KENYA-CONTENT-DIGITAL-FINAL-GITHUB.zip`.
2. Upload the **contents** of the extracted folder (not an extra containing folder) to the root of your GitHub website repository.
3. Replace `index.html` and upload the entire `assets/` directory. Preserve the `assets/digital/` path exactly. Keep any existing Paystack backend files in your repository unchanged.
4. Wait for your GitHub Pages / connected Cloudflare deployment to finish, then hard-refresh (Ctrl+Shift+R).
5. Test `https://YOUR-WEBSITE/#content-digital` and clicking **Content & Digital** from both the homepage and service-selection popup. Clicking Artist Booking should still open its separate artist page.

## Image quality
The supplied 720×480 reference is low-resolution. The included photographic crops use an enhanced 1536×1024 recreation of the reference; webpage headlines, service descriptions and actions are sharp native HTML, not text baked into the image. Full original images (camera shoot, digital marketing, laptop/product photos) would support even better photographic fidelity. `assets/digital/CONTENT-DIGITAL-HIGH-QUALITY-REFERENCE.png` is a visual reference, **not** a substituted screenshot of the website.

## Functionality and payments
Buttons such as GET CONTENT SOLUTIONS and START A CAMPAIGN open the existing Content & Digital inquiry preview form. The form does not submit to a production customer database yet. Paystack remains separately configured, and this fix does not claim to activate payments.
