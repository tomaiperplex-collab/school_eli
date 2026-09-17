# Foto-Import: echte Fotos statt Platzhalter

Dieser Ordner enthält alles, um die aktuell 14 Platzhalterbilder durch
echte, lizenzgeprüfte Wikimedia-Commons-Fotos zu ersetzen. Aus der Cloud-
Sandbox heraus ist Wikimedia Commons für den Netzwerk-Proxy gesperrt, darum
kann Claude die Dateien dort nicht selbst herunterladen.

## Vorgehen

1. `python3 tools/foto-import/download_bilder.py` auf einem Rechner mit
   normalem Internetzugang ausführen (im Projekt-Root). Legt die Fotos
   direkt unter `images/orte/`, `images/berge/`, `images/fluesse/` und
   `images/sehenswuerdigkeiten/` an, exakt an den von `data.js` erwarteten
   Pfaden.
2. Änderungen committen/pushen (oder Claude Bescheid geben, dann übernimmt
   Claude das inkl. `bildQuelle`-Einträgen in `data.js` und dem
   Bildnachweise-Abschnitt).

`quellen.json` enthält Urheber, Lizenz und Quellseite je Bild (Pflichtangaben
bei CC BY / CC BY-SA).

## Hinweis zu bereits vorhandenen Fotos

Bei einem früheren Import (Commit "Echte CC-lizenzierte Fotos statt
Platzhalter") waren zwei Bilder falsch zugeordnet: `Niesen.jpg` zeigte einen
niesenden Mann (Namensverwechslung mit "niesen"), `Gstaad.png` war eine
Gemeindekarte statt eines Fotos. Beide wurden auf Platzhalter zurückgesetzt
und sind hier neu mit verifizierten Quellen enthalten. Bei künftigen
Foto-Importen die heruntergeladenen Bilder stichprobenartig ansehen, nicht
nur den Dateinamen prüfen.
