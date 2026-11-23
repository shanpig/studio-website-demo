// Studio acceptance smoke checks — not a substitute for browser/Lighthouse/security review.
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8'),css=fs.readFileSync('studio.css','utf8'),js=fs.readFileSync('studio.js','utf8');
for(const file of ['index.html','studio.css','studio.js','favicon.svg','icon.svg']) assert(fs.existsSync(file),'missing '+file);
new vm.Script(js); // JavaScript parses
assert(html.includes('lang="zh-Hant"'));
assert(html.includes('name="viewport"'));
assert(html.includes('name="description"'));
assert(html.includes('rel="icon"'));
assert(html.includes('href="#content"'));
assert(html.includes('id="samples"'));
assert(html.includes('id="brief"'));
assert(html.includes('id="stageScreen"'));
assert(html.includes('id="wizardPanel"'));
assert(html.includes('id="demoBrand"')&&html.includes('id="demoHeadline"'));
assert(html.includes('data-style="quiet"')&&html.includes('data-style="bold"')&&html.includes('data-style="warm"')&&html.includes('data-style="clean"'));
assert(css.includes('prefers-reduced-motion'));
assert(css.includes(':focus-visible'));
assert(css.includes('max-width:520px'));
assert(js.includes('aria-pressed'));
assert(js.includes('URL.createObjectURL')&&js.includes('application')===false);
assert(js.includes('returnFocus')===false); // this iteration has no modal to mismanage
assert(js.includes('資安')||html.includes('資安'));
assert(html.includes('尚未')&&html.includes('正式'));
assert(!html.includes('<script src="https://'), 'No third-party scripts beyond font CSS');
console.log('PASS: studio assets, valid JS, sample variants, local discovery, basic accessibility and truthful disclaimers');
