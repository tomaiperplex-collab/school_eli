// franzoesisch/data.js — Themen für das Fach Französisch: Theorie-Block +
// Übungsaufgaben pro Thema. Jedes Thema hat eine feste `id` (Schlüssel im
// Fortschritt/localStorage — nie ändern, sonst geht gespeicherter
// Fortschritt verloren).
//
// Vokabel-Themen werden aus Paaren [französisch, deutsch] erzeugt
// (vokabelAufgaben): pro Paar eine Frage in jede Richtung, die falschen
// Antworten stammen zufällig aus demselben Thema.
// Aufgaben-Typ (nur Multiple-Choice, mobilfreundlich):
//   { typ: "mc", frage, optionen: [...], richtig: <Index in optionen> }

function waehleZufaellig(liste, anzahl, ausser) {
  const pool = liste.filter((x) => x !== ausser);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, anzahl);
}

function vokabelAufgaben(paare) {
  const franz = paare.map((p) => p[0]);
  const deutsch = paare.map((p) => p[1]);
  const aufgaben = [];
  paare.forEach(([fr, de]) => {
    aufgaben.push({
      typ: "mc",
      frage: `Was heisst „${fr}“ auf Deutsch?`,
      optionen: [de, ...waehleZufaellig(deutsch, 2, de)],
      richtig: 0,
    });
    aufgaben.push({
      typ: "mc",
      frage: `Wie heisst „${de}“ auf Französisch?`,
      optionen: [fr, ...waehleZufaellig(franz, 2, fr)],
      richtig: 0,
    });
  });
  return aufgaben;
}

// Formen von Verben: [Frage-Satz mit ___, richtige Form, falsche Formen]
function formAufgaben(eintraege) {
  return eintraege.map(([frage, richtig, falsch]) => ({
    typ: "mc",
    frage,
    optionen: [richtig, ...falsch],
    richtig: 0,
  }));
}

const FRANZOESISCH_THEMEN = [
  {
    id: "begruessung",
    icon: "👋",
    name: "Begrüssung & Höflichkeit",
    theorie: `
      <p>Mit diesen Wörtern kommst du im Französischen überall weiter:</p>
      <p class="theorie-beispiel">🔎 <em>bonjour</em> (Guten Tag), <em>salut</em>
      (Hallo / Tschüss), <em>au revoir</em> (Auf Wiedersehen),
      <em>merci</em> (danke), <em>s'il te plaît</em> (bitte), <em>oui</em> (ja),
      <em>non</em> (nein)</p>
      <p>Mit Kindern und Freunden sagst du <strong>tu</strong> („du“), mit
      Erwachsenen, die du nicht gut kennst, sagst du <strong>vous</strong>
      („Sie“). Darum heisst „bitte“ unter Freunden <em>s'il te plaît</em>
      und höflich <em>s'il vous plaît</em>.</p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      <em>por favor</em> ↔ <em>s'il vous plaît</em>, <em>gracias</em> ↔
      <em>merci</em>, <em>adiós</em> ↔ <em>au revoir</em>, <em>sí</em> ↔
      <em>oui</em>, <em>buenas noches</em> ↔ <em>bonne nuit</em>. Gleiche
      Bedeutung — aber die Wörter klingen ganz anders!</p>
    `,
    aufgaben: vokabelAufgaben([
      ["bonjour", "Guten Tag"], ["salut", "Hallo / Tschüss"],
      ["au revoir", "Auf Wiedersehen"], ["merci", "danke"],
      ["s'il te plaît", "bitte (unter Freunden)"], ["oui", "ja"], ["non", "nein"],
      ["bonne nuit", "gute Nacht"], ["à bientôt", "bis bald"],
      ["excuse-moi", "entschuldige"], ["comment ça va ?", "wie geht's?"],
      ["je m'appelle", "ich heisse"],
    ]),
  },
  {
    id: "zahlen",
    icon: "🔢",
    name: "Zahlen 1–20",
    theorie: `
      <p>Die Zahlen bis 20 musst du auswendig lernen:</p>
      <p class="theorie-beispiel">🔎 1 <em>un</em>, 2 <em>deux</em>, 3 <em>trois</em>,
      4 <em>quatre</em>, 5 <em>cinq</em>, 6 <em>six</em>, 7 <em>sept</em>,
      8 <em>huit</em>, 9 <em>neuf</em>, 10 <em>dix</em></p>
      <p class="theorie-beispiel">11 <em>onze</em>, 12 <em>douze</em>,
      13 <em>treize</em>, 14 <em>quatorze</em>, 15 <em>quinze</em>,
      16 <em>seize</em>, 17 <em>dix-sept</em>, 18 <em>dix-huit</em>,
      19 <em>dix-neuf</em>, 20 <em>vingt</em></p>
      <p>Ab 17 werden die Zahlen zusammengesetzt: <em>dix-sept</em> =
      zehn-sieben.</p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      Viele Zahlen sind verwandt: <em>tres</em> ↔ <em>trois</em>,
      <em>seis</em> ↔ <em>six</em>, <em>siete</em> ↔ <em>sept</em>,
      <em>diez</em> ↔ <em>dix</em>. Aber Achtung: <em>cinco</em> ↔
      <em>cinq</em> und <em>ocho</em> ↔ <em>huit</em> klingen im Französischen
      ganz anders.</p>
    `,
    aufgaben: vokabelAufgaben([
      ["un", "1"], ["deux", "2"], ["trois", "3"], ["quatre", "4"], ["cinq", "5"],
      ["six", "6"], ["sept", "7"], ["huit", "8"], ["neuf", "9"], ["dix", "10"],
      ["onze", "11"], ["douze", "12"], ["treize", "13"], ["quatorze", "14"],
      ["quinze", "15"], ["seize", "16"], ["dix-sept", "17"], ["dix-huit", "18"],
      ["dix-neuf", "19"], ["vingt", "20"],
    ]).map((a) => ({
      ...a,
      frage: a.frage.replace("Was heisst", "Welche Zahl ist").replace(" auf Deutsch?", "?"),
    })),
  },
  {
    id: "farben",
    icon: "🎨",
    name: "Farben",
    theorie: `
      <p class="theorie-beispiel">🔎 <em>rouge</em> (rot), <em>bleu</em> (blau),
      <em>vert</em> (grün), <em>jaune</em> (gelb), <em>noir</em> (schwarz),
      <em>blanc</em> (weiss), <em>gris</em> (grau), <em>marron</em> (braun),
      <em>rose</em> (rosa), <em>orange</em> (orange), <em>violet</em> (violett)</p>
      <p>Farben schreibt man im Französischen <strong>klein</strong>, auch wenn
      sie als Nomen gebraucht werden: <em>le rouge</em>.</p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      <em>rojo</em> ↔ <em>rouge</em>, <em>azul</em> ↔ <em>bleu</em>,
      <em>verde</em> ↔ <em>vert</em>, <em>amarillo</em> ↔ <em>jaune</em>,
      <em>negro</em> ↔ <em>noir</em>, <em>blanco</em> ↔ <em>blanc</em>.
      <em>blanc</em> und <em>blanco</em> sehen sich ähnlich — der Rest eher nicht!</p>
    `,
    aufgaben: vokabelAufgaben([
      ["rouge", "rot"], ["bleu", "blau"], ["vert", "grün"], ["jaune", "gelb"],
      ["noir", "schwarz"], ["blanc", "weiss"], ["gris", "grau"],
      ["marron", "braun"], ["rose", "rosa"], ["orange", "orange"],
      ["violet", "violett"],
    ]),
  },
  {
    id: "familie",
    icon: "👨‍👩‍👧",
    name: "Familie",
    theorie: `
      <p class="theorie-beispiel">🔎 <em>la famille</em> (die Familie),
      <em>la mère</em> (Mutter), <em>le père</em> (Vater), <em>le frère</em>
      (Bruder), <em>la sœur</em> (Schwester), <em>la grand-mère</em>
      (Grossmutter), <em>le grand-père</em> (Grossvater), <em>l'oncle</em>
      (Onkel), <em>la tante</em> (Tante), <em>les parents</em> (Eltern)</p>
      <p><strong>Achtung, falscher Freund:</strong> <em>les parents</em> sind
      die <em>Eltern</em> — nicht alle Verwandten!</p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      <em>madre</em> ↔ <em>mère</em>, <em>padre</em> ↔ <em>père</em>,
      <em>hermano</em> ↔ <em>frère</em>, <em>tía</em> ↔ <em>tante</em>.
      Auch im Spanischen heissen <em>los padres</em> „die Eltern“.</p>
    `,
    aufgaben: vokabelAufgaben([
      ["la famille", "die Familie"], ["la mère", "die Mutter"],
      ["le père", "der Vater"], ["le frère", "der Bruder"],
      ["la sœur", "die Schwester"], ["la grand-mère", "die Grossmutter"],
      ["le grand-père", "der Grossvater"], ["l'oncle", "der Onkel"],
      ["la tante", "die Tante"], ["le cousin", "der Cousin"],
      ["les parents", "die Eltern"], ["l'enfant", "das Kind"],
    ]),
  },
  {
    id: "tiere",
    icon: "🐾",
    name: "Tiere",
    theorie: `
      <p class="theorie-beispiel">🔎 <em>le chat</em> (Katze), <em>le chien</em>
      (Hund), <em>l'oiseau</em> (Vogel), <em>le poisson</em> (Fisch),
      <em>le cheval</em> (Pferd), <em>la vache</em> (Kuh), <em>le lapin</em>
      (Kaninchen), <em>la souris</em> (Maus), <em>le cochon</em> (Schwein),
      <em>la poule</em> (Huhn), <em>l'ours</em> (Bär), <em>le lion</em> (Löwe)</p>
      <p>Das Geschlecht musst du mitlernen: <em>le chat</em> ist
      männlich, <em>la vache</em> weiblich — auch wenn es im Deutschen
      „die Katze“ heisst!</p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      <em>el gato</em> ↔ <em>le chat</em>, <em>el caballo</em> ↔
      <em>le cheval</em>, <em>la vaca</em> ↔ <em>la vache</em>, <em>el león</em> ↔
      <em>le lion</em>, <em>el oso</em> ↔ <em>l'ours</em>.</p>
    `,
    aufgaben: vokabelAufgaben([
      ["le chat", "die Katze"], ["le chien", "der Hund"], ["l'oiseau", "der Vogel"],
      ["le poisson", "der Fisch"], ["le cheval", "das Pferd"],
      ["la vache", "die Kuh"], ["le lapin", "das Kaninchen"],
      ["la souris", "die Maus"], ["le cochon", "das Schwein"],
      ["la poule", "das Huhn"], ["l'ours", "der Bär"], ["le lion", "der Löwe"],
    ]),
  },
  {
    id: "schule",
    icon: "🎒",
    name: "Schule",
    theorie: `
      <p class="theorie-beispiel">🔎 <em>l'école</em> (Schule), <em>la classe</em>
      (Klasse), <em>le professeur</em> (Lehrer), <em>le livre</em> (Buch),
      <em>le cahier</em> (Heft), <em>le stylo</em> (Kugelschreiber),
      <em>le crayon</em> (Bleistift), <em>la gomme</em> (Radiergummi),
      <em>la règle</em> (Lineal), <em>la trousse</em> (Mäppchen),
      <em>le cartable</em> (Schulranzen), <em>la chaise</em> (Stuhl),
      <em>la table</em> (Tisch)</p>
      <p><strong>Achtung, falscher Freund:</strong> <em>le livre</em> ist das
      <em>Buch</em> — nicht ein „Liber“-irgendwas wie die Bibliothek (<em>la bibliothèque</em>)!</p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      <em>la escuela</em> ↔ <em>l'école</em>, <em>la clase</em> ↔
      <em>la classe</em>, <em>el profesor</em> ↔ <em>le professeur</em>,
      <em>la regla</em> ↔ <em>la règle</em>, <em>la mesa</em> ↔ <em>la table</em>.
      Aber: <em>libro</em> (Buch) ↔ <em>livre</em> ist leicht verwandt, und
      <em>cuaderno</em> ↔ <em>cahier</em> weniger.</p>
    `,
    aufgaben: vokabelAufgaben([
      ["l'école", "die Schule"], ["la classe", "die Klasse"],
      ["le professeur", "der Lehrer"], ["le livre", "das Buch"],
      ["le cahier", "das Heft"], ["le stylo", "der Kugelschreiber"],
      ["le crayon", "der Bleistift"], ["la gomme", "der Radiergummi"],
      ["la règle", "das Lineal"], ["la trousse", "das Mäppchen"],
      ["le cartable", "der Schulranzen"], ["la chaise", "der Stuhl"],
      ["la table", "der Tisch"],
    ]),
  },
  {
    id: "essen",
    icon: "🥖",
    name: "Essen & Trinken",
    theorie: `
      <p class="theorie-beispiel">🔎 <em>le pain</em> (Brot), <em>le fromage</em>
      (Käse), <em>le beurre</em> (Butter), <em>le lait</em> (Milch),
      <em>l'eau</em> (Wasser), <em>la pomme</em> (Apfel), <em>la fraise</em>
      (Erdbeere), <em>le gâteau</em> (Kuchen), <em>le chocolat</em>
      (Schokolade), <em>la viande</em> (Fleisch), <em>l'œuf</em> (Ei),
      <em>la soupe</em> (Suppe)</p>
      <p>Bestellen kannst du so: <em>Je voudrais du pain, s'il vous plaît.</em>
      (Ich möchte Brot, bitte.)</p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      <em>el queso</em> ↔ <em>le fromage</em>, <em>la leche</em> ↔
      <em>le lait</em>, <em>el agua</em> ↔ <em>l'eau</em>, <em>la sopa</em> ↔
      <em>la soupe</em>, <em>el chocolate</em> ↔ <em>le chocolat</em>.
      <em>el pan</em> ↔ <em>le pain</em> ist fast gleich!</p>
    `,
    aufgaben: vokabelAufgaben([
      ["le pain", "das Brot"], ["le fromage", "der Käse"], ["le beurre", "die Butter"],
      ["le lait", "die Milch"], ["l'eau", "das Wasser"], ["la pomme", "der Apfel"],
      ["la fraise", "die Erdbeere"], ["le gâteau", "der Kuchen"],
      ["le chocolat", "die Schokolade"], ["la viande", "das Fleisch"],
      ["l'œuf", "das Ei"], ["la soupe", "die Suppe"],
    ]),
  },
  {
    id: "wochentage",
    icon: "📅",
    name: "Wochentage",
    theorie: `
      <p class="theorie-beispiel">🔎 <em>lundi</em> (Montag), <em>mardi</em>
      (Dienstag), <em>mercredi</em> (Mittwoch), <em>jeudi</em> (Donnerstag),
      <em>vendredi</em> (Freitag), <em>samedi</em> (Samstag), <em>dimanche</em>
      (Sonntag)</p>
      <p>Wochentage schreibt man im Französischen <strong>klein</strong> —
      anders als im Deutschen! Und: Die Woche beginnt mit <em>lundi</em>.</p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      Auch im Spanischen sind Wochentage klein: <em>lunes</em> ↔
      <em>lundi</em>, <em>martes</em> ↔ <em>mardi</em>, <em>miércoles</em> ↔
      <em>mercredi</em>, <em>jueves</em> ↔ <em>jeudi</em>, <em>viernes</em> ↔
      <em>vendredi</em>. Sie kommen alle von den gleichen Gestirnen (Mond,
      Mars, Merkur, Jupiter, Venus)!</p>
    `,
    aufgaben: vokabelAufgaben([
      ["lundi", "Montag"], ["mardi", "Dienstag"], ["mercredi", "Mittwoch"],
      ["jeudi", "Donnerstag"], ["vendredi", "Freitag"], ["samedi", "Samstag"],
      ["dimanche", "Sonntag"],
    ]),
  },
  {
    id: "artikel",
    icon: "🏷️",
    name: "Artikel le · la · les",
    theorie: `
      <p>Im Französischen ist jedes Nomen männlich oder weiblich:</p>
      <p class="theorie-beispiel">🔎 <strong>le</strong> + männlich (<em>le chat</em>),
      <strong>la</strong> + weiblich (<em>la maison</em>),
      <strong>les</strong> + Mehrzahl (<em>les chats</em>).</p>
      <p>Vor einem Vokal oder stummem h wird aus <em>le/la</em> ein
      <strong>l'</strong>: <em>l'école</em>, <em>l'oiseau</em>. Dann hörst du
      das Geschlecht nicht mehr — du musst es mitlernen!</p>
      <p>Unbestimmt heissen sie <strong>un</strong> (männlich) und
      <strong>une</strong> (weiblich): <em>un livre, une table</em>.</p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      Das kennst du schon: <em>el</em> / <em>la</em> / <em>los</em> /
      <em>las</em> ↔ <em>le</em> / <em>la</em> / <em>les</em>. Aber
      Vorsicht: Das Geschlecht ist nicht immer gleich! Z.B. <em>le lait</em>
      (männlich) ↔ <em>la leche</em> (weiblich).</p>
    `,
    aufgaben: [
      ...[
        ["chat", "le"], ["maison", "la"], ["livre", "le"], ["table", "la"],
        ["garçon", "le"], ["fille", "la"], ["père", "le"], ["mère", "la"],
        ["pain", "le"], ["pomme", "la"], ["fromage", "le"], ["classe", "la"],
        ["cahier", "le"], ["trousse", "la"], ["stylo", "le"], ["vache", "la"],
        ["lapin", "le"], ["poule", "la"], ["frère", "le"], ["sœur", "la"],
      ].map(([nomen, artikel]) => ({
        typ: "mc",
        frage: `Welcher Artikel passt? ___ ${nomen}`,
        optionen: artikel === "le" ? ["le", "la", "les"] : ["la", "le", "les"],
        richtig: 0,
      })),
      ...[
        ["livre", "un"], ["table", "une"], ["stylo", "un"], ["classe", "une"],
        ["chat", "un"], ["pomme", "une"],
      ].map(([nomen, artikel]) => ({
        typ: "mc",
        frage: `Unbestimmter Artikel: ___ ${nomen}`,
        optionen: artikel === "un" ? ["un", "une"] : ["une", "un"],
        richtig: 0,
      })),
    ],
  },
  {
    id: "etre-avoir",
    icon: "🧩",
    name: "être & avoir",
    theorie: `
      <p>Die wichtigsten Verben: <strong>être</strong> (sein) und
      <strong>avoir</strong> (haben).</p>
      <p class="theorie-beispiel">🔎 <strong>être:</strong> je <em>suis</em>,
      tu <em>es</em>, il/elle <em>est</em>, nous <em>sommes</em>, vous
      <em>êtes</em>, ils/elles <em>sont</em></p>
      <p class="theorie-beispiel">🔎 <strong>avoir:</strong> j'<em>ai</em>,
      tu <em>as</em>, il/elle <em>a</em>, nous <em>avons</em>, vous
      <em>avez</em>, ils/elles <em>ont</em></p>
      <p>Vor einem Vokal wird <em>je</em> zu <strong>j'</strong>: <em>j'ai</em>.</p>
      <p class="theorie-spanisch">🇪🇸 <strong>Vergleich mit Spanisch:</strong>
      Im Spanischen heisst „ich habe“ <em>tengo</em> / <em>he</em> und
      „ich bin“ <em>soy</em> / <em>estoy</em>. Im Französischen gibt es nur
      <strong>ein</strong> „sein“ (<em>être</em>) — kein ser/estar. Und
      Pronomen dürfen nicht weggelassen werden: <em>je suis</em>, nie nur
      <em>suis</em>!</p>
    `,
    aufgaben: formAufgaben([
      ["être: je ___", "suis", ["es", "est"]],
      ["être: tu ___", "es", ["suis", "sont"]],
      ["être: il ___", "est", ["es", "sont"]],
      ["être: elle ___", "est", ["suis", "êtes"]],
      ["être: nous ___", "sommes", ["sont", "êtes"]],
      ["être: vous ___", "êtes", ["sommes", "est"]],
      ["être: ils ___", "sont", ["sommes", "est"]],
      ["être: elles ___", "sont", ["êtes", "es"]],
      ["avoir: j'___", "ai", ["as", "a"]],
      ["avoir: tu ___", "as", ["ai", "ont"]],
      ["avoir: il ___", "a", ["as", "ont"]],
      ["avoir: elle ___", "a", ["ai", "avez"]],
      ["avoir: nous ___", "avons", ["avez", "ont"]],
      ["avoir: vous ___", "avez", ["avons", "ont"]],
      ["avoir: ils ___", "ont", ["avons", "a"]],
      ["avoir: elles ___", "ont", ["as", "avez"]],
      ["Wie heisst „Ich bin müde“?", "Je suis fatigué.", ["J'ai fatigué.", "Je es fatigué."]],
      ["Wie heisst „Ich habe einen Hund“?", "J'ai un chien.", ["Je suis un chien.", "Je ai un chien."]],
      ["Wie heisst „Wir sind in der Schule“?", "Nous sommes à l'école.", ["Nous avons à l'école.", "Nous êtes à l'école."]],
      ["Wie heisst „Sie (Mz.) haben eine Katze“?", "Ils ont un chat.", ["Ils sont un chat.", "Ils ai un chat."]],
    ]),
  },
];
