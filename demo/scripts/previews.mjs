// Starts the built demo, screenshots every [data-preview] element in light and dark,
// and writes the PNGs to ../docs/previews/. Run through `pnpm previews` (builds first).
import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync } from 'node:fs';
import { chromium } from 'playwright';

const PORT = 4321;
const BASE = `http://localhost:${PORT}`;
const OUT = new URL('../../docs/previews/', import.meta.url).pathname;
const pages = readdirSync(new URL('../content/docs/', import.meta.url))
  .filter((f) => f.endsWith('.mdx') && f !== 'index.mdx')
  .map((f) => f.replace(/\.mdx$/, ''));

mkdirSync(OUT, { recursive: true });

const server = spawn('pnpm', ['exec', 'next', 'start', '-p', String(PORT)], { stdio: 'inherit' });
const stop = () => server.kill();
process.on('exit', stop);

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(BASE)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('demo server did not start');
}

try {
  await waitForServer();
  const browser = await chromium.launch();

  for (const colorScheme of ['light', 'dark']) {
    const context = await browser.newContext({
      viewport: { width: 1200, height: 900 },
      deviceScaleFactor: 2,
      colorScheme,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    for (const name of pages) {
      await page.goto(`${BASE}/docs/${name}`, { waitUntil: 'networkidle' });
      await page.addStyleTag({
        content: '*, *::before, *::after { animation: none !important; transition: none !important; }',
      });
      await page.evaluate(() => document.fonts.ready);

      for (const el of await page.locator('[data-preview]').all()) {
        const preview = await el.getAttribute('data-preview');
        const file = `${OUT}${preview}-${colorScheme}.png`;
        await el.screenshot({ path: file });
        console.log('wrote', file);
      }
    }
    await context.close();
  }
  await browser.close();
} finally {
  stop();
}
