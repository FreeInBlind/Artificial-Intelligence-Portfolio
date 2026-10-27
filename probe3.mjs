import { chromium } from 'playwright';
import path from 'node:path';

const url = 'file://' + path.join(process.cwd(), 'index.html').replace(/\\/g, '/');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 1050 }, deviceScaleFactor: 2 });
await page.addInitScript(() => { localStorage.setItem('crt.motion', 'reduced'); });
await page.goto(url);
await page.waitForTimeout(1200);
const faces = await page.evaluate(() => [...document.fonts].map(f => `${f.family} | ${f.weight} | ${f.style} | ${f.status}`));
console.log([...new Set(faces)].join('\n'));
const res = await page.evaluate(() => {
  const probe = (txt, font, weight) => {
    const c = document.createElement('canvas').getContext('2d');
    c.font = `${weight} 44px ${font}`;
    return +c.measureText(txt).width.toFixed(1);
  };
  return {
    noto400: probe('项目档案', '"Noto Sans SC"', 400),
    noto700: probe('项目档案', '"Noto Sans SC"', 700),
    noto900: probe('项目档案', '"Noto Sans SC"', 900),
    noto400latin: probe('Portfolio website', '"Noto Sans SC"', 400),
  };
});
console.log(res);
await page.locator('#s2-title').screenshot({ path: 'screenshots/zoom-zh-title.png' });
await page.evaluate(() => document.querySelector('.ch[data-ch="3"]').click());
await page.waitForTimeout(700);
await page.locator('#tx-form').screenshot({ path: 'screenshots/zoom-tx-form.png' });
await page.locator('.s3-right').screenshot({ path: 'screenshots/zoom-s3-right.png' });
await browser.close();
