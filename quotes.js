import {json,error,isEmail,isKenyanPhone,saneString} from '../_lib/http.js';
const needs=new Set(['Product Photography','Lifestyle / Brand Shoot','Social Media Content','Video Production','Editing & Post-Production','Other']);
const platforms=new Set(['Instagram','TikTok','Facebook','YouTube','Website']);
const budgets=new Set(['Under KSh 10,000','KSh 10,000 - 30,000','KSh 30,000 - 75,000','KSh 75,000+']);
export async function onRequestPost({request,env}){
  if(!env.DB) return error('Quote submissions are not enabled yet. Please contact HIT KENYA directly.',503);
  const origin=request.headers.get('Origin');
  if(origin && origin!==new URL(request.url).origin)return error('Origin not allowed.',403);
  if(!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||''))return error('Expected JSON.',415);
  if(Number(request.headers.get('Content-Length')||0)>12000)return error('Request too large.',413);
  let body;
  try{body=await request.json()}catch{return error('Invalid JSON request.');}
  if(!body||typeof body!=='object'||Array.isArray(body))return error('Invalid request.');
  if(body.website)return error('Invalid submission.',400);
  const name=saneString(body.name,120);
  const email=isEmail(body.email)?body.email.trim().toLowerCase():null;
  const phone=isKenyanPhone(body.phone)?body.phone.replace(/[\s-]/g,''):null;
  const business=typeof body.business==='string'&&body.business.trim().length<=160?body.business.trim():null;
  const location=saneString(body.location,180),brief=saneString(body.brief,3000);
  const date=body.projectDate;
  const validDate=typeof date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&!Number.isNaN(Date.parse(date+'T00:00:00Z'))&&new Date(date+'T00:00:00Z').toISOString().slice(0,10)===date;
  const p=body.platforms;
  if(!name||!email||!phone||business===null||!location||!brief||!needs.has(body.need)||!budgets.has(body.budget)||!validDate||!body.consent||!Array.isArray(p)||p.length>5||new Set(p).size!==p.length||!p.every(x=>platforms.has(x)))return error('Please provide complete and valid quote details.');
  // Basic rate limiting by email, plus a honeypot. Enable Cloudflare WAF/Turnstile for production spam protection.
  try{
    const recent=await env.DB.prepare("SELECT COUNT(*) AS n FROM quote_requests WHERE email=? AND created_at >= datetime('now','-1 hour')").bind(email).first();
    if(Number(recent?.n||0)>=3)return error('Too many requests. Please try again later.',429);
  }catch(e){console.error('Quote request rate limit unavailable:',String(e));return error('Quote service unavailable. Please try again later.',503);}
  const reference='HK-Q-'+crypto.randomUUID().replace(/-/g,'').slice(0,18).toUpperCase();
  try{
    await env.DB.prepare('INSERT INTO quote_requests (reference,name,email,phone,business,service,platforms_json,project_date,location,budget,brief,consent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
      .bind(reference,name,email,phone,business,body.need,JSON.stringify(p),date,location,body.budget,brief,1).run();
  }catch(e){console.error('Quote request write failed:',String(e));return error('Quote service unavailable. Please try again later.',503);}
  return json({ok:true,reference},201);
}
