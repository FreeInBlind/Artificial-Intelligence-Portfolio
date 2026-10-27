import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

// 只截屏幕本身（三个频道），不含桌面、机身与磁盘架
const url = 'file://' + path.join(process.cwd(), 'index.html').replace(/\\/g, '/');
const outDir = 'screenshots';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const errors = [];

for (const lang of ['zh', 'en']) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  page.on('pageerror', e => errors.push(`${lang}: ${e.message}`));
  await page.addInitScript(l => {
    localStorage.setItem('crt.lang', l);
    localStorage.setItem('crt.motion', 'reduced');
  }, lang);
  await page.goto(url);
  await page.waitForTimeout(800);

  for (const n of [1, 2, 3]) {
    if (n !== 1) {
      await page.evaluate(n => document.querySelector(`.ch[data-ch='${n}']`).click(), n);
      await page.waitForTimeout(900);   // 等换台转场与自检动画走完
    } else {
      await page.waitForTimeout(500);
    }
    const el = await page.$('#screen');
    const file = `${outDir}/${lang}-${n}-channel.png`;
    await el.screenshot({ path: file });
    const box = await el.boundingBox();
    console.log(file, `${Math.round(box.width)}x${Math.round(box.height)}`);
  }
  await page.close();
}

await browser.close();
console.log('ERRORS', errors);
