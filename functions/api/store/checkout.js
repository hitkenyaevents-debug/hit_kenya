import {PRODUCTS,activeProducts,checkoutReady,shipping} from '../../_lib/catalog.js';
import {json,error,isEmail,isKenyanPhone,saneString} from '../../_lib/http.js';
import {paystackFetch} from '../../_lib/paystack.js';
export async function onRequestPost({request,env}){
  if(!checkoutReady(env)) return error('Checkout is not yet enabled. Please contact HIT KENYA before placing an order.',503);
  if(Number(request.headers.get('content-length')||0)>16000) return error('Request too large',413);
  let body;
  try{body=await request.json();}catch{return error('Invalid checkout request')}
  const name=saneString(body.name,120), email=isEmail(body.email)?body.email.trim().toLowerCase():null,
    phone=isKenyanPhone(body.phone)?body.phone.replace(/[\s-]/g,''):null,
    address=saneString(body.address,240),town=saneString(body.town,80),county=saneString(body.county,80),
    zone=body.zone,items=body.items;
  if(!name||!email||!phone||!address||!town||!county || !['nairobi','rest_of_kenya'].includes(zone)) return error('Please complete valid buyer and delivery information.');
  if(zone==='nairobi' && county.toLowerCase()!=='nairobi') return error('Please select the delivery zone matching the delivery county.');
  if(zone==='rest_of_kenya' && county.toLowerCase()==='nairobi') return error('Nairobi County must use the Nairobi delivery zone.');
  if(!Array.isArray(items)||!items.length||items.length>12) return error('Choose between 1 and 12 products.');
  const live=activeProducts(env),normalized=[],unique=new Set();let subtotal=0;
  for(const row of items){
    if(!row||typeof row.id!=='string'||!Object.hasOwn(PRODUCTS,row.id)||!live.has(row.id)) return error('An item is not currently available for purchase.');
    if(!Number.isSafeInteger(row.qty)||row.qty<1||row.qty>20) return error('Invalid quantity.');
    const p=PRODUCTS[row.id],size=String(row.size||''),itemKey=row.id+'_'+size;
    if(!p.sizes.includes(size)||unique.has(itemKey))return error('Invalid or repeated product variant.');
    unique.add(itemKey);subtotal+=p.priceKes*row.qty;
    normalized.push({id:row.id,name:p.name,size,qty:row.qty,priceKes:p.priceKes});
  }
  if(normalized.reduce((a,i)=>a+i.qty,0)>30 || subtotal>500000) return error('Cart size exceeds online purchase limits.');
  const delivery=shipping(env)[zone],total=subtotal+delivery;
  if(total<3 || total>550000) return error('Invalid payment amount.');
  const ref='HK-M-'+crypto.randomUUID().replace(/-/g,'').slice(0,25).toUpperCase();
  // Trusted server total; browser unit prices and totals are never accepted.
  try{
    await env.DB.prepare(`INSERT INTO orders(reference,status,email,buyer_name,phone,county,town,address,zone,items_json,subtotal_cents,delivery_cents,amount_cents,currency,created_at,updated_at)
      VALUES(?,'pending',?,?,?,?,?,?,?,?,?,?,?,'KES',datetime('now'),datetime('now'))`)
      .bind(ref,email,name,phone,county,town,address,zone,JSON.stringify(normalized),subtotal*100,delivery*100,total*100).run();
  }catch(e){console.error('Order DB insert failed',String(e));return error('Unable to prepare an order at this time.',503)}
  try{
    const callback=new URL('/payment-result.html',request.url).href;
    const txn=await paystackFetch(env,'/transaction/initialize',{method:'POST',body:JSON.stringify({email,amount:total*100,currency:'KES',reference:ref,callback_url:callback,metadata:{site:'HIT_KENYA',purchase_type:'merchandise',reference:ref}})});
    const url=new URL(txn.authorization_url);
    if(url.protocol!=='https:' || !(url.hostname==='paystack.com'||url.hostname.endsWith('.paystack.com')))throw new Error('Unexpected checkout domain');
    return json({ok:true,reference:ref,authorizationUrl:url.href,subtotalKes:subtotal,deliveryKes:delivery,totalKes:total});
  }catch(e){
    console.error('Checkout initialization failed',String(e));
    await env.DB.prepare("UPDATE orders SET status='initialization_failed',updated_at=datetime('now') WHERE reference=?").bind(ref).run().catch(()=>{});
    return error('Payment provider could not start checkout. No payment has been made; please retry.',502);
  }
}
