// deutsch/app.js — Übungs-Engine für das Fach Deutsch: Themenauswahl,
// Theorie-Anzeige, Quiz (Multiple-Choice + Freitext) und Fortschritt in
// localStorage. Struktur bewusst analog zu ../app.js (NMG), aber ohne
// Karten/Leaflet — reiner Text-Quiz-Flow.

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
  themaBar: document.getElementById("thema-bar"),
  fortschrittBtn: document.getElementById("fortschritt-btn"),
  panelIntro: document.getElementById("panel-intro"),
  panelTheorie: document.getElementById("panel-theorie"),
  panelUebung: document.getElementById("panel-uebung"),
  panelFortschritt: document.getElementById("panel-fortschritt"),
  theorieTitel: document.getElementById("theorie-titel"),
  theorieText: document.getElementById("theorie-text"),
  theorieStartBtn: document.getElementById("theorie-start-btn"),
  theorieZurueck: document.getElementById("theorie-zurueck"),
  uebungZurueck: document.getElementById("uebung-zurueck"),
  uebungThemaName: document.getElementById("uebung-thema-name"),
  punktestand: document.getElementById("punktestand"),
  frageText: document.getElementById("frage-text"),
  multipleChoice: document.getElementById("multiple-choice"),
  freitextForm: document.getElementById("freitext-form"),
  freitextInput: document.getElementById("freitext-input"),
  feedback: document.getElementById("feedback"),
  weiterBtn: document.getElementById("weiter-btn"),
  fortschrittListe: document.getElementById("fortschritt-liste"),
  gesamtPunkte: document.getElementById("gesamt-punkte"),
  resetBtn: document.getElementById("reset-btn"),
  fortschrittZurueck: document.getElementById("fortschritt-zurueck"),
};

function normalisiereText(t) {
  return t.trim().toLowerCase().replace(/\s+/g, " ");
}

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
  el.fortschrittBtn.classList.toggle("aktiv", el.panelFortschritt.classList.contains("hidden") === false);
}

function zeigePanel(name) {
  el.panelIntro.classList.toggle("hidden", name !== "intro");
  el.panelTheorie.classList.toggle("hidden", name !== "theorie");
  el.panelUebung.classList.toggle("hidden", name !== "uebung");
  el.panelFortschritt.classList.toggle("hidden", name !== "fortschritt");
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

  if (state.aufgabe.typ === "mc") {
    el.multipleChoice.classList.remove("hidden");
    el.freitextForm.classList.add("hidden");
    el.multipleChoice.innerHTML = "";
    state.aufgabe.optionen.forEach((optionText, i) => {
      const btn = document.createElement("button");
      btn.className = "mc-option";
      btn.textContent = optionText;
      btn.addEventListener("click", () => beantworteMultipleChoice(i, btn));
      el.multipleChoice.appendChild(btn);
    });
  } else {
    el.multipleChoice.classList.add("hidden");
    el.freitextForm.classList.remove("hidden");
    el.freitextInput.value = "";
    el.freitextInput.disabled = false;
    el.freitextInput.focus();
  }
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

function beantworteFreitext(ev) {
  ev.preventDefault();
  const eingabe = normalisiereText(el.freitextInput.value);
  const korrekt = state.aufgabe.antworten.some((a) => normalisiereText(a) === eingabe);
  el.freitextInput.disabled = true;
  verbucheAntwort(korrekt);
  zeigeFeedback(korrekt, state.aufgabe.antworten[0]);
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
      <span class="fortschritt-prozent">${prozent}%</span>
    `;
    el.fortschrittListe.appendChild(zeile);
  });
  el.gesamtPunkte.textContent = gesamtpunkte;
}

function zeigeFortschritt() {
  renderFortschritt();
  zeigePanel("fortschritt");
}

function fortschrittZuruecksetzen() {
  if (!confirm("Wirklich den ganzen Fortschritt löschen?")) return;
  state.fortschritt = leererFortschritt();
  fortschrittSpeichern();
  renderFortschritt();
}

renderThemenBar();
zeigePanel("intro");

el.fortschrittBtn.addEventListener("click", zeigeFortschritt);
el.theorieStartBtn.addEventListener("click", starteUebung);
el.theorieZurueck.addEventListener("click", () => { state.thema = null; zeigePanel("intro"); });
el.uebungZurueck.addEventListener("click", () => { renderTheorie(); zeigePanel("theorie"); });
el.fortschrittZurueck.addEventListener("click", () => zeigePanel("intro"));
el.freitextForm.addEventListener("submit", beantworteFreitext);
el.weiterBtn.addEventListener("click", naechsteFrage);
el.resetBtn.addEventListener("click", fortschrittZuruecksetzen);
