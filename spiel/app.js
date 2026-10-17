// spiel/app.js — "Le jeu des détectives": Das Kind befragt eine Zeugin/einen
// Zeugen auf Französisch (sprechen oder tippen), die KI (Claude-API, Key im
// Browser) oder der lokale Fallback antwortet, das Kind findet den Dieb.
// Verdächtige/SVG/Fallback: game.js, Vokabeln: vokabeln.js.

const LS = {
  key: "spiel.apiKey",
  model: "spiel.model",
  stimme: "spiel.stimme",
  punkte: "spiel.punkte.v1",
  best: "spiel.best.v1",
};
const STANDARD_MODEL = "claude-haiku-5-5";
const ANZAHL_VERDAECHTIGE = 8;

function lsGet(k, d = "") { try { return localStorage.getItem(k) ?? d; } catch (e) { return d; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* privater Modus */ } }

const $ = (id) => document.getElementById(id);
const el = {
  tabs: document.querySelectorAll("[data-ansicht]"),
  ansichten: { spiel: $("ansicht-spiel"), vokabeln: $("ansicht-vokabeln"), einstellungen: $("ansicht-einstellungen") },
  grid: $("verdaechtige"), chat: $("chat"), eingabe: $("eingabe"), senden: $("senden-btn"), mic: $("mic-btn"),
  baukasten: $("baukasten"), accuse: $("anklage-btn"), neu: $("neu-btn"), status: $("status"),
  fragen: $("anz-fragen"), punkte: $("punkte"), best: $("best"),
  vokFilter: $("vok-filter"), vokListe: $("vok-liste"),
  key: $("api-key"), model: $("api-model"), stimme: $("stimme-an"), keyStatus: $("key-status"),
  keyTest: $("key-test"), install: $("install-btn"),
};

const state = {
  verdaechtige: [], dieb: null, fragen: 0, falsch: 0, ausgeschlossen: new Set(),
  anklageModus: false, vorbei: false, verlauf: [], wartet: false,
  gesamt: Number(lsGet(LS.punkte, "0")) || 0, best: Number(lsGet(LS.best, "0")) || 0,
};

// ---------- Sprachausgabe ----------
let stimmen = [];
function ladeStimmen() { stimmen = window.speechSynthesis ? speechSynthesis.getVoices() : []; }
if (window.speechSynthesis) { ladeStimmen(); speechSynthesis.onvoiceschanged = ladeStimmen; }

function besteFranzStimme() {
  const fr = stimmen.filter((v) => /^fr/i.test(v.lang));
  const rang = (v) => (/google|natural|neural|online/i.test(v.name) ? 0 : 1) + (/^fr[-_]FR/i.test(v.lang) ? 0 : 0.5);
  return fr.sort((a, b) => rang(a) - rang(b))[0] || null;
}

function sprich(text) {
  if (!window.speechSynthesis || lsGet(LS.stimme, "1") !== "1") return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "fr-FR";
  const v = besteFranzStimme();
  if (v) u.voice = v;
  u.rate = 0.9;
  speechSynthesis.speak(u);
}

// ---------- Chat ----------
function blase(art, fr, de, korrektur) {
  const div = document.createElement("div");
  div.className = `blase ${art}`;
  const p = document.createElement("p");
  p.className = "blase-fr";
  p.textContent = fr;
  div.appendChild(p);
  if (art === "zeuge") {
    const b = document.createElement("button");
    b.className = "blase-ton";
    b.textContent = "🔊";
    b.setAttribute("aria-label", "Vorlesen");
    b.addEventListener("click", () => sprich(fr));
    div.appendChild(b);
  }
  if (de) {
    const d = document.createElement("p");
    d.className = "blase-de";
    d.textContent = "🇨🇭 " + de;
    div.appendChild(d);
  }
  if (korrektur) {
    const k = document.createElement("p");
    k.className = "blase-korrektur";
    k.textContent = "💡 " + korrektur;
    div.appendChild(k);
  }
  el.chat.appendChild(div);
  el.chat.scrollTop = el.chat.scrollHeight;
}

function systemMeldung(text, art = "") {
  const d = document.createElement("div");
  d.className = `systemmeldung ${art}`;
  d.textContent = text;
  el.chat.appendChild(d);
  el.chat.scrollTop = el.chat.scrollHeight;
}

// ---------- Spiel ----------
function renderVerdaechtige() {
  el.grid.innerHTML = "";
  state.verdaechtige.forEach((s, i) => {
    const b = document.createElement("button");
    b.className = "karte" + (state.ausgeschlossen.has(i) ? " weg" : "");
    b.innerHTML = `${gesichtSvg(s)}<span class="karte-name"></span>`;
    b.querySelector(".karte-name").textContent = s.name;
    b.addEventListener("click", () => klickKarte(i));
    el.grid.appendChild(b);
  });
}

function renderStatus() {
  el.fragen.textContent = state.fragen;
  el.punkte.textContent = state.gesamt;
  el.best.textContent = state.best;
  el.accuse.classList.toggle("aktiv", state.anklageModus);
  el.accuse.textContent = state.anklageModus ? "👆 Tippe auf den Dieb …" : "🔎 Dieb verhaften";
  el.status.textContent = state.vorbei ? "Runde beendet — starte eine neue!" : "";
}

function neueRunde() {
  state.verdaechtige = erzeugeVerdaechtige(ANZAHL_VERDAECHTIGE);
  state.dieb = zufall(state.verdaechtige);
  state.fragen = 0; state.falsch = 0; state.ausgeschlossen = new Set();
  state.anklageModus = false; state.vorbei = false; state.verlauf = [];
  el.chat.innerHTML = "";
  systemMeldung("🕵️ Ein Dieb hat eine Uhr gestohlen! Frag den Zeugen auf Französisch, wie der Dieb aussieht. Tippe Karten an, um sie auszuschliessen.");
  renderVerdaechtige();
  renderStatus();
}

function klickKarte(i) {
  if (state.vorbei) return;
  if (state.anklageModus) { verhafte(i); return; }
  if (state.ausgeschlossen.has(i)) state.ausgeschlossen.delete(i); else state.ausgeschlossen.add(i);
  renderVerdaechtige();
}

function punkteFuerRunde() { return Math.max(10, 100 - 8 * state.fragen - 20 * state.falsch); }

function verhafte(i) {
  state.anklageModus = false;
  const s = state.verdaechtige[i];
  if (s === state.dieb) gewonnen(); else {
    state.falsch++;
    state.ausgeschlossen.add(i);
    systemMeldung(`❌ ${s.name} ist unschuldig! (Mit „Est-ce que c'est ${s.name} ?“ kannst du auch fragen, bevor du verhaftest.)`, "schlecht");
    sprich(`Non, ce n'est pas ${s.name}.`);
    renderVerdaechtige();
  }
  renderStatus();
}

function gewonnen() {
  const p = punkteFuerRunde();
  state.gesamt += p; state.best = Math.max(state.best, p); state.vorbei = true;
  lsSet(LS.punkte, state.gesamt); lsSet(LS.best, state.best);
  systemMeldung(`🎉 Bravo! ${state.dieb.name} ist der Dieb! +${p} Punkte (${state.fragen} Fragen, ${state.falsch} Fehlversuche).`, "gut");
  sprich(`Bravo ! C'est ${state.dieb.name} ! La police arrive tout de suite.`);
  renderStatus();
}

// ---------- Zeuge (KI oder lokal) ----------
function systemPrompt() {
  const vok = VOKABELN.map((v) => `${v.fr} = ${v.de}`).join("\n");
  return `Du bist der Zeuge im Detektivspiel «Le jeu des détectives» für ein Schweizer Kind (5./6. Klasse, Französisch-Anfänger, Lehrmittel «Ça roule 6, Unité 1»).
Der gesuchte Dieb hat genau diese Merkmale (die Wahrheit, nie davon abweichen): ${beschreibeVerdaechtigen(state.dieb)}.
Das Kind stellt dir Fragen auf Französisch (oft «Est-ce qu'il/elle est/a/porte …?»). Regeln:
- Antworte ehrlich zu den Merkmalen, in 1–2 sehr kurzen, einfachen französischen Sätzen (Oui, … / Non, …). Nutze möglichst Wörter aus der Vokabelliste. Verrate nie den Namen und nie mehr als gefragt.
- Wurde etwas gefragt, das nicht in den Merkmalen steht, antworte: «Je ne sais pas.»
- Passe die Endungen korrekt an das Geschlecht des Diebs an (il/elle, grand/grande, vieux/vieille).
- Hat das Kind Deutsch gesprochen oder ist die Frage unverständlich: bitte höflich auf Französisch um eine neue Frage («Tu peux répéter, s'il te plaît ?») und gib im Feld «korrektur» einen Tipp auf Deutsch.
- Hat die Frage einen kleinen Fehler (Grammatik, Wortwahl), aber du verstehst sie: beantworte sie trotzdem und schreibe im Feld «korrektur» auf Deutsch kurz und freundlich, wie es richtig heisst (z.B. «Richtig: Est-ce qu'il porte des lunettes ?»). Sonst lass «korrektur» leer.
- «antwort_de» ist die deutsche Übersetzung deiner Antwort.
Antworte AUSSCHLIESSLICH mit einem JSON-Objekt: {"antwort_fr": "...", "antwort_de": "...", "korrektur": "..."}.
Vokabelliste:\n${vok}`;
}

async function fragZeuge(frage) {
  const key = lsGet(LS.key);
  if (!key) return { ...lokalerZeuge(frage, state.dieb), quelle: "lokal" };
  const messages = [...state.verlauf, { role: "user", content: frage }].slice(-12);
  while (messages[0].role !== "user") messages.shift();
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({ model: lsGet(LS.model) || STANDARD_MODEL, max_tokens: 400, system: systemPrompt(), messages }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    const text = data.content.map((c) => c.text || "").join("");
    const j = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    state.verlauf = [...messages, { role: "assistant", content: JSON.stringify(j) }];
    return { fr: j.antwort_fr, de: j.antwort_de, korrektur: j.korrektur || "", quelle: "ki" };
  } catch (e) {
    return { ...lokalerZeuge(frage, state.dieb), quelle: "lokal", fehler: e.message };
  }
}

function nameInFrage(frage) {
  const q = normalisiere(frage);
  return state.verdaechtige.findIndex((s) => /c'est/.test(q) && q.includes(normalisiere(s.name)));
}

async function sendeFrage(text) {
  text = text.trim();
  if (!text || state.vorbei || state.wartet) return;
  el.eingabe.value = "";
  blase("kind", text);

  // «Est-ce que c'est Léa ?» = Verdacht auf eine Person
  const idx = nameInFrage(text);
  if (idx >= 0) {
    state.fragen++;
    const s = state.verdaechtige[idx];
    if (s === state.dieb) { blase("zeuge", `Oui ! C'est ${s.name} !`, `Ja! Es ist ${s.name}!`); gewonnen(); sprich(`Oui ! C'est ${s.name} !`); }
    else { state.falsch++; state.ausgeschlossen.add(idx); blase("zeuge", `Non, ce n'est pas ${s.name}.`, `Nein, es ist nicht ${s.name}.`); sprich(`Non, ce n'est pas ${s.name}.`); renderVerdaechtige(); }
    renderStatus();
    return;
  }

  state.fragen++;
  state.wartet = true; el.senden.disabled = true;
  const denk = document.createElement("div");
  denk.className = "blase zeuge denkt"; denk.textContent = "…";
  el.chat.appendChild(denk);
  const a = await fragZeuge(text);
  denk.remove();
  state.wartet = false; el.senden.disabled = false;
  if (a.fehler) systemMeldung(`⚠️ KI nicht erreichbar (${a.fehler}) — der einfache Zeuge antwortet.`);
  blase("zeuge", a.fr, a.de, a.korrektur);
  sprich(a.fr);
  renderStatus();
}

// ---------- Frage-Baukasten (Spickzettel) ----------
function bereinige(t) {
  return t.replace(/\s*\/\s*elle/g, "").replace(/\(e\)/g, "").replace(/\s*\/\s*vieille/g, "");
}

function renderBaukasten() {
  FRAGE_BAUKASTEN.forEach((b) => {
    const box = document.createElement("div");
    box.className = "bk-block";
    const kopf = document.createElement("div");
    kopf.className = "bk-start";
    kopf.textContent = b.start + " …";
    box.appendChild(kopf);
    const chips = document.createElement("div");
    chips.className = "bk-chips";
    b.gruppen.flat().forEach(([fr, de]) => {
      const c = document.createElement("button");
      c.className = "chip";
      c.textContent = fr;
      c.title = de;
      c.addEventListener("click", () => {
        const frage = `${bereinige(b.start)} ${bereinige(fr)} ?`;
        el.eingabe.value = frage;
        el.eingabe.focus();
        sprich(frage);
      });
      chips.appendChild(c);
    });
    box.appendChild(chips);
    el.baukasten.appendChild(box);
  });
  const nameBox = document.createElement("div");
  nameBox.className = "bk-block";
  nameBox.innerHTML = `<div class="bk-start">Est-ce que c'est … <small>(Name)</small></div><div class="bk-hinweis">z.B. «Est-ce que c'est Léa ?» – so fragst du direkt nach einer Person.</div>`;
  el.baukasten.appendChild(nameBox);
}

// ---------- Mikrofon ----------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let erkenner = null;
function mikro() {
  if (!SR) { el.status.textContent = "Spracheingabe geht in diesem Browser nicht — bitte Chrome (Android/PC) nutzen oder tippen."; return; }
  if (erkenner) { erkenner.stop(); return; }
  if (window.speechSynthesis) speechSynthesis.cancel();
  erkenner = new SR();
  erkenner.lang = "fr-FR";
  erkenner.interimResults = true;
  erkenner.maxAlternatives = 1;
  el.mic.classList.add("hoert");
  let final = "";
  erkenner.onresult = (e) => {
    let t = "";
    for (const r of e.results) { t += r[0].transcript; if (r.isFinal) final = t; }
    el.eingabe.value = t;
  };
  erkenner.onerror = (e) => { el.status.textContent = e.error === "not-allowed" ? "Mikrofon nicht erlaubt — bitte Zugriff freigeben." : `Mikrofon-Fehler: ${e.error}`; };
  erkenner.onend = () => {
    el.mic.classList.remove("hoert");
    erkenner = null;
    if (el.eingabe.value.trim()) sendeFrage(el.eingabe.value);
  };
  erkenner.start();
}

// ---------- Vokabeln ----------
function renderVokabeln() {
  const f = el.vokFilter.value;
  el.vokListe.innerHTML = "";
  VOKABELN.filter((v) => f === "alle" || v.kat === f).forEach((v) => {
    const z = document.createElement("div");
    z.className = "vok";
    const b = document.createElement("button");
    b.className = "blase-ton"; b.textContent = "🔊";
    b.setAttribute("aria-label", "Vorlesen");
    b.addEventListener("click", () => sprich(`${v.fr.replace(/\(.*?\)/g, "")}. ${v.satz}`));
    const t = document.createElement("div");
    const fr = document.createElement("strong"); fr.textContent = v.fr;
    const de = document.createElement("span"); de.textContent = " — " + v.de;
    const sa = document.createElement("div"); sa.className = "vok-satz"; sa.textContent = v.satz;
    t.append(fr, de, sa);
    z.append(b, t);
    el.vokListe.appendChild(z);
  });
}

// ---------- Einstellungen ----------
async function testeKey() {
  lsSet(LS.key, el.key.value.trim()); lsSet(LS.model, el.model.value.trim());
  el.keyStatus.textContent = "Teste …";
  if (!state.dieb) neueRunde();
  const a = await fragZeuge("Est-ce que c'est une femme ?");
  el.keyStatus.textContent = a.quelle === "ki" ? `✅ KI antwortet: ${a.fr}` : `⚠️ ${a.fehler ? "Fehler: " + a.fehler : "Kein Key gesetzt"} — es wird der einfache Zeuge benutzt.`;
}

function zeigeAnsicht(name) {
  Object.entries(el.ansichten).forEach(([k, v]) => v.classList.toggle("hidden", k !== name));
  el.tabs.forEach((t) => t.classList.toggle("aktiv", t.dataset.ansicht === name));
}

el.tabs.forEach((t) => t.addEventListener("click", () => zeigeAnsicht(t.dataset.ansicht)));
el.senden.addEventListener("click", () => sendeFrage(el.eingabe.value));
el.eingabe.addEventListener("keydown", (e) => { if (e.key === "Enter") sendeFrage(el.eingabe.value); });
el.mic.addEventListener("click", mikro);
el.accuse.addEventListener("click", () => { if (state.vorbei) return; state.anklageModus = !state.anklageModus; renderStatus(); });
el.neu.addEventListener("click", neueRunde);
el.vokFilter.addEventListener("change", renderVokabeln);
el.keyTest.addEventListener("click", testeKey);
el.key.addEventListener("change", () => lsSet(LS.key, el.key.value.trim()));
el.model.addEventListener("change", () => lsSet(LS.model, el.model.value.trim()));
el.stimme.addEventListener("change", () => lsSet(LS.stimme, el.stimme.checked ? "1" : "0"));

el.key.value = lsGet(LS.key);
el.model.value = lsGet(LS.model) || STANDARD_MODEL;
el.stimme.checked = lsGet(LS.stimme, "1") === "1";
Object.entries(KATEGORIEN).forEach(([k, v]) => el.vokFilter.add(new Option(v, k)));
renderBaukasten();
renderVokabeln();
neueRunde();

// PWA
let installEvent = null;
window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installEvent = e; el.install.classList.remove("hidden"); });
el.install.addEventListener("click", async () => { if (installEvent) { installEvent.prompt(); installEvent = null; el.install.classList.add("hidden"); } });
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
