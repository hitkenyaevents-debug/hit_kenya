import {json,error,saneString,isEmail,isKenyanPhone} from '../_lib/http.js';
const services=new Set(['Aerial Photography','Aerial Videography','Photography & Video','Events & Festivals','Real Estate & Property','Tourism & Landscapes','Construction & Inspections','Custom Project']);
const packages=new Set(['Basic Aerial Shoot','Standard Coverage','Extended / Custom']);
const durations=new Set(['1 Hour','2–3 Hours','4–6 Hours','Full Day (8+ Hours)','Custom Duration']);
const deliveries=new Set(['Within 5 business days','Within 7 business days','Flexible / To be agreed']);
const paymentMethods=new Set(['M-Pesa','Bank Transfer']);
function optional(value,max){return typeof value==='string'&&value.trim().length<=max?value.trim():null;}
function validDate(str){if(typeof str!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(str))return false;const d=new Date(str+'T00:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===str;}
export async function onRequestPost({request,env}){
 if(!env.DB)return error('Drone booking requests are not yet available. Please contact HIT KENYA directly.',503);
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return error('Request origin not allowed.',403);
 const type=request.headers.get('content-type')||'';if(!type.toLowerCase().startsWith('application/json'))return error('Expected JSON data.',415);
 if(Number(request.headers.get('content-length')||0)>12000)return error('Request is too large.',413);
 let x;try{x=await request.json()}catch{return error('Booking details could not be read.',400)}
 if(!x||typeof x!=='object'||Array.isArray(x))return error('Invalid booking request.',400);
 const project=saneString(x.project,140),location=saneString(x.location,140),name=saneString(x.name,100);
 const email=isEmail(x.email)?x.email.trim().toLowerCase():null;
 const phone=isKenyanPhone(x.phone)?x.phone.replace(/[\s-]/g,''):null;
 const description=saneString(x.description,1500),notes=optional(x.notes,500),special=optional(x.specialRequests,500);
 const budget=x.budget;
 if(!project||!location||!name||!email||!phone||!description||notes===null||special===null||!services.has(x.service)||!packages.has(x.package)||!validDate(x.eventDate)||!durations.has(x.duration)||!deliveries.has(x.delivery)||!paymentMethods.has(x.paymentPreference)||x.consent!==true)return error('Check the required booking fields and try again.',400);
 if(budget!==null&&(!Number.isSafeInteger(budget)||budget<0||budget>100000000))return error('Please use a valid estimated budget.',400);
 const today=new Date();if(Date.parse(x.eventDate+'T23:59:59Z')<today.getTime()-86400000)return error('Please choose a future project date.',400);
 try{const recent=await env.DB.prepare("SELECT COUNT(*) AS n FROM drone_booking_requests WHERE email=? AND created_at>=datetime('now','-1 hour')").bind(email).first();if(Number(recent?.n||0)>=3)return error('Too many requests. Please try again later.',429)}catch(e){console.error('Drone request rate check:',String(e));return error('Booking database is not configured.',503)}
 const reference='HK-DR-'+crypto.randomUUID().replace(/-/g,'').slice(0,16).toUpperCase();
 try{await env.DB.prepare(`INSERT INTO drone_booking_requests(reference,project_name,service,package_name,event_date,location,duration,budget_kes,customer_name,phone,email,description,notes,special_requests,delivery,payment_preference,consent,payment_status,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(reference,project,x.service,x.package,x.eventDate,location,x.duration,budget,name,phone,email,description,notes,special,x.delivery,x.paymentPreference,1,'not_paid','new').run()}catch(e){console.error('Drone booking save failed:',String(e));return error('Your enquiry could not be saved. Please try again later.',503)}
 return json({ok:true,reference,status:'new',paymentStatus:'not_paid'},201);
}
