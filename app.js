(() => {
'use strict';
const byId = id => document.getElementById(id);
const cases = window.SPACE_CASES || {};
const projectList = [cases.taichung,cases.taipei,cases.tainan].filter(Boolean);
const gallery = byId('gallery');
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function card(item){
 const btn=document.createElement('button');btn.type='button';btn.className='card reveal';
 btn.dataset.category=item.type;btn.dataset.case=item.slug;
 btn.setAttribute('aria-label', '閱讀'+item.title+'的案例研究');
 btn.innerHTML='<div class="card-image"><img src="'+esc(item.image)+'" loading="lazy" decoding="async" width="800" height="620" alt="'+esc(item.alt)+'"><span class="card-index">'+esc(item.index)+' / STUDY</span></div>'+
 '<div class="card-meta"><div><h3>'+esc(item.title)+'</h3><p>'+esc(item.english)+' · '+esc(item.year)+'</p></div><span class="icon-arrow" aria-hidden="true">↗</span></div>'+
 '<p class="card-summary">'+esc(item.overview)+'</p>';
 btn.addEventListener('click',()=>showCase(item));
 return btn;
}
projectList.forEach(item=>gallery.appendChild(card(item)));
const dialog=byId('caseDialog');let returnFocus=null;
function showCase(item){
 returnFocus=document.activeElement;
 byId('modalImage').src=item.image;byId('modalImage').alt=item.alt;
 byId('modalType').textContent=[item.english,item.location,item.year].join(' / ');
 byId('modalTitle').textContent=item.title;
 byId('modalLead').textContent=item.overview;
 byId('modalIntro').textContent=item.intro;
 byId('modalFacts').replaceChildren(...item.facts.map(([k,v])=>{const div=document.createElement('div');const s=document.createElement('small');s.textContent=k;const strong=document.createElement('strong');strong.textContent=v;div.append(s,strong);return div}));
 byId('modalSections').replaceChildren(...item.sections.map(([heading,copy])=>{const div=document.createElement('section');div.className='article';const h=document.createElement('h3');h.textContent=heading;const p=document.createElement('p');p.textContent=copy;div.append(h,p);return div}));
 const source=byId('modalSources');source.replaceChildren();
 const t=document.createElement('strong');t.textContent='資料出處與影像授權';source.append(t);
 for(const [label,url] of item.sources){const a=document.createElement('a');a.textContent=label+' ↗';a.href=url;a.target='_blank';a.rel='noopener noreferrer';source.append(a)}
 const credit=document.createElement('p');credit.className='photo-credit';credit.append('影像：'+item.credit+'｜'+item.license+'｜');
 const imageLink=document.createElement('a');imageLink.href=item.imagePage;imageLink.target='_blank';imageLink.rel='noopener noreferrer';imageLink.textContent='原始圖片／授權說明 ↗';credit.append(imageLink);source.append(credit);
 dialog.showModal();dialog.scrollTop=0;byId('closeDialog').focus();
 if(history.replaceState){history.replaceState(null,'','#case-'+item.slug)}
}
function hideCase(){dialog.close();if(returnFocus && returnFocus.isConnected) returnFocus.focus({preventScroll:true});if(location.hash.startsWith('#case-'))history.replaceState(null,'','#stories')}
byId('closeDialog').addEventListener('click',hideCase);byId('closeBottom').addEventListener('click',hideCase);
dialog.addEventListener('click',e=>{if(e.target===dialog)hideCase()});
dialog.addEventListener('close',()=>{if(returnFocus && returnFocus.isConnected)returnFocus.focus({preventScroll:true})});
const heroLink=byId('heroLink');heroLink.addEventListener('click',e=>{e.preventDefault();showCase(cases.tainan)});
document.querySelectorAll('.filter').forEach(button=>{
 button.addEventListener('click',()=>{
 const value=button.dataset.category;
 document.querySelectorAll('.filter').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 let visible=0;gallery.querySelectorAll('.card').forEach(card=>{const show=value==='all'||card.dataset.category===value;card.hidden=!show;card.style.display=show?'':'none';if(show)visible++});
 gallery.setAttribute('aria-label','顯示'+visible+'篇案例研究');
 });
});
const toggle=byId('menuToggle'),links=byId('navlinks');
toggle.addEventListener('click',()=>{
 const open=links.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'×':'☰';toggle.setAttribute('aria-label',open?'關閉導覽選單':'開啟導覽選單');
});
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰';toggle.setAttribute('aria-label','開啟導覽選單')}));
const inputIds=['business','pages','goal','features','budget','brand','requirements'];
function val(id){return byId(id).value.trim()}
function updateBrief(){
 byId('briefPreview').textContent=val('business')+' / '+val('pages');
 byId('briefGoal').textContent='目標：'+val('goal')+'　·　優先功能：'+val('features');
}
inputIds.forEach(id=>byId(id).addEventListener(id==='brand'||id==='requirements'?'input':'change',updateBrief));updateBrief();
byId('planner').addEventListener('submit',e=>{
 e.preventDefault();if(!byId('planner').reportValidity())return;
 const lines=['序間 SPACE NOTES｜網站專案需求摘要','產出日期：'+new Date().toLocaleDateString('zh-TW'),'','【基本資訊】','品牌：'+(val('brand')||'尚未提供'),'事業類型：'+val('business'),'網站規模：'+val('pages'),'商業目標：'+val('goal'),'首要功能：'+val('features'),'初期預算：'+val('budget'),'','【補充需求】',val('requirements')||'尚未提供','','【正式合作前建議確認】','1. 品牌素材與圖像使用授權','2. 網站頁面與文案責任分工','3. 表單通知、個資蒐集與保護措施','4. 無障礙、SEO 與效能驗收標準','5. 網域、主機與原始碼歸屬','6. 交付、修改、保固與長期維護範圍','','【資料隱私】','此文件僅在你的瀏覽器中生成，未上傳或寄送任何資料。','這是一份需求整理工具，不代表任何公司已接受委託。'];
 const blob=new Blob(['\ufeff'+lines.join('\r\n')],{type:'text/plain;charset=utf-8'});
 const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='網站需求摘要-space-notes.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 const toast=byId('toast');toast.textContent='需求摘要已下載。此頁沒有傳送任何資料。';toast.classList.remove('hidden');setTimeout(()=>toast.classList.add('hidden'),4500);
});
if('IntersectionObserver'in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
 const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}})},{threshold:.07});
 document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
}else document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-visible'));
let ticking=false;window.addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;byId('progress').style.width=(max?Math.max(0,scrollY/max)*100:0)+'%';ticking=false})},{passive:true});
const hash=location.hash.slice(6);if(location.hash.startsWith('#case-')&&cases[hash])setTimeout(()=>showCase(cases[hash]),50);
})();