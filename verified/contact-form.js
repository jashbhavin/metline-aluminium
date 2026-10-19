// Contact page form. Sends to /api/enquiry; while email delivery is not configured (503), on the static
// preview (404) or on any network error it opens the visitor's email app with the enquiry addressed to
// sales instead. It only says "sent" when the server confirms delivery.
(()=>{const form=document.getElementById('m-2637b');if(!form)return;
const status=document.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.className='m-81bd4';form.querySelector('.m-d34c0')?.appendChild(status);
const button=form.querySelector('[type=submit]');
const push=(event,extra)=>{if(window.dataLayer)window.dataLayer.push({event,form:'contact',...extra})};
form.addEventListener('submit',async e=>{e.preventDefault();if(button?.disabled)return;
const v=id=>(form.elements[id]?.value||'').trim();
const data={product:v('proname'),name:v('name'),phone:v('tel'),email:v('email'),message:v('content'),company_website:v('company_website'),page:location.href};
const mailto=()=>{const body=['Product: '+data.product,'Name: '+data.name,'Phone / WhatsApp: '+data.phone,'Email: '+data.email,'','Requirements:',data.message,'','Sent from '+location.href].join('\n');
 location.href='mailto:sales@metline.in?subject='+encodeURIComponent('Enquiry: '+(data.product||'aluminium'))+'&body='+encodeURIComponent(body);
 status.textContent='Online sending is not available yet, so your email app should now open with this enquiry addressed to sales@metline.in. Please press send there. If it does not open, email us directly or call +91 9967731666.';
 push('enquiry_email_opened',{product:data.product})};
if(button){button.disabled=true;button.dataset.label=button.value;button.value='Sending…'}status.textContent='';
try{const r=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
 const out=await r.json().catch(()=>({}));
 if(r.ok&&out.sent){status.textContent='Thank you — your enquiry has been sent to our sales team. We will reply by email.';form.reset();push('generate_lead',{product:data.product})}
 else if(r.status===400&&out.errors){status.textContent=out.errors.join(' ')}
 else mailto()}
catch{mailto()}
finally{if(button){button.disabled=false;button.value=button.dataset.label||'Submit'}}})})();
