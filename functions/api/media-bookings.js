import {json,error,saneString,isEmail,isKenyanPhone} from '../_lib/http.js';
const validEventTypes = new Set(['Concert / Festival','Corporate / Conference','Wedding / Celebration','Product / Brand Shoot','Social Content','Other']);
const validCoverage = new Set(['Full Event','Highlights','Studio / Location Shoot','Social Media Content','Other']);
const validServices = new Set(['Photography','Videography','Drone Coverage']);
const validStyles = new Set(['','Cinematic & Creative','Documentary / Natural','Classic / Elegant','Bold / Social First','No preference']);
const validDurations = new Set(['1 Hour','2–3 Hours','4–6 Hours','Full Day (8+ hours)']);
const validPayments = new Set(['M-Pesa','Bank Transfer']);
const supportedMime = new Set(['image/jpeg','image/png','image/webp']);
const maxFileBytes = 4 * 1024 * 1024;
function optionalString(value,max){return typeof value==='string'&&value.trim().length<=max?value.trim():null}
function validDate(date){if(typeof date!=='string'||!/\d{4}-\d{2}-\d{2}/.test(date))return false;const parsed=new Date(date+'T00:00:00Z');return !Number.isNaN(parsed.getTime())&&parsed.toISOString().slice(0,10)===date}
export async function onRequestPost({request,env}){
  if(!env.DB)return error('Booking requests are not available until HIT KENYA enables the booking database.',503);
  const origin=request.headers.get('Origin');if(origin&&origin!==new URL(request.url).origin)return error('Request origin not allowed.',403);
  const ct=request.headers.get('content-type')||'';if(!ct.toLowerCase().startsWith('multipart/form-data;'))return error('Expected multipart booking form.',415);
  const len=Number(request.headers.get('content-length')||'0');if(len>13*1024*1024)return error('Booking request exceeds the size limit.',413);
  let fd,body;
  try{fd=await request.formData();const raw=fd.get('payload');if(typeof raw!=='string'||raw.length>12000)throw Error('Bad form');body=JSON.parse(raw)}catch{return error('Booking form could not be read. Please review your information.');}
  if(!body||typeof body!=='object'||Array.isArray(body))return error('Invalid booking request.');
  const name=saneString(body.name,120),email=isEmail(body.email)?body.email.trim().toLowerCase():null;
  const phone=isKenyanPhone(body.phone)?body.phone.replace(/[\s-]/g,''):null;
  const eventName=saneString(body.eventName,160),location=saneString(body.location,180);
  const business=optionalString(body.business,160),style=optionalString(body.style,100),notes=optionalString(body.notes,2000),referenceLink=optionalString(body.referenceLink,600);
  const attendance=body.attendance===null?null:body.attendance;
  const budget=body.budget===null?null:body.budget;
  const files=fd.getAll('references');
  if(!name||!email||!phone||!eventName||!location||business===null||style===null||notes===null||referenceLink===null||!validEventTypes.has(body.eventType)||!validDate(body.eventDate)||!validCoverage.has(body.coverage)||!Array.isArray(body.services)||!body.services.length||body.services.length>3||new Set(body.services).size!==body.services.length||!body.services.every(s=>validServices.has(s))||!validStyles.has(style)||!validDurations.has(body.duration)||!validPayments.has(body.paymentPreference)||body.consent!==true)return error('Please complete all required booking fields.',400);
  if((attendance!==null&&(!Number.isInteger(attendance)||attendance<0||attendance>1000000))||(budget!==null&&(!Number.isInteger(budget)||budget<0||budget>100000000)))return error('Attendance and budget must be valid amounts.',400);
  if(referenceLink){try{const url=new URL(referenceLink);if(!['https:','http:'].includes(url.protocol))throw Error()}catch{return error('The reference link must be an HTTP or HTTPS URL.',400)}}
  const now=new Date();const day=Date.parse(body.eventDate+'T23:59:59Z');if(day<now.getTime()-86400000)return error('Please choose a current or future event date.',400);
  if(files.length>3)return error('Upload a maximum of three reference photos.',400);
  for(const file of files){if(typeof file==='string'||!file||!supportedMime.has(file.type)||file.size>maxFileBytes||!file.size)return error('References must be JPG, PNG or WebP images, 4 MB or less each.',400)}
  if(files.length&&!env.MEDIA_UPLOADS)return error('Reference-image uploads are not enabled yet. Please remove selected files and submit your reference link instead.',503);
  let count;try{count=await env.DB.prepare("SELECT COUNT(*) AS n FROM media_booking_requests WHERE email=? AND created_at>=datetime('now','-1 hour')").bind(email).first()}catch(e){console.error('Media booking rate check failed:',String(e));return error('Booking database is not fully configured yet.',503)}
  if(Number(count?.n||0)>=3)return error('Too many enquiries. Please try again in an hour.',429);
  const reference='HK-PV-'+crypto.randomUUID().replaceAll('-','').slice(0,16).toUpperCase();
  const keys=[];
  try{
    if(files.length){for(let i=0;i<files.length;i++){const file=files[i];const ext=file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';const key=`booking-references/${reference}/${i+1}.${ext}`;await env.MEDIA_UPLOADS.put(key,file.stream(),{httpMetadata:{contentType:file.type}});keys.push(key)}}
    await env.DB.prepare(`INSERT INTO media_booking_requests(reference,name,email,phone,business,event_name,event_type,event_date,location,attendance,coverage,services_json,style,budget_kes,notes,reference_url,reference_files_json,duration,payment_preference,consent,payment_status,status)
VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(reference,name,email,phone,business,eventName,body.eventType,body.eventDate,location,attendance,body.coverage,JSON.stringify(body.services),style,budget,notes,referenceLink,JSON.stringify(keys),body.duration,body.paymentPreference,1,'not_paid','new').run();
  }catch(e){console.error('Media booking save failed:',String(e));if(keys.length&&env.MEDIA_UPLOADS){await Promise.all(keys.map(k=>env.MEDIA_UPLOADS.delete(k).catch(()=>{})))}return error('Booking could not be saved. Please try again later.',503)}
  return json({ok:true,reference,status:'new',paymentStatus:'not_paid'},201);
}
