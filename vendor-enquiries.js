import {json,error,isEmail,isKenyanPhone,saneString} from '../_lib/http.js';

const sameOrigin=(request)=>{const origin=request.headers.get('origin');return !origin||origin===new URL(request.url).origin};
export async function onRequestPost({request,env}){
 if(!env.DB)return error('Booking enquiries are not configured yet. Please contact HIT KENYA.',503);
 if(!sameOrigin(request))return error('Cross-origin booking requests are not allowed.',403);
 if(!(request.headers.get('content-type')||'').startsWith('application/json'))return error('Send a JSON enquiry.',415);
 if(Number(request.headers.get('content-length')||0)>8000)return error('The enquiry is too large.',413);
 let data;try{data=await request.json()}catch{return error('Invalid request.',400)}
 if(!data||typeof data!=='object'||Array.isArray(data)||data.website)return error('Invalid request.',400);
 const vendorId=Number(data.vendorId),name=saneString(data.name,120),email=isEmail(data.email)?data.email.trim().toLowerCase():null;
 const phone=isKenyanPhone(data.phone)?data.phone.replace(/[\s-]/g,''):null;
 const location=saneString(data.location,150),details=saneString(data.details,1500),date=typeof data.eventDate==='string'?data.eventDate:'';
 const validDate=/^\d{4}-\d{2}-\d{2}$/.test(date)&&!Number.isNaN(Date.parse(date))&&Date.parse(date)>=Date.now()-86400000;
 if(!Number.isSafeInteger(vendorId)||vendorId<1||!name||!email||!phone||!location||!details||!validDate||data.consent!==true)return error('Please complete the required booking information.',400);
 try{
  const vendor=await env.DB.prepare("SELECT id FROM vendor_public_profiles WHERE id=? AND status='approved' AND public_enabled=1").bind(vendorId).first();
  if(!vendor)return error('This vendor is not currently bookable.',404);
  const recent=await env.DB.prepare("SELECT COUNT(*) AS n FROM vendor_booking_enquiries WHERE email=? AND created_at >= datetime('now','-1 hour')").bind(email).first();
  if(Number(recent?.n||0)>=5)return error('Too many requests from this email. Please try later.',429);
  const reference='HK-VE-'+crypto.randomUUID().replace(/-/g,'').slice(0,16).toUpperCase();
  await env.DB.prepare(`INSERT INTO vendor_booking_enquiries
     (reference,vendor_id,customer_name,email,phone,event_date,event_location,details,consent,status)
     VALUES (?,?,?,?,?,?,?,?,?,?)`).bind(reference,vendorId,name,email,phone,date,location,details,1,'pending_review').run();
  return json({ok:true,reference,status:'pending_review',booking_confirmed:false,payment_status:'not_paid'},201);
 }catch(ex){console.error('Vendor booking submission failed:',String(ex));return error('We could not save your booking enquiry. Please try again later.',503)}
}
