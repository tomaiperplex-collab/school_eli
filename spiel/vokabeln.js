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

// Frage-Baukasten nach dem Spickzettel des Kindes (Satzanfang + Endungen).
// `fr` ist das, was gesprochen/geschrieben wird; `de` eine Hilfe.
const FRAGE_BAUKASTEN = [
  { start: "Est-ce que c'est", gruppen: [
    [["une femme", "eine Frau"], ["un homme", "ein Mann"]],
  ] },
  { start: "Est-ce qu'il / elle est", gruppen: [
    [["grand(e)", "gross"], ["petit(e)", "klein"], ["mince", "schlank"], ["vieux / vieille", "alt"]],
  ] },
  { start: "Est-ce qu'il / elle a", gruppen: [
    [["un grand nez", "eine grosse Nase"], ["une moustache", "einen Schnauz"]],
    [["les cheveux blonds", "blonde Haare"], ["les cheveux bruns", "braune Haare"], ["les cheveux longs", "lange Haare"], ["les cheveux courts", "kurze Haare"]],
    [["les yeux bleus", "blaue Augen"], ["les yeux marron", "braune Augen"], ["les yeux verts", "grüne Augen"]],
  ] },
  { start: "Est-ce qu'il / elle porte", gruppen: [
    [["un pull vert", "einen grünen Pulli"], ["une veste bleue", "eine blaue Jacke"], ["des vêtements noirs", "schwarze Kleider"]],
    [["des chaussures rouges", "rote Schuhe"], ["un chapeau rayé", "einen gestreiften Hut"], ["des lunettes", "eine Brille"]],
  ] },
];
