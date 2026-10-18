// stadt-bern/app.js — Lernmodus, Multiple Choice, Freitext und Fortschritt
// für NMG "Stadt Bern". Daten kommen aus data.js (THEMEN, KARTEN, FRAGEN).

const STORAGE_KEY = "stadtBernLernapp.fortschritt.v1";
const AUTO_WEITER_VERZOEGERUNG_MS = 1800;

const state = {
  modus: "lernmodus",
  aktiveThemen: new Set(Object.keys(THEMEN)),
  fortschritt: fortschrittLaden(),
  frage: null,
  beantwortet: false,
  sessionRichtig: 0,
  sessionGesamt: 0,
  kartenIndex: 0,
  letzteFrage: null,
};

function leererFortschritt() {
  const themen = {};
  Object.keys(THEMEN).forEach((k) => (themen[k] = { richtig: 0, gesamt: 0 }));
  return { punkte: 0, themen };
}

function fortschrittLaden() {
  try {
    const roh = localStorage.getItem(STORAGE_KEY);
    if (roh) {
      const f = JSON.parse(roh);
      const leer = leererFortschritt();
      return { punkte: f.punkte || 0, themen: { ...leer.themen, ...(f.themen || {}) } };
    }
  } catch (e) { /* localStorage nicht verfügbar */ }
  return leererFortschritt();
}

function fortschrittSpeichern() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.fortschritt)); } catch (e) { /* ignorieren */ }
}

const $ = (id) => document.getElementById(id);
const el = {
  panels: ["lernmodus", "uebung", "fortschritt"].map($),
  filterBar: $("filter-bar"),
  modeBar: $("mode-bar"),
  zaehler: $("frage-zaehler"),
  punktestand: $("punktestand"),
  frageText: $("frage-text"),
  frageThema: $("frage-thema"),
  mcGrid: $("multiple-choice"),
  freitextForm: $("freitext-form"),
  freitextInput: $("freitext-input"),
  feedback: $("feedback"),
  weiterBtn: $("weiter-btn"),
  kartenZaehler: $("lernmodus-zaehler"),
  kartenTitel: $("lernmodus-titel"),
  kartenListe: $("lernmodus-punkte"),
  kartenThema: $("lernmodus-thema"),
  fortschrittListe: $("fortschritt-liste"),
  gesamtPunkte: $("gesamt-punkte"),
};

function mischen(liste) {
  const k = [...liste];
  for (let i = k.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [k[i], k[j]] = [k[j], k[i]];
  }
  return k;
}

function normalisiere(t) {
  return t
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue")
    .replace(/ss/g, "s").replace(/ß/g, "s")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// Filter / Modus
// ---------------------------------------------------------------------------
function baueFilter() {
  Object.entries(THEMEN).forEach(([key, t]) => {
    const label = document.createElement("label");
    label.className = "filter-chip";
    label.style.borderColor = t.farbe;
    label.innerHTML = `<input type="checkbox" checked data-thema="${key}" /> ${t.symbol} ${t.label}`;
    label.querySelector("input").addEventListener("change", (ev) => {
      if (ev.target.checked) state.aktiveThemen.add(key);
      else state.aktiveThemen.delete(key);
      if (state.aktiveThemen.size === 0) {
        state.aktiveThemen.add(key);
        ev.target.checked = true;
      }
      state.kartenIndex = 0;
      if (state.modus === "lernmodus") zeigeKarte();
      else if (state.modus === "mc" || state.modus === "freitext") naechsteFrage();
    });
    el.filterBar.appendChild(label);
  });
}

function setzeModus(modus) {
  state.modus = modus;
  [...el.modeBar.children].forEach((b) => b.classList.toggle("aktiv", b.dataset.mode === modus));
  $("lernmodus").classList.toggle("hidden", modus !== "lernmodus");
  $("uebung").classList.toggle("hidden", modus !== "mc" && modus !== "freitext");
  $("fortschritt").classList.toggle("hidden", modus !== "fortschritt");
  el.filterBar.classList.toggle("hidden", modus === "fortschritt");

  if (modus === "lernmodus") zeigeKarte();
  else if (modus === "mc" || modus === "freitext") {
    state.sessionRichtig = 0;
    state.sessionGesamt = 0;
    state.letzteFrage = null;
    naechsteFrage();
  } else renderFortschritt();
}

// ---------------------------------------------------------------------------
// Lernmodus
// ---------------------------------------------------------------------------
function aktiveKarten() {
  return KARTEN.filter((k) => state.aktiveThemen.has(k.thema));
}

function zeigeKarte() {
  const karten = aktiveKarten();
  if (!karten.length) return;
  state.kartenIndex = (state.kartenIndex + karten.length) % karten.length;
  const k = karten[state.kartenIndex];
  const t = THEMEN[k.thema];
  el.kartenZaehler.textContent = `Karte ${state.kartenIndex + 1} / ${karten.length}`;
  el.kartenThema.textContent = `${t.symbol} ${t.label}`;
  el.kartenThema.style.background = t.farbe;
  el.kartenTitel.textContent = k.titel;
  el.kartenListe.innerHTML = "";
  k.punkte.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = p;
    el.kartenListe.appendChild(li);
  });
}

// ---------------------------------------------------------------------------
// Fragen
// ---------------------------------------------------------------------------
function verfuegbareFragen() {
  let fragen = FRAGEN.filter((f) => state.aktiveThemen.has(f.thema));
  if (state.modus === "freitext") fragen = fragen.filter((f) => f.freitext !== false);
  return fragen;
}

function naechsteFrage() {
  const fragen = verfuegbareFragen();
  if (!fragen.length) return;
  let kandidaten = fragen.filter((f) => f !== state.letzteFrage);
  if (!kandidaten.length) kandidaten = fragen;
  const frage = kandidaten[Math.floor(Math.random() * kandidaten.length)];
  state.frage = frage;
  state.letzteFrage = frage;
  state.beantwortet = false;

  const t = THEMEN[frage.thema];
  el.zaehler.textContent = `${t.symbol} ${t.label}`;
  el.punktestand.textContent = `✅ ${state.sessionRichtig} / ${state.sessionGesamt}`;
  el.frageText.textContent = frage.frage;
  el.feedback.textContent = "";
  el.feedback.className = "feedback";
  el.weiterBtn.classList.add("hidden");

  if (state.modus === "mc") {
    el.freitextForm.classList.add("hidden");
    el.mcGrid.classList.remove("hidden");
    el.mcGrid.innerHTML = "";
    mischen([frage.antwort, ...frage.falsch]).forEach((text) => {
      const btn = document.createElement("button");
      btn.className = "mc-option";
      btn.textContent = text;
      btn.addEventListener("click", () => beantworteMc(text, btn));
      el.mcGrid.appendChild(btn);
    });
  } else {
    el.mcGrid.classList.add("hidden");
    el.freitextForm.classList.remove("hidden");
    el.freitextInput.value = "";
    el.freitextInput.disabled = false;
    el.freitextInput.focus();
  }
}

function verbuche(korrekt) {
  state.sessionGesamt++;
  if (korrekt) state.sessionRichtig++;
  const stat = state.fortschritt.themen[state.frage.thema];
  stat.gesamt++;
  if (korrekt) {
    stat.richtig++;
    state.fortschritt.punkte += 10;
  }
  fortschrittSpeichern();
  el.punktestand.textContent = `✅ ${state.sessionRichtig} / ${state.sessionGesamt}`;
  el.feedback.textContent = korrekt
    ? `✅ Richtig! ${state.frage.info || ""}`
    : `❌ Leider falsch. Richtig wäre: ${state.frage.antwort}. ${state.frage.info || ""}`;
  el.feedback.classList.add(korrekt ? "richtig" : "falsch");
}

function beantworteMc(text, button) {
  if (state.beantwortet) return;
  state.beantwortet = true;
  const korrekt = text === state.frage.antwort;
  [...el.mcGrid.children].forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === state.frage.antwort) btn.classList.add("richtig");
    else if (btn === button) btn.classList.add("falsch");
  });
  verbuche(korrekt);
  window.setTimeout(naechsteFrage, AUTO_WEITER_VERZOEGERUNG_MS + (korrekt ? 0 : 1200));
}

function istFreitextRichtig(eingabe, frage) {
  const e = normalisiere(eingabe);
  if (!e) return false;
  const gueltig = [frage.antwort, ...(frage.akzeptiert || [])].map(normalisiere);
  return gueltig.includes(e);
}

function beantworteFreitext(ev) {
  ev.preventDefault();
  if (state.beantwortet) return;
  state.beantwortet = true;
  el.freitextInput.disabled = true;
  const korrekt = istFreitextRichtig(el.freitextInput.value, state.frage);
  verbuche(korrekt);
  window.setTimeout(naechsteFrage, AUTO_WEITER_VERZOEGERUNG_MS + 1200);
}

// ---------------------------------------------------------------------------
// Fortschritt
// ---------------------------------------------------------------------------
function renderFortschritt() {
  el.fortschrittListe.innerHTML = "";
  Object.entries(THEMEN).forEach(([key, t]) => {
    const stat = state.fortschritt.themen[key] || { richtig: 0, gesamt: 0 };
    const prozent = stat.gesamt ? Math.round((stat.richtig / stat.gesamt) * 100) : 0;
    const zeile = document.createElement("div");
    zeile.className = "fortschritt-zeile";
    zeile.innerHTML = `
      <span class="name thema-name">${t.symbol} ${t.label}</span>
      <div class="fortschritt-balken-hintergrund">
        <div class="fortschritt-balken" style="width:${prozent}%;background:${t.farbe}"></div>
      </div>
      <span class="fortschritt-prozent">${prozent}%</span>`;
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
// Start
// ---------------------------------------------------------------------------
el.modeBar.addEventListener("click", (ev) => {
  const btn = ev.target.closest(".mode-btn");
  if (btn) setzeModus(btn.dataset.mode);
});
el.freitextForm.addEventListener("submit", beantworteFreitext);
$("lernmodus-prev").addEventListener("click", () => { state.kartenIndex--; zeigeKarte(); });
$("lernmodus-next").addEventListener("click", () => { state.kartenIndex++; zeigeKarte(); });
$("reset-btn").addEventListener("click", fortschrittZuruecksetzen);

baueFilter();
setzeModus("lernmodus");
