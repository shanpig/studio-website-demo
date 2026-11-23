// Dependency-free smoke checks for production static site.
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const script=fs.readFileSync('data.js','utf8');
const app=fs.readFileSync('app.js','utf8');
for(const path of ['favicon.svg','icon.svg','index.html','data.js','app.js']) assert(fs.existsSync(path),path+' missing');
assert(html.includes('lang="zh-Hant"'),'Chinese language metadata');
assert(html.includes('name="viewport"'),'responsive metadata');
assert(html.includes('name="description"'),'SEO description');
assert(html.includes('rel="icon"'),'favicon reference');
assert(html.includes('href="#main"'),'skip link');
assert(html.includes('prefers-reduced-motion'),'reduced motion');
assert(html.includes('aria-labelledby="modalTitle"'),'modal accessible label');
assert(html.includes('id="planner"'),'client brief form');
assert(!html.includes('Lorem ipsum'),'no placeholder content');
assert(!script.includes('Math.random'),'real case data must be deterministic');
const context={window:{}};vm.runInNewContext(script,context);
const cases=Object.values(context.window.SPACE_CASES);
assert.equal(cases.length,3,'three sourced case studies');
for(const c of cases){
 assert(c.title&&c.architect&&c.intro&&c.image&&c.alt,c.slug+' missing required fields');
 assert(c.sections.length>=3,c.slug+' lacks editorial depth');
 assert(c.sources.length>=2,c.slug+' lacks sources');
 assert(c.license&&c.imagePage&&c.credit,c.slug+' missing image attribution');
 assert(c.image.startsWith('https://upload.wikimedia.org/'),c.slug+' image must use licensed Commons file');
}
assert(app.includes('showModal()'),'case viewer');
assert(app.includes('URL.createObjectURL'),'private export');
assert(app.includes('reportValidity'),'form validation');
console.log('PASS: required assets, accessibility metadata, content provenance, navigation and planner checks');
