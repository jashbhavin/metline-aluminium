(async()=>{
window.initializeIndustries?.();
const applyText=(el,text)=>{el.replaceChildren();String(text).split('\n').forEach((line,i)=>{if(i)el.append(document.createElement('br'));el.append(document.createTextNode(line))})};
const path=location.pathname.endsWith('/')?location.pathname:location.pathname+'/';
let data={page:{},brand:{}};try{const r=await fetch('/metline-aluminium/api/cms?path='+encodeURIComponent(path));if(r.ok)data=await r.json();}catch(e){console.warn('CMS unavailable',e)}
if(data.page.hidden){document.body.replaceChildren(Object.assign(document.createElement('h1'),{textContent:'Page unpublished'}));return}
for(const rule of data.shared||[]){document.querySelectorAll('.header [data-cms-id],.footer [data-cms-id],.foot [data-cms-id]').forEach(el=>{if(el.tagName===rule.tag&&el.textContent===rule.match){el.textContent=rule.value.text;if(rule.value.href!==undefined)el.setAttribute('href',rule.value.href)}})}
for(const [id,value]of Object.entries(data.page.elements||{})){for(const el of document.querySelectorAll('[data-cms-id="'+CSS.escape(id)+'"]')){if(['IMG','VIDEO'].includes(el.tagName)){if(value.src){if(el.tagName==='VIDEO')el.poster=value.src;else{el.src=value.src;el.closest('picture')?.querySelectorAll('source').forEach(source=>source.srcset=value.src)}el.dataset.cmsOverride='true'}if(el.tagName==='IMG')el.alt=value.alt||'';else el.setAttribute('aria-label',value.alt||'Hero image');}else{if(value.text!==undefined)applyText(el,value.text);if(value.href!==undefined)el.setAttribute('href',value.href);}}}
if(data.page.title)document.title=data.page.title;
if(data.page.description){let meta=document.querySelector('meta[name="description"]');if(!meta){meta=document.createElement('meta');meta.name='description';document.head.append(meta)}meta.content=data.page.description}
const brand=data.brand||{};if(brand.company){const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){if(!['SCRIPT','STYLE'].includes(node.parentElement.tagName))node.textContent=node.textContent.replace(/Your Company|Metline/g,brand.company)}}
if(brand.email)document.querySelectorAll('[data-cms-id]').forEach(el=>{if(el.childElementCount===0)el.textContent=el.textContent.replace(/sales@example.com/g,brand.email)});
if(brand.logo)document.querySelectorAll('.logo img,.m-85cc8 img').forEach(img=>{img.src=brand.logo;img.alt=brand.company||'Company logo';img.dataset.cmsOverride='true'});
if(brand.color){const style=document.createElement('style');style.textContent=`:root{--brand-color:${/^#[0-9a-f]{6}$/i.test(brand.color)?brand.color:'#0069b4'}}.blue_btn,.qk-contact,.m-47733 a:hover{background:var(--brand-color)!important}`;document.head.append(style)}
document.querySelectorAll('#m-12e3c,#m-4c1ae').forEach(form=>{form.action='/metline-aluminium/resources/search/';form.method='get';const input=form.querySelector('input[type=\"search\"],input[type=\"text\"],input:not([type])');if(input)input.name='q'});
document.querySelectorAll('input[placeholder*="Search"]').forEach(input=>input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();location.href='/metline-aluminium/resources/search/?q='+encodeURIComponent(input.value)}}));
if(window.parent!==window&&new URLSearchParams(parent.location.search).get('edit')==='1'){
const style=document.createElement('style');style.textContent='[data-cms-id]:hover{outline:2px solid #16a3ad;cursor:pointer}';document.head.append(style);
document.addEventListener('click',e=>{const el=e.target.closest('[data-cms-id]');if(el){e.preventDefault();e.stopPropagation();parent.postMessage({type:'cms-select',id:el.dataset.cmsId,tag:el.tagName,text:el.innerText,href:el.getAttribute('href'),src:el.tagName==='VIDEO'?el.getAttribute('poster'):el.getAttribute('src'),alt:el.getAttribute('alt')||el.getAttribute('aria-label'),width:el.dataset.width,height:el.dataset.height},location.origin)}},true);
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.data.type!=='cms-preview')return;const v=e.data.value;document.querySelectorAll('[data-cms-id="'+CSS.escape(e.data.id)+'"]').forEach(el=>{if(['IMG','VIDEO'].includes(el.tagName)){if(el.tagName==='VIDEO'){el.poster=v.src;el.setAttribute('aria-label',v.alt)}else{el.src=v.src;el.alt=v.alt;el.closest('picture')?.querySelectorAll('source').forEach(source=>source.srcset=v.src)}el.dataset.cmsOverride='true'}else{applyText(el,v.text);if(v.href!==undefined)el.setAttribute('href',v.href)}})});
}
window.initializeIndustries?.();
document.querySelectorAll('.m-d9181,.to-top').forEach(el=>el.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'})));
})();
