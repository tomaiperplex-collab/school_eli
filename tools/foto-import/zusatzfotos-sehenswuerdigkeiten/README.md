# Zusatzfotos SW1–SW9: 3 Alternativbilder pro Sehenswürdigkeit

27 zusätzliche, lizenzgeprüfte Wikimedia-Commons-Fotos für die 9
Sehenswürdigkeiten (je 3 pro Begriff, siehe `quellen.json`). Anders als das
Hauptpaket in `tools/foto-import/` sind diese **nicht** für die einzelne
`bildpfad`-Zuordnung in `data.js` gedacht — die App zeigt pro Begriff aktuell
genau ein Foto, keine Galerie.

Wikimedia Commons ist aus der Cloud-Sandbox weiterhin gesperrt, daher liegt
hier nur `download_bilder.py` bereit (lokal ausführen, siehe Kopfkommentar
im Skript).

**Offene Frage, bevor diese Bilder eingebaut werden:** Wofür sollen die drei
Alternativbilder pro Begriff verwendet werden? Zum Beispiel:
- als Foto-Karussell/Galerie in Lernmodus und Sehenswürdigkeiten-Karte, oder
- als zusätzliche Bildvarianten im "Foto → Name"-Quiz (damit nicht immer
  dasselbe Foto abgefragt wird), oder
- einfach nur als Auswahl, um das bisher einzige Hauptbild bei Bedarf zu
  ersetzen.

Je nach Antwort braucht es eine kleine Erweiterung an `data.js` (z.B. ein
`bildpfade`-Array statt `bildpfad`) und an `app.js` (Foto-Anzeige/Quiz-Logik).
