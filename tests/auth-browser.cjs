const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.AUTH_TEST_URL || 'http://localhost:3101';
const screenshots=process.env.AUTH_SCREENSHOTS || '.auth-artifacts';
fs.mkdirSync(screenshots,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:process.env.AUTH_BROWSER || 'msedge',headless:true});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const route of ['sign-in','sign-up','forgot-password','reset-password','verify-code','complete-sign-up','demo-access']){
  for(const width of [280,320,375,768,1024,1440]){
   await page.setViewportSize({width,height:900});await page.goto(`${base}/${route}`);await page.waitForTimeout(100);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} overflow ${width}`);
   assert(!/preview|demonstration|illustrative|connected soon/i.test(await page.locator('body').innerText()));
   if(route==='sign-in'||route==='sign-up'){
    await page.getByRole('button',{name:'Teacher',exact:true}).click();
    const widths=await page.evaluate(async()=>{const out=[];for(let i=0;i<42;i++){await new Promise(requestAnimationFrame);out.push(document.documentElement.scrollWidth<=innerWidth)}return out});assert(widths.every(Boolean),`${route} animation overflow ${width}`);
    assert.equal(await page.locator('[data-face="front"]').getAttribute('inert'),'');
    assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Teacher');
    await page.keyboard.press('Tab');assert(await page.evaluate(()=>!document.activeElement.closest('[inert]')));
    await page.getByRole('button',{name:'Student',exact:true}).click();await page.waitForTimeout(650);
    assert.equal(await page.locator('[data-flipped]').getAttribute('data-flipped'),'false');
   }
  }
  console.log(`PASS ${route}: six widths, no overflow/preview, role flip where applicable`);
 }
 await page.goto(`${base}/sign-in`);await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('[data-flipped]').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
 await page.locator('#student-email').focus();
 assert.deepEqual(await page.locator('#student-email').evaluate(el=>({outline:getComputedStyle(el).outlineStyle,border:getComputedStyle(el).borderTopWidth,shadow:getComputedStyle(el).boxShadow})),{outline:'none',border:'2px',shadow:'none'});
 assert.equal(await page.locator('link[rel="apple-touch-icon"]').count(),1);assert(await page.locator('link[href^="/favicon.ico"]').count());
 for(const path of ['/favicon.ico','/icon.svg','/apple-icon.png'])assert.equal((await page.request.get(base+path)).status(),200);
 await page.goto(`${base}/sign-up`);await page.getByRole('button',{name:'Teacher',exact:true}).click();
 await page.locator('#signup-name-teacher').fill('Alice Smith');await page.getByRole('textbox',{name:'Email',exact:true}).fill('alice@example.com');await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByLabel('Verification code').fill('928461');await page.getByRole('button',{name:'Continue',exact:true}).click();await page.waitForURL('**/complete-sign-up');
 await page.getByLabel('Date of birth').fill('1995-05-15');await page.getByLabel('Country of origin').selectOption('BR');
 await page.getByLabel('Password',{exact:true}).fill('Alice!9RiverMoon');await page.getByLabel('Confirm password',{exact:true}).fill('Alice!9RiverMoon');await page.getByRole('button',{name:'Complete sign-up',exact:true}).click();
 assert.equal(await page.getByLabel('Password',{exact:true}).getAttribute('aria-invalid'),'true');
 await page.getByLabel('Password',{exact:true}).fill('Cedar!9RiverMoon');await page.getByLabel('Confirm password',{exact:true}).fill('Cedar!9RiverMoon');
 assert.equal(await page.getByRole('meter').getAttribute('value'),'3');
 await page.setViewportSize({width:375,height:812});await page.screenshot({path:`${screenshots}/signup-final.png`,fullPage:true});
 await page.getByRole('button',{name:'Complete sign-up',exact:true}).click();await page.getByText('You’re ready to continue.').waitFor();
 await page.goto(`${base}/forgot-password`);await page.getByRole('textbox',{name:'Email',exact:true}).fill('alice@example.com');await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('link',{name:'Enter recovery code'}).click();
 await page.getByLabel('Recovery code',{exact:true}).fill('928461');await page.getByRole('button',{name:'Continue',exact:true}).click();await page.waitForURL('**/reset-password');
 await page.getByLabel('New password',{exact:true}).fill('Alice!9RiverMoon');await page.getByLabel('Confirm new password',{exact:true}).fill('Alice!9RiverMoon');await page.getByRole('button',{name:'Reset password',exact:true}).click();assert.equal(await page.getByLabel('New password',{exact:true}).getAttribute('aria-invalid'),'true');
 await page.getByLabel('New password',{exact:true}).fill('Cedar!9RiverMoon');await page.getByLabel('Confirm new password',{exact:true}).fill('Cedar!9RiverMoon');await page.getByRole('button',{name:'Reset password',exact:true}).click();await page.getByRole('heading',{name:'Request complete'}).waitFor();
 await page.goto(`${base}/sign-in`);await page.screenshot({path:`${screenshots}/login-final.png`,fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS reduced motion, input focus, icons, signup and recovery password validation, no browser exceptions');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
