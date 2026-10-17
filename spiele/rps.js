// spiele/rps.js — Schere-Stein-Papier-Quiz. Die Fragen kommen aus den
// Deutsch-Themen (../deutsch/data.js, siehe DEUTSCH_THEMEN).

const el = {
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

// Antwortreihenfolge pro Aufgabe zufällig mischen. Ohne das stünde die
// Lösung viel zu oft an erster Stelle (in den Rohdaten bei ~60% der
// Aufgaben) und liesse sich erraten, ohne nachzudenken.
// Ausnahme: reine Zahlenoptionen (z.B. Silbenanzahl) bleiben sortiert.
function mischeOptionen(aufgabe) {
  if (aufgabe.optionen.every((o) => /^\d+$/.test(o))) return aufgabe;
  const paare = aufgabe.optionen.map((text, i) => ({ text, istRichtig: i === aufgabe.richtig }));
  for (let i = paare.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [paare[i], paare[j]] = [paare[j], paare[i]];
  }
  return {
    ...aufgabe,
    optionen: paare.map((p) => p.text),
    richtig: paare.findIndex((p) => p.istRichtig),
  };
}

// ============================================================
// ⚔️ Schere-Stein-Papier-Quiz — Familienspiel für 2–3 Spieler:innen
// am selben Gerät. Jede Runde wählt reihum jede:r geheim eine Waffe
// (Gerät weiterreichen), dann wird gemeinsam aufgedeckt. Wer verliert,
// beantwortet eine zufällige Frage aus dem gesamten Aufgabenpool aller
// Deutsch-Themen.
// ============================================================

function spielStarten() {
  spiel.spieler = [];
  spiel.runde = 0;
  el.spielSetup.classList.remove("hidden");
  el.spielScoreboard.classList.add("hidden");
  el.spielRunde.classList.add("hidden");
  el.spielerNamenWahl.innerHTML = "";
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
  spiel.aktuelleFrage = { spielerIndex, aufgabe: mischeOptionen(zufallsElement(ALLE_AUFGABEN)) };
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

spielStarten();
el.spielAnzahl2.addEventListener("click", () => waehleSpieleranzahl(2));
el.spielAnzahl3.addEventListener("click", () => waehleSpieleranzahl(3));
