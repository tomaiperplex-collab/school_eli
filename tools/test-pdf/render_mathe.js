// Rendert die Mathe-Übungsblätter (Version A–E) in mathe/ als PDF.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const root = path.resolve(__dirname, '../../mathe');
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
  for (const name of ['korrektur-uebungen', 'korrektur-uebungen-b', 'korrektur-uebungen-c', 'korrektur-uebungen-d', 'korrektur-uebungen-e']) {
    const p = await b.newPage();
    await p.goto('file://' + root + '/' + name + '.html');
    await p.pdf({ format: 'A4', printBackground: true, margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' }, path: root + '/' + name + '.pdf' });
    await p.close();
  }
  await b.close();
})();
