// spiele/kahoot.js — Kahoot-ähnliches Quiz «Stadt Bern».
// Fragen: kahoot-data.js (BERN_THEMEN, BERN_FAKTEN, BERN_FRAGEN).
//
// Ablauf: Start (Spieler/Umfang/Zeit) -> pro Frage [Spielerwechsel] -> Frage
// mit Zeitbalken -> Auflösung -> ... -> Ergebnis (Podest, Statistik, Üben).
// Punkte wie bei Kahoot: 500–1000 je nach Tempo + Serien-Bonus (bis +500).

const KH_STORAGE_KEY = "kahootStadtBern.rekord.v1";
const KH_FORMEN = [
  { farbe: "rot", zeichen: "▲", name: "Rot" },
  { farbe: "blau", zeichen: "◆", name: "Blau" },
  { farbe: "gelb", zeichen: "●", name: "Gelb" },
  { farbe: "gruen", zeichen: "■", name: "Grün" },
];
const KH_SCHNELLRUNDE = 20;
const KH_MAX_SPIELER = 4;

const stage = document.getElementById("kh-stage");

const kh = {
  phase: "setup", // setup | wechsel | frage | aufloesung | ende
  einst: { spieler: 1, namen: ["", "", "", ""], umfang: "alle", themen: new Set(Object.keys(BERN_THEMEN)), zeit: 30, ton: true },
  pool: [],
  spieler: [],
  index: 0,
  aktuell: null, // { q, optionen, spielerIdx }
  gestartetAm: 0,
  limitMs: 30000,
  timer: null,
  gesperrt: false,
  verlauf: [], // { q, spielerIdx, richtig, gewaehlt }
};

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function mischen(liste) {
  const a = liste.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function rekordLaden() {
  try { return JSON.parse(localStorage.getItem(KH_STORAGE_KEY)) || {}; } catch (e) { return {}; }
}
function rekordSpeichern(r) {
  try { localStorage.setItem(KH_STORAGE_KEY, JSON.stringify(r)); } catch (e) { /* ignorieren */ }
}

function fragenFuerThemen(themen) {
  return BERN_FRAGEN.filter((q) => themen.has(q.t));
}
function faktenIn(fragen) {
  const ids = new Set();
  fragen.forEach((q) => q.f.forEach((id) => ids.add(id)));
  return ids;
}

// ---------------------------------------------------------------------------
// Ton (WebAudio, nur kurze Signale — keine Dauermusik)
// ---------------------------------------------------------------------------
let audioCtx = null;
function ton(noten) {
  if (!kh.einst.ton) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    let t = audioCtx.currentTime;
    noten.forEach(([freq, dauer, typ]) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = typ || "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dauer);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + dauer);
      t += dauer * 0.9;
    });
  } catch (e) { /* Audio nicht verfügbar */ }
}
const TON_RICHTIG = [[523, 0.12], [659, 0.12], [784, 0.25]];
const TON_FALSCH = [[220, 0.18, "sawtooth"], [165, 0.3, "sawtooth"]];
const TON_ENDE = [[523, 0.15], [659, 0.15], [784, 0.15], [1047, 0.4]];

// ---------------------------------------------------------------------------
// Startbildschirm
// ---------------------------------------------------------------------------
function zeigeSetup() {
  kh.phase = "setup";
  stopTimer();
  const e = kh.einst;
  const fragen = fragenFuerThemen(e.themen);
  const alleThemen = e.themen.size === Object.keys(BERN_THEMEN).length;
  const anzahl = e.umfang === "alle" ? fragen.length : Math.min(KH_SCHNELLRUNDE, fragen.length);
  const fakten = faktenIn(e.umfang === "alle" ? fragen : []);

  const namenFelder = Array.from({ length: e.spieler }, (_, i) => {
    const platzhalter = e.spieler === 1 ? "Dein Name (optional)" : `Spieler ${i + 1}`;
    return `<input type="text" maxlength="14" data-name="${i}" placeholder="${platzhalter}" value="${esc(e.namen[i])}" aria-label="Name Spieler ${i + 1}" />`;
  }).join("");

  const themenChips = Object.entries(BERN_THEMEN).map(([key, t]) => `
    <label class="kh-chip" style="--chip:${t.farbe}">
      <input type="checkbox" data-thema="${key}" ${e.themen.has(key) ? "checked" : ""} /> ${t.symbol} ${esc(t.label)}
    </label>`).join("");

  let hinweis;
  if (e.umfang === "alle" && alleThemen) {
    hinweis = `<strong>${anzahl} Fragen</strong> – damit kommen <strong>alle ${BERN_FAKTEN.length} Fakten</strong> aus dem Lernziel-Heft dran.`;
  } else if (e.umfang === "alle") {
    hinweis = `<strong>${anzahl} Fragen</strong> aus den gewählten Themen (${fakten.size} Fakten).`;
  } else {
    hinweis = `<strong>${anzahl} zufällige Fragen</strong> – eine schnelle Runde zum Aufwärmen.`;
  }

  stage.innerHTML = `
    <h1 class="kh-titel">🐻 Stadt-Bern-Quiz</h1>
    <p class="kh-lead">Schnell antworten gibt mehr Punkte. Mehrere richtige Antworten hintereinander geben einen Serien-Bonus!</p>
    <div class="kh-setup-grid">
      <div class="kh-karte">
        <h3>👥 Wie viele Spieler?</h3>
        <div class="kh-seg" role="radiogroup" aria-label="Spieleranzahl">
          ${[1, 2, 3, 4].map((n) => `<label><input type="radio" name="spieler" value="${n}" ${e.spieler === n ? "checked" : ""} />${n === 1 ? "Solo" : n + " Spieler"}</label>`).join("")}
        </div>
        <div class="kh-namen">${namenFelder}</div>
        ${e.spieler > 1 ? `<p class="kh-fakten-hinweis">Spieler kommen <strong>reihum</strong> dran: Das Gerät wird nach jeder Frage weitergegeben.</p>` : ""}
      </div>
      <div class="kh-karte">
        <h3>📚 Wie viele Fragen?</h3>
        <div class="kh-seg" role="radiogroup" aria-label="Umfang">
          <label><input type="radio" name="umfang" value="alle" ${e.umfang === "alle" ? "checked" : ""} />Alle Fragen</label>
          <label><input type="radio" name="umfang" value="schnell" ${e.umfang === "schnell" ? "checked" : ""} />Schnellrunde (${KH_SCHNELLRUNDE})</label>
        </div>
        <div class="kh-chips">${themenChips}</div>
        <p class="kh-fakten-hinweis">${hinweis}</p>
      </div>
      <div class="kh-karte kh-zeile">
        <label>⏱️ Zeit pro Frage
          <select id="kh-zeit">
            ${[20, 30, 45, 60].map((s) => `<option value="${s}" ${e.zeit === s ? "selected" : ""}>${s} Sekunden</option>`).join("")}
          </select>
        </label>
        <label><input type="checkbox" id="kh-ton-an" ${e.ton ? "checked" : ""} /> 🔊 Töne</label>
      </div>
    </div>
    <div class="kh-start">
      <button class="kh-btn gross" id="kh-start" ${fragen.length ? "" : "disabled"}>Los geht's!</button>
    </div>
    ${rekordHtml()}
  `;

  stage.querySelectorAll('input[name="spieler"]').forEach((r) => r.addEventListener("change", () => { namenSichern(); e.spieler = Number(r.value); zeigeSetup(); }));
  stage.querySelectorAll('input[name="umfang"]').forEach((r) => r.addEventListener("change", () => { namenSichern(); e.umfang = r.value; zeigeSetup(); }));
  stage.querySelectorAll("[data-thema]").forEach((c) => c.addEventListener("change", () => {
    namenSichern();
    if (c.checked) e.themen.add(c.dataset.thema); else e.themen.delete(c.dataset.thema);
    zeigeSetup();
  }));
  stage.querySelector("#kh-zeit").addEventListener("change", (ev) => { e.zeit = Number(ev.target.value); });
  stage.querySelector("#kh-ton-an").addEventListener("change", (ev) => { e.ton = ev.target.checked; });
  stage.querySelector("#kh-start").addEventListener("click", () => { namenSichern(); starteSpiel(); });
}

function namenSichern() {
  stage.querySelectorAll("[data-name]").forEach((inp) => { kh.einst.namen[Number(inp.dataset.name)] = inp.value.trim(); });
}

function rekordHtml() {
  const r = rekordLaden();
  if (!r.punkte) return "";
  return `<p class="kh-lead" style="margin-top:1rem">🏆 Dein Rekord (Solo, alle Fragen): <strong>${r.punkte} Punkte</strong> · ${r.prozent}% richtig</p>`;
}

// ---------------------------------------------------------------------------
// Spielstart & Fragenablauf
// ---------------------------------------------------------------------------
function starteSpiel(eigenerPool) {
  const e = kh.einst;
  let fragen = eigenerPool || fragenFuerThemen(e.themen);
  fragen = mischen(fragen);
  if (!eigenerPool && e.umfang === "schnell") fragen = fragen.slice(0, KH_SCHNELLRUNDE);
  kh.pool = fragen;
  kh.index = 0;
  kh.verlauf = [];
  kh.limitMs = e.zeit * 1000;
  kh.spieler = Array.from({ length: e.spieler }, (_, i) => ({
    name: e.namen[i] || (e.spieler === 1 ? "Du" : `Spieler ${i + 1}`),
    punkte: 0,
    serie: 0,
    besteSerie: 0,
    richtig: 0,
    gesamt: 0,
  }));
  naechsteFrage();
}

function naechsteFrage() {
  if (kh.index >= kh.pool.length) { zeigeEnde(); return; }
  const q = kh.pool[kh.index];
  const spielerIdx = kh.index % kh.spieler.length;
  let optionen;
  if (q.typ === "tf") {
    optionen = [
      { text: "Wahr", ok: q.wahr, farbe: "blau", zeichen: "◆" },
      { text: "Falsch", ok: !q.wahr, farbe: "rot", zeichen: "▲" },
    ];
  } else {
    optionen = mischen([{ text: q.a, ok: true }, ...q.falsch.map((t) => ({ text: t, ok: false }))])
      .map((o, i) => ({ ...o, farbe: KH_FORMEN[i].farbe, zeichen: KH_FORMEN[i].zeichen }));
  }
  kh.aktuell = { q, optionen, spielerIdx };
  if (kh.spieler.length > 1) zeigeWechsel(); else zeigeFrage();
}

function zeigeWechsel() {
  kh.phase = "wechsel";
  const s = kh.spieler[kh.aktuell.spielerIdx];
  stage.innerHTML = `
    <div class="kh-wechsel">
      <div class="kh-pille" style="display:inline-block">Frage ${kh.index + 1} von ${kh.pool.length}</div>
      <p class="kh-lead" style="margin-top:1rem">Gerät weitergeben an</p>
      <div class="name">${esc(s.name)}</div>
      <button class="kh-btn gross" id="kh-bereit">Bereit!</button>
    </div>`;
  stage.querySelector("#kh-bereit").addEventListener("click", zeigeFrage);
  stage.querySelector("#kh-bereit").focus();
}

function kopfHtml() {
  const a = kh.aktuell;
  const s = kh.spieler[a.spielerIdx];
  const thema = BERN_THEMEN[a.q.t];
  return `
    <div class="kh-kopf">
      <span class="kh-pille">Frage ${kh.index + 1} / ${kh.pool.length}</span>
      <span class="kh-thema" style="background:${thema.farbe}">${thema.symbol} ${esc(thema.label)}</span>
      <span class="kh-pille">${kh.spieler.length > 1 ? esc(s.name) + " · " : ""}${s.punkte} Punkte${s.serie >= 2 ? " · 🔥 " + s.serie : ""}</span>
      <button class="kh-ton" id="kh-ton-btn" aria-label="Ton ein/aus">${kh.einst.ton ? "🔊" : "🔇"}</button>
    </div>`;
}

function zeigeFrage() {
  kh.phase = "frage";
  kh.gesperrt = false;
  const a = kh.aktuell;
  const istTf = a.q.typ === "tf";
  stage.innerHTML = `
    ${kopfHtml()}
    <div class="kh-zeitbalken" id="kh-zeitbalken"><div></div></div>
    <div class="kh-frage">${esc(a.q.q)}</div>
    ${istTf ? `<p class="kh-warten" style="margin:0 0 .6rem">Stimmt die Aussage?</p>` : ""}
    <div class="kh-antworten ${istTf ? "tf" : ""}">
      ${a.optionen.map((o, i) => `
        <button class="kh-antwort ${o.farbe} ${istTf ? "tf" : ""}" data-i="${i}">
          <span class="form" aria-hidden="true">${o.zeichen}</span><span>${esc(o.text)}</span>
        </button>`).join("")}
    </div>
    <p class="kh-warten"><span class="kh-timer-zahl" id="kh-sekunden">${Math.ceil(kh.limitMs / 1000)}</span> s</p>
  `;
  stage.querySelectorAll(".kh-antwort").forEach((b) => b.addEventListener("click", () => antworten(Number(b.dataset.i))));
  stage.querySelector("#kh-ton-btn").addEventListener("click", tonUmschalten);

  kh.gestartetAm = performance.now();
  stopTimer();
  kh.timer = setInterval(tick, 100);
}

function tonUmschalten() {
  kh.einst.ton = !kh.einst.ton;
  const b = stage.querySelector("#kh-ton-btn");
  if (b) b.textContent = kh.einst.ton ? "🔊" : "🔇";
}

function stopTimer() {
  if (kh.timer) { clearInterval(kh.timer); kh.timer = null; }
}

function tick() {
  const verbraucht = performance.now() - kh.gestartetAm;
  const rest = Math.max(0, kh.limitMs - verbraucht);
  const anteil = rest / kh.limitMs;
  const balken = stage.querySelector("#kh-zeitbalken");
  const zahl = stage.querySelector("#kh-sekunden");
  if (!balken || !zahl) return;
  balken.firstElementChild.style.width = `${anteil * 100}%`;
  balken.classList.toggle("knapp", anteil < 0.4 && anteil >= 0.2);
  balken.classList.toggle("sehr-knapp", anteil < 0.2);
  zahl.textContent = Math.ceil(rest / 1000);
  if (rest <= 0) antworten(-1);
}

function antworten(i) {
  if (kh.gesperrt || kh.phase !== "frage") return;
  kh.gesperrt = true;
  stopTimer();
  const a = kh.aktuell;
  const verbraucht = Math.min(performance.now() - kh.gestartetAm, kh.limitMs);
  const gewaehlt = i >= 0 ? a.optionen[i] : null;
  const richtig = !!(gewaehlt && gewaehlt.ok);

  const s = kh.spieler[a.spielerIdx];
  s.gesamt += 1;
  let punkte = 0;
  let bonus = 0;
  if (richtig) {
    punkte = Math.round(1000 * (1 - (verbraucht / kh.limitMs) / 2));
    s.serie += 1;
    s.besteSerie = Math.max(s.besteSerie, s.serie);
    bonus = s.serie >= 2 ? Math.min(s.serie - 1, 5) * 100 : 0;
    s.punkte += punkte + bonus;
    s.richtig += 1;
  } else {
    s.serie = 0;
  }
  kh.verlauf.push({ q: a.q, spielerIdx: a.spielerIdx, richtig });
  a.ergebnis = { richtig, punkte, bonus, zeitUeberschritten: i < 0, gewaehlt: i };

  // Gewählte Antwort kurz markieren, dann auflösen.
  stage.querySelectorAll(".kh-antwort").forEach((b) => {
    b.disabled = true;
    if (Number(b.dataset.i) === i) b.classList.add("gewaehlt"); else b.classList.add("weg");
  });
  const w = stage.querySelector(".kh-warten:last-child");
  if (w) w.textContent = i >= 0 ? "Antwort gespeichert …" : "Zeit abgelaufen!";
  setTimeout(zeigeAufloesung, 700);
}

function zeigeAufloesung() {
  kh.phase = "aufloesung";
  const a = kh.aktuell;
  const r = a.ergebnis;
  const s = kh.spieler[a.spielerIdx];
  const richtigeAntwort = a.optionen.find((o) => o.ok).text;
  const istTf = a.q.typ === "tf";

  ton(r.richtig ? TON_RICHTIG : TON_FALSCH);

  let banner;
  if (r.richtig) {
    banner = `<div class="kh-banner richtig">✔ Richtig! +${r.punkte + r.bonus}<small>${r.bonus ? `inkl. ${r.bonus} Serien-Bonus 🔥 (${s.serie} in Folge)` : "Schnell antworten gibt mehr Punkte"}</small></div>`;
  } else {
    banner = `<div class="kh-banner falsch">${r.zeitUeberschritten ? "⏱️ Zeit abgelaufen" : "✘ Leider falsch"}<small>Richtige Antwort: ${esc(richtigeAntwort)}</small></div>`;
  }

  const rangliste = kh.spieler.length > 1 ? `
    <ul class="kh-rangliste">
      ${kh.spieler.map((p, idx) => ({ p, idx })).sort((x, y) => y.p.punkte - x.p.punkte).map(({ p, idx }) =>
        `<li class="${idx === a.spielerIdx ? "dran" : ""}"><span>${esc(p.name)}</span><span>${p.punkte}</span></li>`).join("")}
    </ul>` : "";

  const letzte = kh.index + 1 >= kh.pool.length;
  stage.innerHTML = `
    ${kopfHtml()}
    ${banner}
    <div class="kh-karte kh-info">
      <b>${istTf ? "Merke:" : "Wusstest du?"}</b> ${esc(a.q.info)}
    </div>
    <div class="kh-antworten ${istTf ? "tf" : ""}" style="margin-top:.9rem">
      ${a.optionen.map((o, i) => `
        <div class="kh-antwort ${o.farbe} ${istTf ? "tf" : ""} ${o.ok ? "ok" : "nein weg"} ${i === r.gewaehlt ? "gewaehlt" : ""}">
          <span class="form" aria-hidden="true">${o.zeichen}</span><span>${esc(o.text)}</span>
        </div>`).join("")}
    </div>
    ${rangliste}
    <div class="kh-aktionen"><button class="kh-btn gross" id="kh-weiter">${letzte ? "Ergebnis anzeigen" : "Weiter →"}</button></div>
  `;
  stage.querySelector("#kh-ton-btn").addEventListener("click", tonUmschalten);
  const weiter = stage.querySelector("#kh-weiter");
  weiter.addEventListener("click", () => { kh.index += 1; naechsteFrage(); });
  weiter.focus();
}

// ---------------------------------------------------------------------------
// Ergebnis
// ---------------------------------------------------------------------------
function zeigeEnde() {
  kh.phase = "ende";
  stopTimer();
  ton(TON_ENDE);
  const solo = kh.spieler.length === 1;
  const gesamtRichtig = kh.spieler.reduce((n, p) => n + p.richtig, 0);
  const gesehen = faktenIn(kh.pool).size;

  let kopf;
  if (solo) {
    const p = kh.spieler[0];
    const prozent = Math.round((p.richtig / Math.max(1, p.gesamt)) * 100);
    const istAlle = kh.einst.umfang === "alle" && kh.einst.themen.size === Object.keys(BERN_THEMEN).length && kh.pool.length === BERN_FRAGEN.length;
    let rekordText = "";
    if (istAlle) {
      const alt = rekordLaden();
      if (!alt.punkte || p.punkte > alt.punkte) {
        rekordSpeichern({ punkte: p.punkte, prozent });
        rekordText = alt.punkte ? `<p class="kh-lead">🏆 Neuer Rekord! (vorher ${alt.punkte})</p>` : `<p class="kh-lead">🏆 Das ist dein erster Rekord!</p>`;
      } else {
        rekordText = `<p class="kh-lead">Dein Rekord: ${alt.punkte} Punkte</p>`;
      }
    }
    kopf = `
      <h2 class="kh-titel">${prozent >= 90 ? "🏆 Super!" : prozent >= 70 ? "👏 Gut gemacht!" : "💪 Weiter üben!"}</h2>
      <div class="kh-gross-punkte">${p.punkte} Punkte</div>
      <p class="kh-lead">${p.richtig} von ${p.gesamt} richtig (${prozent}%) · längste Serie: ${p.besteSerie}</p>
      ${rekordText}`;
  } else {
    const rang = kh.spieler.map((p, i) => ({ ...p, i })).sort((a, b) => b.punkte - a.punkte);
    const plaetze = [rang[1], rang[0], rang[2]]; // Podest: 2 – 1 – 3
    const nummern = [2, 1, 3];
    kopf = `
      <h2 class="kh-titel">🏆 ${esc(rang[0].name)} gewinnt!</h2>
      <div class="kh-podium">
        ${plaetze.map((p, k) => p ? `
          <div class="platz p${nummern[k]}">
            <div>${esc(p.name)}</div><div>${p.punkte}</div>
            <div class="balken">${nummern[k]}</div>
          </div>` : "").join("")}
      </div>
      <ul class="kh-rangliste">
        ${rang.map((p) => `<li><span>${esc(p.name)}</span><span>${p.punkte} Punkte · ${p.richtig}/${p.gesamt} richtig</span></li>`).join("")}
      </ul>`;
  }

  // Statistik pro Thema
  const proThema = {};
  kh.verlauf.forEach((v) => {
    const t = (proThema[v.q.t] = proThema[v.q.t] || { richtig: 0, gesamt: 0 });
    t.gesamt += 1;
    if (v.richtig) t.richtig += 1;
  });
  const statistik = Object.entries(proThema).map(([key, t]) => {
    const pr = Math.round((t.richtig / t.gesamt) * 100);
    const th = BERN_THEMEN[key];
    return `<div class="kh-stat-zeile"><span>${th.symbol} ${esc(th.label)}</span>
      <div class="kh-stat-balken"><div style="width:${pr}%;background:${th.farbe}"></div></div><span>${t.richtig}/${t.gesamt}</span></div>`;
  }).join("");

  // Falsch beantwortete Fragen zum Nachlesen
  const falsch = kh.verlauf.filter((v) => !v.richtig);
  const ueben = falsch.length ? `
    <div class="kh-karte kh-ergebnis-block">
      <h3>📝 Das übst du noch (${falsch.length})</h3>
      <ul class="kh-ueben">
        ${falsch.map((v) => `<li>
          <div>${esc(v.q.q)}</div>
          <div class="antwort">${v.q.typ === "tf" ? "Die Aussage ist " + (v.q.wahr ? "wahr" : "falsch") : esc(v.q.a)}</div>
          <div class="erklaerung">${esc(v.q.info)}</div>
        </li>`).join("")}
      </ul>
    </div>` : `<div class="kh-karte kh-ergebnis-block"><h3>🌟 Alles richtig!</h3><p>Keine einzige Frage falsch – das sitzt für die Prüfung.</p></div>`;

  stage.innerHTML = `
    ${kopf}
    <div class="kh-karte kh-ergebnis-block">
      <h3>📚 Abgedeckter Stoff</h3>
      <p>In dieser Runde kamen <strong>${gesehen} von ${BERN_FAKTEN.length} Fakten</strong> vor${gesehen === BERN_FAKTEN.length ? " – du hast den ganzen Stoff durchgespielt! ✅" : "."} (${gesamtRichtig} richtige Antworten)</p>
      <div class="kh-statistik">${statistik}</div>
    </div>
    ${ueben}
    <div class="kh-aktionen">
      ${falsch.length ? `<button class="kh-btn" id="kh-nochmal-falsch">Nur die ${falsch.length} falschen nochmal</button>` : ""}
      <button class="kh-btn gross" id="kh-neu">Neues Spiel</button>
    </div>
  `;
  stage.querySelector("#kh-neu").addEventListener("click", zeigeSetup);
  const nf = stage.querySelector("#kh-nochmal-falsch");
  if (nf) nf.addEventListener("click", () => starteSpiel(falsch.map((v) => v.q)));
}

// ---------------------------------------------------------------------------
// Tastatur: 1–4 wählt eine Antwort, Enter/Leertaste geht weiter
// ---------------------------------------------------------------------------
document.addEventListener("keydown", (ev) => {
  if (ev.target && /^(INPUT|SELECT|TEXTAREA)$/.test(ev.target.tagName)) return;
  if (kh.phase === "frage" && /^[1-4]$/.test(ev.key)) {
    const i = Number(ev.key) - 1;
    if (kh.aktuell && i < kh.aktuell.optionen.length) antworten(i);
  } else if (kh.phase === "aufloesung" && (ev.key === "Enter" || ev.key === " ")) {
    // Fokussierter «Weiter»-Button löst den Klick selbst aus.
    if (ev.target && ev.target.tagName === "BUTTON") return;
    ev.preventDefault();
    const b = stage.querySelector("#kh-weiter");
    if (b) b.click();
  }
});

zeigeSetup();
