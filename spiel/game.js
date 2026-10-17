// spiel/game.js — Spiellogik "Le jeu des détectives": Verdächtige erzeugen,
// als SVG-Figur zeichnen und lokal (ohne KI) Fragen zum Dieb beantworten.
// Die KI (app.js: fragZeuge) kennt dieselben Merkmale und antwortet freier;
// die lokale Variante ist der Fallback ohne API-Key / ohne Internet.

const NAMEN_M = ["Simon", "Luc", "Hugo", "Marc", "Paul", "Louis", "Jean", "Noah"];
const NAMEN_F = ["Léa", "Emma", "Chloé", "Zoé", "Inès", "Alice", "Lola", "Rose"];

const FARBEN = {
  vert: { fr: "vert(e)", de: "grün", hex: "#3f9a4f" },
  bleu: { fr: "bleu(e)", de: "blau", hex: "#3f6fb5" },
  noir: { fr: "noir(e)", de: "schwarz", hex: "#2b2b2b" },
  rouge: { fr: "rouge", de: "rot", hex: "#c0392b" },
};

function zufall(liste) { return liste[Math.floor(Math.random() * liste.length)]; }
function mische(liste) {
  const a = liste.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function signatur(s) {
  return [s.homme, s.taille, s.vieux, s.mince, s.cheveux, s.laenge, s.yeux, s.nez,
    s.moustache, s.lunettes, s.chapeau, s.haut, s.hautFarbe, s.chaussures].join("|");
}

// Erzeugt n Verdächtige mit paarweise verschiedenen Merkmalen.
function erzeugeVerdaechtige(n) {
  const gesehen = new Set();
  const namenM = mische(NAMEN_M), namenF = mische(NAMEN_F);
  const liste = [];
  while (liste.length < n) {
    const homme = Math.random() < 0.5;
    const s = {
      homme,
      taille: zufall(["grand", "petit"]),
      vieux: Math.random() < 0.3,
      mince: Math.random() < 0.5,
      cheveux: zufall(["blonds", "bruns"]),
      laenge: zufall(["longs", "courts"]),
      yeux: zufall(["bleus", "marron", "verts"]),
      nez: zufall(["grand", "petit"]),
      moustache: homme && Math.random() < 0.5,
      lunettes: zufall(["non", "non", "oui"]),
      chapeau: zufall(["non", "non", "uni", "raye"]),
      haut: zufall(["pull", "veste"]),
      hautFarbe: zufall(["vert", "bleu", "noir", "rouge"]),
      chaussures: zufall(["rouges", "noires"]),
    };
    const sig = signatur(s);
    if (gesehen.has(sig)) continue;
    gesehen.add(sig);
    s.name = (homme ? namenM : namenF).pop();
    liste.push(s);
  }
  return liste;
}

// Merkmale als Text für den KI-Prompt.
function beschreibeVerdaechtigen(s) {
  const f = FARBEN[s.hautFarbe].de;
  return [
    s.homme ? "ein Mann (un homme)" : "eine Frau (une femme)",
    `Grösse: ${s.taille === "grand" ? "gross (grand)" : "klein (petit)"}`,
    s.vieux ? "alt (vieux/vieille)" : "nicht alt, jung",
    s.mince ? "schlank (mince)" : "nicht schlank, eher kräftig",
    `Haare: ${s.cheveux === "blonds" ? "blond" : "braun"} (${s.cheveux}), ${s.laenge === "longs" ? "lang" : "kurz"} (${s.laenge})`,
    `Augen: ${{ bleus: "blau", marron: "braun", verts: "grün" }[s.yeux]} (${s.yeux})`,
    `Nase: ${s.nez === "grand" ? "gross" : "klein"} (${s.nez} nez)`,
    s.moustache ? "hat einen Schnauz (une moustache)" : "hat keinen Schnauz",
    s.lunettes === "oui" ? "trägt eine Brille (des lunettes)" : "trägt keine Brille",
    s.chapeau === "non" ? "trägt keinen Hut" : s.chapeau === "raye" ? "trägt einen gestreiften Hut (un chapeau rayé)" : "trägt einen einfarbigen Hut (un chapeau)",
    `Oberteil: ${s.haut === "pull" ? "ein Pullover (un pull)" : "eine Jacke (une veste)"}, Farbe ${f} (${s.hautFarbe})`,
    `Schuhe: ${s.chaussures === "rouges" ? "rot (rouges)" : "schwarz (noires)"}`,
  ].join("; ");
}

// ---- SVG-Figur (viewBox 100x150, Füsse unten) ----
function gesichtSvg(s) {
  const haar = s.cheveux === "blonds" ? "#e8c350" : "#6b3f1d";
  const haut = "#f6d2b0";
  const bw = s.mince ? 26 : 40; // halbe Körperbreite
  const augen = { bleus: "#2f6fd0", marron: "#6b3f1d", verts: "#2e8b3f" }[s.yeux];
  const oberteil = FARBEN[s.hautFarbe].hex;
  const schuh = s.chaussures === "rouges" ? "#c0392b" : "#222";
  const skala = s.taille === "grand" ? 1 : 0.8;
  let g = "";
  // Beine + Schuhe
  g += `<rect x="38" y="112" width="9" height="28" fill="#555"/><rect x="53" y="112" width="9" height="28" fill="#555"/>`;
  g += `<rect x="33" y="138" width="16" height="9" rx="4" fill="${schuh}"/><rect x="51" y="138" width="16" height="9" rx="4" fill="${schuh}"/>`;
  // Körper
  g += `<rect x="${50 - bw}" y="84" width="${bw * 2}" height="40" rx="12" fill="${oberteil}"/>`;
  if (s.haut === "veste") g += `<line x1="50" y1="86" x2="50" y2="122" stroke="#00000055" stroke-width="2"/>`;
  else g += `<path d="M42 84 Q50 94 58 84" fill="${haut}"/>`;
  // lange Haare hinten
  if (s.laenge === "longs") g += `<rect x="22" y="22" width="56" height="62" rx="22" fill="${haar}"/>`;
  // Gesicht
  g += `<ellipse cx="50" cy="48" rx="24" ry="28" fill="${haut}"/>`;
  // Haare oben
  g += `<path d="M26 46 Q26 16 50 16 Q74 16 74 46 Q66 31 50 31 Q34 31 26 46Z" fill="${haar}"/>`;
  // Falten bei alten Personen
  if (s.vieux) g += `<path d="M36 34 q14 -5 28 0 M40 40 q10 -3 20 0 M32 62 q4 4 8 5 M68 62 q-4 4 -8 5" stroke="#b58a68" stroke-width="1.6" fill="none"/>`;
  // Augen
  g += `<circle cx="41" cy="48" r="3.6" fill="#fff"/><circle cx="59" cy="48" r="3.6" fill="#fff"/><circle cx="41" cy="48" r="2.4" fill="${augen}"/><circle cx="59" cy="48" r="2.4" fill="${augen}"/>`;
  // Nase
  const nr = s.nez === "grand" ? 8 : 4;
  g += `<ellipse cx="50" cy="${57 + nr / 4}" rx="${nr / 1.6}" ry="${nr}" fill="#e3a982"/>`;
  // Mund
  g += `<path d="M42 70 Q50 76 58 70" stroke="#a04040" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  // Schnauz
  if (s.moustache) g += `<path d="M38 66 Q50 60 62 66 Q50 70 38 66Z" fill="#3b2415"/>`;
  // Brille
  if (s.lunettes === "oui") g += `<circle cx="41" cy="48" r="8" fill="rgba(255,255,255,0.25)" stroke="#222" stroke-width="2"/><circle cx="59" cy="48" r="8" fill="rgba(255,255,255,0.25)" stroke="#222" stroke-width="2"/><line x1="49" y1="48" x2="51" y2="48" stroke="#222" stroke-width="2"/>`;
  // Hut
  if (s.chapeau !== "non") {
    g += `<ellipse cx="50" cy="22" rx="32" ry="5.5" fill="#7a2e2e"/><rect x="34" y="2" width="32" height="22" rx="5" fill="#7a2e2e"/>`;
    if (s.chapeau === "raye") g += `<g stroke="#f4e2b0" stroke-width="3"><line x1="40" y1="2" x2="40" y2="24"/><line x1="50" y1="2" x2="50" y2="24"/><line x1="60" y1="2" x2="60" y2="24"/></g>`;
  }
  return `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g transform="translate(${50 - 50 * skala} ${150 - 150 * skala}) scale(${skala})">${g}</g></svg>`;
}

// ---- Lokaler Zeuge (Fallback) ----
function normalisiere(t) {
  return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’`´]/g, "'");
}

function antwort(wahr, jaText, neinText) {
  return { fr: wahr ? `Oui, ${jaText}` : `Non, ${neinText}`, de: null, korrektur: "" };
}

function lokalerZeuge(frage, s) {
  const q = normalisiere(frage);
  const hat = (...w) => w.some((x) => q.includes(x));
  const er = s.homme ? "il" : "elle";

  if (hat("moustache", "schnauz")) return antwort(s.moustache, `${er} a une moustache.`, `${er} n'a pas de moustache.`);
  if (hat("lunettes", "brille")) return antwort(s.lunettes === "oui", `${er} porte des lunettes.`, `${er} ne porte pas de lunettes.`);
  if (hat("chapeau", "hut")) {
    if (hat("raye", "gestreift")) return antwort(s.chapeau === "raye", `${er} porte un chapeau rayé.`, `${er} ne porte pas de chapeau rayé.`);
    return antwort(s.chapeau !== "non", `${er} porte un chapeau.`, `${er} ne porte pas de chapeau.`);
  }
  if (hat("chaussure", "schuh")) {
    if (hat("rouge")) return antwort(s.chaussures === "rouges", `${er} porte des chaussures rouges.`, `${er} porte des chaussures noires.`);
    if (hat("noir")) return antwort(s.chaussures === "noires", `${er} porte des chaussures noires.`, `${er} porte des chaussures rouges.`);
  }
  if (hat("pull", "veste", "vetement")) {
    const typ = hat("pull") ? "pull" : hat("veste") ? "veste" : null;
    const farbe = ["vert", "bleu", "noir", "rouge"].find((c) => q.includes(c));
    if (typ && farbe) {
      const f = typ === "veste" ? { vert: "verte", bleu: "bleue", noir: "noire", rouge: "rouge" }[farbe] : farbe;
      const k = typ === "pull" ? "un pull" : "une veste";
      return antwort(s.haut === typ && s.hautFarbe === farbe, `${er} porte ${k} ${f}.`, `${er} ne porte pas ${k} ${f}.`);
    }
    if (typ) return antwort(s.haut === typ, `${er} porte ${typ === "pull" ? "un pull" : "une veste"}.`, `${er} porte ${s.haut === "pull" ? "un pull" : "une veste"}.`);
    if (farbe) return antwort(s.hautFarbe === farbe, `les vêtements sont ${farbe}.`, `les vêtements ne sont pas ${farbe}.`);
  }
  if (hat("yeux", "augen")) {
    const farbe = ["bleu", "marron", "vert"].find((c) => q.includes(c));
    if (farbe) return antwort(s.yeux.startsWith(farbe), `${er} a les yeux ${s.yeux}.`, `${er} n'a pas les yeux ${farbe}s.`);
  }
  if (hat("cheveux", "blond", "brun", "long", "court", "haare")) {
    if (hat("blond")) return antwort(s.cheveux === "blonds", `${er} a les cheveux blonds.`, `${er} n'a pas les cheveux blonds.`);
    if (hat("brun")) return antwort(s.cheveux === "bruns", `${er} a les cheveux bruns.`, `${er} n'a pas les cheveux bruns.`);
    if (hat("long")) return antwort(s.laenge === "longs", `${er} a les cheveux longs.`, `${er} n'a pas les cheveux longs.`);
    if (hat("court")) return antwort(s.laenge === "courts", `${er} a les cheveux courts.`, `${er} n'a pas les cheveux courts.`);
  }
  if (hat("nez", "nase")) {
    if (hat("petit", "klein")) return antwort(s.nez === "petit", `${er} a un petit nez.`, `${er} a un grand nez.`);
    return antwort(s.nez === "grand", `${er} a un grand nez.`, `${er} a un petit nez.`);
  }
  if (hat("mince", "schlank")) return antwort(s.mince, `${er} est mince.`, `${er} n'est pas mince.`);
  if (hat("vieux", "vieille", " alt")) return antwort(s.vieux, `${er} est ${s.homme ? "vieux" : "vieille"}.`, `${er} n'est pas ${s.homme ? "vieux" : "vieille"}.`);
  if (hat("grand")) return antwort(s.taille === "grand", `${er} est ${s.homme ? "grand" : "grande"}.`, `${er} est ${s.homme ? "petit" : "petite"}.`);
  if (hat("petit")) return antwort(s.taille === "petit", `${er} est ${s.homme ? "petit" : "petite"}.`, `${er} est ${s.homme ? "grand" : "grande"}.`);
  if (hat("une femme", "frau")) return antwort(!s.homme, "c'est une femme.", "c'est un homme.");
  if (hat("un homme", "mann")) return antwort(s.homme, "c'est un homme.", "c'est une femme.");

  return {
    fr: "Je ne comprends pas. Tu peux répéter ?",
    de: "Ich verstehe nicht. Kannst du es wiederholen? (Tipp: Frag nach Haaren, Augen, Brille, Hut, Kleidung …)",
    korrektur: "",
  };
}
