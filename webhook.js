import {json,error,safeReference} from '../../_lib/http.js';
import {reconcilePayment} from '../../_lib/paystack.js';
function toHex(b){return [...new Uint8Array(b)].map(v=>v.toString(16).padStart(2,'0')).join('')}
export async function onRequestPost({request,env}){
  if(!env.PAYSTACK_SECRET_KEY||!env.DB)return error('Webhook unavailable',503);
  const sig=request.headers.get('x-paystack-signature');
  if(!sig|| !/^[0-9a-f]{128}$/i.test(sig))return error('Invalid signature',401);
  if(Number(request.headers.get('content-length')||0)>32000)return error('Webhook payload too large',413);
  const raw=await request.text();
  if(raw.length>32000)return error('Webhook payload too large',413);
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(env.PAYSTACK_SECRET_KEY),{name:'HMAC',hash:'SHA-512'},false,['sign']);
  const expected=toHex(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(raw)));
  // Constant-work comparison avoids leaking information about matching prefix.
  let mismatch=0;for(let i=0;i<128;i++)mismatch|=expected.charCodeAt(i)^sig.toLowerCase().charCodeAt(i);
  if(mismatch!==0)return error('Invalid signature',401);
  let event;try{event=JSON.parse(raw)}catch{return error('Invalid JSON')}
  if(event.event==='charge.success'){
    const ref=event.data?.reference;
    if(safeReference(ref)){
      try{await reconcilePayment(env,ref)}catch(e){console.error('Webhook payment reconciliation error',String(e));return error('Please retry',500)}
    }
  }
  return json({ok:true});
}
