// deutsch/data.js — Themen für das Fach Deutsch: Theorie-Block + Übungsaufgaben
// pro Thema. Jedes Thema hat eine feste `id` (wird als Schlüssel im
// Fortschritt/localStorage verwendet — nie ändern, sonst geht gespeicherter
// Fortschritt verloren) sowie einen Pool `aufgaben`, aus dem die Übung
// zufällig zieht (siehe app.js: naechsteFrage()).
//
// Aufgaben-Typen:
//   { typ: "mc",   frage, optionen: [...], richtig: <Index in optionen> }
//   { typ: "text", frage, antworten: [...] }  // beliebig viele akzeptierte
//                                              // Schreibweisen, Vergleich
//                                              // über normalisiereText()

const DEUTSCH_THEMEN = [
  {
    id: "satzanfaenge-nomen",
    icon: "🔤",
    name: "Satzanfänge & Nomen",
    theorie: `
      <p>Am <strong>Satzanfang</strong> und bei <strong>Nomen</strong>
      (Namenwörtern) schreibst du immer gross — auch mitten im Satz!</p>
      <p>Ein Nomen erkennst du oft daran, dass ein <strong>Artikel</strong>
      davorsteht (der, die, das, ein, eine), ein <strong>Adjektiv</strong>
      (z. B. gross, schön) oder ein <strong>Pronomen</strong> (ihr, seine).
      Manche Nomen erkennst du auch an ihrer Endung:
      <strong>-heit, -keit, -ung</strong>.</p>
      <p class="theorie-beispiel">🔎 Beispiel: <em>die Wolke, ein schöner
      Tag, seine Freiheit, die Dunkelheit</em></p>
      <p>Wörter wie <em>ich, du, wir, kommen, lachen</em> sind
      <strong>keine</strong> Nomen — die bleiben klein.</p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      Im Spanischen werden nur Satzanfänge und Eigennamen gross
      geschrieben — ganz normale Nomen wie <em>el perro</em> (der Hund)
      oder <em>la casa</em> (das Haus) bleiben klein. Das Deutsche ist da
      eine Ausnahme: <strong>jedes</strong> Nomen wird immer gross
      geschrieben, egal wo es im Satz steht. Genau das musst du also extra
      üben — im Spanischen bräuchtest du diese Regel gar nicht!</p>
    `,
    aufgaben: [
      // 1) Ist das Wort ein Nomen? (Ja/Nein)
      ...[
        ["Wolke", true], ["nein", false], ["Häuser", true], ["Kiste", true],
        ["Lesebuch", true], ["komm", false], ["Dunkelheit", true],
        ["finden", false], ["Rose", true], ["uns", false], ["lacht", false],
        ["Baum", true], ["ich", false], ["Freiheit", true], ["wir", false],
        ["Einsamkeit", true], ["Banane", true],
      ].map(([wort, istNomen]) => ({
        typ: "mc",
        frage: `Ist "${wort}" ein Nomen?`,
        optionen: ["Ja", "Nein"],
        richtig: istNomen ? 0 : 1,
      })),
      // 2) Zusammengesetzte Nomen bilden
      { typ: "text", frage: "Brief + Marke = ? (mit Artikel)", antworten: ["die Briefmarke", "briefmarke"] },
      { typ: "text", frage: "schreiben + Heft = ? (mit Artikel)", antworten: ["das Schreibheft", "schreibheft"] },
      { typ: "text", frage: "Birne + Baum = ? (mit Artikel)", antworten: ["der Birnbaum", "der Birnenbaum", "birnbaum", "birnenbaum"] },
      { typ: "text", frage: "Dach + Fenster = ? (mit Artikel)", antworten: ["das Dachfenster", "dachfenster"] },
      { typ: "text", frage: "lesen + Buch = ? (mit Artikel)", antworten: ["das Lesebuch", "lesebuch"] },
      // 3) Nomen für Gefühle und Gedanken erkennen
      ...[
        ["Glück", true], ["Wanderschuhe", false], ["Angst", true], ["Bahn", false],
        ["Freude", true], ["Verzweiflung", true], ["Wut", true], ["Bahnhof", false],
        ["Ärger", true], ["Tankstelle", false], ["Parkplatz", false], ["Pech", true],
        ["Raststätte", false], ["Mut", true], ["Bergspitze", false],
      ].map(([wort, istGefuehl]) => ({
        typ: "mc",
        frage: `Steht "${wort}" für ein Gefühl oder einen Gedanken?`,
        optionen: ["Ja", "Nein"],
        richtig: istGefuehl ? 0 : 1,
      })),
      // 4) Nomen auf -heit, -keit, -ung bilden
      { typ: "text", frage: "einladen + ung = ? (mit Artikel)", antworten: ["die Einladung", "einladung"] },
      { typ: "text", frage: "neu + heit = ? (mit Artikel)", antworten: ["die Neuheit", "neuheit"] },
      { typ: "text", frage: "erholen + ung = ? (mit Artikel)", antworten: ["die Erholung", "erholung"] },
      { typ: "text", frage: "frech + heit = ? (mit Artikel)", antworten: ["die Frechheit", "frechheit"] },
      { typ: "text", frage: "traurig + keit = ? (mit Artikel)", antworten: ["die Traurigkeit", "traurigkeit"] },
      { typ: "text", frage: "üben + ung = ? (mit Artikel)", antworten: ["die Übung", "übung"] },
    ],
  },

  {
    id: "verben-als-nomen",
    icon: "🏃",
    name: "Verben als Nomen",
    theorie: `
      <p>Verben (Tunwörter) werden manchmal auch als <strong>Nomen</strong>
      gebraucht — dann schreibst du sie plötzlich <strong>gross</strong>!</p>
      <p>Das erkennst du am Wort direkt davor: nach einem
      <strong>Artikel</strong> (das Lesen), einem <strong>Adjektiv</strong>
      (ständiges Verändern), einer <strong>Präposition</strong> (beim
      Fliegen) oder einem <strong>unbestimmten Zahlwort</strong> (viel
      Lachen) wird das Verb zum Nomen.</p>
      <p class="theorie-beispiel">🦋 Beispiel: <em>Die Raupe braucht viel
      Zeit zum Wachsen. Beim Fliegen trocknen die Flügel.</em></p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      Auch im Spanischen kann man einen Infinitiv wie ein Nomen benutzen,
      z. B. <em>el nadar</em> (das Schwimmen) oder <em>el comer</em> (das
      Essen). Der Unterschied: Im Spanischen bleibt <em>nadar</em> trotzdem
      klein, weil dort ja generell keine Nomen gross geschrieben werden. Im
      Deutschen wird aus <em>schwimmen</em> aber ein richtiges Nomen —
      <strong>das Schwimmen</strong> — und deshalb gross geschrieben.</p>
    `,
    aufgaben: [
      // 1) Verb als Nomen ergänzen
      { typ: "text", frage: "Seife zum ___ (waschen)", antworten: ["waschen", "das waschen"] },
      { typ: "text", frage: "müde vom ___ (wandern)", antworten: ["wandern", "das wandern"] },
      { typ: "text", frage: "ein Buch zum ___ (lesen)", antworten: ["lesen", "das lesen"] },
      { typ: "text", frage: "Witze zum ___ (lachen)", antworten: ["lachen", "das lachen"] },
      { typ: "text", frage: "Angst vor dem ___ (fliegen)", antworten: ["fliegen", "das fliegen"] },
      { typ: "text", frage: "am Ufer beim ___ (fischen)", antworten: ["fischen", "das fischen"] },
      // 2) Passende Verbform einsetzen
      { typ: "mc", frage: "Anja ___ an der Kletterwand.", optionen: ["klettert", "schwimmt", "fliegt"], richtig: 0 },
      { typ: "mc", frage: "Ivo ___ am schnellsten durch den See.", optionen: ["läuft", "schwimmt", "klettert"], richtig: 1 },
      { typ: "mc", frage: "Achmed ___ als Erster durch das Ziel.", optionen: ["läuft", "fliegt", "schwimmt"], richtig: 0 },
      { typ: "mc", frage: "Leo will keine Suppe ___.", optionen: ["essen", "fliegen", "schwimmen"], richtig: 0 },
      { typ: "mc", frage: "Maria ___ morgen nach Rom.", optionen: ["klettert", "läuft", "fliegt"], richtig: 2 },
      // 3) Verben als Nomen ergänzen (Lückentext)
      { typ: "text", frage: "Beim ___ zähle ich manchmal mit den Fingern.", antworten: ["rechnen"] },
      { typ: "text", frage: "Er hat sich beim ___ das Bein gebrochen.", antworten: ["klettern"] },
      { typ: "text", frage: "Zum ___ setze ich mich an den Tisch.", antworten: ["essen"] },
      { typ: "text", frage: "Wenn ich Bücher sehe, bekomme ich Lust zum ___.", antworten: ["lesen"] },
      { typ: "text", frage: "Im Schwimmbad will er nichts vom ___ hören.", antworten: ["tuscheln"] },
      { typ: "text", frage: "Sobald er Flugzeuge sieht, träumt er vom ___.", antworten: ["fliegen"] },
      { typ: "text", frage: "Er ist müde vom ___.", antworten: ["wandern"] },
      { typ: "text", frage: "Beim ___ werde ich regelmässig seekrank.", antworten: ["segeln"] },
      { typ: "text", frage: "Beim ___ geht es ihr nicht hoch genug.", antworten: ["schaukeln"] },
      // 4) Verben als Nomen in Sätzen
      { typ: "text", frage: "Ich lache über das laute ___ der Motorräder. (knattern)", antworten: ["knattern"] },
      { typ: "text", frage: "So schnelles ___ ist nicht gut für sein krankes Herz. (laufen)", antworten: ["laufen"] },
      { typ: "text", frage: "Aus dem Hühnerstall hört man ein heiseres ___. (krähen)", antworten: ["krähen"] },
      { typ: "text", frage: "Weites ___ ist Adams Spezialität. (springen)", antworten: ["springen"] },
      { typ: "text", frage: "Humor wäre sicher besser als das ständige ___. (schimpfen)", antworten: ["schimpfen"] },
      { typ: "text", frage: "Aylin übt das ___ mit der Linkshänderschere. (schneiden)", antworten: ["schneiden"] },
      { typ: "text", frage: "Zum ___ legen wir uns ins Gras. (ausruhen)", antworten: ["ausruhen"] },
      { typ: "text", frage: "Wir fahren ans schwarze Meer zum ___. (tauchen)", antworten: ["tauchen"] },
    ],
  },

  {
    id: "woerter-mit-pf",
    icon: "🐴",
    name: "Wörter mit pf",
    theorie: `
      <p>Der <strong>f-Laut</strong> kann auf vier Arten geschrieben werden:
      <strong>f, ff, v</strong> und <strong>pf</strong>.</p>
      <p>Das <strong>pf</strong> kann am Wortanfang stehen
      (<em>pfeifen</em>), in der Mitte (<em>klopfen</em>) oder am Ende
      (<em>Topf</em>). Genaues Hinhören und deutliches Sprechen helfen dir,
      es nicht zu vergessen.</p>
      <p class="theorie-beispiel">🐴 Beispiel: <em>Pferde, Apfel, Kopf</em>
      — überall steckt ein pf drin, auch wenn es sich manchmal nach
      einfachem f anhört.</p>
      <p>Beim Trennen bleibt <strong>pf</strong> immer zusammen:
      <em>klop-fen, Ap-fel, Kup-fer</em>.</p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      Im Spanischen gibt es die Buchstabenkombination <strong>pf</strong>
      gar nicht — der f-Laut wird dort einfach mit <em>f</em> geschrieben,
      z. B. <em>familia</em> (Familie) oder <em>foto</em> (Foto). Wenn du
      also ein spanisches Wort mit f siehst, hilft dir das nicht bei der
      Frage f oder pf — das ist eine typisch deutsche Besonderheit, die du
      dir extra merken musst.</p>
    `,
    aufgaben: [
      // 1) Richtige Schreibweise erkennen
      { typ: "mc", frage: "Welche Schreibweise stimmt?", optionen: ["Ferde", "Pferde", "Pherde"], richtig: 1 },
      { typ: "mc", frage: "Welche Schreibweise stimmt?", optionen: ["Apfel", "Affel", "Apel"], richtig: 0 },
      { typ: "mc", frage: "Welche Schreibweise stimmt?", optionen: ["Kof", "Koph", "Kopf"], richtig: 2 },
      { typ: "mc", frage: "Welche Schreibweise stimmt?", optionen: ["Fell", "Pfell", "Fel"], richtig: 0 },
      { typ: "mc", frage: "Welche Schreibweise stimmt?", optionen: ["Pfrühjahr", "Frühjar", "Frühjahr"], richtig: 2 },
      { typ: "mc", frage: "Welche Schreibweise stimmt?", optionen: ["Hafer", "Hapfer", "Haffer"], richtig: 0 },
      { typ: "mc", frage: "Welche Schreibweise stimmt?", optionen: ["Flanzenfresser", "Pflanzenfresser", "Pflanzefresser"], richtig: 1 },
      { typ: "mc", frage: "Welche Schreibweise stimmt?", optionen: ["Pfreizeit", "Freitzeit", "Freizeit"], richtig: 2 },
      // 2) Reimwörter
      { typ: "text", frage: "Kopf reimt sich auf ___ (beginnt mit T)", antworten: ["topf"] },
      { typ: "text", frage: "dampfen reimt sich auf ___ (beginnt mit st)", antworten: ["stampfen"] },
      { typ: "text", frage: "klopfen reimt sich auf ___ (beginnt mit Tr)", antworten: ["tropfen"] },
      { typ: "text", frage: "Sumpf reimt sich auf ___ (beginnt mit st)", antworten: ["stumpf"] },
      // 3) Worttrennung mit pf (mit Trennstrich schreiben, z.B. "klop-fen")
      { typ: "text", frage: "Trenne: klopfen", antworten: ["klop-fen"] },
      { typ: "text", frage: "Trenne: Wipfel", antworten: ["wip-fel"] },
      { typ: "text", frage: "Trenne: Kupfer", antworten: ["kup-fer"] },
      { typ: "text", frage: "Trenne: tapfer", antworten: ["tap-fer"] },
      { typ: "text", frage: "Trenne: stampfen", antworten: ["stamp-fen"] },
      { typ: "text", frage: "Trenne: rümpfen", antworten: ["rümp-fen"] },
      // 4) Alphabetische Reihenfolge
      { typ: "mc", frage: "Welches Wort kommt im Alphabet zuerst?", optionen: ["Pfote", "Pflaster"], richtig: 1 },
      { typ: "mc", frage: "Welches Wort kommt im Alphabet zuerst?", optionen: ["Pfeil", "Pfau"], richtig: 1 },
      { typ: "mc", frage: "Welches Wort kommt im Alphabet zuerst?", optionen: ["Pfund", "Pfingsten"], richtig: 1 },
      { typ: "mc", frage: "Welches Wort kommt im Alphabet zuerst?", optionen: ["Pfeife", "Pfahl"], richtig: 1 },
    ],
  },
];

// Themen aus dem Heft, die als Nächstes umgesetzt werden — hier nur als
// "bald verfügbar"-Kacheln gelistet (Name + Icon, keine Aufgaben/Theorie).
const DEUTSCH_KOMMENDE_THEMEN = [
  { icon: "📐", name: "Adjektive als Nomen" },
  { icon: "✂️", name: "Wörter trennen: st, pf, sp, tz" },
  { icon: "🌊", name: "Wörter mit aa, ee, oo" },
  { icon: "🦉", name: "Wörter mit äu und eu" },
  { icon: "🎂", name: "Wörter mit Dehnungs-h" },
  { icon: "🏰", name: "Wörter mit b, d, g" },
  { icon: "🐫", name: "Wörter mit Doppelkonsonanten" },
  { icon: "🥏", name: "Wörter mit gehäuften Konsonanten" },
  { icon: "⛵", name: "Wörter mit v" },
  { icon: "💬", name: "Wörtliche Rede" },
  { icon: "🕐", name: "Zeitangaben" },
];
