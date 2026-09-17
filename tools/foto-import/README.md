# Foto-Import: echte Fotos statt Platzhalter

Dieser Ordner enthält alles, um 11 der aktuell 12 Platzhalterbilder durch
echte, lizenzgeprüfte Wikimedia-Commons-Fotos zu ersetzen. Aus der Cloud-
Sandbox heraus ist Wikimedia Commons für den Netzwerk-Proxy gesperrt, darum
kann Claude die Dateien dort nicht selbst herunterladen.

## Vorgehen

1. `python3 tools/foto-import/download_bilder.py` auf einem Rechner mit
   normalem Internetzugang ausführen (im Projekt-Root). Legt die Fotos
   direkt unter `images/orte/`, `images/fluesse/` und
   `images/sehenswuerdigkeiten/` an, exakt an den von `data.js` erwarteten
   Pfaden.
2. Änderungen committen/pushen (oder Claude Bescheid geben, dann übernimmt
   Claude das inkl. `bildQuelle`-Einträgen in `data.js` und dem
   Bildnachweise-Abschnitt).

`quellen.json` enthält Urheber, Lizenz und Quellseite je Bild (Pflichtangaben
bei CC BY / CC BY-SA).

**Nicht enthalten:** Moron / Tour de Moron — für keine konkrete Commons-Datei
konnte die Lizenz eindeutig verifiziert werden, daher bleibt
`images/berge/Moron.jpg` vorerst ein Platzhalter.
