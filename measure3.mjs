import { chromium } from 'playwright';
import path from 'node:path';

const url = 'file://' + path.join(process.cwd(), 'index.html').replace(/\\/g, '/');
const browser = await chromium.launch();
for (const [w, h] of [[1680, 1050], [1280, 720]]) {
  for (const lang of ['zh', 'en']) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.addInitScript(l => { localStorage.setItem('crt.motion', 'reduced'); localStorage.setItem('crt.lang', l); }, lang);
    await page.goto(url);
    await page.waitForTimeout(900);
    await page.evaluate(() => document.querySelector(".ch[data-ch='2']").click());
    await page.waitForTimeout(600);
    console.log(`${w}x${h} ${lang}`, await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('.cover').forEach((c, i) => {
        const cr = c.getBoundingClientRect();
        out.push(`card${i} h=${Math.round(cr.height)} scroll=${c.scrollHeight}`);
        Array.from(c.children).forEach(el => {
          const r = el.getBoundingClientRect();
          out.push(`  ${el.className} top=${Math.round(r.top - cr.top)} h=${Math.round(r.height)} sh=${el.scrollHeight}`);
        });
      });
      return out.join('\n');
    }));
    await page.close();
  }
}
await browser.close();
