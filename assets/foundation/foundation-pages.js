(()=>{
 const $=(s)=>document.querySelector(s), $$=(s)=>[...document.querySelectorAll(s)];
 const menu=$('#menuToggle');if(menu)menu.addEventListener('click',()=>{const nav=$('#siteNav');const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
 $$('#siteNav a').forEach(a=>a.addEventListener('click',()=>{$('#siteNav')?.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));
 // Project categories: only display projects that actually match the chosen theme.
 const filters=$$('[data-filter]'),cards=$$('.project[data-categories]');
 filters.forEach(btn=>btn.addEventListener('click',()=>{const f=btn.dataset.filter;filters.forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn))});let count=0;cards.forEach(card=>{const show=f==='all'||card.dataset.categories.split(' ').includes(f);card.hidden=!show;if(show)count++});const empty=$('#noProjects');if(empty)empty.hidden=count>0;document.getElementById('projectList')?.scrollIntoView({behavior:'smooth',block:'start'});}));
 const dlg=$('#projectDialog');$$('[data-project]').forEach(btn=>btn.addEventListener('click',()=>{if(!dlg)return;const card=btn.closest('.project');$('#dialogImage').src=card.querySelector('img').currentSrc||card.querySelector('img').src;$('#dialogTitle').textContent=card.querySelector('h3').textContent;$('#dialogDescription').textContent=card.dataset.details;$('#dialogStatus').textContent='PROPOSED INITIATIVE · DATES TO BE CONFIRMED';dlg.showModal()}));
 $('#closeDialog')?.addEventListener('click',()=>dlg?.close());dlg?.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
 // Payment intent is a request for verified payment instructions, not a payment processor.
 const amountButtons=$$('[data-amount]'),custom=$('#customAmount'),amountInput=$('#amountInput'),methodButtons=$$('[data-method]');let amount=500,method='mpesa';
 amountButtons.forEach(btn=>btn.addEventListener('click',()=>{amountButtons.forEach(b=>{b.classList.toggle('selected',b===btn);b.setAttribute('aria-pressed',String(b===btn))});if(btn.dataset.amount==='custom'){amount=null;custom?.classList.add('active');amountInput?.focus()}else{amount=Number(btn.dataset.amount);custom?.classList.remove('active')}}));
 methodButtons.forEach(btn=>btn.addEventListener('click',()=>{method=btn.dataset.method;methodButtons.forEach(b=>{b.classList.toggle('selected',b===btn);b.setAttribute('aria-selected',String(b===btn))});$$('.method-panel').forEach(p=>p.classList.toggle('active',p.dataset.methodPanel===method));}));
 const notice=$('#paymentNotice');function feedback(message){if(notice){notice.textContent=message;notice.classList.add('show')}}
 $('#contributionForm')?.addEventListener('submit',e=>{e.preventDefault();const value=amount===null?Number(amountInput?.value):amount;const name=$('#donorName')?.value.trim()||'',email=$('#donorEmail')?.value.trim()||'',phone=$('#donorPhone')?.value.trim()||'';
 if(!Number.isFinite(value)||value<50||value>1000000){feedback('Enter a contribution between KSh 50 and KSh 1,000,000.');return}
 if(!name||!email||!/^\S+@\S+\.\S+$/.test(email)){feedback('Please enter your name and a valid email address.');return}
 if(method==='mpesa'&&!/^(?:\+254|254|0)[17]\d{8}$/.test(phone.replace(/[\s-]/g,''))){feedback('Enter a valid Kenyan M-Pesa number.');return}
 const lines=['Hello HIT KENYA Foundation, I would like verified contribution instructions.','Amount: KSh '+value.toLocaleString('en-KE'),'Preferred method: '+({'mpesa':'M-Pesa','bank':'Bank transfer','card':'Card'}[method]),'Name: '+name,'Email: '+email];
 // Do not send a phone number to an unverified payment backend. The user can share it with the official team if necessary.
 const url='https://wa.me/254797068736?text='+encodeURIComponent(lines.join('\n'));
 feedback('Your request is ready. WhatsApp will open with the details. Press Send to request verified payment instructions. No payment has been made.');
 const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Open WhatsApp to send your request';a.style.cssText='display:block;color:#ffd045;font-weight:900;margin-top:6px';notice.appendChild(a);
 window.open(url,'_blank','noopener,noreferrer');
 });
})();
