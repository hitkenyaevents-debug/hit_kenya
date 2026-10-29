import {safeReference} from './http.js';

export async function paystackFetch(env,path,options={}){
  const resp = await fetch('https://api.paystack.co'+path,{...options,headers:{
     'Authorization':'Bearer '+env.PAYSTACK_SECRET_KEY,
     'Content-Type':'application/json', ...(options.headers||{})
    }, signal:AbortSignal.timeout(12000)});
  const payload = await resp.json().catch(()=>({status:false}));
  if (!resp.ok || payload.status!==true) throw new Error('Paystack request failed');
  return payload.data;
}
export async function reconcilePayment(env,reference){
  if (!safeReference(reference)) return {status:'invalid'};
  const order = await env.DB.prepare('SELECT reference,email,amount_cents,currency,status FROM orders WHERE reference=?').bind(reference).first();
  if (!order) return {status:'not_found'};
  if (order.status==='paid') return {status:'paid'};
  const txn = await paystackFetch(env,'/transaction/verify/'+encodeURIComponent(reference));
  if (txn.status!=='success') return {status:'pending'};
  const integrity = txn.reference===reference && Number(txn.amount)===Number(order.amount_cents) &&
    txn.currency===order.currency && String(txn.customer?.email||'').toLowerCase()===String(order.email).toLowerCase() &&
    (env.PAYSTACK_SECRET_KEY.startsWith('sk_live_') ? txn.domain === 'live':txn.domain === 'test');
  if (!integrity) {
    console.error('HIT KENYA PAYMENT VALIDATION MISMATCH',reference);
    return {status:'review_required'};
  }
  await env.DB.prepare("UPDATE orders SET status='paid', paid_at=datetime('now'), payment_channel=?, paystack_transaction_id=?, updated_at=datetime('now') WHERE reference=? AND status!='paid'")
    .bind(String(txn.channel||'').slice(0,40),String(txn.id||''),reference).run();
  return {status:'paid'};
}
