(()=>{'use strict';
const $=id=>document.getElementById(id);
const state={mode:'home',step:0,answers:{},style:'quiet',brand:'',headline:'',feedback:[],notes:[],selected:'',busy:false};
const q=[
{key:'industry',title:'先告訴我：你提供哪一類服務？',hint:'這決定範例內容與專業度，不需要懂網站技術。',options:[['design','設計／創意工作室','室內設計、攝影、品牌或作品展示'],['business','B2B／顧問服務','企業服務、專業顧問、接案公司'],['wellness','教練／生活服務','個人品牌、課程、諮詢與預約'],['tech','科技／軟體服務','軟體、資訊技術與新創服務']]},
{key:'goal',title:'訪客來到網站後，你最想讓他做什麼？',hint:'我們會用你的答案規劃首頁順序與主要按鈕。',options:[['inquiry','傳送合作詢問','引導訪客介紹需求並聯絡你'],['booking','預約諮詢時間','降低來回約時間的麻煩'],['work','先看真實作品','用有根據的案例建立信任'],['explain','快速了解服務內容','清楚呈現流程、方案與特色']]},
{key:'trust',title:'你覺得客戶在下決定前最擔心什麼？',hint:'網頁的內容，應該先替潛在客戶回答疑慮。',options:[['trust','怕遇到不專業的店家','需要可驗證的經歷與案例'],['price','擔心價格不透明','需要說清楚範圍與額外費用'],['fit','不知道是不是適合自己','需要條件比較與服務邊界'],['time','怕時程失控','需要流程、節點與回覆規則']]},
{key:'feature',title:'第一版網站，哪項功能最不能缺少？',hint:'先做對一件事，別一開始就把維護成本堆高。',options:[['form','能安全收到聯絡表單','通知、驗證、個資告知、防垃圾訊息'],['book','客戶能自行預約','時區、日曆衝突、取消與提醒'],['cms','自己能更新文字和圖片','內容後台、權限與變更記錄'],['portfolio','有分類的作品展示','真實案例、授權圖片與詳情頁']]},
{key:'assets',title:'現在有多少品牌內容可以使用？',hint:'素材完整度會影響報價、排程與工作分工。',options:[['ready','Logo、文案與照片都有','可以先進入設計與工程'],['some','只有一部分內容','需要整理缺漏與責任人'],['none','幾乎還沒有素材','應先規劃品牌訪談與文案'],['unsure','我不確定需要準備什麼','先由服務方給你素材清單']]}
];
const styleCatalog={quiet:{title:'寧靜留白',desc:'高質感、影像與大幅留白',short:'留白與光影',headline:'給生活留一點空白。'},bold:{title:'未來鋒芒',desc:'強對比、前衛、科技感',short:'大膽、鮮明。',headline:'讓想法走在未來之前。'},warm:{title:'溫暖日常',desc:'親切、柔和、帶有人味',short:'讓相遇更有溫度。',headline:'每一次相遇，都從理解開始。'},clear:{title:'清晰專業',desc:'架構明確、資訊效率優先',short:'清楚、可靠。',headline:'把複雜變得簡單。'}};
const industryLabels={design:'設計／創意工作室',business:'企業／顧問服務',wellness:'教練／生活服務',tech:'科技／軟體服務'};
const labelFor=(key,value)=>q.find(item=>item.key===key)?.options.find(item=>item[0]===value)?.[1]||'尚未選擇';
const msgs=$('messages'),suggestions=$('suggestions'),mascot=$('mascot');
let panel=null,context=null,topLayer=20;
const floatingPanels=Object.fromEntries([...document.querySelectorAll('.hud-panel')].map(e=>[e.dataset.mode,e]));
function mood(type){mascot.dataset.mood=type;clearTimeout(mood.timeout);mood.timeout=setTimeout(()=>mascot.dataset.mood='idle',1100)}
function addMessage(who,text){const wrap=document.createElement('div');wrap.className='msg '+who;
 if(who==='assistant'){const ava=document.createElement('div');ava.className='avatar';ava.textContent='◈';ava.setAttribute('aria-hidden','true');wrap.append(ava)}
 const bubble=document.createElement('div');bubble.className='bubble';bubble.textContent=text;wrap.append(bubble);msgs.append(wrap);msgs.scrollTop=msgs.scrollHeight;mood(who==='assistant'?'speaking':'thinking');return wrap}
function quick(items){suggestions.replaceChildren();items.forEach(({text,fn})=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',fn);suggestions.append(b)})}
function setMode(mode){state.mode=mode;const labels={home:'就緒 · 對話式建站探索',wizard:'正在釐清你的網站需求',styles:'選擇喜歡的網站視覺',review:'整理精準修改意見',brief:'專案需求摘要已準備'};$('modeLabel').textContent=labels[mode]||labels.home}
function closePanel(){Object.values(floatingPanels).forEach(e=>{e.classList.add('hidden');e.querySelector('.hud-content').replaceChildren()});panel=null;context=null}
function openPanel(title,windowMode=state.mode){
 panel=floatingPanels[windowMode]||floatingPanels.wizard;
 context=panel.querySelector('.hud-content');
 panel.querySelector('.hud-title').textContent=title;
 context.replaceChildren();
 panel.classList.remove('hidden');
 const wrapper=panel.closest('.float-position');wrapper.style.zIndex=String(++topLayer);
 if(matchMedia('(max-width: 800px)').matches)setTimeout(()=>panel.scrollIntoView({behavior:'smooth',block:'nearest'}),50);
}
document.querySelectorAll('.hud-close').forEach(btn=>btn.addEventListener('click',()=>{
 const p=btn.closest('.hud-panel');p.classList.add('hidden');
 if(p===panel){panel=null;context=null}
}));
document.querySelectorAll('.hud-panel').forEach(p=>{
 p.addEventListener('pointerdown',()=>{p.closest('.float-position').style.zIndex=String(++topLayer)}, {passive:true});
});
/* Rearrange HUD windows by dragging headers on desktop; panels can overlap or sit side by side. */
document.querySelectorAll('.hud-window-head').forEach(header=>{
 header.style.cursor='grab';let drag=null;
 header.addEventListener('pointerdown',event=>{
   if(event.target.closest('button')||matchMedia('(max-width: 800px)').matches)return;
   const wrapper=header.closest('.float-position');
   drag={x:event.clientX,y:event.clientY,dx:Number(wrapper.dataset.dx||0),dy:Number(wrapper.dataset.dy||0)};
   wrapper.style.zIndex=String(++topLayer);
   header.setPointerCapture(event.pointerId);
   header.style.cursor='grabbing';
 });
 header.addEventListener('pointermove',event=>{
   if(!drag)return;
   const wrapper=header.closest('.float-position');
   const dx=drag.dx+event.clientX-drag.x,dy=drag.dy+event.clientY-drag.y;
   wrapper.dataset.dx=String(dx);wrapper.dataset.dy=String(dy);
   wrapper.style.transform='translate('+dx+'px,'+dy+'px)';
 });
 function stopDrag(){drag=null;header.style.cursor='grab'}
 header.addEventListener('pointerup',stopDrag);header.addEventListener('pointercancel',stopDrag);
});
function el(tag,css,text){const e=document.createElement(tag);if(css)e.className=css;if(text!==undefined)e.textContent=text;return e}
function action(text,fn,primary=false){const b=el('button','panel-btn'+(primary?' primary':''),text);b.type='button';b.addEventListener('click',fn);return b}
function choices(items,selected,onClick){const grid=el('div','choice-grid');items.forEach(([value,title,sub])=>{const b=el('button','choice');b.type='button';b.setAttribute('aria-pressed',String(selected===value));b.append(el('strong','',title),el('small','',sub));b.addEventListener('click',()=>onClick(value));grid.append(b)});return grid}
function homeQuick(){quick([{text:'◈ 幫我規劃網站',fn:()=>beginWizard()},{text:'◇ 看網站風格',fn:()=>beginStyles()},{text:'✧ 整理修改意見',fn:()=>beginReview()},{text:'⌁ 查看需求書',fn:()=>beginBrief()}])}
function beginWizard(withMessage=true){setMode('wizard');if(withMessage)addMessage('assistant','沒問題。我不會先問你「要用什麼技術」。我們用五個商業問題，找到真正適合你的網站。\n你可以直接點選答案，隨時返回修改。');renderWizard()}
function renderWizard(){const item=q[state.step];if(!item){beginStyles(false);return}setMode('wizard');openPanel('需求探索 · '+(state.step+1)+' / '+q.length,'wizard');
 context.append(el('p','context-caption',item.title+'\n'+item.hint));
 const current=state.answers[item.key]||'';const grid=choices(item.options,current,value=>{state.answers[item.key]=value;renderWizard()});context.append(grid);
 const footer=el('div','panel-actions');const back=action('← 上一題',()=>{state.step=Math.max(0,state.step-1);renderWizard()});back.disabled=state.step===0;footer.append(back,action(state.step===q.length-1?'接著選擇網站風格 →':'下一題 →',()=>{
 if(!state.answers[item.key]){addMessage('assistant','這題請先選擇一項。如果還不確定，也可以先告訴我你的猶豫，我會用更白話的方式解釋。');return}
 if(state.step<q.length-1){state.step++;addMessage('assistant','了解：'+labelFor(item.key,state.answers[item.key])+'。接著我們確認下一個關鍵問題。');renderWizard()}
 else {addMessage('assistant','你的商業需求有輪廓了。現在我會拿出幾種差異很大的網站範例，你直接選喜歡的就好。');beginStyles(false)}
 },true));context.append(footer);quick([{text:'看看風格範例',fn:()=>beginStyles()},{text:'先看我的需求摘要',fn:()=>beginBrief()}])}
function beginStyles(withMessage=true){setMode('styles');if(withMessage)addMessage('assistant','我準備了四種不同的設計語言。你不需要說「CSS 要怎樣」，只要選出讓你覺得適合的那一種。選完也可以改品牌名稱和首頁標題。');renderStyles()}
function renderStyles(){openPanel('視覺樣本 · STYLE SELECTOR','styles');context.append(el('p','context-caption','點選你最有感覺的風格。下面會立刻顯示對應的首頁樣本。'));
 const grid=el('div','style-grid');Object.entries(styleCatalog).forEach(([id,s])=>{const b=el('button','style');b.type='button';b.setAttribute('aria-pressed',String(state.style===id));const demo=el('div','style-demo '+id);demo.append(el('span','',id.toUpperCase()+' / VISUAL LANGUAGE'),el('strong','',s.short));b.append(demo,el('strong','',s.title),el('small','',s.desc));b.onclick=()=>{state.style=id;if(!state.headline)state.headline=s.headline;renderStyles()};grid.append(b)});context.append(grid);
 const style=styleCatalog[state.style];const preview=el('div','preview');preview.dataset.style=state.style;const navbar=el('div','preview-nav');navbar.append(el('strong','',state.brand||'你的品牌'),el('span','','關於｜服務｜聯絡'));const banner=el('div','preview-banner');banner.append(el('small','','YOUR BRAND / '+style.title),el('b','',state.headline||style.headline));preview.append(navbar,banner);context.append(preview);
 const controls=el('div','preview-actions');const brand=el('input');brand.maxLength=40;brand.placeholder='你的品牌名稱';brand.value=state.brand;brand.setAttribute('aria-label','品牌名稱');brand.addEventListener('input',()=>{state.brand=brand.value;navbar.querySelector('strong').textContent=brand.value||'你的品牌'});const title=el('input');title.maxLength=72;title.placeholder='你想放的首頁主標題';title.value=state.headline;title.setAttribute('aria-label','首頁主標題');title.addEventListener('input',()=>{state.headline=title.value;banner.querySelector('b').textContent=title.value||style.headline});controls.append(brand,title);context.append(controls);
 const footer=el('div','panel-actions');footer.append(action('我要再改需求',()=>renderWizard()),action('選這個風格，繼續 →',()=>{addMessage('assistant','收到，你偏好「'+style.title+'」。接下來我會把喜歡和不喜歡的地方整理成清楚的修改指示。');beginReview(false)},true));context.append(footer);
 quick([{text:'換另一種樣本',fn:()=>renderStyles()},{text:'檢視需求摘要',fn:()=>beginBrief()}]);mood('happy')}
function beginReview(withMessage=true){setMode('review');if(withMessage)addMessage('assistant','說「不夠高級」或「感覺怪怪的」也沒關係。這個工具把你的直覺轉成清楚、可執行的修改意見；正式合作時再由真人確認範圍和結果。');renderReview()}
function renderReview(){openPanel('修改需求 · DESIGN REVIEW','review');context.append(el('p','context-caption','選擇要改的地方、期望效果與優先度。可新增多條，並一起放進需求書。'));
 const form=el('form','review-form');const fields=[
 ['part','要修改哪個部分？',[['首頁主標題','首頁主標題'],['色彩與字體','色彩與字體'],['圖片與氛圍','圖片與氛圍'],['內容順序','內容順序'],['詢問按鈕','詢問按鈕']]],
 ['direction','希望變得如何？',[['更專業、更可信','更專業、更可信'],['更溫暖、更親切','更溫暖、更親切'],['更簡潔、更清楚','更簡潔、更清楚'],['更鮮明、更大膽','更鮮明、更大膽'],['更容易讓客戶行動','更容易讓客戶行動']]],
 ['priority','重要程度',[['必須修改','必須修改'],['希望改善','希望改善'],['未來版本再做','未來版本再做']]]];
 fields.forEach(([id,title,items])=>{const cell=el('div');const label=el('label','',title);label.htmlFor='review-'+id;const select=el('select');select.id='review-'+id;items.forEach(([value,text])=>{const o=el('option','',text);o.value=value;select.append(o)});cell.append(label,select);form.append(cell)});
 const noteWrap=el('div','span-2');const noteLabel=el('label','','其他補充（選填）');noteLabel.htmlFor='review-note';const note=el('input');note.id='review-note';note.maxLength=350;note.placeholder='例如：希望標題看起來更有記憶點';noteWrap.append(noteLabel,note);form.append(noteWrap);
 const add=el('button','panel-btn primary span-2','＋ 加入修改清單');add.type='submit';form.append(add);
 form.addEventListener('submit',e=>{e.preventDefault();const f={part:form.querySelector('#review-part').value,direction:form.querySelector('#review-direction').value,priority:form.querySelector('#review-priority').value,note:note.value.trim()};state.feedback.push(f);addMessage('assistant','這個修改需求記下來了：「'+f.part+'」要「'+f.direction+'」，優先度是「'+f.priority+'」。你可以再加幾項，或直接整理需求書。');renderReview()});context.append(form);
 const list=el('div','review-list');if(!state.feedback.length)list.append(el('p','context-caption','目前沒有修改意見。先新增一條即可。'));state.feedback.forEach((f,i)=>{const card=el('div','review-item');card.append(el('strong','',String(i+1).padStart(2,'0')+' · '+f.part+' → '+f.direction),el('small','',f.priority+(f.note?' · '+f.note:'')));const remove=el('button','','移除');remove.type='button';remove.onclick=()=>{state.feedback.splice(i,1);renderReview()};card.append(remove);list.append(card)});list.style.marginTop='15px';context.append(list);
 const bottom=el('div','panel-actions');bottom.append(action('← 回風格選擇',()=>beginStyles(false)),action('整理完整需求書 →',()=>beginBrief(),true));context.append(bottom);quick([{text:'返回風格',fn:()=>beginStyles(false)},{text:'生成需求書',fn:()=>beginBrief()}])}
function buildBrief(){const lines=['有譜智能體｜網站專案需求書（概念展示）','生成日期：'+new Date().toLocaleDateString('zh-TW'),'','【商業目標與基本資訊】',...q.map(item=>item.title+'\n'+labelFor(item.key,state.answers[item.key])),'','【設計偏好】','風格：'+styleCatalog[state.style].title,'品牌：'+(state.brand||'待確認'),'首頁標題：'+(state.headline||styleCatalog[state.style].headline),'','【客戶修改意見】',...(state.feedback.length?state.feedback.map((x,i)=>String(i+1)+'. '+x.part+'｜'+x.direction+'｜'+x.priority+'｜'+(x.note||'無補充')):['尚未新增']),'','【其他背景資訊】',...(state.notes.length?state.notes:['無']),'','【正式接案前需人工確認】','1. 真實品牌、作品與圖片使用權','2. 頁面、功能、流程與驗收範圍','3. 技術選型、權限、主機及網域歸屬','4. 個資蒐集告知、保存期限、刪除流程','5. HTTPS、表單防垃圾訊息與安全測試','6. 手機版、效能、無障礙和 SEO 檢查','7. 修改次數、回覆時效、上線與維護責任','','【重要說明】','此文件由規則式展示介面於本機建立，尚無 AI 模型、人工服務人員或正式收件流程。'];return lines.join('\n')}
function download(){const blob=new Blob([String.fromCharCode(65279)+buildBrief()],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='有譜-網站需求書.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);addMessage('assistant','需求書已下載到你的裝置。你在這裡的輸入沒有上傳，也沒有傳送給真人。正式接案還需要另外建立安全的收件與人工審核流程。');mood('happy')}
function beginBrief(){setMode('brief');addMessage('assistant','這是我們目前整理的網站方向。我會把已確認的選擇、修改意見與需要真人釐清的責任項目放在同一份文件，避免你之後重新解釋一次。');openPanel('交付摘要 · PROJECT BRIEF','brief');context.append(el('p','context-caption','這份摘要可直接下載；未填的答案會標示為「尚未選擇」，不會自行編造需求。'));const preview=el('div','brief-preview');preview.textContent=buildBrief();context.append(preview);const actions=el('div','panel-actions');actions.append(action('← 繼續修改',()=>beginReview(false)),action('下載需求書 ↓',download,true));context.append(actions);quick([{text:'下載需求書',fn:download},{text:'繼續調整風格',fn:()=>beginStyles()},{text:'新增修改意見',fn:()=>beginReview()}])}
function help(){addMessage('assistant','我目前能做四件事：\n① 透過精確問題整理你的建站需求\n② 給你四種可切換的視覺樣本\n③ 把「這裡怪怪的」變成修改清單\n④ 下載完整的專案需求書\n\n本版採規則式引導，還沒有接上即時大型語言模型，因此我不會假裝能理解所有自由輸入。');homeQuick();closePanel()}
function parseText(value){const msg=value.trim();if(!msg)return;addMessage('user',msg);$('userText').value='';const s=msg.toLowerCase();
 if(/重來|重新開始|reset/.test(s)){reset();return}
 if(/你好|哈囉|hello|嗨|hi\b/.test(s)){addMessage('assistant','你好！我可以幫你從一個大概想法，逐步整理到可執行的網站需求。你想先回答幾個問題，還是先看幾種風格？');homeQuick();return}
 if(/風格|範例|樣板|版型|配色|預覽|設計/.test(s)){beginStyles();return}
 if(/修改|回饋|調整|改動|不好看/.test(s)){beginReview();return}
 if(/需求書|摘要|下載|交付|文件/.test(s)){beginBrief();return}
 if(/價格|報價|費用|多少錢/.test(s)){addMessage('assistant','目前這是互動概念版，還沒有正式接案或付款。之前測試過單頁網站 NT$19,800 起、五頁網站 NT$39,800 起的價格假設，但不是已確認的正式報價。我可以先幫你整理需要哪些功能，這樣報價才有依據。');quick([{text:'開始整理需求',fn:()=>beginWizard()},{text:'先看風格樣本',fn:()=>beginStyles()}]);return}
 if(/真人|客服|人工|聯絡|顧問/.test(s)){addMessage('assistant','正式服務會把真人審核、回覆時間、修改輪次與資安責任寫清楚。不過這個 Demo 尚未連接真人客服或建立商業收件管道，我不能冒充有人正在接洽。你可以先完成需求書，之後作為實際合作的起點。');homeQuick();return}
 if(/網站|官網|工作室|電商|landing|品牌|公司|創業/.test(s)){state.notes.push(msg);addMessage('assistant','我先記下你的背景：「'+msg.slice(0,80)+(msg.length>80?'…':'')+'」。為了避免猜錯，我會再問幾個真正影響網站效果的問題。');state.step=0;beginWizard(false);return}
 state.notes.push(msg);addMessage('assistant','我已把這段話保留在你的需求摘要，但目前還不能可靠判斷你的意思。你可以選一個方向，我再一步步幫你釐清：');homeQuick()}
function reset(){state.mode='home';state.step=0;state.answers={};state.style='quiet';state.brand='';state.headline='';state.feedback=[];state.notes=[];state.selected='';msgs.replaceChildren();closePanel();document.querySelectorAll('.float-position').forEach(w=>{w.style.transform='';w.style.zIndex='';delete w.dataset.dx;delete w.dataset.dy});topLayer=20;setMode('home');intro()}
function intro(){addMessage('assistant','你好，我是有譜 ◈\n\n想做網站，不需要先研究 AI 指令、設計術語或資訊安全。我會先理解你的目標，再在適當的時候顯示風格樣本、選項和修改工具。\n\n你想從哪裡開始？');homeQuick()}
$('resetBtn').addEventListener('click',reset);
$('composer').addEventListener('submit',e=>{e.preventDefault();parseText($('userText').value)});
$('userText').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();parseText($('userText').value)}});
intro();
})();