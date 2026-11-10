import {json,error,isEmail,isKenyanPhone,saneString} from '../_lib/http.js';

const categories=new Set(['Singer','DJ','Band','MC / Host','Dancer','Instrumentalist','Comedian','Other']);
const genres=new Set(['Afrobeats','Gengetone','Gospel','Hip-hop','R&B','Bongo','Amapiano','Reggae','Dancehall','Other']);
const years=new Set(['New artist','1–2 years','3–5 years','6–10 years','10+ years']);
const fees=new Set(['Under KSh 10,000','KSh 10,000–24,999','KSh 25,000–49,999','KSh 50,000–99,999','KSh 100,000+','Negotiable']);
const availability=new Set(['Flexible / By request','Weekends','Weekdays','Currently limited']);
const fileTypes={photo:new Set(['image/jpeg','image/png','image/webp']),video:new Set(['video/mp4','video/webm']),pressKit:new Set(['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])};
const fileLimits={photo:4*1024*1024,video:15*1024*1024,pressKit:8*1024*1024};
function optional(v,max=300){return typeof v==='string'&&v.trim().length<=max?v.trim():null}
function validLinks(obj,keys){if(!obj||typeof obj!=='object'||Array.isArray(obj))return false;return keys.every(k=>{const v=obj[k];if(typeof v!=='string'||v.length>450)return false;if(!v.trim())return true;try{const u=new URL(v);return ['https:','http:'].includes(u.protocol)&&!!u.hostname}catch{return false}})}
function validSocials(v){return !!v&&typeof v==='object'&&!Array.isArray(v)&&['instagram','tiktok','facebook','x'].every(k=>optional(v[k],250)!==null)}
async function verifyFile(key,file){if(!(file instanceof File)||file.size<1||file.size>fileLimits[key]||!fileTypes[key].has(file.type))return false;const a=new Uint8Array(await file.slice(0,24).arrayBuffer());const str=(s,e)=>String.fromCharCode(...a.slice(s,e));if(key==='photo'){if(file.type==='image/jpeg')return a[0]===255&&a[1]===216&&a[2]===255;if(file.type==='image/png')return [137,80,78,71,13,10,26,10].every((n,i)=>a[i]===n);return str(0,4)==='RIFF'&&str(8,12)==='WEBP';}if(key==='pressKit'){if(file.type==='application/pdf')return str(0,5)==='%PDF-';if(file.type==='application/msword')return a[0]===208&&a[1]===207;return str(0,2)==='PK';}if(key==='video'){if(file.type==='video/webm')return a[0]===26&&a[1]===69&&a[2]===223&&a[3]===163;return str(4,8)==='ftyp';}return false}
export async function onRequestPost({request,env}){
 const origin=request.headers.get('Origin');if(origin&&origin!==new URL(request.url).origin)return error('This request origin is not permitted.',403);
 if(!env.DB)return error('Artist applications are not enabled yet. Please contact HIT KENYA to apply.',503);
 const contentType=request.headers.get('Content-Type')||'';if(!contentType.toLowerCase().startsWith('multipart/form-data'))return error('Expected a form submission.',415);
 if(Number(request.headers.get('Content-Length')||0)>29*1024*1024)return error('Attachments exceed the supported request size.',413);
 let form,body;try{form=await request.formData();body=JSON.parse(String(form.get('payload')||''))}catch{return error('Could not read the application.',400)}
 if(!body||typeof body!=='object'||Array.isArray(body)||body.website)return error('Invalid application.',400);
 const stageName=saneString(body.stageName,100),legalName=saneString(body.legalName,120),county=saneString(body.county,100),languages=saneString(body.languages,150),bio=saneString(body.bio,500);
 const phone=isKenyanPhone(body.phone)?body.phone.replace(/[\s-]/g,''):null,email=isEmail(body.email)?body.email.trim().toLowerCase():null;
 const keys=['youtube','spotify','soundcloud','portfolio'];
 const genresList=Array.isArray(body.genres)?body.genres:[];
 const moreBio=optional(body.moreBio,1000);
 if(!stageName||!legalName||!county||!languages||!bio||!phone||!email||!categories.has(body.category)||!years.has(body.experience)||!fees.has(body.fee)||!availability.has(body.availability)||genresList.length===0||genresList.length>10||genresList.some(g=>!genres.has(g))||new Set(genresList).size!==genresList.length||!validLinks(body.links,keys)||!validSocials(body.socials)||moreBio===null||body.consent!==true)return error('Please check your required artist and media details.',400);
 const files=[];
 for(const [key,value] of form.entries()){
  if(key==='payload')continue;
  if(!['photo','video','pressKit'].includes(key)||files.some(f=>f.key===key))return error('Unexpected or repeated upload field.',400);
  if(!(await verifyFile(key,value)))return error(`The ${key} attachment has an unsupported format or file size.`,400);
  files.push({key,file:value});
 }
 if(!keys.some(k=>body.links[k].trim())&&!files.some(f=>f.key==='video'))return error('Share at least one music/video link or a performance clip.',400);
 if(files.length&&!env.ARTIST_UPLOADS)return error('File uploads are not configured yet. Please submit without attachments or contact HIT KENYA.',503);
 try{const recent=await env.DB.prepare("SELECT COUNT(*) AS n FROM artist_applications WHERE email=? AND created_at>=datetime('now','-1 hour')").bind(email).first();if(Number(recent?.n||0)>=3)return error('Too many applications recently. Please try again later.',429)}catch(e){console.error('Artist app lookup:',String(e));return error('Artist registration database is unavailable.',503)}
 const ref='HK-A-'+crypto.randomUUID().replace(/-/g,'').slice(0,18).toUpperCase();const manifests=[];
 try{
  for(const {key,file} of files){const ext=key==='photo'?(file.type==='image/jpeg'?'jpg':file.type==='image/png'?'png':'webp'):key==='video'?(file.type==='video/mp4'?'mp4':'webm'):file.type==='application/pdf'?'pdf':file.type==='application/msword'?'doc':'docx';const storageKey=`artist-applications/${ref}/${key}.${ext}`;await env.ARTIST_UPLOADS.put(storageKey,await file.arrayBuffer(),{httpMetadata:{contentType:file.type}});manifests.push({type:key,key:storageKey,contentType:file.type})}
  await env.DB.prepare(`INSERT INTO artist_applications (reference,stage_name,legal_name,category,email,phone,county,languages,bio,years_experience,fee_range,availability,genres_json,links_json,socials_json,additional_info,files_json,consent,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(ref,stageName,legalName,body.category,email,phone,county,languages,bio,body.experience,body.fee,body.availability,JSON.stringify(genresList),JSON.stringify(body.links),JSON.stringify(body.socials),moreBio,JSON.stringify(manifests),1,'pending_review').run();
 }catch(e){console.error('Saving artist application:',String(e));if(env.ARTIST_UPLOADS)await Promise.allSettled(manifests.map(m=>env.ARTIST_UPLOADS.delete(m.key)));return error('We could not save the application. Please try again later.',503)}
 return json({ok:true,reference:ref,status:'pending_review',published:false,payment_status:'not_paid'},201);
}
