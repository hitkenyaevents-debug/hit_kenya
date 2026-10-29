export function json(data,status=200){
  return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
export function error(message,status=400){return json({ok:false,message},status)}
export function safeReference(reference){return typeof reference==='string'&&/^HK-M-[A-Z0-9]{25}$/.test(reference)}
export function saneString(v,max){return typeof v==='string' && v.trim().length>0 && v.trim().length<=max ? v.trim():null}
export function isEmail(v){return typeof v==='string'&&v.length<=160&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
export function isKenyanPhone(v){return typeof v==='string'&&/^(?:\+254|0)[17]\d{8}$/.test(v.replace(/[\s-]/g,''))}
