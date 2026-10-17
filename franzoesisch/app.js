// franzoesisch/app.js — Übungs-Engine für das Fach Französisch: Themenauswahl,
// Theorie-Anzeige, Multiple-Choice-Quiz und Fortschritt in localStorage
// (Fortschritt wird direkt auf der Übersichtsseite "intro" angezeigt).
// Struktur bewusst analog zu ../app.js (NMG), aber ohne Karten/Leaflet —
// reiner Text-Quiz-Flow.

const STORAGE_KEY = "franzoesischLernapp.fortschritt.v1";

function leererFortschritt() {
  const f = {};
  FRANZOESISCH_THEMEN.forEach((t) => { f[t.id] = { richtig: 0, gesamt: 0 }; });
  return f;
}

function fortschrittLaden() {
  const basis = leererFortschritt();
  try {
    const roh = localStorage.getItem(STORAGE_KEY);
    if (!roh) return basis;
    const geladen = JSON.parse(roh);
    FRANZOESISCH_THEMEN.forEach((t) => {
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
};

function zufallsElement(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}

// Antwortreihenfolge pro Aufgabe zufällig mischen. Ohne das stünde die
// Lösung viel zu oft an erster Stelle (in den Rohdaten bei ~60% der
// Aufgaben) und liesse sich erraten, ohne nachzudenken.
// Ausnahme: reine Zahlenoptionen bleiben sortiert.
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

function renderThemenBar() {
  el.themaBar.innerHTML = "";
  FRANZOESISCH_THEMEN.forEach((thema) => {
    const btn = document.createElement("button");
    btn.className = "thema-tile";
    btn.dataset.id = thema.id;
    btn.innerHTML = `<span class="thema-tile-icon">${thema.icon}</span><span>${thema.name}</span>`;
    btn.addEventListener("click", () => waehleThema(thema.id));
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
  state.thema = FRANZOESISCH_THEMEN.find((t) => t.id === id);
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
  state.aufgabe = mischeOptionen(zufallsElement(state.thema.aufgaben));
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
  FRANZOESISCH_THEMEN.forEach((thema) => {
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

el.theorieStartBtn.addEventListener("click", starteUebung);
el.theorieZurueck.addEventListener("click", () => { state.thema = null; zeigePanel("intro"); });
el.uebungZurueck.addEventListener("click", () => { renderTheorie(); zeigePanel("theorie"); });
el.weiterBtn.addEventListener("click", naechsteFrage);
el.resetBtn.addEventListener("click", fortschrittZuruecksetzen);

renderThemenBar();
zeigePanel("intro");
