import {json,error,isEmail,isKenyanPhone,saneString} from '../_lib/http.js';

const types=new Set(['Product Photography','Lifestyle & Brand Shoot','Social Media Content','Video Production','Editing & Post Production','Content Strategy','Campaign & Ad Content','Other']);
const budgets=new Set(['','Under KSh 10,000','KSh 10,000 - 30,000','KSh 30,000 - 75,000','KSh 75,000+']);

export async function onRequestPost({request,env}){
  if(!env.DB)return error('Content requests are not enabled yet. Please contact HIT KENYA directly.',503);
  const origin=request.headers.get('Origin');
  if(origin&&origin!==new URL(request.url).origin)return error('Request origin not allowed.',403);
  if(!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||''))return error('Expected JSON.',415);
  if(Number(request.headers.get('Content-Length')||0)>12000)return error('Request too large.',413);
  let b;
  try{b=await request.json()}catch{return error('Invalid JSON request.',400)}
  if(!b||typeof b!=='object'||Array.isArray(b)||b.website)return error('Invalid submission.',400);
  const name=saneString(b.name,120);
  const email=isEmail(b.email)?b.email.trim().toLowerCase():null;
  const phone=isKenyanPhone(b.phone)?b.phone.replace(/[\s-]/g,''):null;
  const business=saneString(b.business,160);
  const details=saneString(b.details,2000);
  const date=b.date;
  const validDate=typeof date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&!Number.isNaN(Date.parse(date+'T00:00:00Z'))&&new Date(date+'T00:00:00Z').toISOString().slice(0,10)===date;
  const today=new Date().toISOString().slice(0,10);
  const budget=typeof b.budget==='string'?b.budget:'';
  if(!name||!email||!phone||!business||!details||!types.has(b.type)||!budgets.has(budget)||!validDate||date<today||b.consent!==true)return error('Please complete the required fields with valid details.',400);
  try{
    const recent=await env.DB.prepare("SELECT COUNT(*) AS n FROM content_requests WHERE email=? AND created_at >= datetime('now','-1 hour')").bind(email).first();
    if(Number(recent?.n||0)>=3)return error('Too many requests. Please try again later.',429);
  }catch(ex){console.error('Content rate-limit check unavailable:',String(ex));return error('The content enquiry service is temporarily unavailable.',503)}
  const reference='HK-C-'+crypto.randomUUID().replace(/-/g,'').slice(0,18).toUpperCase();
  try{
    await env.DB.prepare('INSERT INTO content_requests (reference,name,email,phone,business,content_type,details,preferred_date,budget,consent) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(reference,name,email,phone,business,b.type,details,date,budget,1).run();
  }catch(ex){console.error('Content request saving failed:',String(ex));return error('We could not save your request. Please try again later.',503)}
  return json({ok:true,reference},201);
}
