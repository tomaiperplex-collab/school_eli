// spiel/vokabeln.js — Vokabeldatenbank "Ça roule 6, Unité 1" (Quelle:
// quellen/CR6_Unite1_Vocabulaire.pdf). Felder: fr, de, en (optional), satz
// (Beispielsatz), kat (Kategorie), ergaenzt (true = nicht im PDF, sondern
// aus dem Spielauftrag ergänzt).

const KATEGORIEN = {
  personen: "👮 Personen & Rollen",
  aussehen: "👓 Aussehen",
  kleidung: "🎩 Kleidung & Accessoires",
  verben: "🏃 Verben",
  orte: "🧭 Wo? Richtung & Ort",
  allgemein: "💬 Allgemein",
};

const VOKABELN = [
  // Personen & Rollen
  { fr: "le détective / la détective", de: "der Detektiv, die Detektivin", en: "the detective", satz: "Le détective cherche le voleur.", kat: "personen" },
  { fr: "le voleur / la voleuse", de: "der Dieb, die Diebin", satz: "Le voleur porte un grand sac.", kat: "personen" },
  { fr: "la police", de: "die Polizei", en: "the police", satz: "La police arrive tout de suite.", kat: "personen" },
  { fr: "un homme", de: "ein Mann", satz: "L'homme vole une montre.", kat: "personen", ergaenzt: true },
  { fr: "une femme", de: "eine Frau", satz: "Une femme traverse le pont.", kat: "personen", ergaenzt: true },
  { fr: "la chasse", de: "die Jagd, der Fang", en: "the chase", satz: "La chasse au voleur à travers la Suisse romande est intéressante.", kat: "allgemein" },

  // Aussehen
  { fr: "la moustache", de: "der Schnauz", en: "the moustache", satz: "Il a une moustache noire.", kat: "aussehen" },
  { fr: "les cheveux (mpl)", de: "die Haare", satz: "Il a les cheveux blonds.", kat: "aussehen" },
  { fr: "le nez", de: "die Nase", en: "the nose", satz: "L'homme a un grand nez.", kat: "aussehen" },
  { fr: "les yeux (mpl)", de: "die Augen", en: "the eyes", satz: "Elle a les yeux marron.", kat: "aussehen" },
  { fr: "blond / blonde", de: "blond", en: "blond", satz: "Elle a les cheveux blonds.", kat: "aussehen" },
  { fr: "brun / brune", de: "braun", en: "brown", satz: "Il a les cheveux bruns.", kat: "aussehen" },
  { fr: "mince", de: "dünn, schlank", satz: "Le voleur est mince.", kat: "aussehen" },
  { fr: "long / longue", de: "lang", en: "long", satz: "Il a les cheveux longs.", kat: "aussehen" },
  { fr: "court / courte", de: "kurz", satz: "Elle a les cheveux courts.", kat: "aussehen" },
  { fr: "grand / grande", de: "gross", satz: "L'homme a un grand nez.", kat: "aussehen", ergaenzt: true },
  { fr: "petit / petite", de: "klein", satz: "Elle a un petit nez.", kat: "aussehen", ergaenzt: true },
  { fr: "vieux / vieille", de: "alt", satz: "Le voleur est vieux.", kat: "aussehen", ergaenzt: true },

  // Kleidung & Accessoires
  { fr: "les lunettes (fpl)", de: "die Brille", satz: "Il porte des lunettes.", kat: "kleidung" },
  { fr: "les lunettes de soleil (fpl)", de: "die Sonnenbrille", satz: "Elle porte des lunettes de soleil.", kat: "kleidung" },
  { fr: "le chapeau", de: "der Hut", satz: "Il porte un chapeau sur la tête.", kat: "kleidung" },
  { fr: "les chaussures (fpl)", de: "die Schuhe", satz: "Elle porte des chaussures aux pieds.", kat: "kleidung" },
  { fr: "la montre", de: "die Uhr", satz: "Il est quelle heure? Regarde ta montre.", kat: "kleidung" },
  { fr: "l'objet (m)", de: "das Objekt", en: "the object", satz: "Le parapluie est un objet.", kat: "allgemein" },

  { fr: "la chemise", de: "das Hemd, die Bluse", satz: "Il porte une chemise blanche.", kat: "kleidung", ergaenzt: true },
  { fr: "le pantalon", de: "die Hose", satz: "Il porte un pantalon noir.", kat: "kleidung", ergaenzt: true },
  { fr: "la jupe", de: "der Rock", satz: "Elle porte une jupe verte.", kat: "kleidung", ergaenzt: true },
  { fr: "le pull", de: "der Pullover", satz: "Il porte un pull rouge.", kat: "kleidung", ergaenzt: true },
  { fr: "l'instrument (m)", de: "das Instrument", satz: "Le violon est un instrument.", kat: "allgemein", ergaenzt: true },
  { fr: "le moyen de transport", de: "das Transportmittel", satz: "Le vélo est un moyen de transport.", kat: "allgemein", ergaenzt: true },
  { fr: "noir / noire, vert / verte, rouge", de: "schwarz, grün, rot", satz: "Il porte un pull rouge.", kat: "allgemein", ergaenzt: true },
  { fr: "marron", de: "braun (Augen)", satz: "Elle a les yeux marron.", kat: "aussehen", ergaenzt: true },

  // Verben
  { fr: "avoir", de: "haben", satz: "J'ai une question.", kat: "verben" },
  { fr: "voler", de: "stehlen", satz: "L'homme vole une montre.", kat: "verben" },
  { fr: "crier", de: "rufen, schreien", satz: "«Non!», crie la fille.", kat: "verben" },
  { fr: "téléphoner à", de: "anrufen", en: "(tele)phone", satz: "Elle téléphone à la police.", kat: "verben" },
  { fr: "tourner", de: "drehen", en: "turn", satz: "Vous tournez à gauche.", kat: "verben" },
  { fr: "traverser", de: "überqueren", satz: "Il traverse le grand pont.", kat: "verben" },

  // Wo? Richtung & Ort
  { fr: "à droite (de)", de: "nach rechts, rechts von", satz: "D'abord, tu tournes à droite.", kat: "orte" },
  { fr: "à gauche (de)", de: "nach links, links von", satz: "Le voleur est à gauche de la maison.", kat: "orte" },
  { fr: "sous", de: "unter", satz: "Ils trouvent le chapeau sous un banc.", kat: "orte" },
  { fr: "devant", de: "vor", satz: "Raphaela est devant le magasin.", kat: "orte" },
  { fr: "derrière", de: "hinter", satz: "Derrière le chapeau, il y a un papier.", kat: "orte" },

  // Allgemein
  { fr: "aujourd'hui", de: "heute", satz: "Aujourd'hui, je vais au magasin.", kat: "allgemein" },
  { fr: "tout à coup", de: "plötzlich", satz: "Tout à coup, Raphaela crie.", kat: "allgemein" },
];

// Frage-Baukästen aus dem Lehrmittel («Des questions pour trouver le voleur /
// l'objet volé») plus Ergänzungen vom Spickzettel des Kindes.
// Je Block: Satzanfang + Endungen [fr, de]; `fr` wird zur Frage zusammengesetzt.
const FRAGE_BAUKASTEN_DIEB = [
  { start: "Est-ce que c'est", enden: [["une femme", "eine Frau"], ["un homme", "ein Mann"]] },
  { start: "Est-ce qu'il / elle est", enden: [["grand(e)", "gross"], ["petit(e)", "klein"], ["mince", "schlank"], ["vieux / vieille", "alt"]] },
  { start: "Est-ce qu'il / elle a", enden: [
    ["un grand nez", "eine grosse Nase"], ["une moustache", "einen Schnauz"],
    ["les yeux marron", "braune Augen"], ["les yeux bleus", "blaue Augen"], ["les yeux verts", "grüne Augen"],
    ["les cheveux bruns", "braune Haare"], ["les cheveux blonds", "blonde Haare"], ["les cheveux courts", "kurze Haare"], ["les cheveux longs", "lange Haare"],
  ] },
  { start: "Est-ce qu'il / elle porte", enden: [
    ["des lunettes", "eine Brille"], ["un chapeau", "einen Hut"], ["une chemise", "ein Hemd"],
    ["un pantalon noir", "eine schwarze Hose"], ["une jupe verte", "einen grünen Rock"],
    ["un pull rouge", "einen roten Pulli"], ["une veste bleue", "eine blaue Jacke"], ["des chaussures rouges", "rote Schuhe"],
  ] },
];
const FRAGE_BAUKASTEN_OBJEKT = [
  { start: "Est-ce que c'est", enden: [
    ["un instrument noir", "ein schwarzes Instrument"], ["un moyen de transport brun", "ein braunes Transportmittel"],
    ["un objet rouge", "ein roter Gegenstand"], ["un instrument", "ein Instrument"],
    ["un moyen de transport", "ein Transportmittel"], ["un objet", "ein Gegenstand"],
  ] },
  { start: "Est-ce qu'il / elle vole", enden: [["un ordinateur", "einen Computer"], ["un violon", "eine Geige"], ["un vélo", "ein Velo"], ["une montre", "eine Uhr"]] },
];
