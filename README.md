# Kanton Bern lernen 🏔️

Kleine, lokal lauffähige Web-App zum Üben von Geografie-Begriffen des Kantons
Bern (NMG-Prüfungsvorbereitung, 5. Klasse). Reines HTML/CSS/JavaScript, kein
Framework, kein Backend, kein Internetzugriff nötig.

## Starten

Einfach `index.html` im Browser öffnen (Doppelklick genügt) — oder, falls dein
Browser lokale Bilder/Skripte blockiert, mit einem kleinen lokalen Server:

```bash
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```

## Deine eigenen Fotos ergänzen

1. Öffne `data.js`.
2. Jeder Begriff verweist bereits auf einen Bildpfad, z.B.
   `images/orte/Bern.jpg`.
3. Lege einfach dein eigenes Foto **mit genau diesem Dateinamen** im
   passenden Unterordner unter `images/` ab:
   - `images/orte/`
   - `images/berge/`
   - `images/seen/`
   - `images/fluesse/`
4. Fertig — beim nächsten Öffnen der App erscheint dein Foto automatisch im
   Übungsmodus "Foto → Name". Fehlt ein Bild, zeigt die App nur einen
   leeren Rahmen mit Hinweistext an (kein Absturz).

Es werden **keine** Bilder aus dem Internet geladen oder eingebettet — nur
deine eigenen lokalen Dateien.

## Echte Koordinaten eintragen

1. Öffne `data.js`.
2. Jeder Begriff hat aktuell `lat: null, lon: null`.
3. Trage dort die echten WGS84-Koordinaten ein, z.B. für Bern:
   ```js
   { name: "Bern", kategorie: "orte", lat: 46.9480, lon: 7.4474, ... }
   ```
   Koordinaten findest du z.B. über [map.geo.admin.ch](https://map.geo.admin.ch)
   (Rechtsklick auf den Ort → Koordinaten anzeigen) oder über OpenStreetMap.
4. Ein Begriff erscheint auf der Karte und im Übungsmodus "Karte → Name" erst,
   sobald **beide** Werte (`lat` und `lon`) gesetzt sind.

Die Konstante `KARTE_BOUNDS` (ebenfalls in `data.js`) definiert den
Kartenausschnitt, auf den die Koordinaten projiziert werden. Die
Voreinstellung deckt den Kanton Bern grosszügig ab und muss normalerweise
nicht verändert werden.

## Echten Kantons-Umriss eintragen

Aktuell zeigt die Karte ein einfaches Platzhalter-Vieleck. Um die echte Form
des Kantons Bern zu verwenden:

1. Öffne `index.html`.
2. Suche das Element `<polygon id="kanton-umriss" ...>` (Kartenübersicht) und
   das inhaltsgleiche `<polygon id="kanton-umriss-mini" ...>` (Vorlage für die
   kleinen Karten in den Übungsmodi).
3. Ersetze die `points`-Liste durch echte Umriss-Koordinaten, projiziert in
   dasselbe Koordinatensystem wie die Punkte (0–1000 in x, 0–700 in y — siehe
   Funktion `projiziere()` in `app.js` bzw. `KARTE_BOUNDS` in `data.js`).
   Am einfachsten: Kantonsgrenze als GeoJSON besorgen, jeden Punkt mit der
   gleichen Formel wie in `projiziere()` umrechnen und als `x,y`-Liste
   einsetzen.

## Funktionen

- **Karte ansehen**: Übersichtskarte mit farbcodierten Punkten (rot = Orte,
  braun = Berge, blau = Seen, grün = Flüsse) und Legende mit Kurzcode
  (z.B. "O1 = Bern").
- **Karte → Name**: Ein Punkt wird auf der Karte hervorgehoben, du wählst den
  richtigen Namen aus 4 Optionen.
- **Foto → Name**: Ein Foto wird gezeigt (dein eigenes, siehe oben), du wählst
  den richtigen Namen aus 4 Optionen; unten rechts zeigt eine Mini-Karte den
  Ort.
- **Freitext**: Wie "Foto → Name", aber du tippst den Namen selbst ein
  (Gross-/Kleinschreibung spielt keine Rolle).
- **Kategorie-Filter**: Oben lassen sich Orte/Berge/Seen/Flüsse einzeln
  ein-/ausblenden — auch gemischt.
- **Fortschritt**: Punktestand und Prozent richtig pro Kategorie werden in
  `localStorage` gespeichert und bleiben über Neustarts der App erhalten.
  Mit dem Button "Fortschritt zurücksetzen" kann alles gelöscht werden.

## Projektstruktur

```
index.html      Grundgerüst und alle Ansichten
style.css       Kindgerechtes, responsives Design
data.js         Begriffsliste + Kategorie-Farben + Karten-Projektion
app.js          Gesamte App-Logik (Karte, Quiz-Modi, Fortschritt)
images/
  orte/         Eigene Fotos für Orte (Dateiname siehe data.js)
  berge/        Eigene Fotos für Berge
  seen/         Eigene Fotos für Seen
  fluesse/      Eigene Fotos für Flüsse
```

Kein Build-Schritt, keine Abhängigkeiten, keine Internetverbindung nötig.
