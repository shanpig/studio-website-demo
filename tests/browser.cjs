const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROME_BIN?{executablePath:process.env.CHROME_BIN}:{})});
 const errors=[];fs.mkdirSync('screenshots',{recursive:true});
 try {
  const desktop=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true,deviceScaleFactor:1});
  desktop.on('pageerror',e=>errors.push('desktop: '+e.message));
  await desktop.goto('file://'+path.resolve('index.html'));
  await desktop.locator('.msg.assistant').first().waitFor();
  const core=await desktop.locator('#mascot').boundingBox();
  assert(core,'mascot not rendered');assert(Math.abs(core.x+core.width/2-720)<35,'mascot is not horizontally centered');assert(core.width>=400,'mascot is too small to be the central visual focus');
  await desktop.screenshot({path:'screenshots/desktop-idle.png',fullPage:true});
  assert.equal(await desktop.locator('.hud-panel:not(.hidden)').count(),0,'idle should not show floating tools');
  await desktop.getByRole('button',{name:'開始規劃我的網站'}).click();
  for(let step=0;step<5;step++){
   const wizard=desktop.locator('.hud-panel[data-mode="wizard"]');
   assert(await wizard.isVisible(),'wizard must be visible at step '+step);
   await wizard.locator('.choice').first().click();
   await wizard.locator('.panel-btn.primary').click();
  }
  const style=desktop.locator('.hud-panel[data-mode="styles"]');
  assert(await style.isVisible(),'style explorer must appear after discovery');
  await style.locator('.style').nth(1).click();
  await style.locator('.panel-btn.primary').click();
  const review=desktop.locator('.hud-panel[data-mode="review"]');
  assert(await review.isVisible(),'review window must appear');
  await review.locator('button[type="submit"]').click();
  assert.equal(await review.locator('.review-item').count(),1,'one review item expected');
  await review.locator('.panel-btn').filter({hasText:'整理完整需求書'}).click();
  const brief=desktop.locator('.hud-panel[data-mode="brief"]');
  assert(await brief.isVisible(),'brief window must appear');
  const briefText=await brief.locator('.brief-preview').innerText();
  assert(briefText.includes('未來鋒芒'),'selected style missing from brief');
  assert(briefText.includes('首頁主標題'),'review missing from brief');
  await desktop.screenshot({path:'screenshots/desktop-flow.png',fullPage:true});
  const [dl]=await Promise.all([desktop.waitForEvent('download'),brief.locator('.panel-btn').filter({hasText:'下載需求書'}).click()]);
  assert(dl.suggestedFilename().endsWith('.txt'),'brief file missing');
  assert((await desktop.locator('.hud-panel:not(.hidden)').count())<=2,'more than two overlapping panels');
  await desktop.locator('#resetBtn').click();
  assert.equal(await desktop.locator('.hud-panel:not(.hidden)').count(),0,'reset did not close tools');
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  mobile.on('pageerror',e=>errors.push('mobile: '+e.message));
  await mobile.goto('file://'+path.resolve('index.html'));
  await mobile.getByRole('button',{name:'先看設計範例'}).click();
  assert(await mobile.locator('.hud-panel[data-mode="styles"]').isVisible(),'mobile style tool not visible');
  assert(await mobile.locator('.intro-copy').isHidden(),'mobile headline overlaps the mascot');
  const clipped=await mobile.locator('.hud-panel[data-mode="styles"] .hud-content').evaluate(el=>el.scrollHeight>el.clientHeight+2);
  assert(!clipped,'mobile HUD content is clipped inside a short internal scrolling viewport');
  await mobile.waitForTimeout(400);
  await mobile.screenshot({path:'screenshots/mobile-style.png',fullPage:true});
  assert((await mobile.locator('body').evaluate(x=>x.scrollWidth))<=395,'unexpected horizontal overflow');
  assert.deepEqual(errors,[],'runtime page errors');
  console.log('PASS: centered mascot, no idle clutter, five questions, style, review, brief download, reset, mobile and no runtime JS errors.');
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
