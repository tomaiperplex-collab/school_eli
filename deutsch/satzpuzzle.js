// deutsch/satzpuzzle.js — Satzpuzzle: Sätze aus Satzgliedern bauen (Karten
// antippen) und Satzglieder zweier Sätze farbig trennen. Daten:
// SATZPUZZLE_SAETZE / SATZPUZZLE_PAARE in data.js. Verbucht wird über
// app.js (verbucheBaumusterAntwort, starteMcUebung).

const SP_FARBEN = [
  { klasse: "", name: "grau" },
  { klasse: "f1", name: "blau" },
  { klasse: "f2", name: "orange" },
];
const SP_ANZAHL = 8;

const sp = { folge: [], index: 0, richtig: 0, aktuell: null, gewaehlt: [], farben: [], karten: [], ersterVersuch: true };

function spMischen(liste) {
  const k = liste.slice();
  for (let i = k.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [k[i], k[j]] = [k[j], k[i]];
  }
  return k;
}

function spGross(text) { return text.charAt(0).toUpperCase() + text.slice(1); }

function spSatzText(karten) {
  return spGross(karten.join(" ")) + ".";
}

function satzpuzzleStart() {
  // Mischung aus Farb-Aufgaben (zwei Sätze trennen) und Satz-bilden-Aufgaben.
  const paare = spMischen(SATZPUZZLE_PAARE).slice(0, 3).map((p) => ({ art: "farben", paar: p }));
  const bilden = spMischen(SATZPUZZLE_SAETZE.map((_, i) => i)).slice(0, SP_ANZAHL - paare.length).map((i) => ({ art: "bilden", satz: i }));
  const folge = [];
  while (paare.length || bilden.length) {
    if (bilden.length) folge.push(bilden.shift());
    if (paare.length && (folge.length % 2 === 0 || !bilden.length)) folge.push(paare.shift());
    if (bilden.length) folge.push(bilden.shift());
  }
  sp.folge = folge;
  sp.index = 0;
  sp.richtig = 0;
  spNaechste();
}

function spNaechste() {
  const a = sp.folge[sp.index];
  sp.aktuell = a;
  sp.ersterVersuch = true;
  sp.gewaehlt = [];
  if (a.art === "bilden") {
    const satz = SATZPUZZLE_SAETZE[a.satz];
    sp.karten = spMischen(satz.karten.map((text, id) => ({ id, text })));
  } else {
    const [x, y] = a.paar;
    sp.karten = spMischen(
      SATZPUZZLE_SAETZE[x].karten.map((text) => ({ text, satz: 0 }))
        .concat(SATZPUZZLE_SAETZE[y].karten.map((text) => ({ text, satz: 1 })))
    ).map((k, id) => ({ ...k, id }));
    sp.farben = sp.karten.map(() => 0);
  }
  spRender();
}

function spRahmen(inhalt) {
  const box = document.getElementById("satzpuzzle-inhalt");
  box.innerHTML = `
    <h2>${state.thema.icon} ${state.thema.name}</h2>
    <details class="bm-theorie-nochmal">
      <summary>📖 Theorie nochmal ansehen</summary>
      <div class="theorie-text">${state.thema.theorie}</div>
    </details>
    <p class="bm-zaehler">Aufgabe ${sp.index + 1} von ${sp.folge.length} · ✅ ${sp.richtig}</p>
    ${inhalt}
    <p id="sp-feedback" class="feedback" aria-live="polite"></p>
    <div class="bm-knoepfe" id="sp-knoepfe"></div>`;
  return box;
}

function spKnopf(text, klasse, fn) {
  const b = document.createElement("button");
  b.className = `big-btn ${klasse || ""}`;
  b.textContent = text;
  b.addEventListener("click", fn);
  document.getElementById("sp-knoepfe").appendChild(b);
}

function spRender() {
  if (sp.aktuell.art === "bilden") spRenderBilden();
  else spRenderFarben();
}

// --- Satz bilden ---
function spRenderBilden() {
  const satz = SATZPUZZLE_SAETZE[sp.aktuell.satz];
  const belegt = new Set(sp.gewaehlt);
  const gebaut = sp.gewaehlt.map((id) => sp.karten.find((k) => k.id === id).text);
  const box = spRahmen(`
    <p class="frage-text">Bilde mit den Satzgliedern einen korrekten Satz. Verwende alle Satzglieder einmal.</p>
    <div class="sp-satz" id="sp-satz">${gebaut.length ? gebaut.map((t, i) => `<span class="sp-karte gebaut" data-pos="${i}">${i === 0 ? spGross(t) : t}</span>`).join("") : '<span class="sp-leer">Tippe die Karten in der richtigen Reihenfolge an …</span>'}</div>
    <div class="bm-ablage" id="sp-ablage">${sp.karten.filter((k) => !belegt.has(k.id)).map((k) => `<span class="sp-karte" data-id="${k.id}">${k.text}</span>`).join("")}</div>`);
  spKnopf("Prüfen ✔", "", spPruefenBilden);
  spKnopf("Zurücksetzen", "zweit", () => { sp.gewaehlt = []; spRender(); });
  box.querySelectorAll(".sp-karte[data-id]").forEach((el) =>
    el.addEventListener("click", () => { sp.gewaehlt.push(Number(el.dataset.id)); spRender(); }));
  box.querySelectorAll(".sp-karte[data-pos]").forEach((el) =>
    el.addEventListener("click", () => { sp.gewaehlt.splice(Number(el.dataset.pos), 1); spRender(); }));
}

function spPruefenBilden() {
  const satz = SATZPUZZLE_SAETZE[sp.aktuell.satz];
  const gebaut = sp.gewaehlt.map((id) => sp.karten.find((k) => k.id === id).text);
  const fb = document.getElementById("sp-feedback");
  let fehler = "";
  if (gebaut.length < satz.karten.length) fehler = "Es fehlen noch Satzglieder.";
  else if (gebaut[1] !== satz.verb) fehler = `Das Verb „${satz.verb}“ steht im Aussagesatz an 2. Stelle.`;
  else if (satz.partikel && gebaut[gebaut.length - 1] !== satz.partikel) fehler = `„${satz.partikel}“ gehört zum Verb und steht am Satzende.`;
  const korrekt = !fehler;
  if (sp.ersterVersuch) {
    sp.ersterVersuch = false;
    verbucheBaumusterAntwort(korrekt);
    if (korrekt) sp.richtig++;
  }
  if (!korrekt) {
    fb.textContent = `❌ ${fehler}`;
    fb.className = "feedback falsch";
    return;
  }
  fb.textContent = `✅ Richtig! ${spSatzText(gebaut)}`;
  fb.className = "feedback richtig";
  document.getElementById("sp-knoepfe").innerHTML = "";
  spKnopf("🔀 Verschiebeprobe", "zweit", () => spVerschiebeprobe(gebaut, satz));
  spWeiterKnopf();
}

function spWeiterKnopf() {
  const letzte = sp.index === sp.folge.length - 1;
  spKnopf(letzte ? "Fertig ▶" : "Weiter ▶", "", () => {
    if (letzte) spAbschluss();
    else { sp.index++; spNaechste(); }
  });
}

// Verschiebeprobe: ein Satzglied nach vorn schieben, das Verb bleibt an 2. Stelle.
function spVerschiebeprobe(gebaut, satz) {
  const zusatz = document.getElementById("sp-feedback");
  const glieder = gebaut.filter((t) => t !== satz.verb && t !== satz.partikel);
  zusatz.className = "feedback";
  zusatz.innerHTML = `Tippe ein Satzglied an — es wandert nach vorn:<div class="sp-verschiebe">${glieder.map((g) => `<span class="sp-karte" data-g="${g}">${g}</span>`).join("")}</div><div id="sp-neu" class="sp-neu"></div>`;
  zusatz.querySelectorAll(".sp-karte").forEach((el) => el.addEventListener("click", () => {
    const g = el.dataset.g;
    const rest = glieder.filter((x) => x !== g);
    const neu = [g, satz.verb, ...rest].concat(satz.partikel ? [satz.partikel] : []);
    document.getElementById("sp-neu").textContent = spSatzText(neu);
  }));
}

// --- Zwei Sätze farbig trennen ---
function spRenderFarben() {
  const box = spRahmen(`
    <p class="frage-text">Markiere mit gleicher Farbe alle Satzglieder, die einen Satz bilden. Tippe eine Karte mehrmals an, um die Farbe zu wechseln.</p>
    <div class="sp-farbkarten">${sp.karten.map((k, i) => `<span class="sp-karte ${SP_FARBEN[sp.farben[i]].klasse}" data-i="${i}">${k.text}</span>`).join("")}</div>`);
  spKnopf("Prüfen ✔", "", spPruefenFarben);
  box.querySelectorAll(".sp-karte[data-i]").forEach((el) =>
    el.addEventListener("click", () => {
      const i = Number(el.dataset.i);
      sp.farben[i] = (sp.farben[i] + 1) % SP_FARBEN.length;
      el.className = `sp-karte ${SP_FARBEN[sp.farben[i]].klasse}`;
    }));
}

function spPruefenFarben() {
  const fb = document.getElementById("sp-feedback");
  const [x, y] = sp.aktuell.paar;
  const gleich = sp.karten.every((k, i) => sp.farben[i] === k.satz + 1);
  const vertauscht = sp.karten.every((k, i) => sp.farben[i] === 2 - k.satz);
  const korrekt = gleich || vertauscht;
  if (sp.ersterVersuch) {
    sp.ersterVersuch = false;
    verbucheBaumusterAntwort(korrekt);
    if (korrekt) sp.richtig++;
  }
  if (!korrekt) {
    fb.textContent = "❌ Noch nicht ganz. Jede Farbe gehört zu einem Satz — jedes Satzglied hat genau eine Farbe.";
    fb.className = "feedback falsch";
    return;
  }
  const a = SATZPUZZLE_SAETZE[x], b = SATZPUZZLE_SAETZE[y];
  fb.innerHTML = `✅ Richtig!<br><small>${spSatzText([a.karten[0], a.verb, ...a.karten.filter((t) => t !== a.karten[0] && t !== a.verb)])}<br>${spSatzText([b.karten[0], b.verb, ...b.karten.filter((t) => t !== b.karten[0] && t !== b.verb)])}</small>`;
  fb.className = "feedback richtig";
  document.getElementById("sp-knoepfe").innerHTML = "";
  spWeiterKnopf();
}

function spAbschluss() {
  const box = document.getElementById("satzpuzzle-inhalt");
  box.innerHTML = `
    <h2>🎉 Satzpuzzle geschafft!</h2>
    <p class="intro-text">${sp.richtig} von ${sp.folge.length} Aufgaben gleich beim ersten Versuch richtig.</p>
    <div class="bm-knoepfe">
      <button class="big-btn" id="sp-nochmal">🔁 Nochmal üben</button>
      <button class="big-btn zweit" id="sp-mc">❓ Quiz-Fragen dazu</button>
    </div>`;
  document.getElementById("sp-nochmal").addEventListener("click", satzpuzzleStart);
  document.getElementById("sp-mc").addEventListener("click", starteMcUebung);
}
