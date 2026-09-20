// deutsch/app.js — Übungs-Engine für das Fach Deutsch: Themenauswahl,
// Theorie-Anzeige, Multiple-Choice-Quiz und Fortschritt in localStorage
// (Fortschritt wird direkt auf der Übersichtsseite "intro" angezeigt).
// Struktur bewusst analog zu ../app.js (NMG), aber ohne Karten/Leaflet —
// reiner Text-Quiz-Flow.

const STORAGE_KEY = "deutschLernapp.fortschritt.v1";

function leererFortschritt() {
  const f = {};
  DEUTSCH_THEMEN.forEach((t) => { f[t.id] = { richtig: 0, gesamt: 0 }; });
  return f;
}

function fortschrittLaden() {
  const basis = leererFortschritt();
  try {
    const roh = localStorage.getItem(STORAGE_KEY);
    if (!roh) return basis;
    const geladen = JSON.parse(roh);
    DEUTSCH_THEMEN.forEach((t) => {
      if (geladen[t.id]) basis[t.id] = geladen[t.id];
    });
  } catch (e) {
    // localStorage evtl. blockiert (privater Modus) — dann läuft die App
    // einfach ohne gespeicherten Fortschritt weiter.
  }
  return basis;
}

function fortschrittSpeichern() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.fortschritt));
  } catch (e) {
    // kein Absturz, wenn Speichern nicht möglich ist
  }
}

const state = {
  thema: null,
  aufgabe: null,
  sessionRichtig: 0,
  sessionGesamt: 0,
  fortschritt: fortschrittLaden(),
};

const el = {
  themenauswahl: document.getElementById("themenauswahl"),
  themaBar: document.getElementById("thema-bar"),
  panelIntro: document.getElementById("panel-intro"),
  panelTheorie: document.getElementById("panel-theorie"),
  panelUebung: document.getElementById("panel-uebung"),
  theorieTitel: document.getElementById("theorie-titel"),
  theorieText: document.getElementById("theorie-text"),
  theorieStartBtn: document.getElementById("theorie-start-btn"),
  theorieZurueck: document.getElementById("theorie-zurueck"),
  uebungZurueck: document.getElementById("uebung-zurueck"),
  uebungThemaName: document.getElementById("uebung-thema-name"),
  punktestand: document.getElementById("punktestand"),
  frageText: document.getElementById("frage-text"),
  multipleChoice: document.getElementById("multiple-choice"),
  feedback: document.getElementById("feedback"),
  weiterBtn: document.getElementById("weiter-btn"),
  fortschrittListe: document.getElementById("fortschritt-liste"),
  gesamtPunkte: document.getElementById("gesamt-punkte"),
  resetBtn: document.getElementById("reset-btn"),
  spielStartBtn: document.getElementById("spiel-start-btn"),
  panelSpiel: document.getElementById("panel-spiel"),
  spielZurueck: document.getElementById("spiel-zurueck"),
  spielSetup: document.getElementById("spiel-setup"),
  spielAnzahl2: document.getElementById("spiel-anzahl-2"),
  spielAnzahl3: document.getElementById("spiel-anzahl-3"),
  spielerNamenWahl: document.getElementById("spieler-namen-wahl"),
  spielScoreboard: document.getElementById("spiel-scoreboard"),
  spielRunde: document.getElementById("spiel-runde"),
  spielRundeText: document.getElementById("spiel-runde-text"),
  spielRundeInhalt: document.getElementById("spiel-runde-inhalt"),
};

// Alle Aufgaben aus allen Themen gemischt gepoolt — für das
// Schere-Stein-Papier-Quiz (Verlierer:in bekommt eine Frage aus dem
// ganzen Heft, nicht nur aus einem Thema).
const ALLE_AUFGABEN = DEUTSCH_THEMEN.flatMap((thema) =>
  thema.aufgaben.map((a) => ({ ...a, themaIcon: thema.icon, themaName: thema.name }))
);

const SPIEL_NAMEN_VORSCHLAEGE = ["Kind", "Mama", "Papa", "Spieler"];
const RPS_OPTIONEN = [
  { wahl: "stein", icon: "✊", label: "Stein" },
  { wahl: "papier", icon: "✋", label: "Papier" },
  { wahl: "schere", icon: "✌️", label: "Schere" },
];
const RPS_SCHLAEGT = { stein: "schere", schere: "papier", papier: "stein" };

const spiel = {
  spieler: [], // [{ name, verloren, gerettet }]
  runde: 0,
  wahlIndex: 0,
  wahlen: [], // [{ spielerIndex, wahl }] der aktuellen Runde
  verliererQueue: [], // Spieler-Indizes, die noch eine Frage beantworten müssen
  aktuelleFrage: null,
};

function zufallsElement(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}

function renderThemenBar() {
  el.themaBar.innerHTML = "";
  DEUTSCH_THEMEN.forEach((thema) => {
    const btn = document.createElement("button");
    btn.className = "thema-tile";
    btn.dataset.id = thema.id;
    btn.innerHTML = `<span class="thema-tile-icon">${thema.icon}</span><span>${thema.name}</span>`;
    btn.addEventListener("click", () => waehleThema(thema.id));
    el.themaBar.appendChild(btn);
  });
  DEUTSCH_KOMMENDE_THEMEN.forEach((thema) => {
    const btn = document.createElement("button");
    btn.className = "thema-tile bald";
    btn.disabled = true;
    btn.title = "Demnächst verfügbar";
    btn.innerHTML = `<span class="thema-tile-icon">${thema.icon}</span><span>${thema.name}</span><span class="thema-tile-bald">bald</span>`;
    el.themaBar.appendChild(btn);
  });
}

function aktualisierteThemaBarAktiv() {
  Array.from(el.themaBar.children).forEach((btn) => {
    btn.classList.toggle("aktiv", !!state.thema && btn.dataset.id === state.thema.id);
  });
}

function zeigePanel(name) {
  el.panelIntro.classList.toggle("hidden", name !== "intro");
  el.panelTheorie.classList.toggle("hidden", name !== "theorie");
  el.panelUebung.classList.toggle("hidden", name !== "uebung");
  el.panelSpiel.classList.toggle("hidden", name !== "spiel");
  // Themenauswahl-Kachelraster nimmt viel Platz weg — sobald ein Thema
  // offen ist, einklappen. Die "← Zurück"-Buttons in jedem Panel führen
  // zurück zu "intro", wo das Raster wieder erscheint.
  el.themenauswahl.classList.toggle("eingeklappt", name !== "intro");
  // Die Übersichtsseite zeigt den Fortschritt direkt — bei jeder Rückkehr
  // dorthin neu rendern, damit er aktuell bleibt.
  if (name === "intro") renderFortschritt();
  aktualisierteThemaBarAktiv();
}

function waehleThema(id) {
  state.thema = DEUTSCH_THEMEN.find((t) => t.id === id);
  state.sessionRichtig = 0;
  state.sessionGesamt = 0;
  renderTheorie();
  zeigePanel("theorie");
}

function renderTheorie() {
  el.theorieTitel.textContent = `${state.thema.icon} ${state.thema.name}`;
  el.theorieText.innerHTML = state.thema.theorie;
}

function starteUebung() {
  el.uebungThemaName.textContent = `${state.thema.icon} ${state.thema.name}`;
  zeigePanel("uebung");
  naechsteFrage();
}

function naechsteFrage() {
  state.aufgabe = zufallsElement(state.thema.aufgaben);
  el.frageText.textContent = state.aufgabe.frage;
  el.feedback.textContent = "";
  el.feedback.className = "feedback";
  el.weiterBtn.classList.add("hidden");
  el.punktestand.textContent = `✅ ${state.sessionRichtig} / ${state.sessionGesamt}`;

  el.multipleChoice.innerHTML = "";
  state.aufgabe.optionen.forEach((optionText, i) => {
    const btn = document.createElement("button");
    btn.className = "mc-option";
    btn.textContent = optionText;
    btn.addEventListener("click", () => beantworteMultipleChoice(i, btn));
    el.multipleChoice.appendChild(btn);
  });
}

function verbucheAntwort(korrekt) {
  state.sessionGesamt++;
  if (korrekt) state.sessionRichtig++;
  const stat = state.fortschritt[state.thema.id];
  stat.gesamt++;
  if (korrekt) stat.richtig++;
  fortschrittSpeichern();
  el.punktestand.textContent = `✅ ${state.sessionRichtig} / ${state.sessionGesamt}`;
  el.weiterBtn.classList.remove("hidden");
}

function zeigeFeedback(korrekt, richtigeAntwort) {
  if (korrekt) {
    el.feedback.textContent = "✅ Richtig!";
    el.feedback.className = "feedback richtig";
  } else {
    el.feedback.textContent = `❌ Leider falsch. Richtig wäre: ${richtigeAntwort}`;
    el.feedback.className = "feedback falsch";
  }
}

function beantworteMultipleChoice(gewaehlt, button) {
  const korrekt = gewaehlt === state.aufgabe.richtig;
  Array.from(el.multipleChoice.children).forEach((btn, i) => {
    btn.disabled = true;
    if (i === state.aufgabe.richtig) btn.classList.add("richtig");
    else if (i === gewaehlt) btn.classList.add("falsch");
  });
  verbucheAntwort(korrekt);
  zeigeFeedback(korrekt, state.aufgabe.optionen[state.aufgabe.richtig]);
}

function renderFortschritt() {
  el.fortschrittListe.innerHTML = "";
  let gesamtpunkte = 0;
  DEUTSCH_THEMEN.forEach((thema) => {
    const stat = state.fortschritt[thema.id] || { richtig: 0, gesamt: 0 };
    const prozent = stat.gesamt ? Math.round((stat.richtig / stat.gesamt) * 100) : 0;
    gesamtpunkte += stat.richtig * 10;
    const zeile = document.createElement("div");
    zeile.className = "fortschritt-zeile";
    zeile.innerHTML = `
      <span class="name">${thema.icon} ${thema.name}</span>
      <div class="fortschritt-balken-hintergrund">
        <div class="fortschritt-balken" style="width:${prozent}%"></div>
      </div>
      <span class="fortschritt-prozent">${prozent}%<br><small>(${stat.gesamt}/${thema.aufgaben.length})</small></span>
    `;
    el.fortschrittListe.appendChild(zeile);
  });
  el.gesamtPunkte.textContent = gesamtpunkte;
}

function fortschrittZuruecksetzen() {
  if (!confirm("Wirklich den ganzen Fortschritt löschen?")) return;
  state.fortschritt = leererFortschritt();
  fortschrittSpeichern();
  renderFortschritt();
}

// ============================================================
// ⚔️ Schere-Stein-Papier-Quiz — Familienspiel für 2–3 Spieler:innen
// am selben Gerät. Jede Runde wählt reihum jede:r geheim eine Waffe
// (Gerät weiterreichen), dann wird gemeinsam aufgedeckt. Wer verliert,
// beantwortet eine zufällige Frage aus dem gesamten Aufgabenpool aller
// 14 Themen.
// ============================================================

function spielStarten() {
  spiel.spieler = [];
  spiel.runde = 0;
  el.spielSetup.classList.remove("hidden");
  el.spielScoreboard.classList.add("hidden");
  el.spielRunde.classList.add("hidden");
  el.spielerNamenWahl.innerHTML = "";
  zeigePanel("spiel");
}

function waehleSpieleranzahl(anzahl) {
  spiel.spieler = Array.from({ length: anzahl }, (_, i) => ({
    name: `Spieler ${i + 1}`,
    verloren: 0,
    gerettet: 0,
  }));
  renderSpielerNamenWahl();
}

function renderSpielerNamenWahl() {
  el.spielerNamenWahl.innerHTML = "";
  spiel.spieler.forEach((spielerObj, i) => {
    const zeile = document.createElement("div");
    zeile.className = "spieler-namen-zeile";
    const label = document.createElement("span");
    label.className = "spieler-namen-label";
    label.textContent = `Spieler ${i + 1}:`;
    zeile.appendChild(label);
    const chipReihe = document.createElement("div");
    chipReihe.className = "spieler-namen-chips";
    SPIEL_NAMEN_VORSCHLAEGE.forEach((vorschlag) => {
      const chip = document.createElement("button");
      chip.className = "namen-chip";
      chip.textContent = vorschlag === "Spieler" ? `Spieler ${i + 1}` : vorschlag;
      chip.classList.toggle("aktiv", spielerObj.name === chip.textContent);
      chip.addEventListener("click", () => {
        spielerObj.name = chip.textContent;
        renderSpielerNamenWahl();
      });
      chipReihe.appendChild(chip);
    });
    zeile.appendChild(chipReihe);
    el.spielerNamenWahl.appendChild(zeile);
  });
  const losBtn = document.createElement("button");
  losBtn.className = "big-btn";
  losBtn.textContent = "Los geht's ▶";
  losBtn.addEventListener("click", spielLos);
  el.spielerNamenWahl.appendChild(losBtn);
}

function spielLos() {
  el.spielSetup.classList.add("hidden");
  el.spielScoreboard.classList.remove("hidden");
  el.spielRunde.classList.remove("hidden");
  starteSpielRunde();
}

function renderScoreboard() {
  el.spielScoreboard.innerHTML = spiel.spieler
    .map((s) => `<span class="scoreboard-eintrag">👤 <strong>${s.name}</strong> · verloren: ${s.verloren} · gerettet: ${s.gerettet}</span>`)
    .join("");
}

function starteSpielRunde() {
  spiel.runde++;
  spiel.wahlIndex = 0;
  spiel.wahlen = [];
  spiel.verliererQueue = [];
  renderScoreboard();
  el.spielRundeText.textContent = `Runde ${spiel.runde}`;
  renderRundeWaehlen();
}

function renderRundeWaehlen() {
  const spielerObj = spiel.spieler[spiel.wahlIndex];
  el.spielRundeInhalt.innerHTML = "";

  const hinweis = document.createElement("p");
  hinweis.className = "rps-wer-dran";
  hinweis.textContent = `📱 Gerät an ${spielerObj.name} weitergeben`;
  el.spielRundeInhalt.appendChild(hinweis);

  const unterHinweis = document.createElement("p");
  unterHinweis.className = "intro-text";
  unterHinweis.textContent = `${spielerObj.name}, wähle deine Waffe — die anderen schauen weg!`;
  el.spielRundeInhalt.appendChild(unterHinweis);

  const grid = document.createElement("div");
  grid.className = "rps-wahl-grid";
  RPS_OPTIONEN.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "rps-option";
    btn.innerHTML = `<span class="rps-option-icon">${opt.icon}</span><span>${opt.label}</span>`;
    btn.addEventListener("click", () => waehleRps(opt.wahl));
    grid.appendChild(btn);
  });
  el.spielRundeInhalt.appendChild(grid);
}

function waehleRps(wahl) {
  spiel.wahlen.push({ spielerIndex: spiel.wahlIndex, wahl });
  const spielerObj = spiel.spieler[spiel.wahlIndex];
  el.spielRundeInhalt.innerHTML = `
    <p class="rps-wer-dran">✅ ${spielerObj.name}s Wahl ist gespeichert!</p>
    <button class="big-btn" id="rps-weiter-spieler-btn">Weiter →</button>
  `;
  document.getElementById("rps-weiter-spieler-btn").addEventListener("click", weiterZumNaechstenSpieler);
}

function weiterZumNaechstenSpieler() {
  spiel.wahlIndex++;
  if (spiel.wahlIndex < spiel.spieler.length) {
    renderRundeWaehlen();
  } else {
    renderRundeAufloesenBereit();
  }
}

function renderRundeAufloesenBereit() {
  el.spielRundeInhalt.innerHTML = `
    <p class="intro-text">Alle haben gewählt — bereit?</p>
    <button class="big-btn" id="rps-aufloesen-btn">🎬 Auflösen!</button>
  `;
  document.getElementById("rps-aufloesen-btn").addEventListener("click", rundeAufloesen);
}

function rundeAufloesen() {
  const grid = document.createElement("div");
  grid.className = "rps-reveal-grid";
  spiel.wahlen.forEach((w) => {
    const karte = document.createElement("div");
    karte.className = "rps-reveal-karte verdeckt";
    karte.dataset.spielerIndex = w.spielerIndex;
    karte.innerHTML = `<span class="rps-reveal-icon">❓</span><span class="rps-reveal-name">${spiel.spieler[w.spielerIndex].name}</span>`;
    grid.appendChild(karte);
  });
  el.spielRundeInhalt.innerHTML = "";
  el.spielRundeInhalt.appendChild(grid);

  // Spannungsaufbau: jede Wahl wird mit kleiner Verzögerung nacheinander
  // aufgedeckt statt alle auf einmal.
  spiel.wahlen.forEach((w, i) => {
    setTimeout(() => {
      const karte = grid.querySelector(`[data-spieler-index="${w.spielerIndex}"]`);
      const opt = RPS_OPTIONEN.find((o) => o.wahl === w.wahl);
      karte.classList.remove("verdeckt");
      karte.classList.add("aufgedeckt");
      karte.querySelector(".rps-reveal-icon").textContent = opt.icon;
    }, (i + 1) * 500);
  });

  setTimeout(() => zeigeRundeErgebnis(), spiel.wahlen.length * 500 + 400);
}

function ermittleRpsVerlierer() {
  const distinct = [...new Set(spiel.wahlen.map((w) => w.wahl))];
  if (distinct.length === 1) return null; // alle gleich
  if (distinct.length === spiel.wahlen.length && spiel.wahlen.length === 3) return null; // alle 3 verschieden
  const [a, b] = distinct;
  const verliererWahl = RPS_SCHLAEGT[a] === b ? b : a;
  return spiel.wahlen.filter((w) => w.wahl === verliererWahl);
}

function zeigeRundeErgebnis() {
  const verliererListe = ermittleRpsVerlierer();
  const ergebnisText = document.createElement("p");
  ergebnisText.className = "rps-ergebnis-text";

  if (!verliererListe) {
    ergebnisText.innerHTML = "⚔️ <strong>Unentschieden!</strong> Nochmal!";
    el.spielRundeInhalt.appendChild(ergebnisText);
    const nochmalBtn = document.createElement("button");
    nochmalBtn.className = "big-btn";
    nochmalBtn.textContent = "Nochmal ▶";
    nochmalBtn.addEventListener("click", starteSpielRunde);
    el.spielRundeInhalt.appendChild(nochmalBtn);
    return;
  }

  verliererListe.forEach((w) => { spiel.spieler[w.spielerIndex].verloren++; });
  renderScoreboard();

  const namen = verliererListe.map((w) => spiel.spieler[w.spielerIndex].name).join(" und ");
  const mehrzahl = verliererListe.length > 1;
  ergebnisText.innerHTML = `💥 <strong>${namen}</strong> ${mehrzahl ? "verlieren und müssen" : "verliert und muss"} jetzt eine Frage beantworten!`;
  el.spielRundeInhalt.appendChild(ergebnisText);

  const weiterBtn = document.createElement("button");
  weiterBtn.className = "big-btn";
  weiterBtn.textContent = "Zur Frage ▶";
  weiterBtn.addEventListener("click", () => {
    spiel.verliererQueue = verliererListe.map((w) => w.spielerIndex);
    naechsteSpielFrage();
  });
  el.spielRundeInhalt.appendChild(weiterBtn);
}

function naechsteSpielFrage() {
  const spielerIndex = spiel.verliererQueue.shift();
  spiel.aktuelleFrage = { spielerIndex, aufgabe: zufallsElement(ALLE_AUFGABEN) };
  renderSpielFrage();
}

function renderSpielFrage() {
  const { spielerIndex, aufgabe } = spiel.aktuelleFrage;
  const spielerObj = spiel.spieler[spielerIndex];
  el.spielRundeInhalt.innerHTML = "";

  const wer = document.createElement("p");
  wer.className = "rps-wer-dran";
  wer.textContent = `❗ ${spielerObj.name} ist dran!`;
  el.spielRundeInhalt.appendChild(wer);

  const thema = document.createElement("p");
  thema.className = "spiel-frage-thema";
  thema.textContent = `${aufgabe.themaIcon} ${aufgabe.themaName}`;
  el.spielRundeInhalt.appendChild(thema);

  const frage = document.createElement("p");
  frage.className = "frage-text";
  frage.textContent = aufgabe.frage;
  el.spielRundeInhalt.appendChild(frage);

  const grid = document.createElement("div");
  grid.className = "mc-grid";
  aufgabe.optionen.forEach((optionText, i) => {
    const btn = document.createElement("button");
    btn.className = "mc-option";
    btn.textContent = optionText;
    btn.addEventListener("click", () => beantworteSpielFrage(i, grid));
    grid.appendChild(btn);
  });
  el.spielRundeInhalt.appendChild(grid);

  const feedback = document.createElement("p");
  feedback.className = "feedback";
  feedback.id = "spiel-frage-feedback";
  el.spielRundeInhalt.appendChild(feedback);
}

function beantworteSpielFrage(gewaehlt, grid) {
  const { spielerIndex, aufgabe } = spiel.aktuelleFrage;
  const spielerObj = spiel.spieler[spielerIndex];
  const korrekt = gewaehlt === aufgabe.richtig;
  Array.from(grid.children).forEach((btn, i) => {
    btn.disabled = true;
    if (i === aufgabe.richtig) btn.classList.add("richtig");
    else if (i === gewaehlt) btn.classList.add("falsch");
  });

  const feedback = document.getElementById("spiel-frage-feedback");
  if (korrekt) {
    spielerObj.gerettet++;
    feedback.textContent = "🎉 Gerettet! Richtig beantwortet.";
    feedback.className = "feedback richtig";
  } else {
    feedback.textContent = `😅 Pech gehabt! Richtig wäre: ${aufgabe.optionen[aufgabe.richtig]}`;
    feedback.className = "feedback falsch";
  }
  renderScoreboard();

  const weiterBtn = document.createElement("button");
  weiterBtn.className = "big-btn";
  weiterBtn.textContent = spiel.verliererQueue.length > 0 ? "Nächste Frage ▶" : "Nächste Runde ▶";
  weiterBtn.addEventListener("click", () => {
    if (spiel.verliererQueue.length > 0) naechsteSpielFrage();
    else starteSpielRunde();
  });
  el.spielRundeInhalt.appendChild(weiterBtn);
}

renderThemenBar();
zeigePanel("intro");

el.theorieStartBtn.addEventListener("click", starteUebung);
el.theorieZurueck.addEventListener("click", () => { state.thema = null; zeigePanel("intro"); });
el.uebungZurueck.addEventListener("click", () => { renderTheorie(); zeigePanel("theorie"); });
el.weiterBtn.addEventListener("click", naechsteFrage);
el.resetBtn.addEventListener("click", fortschrittZuruecksetzen);

el.spielStartBtn.addEventListener("click", spielStarten);
el.spielZurueck.addEventListener("click", () => zeigePanel("intro"));
el.spielAnzahl2.addEventListener("click", () => waehleSpieleranzahl(2));
el.spielAnzahl3.addEventListener("click", () => waehleSpieleranzahl(3));
