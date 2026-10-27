import { chromium } from 'playwright';
import path from 'node:path';

const url = 'file://' + path.join(process.cwd(), 'index.html').replace(/\\/g, '/');
const browser = await chromium.launch();
for (const vp of [[1280, 720], [1440, 900], [1680, 1050]]) {
  for (const lang of ['zh', 'en']) {
    const page = await browser.newPage({ viewport: { width: vp[0], height: vp[1] } });
    await page.addInitScript(l => { localStorage.setItem('crt.lang', l); localStorage.setItem('crt.motion', 'reduced'); }, lang);
    await page.goto(url);
    await page.waitForTimeout(700);
    await page.evaluate(() => document.querySelector('.ch[data-ch="2"]').click());
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => {
      const card = document.querySelector('.cover');
      const g = s => { const e = card.querySelector(s); return e ? Math.round(e.getBoundingClientRect().height) : 0; };
      const bodyKids = [...card.querySelector('.cover-body').children].map(e => `${e.className || e.tagName}:${Math.round(e.getBoundingClientRect().height)}`);
      return {
        card: Math.round(card.getBoundingClientRect().height),
        art: g('.art'), body: g('.cover-body'), foot: g('.cover-foot'),
        bodyKids,
        free: Math.round(card.querySelector('.cover-body').getBoundingClientRect().height - [...card.querySelector('.cover-body').children].reduce((a, e) => a + e.getBoundingClientRect().height, 0)),
      };
    });
    console.log(vp.join('x'), lang, JSON.stringify(r));
    await page.close();
  }
}
await browser.close();
