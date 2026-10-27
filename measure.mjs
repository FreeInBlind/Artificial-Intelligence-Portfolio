import { chromium } from 'playwright';
import path from 'node:path';

const url = 'file://' + path.join(process.cwd(), 'index.html').replace(/\\/g, '/');
const browser = await chromium.launch();
for (const [w, h] of [[1440, 900], [1280, 720]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.addInitScript(() => { localStorage.setItem('crt.motion', 'reduced'); localStorage.setItem('crt.lang', 'zh'); });
  await page.goto(url);
  await page.waitForTimeout(900);
  for (const n of [1, 3]) {
    await page.evaluate(k => document.querySelector(`.ch[data-ch="${k}"]`).click(), n);
    await page.waitForTimeout(600);
    console.log(`${w}x${h} ch${n}`, await page.evaluate(k => {
      const sc = document.querySelector('#screen').getBoundingClientRect();
      const sels = k === 1
        ? ['.id-card', '#portrait', '#facts', '.id-now', '.now-list', '.id-foot', '.cmd-out', '#cmd-inner']
        : ['.s3-right', '.scope-panel', '#scope', '.notes', '.note-list', '.tx-flow', '.receipt', '#tx-form', '.ready-block'];
      const o = {};
      sels.forEach(s => {
        const el = document.querySelector(s);
        if (!el) { o[s] = 'MISSING'; return; }
        const r = el.getBoundingClientRect();
        o[s] = `h=${Math.round(r.height)} over=${Math.round(r.bottom - sc.bottom)} scroll=${el.scrollHeight}`;
      });
      return o;
    }, n));
  }
  await page.close();
}
await browser.close();
