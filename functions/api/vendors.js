import {json,error} from '../_lib/http.js';

// Public directory: read-only, manually approved vendor profiles only.
// Never return vendor_applications, applicant contacts, or unpublished content.
export async function onRequestGet({env}){
  if(!env.DB)return error('Verified vendor directory is not yet connected.',503);
  try{
    const {results=[]}=await env.DB.prepare(`
      SELECT id,display_name,category,county,town,description,services_json,cover_url
      FROM vendor_public_profiles
      WHERE status='approved' AND public_enabled=1
      ORDER BY display_name COLLATE NOCASE ASC LIMIT 100
    `).all();
    const vendors=results.map(r=>{
      let services=[];
      try{const arr=JSON.parse(r.services_json||'[]');if(Array.isArray(arr))services=arr.filter(x=>typeof x==='string').slice(0,12)}catch{}
      return {id:r.id,display_name:r.display_name,category:r.category,county:r.county,town:r.town,description:r.description,services,cover_url:r.cover_url||''};
    });
    return json({ok:true,vendors});
  }catch(ex){console.error('Vendor directory read failed',String(ex));return error('Approved vendor directory is temporarily unavailable.',503)}
}
