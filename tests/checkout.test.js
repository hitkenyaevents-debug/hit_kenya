import test from 'node:test';
import assert from 'node:assert/strict';
import {PRODUCTS,checkoutReady,catalogueForPublic} from '../functions/_lib/catalog.js';
import {onRequestPost} from '../functions/api/store/checkout.js';
import {onRequestGet} from '../functions/api/store/order-status.js';
import {onRequestPost as webhook} from '../functions/api/paystack/webhook.js';

function memoryDB(){
 const orders=new Map();
 return {orders,prepare(sql){
  let args=[];
  return {bind(...binds){args=binds;return this},async run(){
   if(sql.startsWith('INSERT INTO orders')){
     const [reference,email,buyer_name,phone,county,town,address,zone,items_json,subtotal_cents,delivery_cents,amount_cents]=args;
     orders.set(reference,{reference,email,buyer_name,phone,county,town,address,zone,items_json,subtotal_cents,delivery_cents,amount_cents,currency:'KES',status:'pending'});
   }else if(sql.includes("status='paid'")){
     const row=orders.get(args[2]);if(row&&row.status!=='paid')row.status='paid';
   }else if(sql.includes("status='initialization_failed'")){
     const row=orders.get(args[0]);if(row)row.status='initialization_failed';
   }
   return {success:true};
  },async first(){
   const row=orders.get(args[0]);return row ? {...row}:null;
  }};
 }};
}
function env(db){return {CHECKOUT_ENABLED:'true',PAYSTACK_SECRET_KEY:'sk_test_mocksecret123',DELIVERY_NAIROBI_KES:'250',DELIVERY_OTHER_KENYA_KES:'500',ACTIVE_PRODUCT_IDS:'tshirt,crop',DB:db};}
const requestFor=body=>new Request('https://hitkenya.example/api/store/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
const cart={name:'Test Buyer',email:'buyer@example.com',phone:'0712345678',county:'Nairobi',town:'CBD',address:'123 Sample Place',zone:'nairobi',method:'mpesa',items:[{id:'crop',size:'L',qty:2}]};

test('safely disabled until all store settings are provided',()=>{
 assert.equal(checkoutReady({}),false);
 assert.equal(checkoutReady({...env(memoryDB()),ACTIVE_PRODUCT_IDS:''}),false);
 assert.equal(checkoutReady({...env(memoryDB()),PAYSTACK_SECRET_KEY:'sk_live_mocksecret123'}),false);
 assert.equal(checkoutReady(env(memoryDB())),true);
 assert.equal(PRODUCTS.crop.priceKes,1800);
 assert.equal(catalogueForPublic({}).checkoutEnabled,false);
});

test('server calculates selected variant and exact delivery, not client-supplied total',async()=>{
 const db=memoryDB(),cfg=env(db);let initialized;
 const fetchSaved=globalThis.fetch;
 globalThis.fetch=async (url,init)=>{
  assert.equal(url,'https://api.paystack.co/transaction/initialize');
  initialized=JSON.parse(init.body);
  return Response.json({status:true,data:{authorization_url:'https://checkout.paystack.com/pay/mock'}});
 };
 try{
  const result=await onRequestPost({request:requestFor({...cart,items:[{...cart.items[0],priceKes:1}],totalKes:1}),env:cfg});
  assert.equal(result.status,200);
  const out=await result.json();
  assert.equal(out.totalKes,3850); // 2 x KES 1800 + KES 250 delivery
  assert.equal(initialized.amount,385000);
  assert.equal(initialized.currency,'KES');
  assert.deepEqual(initialized.channels,['mobile_money']);
  assert.equal(initialized.callback_url,'https://hitkenya.example/payment-result.html');
  assert.deepEqual(JSON.parse(db.orders.get(out.reference).items_json)[0],{id:'crop',name:"Women's Crop Top",size:'L',qty:2,priceKes:1800});
 }finally{globalThis.fetch=fetchSaved}
});

test('rejects unsupported variants, unavailable merchandise, mixed zone and missing info',async()=>{
 const cfg=env(memoryDB());
 for(const body of [
   {...cart,items:[{id:'hoodie',qty:1,size:'M'}]},
   {...cart,items:[{id:'crop',qty:1,size:'XXL'}]},
   {...cart,items:[{id:'crop',qty:200,size:'L'}]},
   {...cart,zone:'rest_of_kenya'},
   {...cart,email:'invalid'},
 ]){
  const r=await onRequestPost({request:requestFor(body),env:cfg});
  assert.equal(r.status,400);
 }
});

test('payment verification only marks as paid for exact reference, amount, email, KES, domain',async()=>{
 const db=memoryDB(),cfg=env(db);
 const original=globalThis.fetch;
 const ref='HK-M-'+'A'.repeat(25);
 db.orders.set(ref,{reference:ref,email:cart.email,amount_cents:385000,currency:'KES',status:'pending'});
 try{
  globalThis.fetch=async()=>Response.json({status:true,data:{status:'success',reference:ref,amount:1,currency:'KES',domain:'test',customer:{email:cart.email}}});
  let status=await onRequestGet({request:new Request('https://hitkenya.example/api/store/order-status?reference='+ref),env:cfg});
  assert.equal((await status.json()).status,'review_required');assert.equal(db.orders.get(ref).status,'pending');
  globalThis.fetch=async()=>Response.json({status:true,data:{status:'success',reference:ref,amount:385000,currency:'KES',domain:'test',customer:{email:cart.email},id:123,channel:'mobile_money'}});
  status=await onRequestGet({request:new Request('https://hitkenya.example/api/store/order-status?reference='+ref),env:cfg});
  assert.equal((await status.json()).status,'paid');assert.equal(db.orders.get(ref).status,'paid');
 }finally{globalThis.fetch=original}
});

test('rejects unsigned webhooks',async()=>{
 const r=await webhook({request:new Request('https://hitkenya.example/api/paystack/webhook',{method:'POST',body:JSON.stringify({event:'charge.success'})}),env:env(memoryDB())});
 assert.equal(r.status,401);
});
