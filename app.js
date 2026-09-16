// app.js — Logik der Kanton-Bern-Lern-App
"use strict";

// ---------------------------------------------------------------------------
// Konstanten & Storage
// ---------------------------------------------------------------------------
const STORAGE_KEY = "bernLernapp.fortschritt.v1";
const ANZAHL_OPTIONEN = 4;
const AUTO_WEITER_VERZOEGERUNG_MS = 1400;

function leererFortschritt() {
  const kategorien = {};
  Object.keys(KATEGORIEN).forEach((k) => (kategorien[k] = { richtig: 0, gesamt: 0 }));
  return { punkte: 0, kategorien };
}

function fortschrittLaden() {
  try {
    const roh = localStorage.getItem(STORAGE_KEY);
    if (!roh) return leererFortschritt();
    const geladen = JSON.parse(roh);
    const basis = leererFortschritt();
    return {
      punkte: geladen.punkte || 0,
      kategorien: Object.assign(basis.kategorien, geladen.kategorien || {}),
    };
  } catch (e) {
    return leererFortschritt();
  }
}

function fortschrittSpeichern() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.fortschritt));
}

// ---------------------------------------------------------------------------
// App-Zustand
// ---------------------------------------------------------------------------
const state = {
  modus: "uebersicht",
  aktiveKategorien: new Set(Object.keys(KATEGORIEN)),
  fortschritt: fortschrittLaden(),
  aktuelleFrage: null, // { begriff, optionen }
  beantwortet: false,
  sessionRichtig: 0,
  sessionGesamt: 0,
};

// ---------------------------------------------------------------------------
// Geo-Projektion: lat/lon -> x/y im SVG viewBox (0..1000 / 0..700)
// ---------------------------------------------------------------------------
function projiziere(lat, lon) {
  const x = ((lon - KARTE_BOUNDS.lonMin) / (KARTE_BOUNDS.lonMax - KARTE_BOUNDS.lonMin)) * 1000;
  const y = (1 - (lat - KARTE_BOUNDS.latMin) / (KARTE_BOUNDS.latMax - KARTE_BOUNDS.latMin)) * 700;
  return { x, y };
}

// Kurzer Legenden-Code pro Begriff, z.B. "O1", "B3", "S2", "F4"
const KATEGORIE_PRAEFIX = { orte: "O", berge: "B", seen: "S", fluesse: "F" };
function berechneCodes() {
  const zaehler = {};
  BEGRIFFE.forEach((b) => {
    zaehler[b.kategorie] = (zaehler[b.kategorie] || 0) + 1;
    b._code = KATEGORIE_PRAEFIX[b.kategorie] + zaehler[b.kategorie];
  });
}
berechneCodes();

function hatKoordinaten(begriff) {
  return typeof begriff.lat === "number" && typeof begriff.lon === "number";
}

// ---------------------------------------------------------------------------
// DOM-Referenzen
// ---------------------------------------------------------------------------
const el = {
  modeBar: document.getElementById("mode-bar"),
  filterBar: document.getElementById("filter-bar"),
  panelUebersicht: document.getElementById("karten-uebersicht"),
  panelUebung: document.getElementById("uebung"),
  panelFortschritt: document.getElementById("fortschritt"),
  punkteGruppe: document.getElementById("punkte-gruppe"),
  legende: document.getElementById("legende"),
  frageZaehler: document.getElementById("frage-zaehler"),
  punktestand: document.getElementById("punktestand"),
  fotoWrapper: document.getElementById("foto-frage-bild-wrapper"),
  fotoBild: document.getElementById("foto-frage-bild"),
  karteFrageBereich: document.getElementById("karte-frage-bereich"),
  quizPunkteGruppe: document.getElementById("quiz-punkte-gruppe"),
  miniKarteWrapper: document.querySelector(".mini-karte-wrapper"),
  miniKarteSvg: document.getElementById("mini-karte-svg"),
  mcGrid: document.getElementById("multiple-choice"),
  freitextForm: document.getElementById("freitext-form"),
  freitextInput: document.getElementById("freitext-input"),
  feedback: document.getElementById("feedback"),
  weiterBtn: document.getElementById("weiter-btn"),
  fortschrittListe: document.getElementById("fortschritt-liste"),
  gesamtPunkte: document.getElementById("gesamt-punkte"),
  resetBtn: document.getElementById("reset-btn"),
};

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------
function gefilterteBegriffe() {
  return BEGRIFFE.filter((b) => state.aktiveKategorien.has(b.kategorie));
}

function zufallsElement(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}

function mischen(liste) {
  const kopie = [...liste];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

function normalisiereText(t) {
  return t
    .trim()
    .toLowerCase()
    .replace(/[̀-ͯ]/g, ""); // entfernt evtl. Akzent-Kombinationszeichen
}

// ---------------------------------------------------------------------------
// Übersichtskarte rendern (Modus "uebersicht")
// ---------------------------------------------------------------------------
function renderUebersichtsKarte() {
  el.punkteGruppe.innerHTML = "";
  el.legende.innerHTML = "";

  const sichtbar = gefilterteBegriffe();
  const mitKoordinaten = sichtbar.filter(hatKoordinaten);

  mitKoordinaten.forEach((b) => {
    const { x, y } = projiziere(b.lat, b.lon);
    const farbe = KATEGORIEN[b.kategorie].farbe;

    const kreis = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    kreis.setAttribute("cx", x);
    kreis.setAttribute("cy", y);
    kreis.setAttribute("r", 16);
    kreis.setAttribute("fill", farbe);
    kreis.classList.add("punkt");
    kreis.setAttribute("data-name", b.name);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x);
    label.setAttribute("y", y);
    label.classList.add("punkt-label");
    label.setAttribute("font-size", "16");
    label.textContent = b._code;

    el.punkteGruppe.appendChild(kreis);
    el.punkteGruppe.appendChild(label);
  });

  if (sichtbar.length && mitKoordinaten.length === 0) {
    const hinweis = document.createElement("li");
    hinweis.textContent = "Noch keine Koordinaten eingetragen — siehe data.js.";
    el.legende.appendChild(hinweis);
  }

  // Legende gruppiert nach Kategorie
  Object.keys(KATEGORIEN).forEach((katKey) => {
    if (!state.aktiveKategorien.has(katKey)) return;
    sichtbar
      .filter((b) => b.kategorie === katKey)
      .forEach((b) => {
        const li = document.createElement("li");
        const swatch = document.createElement("span");
        swatch.className = "swatch";
        swatch.style.background = KATEGORIEN[katKey].farbe;
        li.appendChild(swatch);
        li.append(`${b._code} = ${b.name}`);
        el.legende.appendChild(li);
      });
  });
}

// ---------------------------------------------------------------------------
// Modus-Steuerung
// ---------------------------------------------------------------------------
function setzeModus(neuerModus) {
  state.modus = neuerModus;

  [...el.modeBar.querySelectorAll(".mode-btn")].forEach((btn) =>
    btn.classList.toggle("aktiv", btn.dataset.mode === neuerModus)
  );

  el.panelUebersicht.classList.toggle("hidden", neuerModus !== "uebersicht");
  el.panelUebung.classList.toggle("hidden", !["karte-name", "foto-name", "freitext"].includes(neuerModus));
  el.panelFortschritt.classList.toggle("hidden", neuerModus !== "fortschritt");

  if (neuerModus === "uebersicht") {
    renderUebersichtsKarte();
  } else if (neuerModus === "fortschritt") {
    renderFortschritt();
  } else {
    state.sessionRichtig = 0;
    state.sessionGesamt = 0;
    naechsteFrage();
  }
}

// ---------------------------------------------------------------------------
// Frage-Erzeugung
// ---------------------------------------------------------------------------
function waehleFrageBegriff() {
  let kandidaten = gefilterteBegriffe();

  if (state.modus === "karte-name") {
    kandidaten = kandidaten.filter(hatKoordinaten);
  }

  if (kandidaten.length === 0) return null;

  // vorherige Frage nach Möglichkeit nicht wiederholen
  const letzter = state.aktuelleFrage ? state.aktuelleFrage.begriff.name : null;
  const auswahl = kandidaten.filter((b) => b.name !== letzter);
  return zufallsElement(auswahl.length ? auswahl : kandidaten);
}

function erzeugeOptionen(korrekterBegriff) {
  const pool = BEGRIFFE.filter((b) => b.name !== korrekterBegriff.name);
  const ablenker = mischen(pool).slice(0, ANZAHL_OPTIONEN - 1);
  return mischen([korrekterBegriff, ...ablenker]);
}

function naechsteFrage() {
  state.beantwortet = false;
  el.feedback.textContent = "";
  el.feedback.className = "feedback";
  el.weiterBtn.classList.add("hidden");

  const begriff = waehleFrageBegriff();

  el.fotoWrapper.classList.add("hidden");
  el.karteFrageBereich.classList.add("hidden");
  el.mcGrid.classList.add("hidden");
  el.freitextForm.classList.add("hidden");
  el.mcGrid.innerHTML = "";

  if (!begriff) {
    el.frageZaehler.textContent = "";
    el.feedback.textContent =
      state.modus === "karte-name"
        ? "Für die gewählten Kategorien fehlen noch Koordinaten in data.js."
        : "Bitte mindestens eine Kategorie im Filter auswählen.";
    return;
  }

  const optionen = erzeugeOptionen(begriff);
  state.aktuelleFrage = { begriff, optionen };

  el.frageZaehler.textContent = `Frage ${state.sessionGesamt + 1}`;
  el.punktestand.textContent = `✅ ${state.sessionRichtig} / ${state.sessionGesamt}`;

  if (state.modus === "karte-name") {
    zeigeKarteFrage(begriff);
    zeigeMultipleChoice(optionen);
  } else if (state.modus === "foto-name") {
    zeigeFotoFrage(begriff);
    zeigeMultipleChoice(optionen);
  } else if (state.modus === "freitext") {
    zeigeFotoFrage(begriff);
    el.freitextForm.classList.remove("hidden");
    el.freitextInput.value = "";
    el.freitextInput.focus();
  }
}

function zeigeKarteFrage(begriff) {
  el.karteFrageBereich.classList.remove("hidden");
  el.quizPunkteGruppe.innerHTML = "";

  const sichtbar = gefilterteBegriffe().filter(hatKoordinaten);
  sichtbar.forEach((b) => {
    const { x, y } = projiziere(b.lat, b.lon);
    const istZiel = b.name === begriff.name;

    const kreis = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    kreis.setAttribute("cx", x);
    kreis.setAttribute("cy", y);
    kreis.setAttribute("r", istZiel ? 22 : 12);
    kreis.setAttribute("fill", istZiel ? "#ffb703" : "#999");
    kreis.classList.add("punkt");
    if (istZiel) kreis.classList.add("hervorgehoben");
    else kreis.classList.add("punkt-blass");

    el.quizPunkteGruppe.appendChild(kreis);
  });
}

function zeigeFotoFrage(begriff) {
  el.fotoWrapper.classList.remove("hidden");
  el.fotoBild.src = begriff.bildpfad;
  el.fotoBild.alt = "Foto zum Erraten";
  el.fotoBild.onerror = () => {
    el.fotoBild.alt = "Bild fehlt: " + begriff.bildpfad;
  };

  el.miniKarteWrapper.innerHTML = "";
  if (hatKoordinaten(begriff)) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 1000 700");
    const umriss = document.getElementById("kanton-umriss-mini").cloneNode(true);
    umriss.removeAttribute("id");
    svg.appendChild(umriss);

    const { x, y } = projiziere(begriff.lat, begriff.lon);
    const kreis = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    kreis.setAttribute("cx", x);
    kreis.setAttribute("cy", y);
    kreis.setAttribute("r", 26);
    kreis.setAttribute("fill", "#ffb703");
    kreis.setAttribute("stroke", "#222");
    kreis.setAttribute("stroke-width", "6");
    svg.appendChild(kreis);

    el.miniKarteWrapper.appendChild(svg);
    el.miniKarteWrapper.classList.remove("hidden");
  } else {
    el.miniKarteWrapper.classList.add("hidden");
  }
}

function zeigeMultipleChoice(optionen) {
  el.mcGrid.classList.remove("hidden");
  el.mcGrid.innerHTML = "";
  optionen.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "mc-option";
    btn.textContent = opt.name;
    btn.addEventListener("click", () => beantworteMultipleChoice(opt, btn));
    el.mcGrid.appendChild(btn);
  });
}

// ---------------------------------------------------------------------------
// Antwort-Auswertung
// ---------------------------------------------------------------------------
function verbucheAntwort(begriff, korrekt) {
  state.sessionGesamt++;
  if (korrekt) state.sessionRichtig++;

  const kat = state.fortschritt.kategorien[begriff.kategorie];
  kat.gesamt++;
  if (korrekt) {
    kat.richtig++;
    state.fortschritt.punkte += 10;
  }
  fortschrittSpeichern();
}

function zeigeFeedback(korrekt, korrekterBegriff) {
  el.feedback.textContent = korrekt
    ? "✅ Richtig! " + (korrekterBegriff.kurzfakt || "")
    : `❌ Leider falsch. Richtig wäre: ${korrekterBegriff.name}. ${korrekterBegriff.kurzfakt || ""}`;
  el.feedback.classList.add(korrekt ? "richtig" : "falsch");
}

function beantworteMultipleChoice(gewaehlt, button) {
  if (state.beantwortet) return;
  state.beantwortet = true;

  const korrekterBegriff = state.aktuelleFrage.begriff;
  const korrekt = gewaehlt.name === korrekterBegriff.name;

  [...el.mcGrid.children].forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === korrekterBegriff.name) btn.classList.add("richtig");
    else if (btn === button) btn.classList.add("falsch");
  });

  verbucheAntwort(korrekterBegriff, korrekt);
  zeigeFeedback(korrekt, korrekterBegriff);

  el.punktestand.textContent = `✅ ${state.sessionRichtig} / ${state.sessionGesamt}`;
  window.setTimeout(naechsteFrage, AUTO_WEITER_VERZOEGERUNG_MS);
}

function beantworteFreitext(ev) {
  ev.preventDefault();
  if (state.beantwortet) return;
  state.beantwortet = true;

  const korrekterBegriff = state.aktuelleFrage.begriff;
  const eingabe = normalisiereText(el.freitextInput.value);
  const korrekt = eingabe.length > 0 && eingabe === normalisiereText(korrekterBegriff.name);

  verbucheAntwort(korrekterBegriff, korrekt);
  zeigeFeedback(korrekt, korrekterBegriff);

  el.punktestand.textContent = `✅ ${state.sessionRichtig} / ${state.sessionGesamt}`;
  el.freitextInput.disabled = true;
  window.setTimeout(() => {
    el.freitextInput.disabled = false;
    naechsteFrage();
  }, AUTO_WEITER_VERZOEGERUNG_MS + 800);
}

// ---------------------------------------------------------------------------
// Fortschrittsanzeige
// ---------------------------------------------------------------------------
function renderFortschritt() {
  el.fortschrittListe.innerHTML = "";
  Object.entries(KATEGORIEN).forEach(([key, info]) => {
    const stat = state.fortschritt.kategorien[key] || { richtig: 0, gesamt: 0 };
    const prozent = stat.gesamt ? Math.round((stat.richtig / stat.gesamt) * 100) : 0;

    const zeile = document.createElement("div");
    zeile.className = "fortschritt-zeile";
    zeile.innerHTML = `
      <span class="name">${info.label}</span>
      <div class="fortschritt-balken-hintergrund">
        <div class="fortschritt-balken" style="width:${prozent}%;background:${info.farbe}"></div>
      </div>
      <span class="fortschritt-prozent">${prozent}%</span>
    `;
    el.fortschrittListe.appendChild(zeile);
  });
  el.gesamtPunkte.textContent = state.fortschritt.punkte;
}

function fortschrittZuruecksetzen() {
  if (!window.confirm("Fortschritt wirklich zurücksetzen?")) return;
  state.fortschritt = leererFortschritt();
  fortschrittSpeichern();
  renderFortschritt();
}

// ---------------------------------------------------------------------------
// Event-Listener
// ---------------------------------------------------------------------------
el.modeBar.addEventListener("click", (ev) => {
  const btn = ev.target.closest(".mode-btn");
  if (btn) setzeModus(btn.dataset.mode);
});

el.filterBar.addEventListener("change", (ev) => {
  const checkbox = ev.target.closest("input[data-kategorie]");
  if (!checkbox) return;
  if (checkbox.checked) state.aktiveKategorien.add(checkbox.dataset.kategorie);
  else state.aktiveKategorien.delete(checkbox.dataset.kategorie);

  if (state.modus === "uebersicht") renderUebersichtsKarte();
  else if (state.modus !== "fortschritt") naechsteFrage();
});

el.freitextForm.addEventListener("submit", beantworteFreitext);
el.resetBtn.addEventListener("click", fortschrittZuruecksetzen);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
setzeModus("uebersicht");
