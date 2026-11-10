(()=>{
  'use strict';
  const form=document.getElementById('vendorManagementForm');
  const menu=document.getElementById('menuToggle');
  const nav=document.getElementById('siteMenu');
  const upload=document.getElementById('supportingFile');
  const dropzone=document.getElementById('dropzone');
  const fileStatus=document.getElementById('fileStatus');
  const status=document.getElementById('status');
  const submitButton=document.getElementById('submitButton');
  const notes=form.elements.namedItem('notes');
  const notesCount=document.getElementById('notesCount');
  const other=document.getElementById('otherCategory');
  const otherWrap=document.getElementById('otherCategoryWrap');
  const reviewDialog=document.getElementById('reviewDialog');
  const reviewContent=document.getElementById('reviewContent');
  const finalButton=document.getElementById('confirmSubmit');
  let selectedFile=null;
  const allowedMime=new Set(['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','image/jpeg','image/png']);
  const maxFileSize=10*1024*1024;
  const localDate=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
  const minimumDate=localDate();
  form.elements.namedItem('eventDate').min=minimumDate;
  form.elements.namedItem('alternativeDate').min=minimumDate;

  menu.addEventListener('click',()=>{const expanded=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(expanded));menu.setAttribute('aria-label',expanded?'Close navigation menu':'Open navigation menu')});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
  const values=()=>[...form.querySelectorAll('input[name="vendorCategories"]:checked')].map(el=>el.value);
  const value=name=>String(form.elements.namedItem(name)?.value||'').trim();
  function updateOther(){const hasOther=values().includes('Other');otherWrap.hidden=!hasOther;other.required=hasOther;if(!hasOther)other.value=''}
  form.querySelectorAll('[name="vendorCategories"]').forEach(el=>el.addEventListener('change',updateOther));
  notes.addEventListener('input',()=>{notesCount.textContent=`${notes.value.length} / 500`});
  const showStatus=(message,kind='error')=>{status.textContent=message;status.className=`status ${kind}`;status.hidden=false;status.scrollIntoView({behavior:'smooth',block:'nearest'})};
  function validateFile(file){
    if(!file)return {ok:true};
    if(file.size<1||file.size>maxFileSize)return {ok:false,message:'The document must be smaller than 10 MB and not empty.'};
    if(!/\.(pdf|doc|docx|jpe?g|png)$/i.test(file.name)||!allowedMime.has(file.type))return {ok:false,message:'Please choose a PDF, DOC, DOCX, JPG or PNG document.'};
    return {ok:true};
  }
  function chooseFile(file){
    const check=validateFile(file);
    if(!check.ok){selectedFile=null;upload.value='';fileStatus.textContent=check.message;fileStatus.style.color='#ffb3b3';return}
    selectedFile=file||null;
    fileStatus.textContent=file?`Selected: ${file.name} (${(file.size/1024/1024).toFixed(2)} MB)`:'No document selected';
    fileStatus.style.color='';
  }
  dropzone.addEventListener('click',()=>upload.click());
  dropzone.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();upload.click()}});
  upload.addEventListener('change',()=>chooseFile(upload.files?.[0]));
  for(const event of ['dragenter','dragover'])dropzone.addEventListener(event,e=>{e.preventDefault();dropzone.classList.add('dragging')});
  for(const event of ['dragleave','drop'])dropzone.addEventListener(event,e=>{e.preventDefault();dropzone.classList.remove('dragging')});
  dropzone.addEventListener('drop',e=>{const file=e.dataTransfer?.files?.[0];if(file)chooseFile(file)});

  const fieldLabels=[
    ['Full name','fullName'],['Company / organisation','organisation'],['Email address','email'],['WhatsApp number','phone'],
    ['Event name','eventName'],['Event type','eventType'],['Event date','eventDate'],['Alternative date','alternativeDate'],
    ['Event location','eventLocation'],['Expected attendance','attendance'],['Expected number of vendors','vendorCount'],
    ['Management package','package'],['Estimated vendor budget','budget'],['Budget includes management fee','feeIncluded'],
    ['Existing vendors','vendorStatus'],['Event requirements','notes']
  ];
  function renderReview(){
    reviewContent.replaceChildren();
    for(const [label,key] of fieldLabels){
      const valueForField=value(key)||'Not provided';
      const row=document.createElement('dl');row.className='review-pair';
      const dt=document.createElement('dt');dt.textContent=label;
      const dd=document.createElement('dd');dd.textContent=valueForField;
      row.append(dt,dd);reviewContent.appendChild(row);
    }
    const cats=document.createElement('dl');cats.className='review-pair';
    const dt=document.createElement('dt');dt.textContent='Vendor categories';
    const dd=document.createElement('dd');dd.textContent=values().map(v=>v==='Other'?`Other: ${value('otherCategory')}`:v).join(', ');
    cats.append(dt,dd);reviewContent.appendChild(cats);
    const file=document.createElement('dl');file.className='review-pair';
    const fileDt=document.createElement('dt');fileDt.textContent='Supporting document';
    const fileDd=document.createElement('dd');fileDd.textContent=selectedFile?.name||'None';
    file.append(fileDt,fileDd);reviewContent.appendChild(file);
  }
  function validateFields(){
    status.hidden=true;
    if(!form.reportValidity())return false;
    if(!values().length){showStatus('Please select at least one vendor category.');document.getElementById('vendor-requirements').scrollIntoView({behavior:'smooth'});return false}
    if(values().includes('Other')&&!value('otherCategory')){showStatus('Please describe the other vendor category.');return false}
    if(!/^(?:\+254|0)[17]\d{8}$/.test(value('phone').replace(/[\s-]/g,''))){showStatus('Enter a valid Kenyan WhatsApp number, such as +254 712 345 678.');return false}
    if(value('eventDate')<localDate()||value('alternativeDate')&&value('alternativeDate')<localDate()){showStatus('Please choose an event date that has not passed.');return false}
    if(value('notes').length<10){showStatus('Please describe your event requirements in at least 10 characters.');return false}
    const fileCheck=validateFile(selectedFile);if(!fileCheck.ok){showStatus(fileCheck.message);return false}
    return true;
  }
  form.addEventListener('submit',e=>{e.preventDefault();if(!validateFields())return;renderReview();reviewDialog.showModal()});
  document.getElementById('closeReview').addEventListener('click',()=>reviewDialog.close());
  document.getElementById('editRequest').addEventListener('click',()=>reviewDialog.close());
  reviewDialog.addEventListener('click',e=>{if(e.target===reviewDialog)reviewDialog.close()});
  finalButton.addEventListener('click',async()=>{
    if(!validateFields()){reviewDialog.close();return}
    const raw={};
    for(const [label,key] of fieldLabels)raw[key]=value(key);
    raw.otherCategory=value('otherCategory');
    const payload={...raw,categories:values(),consent:form.elements.namedItem('consent').checked,website:value('website')};
    const data=new FormData();data.set('payload',JSON.stringify(payload));if(selectedFile)data.set('document',selectedFile,selectedFile.name);
    finalButton.disabled=true;submitButton.disabled=true;finalButton.textContent='SENDING YOUR REQUEST…';
    try{
      const response=await fetch('/api/vendor-management',{method:'POST',body:data,headers:{Accept:'application/json'}});
      const result=await response.json().catch(()=>null);
      if(!response.ok||!result?.ok||!result.reference)throw new Error(result?.message||'The request could not be saved. Please try again.');
      reviewDialog.close();form.reset();selectedFile=null;upload.value='';updateOther();notesCount.textContent='0 / 500';fileStatus.textContent='No document selected';
      showStatus(`Your vendor management request has been received for review. Reference: ${result.reference}. HIT KENYA will contact you about the next steps. No payment was taken or booking confirmed.`,'success');
    }catch(err){
      reviewDialog.close();showStatus(err?.message||'Unable to save your request. Please try again later or contact HIT KENYA.');
    }finally{finalButton.disabled=false;submitButton.disabled=false;finalButton.textContent='CONFIRM & SEND REQUEST →'}
  });
})();
