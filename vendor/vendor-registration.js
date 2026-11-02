(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const products = [];
  const services = [];
  const gallery = [];
  let activeStep = 0;
  let editingProduct = -1;
  let editingService = -1;
  let submitted = false;
  const maxSize = 5 * 1024 * 1024;
  const allowTypes = new Set(['image/jpeg','image/png','image/webp']);
  const labels = {
    1: ['BUSINESS','PROFILE','Tell us who you are, where you operate and what makes your business special.'],
    2: ['SERVICES &','PRODUCTS','Showcase what you offer. Add services, products, pricing and images to create a professional vendor profile.'],
    3: ['REVIEW &','SUBMIT','Review your business details, products and services, then submit the application for approval.']
  };
  const money = (n) => 'KSh ' + Number(n).toLocaleString('en-KE');
  function node(tag, cls, text) {
    const el = document.createElement(tag);
    if(cls) el.className = cls;
    if(text !== undefined) el.textContent = text;
    return el;
  }
  function showAlert(message) {
    $('generalAlert').textContent = message;
    $('generalAlert').hidden = !message;
    if(message) $('generalAlert').scrollIntoView({behavior:'smooth',block:'center'});
  }
  function clearAlert(){showAlert('')}
  function goTo(step, options={}) {
    let validationMessage='';
    if(step === 3 && !options.skipValidation) {
      if(!validProfile()) { validationMessage='Please complete your Business Profile before reviewing your application.'; step = 1; }
      else if(!validServices()) { validationMessage='Please add at least one service category, product or service listing.'; step = 2; }
    }
    activeStep = step;
    for(let i=1;i<=3;i++){
      $('stage'+i).hidden = i!==step;
      const b=document.querySelector(`[data-step-target="${i}"]`);
      b.classList.toggle('active',i===step);
      b.classList.toggle('complete',i<step && (i!==1 || validProfile()));
      b.setAttribute('aria-current',i===step?'step':'false');
      b.querySelector('.bubble').textContent=i<step && (i!==1 || validProfile())?'✓':String(i);
    }
    const title=labels[step];
    $('heroTitle').replaceChildren(document.createTextNode(title[0]),document.createElement('br'));
    $('heroTitle').append(node('span','',title[1]));
    $('heroDescription').textContent=title[2];
    if(step===3) renderReview();
    if(!options.keepAlert) clearAlert();
    if(validationMessage) showAlert(validationMessage);
    const hash=['','#profile','#services','#review'][step];
    try{history.replaceState(null,'',location.pathname+location.search+hash)}catch{}
    window.scrollTo({top:0,behavior:'instant'});
  }
  function validProfile(){
    if(!$('profileForm').checkValidity()) return false;
    const phone=$('phone').value.replace(/[\s()-]/g,'');
    return /^(?:\+254|0)[17]\d{8}$/.test(phone);
  }
  function profileError(){
    if(!$('profileForm').reportValidity())return;
    showAlert('Enter a valid Kenyan mobile number, such as +254 712 345 678.');
    $('phone').focus();
  }
  function validServices(){
    return document.querySelectorAll('input[name="serviceCategories"]:checked').length>0 || products.length>0 || services.length>0;
  }
  function fileOkay(file) {
    if(!allowTypes.has(file.type)){showAlert('Use JPG, PNG or WebP images only.');return false}
    if(file.size > maxSize){showAlert('Each image must be 5 MB or smaller.');return false}
    return true;
  }
  function validNumber(value){return Number.isSafeInteger(Number(value))&&Number(value)>0&&Number(value)<=100000000;}
  function preview(file){return file?URL.createObjectURL(file):'';}
  function release(item){if(item?.url)URL.revokeObjectURL(item.url);}
  function productCard(p,index){
    const card=node('article','product-card');
    if(p.url){const img=node('img');img.src=p.url;img.alt=p.name;card.append(img)}
    else card.append(node('div','product-placeholder','▣'));
    const info=node('div','product-card-info');
    info.append(node('b','',p.name),node('span','cost',money(p.price)));
    if(p.description) info.append(node('p','',p.description));
    const controls=node('div','edit-actions');
    const edit=node('button','','✎ Edit');edit.type='button';edit.addEventListener('click',()=>openProduct(index));
    const del=node('button','','Remove');del.type='button';del.addEventListener('click',()=>{release(p);products.splice(index,1);renderProducts()});
    controls.append(edit,del); info.append(controls);card.append(info);return card;
  }
  function renderProducts(){
    const box=$('productGrid');box.replaceChildren();
    if(!products.length){
      const guide=node('div','sample-products');
      const note=node('p','muted','Your product listings will appear here. Examples below are illustrative only and are not submitted with your application.');
      const examples=node('div','sample-grid');
      for(const [photo,label] of [['assets/brand-social/product-photo.webp','Product photography'],['assets/brand-social/beauty-product.webp','Beauty & cosmetics'],['assets/brand-social/brand-food.webp','Food & catering']]){
        const f=node('figure');const img=node('img');img.src=photo;img.alt='Illustrative example of '+label;
        f.append(img,node('figcaption','',label+' · example'));examples.append(f);
      }
      guide.append(note,examples);box.append(guide);
    }
    products.forEach((p,i)=>box.append(productCard(p,i)));
    $('productCount').textContent=`${products.length} of 8 products added • 5 MB maximum per photo`;
    $('addProduct').disabled=products.length>=8;
  }
  function openProduct(index=-1){
    editingProduct=index;
    $('productForm').reset();
    $('productDialogTitle').textContent=index===-1?'ADD A PRODUCT':'EDIT PRODUCT';
    if(index>=0){
      $('productForm').elements.name.value=products[index].name;
      $('productForm').elements.price.value=products[index].price;
      $('productForm').elements.description.value=products[index].description;
    }
    $('productDialog').showModal();
  }
  function renderServices(){
    const wrap=$('customServiceList');wrap.replaceChildren();
    if(!services.length)wrap.append(node('div','empty-state','List any individual services with a description and starting price.'));
    services.forEach((s,i)=>{
      const row=node('div','service-line');const desc=node('div');desc.append(node('h3','',s.name),node('p','',s.description));
      const cost=node('span','price','From '+money(s.price));
      const acts=node('div','edit-actions');
      const edit=node('button','','✎');edit.type='button';edit.title='Edit service';edit.addEventListener('click',()=>openService(i));
      const del=node('button','','×');del.type='button';del.title='Remove service';del.addEventListener('click',()=>{services.splice(i,1);renderServices()});
      acts.append(edit,del);row.append(desc,cost,acts);wrap.append(row);
    });
    $('addService').disabled=services.length>=8;
  }
  function openService(index=-1){
    editingService=index;$('serviceForm').reset();
    $('serviceDialogTitle').textContent=index===-1?'ADD A SERVICE':'EDIT SERVICE';
    if(index>=0){const s=services[index];$('serviceForm').elements.name.value=s.name;$('serviceForm').elements.description.value=s.description;$('serviceForm').elements.price.value=s.price}
    $('serviceDialog').showModal();
  }
  function renderGallery(){
    const box=$('galleryGrid');box.replaceChildren();
    gallery.forEach((g,i)=>{
      const tile=node('div','gallery-tile');const img=node('img');img.src=g.url;img.alt='Selected business gallery photo '+(i+1);
      const remove=node('button','','×');remove.type='button';remove.setAttribute('aria-label','Remove image '+(i+1));remove.addEventListener('click',()=>{release(g);gallery.splice(i,1);renderGallery()});
      tile.append(img,remove);box.append(tile);
    });
    $('galleryInput').disabled=gallery.length>=6;
  }
  function summaryLine(dt,dd){const frag=document.createDocumentFragment();frag.append(node('dt','',dt),node('dd','',dd));return frag;}
  function renderReview(){
    const d=$('profileSummary');d.replaceChildren();
    const values=[['Business Name',$('business').value],['Full Name',$('owner').value],['Email Address',$('email').value],['Phone / WhatsApp',$('phone').value],['County / Town',$('county').value+' / '+$('town').value],['Business Type',$('businessType').value]];
    for(const [label,value] of values)d.append(summaryLine(label,value));
    const svc=$('servicesSummary');svc.replaceChildren();
    document.querySelectorAll('input[name="serviceCategories"]:checked').forEach(x=>svc.append(node('li','',x.value)));
    services.forEach(s=>svc.append(node('li','',s.name+' — from '+money(s.price))));
    if(!svc.children.length)svc.append(node('li','', 'No services selected'));
    const prod=$('productsSummary');prod.replaceChildren();
    products.forEach(p=>prod.append(node('li','',p.name+' — '+money(p.price))));
    if(!products.length)prod.append(node('li','', 'No products added'));
    $('descriptionSummary').textContent=$('description').value;
    $('businessSummaryName').textContent=$('business').value;
    $('summaryType').textContent=$('businessType').value;
    $('summaryLocation').textContent=$('town').value+', '+$('county').value;
    $('summaryContact').textContent=$('phone').value;
    const images=$('gallerySummary');images.replaceChildren();
    const all=[...gallery,...products.filter(p=>p.url)];
    all.slice(0,9).forEach((g,i)=>{
      const div=node('div','gallery-tile');const img=node('img');img.src=g.url;img.alt='Selected photo '+(i+1);div.append(img);images.append(div);
    });
  }
  async function submit(){
    if(submitted) return;
    if(!validProfile()){goTo(1,{skipValidation:true});profileError();return}
    if(!validServices()){goTo(2,{skipValidation:true});showAlert('Add at least one service category, product or service.');return}
    if(!$('confirmationAccuracy').checked||!$('confirmationContact').checked){showAlert('Please agree to both statements before submitting your application.');return}
    const btn=$('submitApplication'),status=$('submissionStatus');
    btn.disabled=true;btn.textContent='SENDING APPLICATION…';status.hidden=false;status.textContent='Submitting your application securely…';
    const data={business:$('business').value.trim(),owner:$('owner').value.trim(),email:$('email').value.trim(),phone:$('phone').value.trim(),county:$('county').value,town:$('town').value.trim(),businessType:$('businessType').value,description:$('description').value.trim(),categories:[...document.querySelectorAll('input[name="serviceCategories"]:checked')].map(x=>x.value),products:products.map(p=>({name:p.name,price:p.price,description:p.description})),services:services.map(s=>({...s})),consent:true};
    const hasMedia=gallery.length||products.some(p=>p.file);
    try{
      let init;
      if(hasMedia){
        const form=new FormData();form.append('payload',JSON.stringify(data));
        products.forEach((p,i)=>{if(p.file)form.append('product_file_'+i,p.file,p.file.name)});
        gallery.forEach((g,i)=>form.append('gallery_file_'+i,g.file,g.file.name));
        init={method:'POST',body:form};
      } else init={method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)};
      const res=await fetch('api/vendor-applications',init);
      const response=await res.json().catch(()=>({}));
      if(!res.ok||!response.ok) throw new Error(response.message||response.error||'The application could not be saved. Please check your connection and try again.');
      submitted=true;
      status.textContent='Application received for review. Reference: '+response.reference+'. We will contact you after review. Your profile is not public yet.';
      status.style.color='#d8f1c1';
      btn.textContent='APPLICATION SUBMITTED ✓';
    }catch(error){
      status.textContent='Not submitted: '+String(error.message||'Unable to reach the booking service.');
      status.style.color='#ffe0ae';btn.disabled=false;btn.innerHTML='TRY SUBMITTING AGAIN <span>→</span>';
    }
  }
  $('profileForm').addEventListener('submit',(e)=>e.preventDefault());
  $('toServices').addEventListener('click',()=>{if(!validProfile()){profileError();return}goTo(2)});
  $('toReview').addEventListener('click',()=>{
    if(!validProfile()){goTo(1,{skipValidation:true});profileError();return}
    if(!validServices()){showAlert('Select at least one category or add a service or product before reviewing.');return}
    goTo(3);
  });
  document.querySelectorAll('[data-step-target]').forEach(b=>b.addEventListener('click',()=>goTo(Number(b.dataset.stepTarget))));
  document.querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>goTo(Number(b.dataset.edit))));
  $('addProduct').addEventListener('click',()=>openProduct());
  $('addService').addEventListener('click',()=>openService());
  document.querySelectorAll('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.closeDialog).close()));
  $('productForm').addEventListener('submit',(e)=>{
    e.preventDefault();const f=e.currentTarget;
    if(!f.reportValidity())return;
    if(!validNumber(f.elements.price.value)){showAlert('Enter a valid product price.');return}
    const file=$('productPhoto').files[0]||null;if(file&&!fileOkay(file))return;
    const old=products[editingProduct];
    const item={name:f.elements.name.value.trim(),price:Number(f.elements.price.value),description:f.elements.description.value.trim(),file:file||(old?.file||null),url:file?preview(file):(old?.url||'')};
    if(file&&old)release(old);
    if(editingProduct>=0) products[editingProduct]=item;else if(products.length<8)products.push(item);
    $('productDialog').close();renderProducts();
  });
  $('serviceForm').addEventListener('submit',(e)=>{
    e.preventDefault();const f=e.currentTarget;if(!f.reportValidity())return;
    if(!validNumber(f.elements.price.value)){showAlert('Enter a valid service price.');return}
    const item={name:f.elements.name.value.trim(),price:Number(f.elements.price.value),description:f.elements.description.value.trim()};
    if(editingService>=0)services[editingService]=item;else if(services.length<8)services.push(item);
    $('serviceDialog').close();renderServices();
  });
  $('galleryInput').addEventListener('change',(e)=>{
    const files=Array.from(e.target.files||[]);
    for(const file of files){if(gallery.length>=6){showAlert('You can upload up to 6 business gallery images.');break}if(fileOkay(file))gallery.push({file,url:preview(file)})}
    e.target.value='';renderGallery();
  });
  $('submitApplication').addEventListener('click',submit);
  $('menuToggle').addEventListener('click',()=>{const opened=$('siteNav').classList.toggle('open');$('menuToggle').setAttribute('aria-expanded',String(opened))});
  renderProducts();renderServices();renderGallery();
  const start=location.hash==='#services'?2:location.hash==='#review'?3:1;
  goTo(start,{skipValidation:true});
})();
