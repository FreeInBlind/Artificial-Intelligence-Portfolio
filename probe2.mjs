import { chromium } from 'playwright';
import path from 'node:path';

const url = 'file://' + path.join(process.cwd(), 'index.html').replace(/\\/g, '/');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 1050 }, deviceScaleFactor: 2 });
await page.addInitScript(() => {
  localStorage.setItem('crt.lang', 'en');
  localStorage.setItem('crt.motion', 'reduced');
});
await page.goto(url);
await page.waitForTimeout(800);
await page.evaluate(() => document.querySelector('.cmd')?.click());
await page.waitForTimeout(500);
const info = await page.evaluate(() => {
  const p = document.querySelector('.cmd-body p');
  const s = getComputedStyle(p);
  return { font: s.fontFamily, size: s.fontSize, lh: s.lineHeight, w: s.fontWeight, letterspacing: s.letterSpacing };
});
console.log(info);
await page.locator('.cmd-inner').screenshot({ path: 'screenshots/zoom-en-about.png' });
await browser.close();
