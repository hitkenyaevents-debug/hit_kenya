import {json,error,isEmail,isKenyanPhone,saneString} from '../../_lib/http.js';
const allowedTypes=['Event','Product','Brand','Other'];
const allowedBudgets=['Under KSh 10,000','KSh 10,000 - 50,000','KSh 50,000 - 100,000','KSh 100,000+'];
const allowedGoals=['Sell tickets','Build awareness','Promote a product','Grow social media reach'];
export async function onRequestPost({request,env}){
  if(!env.DB) return error('Marketing requests are not enabled on this site. Please contact HIT KENYA directly.',503);
  const origin=request.headers.get('Origin');
  if(origin && origin!==new URL(request.url).origin) return error('Origin not allowed.',403);
  if(!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||''))return error('Expected JSON request.',415);
  if(Number(request.headers.get('Content-Length')||0)>12000)return error('Request too large.',413);
  let body;try{body=await request.json()}catch{return error('Invalid submission.')}
  if(body.website) return error('Invalid submission.',400); // honeypot
  const name=saneString(body.name,120),email=isEmail(body.email)?body.email.trim().toLowerCase():null;
  const phone=isKenyanPhone(body.phone)?body.phone.replace(/[\s-]/g,''):null;
  const location=saneString(body.location,160),details=saneString(body.details,3000);
  const date=body.campaignDate;
  if(!name||!email||!phone||!location||!details||!allowedTypes.includes(body.promotionType)||!allowedBudgets.includes(body.budget)||!allowedGoals.includes(body.goal)||!body.consent||typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date+'T00:00:00Z'))){return error('Please provide complete and valid campaign details.')}
  const ref='HK-MP-'+crypto.randomUUID().replace(/-/g,'').slice(0,18).toUpperCase();
  try{
    await env.DB.prepare('INSERT INTO marketing_requests(reference,name,email,phone,promotion_type,campaign_date,location,budget,goal,details) VALUES(?,?,?,?,?,?,?,?,?,?)').bind(ref,name,email,phone,body.promotionType,date,location,body.budget,body.goal,details).run();
  }catch(e){console.error('Marketing request database write failed:',String(e));return error('Marketing requests are not currently available. Please contact HIT KENYA.',503)}
  return json({ok:true,reference:ref},201);
}
