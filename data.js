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
// Verwaltungsgrenzen, sondern angenäherte Trennlinien (Breiten-/Längengrad-
// Schnitte, an einigen langen geraden Abschnitten mit zusätzlichen
// Zwischenpunkten leicht geschwungen, damit sie weniger "am Lineal gezogen"
// aussehen), so gewählt, dass alle 37 Begriffe aus BEGRIFFE in der jeweils
// richtigen Region landen. Für den NMG-Unterricht (grobe Orientierung: "in
// welcher Ecke des Kantons liegt das?") reicht das; für exakte
// Gemeindezuordnungen an den Rändern nicht.
// -> Bessere Daten? Ersetze die Koordinatenlisten unten durch echte
//    Verwaltungskreis-Polygone (opendata.swiss: "Verwaltungsregionen,
//    Verwaltungskreise und Amtsbezirke"), gruppiert zu den 5 Regionen. Diese
//    Datensätze liessen sich aus dieser Umgebung nicht laden (opendata.swiss,
//    swisstopo, BAFU sowie mehrere GitHub-Konvertierungsprojekte, die ihre
//    Ausgabedateien nur auf eigenen, ebenfalls blockierten Domains
//    veröffentlichen, nicht im Repo selbst).
// ---------------------------------------------------------------------------
const REGIONEN = [
  {
    name: "Seeland",
    farbe: "#4fb8b0",
    // zwei Teilflächen (die Region ist an dieser Kante nicht konvex)
    teile: [
      [[46.9791,7.1],[47.0076,7.2184],[46.9105,7.2087],[46.8883,7.35],[46.8796,7.35],[46.85,7.3337],[46.85,7.35],[46.9408,7.3304],[47.0315,7.3631],[47.1223,7.3435],[47.2131,7.35],[47.2189,7.3414],[47.2216,7.35],[47.3037,7.35],[47.2917,7.3179],[47.2959,7.1697],[47.2552,7.1501],[47.2491,7.1]],
      [[46.9812,7.0411],[46.9775,7.0932],[46.9791,7.1],[47.08,7.1],[47.08,7.0653],[47.0324,7.0348],[46.9812,7.0411]],
    ],
    label: [47.1094, 7.2366],
  },
  {
    name: "Berner Jura",
    farbe: "#a98ed6",
    teile: [
      [[47.08,7.1],[47.1645,7.097],[47.2491,7.1],[47.2446,7.0625],[47.1971,7.0243],[47.1898,6.9419],[47.167,6.8624],[47.1105,6.9275],[47.1188,6.99],[47.0976,7.0766],[47.08,7.0653]],
    ],
    label: [47.1586, 7.0164],
  },
  {
    name: "Bern-Mittelland",
    farbe: "#e8c94a",
    teile: [
      [[46.8883,7.35],[46.8876,7.3544],[46.8796,7.35],[46.85,7.35],[46.847,7.4333],[46.8575,7.5167],[46.85,7.6],[46.936,7.5871],[47.0221,7.6206],[47.1081,7.5768],[47.1942,7.6155],[47.2802,7.6],[47.2777,7.5811],[47.2606,7.6],[47.1451,7.6],[47.1205,7.5183],[47.1018,7.435],[47.1518,7.4409],[47.2131,7.35],[47.2216,7.35],[47.2443,7.4218],[47.3237,7.5593],[47.3035,7.497],[47.3154,7.3813],[47.3037,7.35]],
    ],
    label: [47.0309, 7.4641],
  },
  {
    name: "Emmental-Oberaargau",
    farbe: "#e08a4c",
    teile: [
      [[46.85,7.6],[46.8549,7.6912],[46.8402,7.7824],[46.85,7.8736],[46.8866,7.8596],[46.9826,7.9535],[47.0548,7.867],[47.1421,7.8911],[47.2362,7.8397],[47.2669,7.8261],[47.2605,7.7337],[47.2918,7.6896],[47.2802,7.6],[47.2606,7.6],[47.1923,7.6756],[47.1588,7.6523],[47.1451,7.6]],
    ],
    label: [47.0493, 7.7467],
  },
  {
    name: "Oberland",
    farbe: "#c97fa8",
    teile: [
      [[46.85,7.3337],[46.7746,7.2922],[46.7194,7.3108],[46.694,7.3779],[46.6559,7.3221],[46.5931,7.3217],[46.5551,7.238],[46.5118,7.2492],[46.3802,7.1946],[46.3305,7.2224],[46.3595,7.2632],[46.352,7.3559],[46.3777,7.4003],[46.3759,7.5279],[46.4112,7.5353],[46.4463,7.6271],[46.4152,7.7095],[46.4794,7.8453],[46.4879,7.9122],[46.5646,8.0171],[46.5339,8.1022],[46.5243,8.1922],[46.5307,8.2591],[46.5837,8.3658],[46.6542,8.4114],[46.69,8.4534],[46.7647,8.4494],[46.7728,8.3963],[46.7892,8.37],[46.7545,8.2846],[46.7709,8.2401],[46.7561,8.148],[46.7884,8.048],[46.7763,7.9856],[46.8384,7.8781],[46.85,7.8736]],
    ],
    label: [46.6313, 7.7479],
  },
];

// SEEN_SHAPES: echte Seeflaechen (Aussenkontur, ohne Insel-Details) aus
// swissTLM3D 2.4 (via github.com/oliverheisel/LakesOfSwitzerland, MIT-Lizenz),
// vereinfacht (Douglas-Peucker). Jeder Eintrag ist eine Liste von 'Teilen'
// (meist 1, Grimselsee hat 2 getrennte Staubecken-Flaechen); jedes Teil ist
// ein einfacher Ring aus [lat,lon]-Punkten.
const SEEN_SHAPES = {
  "Bielersee": [[[47.1344,7.2326],[47.13336,7.22726],[47.12934,7.21846],[47.11937,7.20534],[47.11246,7.19373],[47.1082,7.18345],[47.10081,7.17663],[47.09415,7.15822],[47.09144,7.1543],[47.09097,7.14979],[47.08763,7.14547],[47.07447,7.11483],[47.06955,7.11136],[47.06901,7.11203],[47.06598,7.10856],[47.06367,7.09878],[47.06003,7.09062],[47.05983,7.08345],[47.05744,7.07547],[47.05454,7.07244],[47.05294,7.0736],[47.053,7.07545],[47.05242,7.07419],[47.05159,7.07527],[47.05185,7.07717],[47.05268,7.07629],[47.05163,7.07854],[47.05029,7.07692],[47.04788,7.07847],[47.0457,7.08314],[47.04623,7.09462],[47.04727,7.09798],[47.04952,7.0979],[47.04642,7.09858],[47.0462,7.10211],[47.04411,7.10069],[47.04459,7.10244],[47.04245,7.10287],[47.03908,7.10623],[47.03744,7.11423],[47.04117,7.13368],[47.04797,7.14906],[47.04745,7.1504],[47.04857,7.15068],[47.04738,7.15465],[47.04992,7.16319],[47.05721,7.17343],[47.05957,7.17376],[47.06354,7.17729],[47.06537,7.1771],[47.06268,7.18283],[47.06457,7.18115],[47.06516,7.18556],[47.06833,7.18885],[47.07092,7.18951],[47.06997,7.18951],[47.07059,7.19096],[47.07103,7.18965],[47.07181,7.1915],[47.08049,7.19668],[47.08525,7.20238],[47.08691,7.2018],[47.0873,7.20349],[47.08764,7.20245],[47.08972,7.20244],[47.08839,7.20284],[47.08853,7.20397],[47.09011,7.20273],[47.09405,7.20377],[47.09889,7.20975],[47.10404,7.2123],[47.10695,7.21733],[47.11069,7.21854],[47.11024,7.2197],[47.11111,7.21838],[47.11768,7.22138],[47.12215,7.22796],[47.12364,7.228],[47.12825,7.23307],[47.12783,7.23524],[47.12913,7.23273],[47.13007,7.23637],[47.13131,7.23568],[47.13195,7.23435],[47.12991,7.23091],[47.1321,7.23435],[47.13334,7.23177],[47.1344,7.2326]]],
  "Neuenburgersee": [[[47.01132,6.98055],[47.00111,6.9583],[46.99614,6.95555],[46.99579,6.94748],[46.99394,6.94886],[46.98963,6.93609],[46.99132,6.93406],[46.98864,6.93007],[46.98975,6.92415],[46.981,6.90794],[46.97702,6.88467],[46.97048,6.87581],[46.97122,6.87395],[46.95796,6.87487],[46.94506,6.871],[46.94063,6.85463],[46.93819,6.85241],[46.93869,6.8469],[46.93382,6.84013],[46.92569,6.83711],[46.92676,6.83011],[46.91571,6.80488],[46.89704,6.78221],[46.89283,6.78043],[46.88905,6.76845],[46.87744,6.76107],[46.87418,6.75648],[46.86353,6.75221],[46.85142,6.73014],[46.8466,6.71506],[46.83789,6.70699],[46.82971,6.68722],[46.82075,6.6771],[46.81581,6.65945],[46.80414,6.64165],[46.80378,6.63678],[46.79957,6.63457],[46.79612,6.6357],[46.79175,6.64001],[46.7924,6.64261],[46.78975,6.64526],[46.78865,6.64343],[46.78637,6.64925],[46.78535,6.64801],[46.78485,6.65751],[46.78593,6.66551],[46.80013,6.70264],[46.80234,6.7015],[46.80069,6.70372],[46.80594,6.71629],[46.80588,6.72654],[46.80668,6.72908],[46.80806,6.72738],[46.80555,6.73719],[46.80805,6.74105],[46.80306,6.74719],[46.80379,6.75993],[46.81772,6.78058],[46.81628,6.78111],[46.8191,6.78176],[46.81798,6.78654],[46.8203,6.78405],[46.82289,6.79011],[46.82292,6.78698],[46.82549,6.78935],[46.83898,6.8113],[46.84438,6.8306],[46.85051,6.84005],[46.85299,6.83735],[46.85218,6.84399],[46.8536,6.84278],[46.85731,6.84744],[46.85996,6.85833],[46.86311,6.85933],[46.86989,6.87186],[46.88855,6.89187],[46.89168,6.89844],[46.89571,6.89993],[46.9003,6.89642],[46.89587,6.90005],[46.90622,6.92296],[46.90199,6.9215],[46.90543,6.92567],[46.90542,6.93032],[46.90736,6.93388],[46.91002,6.92903],[46.92143,6.95279],[46.92718,6.95435],[46.92438,6.95392],[46.92621,6.96017],[46.93809,6.97952],[46.94527,6.98602],[46.95605,7.01316],[46.9575,7.01553],[46.95987,7.01486],[46.95841,7.01804],[46.96202,7.02552],[46.97239,7.03617],[46.97858,7.03893],[46.98206,7.02893],[46.98007,7.03935],[46.98314,7.04125],[46.98671,7.05017],[46.9999,7.03987],[47.00545,7.02649],[46.99748,7.01569],[47.00446,7.0201],[47.00405,7.02188],[47.00492,7.0154],[47.00153,7.012],[47.00229,7.00652],[47.00443,6.99589],[47.01037,6.99156],[47.01054,6.98689],[47.00895,6.987],[47.01132,6.98055]]],
  "Wohlensee": [[[46.97225,7.29021],[46.97157,7.28959],[46.97061,7.291],[46.96763,7.28839],[46.96892,7.28641],[46.96908,7.2835],[46.96694,7.28191],[46.96582,7.2799],[46.96456,7.28044],[46.96284,7.28346],[46.96346,7.28784],[46.96549,7.29127],[46.96871,7.2943],[46.96798,7.29554],[46.96618,7.29615],[46.96412,7.29816],[46.96249,7.30148],[46.96223,7.30764],[46.96296,7.31094],[46.96369,7.31136],[46.96372,7.31264],[46.96495,7.31431],[46.96539,7.3175],[46.96515,7.31941],[46.96449,7.31981],[46.96474,7.3206],[46.96244,7.32232],[46.96176,7.32385],[46.96202,7.32983],[46.96257,7.3306],[46.96193,7.33724],[46.96034,7.34165],[46.95981,7.34575],[46.96091,7.34861],[46.96141,7.34849],[46.9617,7.35001],[46.96245,7.35039],[46.96349,7.35442],[46.96483,7.3567],[46.96519,7.3608],[46.96615,7.36316],[46.96513,7.36734],[46.96088,7.3701],[46.95945,7.37409],[46.96017,7.3776],[46.9615,7.37928],[46.96259,7.37926],[46.96248,7.37981],[46.96488,7.38133],[46.96586,7.38357],[46.96617,7.39228],[46.96705,7.39503],[46.96624,7.39352],[46.96628,7.39466],[46.96714,7.39638],[46.9672,7.39526],[46.96873,7.3992],[46.96844,7.40839],[46.97097,7.41849],[46.97163,7.41829],[46.97135,7.41609],[46.96897,7.4074],[46.96962,7.40004],[46.96713,7.39285],[46.9666,7.38247],[46.96511,7.37955],[46.96131,7.37744],[46.96049,7.37477],[46.96086,7.37263],[46.96193,7.37113],[46.96312,7.37063],[46.96392,7.37134],[46.96603,7.37149],[46.96761,7.36897],[46.96788,7.365],[46.9667,7.35902],[46.96668,7.35262],[46.96371,7.34784],[46.96376,7.34282],[46.96514,7.33391],[46.96515,7.32785],[46.96803,7.31792],[46.96692,7.31036],[46.96535,7.30723],[46.96723,7.30214],[46.96927,7.29928],[46.97145,7.29754],[46.9713,7.29253],[46.97225,7.29021]]],
  "Thunersee": [[[46.74593,7.63967],[46.74225,7.62896],[46.74167,7.63345],[46.7399,7.62857],[46.74034,7.63383],[46.73647,7.6319],[46.73649,7.63028],[46.73558,7.63242],[46.73432,7.63012],[46.73428,7.63258],[46.73411,7.62997],[46.73352,7.63133],[46.73116,7.62832],[46.72768,7.62939],[46.72797,7.63073],[46.72552,7.6297],[46.72524,7.62575],[46.72272,7.62815],[46.72209,7.62513],[46.72232,7.62879],[46.72091,7.62769],[46.72032,7.62984],[46.71974,7.62693],[46.72041,7.63183],[46.71801,7.629],[46.71712,7.63038],[46.71802,7.62915],[46.72035,7.63203],[46.71903,7.63151],[46.7201,7.63942],[46.71685,7.6364],[46.71742,7.63912],[46.71993,7.64038],[46.71937,7.64284],[46.71685,7.64475],[46.7162,7.64115],[46.71561,7.64405],[46.71512,7.64193],[46.71471,7.64419],[46.71101,7.64372],[46.70342,7.65947],[46.69698,7.66388],[46.692,7.68881],[46.68981,7.68812],[46.68835,7.68992],[46.68765,7.6859],[46.68276,7.70374],[46.68032,7.70492],[46.67443,7.70301],[46.67245,7.7062],[46.66793,7.7238],[46.66416,7.72893],[46.66251,7.74144],[46.65663,7.75168],[46.65437,7.76025],[46.65776,7.78725],[46.66452,7.80397],[46.66434,7.80754],[46.65992,7.81497],[46.66019,7.82003],[46.66361,7.82684],[46.66593,7.82678],[46.66838,7.83105],[46.66758,7.82752],[46.66918,7.82994],[46.6711,7.82861],[46.67211,7.83212],[46.67175,7.83035],[46.67304,7.83114],[46.67112,7.82803],[46.67311,7.82236],[46.6787,7.81512],[46.67911,7.81654],[46.67857,7.81303],[46.6807,7.81421],[46.68227,7.81151],[46.68494,7.80039],[46.68394,7.79484],[46.68578,7.79186],[46.68167,7.77653],[46.68136,7.75088],[46.68412,7.74633],[46.69397,7.74294],[46.69481,7.73816],[46.70028,7.73566],[46.70744,7.72477],[46.71256,7.70423],[46.71158,7.7019],[46.7164,7.68855],[46.72394,7.68238],[46.72753,7.67669],[46.72735,7.67088],[46.73082,7.66762],[46.73158,7.66293],[46.73732,7.65377],[46.74168,7.65106],[46.74193,7.64569],[46.74593,7.63967]]],
  "Brienzersee": [[[46.75768,8.01744],[46.75786,8.01468],[46.75513,8.00778],[46.75488,7.99724],[46.75299,7.99311],[46.75292,7.99119],[46.75117,7.98952],[46.75082,7.98636],[46.74846,7.98201],[46.74817,7.97951],[46.74652,7.9783],[46.74434,7.97276],[46.74096,7.97218],[46.73826,7.96873],[46.73675,7.9642],[46.73672,7.96079],[46.73563,7.9588],[46.73449,7.95897],[46.73263,7.95723],[46.73169,7.95263],[46.73013,7.95175],[46.72753,7.94835],[46.7216,7.9366],[46.71817,7.93322],[46.71156,7.91952],[46.70759,7.91424],[46.70404,7.90179],[46.6984,7.89473],[46.69324,7.88473],[46.69172,7.88737],[46.69214,7.8944],[46.69073,7.89599],[46.69186,7.89674],[46.69163,7.89822],[46.69105,7.89927],[46.68957,7.89711],[46.68971,7.89804],[46.68894,7.89774],[46.68834,7.89851],[46.68879,7.90717],[46.68803,7.91856],[46.69316,7.92648],[46.69348,7.93129],[46.69702,7.93867],[46.70286,7.94446],[46.70685,7.95068],[46.708,7.95389],[46.70847,7.96021],[46.71092,7.96264],[46.7119,7.9626],[46.71348,7.96576],[46.71314,7.96626],[46.71161,7.96498],[46.71112,7.96662],[46.71277,7.96942],[46.71339,7.97329],[46.72461,7.99363],[46.73371,8.018],[46.73715,8.02327],[46.73758,8.03061],[46.73803,8.03034],[46.73883,8.03194],[46.74014,8.03616],[46.739,8.04854],[46.73969,8.04936],[46.74006,8.04853],[46.74175,8.04877],[46.74267,8.04749],[46.7435,8.04795],[46.74307,8.04938],[46.7448,8.04984],[46.74631,8.04897],[46.74704,8.0469],[46.74823,8.04681],[46.7492,8.04818],[46.74871,8.04932],[46.74966,8.04932],[46.75066,8.04809],[46.75056,8.04676],[46.75194,8.04656],[46.75247,8.04475],[46.75417,8.04319],[46.75476,8.04065],[46.75326,8.03553],[46.75366,8.03056],[46.75768,8.01744]]],
  "Grimselsee": [[[46.57332,8.32971],[46.57268,8.32938],[46.57214,8.32971],[46.57205,8.33142],[46.57246,8.33027],[46.57332,8.32971]],[[46.5715,8.33984],[46.57363,8.3399],[46.57084,8.33232],[46.57123,8.33004],[46.57177,8.33071],[46.57211,8.32962],[46.57306,8.32922],[46.57217,8.32685],[46.57357,8.32229],[46.57351,8.319],[46.5712,8.31134],[46.56928,8.30738],[46.56746,8.30077],[46.56632,8.29846],[46.56498,8.29087],[46.56308,8.28441],[46.56317,8.28008],[46.5643,8.2733],[46.56627,8.26547],[46.56583,8.265],[46.56676,8.26304],[46.56658,8.26191],[46.56589,8.26148],[46.56547,8.26458],[46.56446,8.26522],[46.56418,8.2644],[46.56457,8.26374],[46.56415,8.26357],[46.5638,8.26441],[46.56421,8.26582],[46.56357,8.2656],[46.56362,8.26505],[46.5632,8.26526],[46.56313,8.26667],[46.56278,8.26653],[46.56239,8.26789],[46.56149,8.26893],[46.55808,8.2795],[46.56035,8.29143],[46.56089,8.29218],[46.56404,8.30438],[46.56672,8.31173],[46.56788,8.31306],[46.56868,8.31566],[46.56874,8.3189],[46.56791,8.32185],[46.56812,8.32765],[46.5676,8.33],[46.56801,8.33283],[46.56933,8.33646],[46.57051,8.33919],[46.5715,8.33984]]],
};

// FLUSS_LINIEN: Flusslauf-Linien in [lat,lon].
// Aare und Zihlkanal: echte Liniengeometrie aus Natural Earth (public domain,
// 1:10m-Massstab, via github.com/nvkelso/natural-earth-vector).
// Die uebrigen 7 Fluesse sind in diesem globalen Datensatz zu klein und in keiner
// aus dieser Umgebung erreichbaren Quelle als fertige Liniengeometrie verfuegbar
// (OSM/Overpass, swisstopo und BAFU-Portale sind vom Sandbox-Netzwerk blockiert).
// Sie sind daher NUR eine Annaeherung entlang bekannter Orte/Quellen/
// Muendungen (keine exakte Vermessung), mit zusaetzlichen Zwischenpunkten
// fuer einen glatteren, dem Talverlauf nachempfundenen Linienzug.
const FLUSS_LINIEN = {
  "Aare": [[46.63247,8.31959],[46.64916,8.31324],[46.66519,8.30405],[46.73363,8.22055],[46.75202,8.167],[46.75947,8.13697],[46.76317,8.09116],[46.75552,8.04835],[46.75202,8.00392],[46.72382,7.94614],[46.70629,7.89405],[46.69587,7.85808],[46.6874,7.84205],[46.67959,7.81967],[46.67959,7.81967],[46.67886,7.78688],[46.68928,7.7435],[46.71068,7.69581],[46.74042,7.65219],[46.74994,7.64194],[46.77114,7.61891],[46.79393,7.59767],[46.81151,7.57683],[46.84414,7.56739],[46.87128,7.54957],[46.89964,7.52223],[46.92325,7.4922],[46.93765,7.46746],[46.94383,7.4524],[46.94986,7.44451],[46.96353,7.43653],[46.97525,7.41912],[46.97671,7.38836],[46.9748,7.34506],[46.97826,7.29762],[46.98652,7.26108],[46.9958,7.24415],[47.00918,7.24635],[47.02709,7.25636],[47.04336,7.2562],[47.05248,7.23414],[47.06078,7.20086],[47.07209,7.17897],[47.07486,7.17359],[47.09365,7.16822],[47.11351,7.19923],[47.13882,7.23316],[47.14265,7.26905],[47.1472,7.32879],[47.15058,7.35385],[47.15717,7.38014],[47.20571,7.46998],[47.21027,7.48927],[47.21231,7.53028],[47.23627,7.59409],[47.24388,7.62477],[47.24482,7.6561],[47.24177,7.69158],[47.24339,7.72853],[47.25556,7.76368],[47.27001,7.79298],[47.28376,7.83302],[47.30947,7.86118],[47.32738,7.8895],[47.34723,7.90561],[47.36441,7.92319],[47.37295,7.97145],[47.41234,8.0687],[47.4326,8.1482],[47.44847,8.16163],[47.46817,8.17303],[47.48664,8.19939],[47.50772,8.22413],[47.53384,8.2317],[47.55744,8.23219],[47.58438,8.24545],[47.60008,8.23959],[47.61864,8.22584]],
  "Zihlkanal": [[47.01118,7.02198],[47.03604,7.03932],[47.05516,7.09181],[47.08405,7.17091]],
  "Emme": [[46.92,7.93],[46.87,7.9],[46.87,7.83],[46.9,7.8],[46.93,7.77],[46.95,7.75],[46.98,7.71],[47.0,7.68],[47.03,7.65],[47.06,7.63],[47.08,7.6],[47.11,7.58],[47.13,7.62]],
  "Saane": [[46.35,7.3],[46.4,7.28],[46.47,7.286],[46.49,7.26],[46.55,7.2],[46.65,7.15],[46.75,7.15],[46.8,7.15],[46.85,7.18],[46.9,7.23],[46.95,7.25]],
  "Sense": [[46.65,7.28],[46.7,7.3],[46.75,7.3],[46.8,7.33],[46.83,7.33],[46.86,7.34],[46.88,7.3],[46.9,7.23]],
  "Simme": [[46.44,7.42],[46.46,7.44],[46.5,7.4],[46.557,7.373],[46.6,7.38],[46.63,7.39],[46.65,7.51],[46.67,7.58],[46.68,7.62]],
  "Kander": [[46.48,7.75],[46.4959,7.6763],[46.5,7.68],[46.53,7.66],[46.56,7.68],[46.58,7.65],[46.63,7.64],[46.68,7.65],[46.7,7.65]],
  "Luetschine": [[46.62,8.04],[46.635,8.0],[46.65,7.95],[46.6516,7.9081],[46.665,7.9],[46.678,7.895],[46.685,7.9]],
  "Schuess": [[47.13,6.95],[47.15,6.99],[47.183,7.067],[47.175,7.1],[47.17,7.13],[47.155,7.17],[47.145,7.2],[47.14,7.24]],
};

// ---------------------------------------------------------------------------
// Begriffsliste
// Jeder Eintrag: { name, kategorie, lat, lon, bildpfad, kurzfakt }
// ---------------------------------------------------------------------------
const BEGRIFFE = [
  // ----- Orte (rot) --------------------------------------------------------
  { name: "Bern", kategorie: "orte", lat: 46.9480, lon: 7.4474, bildpfad: "images/orte/Bern.png", kurzfakt: "Bern ist die Hauptstadt der Schweiz.", bildQuelle: { urheber: "de:Benutzer:Reaast", lizenz: "Public domain", lizenzUrl: "", quelle: "https://commons.wikimedia.org/wiki/File:Bern_luftaufnahme.png" } },
  { name: "Thun", kategorie: "orte", lat: 46.7580, lon: 7.6280, bildpfad: "images/orte/Thun.jpg", kurzfakt: "Thun liegt am Ausfluss der Aare aus dem Thunersee.", bildQuelle: { urheber: "Daniel Reust", lizenz: "CC BY-SA 4.0", lizenzUrl: "https://creativecommons.org/licenses/by-sa/4.0", quelle: "https://commons.wikimedia.org/wiki/File:Thun_BE.jpg" } },
  { name: "Interlaken", kategorie: "orte", lat: 46.6863, lon: 7.8632, bildpfad: "images/orte/Interlaken.jpg", kurzfakt: "Interlaken liegt zwischen dem Thunersee und dem Brienzersee.", bildQuelle: { urheber: "Michael Walz (Jaberocky at de.wikipedia)", lizenz: "Public domain", lizenzUrl: "", quelle: "https://commons.wikimedia.org/wiki/File:Interlaken_aer.jpg" } },
  { name: "Meiringen", kategorie: "orte", lat: 46.7296, lon: 8.1798, bildpfad: "images/orte/Meiringen.jpg", kurzfakt: "Meiringen liegt im Haslital.", bildQuelle: { urheber: "MoserB", lizenz: "Copyrighted free use", lizenzUrl: "", quelle: "https://commons.wikimedia.org/wiki/File:Meiringen_2016.JPG" } },
  { name: "Biel/Bienne", kategorie: "orte", lat: 47.1368, lon: 7.2468, bildpfad: "images/orte/Biel_Bienne.jpg", kurzfakt: "Biel/Bienne ist eine zweisprachige Stadt am Bielersee.", bildQuelle: { urheber: "Roland Zumbuehl", lizenz: "CC BY-SA 4.0", lizenzUrl: "https://creativecommons.org/licenses/by-sa/4.0", quelle: "https://commons.wikimedia.org/wiki/File:2005-Biel-Altstadt.jpg" } },
  { name: "Burgdorf", kategorie: "orte", lat: 47.0587, lon: 7.6255, bildpfad: "images/orte/Burgdorf.jpg", kurzfakt: "Burgdorf liegt an der Emme.", bildQuelle: { urheber: "WillYs Fotowerkstatt", lizenz: "CC BY 3.0", lizenzUrl: "https://creativecommons.org/licenses/by/3.0", quelle: "https://commons.wikimedia.org/wiki/File:Burgdorf_Schloss_im_Abendlicht.jpg" } },
  { name: "Langenthal", kategorie: "orte", lat: 47.2136, lon: 7.7913, bildpfad: "images/orte/Langenthal.jpg", kurzfakt: "Langenthal liegt im Oberaargau.", bildQuelle: { urheber: "JoachimKohler-HB", lizenz: "CC BY-SA 4.0", lizenzUrl: "https://creativecommons.org/licenses/by-sa/4.0", quelle: "https://commons.wikimedia.org/wiki/File:Choufh%C3%BCsi_Marktgasse_in_Langenthal.jpg" } },
  { name: "Courtelary", kategorie: "orte", lat: 47.1830, lon: 7.0670, bildpfad: "images/orte/Courtelary.jpg", kurzfakt: "Courtelary liegt im Berner Jura.", bildQuelle: { urheber: "Jag9889", lizenz: "CC BY-SA 4.0", lizenzUrl: "https://creativecommons.org/licenses/by-sa/4.0", quelle: "https://commons.wikimedia.org/wiki/File:La_Fleur_de_Lys-Br%C3%BCcke_%C3%BCber_die_Sch%C3%BCss,_Courtelary_BE_20220727-jag9889.jpg" } },
  { name: "Grindelwald", kategorie: "orte", lat: 46.6244, lon: 8.0414, bildpfad: "images/orte/Grindelwald.jpg", kurzfakt: "Grindelwald liegt am Fuss des Eigers.", bildQuelle: { urheber: "Robot8A", lizenz: "CC BY-SA 4.0", lizenzUrl: "https://creativecommons.org/licenses/by-sa/4.0", quelle: "https://commons.wikimedia.org/wiki/File:Switzerland_Apr_2023_14_08_21_426000.jpeg" } },
  { name: "Gstaad", kategorie: "orte", lat: 46.4718, lon: 7.2860, bildpfad: "images/orte/Gstaad.png", kurzfakt: "Gstaad liegt im Berner Oberland, im Saanenland.", bildQuelle: { urheber: "Tschubby", lizenz: "CC BY-SA 3.0", lizenzUrl: "http://creativecommons.org/licenses/by-sa/3.0/", quelle: "https://commons.wikimedia.org/wiki/File:Karte_Gemeinde_Saanen.png" } },
  { name: "Langnau", kategorie: "orte", lat: 46.9385, lon: 7.7853, bildpfad: "images/orte/Langnau.jpg", kurzfakt: "Langnau liegt im Emmental.", bildQuelle: { urheber: "upload by Adrian Michael", lizenz: "CC BY-SA 3.0", lizenzUrl: "https://creativecommons.org/licenses/by-sa/3.0", quelle: "https://commons.wikimedia.org/wiki/File:Langnau_BE_air1.jpg" } },
  { name: "Erlach", kategorie: "orte", lat: 47.0330, lon: 7.0830, bildpfad: "images/orte/Erlach.jpg", kurzfakt: "Erlach liegt am Bielersee.", bildQuelle: { urheber: "JoachimKohler-HB", lizenz: "CC BY-SA 4.0", lizenzUrl: "https://creativecommons.org/licenses/by-sa/4.0", quelle: "https://commons.wikimedia.org/wiki/File:Altstadth%C3%BCgel_Erlach_am_Bielersee.jpg" } },
  { name: "Aarberg", kategorie: "orte", lat: 47.0437, lon: 7.2757, bildpfad: "images/orte/Aarberg.jpg", kurzfakt: "Aarberg hat ein hübsches, kreisrundes Städtchen-Zentrum.", bildQuelle: { urheber: "Roland Zumbuehl", lizenz: "CC BY 3.0", lizenzUrl: "https://creativecommons.org/licenses/by/3.0", quelle: "https://commons.wikimedia.org/wiki/File:Aarberg-Schloss.jpg" } },

  // ----- Berge (braun) ------------------------------------------------------
  { name: "Finsteraarhorn", kategorie: "berge", lat: 46.5386, lon: 8.1272, bildpfad: "images/berge/Finsteraarhorn.jpg", kurzfakt: "Das Finsteraarhorn ist mit 4274 m der höchste Berg im Kanton Bern.", bildQuelle: { urheber: "Carsten Steger", lizenz: "CC BY-SA 4.0", lizenzUrl: "https://creativecommons.org/licenses/by-sa/4.0", quelle: "https://commons.wikimedia.org/wiki/File:Aerial_image_of_Finsteraarhorn_(view_from_the_south).jpg" } },
  { name: "Eiger", kategorie: "berge", lat: 46.5772, lon: 8.0047, bildpfad: "images/berge/Eiger.jpg", kurzfakt: "Der Eiger ist berühmt für seine steile Nordwand.", bildQuelle: { urheber: "qwesy qwesy", lizenz: "CC BY 3.0", lizenzUrl: "https://creativecommons.org/licenses/by/3.0", quelle: "https://commons.wikimedia.org/wiki/File:Eiger_Nordwand_-_panoramio_(1).jpg" } },
  { name: "Mönch", kategorie: "berge", lat: 46.5583, lon: 7.9972, bildpfad: "images/berge/Moench.jpg", kurzfakt: "Der Mönch liegt zwischen Eiger und Jungfrau.", bildQuelle: { urheber: "Johannes D., Johannes-dilger at de.wikipedia", lizenz: "CC BY-SA 3.0", lizenzUrl: "http://creativecommons.org/licenses/by-sa/3.0/", quelle: "https://commons.wikimedia.org/wiki/File:Moench_e.jpg" } },
  { name: "Jungfrau", kategorie: "berge", lat: 46.5368, lon: 7.9626, bildpfad: "images/berge/Jungfrau.jpg", kurzfakt: "Die Jungfrau gehört zum UNESCO-Welterbe Jungfrau-Aletsch.", bildQuelle: { urheber: "Ambroix at German Wikipedia", lizenz: "Public domain", lizenzUrl: "", quelle: "https://commons.wikimedia.org/wiki/File:Jungfrau.wengen.jpg" } },
  { name: "Brienzer Rothorn", kategorie: "berge", lat: 46.7869, lon: 8.0469, bildpfad: "images/berge/Brienzer_Rothorn.jpg", kurzfakt: "Auf das Brienzer Rothorn fährt eine alte Dampfbahn.", bildQuelle: { urheber: "Andre Schild", lizenz: "CC BY 2.5", lizenzUrl: "https://creativecommons.org/licenses/by/2.5", quelle: "https://commons.wikimedia.org/wiki/File:Brienzer_Rothorn.JPG" } },
  { name: "Niesen", kategorie: "berge", lat: 46.6431, lon: 7.6522, bildpfad: "images/berge/Niesen.jpg", kurzfakt: "Der Niesen hat eine markante Pyramidenform.", bildQuelle: { urheber: "James Gathany", lizenz: "Public domain", lizenzUrl: "", quelle: "https://commons.wikimedia.org/wiki/File:Sneeze.JPG" } },
  { name: "Gurten", kategorie: "berge", lat: 46.9319, lon: 7.4414, bildpfad: "images/berge/Gurten.jpg", kurzfakt: "Der Gurten ist der Hausberg von Bern.", bildQuelle: { urheber: "Adrian Michael", lizenz: "CC BY-SA 3.0", lizenzUrl: "http://creativecommons.org/licenses/by-sa/3.0/", quelle: "https://commons.wikimedia.org/wiki/File:Gurten_Berg.JPG" } },
  { name: "Napf", kategorie: "berge", lat: 47.0042, lon: 7.9400, bildpfad: "images/berge/Napf.jpg", kurzfakt: "Der Napf liegt an der Grenze zum Kanton Luzern.", bildQuelle: { urheber: "Mitarbeitende Bundesamt für Landestopografie swisstopo", lizenz: "Attribution-Swisstopo", lizenzUrl: "", quelle: "https://commons.wikimedia.org/wiki/File:Swisstopo-000-402-352-Pyramide_Napf_S%C3%BCd_1911.tif" } },
  { name: "Chasseral", kategorie: "berge", lat: 47.1331, lon: 7.0594, bildpfad: "images/berge/Chasseral.jpg", kurzfakt: "Der Chasseral liegt im Berner Jura.", bildQuelle: { urheber: "Jérémy Toma", lizenz: "CC BY-SA 4.0", lizenzUrl: "https://creativecommons.org/licenses/by-sa/4.0", quelle: "https://commons.wikimedia.org/wiki/File:Le_Chasseral_(BE).jpg" } },

  // ----- Seen (blau) ---------------------------------------------------------
  { name: "Bielersee", kategorie: "seen", lat: 47.0830, lon: 7.1670, bildpfad: "images/seen/Bielersee.jpg", kurzfakt: "Am Bielersee liegt die St. Petersinsel.", bildQuelle: { urheber: "nicht eindeutig angegeben", lizenz: "CC BY-SA 3.0", lizenzUrl: "http://creativecommons.org/licenses/by-sa/3.0/", quelle: "https://commons.wikimedia.org/wiki/File:Bielersee.jpg" } },
  { name: "Neuenburgersee", kategorie: "seen", lat: 46.9000, lon: 6.8667, bildpfad: "images/seen/Neuenburgersee.jpg", kurzfakt: "Der Neuenburgersee ist der grösste vollständig in der Schweiz liegende See.", bildQuelle: { urheber: "Jean-Claude Collaud", lizenz: "CC BY-SA 3.0", lizenzUrl: "http://creativecommons.org/licenses/by-sa/3.0/", quelle: "https://commons.wikimedia.org/wiki/File:Lac_de_Neuchatel.jpg" } },
  { name: "Wohlensee", kategorie: "seen", lat: 46.9650, lon: 7.3700, bildpfad: "images/seen/Wohlensee.jpg", kurzfakt: "Der Wohlensee ist ein Stausee der Aare bei Bern.", bildQuelle: { urheber: "Adrian Sulc (Hinterkappelen at de.wikipedia)", lizenz: "CC BY-SA 3.0", lizenzUrl: "https://creativecommons.org/licenses/by-sa/3.0", quelle: "https://commons.wikimedia.org/wiki/File:Wohlensee_Hinterkappelen.jpg" } },
  { name: "Thunersee", kategorie: "seen", lat: 46.6900, lon: 7.7100, bildpfad: "images/seen/Thunersee.jpg", kurzfakt: "Der Thunersee wird von der Aare durchflossen.", bildQuelle: { urheber: "Carsten Steger", lizenz: "CC BY-SA 4.0", lizenzUrl: "https://creativecommons.org/licenses/by-sa/4.0", quelle: "https://commons.wikimedia.org/wiki/File:Aerial_image_of_Lake_Thun_(view_from_the_east).jpg" } },
  { name: "Brienzersee", kategorie: "seen", lat: 46.7250, lon: 7.9700, bildpfad: "images/seen/Brienzersee.jpg", kurzfakt: "Der Brienzersee ist bekannt für sein türkisblaues Wasser.", bildQuelle: { urheber: "Carsten Steger", lizenz: "CC BY-SA 4.0", lizenzUrl: "https://creativecommons.org/licenses/by-sa/4.0", quelle: "https://commons.wikimedia.org/wiki/File:Aerial_image_of_Lake_Brienz_(view_from_the_southwest).jpg" } },
  { name: "Grimselsee", kategorie: "seen", lat: 46.5675, lon: 8.3075, bildpfad: "images/seen/Grimselsee.jpg", kurzfakt: "Der Grimselsee ist ein Stausee im Berner Oberland.", bildQuelle: { urheber: "nicht eindeutig angegeben", lizenz: "CC BY-SA 3.0", lizenzUrl: "http://creativecommons.org/licenses/by-sa/3.0/", quelle: "https://commons.wikimedia.org/wiki/File:Grimselsee.jpg" } },

  // ----- Flüsse (grün) --------------------------------------------------------
  { name: "Aare", kategorie: "fluesse", lat: 46.9481, lon: 7.4361, bildpfad: "images/fluesse/Aare.jpg", kurzfakt: "Die Aare ist der wichtigste Fluss im Kanton Bern.", bildQuelle: { urheber: "Wolfgang Moroder", lizenz: "CC BY-SA 3.0", lizenzUrl: "https://creativecommons.org/licenses/by-sa/3.0", quelle: "https://commons.wikimedia.org/wiki/File:Bern_capital_of_Swizerland.jpg" } },
  { name: "Zihlkanal", kategorie: "fluesse", lat: 47.0550, lon: 7.0450, bildpfad: "images/fluesse/Zihlkanal.jpg", kurzfakt: "Der Zihlkanal verbindet den Neuenburgersee mit dem Bielersee.", bildQuelle: { urheber: "Хрюша", lizenz: "CC BY-SA 3.0", lizenzUrl: "https://creativecommons.org/licenses/by-sa/3.0", quelle: "https://commons.wikimedia.org/wiki/File:Eisenbahnbruecke_Zihlbruecke_01_11.jpg" } },
  { name: "Schüss", kategorie: "fluesse", lat: 47.1600, lon: 6.9970, bildpfad: "images/fluesse/Schuess.jpg", kurzfakt: "Die Schüss fliesst durch den Berner Jura nach Biel." },
  { name: "Emme", kategorie: "fluesse", lat: 46.9200, lon: 7.7600, bildpfad: "images/fluesse/Emme.jpg", kurzfakt: "Die Emme gibt dem Emmental seinen Namen.", bildQuelle: { urheber: "nicht eindeutig angegeben", lizenz: "CC BY-SA 3.0", lizenzUrl: "http://creativecommons.org/licenses/by-sa/3.0/", quelle: "https://commons.wikimedia.org/wiki/File:Emme_bei_Sch%C3%BCpbach.jpg" } },
  { name: "Saane", kategorie: "fluesse", lat: 46.4850, lon: 7.2500, bildpfad: "images/fluesse/Saane.jpg", kurzfakt: "Die Saane bildet teilweise die Sprachgrenze.", bildQuelle: { urheber: "nicht eindeutig angegeben", lizenz: "CC BY 2.0", lizenzUrl: "https://creativecommons.org/licenses/by/2.0", quelle: "https://commons.wikimedia.org/wiki/File:Sarine.jpg" } },
  { name: "Sense", kategorie: "fluesse", lat: 46.8600, lon: 7.3600, bildpfad: "images/fluesse/Sense.jpg", kurzfakt: "Die Sense bildet die Grenze zum Kanton Freiburg." },
  { name: "Simme", kategorie: "fluesse", lat: 46.5570, lon: 7.3730, bildpfad: "images/fluesse/Simme.jpg", kurzfakt: "Die Simme gibt dem Simmental seinen Namen.", bildQuelle: { urheber: "RetoGalli", lizenz: "CC BY-SA 3.0", lizenzUrl: "https://creativecommons.org/licenses/by-sa/3.0", quelle: "https://commons.wikimedia.org/wiki/File:Simmenfaelle.jpg" } },
  { name: "Kander", kategorie: "fluesse", lat: 46.4959, lon: 7.6763, bildpfad: "images/fluesse/Kander.jpg", kurzfakt: "Die Kander mündet über den Kanderkanal in den Thunersee.", bildQuelle: { urheber: "Adrian Michael", lizenz: "CC BY 2.5", lizenzUrl: "https://creativecommons.org/licenses/by/2.5", quelle: "https://commons.wikimedia.org/wiki/File:Kander_Gasterntal.jpg" } },
  { name: "Lütschine", kategorie: "fluesse", lat: 46.6516, lon: 7.9081, bildpfad: "images/fluesse/Luetschine.jpg", kurzfakt: "Die Lütschine entsteht aus der Schwarzen und der Weissen Lütschine.", bildQuelle: { urheber: "Jag9889", lizenz: "CC BY-SA 4.0", lizenzUrl: "https://creativecommons.org/licenses/by-sa/4.0", quelle: "https://commons.wikimedia.org/wiki/File:M%C3%BCndung_der_L%C3%BCtschine_in_den_Brienzersee,_B%C3%B6nigen_BE_20240624-jag9889.jpg" } },
];
