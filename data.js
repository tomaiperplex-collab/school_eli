// data.js
// ---------------------------------------------------------------------------
// Zentrale Datendatei für die Geografie-Lern-App "Kanton Bern".
//
// WAS DU HIER SELBST AUSFÜLLEN MUSST:
//   1. lat / lon  -> echte Koordinaten (WGS84, Dezimalgrad) für jeden Begriff.
//                    Aktuell steht überall `null`. Die Karte zeigt einen Punkt
//                    erst an, sobald beide Werte gesetzt sind.
//                    Beispiel Bern: lat: 46.9480, lon: 7.4474
//   2. bildpfad   -> zeigt bereits auf den richtigen Ordner/Dateinamen.
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
// Näherungsweise Kartengrenzen des Kantons Bern (WGS84).
// Wird benutzt, um lat/lon auf die Platzhalter-Karte (SVG) zu projizieren.
// -> Falls du später eine genauere Kartenform einträgst (siehe app.js /
//    #karte-umriss), kannst du diese Grenzen bei Bedarf leicht anpassen,
//    damit die Punkte gut zur Umrissform passen.
// ---------------------------------------------------------------------------
const KARTE_BOUNDS = {
  lonMin: 6.85,
  lonMax: 8.45,
  latMin: 46.3,
  latMax: 47.25,
};

// ---------------------------------------------------------------------------
// Begriffsliste
// Jeder Eintrag: { name, kategorie, lat, lon, bildpfad, kurzfakt }
// ---------------------------------------------------------------------------
const BEGRIFFE = [
  // ----- Orte (rot) --------------------------------------------------------
  { name: "Bern", kategorie: "orte", lat: null, lon: null, bildpfad: "images/orte/Bern.jpg", kurzfakt: "Bern ist die Hauptstadt der Schweiz." },
  { name: "Thun", kategorie: "orte", lat: null, lon: null, bildpfad: "images/orte/Thun.jpg", kurzfakt: "Thun liegt am Ausfluss der Aare aus dem Thunersee." },
  { name: "Interlaken", kategorie: "orte", lat: null, lon: null, bildpfad: "images/orte/Interlaken.jpg", kurzfakt: "Interlaken liegt zwischen dem Thunersee und dem Brienzersee." },
  { name: "Meiringen", kategorie: "orte", lat: null, lon: null, bildpfad: "images/orte/Meiringen.jpg", kurzfakt: "Meiringen liegt im Haslital." },
  { name: "Biel/Bienne", kategorie: "orte", lat: null, lon: null, bildpfad: "images/orte/Biel_Bienne.jpg", kurzfakt: "Biel/Bienne ist eine zweisprachige Stadt am Bielersee." },
  { name: "Burgdorf", kategorie: "orte", lat: null, lon: null, bildpfad: "images/orte/Burgdorf.jpg", kurzfakt: "Burgdorf liegt an der Emme." },
  { name: "Langenthal", kategorie: "orte", lat: null, lon: null, bildpfad: "images/orte/Langenthal.jpg", kurzfakt: "Langenthal liegt im Oberaargau." },
  { name: "Courtelary", kategorie: "orte", lat: null, lon: null, bildpfad: "images/orte/Courtelary.jpg", kurzfakt: "Courtelary liegt im Berner Jura." },
  { name: "Grindelwald", kategorie: "orte", lat: null, lon: null, bildpfad: "images/orte/Grindelwald.jpg", kurzfakt: "Grindelwald liegt am Fuss des Eigers." },
  { name: "Gstaad", kategorie: "orte", lat: null, lon: null, bildpfad: "images/orte/Gstaad.jpg", kurzfakt: "Gstaad liegt im Berner Oberland, im Saanenland." },
  { name: "Langnau", kategorie: "orte", lat: null, lon: null, bildpfad: "images/orte/Langnau.jpg", kurzfakt: "Langnau liegt im Emmental." },
  { name: "Erlach", kategorie: "orte", lat: null, lon: null, bildpfad: "images/orte/Erlach.jpg", kurzfakt: "Erlach liegt am Bielersee." },
  { name: "Aarberg", kategorie: "orte", lat: null, lon: null, bildpfad: "images/orte/Aarberg.jpg", kurzfakt: "Aarberg hat ein hübsches, kreisrundes Städtchen-Zentrum." },

  // ----- Berge (braun) ------------------------------------------------------
  { name: "Finsteraarhorn", kategorie: "berge", lat: null, lon: null, bildpfad: "images/berge/Finsteraarhorn.jpg", kurzfakt: "Das Finsteraarhorn ist mit 4274 m der höchste Berg im Kanton Bern." },
  { name: "Eiger", kategorie: "berge", lat: null, lon: null, bildpfad: "images/berge/Eiger.jpg", kurzfakt: "Der Eiger ist berühmt für seine steile Nordwand." },
  { name: "Mönch", kategorie: "berge", lat: null, lon: null, bildpfad: "images/berge/Moench.jpg", kurzfakt: "Der Mönch liegt zwischen Eiger und Jungfrau." },
  { name: "Jungfrau", kategorie: "berge", lat: null, lon: null, bildpfad: "images/berge/Jungfrau.jpg", kurzfakt: "Die Jungfrau gehört zum UNESCO-Welterbe Jungfrau-Aletsch." },
  { name: "Brienzer Rothorn", kategorie: "berge", lat: null, lon: null, bildpfad: "images/berge/Brienzer_Rothorn.jpg", kurzfakt: "Auf das Brienzer Rothorn fährt eine alte Dampfbahn." },
  { name: "Niesen", kategorie: "berge", lat: null, lon: null, bildpfad: "images/berge/Niesen.jpg", kurzfakt: "Der Niesen hat eine markante Pyramidenform." },
  { name: "Gurten", kategorie: "berge", lat: null, lon: null, bildpfad: "images/berge/Gurten.jpg", kurzfakt: "Der Gurten ist der Hausberg von Bern." },
  { name: "Napf", kategorie: "berge", lat: null, lon: null, bildpfad: "images/berge/Napf.jpg", kurzfakt: "Der Napf liegt an der Grenze zum Kanton Luzern." },
  { name: "Chasseral", kategorie: "berge", lat: null, lon: null, bildpfad: "images/berge/Chasseral.jpg", kurzfakt: "Der Chasseral liegt im Berner Jura." },

  // ----- Seen (blau) ---------------------------------------------------------
  { name: "Bielersee", kategorie: "seen", lat: null, lon: null, bildpfad: "images/seen/Bielersee.jpg", kurzfakt: "Am Bielersee liegt die St. Petersinsel." },
  { name: "Neuenburgersee", kategorie: "seen", lat: null, lon: null, bildpfad: "images/seen/Neuenburgersee.jpg", kurzfakt: "Der Neuenburgersee ist der grösste vollständig in der Schweiz liegende See." },
  { name: "Wohlensee", kategorie: "seen", lat: null, lon: null, bildpfad: "images/seen/Wohlensee.jpg", kurzfakt: "Der Wohlensee ist ein Stausee der Aare bei Bern." },
  { name: "Thunersee", kategorie: "seen", lat: null, lon: null, bildpfad: "images/seen/Thunersee.jpg", kurzfakt: "Der Thunersee wird von der Aare durchflossen." },
  { name: "Brienzersee", kategorie: "seen", lat: null, lon: null, bildpfad: "images/seen/Brienzersee.jpg", kurzfakt: "Der Brienzersee ist bekannt für sein türkisblaues Wasser." },
  { name: "Grimselsee", kategorie: "seen", lat: null, lon: null, bildpfad: "images/seen/Grimselsee.jpg", kurzfakt: "Der Grimselsee ist ein Stausee im Berner Oberland." },

  // ----- Flüsse (grün) --------------------------------------------------------
  { name: "Aare", kategorie: "fluesse", lat: null, lon: null, bildpfad: "images/fluesse/Aare.jpg", kurzfakt: "Die Aare ist der wichtigste Fluss im Kanton Bern." },
  { name: "Zihlkanal", kategorie: "fluesse", lat: null, lon: null, bildpfad: "images/fluesse/Zihlkanal.jpg", kurzfakt: "Der Zihlkanal verbindet den Neuenburgersee mit dem Bielersee." },
  { name: "Schüss", kategorie: "fluesse", lat: null, lon: null, bildpfad: "images/fluesse/Schuess.jpg", kurzfakt: "Die Schüss fliesst durch den Berner Jura nach Biel." },
  { name: "Emme", kategorie: "fluesse", lat: null, lon: null, bildpfad: "images/fluesse/Emme.jpg", kurzfakt: "Die Emme gibt dem Emmental seinen Namen." },
  { name: "Saane", kategorie: "fluesse", lat: null, lon: null, bildpfad: "images/fluesse/Saane.jpg", kurzfakt: "Die Saane bildet teilweise die Sprachgrenze." },
  { name: "Sense", kategorie: "fluesse", lat: null, lon: null, bildpfad: "images/fluesse/Sense.jpg", kurzfakt: "Die Sense bildet die Grenze zum Kanton Freiburg." },
  { name: "Simme", kategorie: "fluesse", lat: null, lon: null, bildpfad: "images/fluesse/Simme.jpg", kurzfakt: "Die Simme gibt dem Simmental seinen Namen." },
  { name: "Kander", kategorie: "fluesse", lat: null, lon: null, bildpfad: "images/fluesse/Kander.jpg", kurzfakt: "Die Kander mündet über den Kanderkanal in den Thunersee." },
  { name: "Lütschine", kategorie: "fluesse", lat: null, lon: null, bildpfad: "images/fluesse/Luetschine.jpg", kurzfakt: "Die Lütschine entsteht aus der Schwarzen und der Weissen Lütschine." },
];
