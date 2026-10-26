// Prüft die Fragenbank des Kahoot-Quiz (spiele/kahoot-data.js):
//   node tools/test-kahoot/check.js
// - jeder Fakt wird von mindestens einer Frage abgedeckt
// - jede Frage verweist nur auf existierende Fakten/Themen
// - MC: 3 verschiedene falsche Antworten, richtige Antwort nicht darunter
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const code = fs.readFileSync(path.join(__dirname, "../../spiele/kahoot-data.js"), "utf8");
const ctx = {};
vm.createContext(ctx);
vm.runInContext(code + "\nthis.out = { BERN_THEMEN, BERN_FAKTEN, BERN_FRAGEN };", ctx);
const { BERN_THEMEN, BERN_FAKTEN, BERN_FRAGEN } = ctx.out;

const fehler = [];
const faktenIds = new Set(BERN_FAKTEN.map((f) => f.id));
if (faktenIds.size !== BERN_FAKTEN.length) fehler.push("Doppelte Fakt-IDs");
const abgedeckt = new Set();

BERN_FRAGEN.forEach((q, i) => {
  const name = `Frage ${i + 1} («${q.q.slice(0, 50)}…»)`;
  if (!BERN_THEMEN[q.t]) fehler.push(`${name}: unbekanntes Thema ${q.t}`);
  if (!q.info) fehler.push(`${name}: info fehlt`);
  if (!q.f || !q.f.length) fehler.push(`${name}: keine Fakten verlinkt`);
  (q.f || []).forEach((id) => {
    if (!faktenIds.has(id)) fehler.push(`${name}: unbekannter Fakt ${id}`);
    abgedeckt.add(id);
  });
  if (q.typ === "mc") {
    const alle = [q.a, ...q.falsch];
    if (q.falsch.length !== 3) fehler.push(`${name}: braucht genau 3 falsche Antworten`);
    if (new Set(alle).size !== alle.length) fehler.push(`${name}: doppelte Antworten`);
  } else if (q.typ === "tf") {
    if (typeof q.wahr !== "boolean") fehler.push(`${name}: wahr muss boolean sein`);
  } else fehler.push(`${name}: unbekannter Typ`);
});

const fehlend = BERN_FAKTEN.filter((f) => !abgedeckt.has(f.id));
fehlend.forEach((f) => fehler.push(`Fakt ohne Frage: ${f.id} – ${f.text}`));

console.log(`${BERN_FAKTEN.length} Fakten, ${BERN_FRAGEN.length} Fragen, ${abgedeckt.size} Fakten abgedeckt.`);
if (fehler.length) { console.error("FEHLER:\n- " + fehler.join("\n- ")); process.exit(1); }
console.log("OK: alle Fakten kommen vor.");
