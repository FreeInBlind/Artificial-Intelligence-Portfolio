import { chromium } from 'playwright';
import path from 'node:path';

const url = 'file://' + path.join(process.cwd(), 'index.html').replace(/\\/g, '/');
const browser = await chromium.launch();
const sel = ['#scene-1 .s1-left', '.panel.check', '.cmds', '.cmd-out', '.cmd-inner', '.cmd-body',
  '#tx-form', '#tx-form label:nth-of-type(1)', 'label.grow', 'label.grow textarea', '.field-note', '.tx-foot', '.ready-block',
  '.s3-right', '.scope-panel', '.panel.notes'];

for (const vp of [[1280, 720], [1440, 900]]) {
  for (const lang of ['zh', 'en']) {
    const page = await browser.newPage({ viewport: { width: vp[0], height: vp[1] } });
    await page.addInitScript(l => { localStorage.setItem('crt.lang', l); localStorage.setItem('crt.motion', 'reduced'); }, lang);
    await page.goto(url);
    await page.waitForTimeout(800);
    for (const ch of [1, 3]) {
      if (ch !== 1) { await page.evaluate(k => document.querySelector(`.ch[data-ch='${k}']`).click(), ch); await page.waitForTimeout(600); }
      const r = await page.evaluate(s => {
        const sr = document.querySelector('#screen').getBoundingClientRect();
        const sc = document.querySelector('.scene:not([hidden])').getBoundingClientRect();
        const rows = [];
        s.forEach(x => {
          const el = document.querySelector(x);
          if (!el || !el.offsetParent) return;
          const b = el.getBoundingClientRect();
          rows.push(`  ${x}  top=${Math.round(b.top - sr.top)} h=${Math.round(b.height)} sh=${el.scrollHeight} bOver=${Math.round(b.bottom - sr.bottom)}`);
        });
        return { screen: Math.round(sr.height), scene: Math.round(sc.height), sceneTop: Math.round(sc.top - sr.top), rows };
      }, sel);
      console.log(`${vp[0]}x${vp[1]} ${lang} ch${ch} screenH=${r.screen} sceneH=${r.scene} sceneTop=${r.sceneTop}`);
      console.log(r.rows.join('\n'));
    }
    await page.close();
  }
}
await browser.close();
