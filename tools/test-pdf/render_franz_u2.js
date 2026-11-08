// Rendert franzoesisch/probetest-cr6-u2.html als PDF (Test + Lösungen).
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const root = path.resolve(__dirname, '../../franzoesisch');
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
  const opt = { format: 'A4', printBackground: true, preferCSSPageSize: true };
  const p = await b.newPage();
  await p.goto('file://' + root + '/probetest-cr6-u2.html');
  await p.pdf({ ...opt, path: root + '/probetest-cr6-u2.pdf' });
  await p.evaluate(() => document.body.classList.add('nur-loesung'));
  await p.pdf({ ...opt, path: root + '/probetest-cr6-u2-loesungen.pdf' });
  await b.close();
})();
