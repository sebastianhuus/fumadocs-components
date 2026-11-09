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

// Parts of the page outside the content (such as the table of contents), captured by selector.
// The table of contents is only shown on wide screens, so these use a wider viewport. `clipTo` crops
// the capture to the area those elements cover, as the element itself is as tall as the page.
const regions = [{ page: 'docs/linked-steps', preview: 'linked-steps-toc', selector: '#nd-toc', clipTo: '#toc-title, #nd-toc a', width: 1400 }];

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

      const wide = regions.find((r) => r.page === name)?.width;
      if (wide) await page.setViewportSize({ width: wide, height: 900 });

      const targets = [
        ...(await page.locator('[data-preview]').all()).map((el) => ({ el, selectorPreview: null, clipTo: null })),
        ...regions.filter((r) => r.page === name).map((r) => ({ el: page.locator(r.selector), selectorPreview: r.preview, clipTo: r.clipTo })),
      ];

      for (const { el, selectorPreview, clipTo } of targets) {
        const preview = selectorPreview ?? (await el.getAttribute('data-preview'));
        const file = `${OUT}${preview}-${colorScheme}.png`;
        // Make everything behind the element transparent so rounded corners are cut out
        // instead of sitting on a page-colored box.
        await el.evaluate((node) => {
          for (let a = node.parentElement; a; a = a.parentElement) {
            a.style.setProperty('background', 'transparent', 'important');
          }
        });
        // Previews of hover-only UI mark the trigger with `data-preview-hover`. A value is a
        // selector inside the marked element to hover instead of the element itself.
        const trigger = el.locator('[data-preview-hover]').first();
        if (await trigger.count()) {
          const inner = await trigger.getAttribute('data-preview-hover');
          // A bare attribute in JSX is rendered as "true".
          await (inner && inner !== 'true' ? trigger.locator(inner).first() : trigger).hover();
          await page.waitForTimeout(200);
        }
        if (clipTo) {
          const clip = await page.evaluate((selector) => {
            const boxes = [...document.querySelectorAll(selector)].map((n) => n.getBoundingClientRect());
            const pad = 8;
            const x = Math.min(...boxes.map((b) => b.left)) - pad;
            const y = Math.min(...boxes.map((b) => b.top)) - pad;
            return {
              x,
              y,
              width: Math.max(...boxes.map((b) => b.right)) + pad - x,
              height: Math.max(...boxes.map((b) => b.bottom)) + pad - y,
            };
          }, clipTo);
          await page.screenshot({ path: file, omitBackground: true, clip });
        } else {
          await el.screenshot({ path: file, omitBackground: true });
        }
        await page.mouse.move(0, 0);
        console.log('wrote', file);
      }

      if (wide) await page.setViewportSize({ width: 1200, height: 900 });
    }
    await context.close();
  }
  await browser.close();
} finally {
  stop();
}
