// Rendert die HTML-Dateien in deutsch/ als PDF (Material und Probeprüfung, jeweils mit Lösungen).
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const root = path.resolve(__dirname, '../../deutsch');
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
  const opt = { format: 'A4', printBackground: true, preferCSSPageSize: true };
  for (const name of ['lernmaterial-pruefung-26-10', 'probepruefung-26-10', 'probepruefung-stadt-bern', '../englisch/test-unit1-my-town']) {
    const p = await b.newPage();
    await p.goto('file://' + root + '/' + name + '.html');
    await p.pdf({ ...opt, path: root + '/' + name + '.pdf' });
    await p.evaluate(() => document.body.classList.add('nur-loesung'));
    await p.pdf({ ...opt, path: root + '/' + name + '-loesungen.pdf' });
    await p.close();
  }
  await b.close();
})();
