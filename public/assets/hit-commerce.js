/* HIT KENYA — customer-side checkout. All pricing/payment decisions are server-side. */
(() => {
  'use strict';
  let store = null;
  let status = 'loading';
  const byId = id => document.getElementById(id);
  const fmt = value => `KSh ${Number(value).toLocaleString('en-KE')}`;
  const uiPrice = () => {
    const zone=byId('merchZone')?.value||'nairobi';
    const fee=store?.shippingFees?.[zone];
    const sub=hkCart.reduce((n,item)=>n+item.price*item.qty,0);
    const el=byId('checkoutPriceBreakdown');
    if(!el)return;
    if(fee===null||fee===undefined){el.textContent='Delivery rates must be confirmed by HIT KENYA before payment.';return;}
    el.innerHTML=`<div>Merchandise: <b>${fmt(sub)}</b></div><div>Delivery: <b>${fmt(fee)}</b></div><div>Total payable: <b class="highlight">${fmt(sub+fee)}</b></div><small>Final total is recalculated on the server.</small>`;
  };
  function refreshButtons(){
    const allowed=status==='ready' && hkCart.length>0 && hkCart.every(row=>store.products.some(p=>p.id===row.id&&p.available));
    if(byId('cartCheckoutButton'))byId('cartCheckoutButton').disabled=!allowed;
    if(byId('merchPayButton'))byId('merchPayButton').disabled=!allowed;
    uiPrice();
  }
  function redrawCart(){renderCart();refreshButtons();}
  window.addToCart=(button,id)=>{
    const product=store?.products?.find(p=>p.id===id);
    if(!product||!product.available){window.showNotice('cartMessage','This item is not yet available for purchase.',false);window.openCart();return;}
    const size=button.closest('.shop-product')?.querySelector('.size-pills .selected')?.textContent?.trim()||'ONE SIZE';
    if(!product.sizes.includes(size)){window.showNotice('cartMessage','Select an available size.',false);return;}
    const found=hkCart.find(x=>x.id===id&&x.size===size);
    if(found){if(found.qty>=20){window.showNotice('cartMessage','The maximum per size is 20.',false);return;}found.qty++;}
    else hkCart.push({id,name:product.name,price:product.priceKes,size,qty:1});
    redrawCart();
    try{sessionStorage.setItem('hk_merch_cart',JSON.stringify(hkCart))}catch{}
    window.showNotice('cartMessage',product.name+' ('+size+') added to your cart.');
    window.openCart();
  };
  window.removeCartItem=i=>{
    hkCart.splice(i,1);redrawCart();
    try{sessionStorage.setItem('hk_merch_cart',JSON.stringify(hkCart))}catch{}
  };
  window.openCart=()=>{redrawCart();window.openModal('cartModal')};
  window.openMerchCheckout=()=>{
    if(!hkCart.length)return window.showNotice('cartMessage','Please add a product to your cart first.',false);
    if(status!=='ready')return window.showNotice('cartMessage','Secure checkout is not enabled. No payment has been taken.',false);
    if(hkCart.some(x=>!store.products.find(p=>p.id===x.id&&p.available)))return window.showNotice('cartMessage','An item is unavailable. Remove it before checkout.',false);
    window.closeModal('cartModal');window.openModal('merchCheckoutModal');uiPrice();
  };
  window.submitMerchCheckout=async()=>{
    if(status!=='ready')return window.showNotice('merchCheckoutMessage','Checkout is not ready. No payment has been taken.',false);
    const body={
      name:byId('merchName').value.trim(),email:byId('merchEmail').value.trim(),
      phone:byId('merchPhone').value.trim()||byId('merchWhatsapp').value.trim(),
      county:byId('merchCounty').value.trim(),town:byId('merchTown').value.trim(),
      address:byId('merchAddress').value.trim(),zone:byId('merchZone').value,
      items:hkCart.map(({id,size,qty})=>({id,size,qty}))
    };
    if(!body.name||!/^\S+@\S+\.\S+$/.test(body.email)||!body.phone||!body.county||!body.town||!body.address){
      return window.showNotice('merchCheckoutMessage','Complete your name, email, phone, county, town and delivery address.',false);
    }
    const button=byId('merchPayButton');button.disabled=true;button.textContent='CONNECTING TO SECURE CHECKOUT…';
    try{
      const r=await fetch('/api/store/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const data=await r.json();
      if(!r.ok||!data.ok)throw new Error(data.message||'Unable to start payment.');
      const url=new URL(data.authorizationUrl);
      if(url.protocol!=='https:'||!(url.hostname==='paystack.com'||url.hostname.endsWith('.paystack.com')))throw new Error('Invalid checkout destination');
      sessionStorage.setItem('hk_merch_checkout',data.reference);
      location.assign(url.href);
    }catch(e){window.showNotice('merchCheckoutMessage',String(e.message||e)+' No payment has been confirmed.',false);}
    finally{button.textContent='CONTINUE TO SECURE PAYSTACK CHECKOUT →';refreshButtons();}
  };
  // The original HTML's demo verifier was intentionally removed from real-world status checks.
  window.verifyTicket=()=>{
    const box=byId('verifyResult');if(!box)return;
    box.className='result show';
    box.textContent='Live ticket validation is not available yet. No ticket ID has been checked. Contact HIT KENYA for event-ticket support.';
  };
  // A preview must never claim that a private ticket is paid or valid.
  window.showPrivateTicket=()=>{
    window.closeModal('purchaseModal');window.openModal('privateTicketModal');
  };
  window.submitPartnerFlow=()=>{window.showNotice('partnerMessage','This is a preview. Your application has not been submitted yet.',false);};


  function loadConsentedAnalytics(){
    if(window.__HK_ANALYTICS_LOADED)return;
    window.__HK_ANALYTICS_LOADED=true;
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments)};
    window.gtag('js',new Date());window.gtag('config','G-ELBKENXSKX',{anonymize_ip:true});
    const scr=document.createElement('script');scr.async=true;scr.src='https://www.googletagmanager.com/gtag/js?id=G-ELBKENXSKX';document.head.appendChild(scr);
  }
  window.setHitAnalyticsConsent=accept=>{
    try{localStorage.setItem('hk_analytics_consent',accept?'yes':'no')}catch{}
    const bar=byId('hkCookieBanner');if(bar)bar.hidden=true;
    if(accept)loadConsentedAnalytics();
  };
  function startConsent(){
    let preference=null;try{preference=localStorage.getItem('hk_analytics_consent')}catch{}
    if(preference==='yes')loadConsentedAnalytics();
    else if(preference!=='no'&&byId('hkCookieBanner'))byId('hkCookieBanner').hidden=false;
  }

  async function boot(){
    const ids=['tshirt','hoodie','cap','crop','backpack','keychain'];
    const cards=[...document.querySelectorAll('#shopGrid .shop-product')];
    cards.forEach((card,index)=>card.dataset.sku=ids[index]);
    try{
      const response=await fetch('/api/store/catalog',{cache:'no-store'});
      if(!response.ok)throw new Error('Store API is unavailable');
      const result=await response.json();
      if(!result.ok||!Array.isArray(result.products))throw new Error('Store catalogue is unavailable');
      store=result;
      status=result.checkoutEnabled?'ready':'preview';
      const notice=byId('storeAvailability');
      if(notice){
        notice.textContent=result.checkoutEnabled?
          `Secure checkout ${result.environment==='test'?'(test transactions only)':'is available'} — products and delivery rates are verified before redirecting to Paystack.`:
          'Preview collection — online payments are not enabled yet. Availability, delivery rates and merchant confirmation are still required.';
        notice.classList.toggle('live',result.checkoutEnabled);
      }
      for(const card of cards){
        const p=result.products.find(p=>p.id===card.dataset.sku);
        if(!p)continue;
        const price=card.querySelector('.shop-price');if(price)price.textContent=fmt(p.priceKes);
        const button=card.querySelector('button[onclick^="addToCart"]');
        if(button){button.disabled=!(result.checkoutEnabled&&p.available);button.textContent=p.available&&result.checkoutEnabled?'ADD TO CART →':'COMING SOON';}
      }
      // Cart is restored only if the server currently accepts each product.
      try{
        const rows=JSON.parse(sessionStorage.getItem('hk_merch_cart')||'[]');
        if(Array.isArray(rows))for(const row of rows){
          const p=result.products.find(p=>p.id===row.id&&p.available);
          if(!p||!p.sizes.includes(row.size)||!Number.isInteger(row.qty)||row.qty<1||row.qty>20)continue;
          hkCart.push({id:p.id,name:p.name,price:p.priceKes,size:row.size,qty:row.qty});
        }
      }catch{}
    }catch(e){
      status='preview';
      const n=byId('storeAvailability');
      if(n)n.textContent='Website preview — a Cloudflare deployment and secure checkout configuration are needed before purchases can be made.';
      document.querySelectorAll('#shopGrid button[onclick^="addToCart"]').forEach(b=>{b.disabled=true;b.textContent='COMING SOON';});
    }
    redrawCart();
    byId('merchZone')?.addEventListener('change',uiPrice);
  }
  function init(){startConsent();boot();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
