// Rendert deutsch/lernmaterial-pruefung-26-10.html als Test.pdf und Loesung.pdf (Chromium via Playwright).
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const root = path.resolve(__dirname, '../../deutsch');
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
  const p = await b.newPage();
  await p.goto('file://' + root + '/lernmaterial-pruefung-26-10.html');
  const opt = { format: 'A4', printBackground: true, preferCSSPageSize: true };
  await p.pdf({ ...opt, path: root + '/lernmaterial-pruefung-26-10.pdf' });
  await p.evaluate(() => document.body.classList.add('nur-loesung'));
  await p.pdf({ ...opt, path: root + '/lernmaterial-pruefung-26-10-loesungen.pdf' });
  await b.close();
})();
