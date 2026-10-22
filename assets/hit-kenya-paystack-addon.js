/* HIT KENYA: minimally invasive payment connector. Original layout, CSS and sections are untouched.
 * Cloudflare Pages Functions are REQUIRED. No Paystack secret is stored in this file.
 */
(() => {
  'use strict';
  const SKU = Object.freeze({
    'HIT KENYA T-Shirt': 'tshirt',
    'HIT KENYA Hoodie': 'hoodie',
    'HIT KENYA Cap': 'cap',
    "Women's Crop Top": 'crop',
    'HIT KENYA Backpack': 'backpack',
    'HIT KENYA Keychain': 'keychain'
  });
  const el = id => document.getElementById(id);
  const kes = n => `KSh ${n.toLocaleString('en-KE')}`;
  let checkoutInProgress = false;

  // Fix only selected-variant handling; reuse the original cart and cart UI.
  window.addToCartSelected = function (button, name, price) {
    const article = button.closest('.shop-product');
    const size = article?.querySelector('.size-pills button.selected')?.textContent?.trim();
    if (!SKU[name] || !size) {
      window.showNotice('cartMessage', 'Select a product size or option first.', false);
      return;
    }
    window.addToCart(name, price, size); // Original function, original UI.
    const row = hkCart.find(item => item.name === name && item.size === size);
    if (row) row.id = SKU[name];
  };

  async function loadCatalogue() {
    try {
      const response = await fetch('/api/store/catalog', {cache: 'no-store'});
      const payload = await response.json();
      if (!response.ok || !payload.ok || !Array.isArray(payload.products)) throw new Error('Unavailable');
      return payload;
    } catch (_) {
      throw new Error('Secure payment service is not connected yet. No payment has been made.');
    }
  }

  // Replace only the original DEMO checkout handler. All other site functions remain unchanged.
  window.submitMerchCheckout = async function () {
    if (checkoutInProgress) return;
    const name = el('merchName')?.value.trim() || '';
    const email = el('merchEmail')?.value.trim() || '';
    const phone = el('merchPhone')?.value.trim() || el('merchWhatsapp')?.value.trim() || '';
    const county = el('merchCounty')?.value.trim() || '';
    const town = el('merchTown')?.value.trim() || '';
    const address = el('merchAddress')?.value.trim() || '';
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || !phone || !county || !town || !address) {
      window.showNotice('merchCheckoutMessage', 'Please complete your name, email, phone, county, town and delivery address.', false);
      return;
    }
    if (!hkCart.length) {
      window.showNotice('merchCheckoutMessage', 'Your shopping cart is empty.', false);
      return;
    }
    const zone = county.toLowerCase() === 'nairobi' ? 'nairobi' : 'rest_of_kenya';
    const items = hkCart.map(item => ({id: item.id || SKU[item.name], size: item.size, qty: item.qty}));
    checkoutInProgress = true;
    try {
      const catalogue = await loadCatalogue();
      if (!catalogue.checkoutEnabled) throw new Error('Online checkout has not been activated by HIT KENYA. No payment has been made.');
      const subtotal = items.reduce((total, item) => {
        const product = catalogue.products.find(product => product.id === item.id && product.available);
        if (!product || !product.sizes.includes(item.size)) throw new Error('One item is unavailable. Contact HIT KENYA before paying.');
        return total + product.priceKes * item.qty;
      }, 0);
      const delivery = catalogue.shippingFees[zone];
      if (!Number.isInteger(delivery) || delivery < 0)
        throw new Error('Delivery pricing is not yet configured. No payment has been made.');
      const total = subtotal + delivery;
      const confirmed = window.confirm(
        `HIT KENYA — REVIEW YOUR ORDER\n\nMerchandise: ${kes(subtotal)}\nDelivery (${zone === 'nairobi' ? 'Nairobi' : 'Other Kenyan counties'}): ${kes(delivery)}\nTOTAL: ${kes(total)}\n\nContinue to secure Paystack checkout?`
      );
      if (!confirmed) return;
      window.showNotice('merchCheckoutMessage', 'Preparing your secure Paystack checkout…');
      const method = el('merchPayment')?.value === 'M-Pesa' ? 'mpesa' : 'other';
      const response = await fetch('/api/store/checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, phone, county, town, address, zone, method, items})
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok)
        throw new Error(payload.message || 'Checkout is temporarily unavailable.');
      // Fail closed if payment fees or product prices changed after confirmation.
      if (payload.totalKes !== total)
        throw new Error(`Your total has changed to ${kes(payload.totalKes)}. Please review your order again before paying.`);
      const redirect = new URL(payload.authorizationUrl);
      if (redirect.protocol !== 'https:' || !(
        redirect.hostname === 'paystack.com' || redirect.hostname.endsWith('.paystack.com')))
        throw new Error('Invalid payment destination. No payment has been made.');
      try { sessionStorage.setItem('hk_merch_order_reference', payload.reference); } catch (_) {}
      window.location.assign(redirect.href);
    } catch (error) {
      window.showNotice('merchCheckoutMessage', (error.message || 'Payment could not start.') + ' Please try again or contact HIT KENYA.', false);
    } finally {
      checkoutInProgress = false;
    }
  };
})();
