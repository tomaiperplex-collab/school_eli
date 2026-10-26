// stadt-bern/data.js
// ---------------------------------------------------------------------------
// Lerninhalte NMG "Stadt Bern" (Lernziele vom 28.10.2026). Alle Fakten stammen
// aus den Arbeitsblättern (Berner Altstadt, Nydegghöfli, Münster, Zytglogge,
// Junkerngasse, Mattequartier).
//
// THEMEN: Gruppierung für Filter, Lernkarten und Fortschritt.
// KARTEN: Lernmodus (Stichworte pro Thema).
// FRAGEN: { thema, frage, antwort, falsch: [3 plausible falsche Antworten],
//           akzeptiert: [weitere richtige Schreibweisen für Freitext],
//           freitext: false -> Frage wird im Freitext-Modus ausgelassen,
//           info: Zusatzsatz fürs Feedback }
// ---------------------------------------------------------------------------

const THEMEN = {
  gruendung: { label: "Gründung & Name", farbe: "#c1121f", symbol: "🏰" },
  aufbau: { label: "Aufbau der Stadt", farbe: "#8a5a30", symbol: "🧭" },
  nydegg: { label: "Nydegghöfli", farbe: "#3d84c6", symbol: "🐻" },
  muenster: { label: "Münster", farbe: "#7b5ea7", symbol: "⛪" },
  zytglogge: { label: "Zytglogge", farbe: "#d4a017", symbol: "🕰️" },
  junkerngasse: { label: "Junkerngasse", farbe: "#6c757d", symbol: "🎩" },
  kramgasse: { label: "Kramgasse & Kornhausplatz", farbe: "#e07a5f", symbol: "🛍️" },
  matte: { label: "Mattequartier", farbe: "#2a9d5c", symbol: "🌊" },
  legenden: { label: "Legenden", farbe: "#9d4edd", symbol: "👻" },
};

const KARTEN = [
  {
    thema: "gruendung",
    titel: "Gründung & Name",
    punkte: [
      "Herzog Berchtold V. von Zähringen gründete Bern im Jahr 1191.",
      "Er liess die Stadt von Osten nach Westen bauen.",
      "Legende: Der Herzog wollte die Stadt nach dem ersten Tier benennen, das er bei der Jagd im nahen Wald erlegt. Es war ein Bär – daher «Bern». Der Bär ist das Wappentier.",
    ],
  },
  {
    thema: "aufbau",
    titel: "Aufbau der Stadt",
    punkte: [
      "Auf drei Seiten schützte die Aare die Stadt (Flussschlaufe).",
      "Im Westen schützten ein Stadttor, eine hohe Stadtmauer und ein Stadtgraben.",
      "Stadt und Burg lagen an der Aare. Die Zähringer bauten die Burg zur Sicherung des Aareübergangs.",
      "Schon im Mittelalter war Bern eine bedeutende Stadt und ein wichtiges Handelszentrum.",
      "Am Kornhausplatz war früher der Stadtgraben, wo heute Häuser neben dem Zytglogge stehen, die Stadtmauer.",
    ],
  },
  {
    thema: "nydegg",
    titel: "Nydegghöfli – die Anfänge Berns",
    punkte: [
      "Hier bauten die Zähringer (eine deutsche Familie) eine Burg.",
      "Bärenpark am Flussufer: Früher waren die Bären im engen Bärengraben, heute haben sie viel Freilauf.",
      "Die Aare ist grün wegen der Mineralien im Gletscherwasser aus den Alpen.",
      "Die kleine Brücke (Untere Brücke) war Berns erste Brücke (1256, Holz; 1461 aus Stein neu gebaut). An den Enden standen nachts geschlossene Tore, man bezahlte Zoll.",
      "Die Nydeggbrücke wurde viel später gebaut. Die vier Häuschen waren früher Zollhäuschen.",
      "Hinter der Statue von Berchtold V. hat es vier Bronzetafeln zur Gründungsgeschichte (u.a. die Bärenjagd).",
      "Die erste Schokoladenfabrik von Lindt stand hier – Rodolphe Lindt erfand die Schokolade, die im Mund schmilzt.",
    ],
  },
  {
    thema: "muenster",
    titel: "Berner Münster",
    punkte: [
      "Höchster Kirchturm der Schweiz: 100,6 Meter.",
      "Bauzeit 1421–1590; der oberste Teil des Turms kam erst 1893 dazu.",
      "Neun Glocken. Die grösste wiegt 10'000 kg («Gewichtige Susanna») – die schwerste der Schweiz.",
      "Das Hauptportal zeigt das Jüngste Gericht (Jesus richtet am «jüngsten Tag»).",
      "Auf der Plattform war früher ein Friedhof; viele Skelette liegen noch darunter.",
      "Wasserspeier oben am Münster dienen als Regenrinnen und sollen böse Geister vertreiben.",
      "Inschrifttafel «machs na» von Erhart.",
    ],
  },
  {
    thema: "zytglogge",
    titel: "Zytglogge",
    punkte: [
      "Berühmter Uhrenturm; zeigt in der Stadt seit 1405 die Zeit an.",
      "1191–1346 gehörte der Turm zur Wehrmauer, er war das westliche Eingangstor. Später Frauengefängnis. Im Stadtbrand 1405 brannte er aus.",
      "Das Uhrwerk wurde 1530 vom Schlosser Kaspar Brunner geschmiedet.",
      "Die astronomische Uhr zeigt: Tierkreiszeichen, Mondphasen, Wochentage, Datum, Tageszeit, Stunde.",
      "Zur vollen Stunde tanzt der Narr, die Bären drehen sich, der Hahn kräht. Chronos dreht die Sanduhr.",
      "Der goldene Stundenschläger (Hans von Thann, 2,55 m) schlägt die grosse Glocke – einer der ersten Roboter der Welt.",
    ],
  },
  {
    thema: "junkerngasse",
    titel: "Junkerngasse",
    punkte: [
      "Früher «Edle Gasse»: Am oberen Ende beim Münster lebten die reichen, mächtigen Familien.",
      "Am unteren Ende standen schmale Handwerkerhäuser.",
      "Brunnen: Löwe mit Schild und Stern = Wappen der Familie von Bubenberg.",
      "Das Bubenbergtor war vor über 800 Jahren ein Stadttor.",
      "Gespensterhaus: Junkerngasse 54.",
      "Napoleons Truppen besetzten Bern und nummerierten die Häuser; Strassenschilder in Farben. Französisches Schild «Rue des Gentils Hommes» = Junkerngasse.",
    ],
  },
  {
    thema: "kramgasse",
    titel: "Kramgasse & Kornhausplatz",
    punkte: [
      "Kramgasse: Früher ein grosser Marktplatz. Die Berner bauten Räume über die Trottoirs – so entstanden die «Lauben» (Arkaden), ein regengeschützter Platz für Fussgänger.",
      "Figuren an den Zunfthäusern: Schreiner (gestreiftes Hemd), Affe (Steinmetze), dunkelhäutige Figur (Tuchhändler und Schneider).",
      "Der Affe ist das Zeichen der Steinmetze, weil sie einen bestimmten Sandstein «Affe» nennen.",
      "Zähringerbrunnen: Ritter mit Speer und Schild; Bär trägt die Rüstung.",
      "Kindlifresserbrunnen auf dem Kornhausplatz (erbaut 1545): berühmtester Brunnen. Niemand weiss, warum der Künstler ihn so schuf.",
      "Bärenjagd-Bilder unter dem Zytglogge-Bogen; Kornhausplatz.",
      "Kreuzgasse: gemalte Fenster (acht Fenster, nur sechs echt).",
      "Haus Nr. 49: Albert Einstein wohnte hier 1905.",
    ],
  },
  {
    thema: "matte",
    titel: "Mattequartier",
    punkte: [
      "Hier wohnten Handwerker: Müller, Gerber, Fischer, Flösser, Säger, Goldschmiede.",
      "Früher der Hafen Berns an der Aare. Die Aare trat oft über die Ufer und überschwemmte das Quartier.",
      "Darum liegen die Laubengänge (Schifflaube) tiefer als die Strasse: Der Schlamm wurde auf die Strasse geschaufelt.",
      "Mattenenglisch: eigene Sprache – Dialektwörter, Silben umkehren, «i» am Anfang und «e» am Ende.",
      "Alte Fährenanlegestelle: Vor dem Brückenbau fuhren Fähren über die Aare.",
      "Die Bewohner der Matte unterschieden sich so von den reicheren Bernern der Junkerngasse.",
    ],
  },
  {
    thema: "legenden",
    titel: "Legenden & Geschichten",
    punkte: [
      "Ursula und der Bär: Die Bärin Ursula lebte über viele Jahre im Berner Bärengraben und brachte zahlreiche Junge zur Welt. Ihr Sohn Fredy wurde 1977 von Menschen aufgezogen und später in Urs umbenannt. Seine Geschichte ist im Naturmuseum Solothurn dokumentiert (mit historischen Bildern).",
      "Das Gespenst in der Junkerngasse: Gespensterhaus Nr. 54.",
      "Der Kindlifresser von Bern: Kindlifresserbrunnen auf dem Kornhausplatz.",
      "Marta und die Diebe: Wasserspeier am Münster erzählen die Geschichte.",
      "Der vergrabene Schatz: Fass mit Goldstücklein, Mattenenglisch-Tafel «Iehe ische ds'Issfe itme ide ludge-icklischte idne irve-ibegre!» (= Hier ist das Fass mit den Goldstücklein nicht vergraben).",
    ],
  },
];

const FRAGEN = [
  // ----- Gründung & Name -------------------------------------------------
  { thema: "gruendung", frage: "In welchem Jahr wurde die Stadt Bern gegründet?", antwort: "1191", falsch: ["1291", "1405", "1256"], akzeptiert: ["1191"], info: "Herzog Berchtold V. von Zähringen gründete Bern 1191." },
  { thema: "gruendung", frage: "Wer gründete die Stadt Bern?", antwort: "Herzog Berchtold V. von Zähringen", falsch: ["Napoleon", "Hans von Thann", "Rodolphe Lindt"], akzeptiert: ["berchtold", "berchtold v", "berchtold v.", "herzog berchtold", "berchtold von zähringen", "herzog berchtold v."] },
  { thema: "gruendung", frage: "Wie kam Bern zu seinem Namen?", antwort: "Nach dem ersten erlegten Tier, einem Bären", falsch: ["Nach dem Fluss Aare", "Nach dem Herzog Bernhard", "Nach dem Berner Münster"], freitext: false, info: "Der Herzog wollte die Stadt nach dem ersten Tier benennen, das er auf der Jagd erlegt – ein Bär." },
  { thema: "gruendung", frage: "Welches Tier ist das Wappentier von Bern?", antwort: "Bär", falsch: ["Löwe", "Affe", "Hahn"], akzeptiert: ["bär", "baer", "der bär", "bären"] },
  { thema: "gruendung", frage: "In welche Richtung liess der Herzog die Stadt bauen?", antwort: "Von Osten nach Westen", falsch: ["Von Westen nach Osten", "Von Norden nach Süden", "Rund um den Bärengraben"], freitext: false },
  { thema: "gruendung", frage: "Welche Familie baute an der Stelle des Nydegghöfli die erste Burg?", antwort: "Die Zähringer", falsch: ["Die von Bubenberg", "Die Habsburger", "Die Lindt"], akzeptiert: ["zähringer", "die zähringer", "zähringen", "zaehringer"] },

  // ----- Aufbau ----------------------------------------------------------
  { thema: "aufbau", frage: "Wie viele Seiten der Stadt waren von der Aare geschützt?", antwort: "Drei", falsch: ["Eine", "Zwei", "Vier"], akzeptiert: ["3", "drei", "auf drei seiten"] },
  { thema: "aufbau", frage: "Wodurch war die Stadt Richtung Westen geschützt?", antwort: "Stadttor, hohe Stadtmauer und Stadtgraben", falsch: ["Nur durch einen Wald", "Durch den Bärengraben", "Durch die Aare"], freitext: false },
  { thema: "aufbau", frage: "Was war früher am Kornhausplatz, wo heute der Platz ist?", antwort: "Der Stadtgraben", falsch: ["Der Hafen", "Ein Friedhof", "Ein Marktplatz"], akzeptiert: ["stadtgraben", "der stadtgraben", "graben"], info: "Der Stadtgraben schützte die Stadt." },
  { thema: "aufbau", frage: "Was stand früher dort, wo heute die Häuser neben dem Zytglogge stehen?", antwort: "Die Stadtmauer", falsch: ["Die Schifflaube", "Der Bärengraben", "Das Münster"], akzeptiert: ["stadtmauer", "die stadtmauer", "mauer"] },
  { thema: "aufbau", frage: "Wofür war Bern schon im Mittelalter bekannt?", antwort: "Ein wichtiges Handelszentrum", falsch: ["Ein Skigebiet", "Eine Uhrenstadt", "Ein Fischerdorf"], freitext: false },

  // ----- Nydegghöfli -----------------------------------------------------
  { thema: "nydegg", frage: "Wo waren die Bären früher untergebracht?", antwort: "Im engen Bärengraben", falsch: ["Im Bärenpark", "Im Mattequartier", "Im Münster"], akzeptiert: ["bärengraben", "im bärengraben", "baerengraben"] },
  { thema: "nydegg", frage: "Wo haben die Bären heute viel Freilauf?", antwort: "Im Bärenpark am Flussufer", falsch: ["Im Bärengraben", "Auf dem Kornhausplatz", "Auf der Münsterplattform"], akzeptiert: ["bärenpark", "im bärenpark", "baerenpark"] },
  { thema: "nydegg", frage: "Warum ist die Aare grün?", antwort: "Mineralien im Gletscherwasser", falsch: ["Algen im See", "Die Bäume spiegeln sich", "Abwasser der Stadt"], akzeptiert: ["mineralien", "wegen den mineralien"], info: "Das Gletscherwasser aus den Alpen enthält Mineralien." },
  { thema: "nydegg", frage: "Welche Brücke war Berns erste Brücke?", antwort: "Die kleine Brücke (Untere Brücke)", falsch: ["Die Nydeggbrücke", "Die Kirchenfeldbrücke", "Die Bubenbergbrücke"], akzeptiert: ["untere brücke", "die untere brücke", "kleine brücke", "die kleine brücke", "untertorbrücke"] },
  { thema: "nydegg", frage: "Aus welchem Jahr stammt Berns erste Brücke?", antwort: "1256", falsch: ["1191", "1461", "1405"], akzeptiert: ["1256"], info: "Zuerst aus Holz; 1461 aus Stein neu gebaut." },
  { thema: "nydegg", frage: "Welche Häuschen stehen an den Enden der Nydeggbrücke?", antwort: "Frühere Zollhäuschen", falsch: ["Frühere Fischerhütten", "Frühere Gespensterhäuser", "Frühere Stadttore"], akzeptiert: ["zollhäuschen", "zollhaeuschen", "zollhäuser"] },
  { thema: "nydegg", frage: "Warum musste man früher an der Brücke Zoll bezahlen?", antwort: "Für den Zugang zur Stadt", falsch: ["Für den Bärenpark", "Für das Fischen", "Für die Fähre"], freitext: false },
  { thema: "nydegg", frage: "Welche Firma hatte hier ihre erste Schokoladenfabrik?", antwort: "Lindt", falsch: ["Toblerone", "Cailler", "Suchard"], akzeptiert: ["lindt", "firma lindt"], info: "Rodolphe Lindt erfand die Schokolade, die im Mund schmilzt." },
  { thema: "nydegg", frage: "Was zeigen die vier Bronzetafeln hinter der Statue von Berchtold V.?", antwort: "Die Geschichte der Gründung Berns", falsch: ["Die Geschichte der Zytglogge", "Die Geschichte der Schokolade", "Die Geschichte der Aare"], freitext: false },

  // ----- Münster ---------------------------------------------------------
  { thema: "muenster", frage: "Wie hoch ist der Turm des Berner Münsters?", antwort: "100,6 Meter", falsch: ["50 Meter", "75,3 Meter", "134 Meter"], akzeptiert: ["100,6", "100.6", "100,6 m", "100.6 meter", "100,6 meter", "100.6 m"], info: "Höchster Kirchturm der Schweiz." },
  { thema: "muenster", frage: "Wie viele Glocken hat das Berner Münster?", antwort: "Neun", falsch: ["Drei", "Sechs", "Zwölf"], akzeptiert: ["9", "neun"] },
  { thema: "muenster", frage: "Wie schwer ist die grösste Glocke?", antwort: "10'000 Kilogramm", falsch: ["1000 Kilogramm", "5000 Kilogramm", "50'000 Kilogramm"], akzeptiert: ["10000", "10'000", "10000 kg", "10'000 kg", "10 tonnen", "10000 kilogramm"], info: "So viel wie zwei erwachsene Elefanten." },
  { thema: "muenster", frage: "Wie heisst die grösste Glocke des Münsters?", antwort: "Gewichtige Susanna", falsch: ["Grosse Ursula", "Schwere Marta", "Goldene Elisabeth"], akzeptiert: ["gewichtige susanna", "susanna"] },
  { thema: "muenster", frage: "Wann wurde der oberste Teil des Münsterturms hinzugefügt?", antwort: "1893", falsch: ["1421", "1590", "1530"], akzeptiert: ["1893"] },
  { thema: "muenster", frage: "Wann wurde am Münster gebaut (Bauzeit)?", antwort: "1421–1590", falsch: ["1191–1256", "1405–1530", "1893–1990"], freitext: false },
  { thema: "muenster", frage: "Was ist am Hauptportal dargestellt?", antwort: "Das Jüngste Gericht", falsch: ["Die Bärenjagd", "Die Gründung Berns", "Der Stadtbrand"], akzeptiert: ["jüngstes gericht", "das jüngste gericht", "das jüngste gericht"] },
  { thema: "muenster", frage: "Was befand sich früher auf der Münsterplattform?", antwort: "Ein Friedhof", falsch: ["Ein Markt", "Ein Hafen", "Eine Burg"], akzeptiert: ["friedhof", "ein friedhof", "der friedhof"] },
  { thema: "muenster", frage: "Wozu werden die Wasserspeier am Münster heute noch genutzt?", antwort: "Als Regenrinnen", falsch: ["Als Glockenhalter", "Als Lampen", "Als Fahnenstangen"], akzeptiert: ["regenrinnen", "als regenrinne", "regenrinne"], info: "Ihnen wird nachgesagt, dass sie böse Geister vertreiben." },

  // ----- Zytglogge -------------------------------------------------------
  { thema: "zytglogge", frage: "Seit wann zeigt die Zytglogge in der Stadt die Zeit an?", antwort: "1405", falsch: ["1191", "1530", "1346"], akzeptiert: ["1405"] },
  { thema: "zytglogge", frage: "Was war die Zytglogge von 1191 bis 1346?", antwort: "Das westliche Stadttor", falsch: ["Ein Gefängnis", "Ein Kornhaus", "Eine Kirche"], akzeptiert: ["stadttor", "westliches stadttor", "das westliche stadttor", "eingangstor", "tor"] },
  { thema: "zytglogge", frage: "Was ereignete sich 1405 in Bern?", antwort: "Ein grosser Stadtbrand", falsch: ["Eine Überschwemmung", "Eine Belagerung", "Ein Erdbeben"], akzeptiert: ["stadtbrand", "ein stadtbrand", "grosser stadtbrand", "brand"] },
  { thema: "zytglogge", frage: "Wer schmiedete 1530 das Uhrwerk?", antwort: "Der Schlosser Kaspar Brunner", falsch: ["Hans von Thann", "Erhart Küng", "Chronos"], akzeptiert: ["kaspar brunner", "kasper brunner", "brunner", "caspar brunner"] },
  { thema: "zytglogge", frage: "Welche Zeitangabe gehört NICHT zur astronomischen Uhr?", antwort: "Die Temperatur", falsch: ["Die Mondphasen", "Die Wochentage", "Die Tierkreiszeichen"], freitext: false },
  { thema: "zytglogge", frage: "Was passiert zur vollen Stunde?", antwort: "Der Narr tanzt, die Bären drehen sich, der Hahn kräht", falsch: ["Das Tor öffnet sich", "Chronos fällt vom Turm", "Es regnet Goldstücke"], freitext: false },
  { thema: "zytglogge", frage: "Wer ist Chronos?", antwort: "Der griechische Gott der Zeit", falsch: ["Ein Berner Schlosser", "Ein Herzog", "Ein Steinmetz"], freitext: false },
  { thema: "zytglogge", frage: "Wie gross ist die goldene Figur, die die Stundenglocke schlägt?", antwort: "2,55 Meter", falsch: ["1 Meter", "5 Meter", "10 Meter"], akzeptiert: ["2,55", "2.55", "2,55 m", "2.55 meter", "2,55 meter", "2.55 m"], info: "Sie ist einer der ersten Roboter der Welt." },

  // ----- Junkerngasse ----------------------------------------------------
  { thema: "junkerngasse", frage: "Wie wurde die Junkerngasse früher genannt?", antwort: "Edle Gasse", falsch: ["Reiche Strasse", "Goldgasse", "Herrengasse"], akzeptiert: ["edle gasse", "die edle gasse"] },
  { thema: "junkerngasse", frage: "Wer lebte am oberen Ende der Junkerngasse, in der Nähe des Münsters?", antwort: "Reiche und mächtige Familien", falsch: ["Fischer und Gerber", "Mönche", "Soldaten Napoleons"], freitext: false },
  { thema: "junkerngasse", frage: "Wer wohnte am unteren Ende der Junkerngasse?", antwort: "Handwerker", falsch: ["Herzöge", "Bären", "Zolleinnehmer"], akzeptiert: ["handwerker", "die handwerker"], info: "In schmalen Handwerkerhäusern." },
  { thema: "junkerngasse", frage: "Welches Tier steht auf dem Brunnen in der Junkerngasse?", antwort: "Löwe", falsch: ["Bär", "Affe", "Hahn"], akzeptiert: ["löwe", "loewe", "der löwe"], info: "Er hält einen Schild mit Stern: das Wappen der Familie von Bubenberg." },
  { thema: "junkerngasse", frage: "Wessen Wappen zeigt der Schild mit dem Stern?", antwort: "Familie von Bubenberg", falsch: ["Familie Zähringer", "Familie von Thann", "Familie Lindt"], akzeptiert: ["bubenberg", "von bubenberg", "familie von bubenberg"] },
  { thema: "junkerngasse", frage: "An welcher Hausnummer steht Berns berühmtestes Gespensterhaus?", antwort: "Junkerngasse 54", falsch: ["Junkerngasse 12", "Kramgasse 49", "Junkerngasse 34"], akzeptiert: ["54", "nummer 54", "junkerngasse 54"] },
  { thema: "junkerngasse", frage: "Wer besetzte einst Bern und nummerierte die Häuser?", antwort: "Napoleons Truppen", falsch: ["Die Zähringer", "Die Habsburger", "Die Römer"], akzeptiert: ["napoleon", "napoleons truppen", "napoleon truppen", "die franzosen", "franzosen"] },
  { thema: "junkerngasse", frage: "Warum bezeichnete man Quartiere mit Farben und nummerierte Häuser?", antwort: "Die Soldaten konnten nicht lesen und kein Deutsch", falsch: ["Wegen der Touristen", "Wegen der Post", "Wegen der Feuerwehr"], freitext: false },
  { thema: "junkerngasse", frage: "Wie heisst die Junkerngasse auf dem französischen Strassenschild?", antwort: "Rue des Gentils Hommes", falsch: ["Rue de la Noblesse", "Rue du Roi", "Rue des Ours"], akzeptiert: ["rue des gentils hommes", "rue des gentilshommes"] },
  { thema: "junkerngasse", frage: "Wie alt ist das Bubenbergtor mindestens?", antwort: "Über 800 Jahre", falsch: ["Etwa 100 Jahre", "Etwa 300 Jahre", "Etwa 500 Jahre"], freitext: false, info: "Es war vor über 800 Jahren ein Stadttor." },

  // ----- Kramgasse & Kornhausplatz ----------------------------------------
  { thema: "kramgasse", frage: "Wie nennen die Berner die Arkaden?", antwort: "Lauben", falsch: ["Arkadien", "Terrassen", "Balkone"], akzeptiert: ["lauben", "laube", "die lauben"] },
  { thema: "kramgasse", frage: "Wie entstanden die Lauben in der Kramgasse?", antwort: "Man baute Räume über die Trottoirs", falsch: ["Man baute Tunnel unter den Häusern", "Man baute Brücken über die Aare", "Man baute Zelte für den Markt"], freitext: false, info: "So gab es einen regengeschützten Platz für Fussgänger." },
  { thema: "kramgasse", frage: "Was war früher in der Kramgasse?", antwort: "Ein grosser Marktplatz", falsch: ["Ein Friedhof", "Ein Hafen", "Ein Schloss"], akzeptiert: ["marktplatz", "ein marktplatz", "ein grosser marktplatz", "markt"] },
  { thema: "kramgasse", frage: "Welches Zeichen hatten die Steinmetze?", antwort: "Den Affen", falsch: ["Den Bären", "Den Löwen", "Den Hahn"], akzeptiert: ["affe", "der affe", "den affen"], info: "Sie nennen einen bestimmten Sandstein «Affe»." },
  { thema: "kramgasse", frage: "Wie heisst der berühmteste Brunnen der Stadt?", antwort: "Kindlifresserbrunnen", falsch: ["Zähringerbrunnen", "Löwenbrunnen", "Bärenbrunnen"], akzeptiert: ["kindlifresserbrunnen", "kindlifresser", "kindlifresser-brunnen", "kindlifresser brunnen", "der kindlifresserbrunnen"] },
  { thema: "kramgasse", frage: "Was trägt der Ritter am Zähringerbrunnen?", antwort: "Speer, Schild und Rüstung", falsch: ["Schwert und Krone", "Pfeil und Bogen", "Hammer und Amboss"], freitext: false },
  { thema: "kramgasse", frage: "Wer wohnte 1905 in Bern an der Kramgasse 49?", antwort: "Albert Einstein", falsch: ["Napoleon", "Rodolphe Lindt", "Berchtold V."], akzeptiert: ["einstein", "albert einstein"] },
  { thema: "kramgasse", frage: "Was sieht man unter dem Zytglogge-Bogen?", antwort: "Vier grosse Bilder der Bärenjagd", falsch: ["Die Aare", "Das Münster", "Den Bärengraben"], freitext: false },

  // ----- Mattequartier ---------------------------------------------------
  { thema: "matte", frage: "Wie heisst die besondere Sprache der Mattequartier-Bewohner?", antwort: "Mattenenglisch", falsch: ["Berndeutsch-Plus", "Mattenfranzösisch", "Altstadtlatein"], akzeptiert: ["mattenenglisch", "matteenglisch", "matten-englisch"] },
  { thema: "matte", frage: "Wie entstand das Mattenenglisch?", antwort: "Dialektwörter, Silben umkehren, «i» vorne und «e» hinten", falsch: ["Aus dem Englischen", "Aus dem Französischen", "Aus dem Lateinischen"], freitext: false },
  { thema: "matte", frage: "Welche Handwerker wohnten in der Matte?", antwort: "Müller, Gerber, Fischer, Flösser, Säger, Goldschmiede", falsch: ["Nur Bäcker", "Nur Steinmetze", "Nur Uhrmacher"], freitext: false },
  { thema: "matte", frage: "Was war früher am Wasser in der Matte?", antwort: "Der Hafen Berns", falsch: ["Der Bahnhof", "Der Marktplatz", "Der Friedhof"], akzeptiert: ["hafen", "der hafen", "hafen berns"] },
  { thema: "matte", frage: "Warum liegen die Laubengänge der Schifflaube tiefer als die Strasse?", antwort: "Man schaufelte den Schlamm der Überschwemmungen auf die Strasse", falsch: ["Man grub sie absichtlich tiefer", "Die Strasse wurde abgesenkt", "Wegen der Brücke"], freitext: false },
  { thema: "matte", frage: "Was machte die Aare früher oft im Mattequartier?", antwort: "Sie trat über die Ufer", falsch: ["Sie trocknete aus", "Sie gefror", "Sie wechselte die Farbe"], freitext: false, info: "Sie überschwemmte das Quartier." },
  { thema: "matte", frage: "Wie kamen die Leute vor dem Bau der Brücke über die Aare?", antwort: "Mit Fähren", falsch: ["Zu Fuss durchs Wasser", "Mit Seilbahnen", "Mit Zügen"], akzeptiert: ["fähren", "faehren", "fähre", "mit fähren", "mit der fähre"] },

  // ----- Legenden --------------------------------------------------------
  { thema: "legenden", frage: "Wo steht der Kindlifresser von Bern?", antwort: "Auf dem Kindlifresserbrunnen auf dem Kornhausplatz", falsch: ["Im Bärengraben", "Auf dem Münster", "In der Matte"], freitext: false },
  { thema: "legenden", frage: "Was erzählen die Wasserspeier am Münster?", antwort: "Martas Geschichte", falsch: ["Ursulas Geschichte", "Die Geschichte der Bärenjagd", "Die Geschichte von Napoleon"], akzeptiert: ["marta", "martas geschichte", "marta und die diebe"] },
  { thema: "legenden", frage: "Was ist in der Legende im Fass vergraben?", antwort: "Goldstücke", falsch: ["Schokolade", "Zolleinnahmen", "Kanonenkugeln"], akzeptiert: ["gold", "goldstücke", "goldstücklein", "goldstuecke", "schatz", "goldschatz"] },
  { thema: "legenden", frage: "In welcher Sprache steht die Tafel zum vergrabenen Schatz?", antwort: "Mattenenglisch", falsch: ["Latein", "Französisch", "Englisch"], akzeptiert: ["mattenenglisch", "matteenglisch"] },
  { thema: "legenden", frage: "In welcher Gasse spukt das berühmte Gespenst?", antwort: "Junkerngasse", falsch: ["Kramgasse", "Kreuzgasse", "Postgasse"], akzeptiert: ["junkerngasse", "in der junkerngasse", "die junkerngasse"] },
  { thema: "legenden", frage: "Welche Legende erklärt den Namen «Bern»?", antwort: "Der Herzog und der erlegte Bär", falsch: ["Die Legende von Ursula", "Marta und die Diebe", "Der Kindlifresser"], freitext: false },
];
