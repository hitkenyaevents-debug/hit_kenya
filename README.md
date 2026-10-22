# HIT KENYA — Event Promotion Strategy click correction

## What changed
- Event Promotion Strategy card and gold arrow now open the new full premium marketing services page, **not** the Marketing Strategies & Resources popup.
- The marketing page is embedded into `public/index.html` and also available separately as `public/event-promotion.html`.
- The page includes hero, service offerings, strategy section, illustrative campaign cards and calls-to-action.
- Support/quote actions reuse the homepage's existing marketing enquiry workflow.
- Both the original Photography & Videography navigation and the original homepage and Paystack add-on files are preserved.

## To use
Replace the deployed `index.html` with the one inside `public/`. If Cloudflare Pages is your host, deploy the whole project folder using your existing Git/CLI method to retain Functions and payment files. Don't drag-and-drop only the HTML if you need Paystack Functions.

## Important
- The marketing showcase photos are illustrative until HIT KENYA's verified project photos are supplied. No invented client counts or testimonials are presented as true.
- Front-end page interactions are implemented; production booking/email handling still depends on completing the existing application backend.
- Test the website in a browser on mobile and desktop before deploying.
