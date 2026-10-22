import {json,error,safeReference} from '../../_lib/http.js';
import {reconcilePayment} from '../../_lib/paystack.js';
export async function onRequestGet({request,env}){
  if(!env.DB||!env.PAYSTACK_SECRET_KEY)return error('Payment status is not configured.',503);
  const reference=new URL(request.url).searchParams.get('reference');
  if(!safeReference(reference))return error('Invalid order reference.');
  const existing=await env.DB.prepare('SELECT status,amount_cents,reference FROM orders WHERE reference=?').bind(reference).first();
  if(!existing)return error('Order not found.',404);
  let status=existing.status;
  if(status==='pending'){
    try{status=(await reconcilePayment(env,reference)).status}
    catch(e){console.error('Transaction verification error',String(e));status='pending'}
  }
  return json({ok:true,reference,status,amountKes:Math.round(Number(existing.amount_cents)/100)});
}
