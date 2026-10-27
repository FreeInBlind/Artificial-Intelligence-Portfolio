import { chromium } from 'playwright';
import path from 'node:path';

const url = 'file://' + path.join(process.cwd(), 'index.html').replace(/\\/g, '/');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url);
await page.waitForTimeout(1200);
console.log(await page.evaluate(() => {
  const out = {};
  ['VT323', 'IBM Plex Mono', 'Noto Sans SC'].forEach(f => { out[f] = document.fonts.check('16px "' + f + '"'); });
  const cv = document.createElement('canvas').getContext('2d');
  cv.font = '16px monospace';
  const base = cv.measureText('Machine learning').width;
  const widths = {};
  ['VT323', 'IBM Plex Mono', 'Noto Sans SC'].forEach(f => { cv.font = '16px "' + f + '"'; widths[f] = +cv.measureText('Machine learning').width.toFixed(1); });
  out.base = +base.toFixed(1);
  out.widths = widths;
  out.fontsReady = document.fonts.status;
  return out;
}));
await browser.close();
