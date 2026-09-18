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

  {
    id: "adjektive-als-nomen",
    icon: "📐",
    name: "Adjektive als Nomen",
    theorie: `
      <p>Auch <strong>Adjektive</strong> (Wiewörter) werden manchmal als
      <strong>Nomen</strong> gebraucht — und dann gross geschrieben.</p>
      <p>Achte auf das Wort davor: ein <strong>Artikel</strong> (das Grün),
      eine <strong>Präposition</strong> (ins Blaue), ein <strong>unbestimmtes
      Zahlwort</strong> (wenig Gutes, nichts Schlimmes) oder ein anderes
      <strong>Adjektiv</strong> (schwaches Rot) verraten dir: hier steckt ein
      Nomen.</p>
      <p class="theorie-beispiel">🚀 Beispiel: <em>Die Rakete fliegt ins
      Blaue. Er hat etwas Grossartiges geleistet.</em></p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      Auch im Spanischen macht man aus Adjektiven Nomen, z. B. <em>lo
      bueno</em> (das Gute) oder <em>lo nuevo</em> (das Neue). Aber auch hier
      bleibt <em>bueno</em> klein, weil im Spanischen ja generell keine
      Nomen gross geschrieben werden. Im Deutschen wird daraus
      <strong>das Gute</strong> — mit grossem G.</p>
    `,
    aufgaben: [
      // 1) Nomen (gross) oder normales Adjektiv (klein)?
      { typ: "mc", frage: "\"Die Rakete fliegt ins Blaue.\" — ist \"Blaue\" hier ein Nomen?", optionen: ["Nomen", "Adjektiv"], richtig: 0 },
      { typ: "mc", frage: "\"Der blaue Himmel ist schön.\" — ist \"blaue\" hier ein Nomen?", optionen: ["Nomen", "Adjektiv"], richtig: 1 },
      { typ: "mc", frage: "\"Er hat etwas Grossartiges geleistet.\" — Nomen oder Adjektiv?", optionen: ["Nomen", "Adjektiv"], richtig: 0 },
      { typ: "mc", frage: "\"Er hat eine grossartige Idee.\" — Nomen oder Adjektiv?", optionen: ["Nomen", "Adjektiv"], richtig: 1 },
      { typ: "mc", frage: "\"Wir sahen den Mond nicht als Ganzes.\" — Nomen oder Adjektiv?", optionen: ["Nomen", "Adjektiv"], richtig: 0 },
      { typ: "mc", frage: "\"Der ganze Kuchen ist weg.\" — Nomen oder Adjektiv?", optionen: ["Nomen", "Adjektiv"], richtig: 1 },
      // 2) Gegenteile finden
      { typ: "mc", frage: "Was ist das Gegenteil von \"langsam\"?", optionen: ["schnell", "leise", "kalt"], richtig: 0 },
      { typ: "mc", frage: "Was ist das Gegenteil von \"ängstlich\"?", optionen: ["traurig", "mutig", "müde"], richtig: 1 },
      { typ: "mc", frage: "Was ist das Gegenteil von \"tief\"?", optionen: ["hoch", "breit", "hart"], richtig: 0 },
      { typ: "mc", frage: "Was ist das Gegenteil von \"reich\"?", optionen: ["arm", "klein", "kalt"], richtig: 0 },
      { typ: "mc", frage: "Was ist das Gegenteil von \"kalt\"?", optionen: ["warm", "neu", "schmal"], richtig: 0 },
      { typ: "mc", frage: "Was ist das Gegenteil von \"alt\"?", optionen: ["neu", "hart", "rund"], richtig: 0 },
      { typ: "mc", frage: "Was ist das Gegenteil von \"schmal\"?", optionen: ["breit", "rund", "weich"], richtig: 0 },
      // 3) Adjektiv als Nomen ergänzen
      { typ: "mc", frage: "Unsere Lehrerin glaubt an das ___ in den Menschen. (gut)", optionen: ["Gute", "gute", "Guten"], richtig: 0 },
      { typ: "mc", frage: "Das ___ an den Ferien ist das Nichtstun. (schön)", optionen: ["schöne", "Schöne", "Schönes"], richtig: 1 },
      { typ: "mc", frage: "Max hatte nichts ___ zu erzählen. (neu)", optionen: ["Neues", "neues", "Neue"], richtig: 0 },
      { typ: "mc", frage: "Die ___ sassen auf der Bank und erzählten. (alt)", optionen: ["Alten", "alten", "Alte"], richtig: 0 },
      { typ: "mc", frage: "Ich würde gerne etwas ___ trinken. (warm)", optionen: ["Warmes", "warmes", "Warme"], richtig: 0 },
      { typ: "mc", frage: "Das Ungeheuer kam plötzlich aus dem ___. (dunkel)", optionen: ["Dunklen", "dunklen", "Dunkel"], richtig: 0 },
      { typ: "mc", frage: "Im Krieg ist viel ___ geschehen. (böse)", optionen: ["Böses", "böses", "Böse"], richtig: 0 },
      { typ: "mc", frage: "Vor ihm leuchtete das ___ der Ampel. (rot)", optionen: ["Rote", "rote", "Roten"], richtig: 0 },
      // 4) Adjektive mit un- bilden
      { typ: "mc", frage: "Wie heisst das Gegenteil von \"angenehm\"?", optionen: ["unangenehm", "unangenehmt", "unangenehmig"], richtig: 0 },
      { typ: "mc", frage: "Wie heisst das Gegenteil von \"gültig\"?", optionen: ["ungültig", "ungültigt", "ungültage"], richtig: 0 },
      { typ: "mc", frage: "Wie heisst das Gegenteil von \"endlich\"?", optionen: ["unendig", "unendlich", "unendlicht"], richtig: 1 },
      { typ: "mc", frage: "Wie heisst das Gegenteil von \"aufmerksam\"?", optionen: ["unaufmerksam", "unaufmerksamt", "unaufmerksame"], richtig: 0 },
      { typ: "mc", frage: "Wie heisst das Gegenteil von \"gemütlich\"?", optionen: ["ungemütlich", "ungemütig", "ungemütlicht"], richtig: 0 },
    ],
  },

  {
    id: "woerter-trennen-st-pf-sp-tz",
    icon: "✂️",
    name: "Wörter trennen: st, pf, sp, tz",
    theorie: `
      <p>Wörter mit zwei oder mehr Silben kannst du am Zeilenende trennen.
      Stehen <strong>pf, sp, st</strong> oder <strong>tz</strong> zwischen
      zwei Vokalen, trennst du <strong>zwischen</strong> diesen beiden
      Buchstaben: <em>Töp-fe, sit-zen</em>.</p>
      <p>Steht davor noch ein weiterer Konsonant, wandert der
      <strong>letzte</strong> der drei Konsonanten mit auf die neue Zeile:
      <em>kämp-fen</em>.</p>
      <p class="theorie-beispiel">🌳 Beispiel: <em>Fens-ter, Wes-pen,
      Kat-ze</em></p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      Im Spanischen gibt es am Wortanfang gar kein reines <em>st-</em> oder
      <em>sp-</em> — davor kommt immer ein <em>e</em>. "Student" heisst auf
      Spanisch <em>estudiante</em>, "Spanien" heisst auf Spanisch selbst
      <em>España</em> (mit e davor)! Deutsche st/sp-Wörter am Wortanfang
      gibt es im Spanischen also so gar nicht.</p>
    `,
    aufgaben: [
      { typ: "mc", frage: "Wie trennt man \"Apfel\"?", optionen: ["Ap-fel", "A-pfel", "Apf-el"], richtig: 0 },
      { typ: "mc", frage: "Wie trennt man \"Katze\"?", optionen: ["Ka-tze", "Kat-ze", "Katz-e"], richtig: 1 },
      { typ: "mc", frage: "Wie trennt man \"raspeln\"?", optionen: ["ras-peln", "ra-speln", "rasp-eln"], richtig: 0 },
      { typ: "mc", frage: "Wie trennt man \"schützen\"?", optionen: ["schü-tzen", "schütz-en", "schüt-zen"], richtig: 2 },
      { typ: "mc", frage: "Wie trennt man \"sitzen\"?", optionen: ["si-tzen", "sitz-en", "sit-zen"], richtig: 2 },
      { typ: "mc", frage: "Wie trennt man \"schimpfen\"?", optionen: ["schim-pfen", "schimp-fen", "schi-mpfen"], richtig: 1 },
      { typ: "mc", frage: "Wie trennt man \"lustig\"?", optionen: ["lu-stig", "lus-tig", "lust-ig"], richtig: 1 },
      { typ: "mc", frage: "Wie trennt man \"Knospen\"?", optionen: ["Kno-spen", "Knos-pen", "Knosp-en"], richtig: 1 },
      { typ: "mc", frage: "Wie trennt man \"Schnupfen\"?", optionen: ["Schnu-pfen", "Schnup-fen", "Schnupf-en"], richtig: 1 },
      { typ: "mc", frage: "Wie trennt man \"kämpfen\"?", optionen: ["kämp-fen", "käm-pfen", "kämpf-en"], richtig: 0 },
      { typ: "mc", frage: "Wie trennt man \"Gestern\"?", optionen: ["Ge-stern", "Ges-tern", "Gest-ern"], richtig: 1 },
      { typ: "mc", frage: "Wie trennt man \"Ästen\"?", optionen: ["Ä-sten", "Äst-en", "Äs-ten"], richtig: 2 },
      { typ: "mc", frage: "Wie trennt man \"Wespen\"?", optionen: ["We-spen", "Wes-pen", "Wesp-en"], richtig: 1 },
      { typ: "mc", frage: "Wie trennt man \"Weste\"?", optionen: ["We-ste", "Wes-te", "West-e"], richtig: 1 },
      { typ: "mc", frage: "Wie trennt man \"tapfer\"?", optionen: ["tapf-er", "tap-fer", "ta-pfer"], richtig: 1 },
      { typ: "mc", frage: "Was passt: \"hilft, bestimmte Krankheiten zu vermeiden\"?", optionen: ["Impfung", "Blitze", "Wespe"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"bei Gewitter entstehen\"?", optionen: ["Ätze", "Blitze", "Tatzen"], richtig: 1 },
      { typ: "mc", frage: "Was passt: \"der Fuss des Bären heisst\"?", optionen: ["Tatze", "Ätze", "Weste"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"ein Insekt, das sticht\"?", optionen: ["Wespe", "Weste", "Impfung"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"ein Baum hat viele\"?", optionen: ["Äste", "Blitze", "Tatzen"], richtig: 0 },
    ],
  },

  {
    id: "woerter-aa-ee-oo",
    icon: "🌊",
    name: "Wörter mit aa, ee, oo",
    theorie: `
      <p>Doppelte Vokale wie <strong>aa, ee, oo</strong> werden immer
      <strong>lang</strong> gesprochen. Es gibt nicht viele solche Wörter —
      am besten lernst du sie auswendig.</p>
      <p class="theorie-beispiel">🦭 Beispiel: <em>Haar, Meer, Boot, Aal,
      Paar, Zoo</em></p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      Im Spanischen gibt es überhaupt keine langen oder kurzen Vokale —
      jeder Vokal klingt immer gleich lang, egal wo er im Wort steht.
      Doppelte Vokale zur Kennzeichnung eines langen Lauts, wie im
      Deutschen, kennt das Spanische deshalb gar nicht.</p>
    `,
    aufgaben: [
      // 1) aa/ee/oo zuordnen
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"Haar\"?", optionen: ["aa", "ee", "oo"], richtig: 0 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"Boot\"?", optionen: ["aa", "ee", "oo"], richtig: 2 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"Kaffee\"?", optionen: ["aa", "ee", "oo"], richtig: 1 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"Saal\"?", optionen: ["aa", "ee", "oo"], richtig: 0 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"Moos\"?", optionen: ["aa", "ee", "oo"], richtig: 2 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"Meer\"?", optionen: ["aa", "ee", "oo"], richtig: 1 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"Waage\"?", optionen: ["aa", "ee", "oo"], richtig: 0 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"Zoo\"?", optionen: ["aa", "ee", "oo"], richtig: 2 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"Aal\"?", optionen: ["aa", "ee", "oo"], richtig: 0 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"Klee\"?", optionen: ["aa", "ee", "oo"], richtig: 1 },
      // 2) Paar oder paar?
      { typ: "mc", frage: "Ein ___ Wolken ziehen vorbei. (unbestimmte Menge)", optionen: ["Paar", "paar"], richtig: 1 },
      { typ: "mc", frage: "Zwei Schuhe bilden ein ___. (Nomen)", optionen: ["Paar", "paar"], richtig: 0 },
      { typ: "mc", frage: "Ich habe ein ___ Bücher gelesen.", optionen: ["Paar", "paar"], richtig: 1 },
      { typ: "mc", frage: "Die Socken bilden ein ___.", optionen: ["Paar", "paar"], richtig: 0 },
      // 3) Komposita bilden
      { typ: "mc", frage: "Haar + Spange = ?", optionen: ["die Haarspange", "die Haarespange", "der Haarspange"], richtig: 0 },
      { typ: "mc", frage: "Klee + Blatt = ?", optionen: ["das Kleeblatt", "das Kleesblatt", "die Kleeblatt"], richtig: 0 },
      { typ: "mc", frage: "Erde + Beere = ?", optionen: ["die Erdbeere", "die Erdebeere", "die Erdenbeere"], richtig: 0 },
      { typ: "mc", frage: "Tee + Beutel = ?", optionen: ["der Teebeutel", "der Teesbeutel", "das Teebeutel"], richtig: 0 },
      { typ: "mc", frage: "Kaffee + Tasse = ?", optionen: ["die Kaffeetasse", "die Kaffeestasse", "der Kaffeetasse"], richtig: 0 },
      { typ: "mc", frage: "Saal + Fenster = ?", optionen: ["das Saalfenster", "das Saalsfenster", "die Saalfenster"], richtig: 0 },
      // 4) Verwandte Wörter finden
      { typ: "mc", frage: "Welches Wort gehört zu \"Moor\"?", optionen: ["moorig", "leer", "haarig"], richtig: 0 },
      { typ: "mc", frage: "Welches Wort gehört zu \"Haar\"?", optionen: ["haarig", "moorig", "leer"], richtig: 0 },
      { typ: "mc", frage: "Welches Wort gehört zu \"Moos\"?", optionen: ["bemoost", "haarig", "leer"], richtig: 0 },
      { typ: "mc", frage: "Welches Wort gehört zu \"Saal\"?", optionen: ["Wartesaal", "Seerose", "Kaffeebohne"], richtig: 0 },
      { typ: "mc", frage: "Welches Wort gehört zu \"Kaffee\"?", optionen: ["Kaffeebohne", "Wartesaal", "Blumenbeet"], richtig: 0 },
      { typ: "mc", frage: "Welches Wort gehört zu \"Beet\"?", optionen: ["Blumenbeet", "Märchenfee", "Meersalz"], richtig: 0 },
      { typ: "mc", frage: "Welches Wort gehört zu \"Fee\"?", optionen: ["Märchenfee", "Blumenbeet", "Wartesaal"], richtig: 0 },
      { typ: "mc", frage: "Welches Wort gehört zu \"Meer\"?", optionen: ["Meersalz", "Kaffeebohne", "Wartesaal"], richtig: 0 },
    ],
  },

  {
    id: "woerter-aeu-eu",
    icon: "🦉",
    name: "Wörter mit äu und eu",
    theorie: `
      <p>Die Laute <strong>eu</strong> und <strong>äu</strong> hören sich
      gleich an. Wenn du unsicher bist, suchst du am besten die
      <strong>Verwandten</strong> des Wortes: äu-Wörter haben meistens
      Verwandte mit <strong>au</strong> (<em>Baum – Bäume, verkaufen –
      Verkäufer</em>).</p>
      <p class="theorie-beispiel">🦉 Beispiel: <em>Häuser</em> (von
      <em>Haus</em>) schreibt man mit äu, <em>heute</em> hat keine
      au-Verwandten und wird deshalb mit eu geschrieben.</p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      "Europa" schreibt man im Spanischen fast gleich wie im Deutschen —
      aber im Spanischen spricht man e und u als zwei getrennte Laute
      (Eu-ro-pa), während sie im Deutschen zu einem einzigen Laut
      verschmelzen. Das deutsche eu/äu als ein Laut ist also etwas, das es
      im Spanischen so gar nicht gibt.</p>
    `,
    aufgaben: [
      // 1) au-Verwandte finden
      { typ: "mc", frage: "Was ist die au-Verwandte von \"Häuser\"?", optionen: ["Haus", "Herd", "Hut"], richtig: 0 },
      { typ: "mc", frage: "Was ist die au-Verwandte von \"Mäuse\"?", optionen: ["Mut", "Maus", "Moos"], richtig: 1 },
      { typ: "mc", frage: "Was ist die au-Verwandte von \"Räuber\"?", optionen: ["rauben", "reiben", "reisen"], richtig: 0 },
      { typ: "mc", frage: "Was ist die au-Verwandte von \"Gebäude\"?", optionen: ["bauen", "biegen", "beugen"], richtig: 0 },
      { typ: "mc", frage: "Was ist die au-Verwandte von \"einzäunen\"?", optionen: ["Zunge", "Zaun", "Zange"], richtig: 1 },
      { typ: "mc", frage: "Was ist die au-Verwandte von \"häufig\"?", optionen: ["Haufen", "Hafen", "Hufe"], richtig: 0 },
      { typ: "mc", frage: "Was ist die au-Verwandte von \"säuerlich\"?", optionen: ["sauer", "süss", "salzig"], richtig: 0 },
      { typ: "mc", frage: "Was ist die au-Verwandte von \"Verkäufer\"?", optionen: ["kaufen", "kochen", "kämmen"], richtig: 0 },
      { typ: "mc", frage: "Was ist die au-Verwandte von \"Bäuerin\"?", optionen: ["Bauer", "Beere", "Birne"], richtig: 0 },
      { typ: "mc", frage: "Was ist die au-Verwandte von \"Sträucher\"?", optionen: ["Strauch", "Streit", "Strasse"], richtig: 0 },
      { typ: "mc", frage: "Was ist die au-Verwandte von \"gräulich\"?", optionen: ["grau", "grün", "glatt"], richtig: 0 },
      { typ: "mc", frage: "Was ist die au-Verwandte von \"säubern\"?", optionen: ["sauber", "süss", "sicher"], richtig: 0 },
      // 2) eu oder äu einsetzen (im Satzzusammenhang)
      { typ: "mc", frage: "\"Ich erlebte ein kleines Abent___er.\" — eu oder äu?", optionen: ["eu", "äu"], richtig: 0 },
      { typ: "mc", frage: "\"Die ___le ist ein Nachtvogel.\" (E___le) — eu oder äu?", optionen: ["eu", "äu"], richtig: 0 },
      { typ: "mc", frage: "\"Schleiereulen sind R___ber.\" — eu oder äu?", optionen: ["eu", "äu"], richtig: 1 },
      { typ: "mc", frage: "\"Sie fressen gerne M___se.\" — eu oder äu?", optionen: ["eu", "äu"], richtig: 1 },
      { typ: "mc", frage: "\"Das passiert nicht h___fig.\" — eu oder äu?", optionen: ["eu", "äu"], richtig: 1 },
      { typ: "mc", frage: "\"Ich habe getr___mt.\" — eu oder äu?", optionen: ["eu", "äu"], richtig: 1 },
      { typ: "mc", frage: "\"Er fr___t sich sehr.\" — eu oder äu?", optionen: ["eu", "äu"], richtig: 0 },
      { typ: "mc", frage: "\"Das Geb___de ist alt.\" — eu oder äu?", optionen: ["eu", "äu"], richtig: 1 },
      // 3) Reimwörter
      { typ: "mc", frage: "Streu reimt sich auf ___ (beginnt mit H)", optionen: ["Heu", "Häu", "Hoi"], richtig: 0 },
      { typ: "mc", frage: "Leute reimt sich auf ___ (beginnt mit B)", optionen: ["Beute", "Bäute", "Boite"], richtig: 0 },
      { typ: "mc", frage: "bereuen reimt sich auf ___ (beginnt mit str)", optionen: ["streuen", "sträuen", "strauen"], richtig: 0 },
      { typ: "mc", frage: "Beule reimt sich auf ___ (beginnt mit E)", optionen: ["Eule", "Äule", "Eile"], richtig: 0 },
    ],
  },

  {
    id: "dehnungs-h",
    icon: "🎂",
    name: "Wörter mit Dehnungs-h",
    theorie: `
      <p>Ein Vokal mit <strong>Dehnungs-h</strong> wird lang gesprochen.
      Das h selbst hörst du dabei gar nicht. Es bleibt immer bei seinem
      Vokal, auch beim Trennen (<em>Fah-ne</em>).</p>
      <p>Das Dehnungs-h findest du oft vor <strong>l, m, n</strong> und
      <strong>r</strong>.</p>
      <p class="theorie-beispiel">🎂 Beispiel: <em>Rahmen, Zahn, Jahr,
      kahl</em></p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      Im Spanischen ist das h eigentlich <strong>immer</strong> stumm,
      egal wo es steht — <em>hola</em> oder <em>hermano</em> spricht man
      ohne jeden h-Laut. Im Deutschen hörst du das h sonst ganz normal
      (Haus, Hund) — nur beim Dehnungs-h verschwindet es, ähnlich wie im
      Spanischen immer.</p>
    `,
    aufgaben: [
      // 1) hl/hm/hn/hr zuordnen
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"kahl\"?", optionen: ["hl", "hm", "hn", "hr"], richtig: 0 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"Rahmen\"?", optionen: ["hl", "hm", "hn", "hr"], richtig: 1 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"Bahn\"?", optionen: ["hl", "hm", "hn", "hr"], richtig: 2 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"Jahr\"?", optionen: ["hl", "hm", "hn", "hr"], richtig: 3 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"zahlen\"?", optionen: ["hl", "hm", "hn", "hr"], richtig: 0 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"zahm\"?", optionen: ["hl", "hm", "hn", "hr"], richtig: 1 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"Zahn\"?", optionen: ["hl", "hm", "hn", "hr"], richtig: 2 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"Gefahr\"?", optionen: ["hl", "hm", "hn", "hr"], richtig: 3 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"Auswahl\"?", optionen: ["hl", "hm", "hn", "hr"], richtig: 0 },
      { typ: "mc", frage: "Zu welcher Gruppe gehört \"Ahnung\"?", optionen: ["hl", "hm", "hn", "hr"], richtig: 2 },
      // 2) Richtige Schreibweise
      { typ: "mc", frage: "Welche Schreibweise stimmt (ein kahler Kopf)?", optionen: ["kahl", "kal", "kahll"], richtig: 0 },
      { typ: "mc", frage: "Welche Schreibweise stimmt (ein Bilderrahmen)?", optionen: ["Ramen", "Rahmen", "Rahmmen"], richtig: 1 },
      { typ: "mc", frage: "Welche Schreibweise stimmt (ein Kalenderjahr)?", optionen: ["Jar", "Jahr", "Jaar"], richtig: 1 },
      { typ: "mc", frage: "Welche Schreibweise stimmt (ein Milchzahn)?", optionen: ["Zan", "Zahn", "Zaan"], richtig: 1 },
      { typ: "mc", frage: "Welche Schreibweise stimmt (die Nationalfahne)?", optionen: ["Fane", "Fahne", "Faane"], richtig: 1 },
      { typ: "mc", frage: "Welche Schreibweise stimmt (das stimmt wirklich, ist ___)? Achtung: 'war' ohne h ist die Vergangenheit von 'sein'!", optionen: ["war", "wahr", "waar"], richtig: 1 },
      // 3) Silbenrätsel-Definitionen
      { typ: "mc", frage: "Was passt: \"Eine Jahreszeit\"?", optionen: ["Frühling", "Kehle", "Bühne"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"Teil des Halses\"?", optionen: ["Kehle", "Höhle", "Lehne"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"Teil des Theaters\"?", optionen: ["Bühne", "Kehle", "Zähne"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"tiefes Loch im Berg\"?", optionen: ["Höhle", "Bühne", "Lehne"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"nicht vorhanden sein\"?", optionen: ["fehlen", "wählen", "nehmen"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"Teil des Sessels\"?", optionen: ["Lehne", "Höhle", "Kehle"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"Mehrzahl von Zahn\"?", optionen: ["Zähne", "Zahne", "Zahnen"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"Gegenteil von geben\"?", optionen: ["nehmen", "wählen", "fehlen"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"aussuchen\"?", optionen: ["wählen", "zählen", "fehlen"], richtig: 0 },
      // 4) Wortarten
      { typ: "mc", frage: "Welche Wortart ist \"Fahne\"?", optionen: ["Nomen", "Verb", "Adjektiv"], richtig: 0 },
      { typ: "mc", frage: "Welche Wortart ist \"erzählen\"?", optionen: ["Nomen", "Verb", "Adjektiv"], richtig: 1 },
      { typ: "mc", frage: "Welche Wortart ist \"zahm\"?", optionen: ["Nomen", "Verb", "Adjektiv"], richtig: 2 },
      { typ: "mc", frage: "Welche Wortart ist \"Nahrung\"?", optionen: ["Nomen", "Verb", "Adjektiv"], richtig: 0 },
      { typ: "mc", frage: "Welche Wortart ist \"fröhlich\"?", optionen: ["Nomen", "Verb", "Adjektiv"], richtig: 2 },
      { typ: "mc", frage: "Welche Wortart ist \"Auswahl\"?", optionen: ["Nomen", "Verb", "Adjektiv"], richtig: 0 },
      { typ: "mc", frage: "Welche Wortart ist \"gefährlich\"?", optionen: ["Nomen", "Verb", "Adjektiv"], richtig: 2 },
    ],
  },

  {
    id: "woerter-b-d-g",
    icon: "🏰",
    name: "Wörter mit b, d, g",
    theorie: `
      <p>Am Wortende hört man <strong>b/p</strong>, <strong>g/k</strong>
      und <strong>d/t</strong> oft gleich — nur am Wortanfang ist der
      Unterschied klar zu hören.</p>
      <p>Trick: das Wort <strong>verlängern</strong>. Bei Nomen suchst du
      die <strong>Mehrzahl</strong> (Burg – Burgen), bei Verben die
      <strong>Grundform</strong> (sie biegt – biegen), bei Adjektiven die
      <strong>Steigerung</strong> (gesund – gesünder).</p>
      <p class="theorie-beispiel">🏰 Beispiel: <em>Kind – Kinder (also mit
      d, nicht t)</em></p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      Spanisch wird viel direkter so geschrieben, wie man es hört — was du
      hörst, schreibst du fast immer genauso. Diesen Verlängerungs-Trick,
      um eine "versteckte" Schreibweise herauszufinden, brauchst du im
      Spanischen praktisch nie.</p>
    `,
    aufgaben: [
      // 1) Einzahl von Nomen finden
      { typ: "mc", frage: "Kinder — wie heisst die Einzahl?", optionen: ["das Kind", "das Kint", "das Kindt"], richtig: 0 },
      { typ: "mc", frage: "Getränke — wie heisst die Einzahl?", optionen: ["das Getränk", "das Getränkt", "das Geträng"], richtig: 0 },
      { typ: "mc", frage: "Schilder — wie heisst die Einzahl?", optionen: ["das Schild", "das Schilt", "das Schilb"], richtig: 0 },
      { typ: "mc", frage: "Berge — wie heisst die Einzahl?", optionen: ["der Berg", "der Berk", "der Berc"], richtig: 0 },
      { typ: "mc", frage: "Körbe — wie heisst die Einzahl?", optionen: ["der Korb", "der Korp", "der Korf"], richtig: 0 },
      { typ: "mc", frage: "Wälder — wie heisst die Einzahl?", optionen: ["der Wald", "der Walt", "der Waldt"], richtig: 0 },
      { typ: "mc", frage: "Zelte — wie heisst die Einzahl?", optionen: ["das Zelt", "das Zeld", "das Zeldt"], richtig: 0 },
      { typ: "mc", frage: "Kälber — wie heisst die Einzahl?", optionen: ["das Kalb", "das Kalp", "das Kalf"], richtig: 0 },
      { typ: "mc", frage: "Zwerge — wie heisst die Einzahl?", optionen: ["der Zwerg", "der Zwerk", "der Zwerc"], richtig: 0 },
      // 2) Grundform von Verben finden
      { typ: "mc", frage: "er schreibt — wie heisst die Grundform?", optionen: ["schreiben", "schreipen", "schreifen"], richtig: 0 },
      { typ: "mc", frage: "er singt — wie heisst die Grundform?", optionen: ["singen", "sinken", "sinden"], richtig: 0 },
      { typ: "mc", frage: "er legt — wie heisst die Grundform?", optionen: ["legen", "lechen", "lecken"], richtig: 0 },
      { typ: "mc", frage: "sie klebt — wie heisst die Grundform?", optionen: ["kleben", "klepen", "klefen"], richtig: 0 },
      { typ: "mc", frage: "er fegt — wie heisst die Grundform?", optionen: ["fegen", "fecken", "fechen"], richtig: 0 },
      { typ: "mc", frage: "er gibt — wie heisst die Grundform?", optionen: ["geben", "gepen", "gefen"], richtig: 0 },
      // 3) Grundform von Adjektiven finden
      { typ: "mc", frage: "eisiger — wie heisst die Grundform?", optionen: ["eisig", "eisik", "eisich"], richtig: 0 },
      { typ: "mc", frage: "jünger — wie heisst die Grundform?", optionen: ["jung", "junk", "junng"], richtig: 0 },
      { typ: "mc", frage: "spannender — wie heisst die Grundform?", optionen: ["spannend", "spannent", "spannennt"], richtig: 0 },
      { typ: "mc", frage: "härter — wie heisst die Grundform?", optionen: ["hart", "hard", "hardt"], richtig: 0 },
      { typ: "mc", frage: "gelber — wie heisst die Grundform?", optionen: ["gelb", "gelp", "gelf"], richtig: 0 },
      { typ: "mc", frage: "stärker — wie heisst die Grundform?", optionen: ["stark", "starg", "starck"], richtig: 0 },
      // 4) Richtige Form im Satz
      { typ: "mc", frage: "jung: Die ___ Pferde liefen ausgelassen über die Wiese.", optionen: ["jungen", "junjen", "junken"], richtig: 0 },
      { typ: "mc", frage: "bunt: Sie verkaufte zwanzig ___ Luftballons.", optionen: ["bunte", "bunde", "buncke"], richtig: 0 },
      { typ: "mc", frage: "wild: Drei Bergsteiger kletterten in der ___ Schlucht.", optionen: ["wilden", "wilten", "wildn"], richtig: 0 },
      { typ: "mc", frage: "lang: Die ___ Reise erschöpfte sie sehr.", optionen: ["lange", "langke", "lanke"], richtig: 0 },
      { typ: "mc", frage: "blind: Der ___ Mann wurde von einem Blindenhund geführt.", optionen: ["blinde", "blinte", "blindne"], richtig: 0 },
      { typ: "mc", frage: "weit: Der Blick über das ___ Meer liess sein Herz höher schlagen.", optionen: ["weite", "weide", "weiche"], richtig: 0 },
      // 5) End- oder Ent-?
      { typ: "mc", frage: "___los (nie aufhörend)", optionen: ["End", "Ent"], richtig: 0 },
      { typ: "mc", frage: "___stehen (z. B. ein Feuer entsteht)", optionen: ["End", "Ent"], richtig: 1 },
      { typ: "mc", frage: "der ___spurt (letzter Sprint im Rennen)", optionen: ["End", "Ent"], richtig: 0 },
      { typ: "mc", frage: "___gültig (nicht mehr gültig)", optionen: ["End", "Ent"], richtig: 0 },
      { typ: "mc", frage: "be___en (aufhören)", optionen: ["End", "Ent"], richtig: 0 },
      { typ: "mc", frage: "___decken (etwas Neues finden)", optionen: ["End", "Ent"], richtig: 1 },
      { typ: "mc", frage: "die ___zündung (im Körper)", optionen: ["End", "Ent"], richtig: 1 },
      { typ: "mc", frage: "un___lich (ohne Ende)", optionen: ["End", "Ent"], richtig: 0 },
      { typ: "mc", frage: "___täuschen (jemandem eine Hoffnung nehmen)", optionen: ["End", "Ent"], richtig: 1 },
    ],
  },

  {
    id: "doppelkonsonanten",
    icon: "🐫",
    name: "Wörter mit Doppelkonsonanten",
    theorie: `
      <p>Nach einem <strong>kurzen Vokal</strong> stehen oft
      <strong>Doppelkonsonanten</strong> (kommen, trennen). Achte darauf,
      wie der Vokal klingt.</p>
      <p>Beim Trennen zwischen zwei Vokalen trennst du <strong>zwischen</strong>
      den beiden Konsonanten (kom-men). Bei Zusammensetzungen bleiben die
      Konsonanten bei ihrem Wortteil (Treff-punkt) — auch wenn dadurch
      dreifache Buchstaben entstehen (Stall + Laterne = Stalllaterne).</p>
      <p class="theorie-beispiel">🐫 Beispiel: <em>Sommer, Wasser,
      Treffpunkt</em></p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      Im Spanischen gibt es fast keine doppelten Konsonanten — nur
      <em>rr</em> (perro) und <em>ll</em> kommen vor, sonst fast nichts. Die
      vielen deutschen Doppelkonsonanten wie mm, nn, ss, tt oder ff sind
      für jemanden, der Spanisch kennt, deshalb sehr ungewohnt.</p>
    `,
    aufgaben: [
      // 1) Trennen
      { typ: "mc", frage: "Wie trennt man \"rennen\"?", optionen: ["re-nnen", "ren-nen", "renn-en"], richtig: 1 },
      { typ: "mc", frage: "Wie trennt man \"fallen\"?", optionen: ["fa-llen", "fal-len", "fall-en"], richtig: 1 },
      { typ: "mc", frage: "Wie trennt man \"treffen\"?", optionen: ["tre-ffen", "tref-fen", "treff-en"], richtig: 1 },
      { typ: "mc", frage: "Wie trennt man \"Sommer\"?", optionen: ["So-mmer", "Som-mer", "Somm-er"], richtig: 1 },
      { typ: "mc", frage: "Wie trennt man \"knurren\"?", optionen: ["knu-rren", "knur-ren", "knurr-en"], richtig: 1 },
      { typ: "mc", frage: "Wie trennt man \"Wasser\"?", optionen: ["Wa-sser", "Was-ser", "Wass-er"], richtig: 1 },
      // 2) Verbformen (regelmässig und unregelmässig)
      { typ: "mc", frage: "gewinnen — wie heisst \"ich ___\" (Präsens)?", optionen: ["gewinne", "gewinnne", "gewine"], richtig: 0 },
      { typ: "mc", frage: "gewinnen — wie heisst \"ich ___\" (Vergangenheit)?", optionen: ["gewinnte", "gewann", "gewönnte"], richtig: 1 },
      { typ: "mc", frage: "schwimmen — wie heisst \"ich ___\" (Präsens)?", optionen: ["schwime", "schwimme", "schwimmme"], richtig: 1 },
      { typ: "mc", frage: "schwimmen — wie heisst \"ich ___\" (Vergangenheit)?", optionen: ["schwimmte", "schwamm", "schwomm"], richtig: 1 },
      { typ: "mc", frage: "knallen — wie heisst \"ich ___\" (Vergangenheit)?", optionen: ["knallte", "knoll", "knallete"], richtig: 0 },
      { typ: "mc", frage: "starren — wie heisst \"ich ___\" (Vergangenheit)?", optionen: ["starrte", "starrete", "starr"], richtig: 0 },
      { typ: "mc", frage: "sammeln — wie heisst \"ich ___\" (Präsens)?", optionen: ["sammele", "sammle", "sammel"], richtig: 1 },
      { typ: "mc", frage: "retten — wie heisst \"ich ___\" (Vergangenheit)?", optionen: ["rettte", "rettete", "rettet"], richtig: 1 },
      // 3) Komposita mit Artikel
      { typ: "mc", frage: "Treff + Punkt = ?", optionen: ["der Treffpunkt", "der Treffspunkt", "die Treffpunkt"], richtig: 0 },
      { typ: "mc", frage: "Ball + Spiel = ?", optionen: ["das Ballspiel", "das Ballsspiel", "der Ballspiel"], richtig: 0 },
      { typ: "mc", frage: "Renn + Pferd = ?", optionen: ["das Rennpferd", "das Rennspferd", "der Rennpferd"], richtig: 0 },
      { typ: "mc", frage: "Stopp + Uhr = ?", optionen: ["die Stoppuhr", "die Stoppsuhr", "das Stoppuhr"], richtig: 0 },
      { typ: "mc", frage: "Stall + Laterne = ?", optionen: ["die Stalllaterne", "die Stalaterne", "die Stallslaterne"], richtig: 0 },
      { typ: "mc", frage: "Sauerstoff + Flasche = ?", optionen: ["die Sauerstoffflasche", "die Sauerstofflasche", "die Sauerstoffsflasche"], richtig: 0 },
      // 4) biss/bis, Mann/man, fasst/fast
      { typ: "mc", frage: "Er ___ in den Apfel. (beissen, Vergangenheit)", optionen: ["biss", "bis"], richtig: 0 },
      { typ: "mc", frage: "Sie wartete von 10 Uhr ___ 12 Uhr.", optionen: ["biss", "bis"], richtig: 1 },
      { typ: "mc", frage: "Der ___ stieg in sein Rennauto.", optionen: ["Mann", "man"], richtig: 0 },
      { typ: "mc", frage: "Wie kann ___ am besten den Handstand üben?", optionen: ["Mann", "man"], richtig: 1 },
      { typ: "mc", frage: "Es ist schon ___ drei Uhr.", optionen: ["fasst", "fast"], richtig: 1 },
      { typ: "mc", frage: "Sie ___ euch am besten an den Schultern.", optionen: ["fasst", "fast"], richtig: 0 },
    ],
  },

  {
    id: "gehaeufte-konsonanten",
    icon: "🥏",
    name: "Wörter mit gehäuften Konsonanten",
    theorie: `
      <p>Von einer <strong>Konsonantenhäufung</strong> spricht man, wenn
      drei oder mehr <strong>verschiedene</strong> Konsonanten
      nebeneinander stehen. Wenn du genau hinhörst und die Silben
      erkennst, vergisst du bestimmt keinen Buchstaben.</p>
      <p class="theorie-beispiel">🥏 Beispiel: <em>schimpfen (mpf), Arzt
      (rzt), Kunst (nst)</em></p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      Spanische Silben bestehen fast immer aus Konsonant + Vokal, z. B.
      <em>ca-sa</em> oder <em>pe-lo</em>. Häufungen wie im deutschen
      <em>Herbst</em> oder <em>schimpfst</em> (gleich vier bzw. fünf
      Konsonanten hintereinander!) gibt es im Spanischen so gut wie nie.</p>
    `,
    aufgaben: [
      // 1) Stehen 3+ Konsonanten nebeneinander? Ja/Nein
      ...[
        ["schimpfen", true], ["Arzt", true], ["Frankreich", true], ["stampfen", true],
        ["Kunst", true], ["zwitschern", true], ["rutschen", true], ["schweben", true],
        ["Riese", false], ["Kind", false], ["bremsen", false], ["kurz", false],
        ["Brücke", false], ["trinken", false],
      ].map(([wort, hat3]) => ({
        typ: "mc",
        frage: `Stehen in "${wort}" drei oder mehr Konsonanten nebeneinander?`,
        optionen: ["Ja", "Nein"],
        richtig: hat3 ? 0 : 1,
      })),
      // 2) Richtige Verbform (2./3. Person)
      { typ: "mc", frage: "schnarchen — er ___?", optionen: ["schnarcht", "schnarchtet", "schnarche"], richtig: 0 },
      { typ: "mc", frage: "würzen — sie ___?", optionen: ["würzt", "würzet", "würze"], richtig: 0 },
      { typ: "mc", frage: "wärmen — sie ___?", optionen: ["wärmt", "wärmet", "wärme"], richtig: 0 },
      { typ: "mc", frage: "dampfen — es ___?", optionen: ["dampft", "dampfet", "dampfe"], richtig: 0 },
      { typ: "mc", frage: "singen — er ___?", optionen: ["singt", "singet", "singe"], richtig: 0 },
      { typ: "mc", frage: "springen — sie ___?", optionen: ["springt", "springet", "springe"], richtig: 0 },
      { typ: "mc", frage: "zwitschern — es ___?", optionen: ["zwitschert", "zwitschet", "zwitschre"], richtig: 0 },
      { typ: "mc", frage: "stürzen — du ___?", optionen: ["stürzt", "stürzest", "stürze"], richtig: 0 },
      { typ: "mc", frage: "schnitzen — du ___?", optionen: ["schnitzt", "schnitzest", "schnitze"], richtig: 0 },
      { typ: "mc", frage: "tanzen — du ___?", optionen: ["tanzt", "tanzest", "tanze"], richtig: 0 },
      { typ: "mc", frage: "sprechen — du ___?", optionen: ["sprichst", "sprechst", "sprecht"], richtig: 0 },
      { typ: "mc", frage: "bringen — du ___?", optionen: ["bringst", "brichst", "bringest"], richtig: 0 },
      // 3) Wortteile zusammensetzen
      { typ: "mc", frage: "Kirsch + ? = Kirschbaum", optionen: ["baum", "stand", "brett"], richtig: 0 },
      { typ: "mc", frage: "wirk + ? = wirklich", optionen: ["lich", "bar", "haus"], richtig: 0 },
      { typ: "mc", frage: "Abwechs + ? = Abwechslung", optionen: ["lung", "topf", "tisch"], richtig: 0 },
      { typ: "mc", frage: "furcht + ? = furchtbar", optionen: ["bar", "lich", "lung"], richtig: 0 },
      { typ: "mc", frage: "Nacht + ? = Nachttisch", optionen: ["tisch", "haus", "stand"], richtig: 0 },
      { typ: "mc", frage: "Verkaufs + ? = Verkaufsstand", optionen: ["stand", "brett", "topf"], richtig: 0 },
      { typ: "mc", frage: "Gewächs + ? = Gewächshaus", optionen: ["haus", "lung", "bar"], richtig: 0 },
      { typ: "mc", frage: "Dampfkoch + ? = Dampfkochtopf", optionen: ["topf", "tisch", "stand"], richtig: 0 },
      { typ: "mc", frage: "Sprung + ? = Sprungbrett", optionen: ["brett", "haus", "lich"], richtig: 0 },
      // 4) Komposita mit Obst-/Holz-
      { typ: "mc", frage: "Obst + ? = der Obstverkäufer", optionen: ["Verkäufer", "Stand", "Baum"], richtig: 0 },
      { typ: "mc", frage: "Obst + ? = die Obstschale", optionen: ["Schale", "Garten", "Teller"], richtig: 0 },
      { typ: "mc", frage: "Holz + ? = der Holzlöffel", optionen: ["Löffel", "Stapel", "Kiste"], richtig: 0 },
      { typ: "mc", frage: "Holz + ? = das Holzschwert", optionen: ["Schwert", "Stückchen", "Puppe"], richtig: 0 },
    ],
  },

  {
    id: "woerter-mit-v",
    icon: "⛵",
    name: "Wörter mit v",
    theorie: `
      <p>Das <strong>v</strong> ist einer der f-Laute. Meistens spricht man
      es wie <strong>f</strong> (Vater, viel), manchmal wie <strong>w</strong>
      (Vase, Villa). Die w-Wörter lernst du am besten auswendig:
      <strong>Vanille, Vase, Vietnam, Vokal, Villa, Verb, Velo</strong>.</p>
      <p class="theorie-beispiel">🚲 Beispiel: <em>Vater</em> (v wie f) —
      <em>Villa</em> (v wie w)</p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      Spanisch hat genau das gleiche Problem, einfach mit b und v: Beide
      werden fast identisch gesprochen, sodass Spanischsprachige oft
      überlegen müssen "¿Con b o con v?" (mit b oder mit v?). Es ist also
      derselbe Trick wie im Deutschen — nur mit einem anderen
      Buchstabenpaar.</p>
    `,
    aufgaben: [
      // 1) v wie f oder v wie w?
      { typ: "mc", frage: "Vase — wie spricht man das v?", optionen: ["wie f", "wie w"], richtig: 1 },
      { typ: "mc", frage: "Vers — wie spricht man das v?", optionen: ["wie f", "wie w"], richtig: 0 },
      { typ: "mc", frage: "Villa — wie spricht man das v?", optionen: ["wie f", "wie w"], richtig: 1 },
      { typ: "mc", frage: "Volk — wie spricht man das v?", optionen: ["wie f", "wie w"], richtig: 0 },
      { typ: "mc", frage: "Vanille — wie spricht man das v?", optionen: ["wie f", "wie w"], richtig: 1 },
      { typ: "mc", frage: "Silvester — wie spricht man das v?", optionen: ["wie f", "wie w"], richtig: 0 },
      { typ: "mc", frage: "Vietnam — wie spricht man das v?", optionen: ["wie f", "wie w"], richtig: 1 },
      { typ: "mc", frage: "vielleicht — wie spricht man das v?", optionen: ["wie f", "wie w"], richtig: 0 },
      { typ: "mc", frage: "Vokal — wie spricht man das v?", optionen: ["wie f", "wie w"], richtig: 1 },
      { typ: "mc", frage: "Ventil — wie spricht man das v?", optionen: ["wie f", "wie w"], richtig: 0 },
      { typ: "mc", frage: "Verb — wie spricht man das v?", optionen: ["wie f", "wie w"], richtig: 1 },
      { typ: "mc", frage: "Kurve — wie spricht man das v?", optionen: ["wie f", "wie w"], richtig: 0 },
      { typ: "mc", frage: "Velo — wie spricht man das v?", optionen: ["wie f", "wie w"], richtig: 1 },
      { typ: "mc", frage: "Vorsicht — wie spricht man das v?", optionen: ["wie f", "wie w"], richtig: 0 },
      { typ: "mc", frage: "Vögel — wie spricht man das v?", optionen: ["wie f", "wie w"], richtig: 0 },
      // 2) v-Rätsel-Definitionen
      { typ: "mc", frage: "Was passt: \"Gegenteil von hinter\"?", optionen: ["vor", "voll", "viel"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"eine Zahl\"?", optionen: ["vier", "voll", "vor"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"Gegenteil von leer\"?", optionen: ["voll", "viel", "vor"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"Gegenteil von wenig\"?", optionen: ["viel", "voll", "vier"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"Behälter für Blumen\"?", optionen: ["Vase", "Villa", "Veranda"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"Zu einer Familie gehören Kind, Mutter und...\"?", optionen: ["Vater", "Vogel", "Vetter"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"Tier, das fliegen kann und Federn hat\"?", optionen: ["Vogel", "Vater", "Viereck"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"kein Kreis, kein Dreieck\"?", optionen: ["Viereck", "Vase", "Vogel"], richtig: 0 },
      { typ: "mc", frage: "Was passt: \"grosser Balkon\"?", optionen: ["Veranda", "Villa", "Vase"], richtig: 0 },
      // 3) Wortbildung mit ver-/vor-/voll-/viel-
      { typ: "mc", frage: "mieten + ? = vermieten", optionen: ["ver-", "vor-", "voll-"], richtig: 0 },
      { typ: "mc", frage: "stecken + ? = verstecken", optionen: ["ver-", "vor-", "voll-"], richtig: 0 },
      { typ: "mc", frage: "bei + ? = vorbei", optionen: ["ver-", "vor-", "voll-"], richtig: 1 },
      { typ: "mc", frage: "mittags + ? = vormittags", optionen: ["ver-", "vor-", "voll-"], richtig: 1 },
      { typ: "mc", frage: "kommen + ? = vollkommen (perfekt)", optionen: ["ver-", "vor-", "voll-"], richtig: 2 },
      { typ: "mc", frage: "ständig + ? = vollständig", optionen: ["ver-", "vor-", "voll-"], richtig: 2 },
      { typ: "mc", frage: "fach + ? = vielfach", optionen: ["voll-", "vor-", "viel-"], richtig: 2 },
      { typ: "mc", frage: "fältig + ? = vielfältig", optionen: ["voll-", "vor-", "viel-"], richtig: 2 },
      { typ: "mc", frage: "sichtig + ? = vorsichtig", optionen: ["ver-", "vor-", "voll-"], richtig: 1 },
      { typ: "mc", frage: "gestern + ? = vorgestern", optionen: ["ver-", "vor-", "voll-"], richtig: 1 },
      { typ: "mc", frage: "welken + ? = verwelken", optionen: ["ver-", "vor-", "voll-"], richtig: 0 },
      { typ: "mc", frage: "bringen + ? = vollbringen (schaffen)", optionen: ["ver-", "vor-", "voll-"], richtig: 2 },
    ],
  },

  {
    id: "woertliche-rede",
    icon: "💬",
    name: "Wörtliche Rede",
    theorie: `
      <p>Die wörtliche Rede steht in <strong>Anführungszeichen</strong>
      („…“). Steht der Begleitsatz <strong>vor</strong> der Rede, endet er
      mit einem <strong>Doppelpunkt</strong> (Ich rief: „Komm!“). Steht der
      Begleitsatz <strong>nach</strong> der Rede, endet die Rede mit einem
      <strong>Komma</strong> („Komm!“, rief ich.).</p>
      <p class="theorie-beispiel">💡 Beispiel: <em>Vater mahnt: „Trag eine
      Sonnenbrille!“ — „Warum denn?“, murrt Sarah.</em></p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      Für wörtliche Rede benutzt man im Spanischen traditionell oft einen
      Gedankenstrich (—) statt Anführungszeichen, z. B. <em>—¿Vienes? —
      preguntó ella.</em> Ein ganz anderes System also, um genau dasselbe
      auszudrücken: dass jemand etwas sagt.</p>
    `,
    aufgaben: [
      // 1) Doppelpunkt oder Komma?
      { typ: "mc", frage: "Vater mahnt___ „Trag eine Sonnenbrille!“", optionen: [":", ","], richtig: 0 },
      { typ: "mc", frage: "„Warum denn?“___ murrt Sarah.", optionen: [":", ","], richtig: 1 },
      { typ: "mc", frage: "Er erzählt___ „Licht stammt von heissen Objekten.“", optionen: [":", ","], richtig: 0 },
      { typ: "mc", frage: "„Natürlich!“___ meint der Vater.", optionen: [":", ","], richtig: 1 },
      { typ: "mc", frage: "Ich rief___ „Komm sofort her!“", optionen: [":", ","], richtig: 0 },
      { typ: "mc", frage: "„Ich komme gleich!“___ rief sie zurück.", optionen: [":", ","], richtig: 1 },
      // 2) Vorangestellt oder nachgestellt?
      { typ: "mc", frage: "\"„Woher stammt eigentlich das Licht?“, will Jonas wissen.\" — Begleitsatz vorangestellt oder nachgestellt?", optionen: ["vorangestellt", "nachgestellt"], richtig: 1 },
      { typ: "mc", frage: "\"Er sagte: „Ich komme gleich.“\" — vorangestellt oder nachgestellt?", optionen: ["vorangestellt", "nachgestellt"], richtig: 0 },
      { typ: "mc", frage: "\"„Ich habe Hunger“, sagte er.\" — vorangestellt oder nachgestellt?", optionen: ["vorangestellt", "nachgestellt"], richtig: 1 },
      { typ: "mc", frage: "\"Sie fragte: „Kommst du mit?“\" — vorangestellt oder nachgestellt?", optionen: ["vorangestellt", "nachgestellt"], richtig: 0 },
      // 3) Welcher Satz ist richtig geschrieben?
      { typ: "mc", frage: "Welcher Satz stimmt?", optionen: ["Milots Eltern fragen: „Wann gehst du morgen zu Toni?“", "Milots Eltern fragen „Wann gehst du morgen zu Toni?“", "Milots Eltern fragen: Wann gehst du morgen zu Toni?"], richtig: 0 },
      { typ: "mc", frage: "Welcher Satz stimmt?", optionen: ["Sofia ruft „Hallo, Freunde!“", "Sofia ruft: „Hallo, Freunde!“", "Sofia ruft: Hallo, Freunde!"], richtig: 1 },
      { typ: "mc", frage: "Welcher Satz stimmt?", optionen: ["„Das kann ich aber besser“, lacht Karin.", "Das kann ich aber besser, lacht Karin.", "„Das kann ich aber besser“ lacht Karin."], richtig: 0 },
      { typ: "mc", frage: "Welcher Satz stimmt?", optionen: ["„Wer kommt morgen mit zum Schwimmen“, fragt Ali.", "„Wer kommt morgen mit zum Schwimmen?“, fragt Ali.", "Wer kommt morgen mit zum Schwimmen? fragt Ali."], richtig: 1 },
      { typ: "mc", frage: "Welcher Satz stimmt?", optionen: ["„Herrlich, wie die Sonne heute scheint!“, ruft die Mutter fröhlich.", "Herrlich, wie die Sonne heute scheint! ruft die Mutter fröhlich.", "„Herrlich, wie die Sonne heute scheint!“ ruft die Mutter fröhlich."], richtig: 0 },
      { typ: "mc", frage: "Welcher Satz stimmt?", optionen: ["„Ach ja, klar!“, lacht Sarah, „die Lampen.“", "„Ach ja, klar!, lacht Sarah, die Lampen.“", "Ach ja, klar!“, lacht Sarah, „die Lampen."], richtig: 0 },
    ],
  },

  {
    id: "zeitangaben",
    icon: "🕐",
    name: "Zeitangaben",
    theorie: `
      <p><strong>Morgen, Vormittag, Mittag, Nachmittag, Abend</strong> und
      <strong>Nacht</strong> sind Nomen. Nach <strong>vorgestern, gestern,
      heute, morgen, übermorgen</strong> schreibst du sie deshalb
      <strong>gross</strong>.</p>
      <p>Achtung: <strong>morgens, mittags, nachmittags, abends,
      nachts</strong> (mit -s am Ende) sind Adverbien und bleiben
      <strong>klein</strong>.</p>
      <p class="theorie-beispiel">😮 Fiese Falle: <em>morgen</em> (= der
      nächste Tag, klein) und <em>Morgen</em> (= die Tageszeit, gross) sehen
      gleich aus, bedeuten aber etwas ganz anderes! "Wir treffen uns
      <strong>morgen</strong>." aber "Der <strong>Morgen</strong> war
      neblig."</p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      Im Spanischen sind <em>la mañana, el mediodía, la tarde</em> und
      <em>la noche</em> ganz normale Nomen, die wie alle Nomen immer klein
      geschrieben werden. Dieses ganze Gross-/Klein-Rätsel mit -s am Ende
      gibt es im Spanischen also gar nicht.</p>
    `,
    aufgaben: [
      // 1) Gross oder klein im Satzzusammenhang?
      { typ: "mc", frage: "Gestern ___ war Mama im Kino. (Abend)", optionen: ["Abend", "abend"], richtig: 0 },
      { typ: "mc", frage: "Ich hoffe, dass ich morgen ___ nicht länger bleiben muss. (Mittag)", optionen: ["Mittag", "mittag"], richtig: 0 },
      { typ: "mc", frage: "Vorgestern ___ waren wir auf dem Schlossweiher. (Nachmittag)", optionen: ["Nachmittag", "nachmittag"], richtig: 0 },
      { typ: "mc", frage: "Ich bin ___ immer bei meiner Oma. (Adverb mit -s)", optionen: ["Nachmittags", "nachmittags"], richtig: 1 },
      { typ: "mc", frage: "Jele und Denis können erst morgen ___ ihre Freunde besuchen. (Nachmittag)", optionen: ["Nachmittag", "nachmittag"], richtig: 0 },
      { typ: "mc", frage: "Gestern ___ war die Feuerwehr in der Schule. (Tageszeit)", optionen: ["Morgen", "morgen"], richtig: 0 },
      { typ: "mc", frage: "Wenn ich ___ nicht vorwärts mache, komme ich zu spät. (Adverb mit -s)", optionen: ["Morgens", "morgens"], richtig: 1 },
      { typ: "mc", frage: "Heute ___ gibt es Pizza. (Mittag)", optionen: ["Mittag", "mittag"], richtig: 0 },
      { typ: "mc", frage: "Ich dusche immer ___. (Adverb mit -s)", optionen: ["morgens", "Morgens"], richtig: 0 },
      { typ: "mc", frage: "Übermorgen ___ treffen wir uns. (Mittag)", optionen: ["Mittag", "mittag"], richtig: 0 },
      // 2) Die Falle: morgen (Tag) vs. Morgen (Tageszeit)
      { typ: "mc", frage: "\"Wir treffen uns ___ um acht Uhr.\" (der nächste Tag)", optionen: ["morgen", "Morgen"], richtig: 0 },
      { typ: "mc", frage: "\"Der ___ war neblig.\" (die Tageszeit)", optionen: ["morgen", "Morgen"], richtig: 1 },
      { typ: "mc", frage: "\"Bis ___!\" (Verabschiedung, nächster Tag)", optionen: ["morgen", "Morgen"], richtig: 0 },
      { typ: "mc", frage: "\"Am nächsten ___ regnete es.\" (die Tageszeit)", optionen: ["morgen", "Morgen"], richtig: 1 },
      // 3) Adverb (mit -s, klein) oder Nomen (gross) erkennen
      { typ: "mc", frage: "\"Er kommt ___ vorbei.\" (regelmässig am Abend)", optionen: ["abends", "Abends"], richtig: 0 },
      { typ: "mc", frage: "\"Heute ___ gehen wir aus.\" (Nomen nach heute)", optionen: ["Abend", "abend"], richtig: 0 },
      { typ: "mc", frage: "\"Sie schläft ___ schlecht.\" (Adverb)", optionen: ["nachts", "Nachts"], richtig: 0 },
      { typ: "mc", frage: "\"Übermorgen ___ kommt Besuch.\" (Nomen nach übermorgen)", optionen: ["Nacht", "nacht"], richtig: 0 },
    ],
  },
];

// Themen aus dem Heft, die als Nächstes umgesetzt werden — hier nur als
// "bald verfügbar"-Kacheln gelistet (Name + Icon, keine Aufgaben/Theorie).
const DEUTSCH_KOMMENDE_THEMEN = [];
