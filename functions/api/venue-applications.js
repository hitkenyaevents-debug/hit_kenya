import {json,error,isEmail,isKenyanPhone,saneString} from '../_lib/http.js';

// HIT KENYA venue applications are PRIVATE and must never be auto-published.
// Requires Cloudflare Pages bindings DB (D1) and VENUE_UPLOADS (private R2 bucket).
const categories=new Set(['Hotel & Conference Centre','Wedding & Reception Venue','Conference & Meeting Hall','Garden & Outdoor Venue','Restaurant & Rooftop','Resort & Retreat','Community Hall','Other Event Space']);
const units=new Set(['Per event','Per day','Per hour','Starting price']);
const facilities=new Set(['Parking','Wi-Fi','Catering','Security','Wheelchair Access','AV Equipment']);
const imageTypes=new Set(['image/jpeg','image/png','image/webp']);
const videoTypes=new Set(['video/mp4','video/webm']);
const fileLimits={photos:4*1024*1024,video:12*1024*1024,idFront:4*1024*1024,idBack:4*1024*1024,face:4*1024*1024};
const maxRequestSize=29*1024*1024;
function trim(v,max){return saneString(v,max)}
function validNumber(n,max){return Number.isSafeInteger(n)&&n>=1&&n<=max}
async function verifyFile(field,file){
  if(!(file instanceof File)||file.size<1||file.size>fileLimits[field])return false;
  const isVideo=field==='video';
  if(!(isVideo?videoTypes:imageTypes).has(file.type))return false;
  const bytes=new Uint8Array(await file.slice(0,24).arrayBuffer());
  const ascii=(start,end)=>String.fromCharCode(...bytes.slice(start,end));
  if(file.type==='image/jpeg')return bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
  if(file.type==='image/png')return [137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n);
  if(file.type==='image/webp')return ascii(0,4)==='RIFF'&&ascii(8,12)==='WEBP';
  if(file.type==='video/mp4')return ascii(4,8)==='ftyp';
  if(file.type==='video/webm')return [26,69,223,163].every((n,i)=>bytes[i]===n);
  return false;
}
function extension(type){return {'image/jpeg':'jpg','image/png':'png','image/webp':'webp','video/mp4':'mp4','video/webm':'webm'}[type]}

export async function onRequestPost({request,env}){
  if(!env.DB||!env.VENUE_UPLOADS)return error('Secure venue registration is not configured. Please contact HIT KENYA.',503);
  const origin=request.headers.get('origin');
  if(origin&&origin!==new URL(request.url).origin)return error('This request origin is not allowed.',403);
  if(!(request.headers.get('content-type')||'').toLowerCase().startsWith('multipart/form-data'))return error('Expected a multipart form submission.',415);
  if(Number(request.headers.get('content-length')||0)>maxRequestSize)return error('The upload is too large. Please reduce attachment sizes.',413);
  let form,body;
  try{form=await request.formData();body=JSON.parse(String(form.get('payload')||''))}catch{return error('The application could not be read.',400)}
  if(!body||typeof body!=='object'||Array.isArray(body)||body.website)return error('Invalid application.',400);
  const venueName=trim(body.venueName,120),category=categories.has(body.category)?body.category:null;
  const county=trim(body.county,100),town=trim(body.town,100),description=trim(body.description,1500);
  const ownerName=trim(body.ownerName,120),email=isEmail(body.email)?body.email.trim().toLowerCase():null;
  const phone=isKenyanPhone(body.phone)?body.phone.replace(/[\s-]/g,''):null;
  const capacity=body.capacity,price=body.price,pricingUnit=units.has(body.pricingUnit)?body.pricingUnit:null;
  const selectedFacilities=Array.isArray(body.facilities)?body.facilities:null;
  if(!venueName||!category||!county||!town||!description||!ownerName||!email||!phone||!validNumber(capacity,100000)||!validNumber(price,100000000)||!pricingUnit||!selectedFacilities||selectedFacilities.length>6||selectedFacilities.some(x=>!facilities.has(x))||new Set(selectedFacilities).size!==selectedFacilities.length||body.consent!==true){
    return error('Please check the required venue, contact, capacity, price and consent details.',400);
  }
  const uploads=[];const counts={photos:0,video:0,idFront:0,idBack:0,face:0};let totalBytes=0;
  for(const [field,file] of form.entries()){
    if(field==='payload')continue;
    if(!Object.prototype.hasOwnProperty.call(counts,field))return error('Unexpected upload field.',400);
    counts[field]++;
    if(counts[field]>(field==='photos'?6:1))return error('Too many attachments.',400);
    if(!(await verifyFile(field,file)))return error('One of the attachments has an unsupported format or size.',400);
    totalBytes+=file.size;
    uploads.push({field,file});
  }
  if(counts.photos<1||counts.idFront!==1||counts.idBack!==1||counts.face!==1)return error('Venue photos and all three identity verification images are required.',400);
  if(totalBytes>27*1024*1024)return error('Uploads exceed the 27 MB limit.',413);
  try{
    const recent=await env.DB.prepare("SELECT COUNT(*) AS n FROM venue_applications WHERE email=? AND created_at>=datetime('now','-1 hour')").bind(email).first();
    if(Number(recent?.n||0)>=3)return error('Too many applications recently. Please try again later.',429);
  }catch(ex){console.error('Venue application lookup:',String(ex));return error('The venue registration database is unavailable.',503)}
  const ref='HK-VEN-'+crypto.randomUUID().replace(/-/g,'').slice(0,16).toUpperCase();
  const manifest=[];
  try{
    for(const {field,file} of uploads){
      const count=manifest.filter(x=>x.field===field).length;
      const key=`venue-applications/${ref}/${field}-${count+1}.${extension(file.type)}`;
      await env.VENUE_UPLOADS.put(key,await file.arrayBuffer(),{httpMetadata:{contentType:file.type}});
      manifest.push({field,key,contentType:file.type,size:file.size});
    }
    await env.DB.prepare(`INSERT INTO venue_applications
      (reference,venue_name,category,county,town,description,capacity,facilities_json,price_kes,pricing_unit,owner_name,email,phone,files_json,consent,status)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
      ref,venueName,category,county,town,description,capacity,JSON.stringify(selectedFacilities),price,pricingUnit,ownerName,email,phone,JSON.stringify(manifest),1,'pending_review'
    ).run();
  }catch(ex){
    console.error('Venue application save:',String(ex));
    await Promise.allSettled(manifest.map(m=>env.VENUE_UPLOADS.delete(m.key)));
    return error('The application could not be saved. Please try again later.',503);
  }
  return json({ok:true,reference:ref,status:'pending_review',published:false},201);
}
