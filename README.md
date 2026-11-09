# HIT KENYA — Brand & Digital Growth page

This is an **add-only** package. It does not contain or replace `index.html` or any existing website page.

## Install on GitHub Pages

1. Extract the ZIP.
2. Upload `brand-digital-growth.html` and the `assets/` folder into your website's main folder (alongside the existing `index.html`). Keep the `assets/` folder structure.
3. On your existing `index.html`, find the Brand & Digital Growth card button:

```html
<button type="button" class="hk-digital-card-action" onclick="openPartnerFlow('digital')">REQUEST A DIGITAL PACKAGE →</button>
```

Replace **only that button** with:

```html
<button type="button" class="hk-digital-card-action" onclick="window.location.href='brand-digital-growth.html'">REQUEST A DIGITAL PACKAGE →</button>
```

Do **not** replace your homepage or other pages. The brand page's Back button points to `index.html#services`.

## Functionality

- One responsive page with six service categories and Starter, Pro and Premium packages.
- Package buttons and the final CTA open an enquiry form within the same page.
- The form checks required fields and prepares a message to the HIT KENYA WhatsApp number already used on the existing site (`254797068736`). **The visitor must click Open WhatsApp and press Send**. There is no automatic backend submission or payment processing.
- The optional detailed-brief link goes to the existing `tell-us-your-goal.html` page.
- Real photographic images are loaded from Unsplash when online. Local compressed photographic fallbacks are included so the layout still looks complete without external images. Fonts use Google Fonts with system fallbacks.
- The prices are transcribed from the supplied screenshot and are presented as package guide rates. Confirm rates before publishing.

## Size

The package is deliberately small, with one HTML page, two compressed fallback photos and this README. There are no generated preview images or duplicate website files inside the ZIP.
