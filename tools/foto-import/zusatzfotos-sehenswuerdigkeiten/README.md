# Zusatzfotos SW1–SW9: Foto-Karussell im Lernmodus

27 zusätzliche, lizenzgeprüfte Wikimedia-Commons-Fotos für die 9
Sehenswürdigkeiten (je 3 pro Begriff, siehe `quellen.json`), verwendet als
Galerie-Bilder 2–4 im Lernmodus-Foto-Karussell (Bild 1 ist weiterhin das
Hauptbild aus `tools/foto-import/`).

Aktuell zeigen alle vier Galerie-Plätze pro Sehenswürdigkeit noch
Platzhalter (`images/sehenswuerdigkeiten/<Name>.jpg` sowie `_2`/`_3`/`_4`).
Die Karussell-Funktion selbst (Pfeile, Punkte-Navigation, Reset beim
Begriffwechsel) ist bereits fertig in `app.js`/`index.html`/`style.css`
umgesetzt und funktioniert unabhängig davon, ob echte Fotos oder
Platzhalter angezeigt werden.

## Bilder herunterladen

Wikimedia Commons ist aus der Cloud-Sandbox weiterhin gesperrt. Lokal (mit
normalem Internetzugang), im Projekt-Root:

    python3 tools/foto-import/zusatzfotos-sehenswuerdigkeiten/download_bilder.py

Legt die 27 Dateien direkt an den von `data.js` erwarteten Pfaden ab
(`images/sehenswuerdigkeiten/<Name>_2.jpg` bis `_4.jpg`) – zusammen mit dem
Hauptbild aus `tools/foto-import/download_bilder.py` ergibt das die vollen
4 Galerie-Bilder pro Sehenswürdigkeit. Danach committen/pushen oder Claude
Bescheid geben für die `bildQuelle`-Einträge in `data.js` und den
Bildnachweise-Abschnitt.
