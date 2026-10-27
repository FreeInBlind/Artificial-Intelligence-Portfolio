import { chromium } from 'playwright';
import path from 'node:path';

const url = 'file://' + path.join(process.cwd(), 'index.html').replace(/\\/g, '/');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 1050 }, deviceScaleFactor: 3 });
await page.addInitScript(() => { localStorage.setItem('crt.lang', 'en'); localStorage.setItem('crt.motion', 'reduced'); });
await page.goto(url);
await page.waitForTimeout(1000);
await page.evaluate(() => { if (!document.querySelector('.cmd-out').classList.contains('open')) document.querySelector('.cmd').click(); });
await page.waitForTimeout(600);
const box = await page.evaluate(() => {
  const el = document.querySelector('.cmd-body');
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, 240) };
});
await page.screenshot({ path: 'screenshots/zoom-en-body.png', clip: box });
await browser.close();
