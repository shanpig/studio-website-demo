// Build gate for the holographic HUD. Not a substitute for browser / Lighthouse tests.
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('hud.css','utf8');
const js=fs.readFileSync('agent.js','utf8');
for(const file of ['index.html','agent.css','hud.css','agent.js','favicon.svg'])assert(fs.existsSync(file),'Missing: '+file);
new vm.Script(js,{filename:'agent.js'});
assert(html.includes('lang="zh-Hant"'));
assert(html.includes('name="viewport"'));
assert(html.includes('name="description"'));
assert(html.includes('rel="icon"'));
assert(html.includes('href="#conversation"'));
assert(html.includes('src="./agent.js"')&&html.includes('href="./hud.css"'));
assert(html.includes('id="mascot"'),'Central mascot is missing');
assert(html.includes('id="messages"'),'Chat log missing');
assert(html.includes('id="composer"'),'Chat form missing');
assert(html.includes('id="modeLabel"'),'Agent status missing');
for(const mode of ['wizard','styles','review','brief']){
 assert(html.includes('data-mode="'+mode+'"'),'Missing floating window: '+mode);
 assert(js.includes('floatingPanels'),'Dynamic HUD windows not connected');
}
assert(css.includes('prefers-reduced-motion'),'Reduced-motion fallback missing');
assert(css.includes('max-width:800px'),'Mobile layout missing');
assert(css.includes(':focus-visible')||fs.readFileSync('agent.css','utf8').includes(':focus-visible'),'Focus indication missing');
assert(js.includes('beginWizard')&&js.includes('beginStyles')&&js.includes('beginReview')&&js.includes('beginBrief'),'Guided flow incomplete');
assert(js.includes('URL.createObjectURL'),'Brief download missing');
assert(js.includes('state.feedback'),'Feedback tracking missing');
assert(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon/.test(js),'Interactive user inputs must remain local');
const ids=[...js.matchAll(/\$\('([^']+)'\)/g)].map(x=>x[1]);
const missing=[...new Set(ids)].filter(id=>!html.includes('id="'+id+'"'));
assert.deepEqual(missing,[],'Missing element IDs: '+missing.join(','));
console.log('PASS: syntax, central core, four floating windows, chat, mobile, accessibility, privacy, brief export');
