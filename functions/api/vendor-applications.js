import {json,error,isEmail,isKenyanPhone,saneString} from '../_lib/http.js';

const categories=new Set(['Product Supply','Professional Services','Food & Catering','Fashion & Beauty','Events & Equipment','Other Services']);
const businessTypes=new Set(['Fashion & Beauty','Food & Catering','Product Supply','Professional Services','Events & Equipment','Creative & Digital Services','Other']);
const imageTypes=new Set(['image/jpeg','image/png','image/webp']);
const maxFileSize=5*1024*1024;
const maxRequestSize=30*1024*1024;
function str(v,max){return saneString(v,max)}
function desc(v,max){return typeof v==='string'&&v.trim().length<=max?v.trim():null}
function money(v){return Number.isSafeInteger(v)&&v>0&&v<=100000000}
function list(v,max){return Array.isArray(v)&&v.length<=max?v:null}
async function verifyPhoto(file){
 if(!file||typeof file.arrayBuffer!=='function'||!imageTypes.has(file.type)||file.size<1||file.size>maxFileSize)return false;
 const bytes=new Uint8Array(await file.slice(0,12).arrayBuffer());
 if(file.type==='image/jpeg')return bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff;
 if(file.type==='image/png')return [137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n);
 if(file.type==='image/webp')return String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';
 return false;
}
export async function onRequestPost({request,env}){
 if(!env.DB)return error('Vendor registration is not configured yet. Please contact HIT KENYA directly.',503);
 const origin=request.headers.get('origin');
 if(origin&&origin!==new URL(request.url).origin)return error('This request origin is not allowed.',403);
 const length=Number(request.headers.get('content-length')||0);
 if(length>maxRequestSize)return error('The application is too large. Please reduce the number or size of photos.',413);
 const contentType=(request.headers.get('content-type')||'').toLowerCase();
 let data,form=null,photos=[];
 try{
  if(contentType.startsWith('application/json'))data=await request.json();
  else if(contentType.startsWith('multipart/form-data')){
   form=await request.formData();
   data=JSON.parse(String(form.get('payload')||''));
  }else return error('Expected a JSON or multipart form submission.',415);
 }catch{return error('We could not read the application data.',400)}
 if(!data||Array.isArray(data)||typeof data!=='object'||data.website)return error('Invalid application.',400);
 const business=str(data.business,120),owner=str(data.owner,120),town=str(data.town,100),county=str(data.county,100),description=str(data.description,1200);
 const email=isEmail(data.email)?data.email.trim().toLowerCase():null;
 const phone=isKenyanPhone(data.phone)?data.phone.replace(/[\s-]/g,''):null;
 const type=businessTypes.has(data.businessType)?data.businessType:null;
 const cat=list(data.categories,6),products=list(data.products,8),services=list(data.services,8);
 if(!business||!owner||!county||!town||!description||!email||!phone||!type||!cat||!products||!services||data.consent!==true)return error('Please complete all required profile and consent details.',400);
 if(cat.some(c=>!categories.has(c))||new Set(cat).size!==cat.length||(!cat.length&&!products.length&&!services.length))return error('Choose at least one valid vendor service or product.',400);
 const normalizedProducts=[];
 for(const p of products){
  if(!p||typeof p!=='object'||!str(p.name,100)||!money(p.price)||desc(p.description,350)===null)return error('Check your product names, descriptions and prices.',400);
  normalizedProducts.push({name:p.name.trim(),price:p.price,description:p.description.trim()});
 }
 const normalizedServices=[];
 for(const s of services){
  if(!s||typeof s!=='object'||!str(s.name,100)||!str(s.description,450)||!money(s.price))return error('Check your service names, descriptions and prices.',400);
  normalizedServices.push({name:s.name.trim(),price:s.price,description:s.description.trim()});
 }
 if(form){
  const expectedKeys=new Set(['payload']);
  for(let i=0;i<normalizedProducts.length;i++)expectedKeys.add('product_file_'+i);
  for(let i=0;i<6;i++)expectedKeys.add('gallery_file_'+i);
  for(const [name,file] of form.entries()){
   if(!expectedKeys.has(name))return error('Unexpected upload field.',400);
   if(name==='payload')continue;
   if(!(await verifyPhoto(file)))return error('One or more photos must be JPG, PNG or WebP under 5 MB.',400);
   photos.push({name,file});
  }
  if(photos.length>14)return error('Too many images.',400);
  if(photos.length&&!env.VENDOR_UPLOADS)return error('Photo uploading is not configured yet. Please contact HIT KENYA or submit without images.',503);
 }
 try{
  const recent=await env.DB.prepare("SELECT COUNT(*) AS n FROM vendor_applications WHERE email=? AND created_at>=datetime('now','-1 hour')").bind(email).first();
  if(Number(recent?.n||0)>=3)return error('Too many applications submitted recently. Please try later.',429);
 }catch(ex){console.error('Vendor rate limit unavailable:',String(ex));return error('Vendor application database is unavailable.',503)}
 const ref='HK-V-'+crypto.randomUUID().replace(/-/g,'').slice(0,18).toUpperCase();
 const imageManifest=[];
 try{
  for(const {name,file} of photos){
   const ext=file.type==='image/jpeg'?'jpg':file.type==='image/png'?'png':'webp';
   const key=`vendor-applications/${ref}/${name}.${ext}`;
   await env.VENDOR_UPLOADS.put(key,await file.arrayBuffer(),{httpMetadata:{contentType:file.type}});
   imageManifest.push({field:name,key,contentType:file.type});
  }
  await env.DB.prepare(`INSERT INTO vendor_applications
   (reference,business_name,owner_name,email,phone,county,town,business_type,description,categories_json,products_json,services_json,images_json,consent,status)
   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(ref,business,owner,email,phone,county,town,type,description,JSON.stringify(cat),JSON.stringify(normalizedProducts),JSON.stringify(normalizedServices),JSON.stringify(imageManifest),1,'pending_review').run();
 }catch(ex){
  console.error('Vendor application saving failed:',String(ex));
  if(env.VENDOR_UPLOADS)await Promise.allSettled(imageManifest.map(m=>env.VENDOR_UPLOADS.delete(m.key)));
  return error('We could not save the application. Please try again later.',503);
 }
 return json({ok:true,reference:ref,status:'pending_review',published:false},201);
}
