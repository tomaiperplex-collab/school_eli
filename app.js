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
  lernmodusBegriffe: [],
  lernmodusIndex: 0,
};

// ---------------------------------------------------------------------------
// Kartenkacheln (Leaflet): OpenStreetMap als Standard, swisstopo als
// Alternative über den Ebenen-Schalter auf der Übersichtskarte. Beide
// Dienste sind kostenlos nutzbar, benötigen aber eine Internetverbindung
// zur Laufzeit (die Kacheln werden nicht mitgeliefert/offline gecacht).
// ---------------------------------------------------------------------------
function erzeugeOsmLayer() {
  return L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende',
    maxZoom: 19,
  });
}

function erzeugeSwisstopoLayer() {
  return L.tileLayer(
    "https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg",
    { attribution: "&copy; swisstopo", maxZoom: 18 }
  );
}

const KANTON_BOUNDS_LATLNG = L.latLngBounds(
  [KARTE_BOUNDS.latMin, KARTE_BOUNDS.lonMin],
  [KARTE_BOUNDS.latMax, KARTE_BOUNDS.lonMax]
);

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
  karteLeaflet: document.getElementById("karte-leaflet"),
  legende: document.getElementById("legende"),
  frageZaehler: document.getElementById("frage-zaehler"),
  punktestand: document.getElementById("punktestand"),
  fotoWrapper: document.getElementById("foto-frage-bild-wrapper"),
  fotoBild: document.getElementById("foto-frage-bild"),
  karteFrageBereich: document.getElementById("karte-frage-bereich"),
  quizKarteLeaflet: document.getElementById("quiz-karte-leaflet"),
  miniKarteWrapper: document.querySelector(".mini-karte-wrapper"),
  miniKarteLeaflet: document.getElementById("mini-karte-leaflet"),
  mcGrid: document.getElementById("multiple-choice"),
  freitextForm: document.getElementById("freitext-form"),
  freitextInput: document.getElementById("freitext-input"),
  feedback: document.getElementById("feedback"),
  weiterBtn: document.getElementById("weiter-btn"),
  fortschrittListe: document.getElementById("fortschritt-liste"),
  gesamtPunkte: document.getElementById("gesamt-punkte"),
  resetBtn: document.getElementById("reset-btn"),
  panelLernmodus: document.getElementById("lernmodus"),
  lernmodusKarte: document.getElementById("lernmodus-karte"),
  lernmodusZaehler: document.getElementById("lernmodus-zaehler"),
  lernmodusFoto: document.getElementById("lernmodus-foto"),
  lernmodusName: document.getElementById("lernmodus-name"),
  lernmodusRegion: document.getElementById("lernmodus-region"),
  lernmodusCloseBtn: document.getElementById("lernmodus-close"),
  lernmodusPrevBtn: document.getElementById("lernmodus-prev"),
  lernmodusNextBtn: document.getElementById("lernmodus-next"),
  panelBildnachweise: document.getElementById("bildnachweise"),
  bildnachweiseListe: document.getElementById("bildnachweise-liste"),
  bildnachweiseLink: document.getElementById("bildnachweise-link"),
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
// Leaflet-Kartenverwaltung: alle drei Karten (Übersicht, Karte→Name-Quiz,
// Foto→Name-Mini-Karte) werden träge (erst bei Bedarf) erzeugt, damit
// Leaflet die Containergrösse korrekt bestimmen kann (nur bei sichtbarem
// Container möglich) und keine unnötigen Kacheln geladen werden.
// ---------------------------------------------------------------------------
const karten = {
  uebersicht: null,
  uebersichtEbenen: null,
  uebersichtMarker: null,
  quiz: null,
  quizMarker: null,
  mini: null,
  miniMarker: null,
  lernmodus: null,
  lernmodusRegion: null,
};

// Zeichnet die 5 Verwaltungsregionen als eingefärbte Flächen + Namens-Label
// auf die übergebene Leaflet-Karte (siehe REGIONEN in data.js).
function erzeugeRegionenEbene() {
  const ebene = L.layerGroup();
  REGIONEN.forEach((region) => {
    L.polygon(region.teile, {
      color: region.farbe,
      weight: 2,
      fillColor: region.farbe,
      fillOpacity: 0.22,
      interactive: false,
    }).addTo(ebene);

    L.marker(region.label, {
      icon: L.divIcon({
        className: "regionen-label",
        html: region.name,
        iconSize: [0, 0],
      }),
      interactive: false,
    }).addTo(ebene);
  });
  return ebene;
}

// Sperrt eine Karte auf den Kanton Bern: nicht wegscrollbar und nicht weiter
// wegzoombar als die aktuelle (Kanton-)Ansicht, damit Kinder sich nicht in
// der ganzen Schweiz verlieren. Reinzoomen bleibt uneingeschränkt möglich.
function sperreAufKanton(karte) {
  karte.setMaxBounds(KANTON_BOUNDS_LATLNG.pad(0.15));
  karte.options.maxBoundsViscosity = 1.0;
  karte.setMinZoom(karte.getZoom());
}

function holeUebersichtsKarte() {
  if (karten.uebersicht) return karten.uebersicht;

  const karte = L.map(el.karteLeaflet);
  const osm = erzeugeOsmLayer().addTo(karte);
  const swisstopo = erzeugeSwisstopoLayer();
  const regionen = erzeugeRegionenEbene().addTo(karte);
  L.control
    .layers({ OpenStreetMap: osm, swisstopo: swisstopo }, { "5 Regionen": regionen })
    .addTo(karte);
  karte.fitBounds(KANTON_BOUNDS_LATLNG, { padding: [10, 10] });
  sperreAufKanton(karte);

  karten.uebersicht = karte;
  karten.uebersichtMarker = L.layerGroup().addTo(karte);
  return karte;
}

function holeQuizKarte() {
  if (karten.quiz) return karten.quiz;

  const karte = L.map(el.quizKarteLeaflet, { attributionControl: true });
  erzeugeOsmLayer().addTo(karte);
  karte.fitBounds(KANTON_BOUNDS_LATLNG, { padding: [10, 10] });
  sperreAufKanton(karte);

  karten.quiz = karte;
  karten.quizMarker = L.layerGroup().addTo(karte);
  return karte;
}

function holeMiniKarte() {
  if (karten.mini) return karten.mini;

  const karte = L.map(el.miniKarteLeaflet, {
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    attributionControl: false,
  });
  erzeugeOsmLayer().addTo(karte);

  karten.mini = karte;
  karten.miniMarker = L.layerGroup().addTo(karte);
  return karte;
}

function holeLernmodusKarte() {
  if (karten.lernmodus) return karten.lernmodus;

  const karte = L.map(el.lernmodusKarte);
  erzeugeOsmLayer().addTo(karte);
  karte.fitBounds(KANTON_BOUNDS_LATLNG, { padding: [10, 10] });
  sperreAufKanton(karte);

  karten.lernmodus = karte;
  karten.lernmodusRegion = L.layerGroup().addTo(karte);
  return karte;
}

// Zeichnet eine Region mit eingefärbter Fläche und Marker für den Ort auf die Karte
function zeichneRegionMitOrt(region, ort) {
  karten.lernmodusRegion.clearLayers();

  region.teile.forEach(teil => {
    L.polygon(teil, {
      color: region.farbe,
      weight: 3,
      fillColor: region.farbe,
      fillOpacity: 0.3,
      interactive: false,
    }).addTo(karten.lernmodusRegion);
  });

  // Marker für den Ort
  L.circleMarker([ort.lat, ort.lon], {
    radius: 12,
    fillColor: KATEGORIEN[ort.kategorie].farbe,
    fillOpacity: 1,
    color: "#fff",
    weight: 3,
  }).addTo(karten.lernmodusRegion);

  // Zoom so dass die ganze Region sichtbar ist
  const regionPoly = L.polygon(region.teile);
  karten.lernmodus.fitBounds(regionPoly.getBounds(), { padding: [30, 30] });
}

function neuZeichnenNaechstenTick(karte) {
  window.requestAnimationFrame(() => karte.invalidateSize());
}

// ---------------------------------------------------------------------------
// Übersichtskarte rendern (Modus "uebersicht")
// ---------------------------------------------------------------------------
function renderUebersichtsKarte() {
  const karte = holeUebersichtsKarte();
  karten.uebersichtMarker.clearLayers();
  el.legende.innerHTML = "";

  const sichtbar = gefilterteBegriffe();
  const mitKoordinaten = sichtbar.filter(hatKoordinaten);

  mitKoordinaten.forEach((b) => {
    const farbe = KATEGORIEN[b.kategorie].farbe;
    L.circleMarker([b.lat, b.lon], {
      radius: 14,
      fillColor: farbe,
      fillOpacity: 1,
      color: "#fff",
      weight: 3,
    })
      .bindTooltip(b._code, { permanent: true, direction: "center", className: "punkt-tooltip" })
      .bindPopup(`<strong>${b.name}</strong><br>${b.kurzfakt || ""}`)
      .addTo(karten.uebersichtMarker);
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

  neuZeichnenNaechstenTick(karte);
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
  el.panelLernmodus.classList.toggle("hidden", neuerModus !== "lernmodus");
  el.panelBildnachweise.classList.toggle("hidden", neuerModus !== "bildnachweise");

  if (neuerModus === "uebersicht") {
    renderUebersichtsKarte();
  } else if (neuerModus === "fortschritt") {
    renderFortschritt();
  } else if (neuerModus === "lernmodus") {
    starteLernmodus();
  } else if (neuerModus === "bildnachweise") {
    renderBildnachweise();
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
  const karte = holeQuizKarte();
  karten.quizMarker.clearLayers();

  const sichtbar = gefilterteBegriffe().filter(hatKoordinaten);
  sichtbar.forEach((b) => {
    const istZiel = b.name === begriff.name;
    L.circleMarker([b.lat, b.lon], {
      radius: istZiel ? 20 : 10,
      fillColor: istZiel ? "#ffb703" : "#999",
      fillOpacity: istZiel ? 1 : 0.6,
      color: istZiel ? "#222" : "#fff",
      weight: istZiel ? 4 : 2,
    }).addTo(karten.quizMarker);
  });

  karte.fitBounds(KANTON_BOUNDS_LATLNG, { padding: [10, 10] });
  neuZeichnenNaechstenTick(karte);
}

function zeigeFotoFrage(begriff) {
  el.fotoWrapper.classList.remove("hidden");
  el.fotoBild.src = begriff.bildpfad;
  el.fotoBild.alt = "Foto zum Erraten";
  el.fotoBild.onerror = () => {
    el.fotoBild.alt = "Bild fehlt: " + begriff.bildpfad;
  };

  if (hatKoordinaten(begriff)) {
    el.miniKarteWrapper.classList.remove("hidden");
    const karte = holeMiniKarte();
    karten.miniMarker.clearLayers();
    L.circleMarker([begriff.lat, begriff.lon], {
      radius: 12,
      fillColor: "#ffb703",
      fillOpacity: 1,
      color: "#222",
      weight: 3,
    }).addTo(karten.miniMarker);
    karte.setView([begriff.lat, begriff.lon], 10);
    neuZeichnenNaechstenTick(karte);
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
// Bildnachweise (Attribution für CC-lizenzierte Fotos, siehe bildQuelle in
// data.js). Begriffe ohne bildQuelle (Platzhalterbilder) werden ausgelassen.
// ---------------------------------------------------------------------------
function renderBildnachweise() {
  el.bildnachweiseListe.innerHTML = "";
  BEGRIFFE.filter((b) => b.bildQuelle).forEach((b) => {
    const q = b.bildQuelle;
    const li = document.createElement("li");
    li.className = "bildnachweise-zeile";
    const lizenzTeil = q.lizenzUrl
      ? `<a href="${q.lizenzUrl}" target="_blank" rel="noopener">${q.lizenz}</a>`
      : q.lizenz;
    li.innerHTML = `
      <span class="begriff-name">${b.name}</span>:
      Foto von ${q.urheber}, Lizenz ${lizenzTeil}
      (<a href="${q.quelle}" target="_blank" rel="noopener">Quelle</a>)
    `;
    el.bildnachweiseListe.appendChild(li);
  });
}

// ---------------------------------------------------------------------------
// Lernmodus: Slideshow mit Ort, Foto, Region und Karte
// ---------------------------------------------------------------------------
function zeigeAktuelleLernmodusSeite() {
  if (!state.lernmodusBegriffe.length) return;

  const ort = state.lernmodusBegriffe[state.lernmodusIndex];
  const region = REGIONEN.find(r =>
    r.teile.some(teil => pointInPolygon([ort.lat, ort.lon], teil))
  ) || REGIONEN[0]; // Fallback zur ersten Region

  const karte = holeLernmodusKarte();
  zeichneRegionMitOrt(region, ort);
  neuZeichnenNaechstenTick(karte);

  el.lernmodusFoto.src = ort.bildpfad;
  el.lernmodusFoto.alt = ort.name;
  el.lernmodusName.textContent = ort.name;
  el.lernmodusRegion.textContent = region.name;

  el.lernmodusZaehler.textContent = `${state.lernmodusIndex + 1} / ${state.lernmodusBegriffe.length}`;

  el.lernmodusPrevBtn.disabled = state.lernmodusIndex === 0;
  el.lernmodusNextBtn.disabled = state.lernmodusIndex === state.lernmodusBegriffe.length - 1;
}

function pointInPolygon(point, polygon) {
  const [px, py] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [x1, y1] = polygon[i];
    const [x2, y2] = polygon[j];
    const intersect = (y1 > py) !== (y2 > py) && px < (x2 - x1) * (py - y1) / (y2 - y1) + x1;
    if (intersect) inside = !inside;
  }
  return inside;
}

function starteLernmodus() {
  state.lernmodusBegriffe = mischen(gefilterteBegriffe().filter(hatKoordinaten));
  state.lernmodusIndex = 0;
  if (!state.lernmodusBegriffe.length) {
    alert("Keine Orte mit Koordinaten verfügbar. Bitte Filter anpassen.");
    return;
  }
  zeigeAktuelleLernmodusSeite();
}

function schliesseLernmodus() {
  setzeModus("uebersicht");
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

el.lernmodusCloseBtn.addEventListener("click", schliesseLernmodus);
el.lernmodusPrevBtn.addEventListener("click", () => {
  if (state.lernmodusIndex > 0) {
    state.lernmodusIndex--;
    zeigeAktuelleLernmodusSeite();
  }
});
el.lernmodusNextBtn.addEventListener("click", () => {
  if (state.lernmodusIndex < state.lernmodusBegriffe.length - 1) {
    state.lernmodusIndex++;
    zeigeAktuelleLernmodusSeite();
  }
});

el.bildnachweiseLink.addEventListener("click", () => setzeModus("bildnachweise"));

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
setzeModus("uebersicht");
