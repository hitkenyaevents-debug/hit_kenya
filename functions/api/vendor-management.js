import {json,error,isEmail,isKenyanPhone,saneString} from '../_lib/http.js';
const eventTypes=new Set(['Concert / Festival','Corporate Event','Conference / Exhibition','Wedding / Private Celebration','Market / Pop-Up','Community Event','Other Event']);
const attendance=new Set(['Under 100','100–499','500–999','1,000–4,999','5,000–9,999','10,000+','Not yet confirmed']);
const vendorCounts=new Set(['1–5','6–10','11–20','21–50','More than 50','Not sure yet']);
const budgets=new Set(['Under KSh 25,000','KSh 25,000–99,999','KSh 100,000–249,999','KSh 250,000–499,999','KSh 500,000–999,999','KSh 1,000,000+','Not yet determined']);
const packages=new Set(['Vendor Sourcing','Vendor Coordination','Full Vendor Management']);
const statuses=new Set(['I have some vendors','Source all vendors','Review existing vendors']);
const categories=new Set(['Food & Beverage Vendors','Security Services','Catering Services','Transport & Logistics','Decoration & Event Styling','Printing & Branding','Photography & Videography','Exhibitors & Market Stalls','Sound, Lighting & Stage Equipment','Sanitation & Cleaning','Furniture & Tents','Other']);
const mimeTypes=new Set(['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','image/jpeg','image/png']);
const maxFileBytes=10*1024*1024;
const asText=(value,max,optional=false)=>optional&&(!value||!String(value).trim())?'':saneString(value,max);
const validDate=(s)=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(new Date(s+'T00:00:00Z').getTime())&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
async function verifyUpload(file){
 if(!file||!mimeTypes.has(file.type)||file.size<1||file.size>maxFileBytes||typeof file.arrayBuffer!=='function')return false;
 const b=new Uint8Array(await file.slice(0,12).arrayBuffer());
 if(file.type==='application/pdf')return String.fromCharCode(...b.slice(0,5))==='%PDF-';
 if(file.type==='image/jpeg')return b[0]===255&&b[1]===216&&b[2]===255;
 if(file.type==='image/png')return [137,80,78,71,13,10,26,10].every((v,i)=>b[i]===v);
 if(file.type==='application/msword')return [208,207,17,224,161,177,26,225].every((v,i)=>b[i]===v);
 if(file.type==='application/vnd.openxmlformats-officedocument.wordprocessingml.document')return b[0]===80&&b[1]===75;
 return false;
}
export async function onRequestPost({request,env}){
 if(!env.DB)return error('Vendor management enquiries are not configured yet. Please contact HIT KENYA directly.',503);
 const origin=request.headers.get('Origin');if(origin&&origin!==new URL(request.url).origin)return error('Request origin not allowed.',403);
 const length=Number(request.headers.get('content-length')||0);if(length>12*1024*1024)return error('The request is too large.',413);
 let form,body,file;
 try{
  if(!(request.headers.get('content-type')||'').toLowerCase().startsWith('multipart/form-data'))return error('Expected a vendor management form submission.',415);
  form=await request.formData();
  if([...form.keys()].some(k=>k!=='payload'&&k!=='document'))return error('Unexpected form field.',400);
  body=JSON.parse(String(form.get('payload')||''));file=form.get('document');
 }catch{return error('Unable to read your submission.',400)}
 if(!body||Array.isArray(body)||typeof body!=='object'||body.website)return error('Invalid request.',400);
 const name=asText(body.fullName,120),email=isEmail(body.email)?body.email.toLowerCase().trim():null,phone=isKenyanPhone(body.phone)?body.phone.replace(/[\s-]/g,''):null;
 const organisation=asText(body.organisation,120,true),eventName=asText(body.eventName,140),location=asText(body.eventLocation,180);
 const notes=asText(body.notes,2000,true),other=asText(body.otherCategory,120,true);
 const selected=Array.isArray(body.categories)?body.categories:null;
 const consent=body.consent===true;
 if(!name||!email||!phone||organisation===null||!eventName||!location||notes===null||other===null||!consent)return error('Please check your contact and event information.',400);
 if(!eventTypes.has(body.eventType)||!attendance.has(body.attendance)||!vendorCounts.has(body.vendorCount)||!budgets.has(body.budget)||!packages.has(body.package)||!statuses.has(body.vendorStatus)||!['Yes','No','Not sure'].includes(body.feeIncluded))return error('Please select valid event, budget and vendor options.',400);
 if(!validDate(body.eventDate)||body.alternativeDate&&(!validDate(body.alternativeDate)))return error('Please check the event date.',400);
 const today=new Date().toISOString().slice(0,10);
 if(body.eventDate<today||body.alternativeDate&&body.alternativeDate<today)return error('Event dates must not be in the past.',400);
 if(!selected||selected.length<1||selected.length>12||selected.some(v=>!categories.has(v))||new Set(selected).size!==selected.length||selected.includes('Other')&&!other)return error('Please select valid vendor categories and describe any other requirements.',400);
 if(file&&typeof file.arrayBuffer==='function'){
  if(!(await verifyUpload(file)))return error('Supporting documents must be valid PDF, DOC, DOCX, JPG or PNG files under 10 MB.',400);
  if(!env.VENDOR_MANAGEMENT_UPLOADS)return error('Document storage is not configured. Please submit your enquiry without an attachment or contact HIT KENYA.',503);
 }else file=null;
 try{
  const recent=await env.DB.prepare("SELECT COUNT(*) AS n FROM vendor_management_requests WHERE email=? AND created_at>=datetime('now','-1 hour')").bind(email).first();
  if(Number(recent?.n||0)>=3)return error('Too many requests from this address. Please try again later.',429);
 }catch(e){console.error('Vendor management rate check failed',String(e));return error('Request service is temporarily unavailable.',503)}
 const reference='HK-VM-'+crypto.randomUUID().replace(/-/g,'').slice(0,16).toUpperCase();
 let uploadedKey='';
 try{
  if(file){
   const ext=file.type==='application/pdf'?'pdf':file.type==='image/jpeg'?'jpg':file.type==='image/png'?'png':file.type==='application/msword'?'doc':'docx';
   uploadedKey=`vendor-management/${reference}/supporting-document.${ext}`;
   await env.VENDOR_MANAGEMENT_UPLOADS.put(uploadedKey,await file.arrayBuffer(),{httpMetadata:{contentType:file.type}});
  }
  await env.DB.prepare(`INSERT INTO vendor_management_requests
   (reference,full_name,organisation,email,phone,event_name,event_type,event_date,alternative_date,event_location,attendance,categories_json,other_category,vendor_count,package_name,budget,fee_included,vendor_status,notes,document_key,consent,status)
   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
    reference,name,organisation,email,phone,eventName,body.eventType,body.eventDate,body.alternativeDate||'',location,body.attendance,JSON.stringify(selected),other,body.vendorCount,body.package,body.budget,body.feeIncluded,body.vendorStatus,notes,uploadedKey,1,'pending_review').run();
 }catch(e){
  console.error('Vendor management save error',String(e));
  if(uploadedKey)await env.VENDOR_MANAGEMENT_UPLOADS.delete(uploadedKey).catch(()=>{});
  return error('We could not save your request. Please try again later.',503);
 }
 return json({ok:true,reference,status:'pending_review',payment_status:'not_paid'},201);
}
