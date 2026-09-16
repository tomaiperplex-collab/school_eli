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
// Kartengrenzen des Kantons Bern (WGS84), passend zur echten Umriss-Kontur
// in index.html (#kanton-umriss), die aus offenen swisstopo-Geodaten
// (swissBOUNDARIES3D, via github.com/severinlandolt/map-switzerland)
// projiziert wurde. Bounding Box des Kantons Bern (Hauptteil) plus etwas
// Rand: Lon 6.86-8.45, Lat 46.33-47.32.
// -> Wenn du die Umriss-Punkte in index.html ersetzt, passe diese Werte
//    entsprechend an, damit Orte/Berge/Seen/Flüsse weiterhin zur Kontur passen.
// ---------------------------------------------------------------------------
const KARTE_BOUNDS = {
  lonMin: 6.80,
  lonMax: 8.50,
  latMin: 46.25,
  latMax: 47.35,
};

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
