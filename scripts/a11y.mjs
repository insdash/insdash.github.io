/**
 * Accessibility audit of the built site, run against a real browser.
 *
 * Every route in `dist/` is loaded twice — once with `data-theme="light"`, once
 * with `data-theme="dark"` — because the palette is declared as `light-dark()`
 * pairs in global.css, so a colour that passes contrast in one theme can fail in
 * the other. A single-theme audit only ever checks half the design.
 *
 * Reporting only: it never runs as part of the deploy. Output goes to
 * `a11y-report/` (gitignored) and to the GitHub job summary when in CI.
 *
 * Usage:
 *   npm run a11y                      build, then audit both themes
 *   node scripts/a11y.mjs             audit the existing dist/
 *   node scripts/a11y.mjs --theme dark
 *   node scripts/a11y.mjs --url /about --contrast
 *
 *   --theme    light | dark | both (default both)
 *   --url      only audit routes containing this string
 *   --contrast only report colour contrast, and list every failing pair
 *   --all      include axe best-practice rules, not just WCAG 2.1 A/AA
 *   --soft     always exit 0, even with violations
 *   --port     static server port (default 4331)
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';

const DIST = 'dist';
const OUT_DIR = 'a11y-report';
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const argv = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const next = argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
};

const opts = {
  theme: flag('theme', 'both'),
  url: flag('url', null),
  contrastOnly: Boolean(flag('contrast', false)),
  all: Boolean(flag('all', false)),
  soft: Boolean(flag('soft', false)),
  port: Number(flag('port', 4331)),
};

const themes =
  opts.theme === 'both' ? ['light', 'dark'] : [String(opts.theme)];

/** Every built route, so a new page is covered without touching this file. */
function routes(dir = DIST, base = '') {
  if (!fs.existsSync(dir))
    throw new Error(`No ${DIST}/ — run \`npm run build\` first.`);

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory())
      return routes(path.join(dir, entry.name), `${base}/${entry.name}`);
    return entry.name === 'index.html' ? [`${base}/`] : [];
  });
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
};

/**
 * Serve `dist/` ourselves rather than shelling out to `astro preview`.
 *
 * `astro preview` daemonises: a second invocation exits immediately and points
 * at the instance already running, so a spawn-then-poll would happily audit
 * whatever else answered on that port — the `astro dev` server, or a stale
 * snapshot from an earlier run. Binding the port here means the audit either
 * measures this build or fails loudly.
 *
 * file:// is not an option: the site builds with absolute asset paths.
 */
function serveDist(port) {
  const root = path.resolve(DIST);

  const server = http.createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let file = path.join(root, url);

    if (!file.startsWith(root)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, {
      'content-type':
        MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    fs.createReadStream(file).pipe(res);
  });

  return new Promise((resolve, reject) => {
    server.once('error', (error) =>
      reject(
        error.code === 'EADDRINUSE'
          ? new Error(
              `Port ${port} is already in use — pass --port to pick another. ` +
                'Refusing to audit a server this run did not start.'
            )
          : error
      )
    );
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

async function auditPage(page, url, theme) {
  // Both halves matter: the media feature drives `light-dark()` for anything
  // left on the system default, and the attribute drives the explicit override.
  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: theme },
  ]);
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate((t) => {
    document.documentElement.setAttribute('data-theme', t);
  }, theme);
  // Let the attribute change repaint before axe reads computed styles.
  await page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => r()))
  );

  let axe = new AxePuppeteer(page);
  axe = opts.all ? axe : axe.withTags(WCAG_TAGS);
  if (opts.contrastOnly) axe = new AxePuppeteer(page).withRules(['color-contrast']);

  return axe.analyze();
}

function contrastRows(violations, route, theme) {
  const rule = violations.find((v) => v.id === 'color-contrast');
  if (!rule) return [];

  return rule.nodes.map((node) => {
    const data = node.any?.[0]?.data ?? {};
    return {
      route,
      theme,
      selector: String(node.target?.[0] ?? '').slice(0, 60),
      fg: data.fgColor ?? '?',
      bg: data.bgColor ?? '?',
      ratio: data.contrastRatio ?? null,
      required: data.expectedContrastRatio ?? '?',
      text: (node.html ?? '').replace(/\s+/g, ' ').slice(0, 60),
    };
  });
}

function markdown(findings, contrast) {
  const lines = ['# Accessibility report', ''];

  if (!findings.length) {
    lines.push('No WCAG 2.1 A/AA violations in either theme.', '');
  } else {
    lines.push('## Violations', '');
    lines.push('| Rule | Impact | Theme | Route | Elements |');
    lines.push('| --- | --- | --- | --- | --- |');
    for (const f of findings)
      lines.push(
        `| ${f.id} | ${f.impact ?? '—'} | ${f.theme} | ${f.route} | ${f.count} |`
      );
    lines.push('');
  }

  if (contrast.length) {
    lines.push('## Colour contrast', '');
    lines.push('| Theme | Route | Foreground | Background | Ratio | Required | Element |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- |');
    for (const c of contrast)
      lines.push(
        `| ${c.theme} | ${c.route} | \`${c.fg}\` | \`${c.bg}\` | ${c.ratio ?? '?'} | ${c.required} | \`${c.selector}\` |`
      );
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  const all = routes().sort();
  const targets = opts.url ? all.filter((r) => r.includes(opts.url)) : all;

  if (!targets.length) throw new Error(`No route matched --url ${opts.url}`);

  console.log(
    `Auditing ${targets.length} route(s) × ${themes.length} theme(s)\n`
  );

  const server = await serveDist(opts.port);
  // chrome-headless-shell keeps CI light; fall back to full Chrome locally.
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'shell' });
  } catch {
    browser = await puppeteer.launch({ headless: true });
  }

  const findings = [];
  const contrast = [];
  const raw = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    for (const theme of themes) {
      for (const route of targets) {
        const url = `http://localhost:${opts.port}${route}`;
        const results = await auditPage(page, url, theme);
        raw.push({ route, theme, violations: results.violations });

        const total = results.violations.reduce(
          (n, v) => n + v.nodes.length,
          0
        );
        console.log(
          `${total === 0 ? '  ok ' : ` ${String(total).padStart(3)} `} ${theme.padEnd(5)} ${route}`
        );

        for (const v of results.violations)
          findings.push({
            id: v.id,
            impact: v.impact,
            theme,
            route,
            count: v.nodes.length,
            help: v.help,
          });

        contrast.push(...contrastRows(results.violations, route, theme));
      }
    }
  } finally {
    await browser.close();
    server.closeAllConnections?.();
    server.close();
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const report = markdown(findings, contrast);
  fs.writeFileSync(path.join(OUT_DIR, 'report.md'), report);
  fs.writeFileSync(
    path.join(OUT_DIR, 'results.json'),
    JSON.stringify(raw, null, 2)
  );
  if (process.env.GITHUB_STEP_SUMMARY)
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report}\n`);

  console.log('');
  if (!findings.length) {
    console.log('No WCAG 2.1 A/AA violations in either theme.');
  } else {
    const byRule = new Map();
    for (const f of findings)
      byRule.set(f.id, (byRule.get(f.id) ?? 0) + f.count);
    for (const [id, count] of [...byRule].sort((a, b) => b[1] - a[1]))
      console.log(`  ${String(count).padStart(3)} × ${id}`);
  }

  if (contrast.length) {
    console.log('\nColour contrast failures:');
    for (const c of contrast)
      console.log(
        `  ${c.theme.padEnd(5)} ${c.route.padEnd(28)} ${String(c.fg).padEnd(22)} on ${String(c.bg).padEnd(22)} ${c.ratio}:1 (needs ${c.required})  ${c.selector}`
      );
  }

  console.log(`\nReport written to ${OUT_DIR}/report.md`);
  if (findings.length && !opts.soft) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
