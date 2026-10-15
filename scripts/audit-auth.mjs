import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

// Tooling lives outside the app dependency tree; see docs/auth-design-performance.md.
const tools = path.resolve(process.env.AUTH_AUDIT_TOOLS || '.auth-audit-tools');
const require = createRequire(path.join(tools, 'package.json'));
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { default: lighthouse } = await import(pathToFileURL(path.join(tools, 'node_modules/lighthouse/core/index.js')));
const { default: desktopConfig } = await import(pathToFileURL(path.join(tools, 'node_modules/lighthouse/core/config/desktop-config.js')));
const base = process.env.AUTH_TEST_URL || 'http://localhost:3101';
const phase = process.argv[2] || 'current';
const out = path.resolve('.auth-artifacts/performance', phase);
await fs.mkdir(out, { recursive: true });
const rows = [];
for (const route of ['sign-in', 'sign-up', 'forgot-password', 'reset-password', 'verify-code', 'complete-sign-up', 'demo-access']) {
  for (const mode of ['mobile', 'desktop']) {
    const browser = await chromium.launch({ channel: process.env.AUTH_BROWSER || 'msedge', headless: true, args: ['--remote-debugging-port=9223'] });
    try {
      const { lhr } = await lighthouse(`${base}/${route}`, { port: 9223, onlyCategories: ['performance'], output: 'json', logLevel: 'error' }, mode === 'desktop' ? desktopConfig : undefined);
      if (lhr.runtimeError) throw new Error(JSON.stringify(lhr.runtimeError));
      await fs.writeFile(path.join(out, `${route}-${mode}.json`), JSON.stringify(lhr));
      const a = lhr.audits;
      const resources = a['resource-summary'].details.items;
      const row = { route, mode, score: lhr.categories.performance.score * 100, LCP: a['largest-contentful-paint'].numericValue, CLS: a['cumulative-layout-shift'].numericValue, TBT: a['total-blocking-time'].numericValue, JS: resources.find(r => r.resourceType === 'script')?.transferSize, CSS: resources.find(r => r.resourceType === 'stylesheet')?.transferSize, requests: resources.find(r => r.resourceType === 'total')?.requestCount };
      rows.push(row);
      await fs.writeFile(path.join(out, 'summary.json'), JSON.stringify(rows, null, 2));
      console.log(row);
    } finally { await browser.close(); }
  }
}
