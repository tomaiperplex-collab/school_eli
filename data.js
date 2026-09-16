// data.js
// ---------------------------------------------------------------------------
// Zentrale Datendatei für die Geografie-Lern-App "Kanton Bern".
//
// KOORDINATEN: alle lat/lon-Werte sind bereits mit guten Näherungswerten
// (öffentlich bekannte Ortschafts-/Gipfel-/Seemittelpunkte) befüllt. Bei
// Flüssen steht ein sinnvoller Referenzpunkt entlang des Flusslaufs
// innerhalb des Kantons Bern (nicht die ganze Länge, da die App nur
// Einzelpunkte darstellt). Reicht dir die Genauigkeit nicht, kannst du
// einzelne Werte jederzeit mit exakteren Koordinaten überschreiben, z.B.
// von map.geo.admin.ch (Rechtsklick auf den Ort → Koordinaten anzeigen).
//
// WAS DU SONST NOCH SELBST AUSFÜLLEN KANNST:
//   1. bildpfad   -> zeigt bereits auf den richtigen Ordner/Dateinamen.
//                    Lege dort einfach dein eigenes Foto ab (gleicher Name,
//                    Endung .jpg). Nichts wird automatisch aus dem Internet
//                    geladen.
//   3. kurzfakt   -> ein kurzer, kindgerechter Fakt-Satz für den Übungsmodus
//                    "Foto -> Name" bzw. als Zusatzinfo beim Feedback.
//
// Die Kategorie-Schlüssel (kategorie) sind absichtlich ohne Umlaute
// geschrieben, damit sie 1:1 zu den Ordnernamen unter /images/ passen:
//   "orte"   -> rot
//   "berge"  -> braun
//   "seen"   -> blau
//   "fluesse"-> grün
// ---------------------------------------------------------------------------

const KATEGORIEN = {
  orte: { label: "Orte", farbe: "#e63946", symbol: "●" },
  berge: { label: "Berge", farbe: "#8a5a30", symbol: "▲" },
  seen: { label: "Seen", farbe: "#3d84c6", symbol: "◆" },
  fluesse: { label: "Flüsse", farbe: "#2a9d5c", symbol: "■" },
};

// ---------------------------------------------------------------------------
// Ausschnitt des Kantons Bern (WGS84), den app.js benutzt, um die
// Leaflet-Karten (Übersicht + Karte→Name-Quiz) beim Start per fitBounds()
// auf den Kanton zu zentrieren. Die eigentliche Kartendarstellung kommt aus
// echten OpenStreetMap-/swisstopo-Kacheln (siehe app.js), nicht mehr aus
// einem gezeichneten Umriss — diese Box ist nur noch ein grober
// Bounding-Box-Richtwert für den Kartenausschnitt.
// ---------------------------------------------------------------------------
const KARTE_BOUNDS = {
  lonMin: 6.80,
  lonMax: 8.50,
  latMin: 46.25,
  latMax: 47.35,
};

// ---------------------------------------------------------------------------
// Die 5 Verwaltungsregionen des Kantons Bern (seit 2010): Seeland,
// Berner Jura, Bern-Mittelland, Emmental-Oberaargau, Oberland.
//
// HERKUNFT & GENAUIGKEIT: Die äusseren Ränder stammen vom echten,
// generalisierten Kantons-Umriss (dieselbe swisstopo-swissBOUNDARIES3D-Quelle
// wie die Begriffs-Koordinaten, via github.com/severinlandolt/map-switzerland).
// Die inneren Grenzen zwischen den Regionen sind aber KEINE offiziellen
// Verwaltungsgrenzen, sondern grob angenäherte Trennlinien (einfache
// Breiten-/Längengrad-Schnitte), so gewählt, dass alle 37 Begriffe aus
// BEGRIFFE in der jeweils richtigen Region landen. Für den NMG-Unterricht
// (grobe Orientierung: "in welcher Ecke des Kantons liegt das?") reicht das;
// für exakte Gemeindezuordnungen an den Rändern nicht.
// -> Bessere Daten? Ersetze die Koordinatenlisten unten durch echte
//    Verwaltungskreis-Polygone (opendata.swiss: "Verwaltungsregionen,
//    Verwaltungskreise und Amtsbezirke"), gruppiert zu den 5 Regionen.
// ---------------------------------------------------------------------------
const REGIONEN = [
  {
    name: "Seeland",
    farbe: "#4fb8b0",
    // zwei Teilflächen (die Region ist an dieser Kante nicht konvex)
    teile: [
      [[46.9791,7.1],[47.0076,7.2184],[46.9105,7.2087],[46.8883,7.35],[46.8796,7.35],[46.85,7.3337],[46.85,7.35],[47.2131,7.35],[47.2189,7.3414],[47.2216,7.35],[47.3037,7.35],[47.2917,7.3179],[47.2959,7.1697],[47.2552,7.1501],[47.2491,7.1]],
      [[46.9812,7.0411],[46.9775,7.0932],[46.9791,7.1],[47.08,7.1],[47.08,7.0653],[47.0324,7.0348],[46.9812,7.0411]],
    ],
    label: [47.1094, 7.2366],
  },
  {
    name: "Berner Jura",
    farbe: "#a98ed6",
    teile: [
      [[47.08,7.1],[47.2491,7.1],[47.2446,7.0625],[47.1971,7.0243],[47.167,6.8624],[47.1105,6.9275],[47.1188,6.99],[47.0976,7.0766],[47.08,7.0653]],
    ],
    label: [47.1586, 7.0164],
  },
  {
    name: "Bern-Mittelland",
    farbe: "#e8c94a",
    teile: [
      [[46.8883,7.35],[46.8876,7.3544],[46.8796,7.35],[46.85,7.35],[46.85,7.6],[47.2802,7.6],[47.2777,7.5811],[47.2606,7.6],[47.1451,7.6],[47.1018,7.435],[47.1518,7.4409],[47.2131,7.35],[47.2216,7.35],[47.2443,7.4218],[47.3237,7.5593],[47.3035,7.497],[47.3154,7.3813],[47.3037,7.35]],
    ],
    label: [47.0309, 7.4641],
  },
  {
    name: "Emmental-Oberaargau",
    farbe: "#e08a4c",
    teile: [
      [[46.85,7.6],[46.85,7.8736],[46.8866,7.8596],[46.9826,7.9535],[47.0548,7.867],[47.1421,7.8911],[47.2362,7.8397],[47.2669,7.8261],[47.2605,7.7337],[47.2918,7.6896],[47.2802,7.6],[47.2606,7.6],[47.1923,7.6756],[47.1588,7.6523],[47.1451,7.6]],
    ],
    label: [47.0493, 7.7467],
  },
  {
    name: "Oberland",
    farbe: "#5b9bd5",
    teile: [
      [[46.85,7.3337],[46.7746,7.2922],[46.7194,7.3108],[46.694,7.3779],[46.6559,7.3221],[46.5931,7.3217],[46.5551,7.238],[46.5118,7.2492],[46.3802,7.1946],[46.3305,7.2224],[46.3595,7.2632],[46.352,7.3559],[46.3777,7.4003],[46.3759,7.5279],[46.4112,7.5353],[46.4463,7.6271],[46.4152,7.7095],[46.4794,7.8453],[46.4879,7.9122],[46.5646,8.0171],[46.5243,8.1922],[46.5307,8.2591],[46.5837,8.3658],[46.6542,8.4114],[46.69,8.4534],[46.7647,8.4494],[46.7728,8.3963],[46.7892,8.37],[46.7545,8.2846],[46.7709,8.2401],[46.7561,8.148],[46.7884,8.048],[46.7763,7.9856],[46.8384,7.8781],[46.85,7.8736]],
    ],
    label: [46.6313, 7.7479],
  },
];

// ---------------------------------------------------------------------------
// Begriffsliste
// Jeder Eintrag: { name, kategorie, lat, lon, bildpfad, kurzfakt }
// ---------------------------------------------------------------------------
const BEGRIFFE = [
  // ----- Orte (rot) --------------------------------------------------------
  { name: "Bern", kategorie: "orte", lat: 46.9480, lon: 7.4474, bildpfad: "images/orte/Bern.jpg", kurzfakt: "Bern ist die Hauptstadt der Schweiz." },
  { name: "Thun", kategorie: "orte", lat: 46.7580, lon: 7.6280, bildpfad: "images/orte/Thun.jpg", kurzfakt: "Thun liegt am Ausfluss der Aare aus dem Thunersee." },
  { name: "Interlaken", kategorie: "orte", lat: 46.6863, lon: 7.8632, bildpfad: "images/orte/Interlaken.jpg", kurzfakt: "Interlaken liegt zwischen dem Thunersee und dem Brienzersee." },
  { name: "Meiringen", kategorie: "orte", lat: 46.7296, lon: 8.1798, bildpfad: "images/orte/Meiringen.jpg", kurzfakt: "Meiringen liegt im Haslital." },
  { name: "Biel/Bienne", kategorie: "orte", lat: 47.1368, lon: 7.2468, bildpfad: "images/orte/Biel_Bienne.jpg", kurzfakt: "Biel/Bienne ist eine zweisprachige Stadt am Bielersee." },
  { name: "Burgdorf", kategorie: "orte", lat: 47.0587, lon: 7.6255, bildpfad: "images/orte/Burgdorf.jpg", kurzfakt: "Burgdorf liegt an der Emme." },
  { name: "Langenthal", kategorie: "orte", lat: 47.2136, lon: 7.7913, bildpfad: "images/orte/Langenthal.jpg", kurzfakt: "Langenthal liegt im Oberaargau." },
  { name: "Courtelary", kategorie: "orte", lat: 47.1830, lon: 7.0670, bildpfad: "images/orte/Courtelary.jpg", kurzfakt: "Courtelary liegt im Berner Jura." },
  { name: "Grindelwald", kategorie: "orte", lat: 46.6244, lon: 8.0414, bildpfad: "images/orte/Grindelwald.jpg", kurzfakt: "Grindelwald liegt am Fuss des Eigers." },
  { name: "Gstaad", kategorie: "orte", lat: 46.4718, lon: 7.2860, bildpfad: "images/orte/Gstaad.jpg", kurzfakt: "Gstaad liegt im Berner Oberland, im Saanenland." },
  { name: "Langnau", kategorie: "orte", lat: 46.9385, lon: 7.7853, bildpfad: "images/orte/Langnau.jpg", kurzfakt: "Langnau liegt im Emmental." },
  { name: "Erlach", kategorie: "orte", lat: 47.0330, lon: 7.0830, bildpfad: "images/orte/Erlach.jpg", kurzfakt: "Erlach liegt am Bielersee." },
  { name: "Aarberg", kategorie: "orte", lat: 47.0437, lon: 7.2757, bildpfad: "images/orte/Aarberg.jpg", kurzfakt: "Aarberg hat ein hübsches, kreisrundes Städtchen-Zentrum." },

  // ----- Berge (braun) ------------------------------------------------------
  { name: "Finsteraarhorn", kategorie: "berge", lat: 46.5386, lon: 8.1272, bildpfad: "images/berge/Finsteraarhorn.jpg", kurzfakt: "Das Finsteraarhorn ist mit 4274 m der höchste Berg im Kanton Bern." },
  { name: "Eiger", kategorie: "berge", lat: 46.5772, lon: 8.0047, bildpfad: "images/berge/Eiger.jpg", kurzfakt: "Der Eiger ist berühmt für seine steile Nordwand." },
  { name: "Mönch", kategorie: "berge", lat: 46.5583, lon: 7.9972, bildpfad: "images/berge/Moench.jpg", kurzfakt: "Der Mönch liegt zwischen Eiger und Jungfrau." },
  { name: "Jungfrau", kategorie: "berge", lat: 46.5368, lon: 7.9626, bildpfad: "images/berge/Jungfrau.jpg", kurzfakt: "Die Jungfrau gehört zum UNESCO-Welterbe Jungfrau-Aletsch." },
  { name: "Brienzer Rothorn", kategorie: "berge", lat: 46.7869, lon: 8.0469, bildpfad: "images/berge/Brienzer_Rothorn.jpg", kurzfakt: "Auf das Brienzer Rothorn fährt eine alte Dampfbahn." },
  { name: "Niesen", kategorie: "berge", lat: 46.6431, lon: 7.6522, bildpfad: "images/berge/Niesen.jpg", kurzfakt: "Der Niesen hat eine markante Pyramidenform." },
  { name: "Gurten", kategorie: "berge", lat: 46.9319, lon: 7.4414, bildpfad: "images/berge/Gurten.jpg", kurzfakt: "Der Gurten ist der Hausberg von Bern." },
  { name: "Napf", kategorie: "berge", lat: 47.0042, lon: 7.9400, bildpfad: "images/berge/Napf.jpg", kurzfakt: "Der Napf liegt an der Grenze zum Kanton Luzern." },
  { name: "Chasseral", kategorie: "berge", lat: 47.1331, lon: 7.0594, bildpfad: "images/berge/Chasseral.jpg", kurzfakt: "Der Chasseral liegt im Berner Jura." },

  // ----- Seen (blau) ---------------------------------------------------------
  { name: "Bielersee", kategorie: "seen", lat: 47.0830, lon: 7.1670, bildpfad: "images/seen/Bielersee.jpg", kurzfakt: "Am Bielersee liegt die St. Petersinsel." },
  { name: "Neuenburgersee", kategorie: "seen", lat: 46.9000, lon: 6.8667, bildpfad: "images/seen/Neuenburgersee.jpg", kurzfakt: "Der Neuenburgersee ist der grösste vollständig in der Schweiz liegende See." },
  { name: "Wohlensee", kategorie: "seen", lat: 46.9650, lon: 7.3700, bildpfad: "images/seen/Wohlensee.jpg", kurzfakt: "Der Wohlensee ist ein Stausee der Aare bei Bern." },
  { name: "Thunersee", kategorie: "seen", lat: 46.6900, lon: 7.7100, bildpfad: "images/seen/Thunersee.jpg", kurzfakt: "Der Thunersee wird von der Aare durchflossen." },
  { name: "Brienzersee", kategorie: "seen", lat: 46.7250, lon: 7.9700, bildpfad: "images/seen/Brienzersee.jpg", kurzfakt: "Der Brienzersee ist bekannt für sein türkisblaues Wasser." },
  { name: "Grimselsee", kategorie: "seen", lat: 46.5675, lon: 8.3075, bildpfad: "images/seen/Grimselsee.jpg", kurzfakt: "Der Grimselsee ist ein Stausee im Berner Oberland." },

  // ----- Flüsse (grün) --------------------------------------------------------
  { name: "Aare", kategorie: "fluesse", lat: 46.9481, lon: 7.4361, bildpfad: "images/fluesse/Aare.jpg", kurzfakt: "Die Aare ist der wichtigste Fluss im Kanton Bern." },
  { name: "Zihlkanal", kategorie: "fluesse", lat: 47.0550, lon: 7.0450, bildpfad: "images/fluesse/Zihlkanal.jpg", kurzfakt: "Der Zihlkanal verbindet den Neuenburgersee mit dem Bielersee." },
  { name: "Schüss", kategorie: "fluesse", lat: 47.1600, lon: 6.9970, bildpfad: "images/fluesse/Schuess.jpg", kurzfakt: "Die Schüss fliesst durch den Berner Jura nach Biel." },
  { name: "Emme", kategorie: "fluesse", lat: 46.9200, lon: 7.7600, bildpfad: "images/fluesse/Emme.jpg", kurzfakt: "Die Emme gibt dem Emmental seinen Namen." },
  { name: "Saane", kategorie: "fluesse", lat: 46.4850, lon: 7.2500, bildpfad: "images/fluesse/Saane.jpg", kurzfakt: "Die Saane bildet teilweise die Sprachgrenze." },
  { name: "Sense", kategorie: "fluesse", lat: 46.8600, lon: 7.3600, bildpfad: "images/fluesse/Sense.jpg", kurzfakt: "Die Sense bildet die Grenze zum Kanton Freiburg." },
  { name: "Simme", kategorie: "fluesse", lat: 46.5570, lon: 7.3730, bildpfad: "images/fluesse/Simme.jpg", kurzfakt: "Die Simme gibt dem Simmental seinen Namen." },
  { name: "Kander", kategorie: "fluesse", lat: 46.4959, lon: 7.6763, bildpfad: "images/fluesse/Kander.jpg", kurzfakt: "Die Kander mündet über den Kanderkanal in den Thunersee." },
  { name: "Lütschine", kategorie: "fluesse", lat: 46.6516, lon: 7.9081, bildpfad: "images/fluesse/Luetschine.jpg", kurzfakt: "Die Lütschine entsteht aus der Schwarzen und der Weissen Lütschine." },
];
