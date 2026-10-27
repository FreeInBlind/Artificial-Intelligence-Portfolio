import { chromium } from 'playwright';
import path from 'node:path';

const url = 'file://' + path.join(process.cwd(), 'index.html').replace(/\\/g, '/');
const browser = await chromium.launch();
const out = {};
for (const lang of ['zh', 'en']) {
  const page = await browser.newPage({ viewport: { width: 1680, height: 1050 } });
  await page.addInitScript(l => localStorage.setItem('crt.lang', l), lang);
  await page.goto(url);
  await page.waitForTimeout(900);
  out[lang] = await page.evaluate(() => {
    const q = s => document.querySelector(s);
    const cs = el => el ? getComputedStyle(el) : null;
    const p = document.querySelector('.cmd-body p');
    const h1 = q('#s1-title');
    const lead = q('#p-role');
    const info = {};
    if (p) {
      const s = cs(p);
      info.body = { font: s.fontFamily, size: s.fontSize, lh: s.lineHeight, weight: s.fontWeight };
    }
    const hs = cs(h1);
    info.h1 = { font: hs.fontFamily, size: hs.fontSize, lh: hs.lineHeight, shadow: hs.textShadow, mb: hs.marginBottom };
    const ls = cs(lead);
    info.lead = { font: ls.fontFamily, size: ls.fontSize, lh: ls.lineHeight, top: Math.round(lead.getBoundingClientRect().top - h1.getBoundingClientRect().bottom) };
    info.fontsStatus = document.fonts.status;
    info.loaded = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight).slice(0, 12);
    return info;
  });
  await page.close();
}
console.log(JSON.stringify(out, null, 2));
await browser.close();
