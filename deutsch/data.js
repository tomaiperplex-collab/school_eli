// deutsch/data.js — Themen für das Fach Deutsch: Theorie-Block + Übungsaufgaben
// pro Thema. Jedes Thema hat eine feste `id` (wird als Schlüssel im
// Fortschritt/localStorage verwendet — nie ändern, sonst geht gespeicherter
// Fortschritt verloren) sowie einen Pool `aufgaben`, aus dem die Übung
// zufällig zieht (siehe app.js: naechsteFrage()).
//
// Aufgaben-Typ (bewusst nur Multiple-Choice — mobilfreundlich, kein
// Eintippen nötig):
//   { typ: "mc", frage, optionen: [...], richtig: <Index in optionen> }

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
      // 2) Zusammengesetzte Nomen bilden — passendes zweites Wort wählen
      { typ: "mc", frage: "Brief + ? = die Briefmarke", optionen: ["Marke", "Baum", "Fenster"], richtig: 0 },
      { typ: "mc", frage: "schreiben + ? = das Schreibheft", optionen: ["Heft", "Buch", "Marke"], richtig: 0 },
      { typ: "mc", frage: "Birne + ? = der Birnbaum", optionen: ["Baum", "Heft", "Fenster"], richtig: 0 },
      { typ: "mc", frage: "Dach + ? = das Dachfenster", optionen: ["Fenster", "Buch", "Baum"], richtig: 0 },
      { typ: "mc", frage: "lesen + ? = das Lesebuch", optionen: ["Buch", "Marke", "Heft"], richtig: 0 },
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
      // 4) Nomen auf -heit, -keit, -ung bilden — richtige Endung wählen
      { typ: "mc", frage: "einladen — wie heisst das Nomen?", optionen: ["die Einladung", "die Einladheit", "die Einladkeit"], richtig: 0 },
      { typ: "mc", frage: "neu — wie heisst das Nomen?", optionen: ["die Neuung", "die Neuheit", "die Neukeit"], richtig: 1 },
      { typ: "mc", frage: "erholen — wie heisst das Nomen?", optionen: ["die Erholheit", "die Erholkeit", "die Erholung"], richtig: 2 },
      { typ: "mc", frage: "frech — wie heisst das Nomen?", optionen: ["die Frechheit", "die Frechung", "die Frechkeit"], richtig: 0 },
      { typ: "mc", frage: "traurig — wie heisst das Nomen?", optionen: ["die Traurigheit", "die Traurigung", "die Traurigkeit"], richtig: 2 },
      { typ: "mc", frage: "üben — wie heisst das Nomen?", optionen: ["die Übheit", "die Übkeit", "die Übung"], richtig: 2 },
      // 5) Satzanfang erkennen — auch Wörter, die sonst klein bleiben,
      // werden am Satzanfang gross geschrieben (nicht mit Nomen verwechseln!)
      { typ: "mc", frage: "Satzanfang: \"___ lacht laut.\" — wie schreibt man das erste Wort?", optionen: ["er", "Er"], richtig: 1 },
      { typ: "mc", frage: "Satzanfang: \"___ dann kam die Nacht.\" — wie schreibt man das erste Wort?", optionen: ["Und", "und"], richtig: 0 },
      { typ: "mc", frage: "Satzanfang: \"___ spielen zusammen.\" — wie schreibt man das erste Wort?", optionen: ["wir", "Wir"], richtig: 1 },
      { typ: "mc", frage: "Satzanfang: \"___ er morgen?\" — wie schreibt man das erste Wort (kommt)?", optionen: ["Kommt", "kommt"], richtig: 0 },
      { typ: "mc", frage: "Mitten im Satz: \"Ich glaube, ___ kommt.\" — wie schreibt man das Wort (er) hier?", optionen: ["er", "Er"], richtig: 0 },
      { typ: "mc", frage: "Mitten im Satz: \"Schau mal, ___ regnet es schon wieder.\" — wie schreibt man das Wort (und)?", optionen: ["und", "Und"], richtig: 0 },
      // 6) Welcher Satz ist richtig geschrieben?
      { typ: "mc", frage: "Welcher Satz stimmt?", optionen: ["Er läuft schnell.", "er Läuft schnell.", "Er läuft Schnell."], richtig: 0 },
      { typ: "mc", frage: "Welcher Satz stimmt?", optionen: ["wir gehen ins kino.", "Wir Gehen ins Kino.", "Wir gehen ins Kino."], richtig: 2 },
      { typ: "mc", frage: "Welcher Satz stimmt?", optionen: ["Liest du gerne Bücher?", "Liest du gerne bücher?", "liest du gerne Bücher?"], richtig: 0 },
      { typ: "mc", frage: "Welcher Satz stimmt?", optionen: ["schliesse sofort das fenster!", "Schliesse sofort das fenster!", "Schliesse sofort das Fenster!"], richtig: 2 },
      { typ: "mc", frage: "Welcher Satz stimmt?", optionen: ["Ich spiele mit sara Tennis.", "Ich spiele mit Sara Tennis.", "ich spiele mit Sara tennis."], richtig: 1 },
      // 7) Das Nomen im Satz finden — Artikel/Adjektiv/Pronomen als Hinweis nutzen
      { typ: "mc", frage: "Welches Wort ist hier das Nomen? \"Der freche Junge lacht laut.\"", optionen: ["freche", "Junge", "lacht"], richtig: 1 },
      { typ: "mc", frage: "Welches Wort ist hier das Nomen? \"Sie trägt ein rotes Kleid.\"", optionen: ["trägt", "rotes", "Kleid"], richtig: 2 },
      { typ: "mc", frage: "Welches Wort ist hier das Nomen? \"Seine Freiheit ist ihm wichtig.\"", optionen: ["Seine", "Freiheit", "wichtig"], richtig: 1 },
      { typ: "mc", frage: "Welches Wort ist hier das Nomen? \"Der bunte Vogel singt schön.\"", optionen: ["bunte", "Vogel", "schön"], richtig: 1 },
      { typ: "mc", frage: "Welches Wort ist hier das Nomen? \"Ihr Mut hat uns beeindruckt.\"", optionen: ["Ihr", "Mut", "beeindruckt"], richtig: 1 },
      { typ: "mc", frage: "Welches Wort ist hier das Nomen? \"Wir spürten grosse Freude.\"", optionen: ["spürten", "grosse", "Freude"], richtig: 2 },
      { typ: "mc", frage: "Welches Wort ist hier das Nomen? \"Das kalte Wasser erfrischt.\"", optionen: ["kalte", "Wasser", "erfrischt"], richtig: 1 },
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
      // 1) Verb als Nomen ergänzen — richtiges Verb aus der Wortbank wählen
      { typ: "mc", frage: "Seife zum ___?", optionen: ["Waschen", "Fischen", "Lachen"], richtig: 0 },
      { typ: "mc", frage: "müde vom ___?", optionen: ["Lesen", "Fliegen", "Wandern"], richtig: 2 },
      { typ: "mc", frage: "ein Buch zum ___?", optionen: ["Lesen", "Waschen", "Wandern"], richtig: 0 },
      { typ: "mc", frage: "Witze zum ___?", optionen: ["Fischen", "Lachen", "Fliegen"], richtig: 1 },
      { typ: "mc", frage: "Angst vor dem ___?", optionen: ["Waschen", "Lesen", "Fliegen"], richtig: 2 },
      { typ: "mc", frage: "am Ufer beim ___?", optionen: ["Fischen", "Lachen", "Wandern"], richtig: 0 },
      // 2) Passende Verbform einsetzen
      { typ: "mc", frage: "Anja ___ an der Kletterwand.", optionen: ["klettert", "schwimmt", "fliegt"], richtig: 0 },
      { typ: "mc", frage: "Ivo ___ am schnellsten durch den See.", optionen: ["läuft", "schwimmt", "klettert"], richtig: 1 },
      { typ: "mc", frage: "Achmed ___ als Erster durch das Ziel.", optionen: ["läuft", "fliegt", "schwimmt"], richtig: 0 },
      { typ: "mc", frage: "Leo will keine Suppe ___.", optionen: ["essen", "fliegen", "schwimmen"], richtig: 0 },
      { typ: "mc", frage: "Maria ___ morgen nach Rom.", optionen: ["klettert", "läuft", "fliegt"], richtig: 2 },
      // 3) Verben als Nomen ergänzen (Lückentext)
      { typ: "mc", frage: "Beim ___ zähle ich manchmal mit den Fingern.", optionen: ["Rechnen", "Klettern", "Segeln"], richtig: 0 },
      { typ: "mc", frage: "Er hat sich beim ___ das Bein gebrochen.", optionen: ["Schaukeln", "Klettern", "Essen"], richtig: 1 },
      { typ: "mc", frage: "Zum ___ setze ich mich an den Tisch.", optionen: ["Lesen", "Essen", "Tuscheln"], richtig: 1 },
      { typ: "mc", frage: "Wenn ich Bücher sehe, bekomme ich Lust zum ___.", optionen: ["Rechnen", "Fliegen", "Lesen"], richtig: 2 },
      { typ: "mc", frage: "Im Schwimmbad will er nichts vom ___ hören.", optionen: ["Wandern", "Tuscheln", "Klettern"], richtig: 1 },
      { typ: "mc", frage: "Sobald er Flugzeuge sieht, träumt er vom ___.", optionen: ["Segeln", "Essen", "Fliegen"], richtig: 2 },
      { typ: "mc", frage: "Er ist müde vom ___.", optionen: ["Wandern", "Schaukeln", "Rechnen"], richtig: 0 },
      { typ: "mc", frage: "Beim ___ werde ich regelmässig seekrank.", optionen: ["Tuscheln", "Lesen", "Segeln"], richtig: 2 },
      { typ: "mc", frage: "Beim ___ geht es ihr nicht hoch genug.", optionen: ["Klettern", "Fliegen", "Schaukeln"], richtig: 2 },
      // 4) Verben als Nomen in Sätzen
      { typ: "mc", frage: "Ich lache über das laute ___ der Motorräder.", optionen: ["Knattern", "Krähen", "Schimpfen"], richtig: 0 },
      { typ: "mc", frage: "So schnelles ___ ist nicht gut für sein krankes Herz.", optionen: ["Springen", "Laufen", "Tauchen"], richtig: 1 },
      { typ: "mc", frage: "Aus dem Hühnerstall hört man ein heiseres ___.", optionen: ["Knattern", "Krähen", "Schneiden"], richtig: 1 },
      { typ: "mc", frage: "Weites ___ ist Adams Spezialität.", optionen: ["Laufen", "Springen", "Ausruhen"], richtig: 1 },
      { typ: "mc", frage: "Humor wäre sicher besser als das ständige ___.", optionen: ["Ausruhen", "Schimpfen", "Tauchen"], richtig: 1 },
      { typ: "mc", frage: "Aylin übt das ___ mit der Linkshänderschere.", optionen: ["Knattern", "Springen", "Schneiden"], richtig: 2 },
      { typ: "mc", frage: "Zum ___ legen wir uns ins Gras.", optionen: ["Ausruhen", "Laufen", "Krähen"], richtig: 0 },
      { typ: "mc", frage: "Wir fahren ans schwarze Meer zum ___.", optionen: ["Schimpfen", "Schneiden", "Tauchen"], richtig: 2 },
      // 5) Kontrastpaare: gleiches Wort, einmal normales Verb (klein),
      // einmal als Nomen gebraucht (gross) — trainiert die Regel direkt,
      // nicht nur den Wortschatz.
      { typ: "mc", frage: "Wir gehen heute ___.", optionen: ["schwimmen", "Schwimmen"], richtig: 0 },
      { typ: "mc", frage: "Das ___ macht ihm Spass.", optionen: ["schwimmen", "Schwimmen"], richtig: 1 },
      { typ: "mc", frage: "Ich will heute nicht ___.", optionen: ["lesen", "Lesen"], richtig: 0 },
      { typ: "mc", frage: "Er hat keine Lust zum ___.", optionen: ["lesen", "Lesen"], richtig: 1 },
      { typ: "mc", frage: "Kannst du gut ___?", optionen: ["tanzen", "Tanzen"], richtig: 0 },
      { typ: "mc", frage: "Beim ___ verletzte er sich.", optionen: ["tanzen", "Tanzen"], richtig: 1 },
      { typ: "mc", frage: "Wir werden morgen ___.", optionen: ["klettern", "Klettern"], richtig: 0 },
      { typ: "mc", frage: "Das ___ an der Steilwand ist schwierig.", optionen: ["klettern", "Klettern"], richtig: 1 },
      { typ: "mc", frage: "Kinder lieben es zu ___.", optionen: ["malen", "Malen"], richtig: 0 },
      { typ: "mc", frage: "Sie hat grosses Talent zum ___.", optionen: ["malen", "Malen"], richtig: 1 },
      { typ: "mc", frage: "Darf ich kurz ___?", optionen: ["telefonieren", "Telefonieren"], richtig: 0 },
      { typ: "mc", frage: "Beim ___ vergisst er die Zeit.", optionen: ["telefonieren", "Telefonieren"], richtig: 1 },
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
      // 2) Reimwörter erkennen
      { typ: "mc", frage: "Kopf reimt sich auf … (beginnt mit T)", optionen: ["Topf", "Tisch", "Tasse"], richtig: 0 },
      { typ: "mc", frage: "dampfen reimt sich auf … (beginnt mit st)", optionen: ["stehen", "stampfen", "stark"], richtig: 1 },
      { typ: "mc", frage: "klopfen reimt sich auf … (beginnt mit Tr)", optionen: ["Treppe", "Traum", "Tropfen"], richtig: 2 },
      { typ: "mc", frage: "Sumpf reimt sich auf … (beginnt mit st)", optionen: ["Stumpf", "Stern", "Start"], richtig: 0 },
      // 3) Worttrennung mit pf — richtige Trennstelle wählen
      { typ: "mc", frage: "Wie trennt man \"klopfen\" richtig?", optionen: ["klop-fen", "klo-pfen", "klopf-en"], richtig: 0 },
      { typ: "mc", frage: "Wie trennt man \"Wipfel\" richtig?", optionen: ["Wi-pfel", "Wip-fel", "Wipf-el"], richtig: 1 },
      { typ: "mc", frage: "Wie trennt man \"Kupfer\" richtig?", optionen: ["Ku-pfer", "Kupf-er", "Kup-fer"], richtig: 2 },
      { typ: "mc", frage: "Wie trennt man \"tapfer\" richtig?", optionen: ["tapf-er", "tap-fer", "ta-pfer"], richtig: 1 },
      { typ: "mc", frage: "Wie trennt man \"stampfen\" richtig?", optionen: ["stam-pfen", "stampf-en", "stamp-fen"], richtig: 2 },
      { typ: "mc", frage: "Wie trennt man \"rümpfen\" richtig?", optionen: ["rümp-fen", "rüm-pfen", "rümpf-en"], richtig: 0 },
      // 4) Alphabetische Reihenfolge
      { typ: "mc", frage: "Welches Wort kommt im Alphabet zuerst?", optionen: ["Pfote", "Pflaster"], richtig: 1 },
      { typ: "mc", frage: "Welches Wort kommt im Alphabet zuerst?", optionen: ["Pfeil", "Pfau"], richtig: 1 },
      { typ: "mc", frage: "Welches Wort kommt im Alphabet zuerst?", optionen: ["Pfund", "Pfingsten"], richtig: 1 },
      { typ: "mc", frage: "Welches Wort kommt im Alphabet zuerst?", optionen: ["Pfeife", "Pfahl"], richtig: 1 },
      // 5) Zusammengesetzte Wörter mit pf bilden
      { typ: "mc", frage: "Welches Wort passt zu \"Kopf\"?", optionen: ["Tuch", "Saft", "Schiff"], richtig: 0 },
      { typ: "mc", frage: "Welches Wort passt zu \"Apfel\"?", optionen: ["Tuch", "Saft", "Burg"], richtig: 1 },
      { typ: "mc", frage: "Welches Wort passt zu \"Dampf\"?", optionen: ["Mehl", "Schiff", "Bauer"], richtig: 1 },
      { typ: "mc", frage: "Welches Wort passt zu \"Pfahl\"?", optionen: ["Bauer", "Stoff", "Lappen"], richtig: 0 },
      { typ: "mc", frage: "Welches Wort passt zu \"Topf\"?", optionen: ["Lappen", "Burg", "Mehl"], richtig: 0 },
      // 6) Silben zählen
      { typ: "mc", frage: "Wie viele Silben hat \"Kupferkessel\"?", optionen: ["2", "3", "4"], richtig: 2 },
      { typ: "mc", frage: "Wie viele Silben hat \"Zaunpfahl\"?", optionen: ["2", "3", "4"], richtig: 0 },
      { typ: "mc", frage: "Wie viele Silben hat \"beschimpfen\"?", optionen: ["2", "3", "4"], richtig: 1 },
      { typ: "mc", frage: "Wie viele Silben hat \"Wassertropfen\"?", optionen: ["2", "3", "4"], richtig: 2 },
      { typ: "mc", frage: "Wie viele Silben hat \"Anpfiff\"?", optionen: ["2", "3", "4"], richtig: 0 },
      { typ: "mc", frage: "Wie viele Silben hat \"Strumpfhose\"?", optionen: ["2", "3", "4"], richtig: 1 },
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
