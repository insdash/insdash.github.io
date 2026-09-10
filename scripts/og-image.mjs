/**
 * Render the default share card: public/images/og/default.png, 1200×630.
 *
 * SEO.astro falls back to this for any page without an image of its own, so it
 * is what LinkedIn, Slack and X show when someone shares the homepage, /about or
 * /services. The words are the homepage's own — its h1 and its location line —
 * so change them there and here together.
 *
 * Rendered in headless Chrome rather than drawn with sharp so the type is the
 * site's real DM Sans and DM Mono, loaded from Google Fonts. The colours and the
 * four squares are sampled from images/logo/insdash_dark.png.
 *
 * Usage:
 *   node scripts/og-image.mjs
 */
import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('public/images/og/default.png');
const WIDTH = 1200;
const HEIGHT = 630;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,500&display=block" />
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${WIDTH}px; height: ${HEIGHT}px; }
  body {
    display: flex;
    flex-direction: column;
    padding: 72px 80px;
    background: #020407;
    color: #e3e7ea;
    font-family: 'DM Sans', sans-serif;
  }
  .mark {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    align-self: flex-start;
    gap: 10px;
  }
  .wordmark {
    font-family: 'DM Mono', monospace;
    font-size: 44px;
    font-weight: 500;
    line-height: 1;
  }
  .squares { display: flex; gap: 10px; }
  .squares span { width: 15px; height: 11px; }
  h1 {
    margin-top: auto;
    font-size: 96px;
    font-weight: 500;
    line-height: 1.02;
    letter-spacing: -0.035em;
  }
  .foot {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 40px;
    font-family: 'DM Mono', monospace;
    font-size: 24px;
    letter-spacing: 0.08em;
    color: #b0b0b0;
  }
  .foot .label { text-transform: uppercase; }
</style>
</head>
<body>
  <div class="mark">
    <span class="wordmark">insdash</span>
    <span class="squares" aria-hidden="true">
      <span style="background:#1f3a5c"></span><span style="background:#315d8e"></span><span style="background:#70acda"></span><span style="background:#e3e7ea"></span>
    </span>
  </div>
  <h1>We design it and<br />we build it.</h1>
  <div class="foot">
    <span class="label">Design and development studio · Zürich</span>
    <span>insdash.ch</span>
  </div>
</body>
</html>`;

// chrome-headless-shell if it is installed, as in a11y.mjs; full Chrome if not.
let browser;
try {
  browser = await puppeteer.launch({ headless: 'shell' });
} catch {
  browser = await puppeteer.launch({ headless: true });
}

try {
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // A face that failed to load still screenshots — in a fallback font. Checking
  // for a loaded FontFace by family catches that; `document.fonts.check()` does
  // not, because it also returns true when the stylesheet never arrived at all.
  const loaded = await page.evaluate(async () => {
    await Promise.all([
      document.fonts.load('500 96px "DM Sans"'),
      document.fonts.load('500 44px "DM Mono"'),
    ]);
    await document.fonts.ready;
    const has = (family) =>
      [...document.fonts].some(
        (face) => face.family.replace(/["']/g, '') === family && face.status === 'loaded'
      );
    return has('DM Sans') && has('DM Mono');
  });
  if (!loaded) {
    throw new Error('DM Sans or DM Mono did not load from Google Fonts; nothing was written.');
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await page.screenshot({ path: OUT, type: 'png' });
  console.log(`Wrote ${path.relative(process.cwd(), OUT)} (${WIDTH}×${HEIGHT})`);
} finally {
  await browser.close();
}
