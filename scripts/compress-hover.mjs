/**
 * Compress an animated WebP card-hover image.
 *
 * Card hovers are screen recordings, and unoptimised they dominate page weight —
 * one was shipping at 4.5MB. `astro:assets` preserves the animation rather than
 * flattening it, so the source file size is what reaches the browser.
 *
 * ffmpeg cannot decode animated WebP, so frames are pulled out one page at a
 * time with sharp and reassembled with libwebp's img2webp (brew install webp).
 *
 * Usage:
 *   node scripts/compress-hover.mjs <in.webp> <out.webp> [--fps 10] [--size 600]
 *                                   [--q 60] [--seconds 8] [--start 0.15]
 *
 *   --seconds  trim the loop; a card hover nobody watches for 28 seconds
 *   --start    skip a fraction of the head, where recordings often show an
 *              empty or placeholder state
 */
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export async function compressHover(
  src,
  out,
  { fps = 10, size = 600, q = 60, seconds = null, start = 0 } = {}
) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hover-'));
  try {
    const meta = await sharp(src, { animated: true }).metadata();
    const pages = meta.pages ?? 1;
    const delays = meta.delay ?? [];
    const avgMs = delays.length
      ? delays.reduce((a, b) => a + b, 0) / delays.length
      : 100;
    const srcFps = 1000 / avgMs;

    const step = Math.max(1, Math.round(srcFps / fps));
    let picked = [];
    for (let i = Math.floor(pages * start); i < pages; i += step) picked.push(i);
    if (seconds) picked = picked.slice(0, Math.round(seconds * fps));

    const files = [];
    for (const [n, page] of picked.entries()) {
      const f = path.join(tmp, `f${String(n).padStart(4, '0')}.png`);
      await sharp(src, { page, pages: 1 })
        .resize(size, size, { fit: 'inside' })
        .png()
        .toFile(f);
      files.push(f);
    }

    execFileSync(
      'img2webp',
      [
        '-loop', '0',
        '-lossy', '-q', String(q),
        '-m', '6',
        '-d', String(Math.round(1000 / fps)),
        ...files,
        '-o', out,
      ],
      { stdio: 'pipe' }
    );

    return {
      srcPages: pages,
      srcFps: Number(srcFps.toFixed(1)),
      frames: files.length,
      seconds: Number((files.length / fps).toFixed(1)),
      before: fs.statSync(src).size,
      after: fs.statSync(out).size,
    };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

if (import.meta.filename === process.argv[1]) {
  const [src, out, ...rest] = process.argv.slice(2);
  if (!src || !out) {
    console.error('usage: node scripts/compress-hover.mjs <in.webp> <out.webp> [--fps n] [--size n] [--q n] [--seconds n] [--start n]');
    process.exit(1);
  }
  const opts = {};
  for (let i = 0; i < rest.length; i += 2) {
    opts[rest[i].replace(/^--/, '')] = Number(rest[i + 1]);
  }
  const r = await compressHover(src, out, opts);
  console.log(
    `${path.basename(src)}: ${r.srcPages}f @${r.srcFps}fps ${(r.before / 1024).toFixed(0)}KB` +
      ` -> ${r.frames}f ${r.seconds}s ${(r.after / 1024).toFixed(0)}KB` +
      ` (${(100 - (r.after / r.before) * 100).toFixed(0)}% smaller)`
  );
}
