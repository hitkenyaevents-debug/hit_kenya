// HIT KENYA merchant-controlled server catalogue.
// Prices below are transcribed from the supplied HTML, NOT independently confirmed.
// They remain unavailable for purchase until ACTIVE_PRODUCT_IDS enables them.
export const PRODUCTS = Object.freeze({
  tshirt:   { name: 'HIT KENYA T-Shirt', priceKes: 1500, sizes: ['XS','S','M','L','XL','XXL'] },
  hoodie:   { name: 'HIT KENYA Hoodie', priceKes: 3500, sizes: ['S','M','L','XL','XXL'] },
  cap:      { name: 'HIT KENYA Cap', priceKes: 1000, sizes: ['ONE SIZE'] },
  crop:     { name: "Women's Crop Top", priceKes: 1800, sizes: ['XS','S','M','L','XL'] },
  backpack: { name: 'HIT KENYA Backpack', priceKes: 2500, sizes: ['ONE SIZE'] },
  keychain: { name: 'HIT KENYA Keychain', priceKes: 500, sizes: ['ONE SIZE'] },
});
const kesFee = value => {
  if (typeof value !== 'string' || !/^\d{1,6}$/.test(value)) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) && n <= 50000 ? n : null;
};
export function shipping(env){ return {nairobi:kesFee(env.DELIVERY_NAIROBI_KES),rest_of_kenya:kesFee(env.DELIVERY_OTHER_KENYA_KES)}; }
export function activeProducts(env){
  const ids = String(env.ACTIVE_PRODUCT_IDS || '').split(',').map(v=>v.trim()).filter(Boolean);
  return new Set(ids.filter(id=>Object.hasOwn(PRODUCTS,id)));
}
export function checkoutReady(env){
  const fees=shipping(env);
  const validKey = /^sk_(test|live)_[A-Za-z0-9]+$/.test(String(env.PAYSTACK_SECRET_KEY||''));
  const keyApproved = !String(env.PAYSTACK_SECRET_KEY||'').startsWith('sk_live_') || env.LIVE_PAYMENTS_APPROVED === 'true';
  return env.CHECKOUT_ENABLED === 'true' && validKey && keyApproved &&
    fees.nairobi !== null && fees.rest_of_kenya !== null && !!env.DB && activeProducts(env).size > 0;
}
export function catalogueForPublic(env){
  const active = activeProducts(env);
  return {checkoutEnabled:checkoutReady(env),currency:'KES',
    environment: String(env.PAYSTACK_SECRET_KEY||'').startsWith('sk_test_')?'test':String(env.PAYSTACK_SECRET_KEY||'').startsWith('sk_live_')?'live':'unavailable',
    shippingFees:shipping(env), products:Object.entries(PRODUCTS).map(([id,p])=>({id,name:p.name,priceKes:p.priceKes,sizes:p.sizes,available:active.has(id)}))};
}
