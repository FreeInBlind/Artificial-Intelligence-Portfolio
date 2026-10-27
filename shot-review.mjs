/*
  评审用截图：同时产出「屏幕特写」与「全貌」，并覆盖多个视口，
  用来验证三个频道在不同可用高度下都不溢出玻璃。
  用法：node shot-review.mjs
*/
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const url = 'file://' + path.join(process.cwd(), 'index.html').replace(/\\/g, '/');
const outDir = 'screenshots';
fs.mkdirSync(outDir, { recursive: true });

const VIEWPORTS = [
  { tag: 'w1440', width: 1440, height: 900 },
  { tag: 'w1280', width: 1280, height: 720 },
  { tag: 'w1680', width: 1680, height: 1050 }
];

const browser = await chromium.launch();
const errors = [];
const report = [];

for (const vp of VIEWPORTS) {
  for (const lang of ['zh', 'en']) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1.5 });
    page.on('pageerror', e => errors.push(`${vp.tag}/${lang}: ${e.message}`));
    await page.addInitScript(l => {
      localStorage.setItem('crt.lang', l);
      localStorage.setItem('crt.motion', 'reduced');
    }, lang);
    await page.goto(url);
    await page.waitForTimeout(700);

    for (const n of [1, 2, 3]) {
      if (n !== 1) {
        await page.evaluate(k => document.querySelector(`.ch[data-ch='${k}']`).click(), n);
        await page.waitForTimeout(700);
      } else {
        await page.waitForTimeout(400);
      }
      const el = await page.$('#screen');
      await el.screenshot({ path: `${outDir}/${vp.tag}-${lang}-${n}-screen.png` });
      await page.screenshot({ path: `${outDir}/${vp.tag}-${lang}-${n}-full.png` });

      // 溢出自检：场景内任何元素都不能超出屏幕可视区
      const bad = await page.evaluate(k => {
        const sc = document.querySelector(`#scene-${k}`);
        const sr = document.querySelector('#screen').getBoundingClientRect();
        const out = [];
        sc.querySelectorAll('*').forEach(el => {
          if (!el.offsetParent && el.offsetWidth === 0) return;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          if (r.bottom > sr.bottom + 0.5 || r.top < sr.top - 0.5 || r.right > sr.right + 0.5 || r.left < sr.left - 0.5) {
            out.push(`${el.className || el.tagName} b=${Math.round(r.bottom - sr.bottom)} r=${Math.round(r.right - sr.right)}`);
          }
        });
        const doc = document.scrollingElement;
        return { out: out.slice(0, 6), pageScroll: doc.scrollHeight - doc.clientHeight };
      }, n);
      report.push(`${vp.tag} ${lang} ch${n}  pageScroll=${bad.pageScroll}  overflow=${bad.out.length ? bad.out.join(' | ') : 'none'}`);
    }
    await page.close();
  }
}

await browser.close();
console.log(report.join('\n'));
console.log('ERRORS', errors);
