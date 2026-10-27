import { chromium } from 'playwright';
import path from 'node:path';

const url = 'file://' + path.join(process.cwd(), 'index.html').replace(/\\/g, '/');
const browser = await chromium.launch();
for (const [w, h] of [[1280, 720], [1440, 900], [1680, 1050]]) {
  for (const lang of ['zh', 'en']) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.addInitScript(l => { localStorage.setItem('crt.motion', 'reduced'); localStorage.setItem('crt.lang', l); }, lang);
    await page.goto(url);
    await page.waitForTimeout(900);
    await page.evaluate(() => document.querySelector(".ch[data-ch='2']").click());
    await page.waitForTimeout(600);
    console.log(`${w}x${h} ${lang}`, await page.evaluate(() => {
      const q = s => document.querySelector(s);
      const box = s => { const e = q(s); if (!e) return 'MISSING'; const r = e.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}`; };
      const o = {};
      ['.stage', '.catalog', '.cover', '.art', '.cover-body', '.cover-foot', '.log-strip'].forEach(s => o[s] = box(s));
      o.scroll = q('.catalog').scrollHeight;
      return o;
    }));
    await page.close();
  }
}
await browser.close();
