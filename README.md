# Kanton Bern lernen 🏔️

Kleine Web-App zum Üben von Geografie-Begriffen des Kantons Bern
(NMG-Prüfungsvorbereitung, 5. Klasse). Reines HTML/CSS/JavaScript, kein
Framework, kein Backend.

**Internetzugriff:** Die Kartenansichten laden echte Kartenkacheln von
OpenStreetMap bzw. swisstopo live über das Internet (siehe Abschnitt
"Karte: OpenStreetMap / swisstopo" unten) — dafür ist beim Anschauen der
Karte eine Internetverbindung nötig. Quiz-Logik und Fortschritt
(`localStorage`) funktionieren weiterhin ohne Internet, sobald die Seite
einmal geladen ist.

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

Die Konstante `KARTE_BOUNDS` (ebenfalls in `data.js`) definiert nur noch den
groben Kartenausschnitt, auf den die Leaflet-Karten beim Start zentriert
werden (`fitBounds`) — sie muss normalerweise nicht verändert werden.

## Karte: OpenStreetMap / swisstopo

Die Kartenansichten nutzen [Leaflet](https://leafletjs.com/) (vendored unter
`vendor/leaflet/`, BSD-2-Clause) mit echten Kartenkacheln:

- **Standard:** OpenStreetMap
- **Umschaltbar:** swisstopo (Ebenen-Schalter oben rechts auf der
  Übersichtskarte, dem Quadrate-Symbol)

Beide Dienste sind kostenlos und benötigen keinen API-Key, laden ihre Kacheln
aber live über das Internet — ohne Internetverbindung bleibt die Kartenfläche
grau. Die Marker-Positionen kommen direkt aus den `lat`/`lon`-Werten in
`data.js`, es gibt keine eigene Projektion mehr zu pflegen.

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
data.js         Begriffsliste + Kategorie-Farben + Kartenausschnitt
app.js          Gesamte App-Logik (Leaflet-Karten, Quiz-Modi, Fortschritt)
vendor/leaflet/ Vendorte Leaflet-Bibliothek (BSD-2-Clause)
images/
  orte/         Eigene Fotos für Orte (Dateiname siehe data.js)
  berge/        Eigene Fotos für Berge
  seen/         Eigene Fotos für Seen
  fluesse/      Eigene Fotos für Flüsse
```

Kein Build-Schritt, keine weiteren Abhängigkeiten. Für die Kartenansichten ist
eine Internetverbindung nötig (siehe oben), alles andere läuft lokal im
Browser.
