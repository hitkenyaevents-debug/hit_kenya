(()=>{
 'use strict';
 const form=document.getElementById('vendorManagementForm');
 const menu=document.getElementById('mobileMenu');
 const nav=document.getElementById('navLinks');
 const fileInput=document.getElementById('supportingFile');
 const fileStatus=document.getElementById('fileStatus');
 const status=document.getElementById('status');
 const submit=document.getElementById('submitButton');
 const other=document.getElementById('otherCategory');
 const otherWrap=document.getElementById('otherCategoryWrap');
 const notes=form.elements.notes;
 const tomorrow=new Date(); tomorrow.setHours(0,0,0,0);
 const dateMin=new Date(tomorrow.getTime()-tomorrow.getTimezoneOffset()*60000).toISOString().slice(0,10);
 for(const n of ['eventDate','alternativeDate'])form.elements[n].min=dateMin;
 menu.addEventListener('click',()=>{const isOpen=nav.classList.toggle('expanded');menu.setAttribute('aria-expanded',String(isOpen));menu.setAttribute('aria-label',isOpen?'Close navigation':'Open navigation');});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('expanded');menu.setAttribute('aria-expanded','false')}));
 function showError(message){status.hidden=false;status.className='status error';status.textContent=message;status.scrollIntoView({behavior:'smooth',block:'nearest'});}
 function checkedCategories(){return [...form.querySelectorAll('input[name="vendorCategories"]:checked')].map(n=>n.value);}
 function updateOther(){const enabled=checkedCategories().includes('Other');otherWrap.hidden=!enabled;other.required=enabled;if(!enabled)other.value='';}
 form.querySelectorAll('input[name="vendorCategories"]').forEach(x=>x.addEventListener('change',updateOther));
 notes.addEventListener('input',()=>{document.getElementById('notesCount').textContent=notes.value.length+' / 2000'});
 fileInput.addEventListener('change',()=>{
  const file=fileInput.files?.[0];
  if(!file){fileStatus.textContent='No document selected';return;}
  const allowed=['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','image/jpeg','image/png'];
  const extension=/\.(pdf|doc|docx|jpg|jpeg|png)$/i.test(file.name);
  if(!extension||!allowed.includes(file.type)||file.size>10*1024*1024||file.size===0){fileInput.value='';fileStatus.textContent='Please use a valid PDF, DOC, DOCX, JPG or PNG under 10 MB.';return;}
  fileStatus.textContent=`Attached: ${file.name} (${(file.size/1024/1024).toFixed(2)} MB)`;
 });
 form.addEventListener('submit',async e=>{
  e.preventDefault();status.hidden=true;
  const categories=checkedCategories();
  if(!form.reportValidity())return;
  if(!categories.length){showError('Please select at least one vendor category.');document.getElementById('requirements').scrollIntoView({behavior:'smooth'});return;}
  if(form.elements.eventDate.value<dateMin){showError('Please select an event date that has not passed.');return;}
  if(form.elements.alternativeDate.value&&form.elements.alternativeDate.value<dateMin){showError('The alternative event date must not be in the past.');return;}
  const raw={}; for(const field of ['fullName','organisation','email','phone','eventName','eventType','eventDate','alternativeDate','eventLocation','attendance','vendorCount','budget','feeIncluded','vendorStatus','package','notes','otherCategory'])raw[field]=form.elements[field].value.trim();
  const payload={...raw,categories,consent:form.elements.consent.checked,website:form.elements.website.value.trim()};
  const data=new FormData();data.append('payload',JSON.stringify(payload));if(fileInput.files?.[0])data.append('document',fileInput.files[0]);
  submit.disabled=true;submit.textContent='SENDING REQUEST…';
  try{
   const response=await fetch('/api/vendor-management',{method:'POST',body:data,headers:{Accept:'application/json'}});
   const result=await response.json().catch(()=>null);
   if(!response.ok||!result?.ok||!result?.reference)throw new Error(result?.message||'We could not save your request. Please try again later.');
   status.hidden=false;status.className='status success';status.textContent=`Request received for review. Your reference is ${result.reference}. HIT KENYA will contact you about next steps. No booking has been confirmed or paid.`;
   form.reset();updateOther();document.getElementById('notesCount').textContent='0 / 2000';fileStatus.textContent='No document selected';
   status.scrollIntoView({behavior:'smooth',block:'center'});
  }catch(err){showError(err.message||'Unable to submit. Please check your connection or contact HIT KENYA directly.');}
  finally{submit.disabled=false;submit.textContent='➤  SUBMIT VENDOR MANAGEMENT REQUEST  →';}
 });
})();
