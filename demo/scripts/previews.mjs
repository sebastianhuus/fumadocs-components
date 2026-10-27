// Starts the built demo, screenshots every [data-preview] element in light and dark,
// and writes the PNGs to ../docs/previews/. Run through `pnpm previews` (builds first).
import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync } from 'node:fs';
import { chromium } from 'playwright';

const PORT = 4321;
const BASE = `http://localhost:${PORT}`;
const OUT = new URL('../../docs/previews/', import.meta.url).pathname;
// One docs page per component, plus full-page examples under src/app/examples/.
const pages = [
  ...readdirSync(new URL('../content/docs/', import.meta.url))
    .filter((f) => f.endsWith('.mdx') && f !== 'index.mdx')
    .map((f) => `docs/${f.replace(/\.mdx$/, '')}`),
  ...readdirSync(new URL('../src/app/examples/', import.meta.url)).map((d) => `examples/${d}`),
];

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
      await page.goto(`${BASE}/${name}`, { waitUntil: 'networkidle' });
      await page.addStyleTag({
        content: '*, *::before, *::after { animation: none !important; transition: none !important; }',
      });
      await page.evaluate(() => document.fonts.ready);

      for (const el of await page.locator('[data-preview]').all()) {
        const preview = await el.getAttribute('data-preview');
        const file = `${OUT}${preview}-${colorScheme}.png`;
        // Make everything behind the element transparent so rounded corners are cut out
        // instead of sitting on a page-colored box.
        await el.evaluate((node) => {
          for (let a = node.parentElement; a; a = a.parentElement) {
            a.style.setProperty('background', 'transparent', 'important');
          }
        });
        await el.screenshot({ path: file, omitBackground: true });
        console.log('wrote', file);
      }
    }
    await context.close();
  }
  await browser.close();
} finally {
  stop();
}
