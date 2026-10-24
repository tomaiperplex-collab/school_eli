// deutsch/baumuster.js — Interaktive Baumuster-Übung: Buchstaben per Ziehen
// (oder Antippen) in das Silbenmodell setzen. Jedes Baumuster ist ein
// eigenes Thema (siehe data.js: BAUMUSTER_STUFEN / BAUMUSTER_WOERTER); die
// Theorie mit Beispielen steht im Theorie-Panel vor der Übung und lässt sich
// hier oben nochmal aufklappen. Verbucht wird über app.js
// (verbucheBaumusterAntwort, starteMcUebung).

const BM_ANZAHL_MIX = 8;
const BM_STOERBUCHSTABEN = ["a", "e", "i", "o", "u", "n", "r", "s", "t", "l", "m", "h", "k", "d"];

const bm = {
  stufe: null,
  woerter: [],
  index: 0,
  zellen: [], // Index = Kästchen, Wert = Kachel-Id oder null
  kacheln: [], // [{ id, buchstabe }]
  auswahl: null, // angetippte Kachel
  geprueft: false,
  ersterVersuch: true,
  richtig: 0,
};

function bmStufe(nr) {
  return BAUMUSTER_STUFEN.find((s) => s.nr === nr);
}

function bmMischen(liste) {
  const kopie = liste.slice();
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

// Statisches Silbenmodell (Hauptsilbe + Nebensilbe) für Beispiele.
function bmModellHtml(zellen, lang) {
  const kaestchen = (i) => {
    const b = zellen[i];
    let klasse = "bm-kaestchen";
    if (!b) klasse += " leer";
    else if (i === 1) klasse += lang ? " lang" : " kurz";
    else if (i === 4) klasse += " nebe";
    else if (i === 3 && b === "h") klasse += " h";
    return `<span class="${klasse}">${b || "·"}</span>`;
  };
  return `<span class="bm-silbe haupt">${[0, 1, 2].map(kaestchen).join("")}</span>` +
    `<span class="bm-silbe">${[3, 4, 5].map(kaestchen).join("")}</span>`;
}

// Beispiel-Karten, werden von app.js unter die Theorie gehängt.
function baumusterBeispieleHtml(nr) {
  const stufe = bmStufe(nr);
  const karten = stufe.beispiele.map((wort, i) => {
    const lang = stufe.mix ? [true, false, false, true][i] : stufe.lang;
    return `<div class="bm-beispiel"><div class="bm-modell">${bmModellHtml(BAUMUSTER_WOERTER[wort], lang)}</div><strong>${wort}</strong></div>`;
  }).join("");
  const legende = `<p class="bm-legende"><span class="bm-punkt lang"></span> Vokal lang
    <span class="bm-punkt kurz"></span> Vokal kurz
    <span class="bm-punkt nebe"></span> e der Nebensilbe</p>`;
  return `<div class="bm-beispiele">${karten}</div>${legende}`;
}

function baumusterStart() {
  const stufe = bmStufe(state.thema.baumusterNr);
  bm.stufe = stufe;
  const alle = BAUMUSTER_STUFEN.filter((s) => s.woerter).flatMap((s) => s.woerter);
  bm.woerter = stufe.mix ? bmMischen(alle).slice(0, BM_ANZAHL_MIX) : bmMischen(stufe.woerter);
  bm.index = 0;
  bm.richtig = 0;
  bmNeuesWort();
}

function bmNeuesWort() {
  const wort = bm.woerter[bm.index];
  const buchstaben = BAUMUSTER_WOERTER[wort].filter(Boolean);
  // Mehrbuchstaben-Kacheln (au, ie, dr): der erste Buchstabe allein ist die Falle.
  const fallen = buchstaben.filter((b) => b.length > 1).map((b) => b[0]);
  const stoer = fallen.concat(bmMischen(BM_STOERBUCHSTABEN.filter((b) => !buchstaben.includes(b) && !fallen.includes(b)))).slice(0, 2);
  bm.kacheln = bmMischen(buchstaben.concat(stoer)).map((buchstabe, id) => ({ id, buchstabe }));
  bm.zellen = [null, null, null, null, null, null];
  bm.auswahl = null;
  bm.geprueft = false;
  bm.ersterVersuch = true;
  bmRender();
}

function bmRender(falsch = []) {
  const wort = bm.woerter[bm.index];
  const stufe = bm.stufe;
  const inhalt = document.getElementById("baumuster-inhalt");
  const platziert = new Set(bm.zellen.filter((z) => z !== null));
  const kachelHtml = (k, inZelle) =>
    `<span class="bm-kachel${bm.auswahl === k.id ? " gewaehlt" : ""}${inZelle ? " platziert" : ""}" data-kachel="${k.id}">${k.buchstabe}</span>`;
  const zelleHtml = (i) => {
    const k = bm.zellen[i] !== null ? bm.kacheln[bm.zellen[i]] : null;
    let klasse = "bm-zelle";
    if (i === 1) klasse += " vokal";
    if (falsch.includes(i)) klasse += " falsch";
    if (bm.geprueft && !falsch.length) klasse += " richtig";
    return `<span class="${klasse}" data-zelle="${i}">${k ? kachelHtml(k, true) : ""}</span>`;
  };
  const aufgabeText = stufe.mix
    ? "Welches Baumuster passt? Setze die Buchstaben ins Silbenmodell:"
    : `Setze die Buchstaben ins ${stufe.titel}:`;

  inhalt.innerHTML = `
    <h2>${state.thema.icon} ${state.thema.name} <small class="bm-tag">${stufe.tag}</small></h2>
    <details class="bm-theorie-nochmal">
      <summary>📖 Theorie nochmal ansehen</summary>
      <div class="theorie-text">${state.thema.theorie}${baumusterBeispieleHtml(stufe.nr)}</div>
    </details>
    <p class="bm-zaehler">Wort ${bm.index + 1} von ${bm.woerter.length} · ✅ ${bm.richtig}</p>
    <p class="frage-text">${aufgabeText} <span class="bm-wort">${wort}</span></p>
    <div class="bm-modell gross" id="bm-modell">
      <span class="bm-silbe haupt"><small>Hauptsilbe</small>${[0, 1, 2].map(zelleHtml).join("")}</span>
      <span class="bm-silbe"><small>Nebensilbe</small>${[3, 4, 5].map(zelleHtml).join("")}</span>
    </div>
    <div class="bm-ablage" id="bm-ablage">
      ${bm.kacheln.filter((k) => !platziert.has(k.id)).map((k) => kachelHtml(k, false)).join("")}
    </div>
    <p id="bm-feedback" class="feedback" aria-live="polite"></p>
    <div class="bm-knoepfe" id="bm-knoepfe"></div>
  `;
  bmKnoepfe();
  bmBindeZiehen();
}

function bmKnoepfe(nachPruefung) {
  const box = document.getElementById("bm-knoepfe");
  box.innerHTML = "";
  const knopf = (text, klasse, fn) => {
    const b = document.createElement("button");
    b.className = `big-btn ${klasse || ""}`;
    b.textContent = text;
    b.addEventListener("click", fn);
    box.appendChild(b);
  };
  if (nachPruefung === "richtig") {
    const letztes = bm.index === bm.woerter.length - 1;
    knopf(letztes ? "Fertig ▶" : "Nächstes Wort ▶", "", () => {
      if (letztes) bmAbschluss();
      else { bm.index++; bmNeuesWort(); }
    });
  } else {
    knopf("Prüfen ✔", "", bmPruefen);
    knopf("Zurücksetzen", "zweit", () => {
      bm.zellen = [null, null, null, null, null, null];
      bm.auswahl = null;
      bmRender();
    });
  }
}

function bmPruefen() {
  const soll = BAUMUSTER_WOERTER[bm.woerter[bm.index]];
  const falsch = [];
  soll.forEach((b, i) => {
    const ist = bm.zellen[i] !== null ? bm.kacheln[bm.zellen[i]].buchstabe : "";
    if (ist !== b) falsch.push(i);
  });
  bm.geprueft = true;
  const korrekt = falsch.length === 0;
  if (bm.ersterVersuch) {
    bm.ersterVersuch = false;
    verbucheBaumusterAntwort(korrekt);
    if (korrekt) bm.richtig++;
  }
  bmRender(falsch);
  const fb = document.getElementById("bm-feedback");
  if (korrekt) {
    fb.textContent = "✅ Richtig!";
    fb.className = "feedback richtig";
    bmKnoepfe("richtig");
    document.querySelector(".bm-zaehler").textContent =
      `Wort ${bm.index + 1} von ${bm.woerter.length} · ✅ ${bm.richtig}`;
  } else {
    fb.textContent = `❌ Noch nicht ganz. ${bm.stufe.hinweis}`;
    fb.className = "feedback falsch";
    bm.geprueft = false;
  }
}

function bmAbschluss() {
  const inhalt = document.getElementById("baumuster-inhalt");
  const naechste = bm.stufe.nr < 5 ? BAUMUSTER_STUFEN.find((s) => s.nr === bm.stufe.nr + 1) : null;
  inhalt.innerHTML = `
    <h2>🎉 ${state.thema.name} geschafft!</h2>
    <p class="intro-text">${bm.richtig} von ${bm.woerter.length} Wörtern gleich beim ersten Versuch richtig.</p>
    <div class="bm-knoepfe">
      <button class="big-btn" id="bm-nochmal">🔁 Nochmal üben</button>
      <button class="big-btn zweit" id="bm-mc">❓ Quiz-Fragen dazu</button>
    </div>`;
  document.getElementById("bm-nochmal").addEventListener("click", baumusterStart);
  document.getElementById("bm-mc").addEventListener("click", starteMcUebung);
  if (naechste) {
    const hinweis = document.createElement("p");
    hinweis.className = "intro-text";
    hinweis.textContent = `Weiter geht's im Thema „${naechste.titel}“ — wähle es oben in der Themenauswahl.`;
    inhalt.appendChild(hinweis);
  }
}

// --- Ziehen & Antippen ---

function bmPlatziere(kachelId, zelle) {
  const alt = bm.zellen.indexOf(kachelId);
  if (alt !== -1) bm.zellen[alt] = null;
  // Belegtes Kästchen: die verdrängte Kachel geht zurück in die Ablage.
  bm.zellen[zelle] = kachelId;
  bm.auswahl = null;
  bmRender();
}

function bmEntferne(kachelId) {
  const alt = bm.zellen.indexOf(kachelId);
  if (alt !== -1) bm.zellen[alt] = null;
  bm.auswahl = null;
  bmRender();
}

function bmBindeZiehen() {
  const inhalt = document.getElementById("baumuster-inhalt");
  inhalt.querySelectorAll(".bm-kachel").forEach((el) => {
    el.addEventListener("pointerdown", (e) => bmPointerDown(e, el));
  });
  inhalt.querySelectorAll(".bm-zelle").forEach((el) => {
    el.addEventListener("click", () => {
      // Tippen auf leeres Kästchen setzt die gewählte Kachel hinein.
      if (bm.auswahl !== null && !el.querySelector(".bm-kachel")) {
        bmPlatziere(bm.auswahl, Number(el.dataset.zelle));
      }
    });
  });
}

function bmPointerDown(e, kachelEl) {
  if (e.button !== undefined && e.button !== 0) return;
  e.preventDefault();
  const id = Number(kachelEl.dataset.kachel);
  const startX = e.clientX;
  const startY = e.clientY;
  let geist = null;

  const bewege = (ev) => {
    if (!geist && Math.hypot(ev.clientX - startX, ev.clientY - startY) < 6) return;
    if (!geist) {
      geist = kachelEl.cloneNode(true);
      geist.classList.add("bm-geist");
      document.body.appendChild(geist);
      kachelEl.classList.add("zieht");
    }
    geist.style.left = `${ev.clientX}px`;
    geist.style.top = `${ev.clientY}px`;
  };

  const ende = (ev) => {
    document.removeEventListener("pointermove", bewege);
    document.removeEventListener("pointerup", ende);
    document.removeEventListener("pointercancel", ende);
    if (!geist) {
      // Kein Ziehen → Antippen
      if (kachelEl.classList.contains("platziert")) bmEntferne(id);
      else { bm.auswahl = bm.auswahl === id ? null : id; bmRender(); }
      return;
    }
    geist.remove();
    const ziel = document.elementFromPoint(ev.clientX, ev.clientY);
    const zelle = ziel && ziel.closest(".bm-zelle");
    if (zelle) bmPlatziere(id, Number(zelle.dataset.zelle));
    else if (kachelEl.classList.contains("platziert")) bmEntferne(id);
    else bmRender();
  };

  document.addEventListener("pointermove", bewege);
  document.addEventListener("pointerup", ende);
  document.addEventListener("pointercancel", ende);
}
