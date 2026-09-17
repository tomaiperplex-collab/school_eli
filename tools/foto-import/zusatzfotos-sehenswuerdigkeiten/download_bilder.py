"""
Lädt 27 zusätzliche, lizenzgeprüfte Wikimedia-Commons-Fotos für die 9
Sehenswürdigkeiten (SW1-SW9), je 3 Alternativbilder pro Begriff, und legt
sie direkt an den von data.js erwarteten Galerie-Pfaden ab
(images/sehenswuerdigkeiten/<Name>_2.jpg, _3.jpg, _4.jpg -- <Name>.jpg
ohne Suffix ist das bestehende Hauptbild aus tools/foto-import/).

Das Lernmodus-Foto-Karussell (app.js, holeBildpfade()) zeigt diese 4 Bilder
pro Begriff nacheinander an, sobald es echte Fotos statt Platzhalter sind.

Wikimedia Commons ist vom Netzwerk-Proxy der Cloud-Sandbox blockiert,
daher bitte lokal ausführen (Rechner mit normalem Internetzugang), im
Projekt-Root:

    python3 tools/foto-import/zusatzfotos-sehenswuerdigkeiten/download_bilder.py

Die Lizenz-/Quellenangaben stehen in quellen.json.
"""
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent.parent.parent.parent

FILES = [
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/B%C3%A4rengraben.jpg', 'images/sehenswuerdigkeiten/Baerengraben_2.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Bern%20B%C3%A4rengraben.jpg', 'images/sehenswuerdigkeiten/Baerengraben_3.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Barengraben%20in%20Bern%20%282520050737%29.jpg', 'images/sehenswuerdigkeiten/Baerengraben_4.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Bern%2C%20Zytglogge.jpg', 'images/sehenswuerdigkeiten/Zytglogge_2.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Bern%20Zytglogge.JPG', 'images/sehenswuerdigkeiten/Zytglogge_3.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Zytglogge%20Bern%20%283%29.jpg', 'images/sehenswuerdigkeiten/Zytglogge_4.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/2014%20Bern%20M%C3%BCnster%20Cathedral%2C%20Bern%20Switzerland%20Ank%20Kumar%20Infosys%20Limited%2001.jpg', 'images/sehenswuerdigkeiten/Berner_Muenster_2.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Bern%20Minster%2020180827-1.jpg', 'images/sehenswuerdigkeiten/Berner_Muenster_3.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Bern%20Minster%20232A0980.jpg', 'images/sehenswuerdigkeiten/Berner_Muenster_4.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/4144%20-%20Thun%20-%20Schloss%20Thun.JPG', 'images/sehenswuerdigkeiten/Schloss_Thun_2.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/4157%20-%20Thun%20-%20Schloss%20Thun.JPG', 'images/sehenswuerdigkeiten/Schloss_Thun_3.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Thun%20Castle%20%28Schloss%20Thun%29%20from%20above%20130622.jpg', 'images/sehenswuerdigkeiten/Schloss_Thun_4.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Stadtkirche%20Thun.jpg', 'images/sehenswuerdigkeiten/Stadtkirche_Thun_2.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Thun%20Stadtkirche%20DSC06476.jpg', 'images/sehenswuerdigkeiten/Stadtkirche_Thun_3.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/2023-06-01%20Thun%20Freienhofgasse%2001%20Stadtkirche.jpg', 'images/sehenswuerdigkeiten/Stadtkirche_Thun_4.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/4307%20-%20Thun%20-%20Schloss%20Schadau.JPG', 'images/sehenswuerdigkeiten/Schloss_Schadau_2.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/4312%20-%20Thun%20-%20Schloss%20Schadau.JPG', 'images/sehenswuerdigkeiten/Schloss_Schadau_3.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/SchlossSchadau%206383.jpg', 'images/sehenswuerdigkeiten/Schloss_Schadau_4.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/I09%20326%20Ring%2C%20Vennerbrunnen.jpg', 'images/sehenswuerdigkeiten/Altstadt_Biel_2.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Biel%20Ring%201.jpg', 'images/sehenswuerdigkeiten/Altstadt_Biel_3.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Biel%20Ring%2011.jpg', 'images/sehenswuerdigkeiten/Altstadt_Biel_4.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Taubenlochschlucht.jpg', 'images/sehenswuerdigkeiten/Taubenlochschlucht_2.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Taubenlochschlucht%2000%2010.jpg', 'images/sehenswuerdigkeiten/Taubenlochschlucht_3.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Taubenlochschlucht%2002%2011.jpg', 'images/sehenswuerdigkeiten/Taubenlochschlucht_4.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/%22Cit%C3%A9%20du%20Temps%22%20der%20Swatch%20Group%2C%20Biel-Bienne%202020.jpg', 'images/sehenswuerdigkeiten/Omega_Museum_2.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Biel%20Horlogerie%20OMEGA%20Eingang.jpg', 'images/sehenswuerdigkeiten/Omega_Museum_3.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Omega-Bienne-4.jpg', 'images/sehenswuerdigkeiten/Omega_Museum_4.jpg'),
]

for url, rel in FILES:
    target = ROOT / rel
    target.parent.mkdir(parents=True, exist_ok=True)
    req = Request(url, headers={'User-Agent': 'KantonBernEducationalApp/1.0'})
    with urlopen(req, timeout=60) as r:
        data = r.read()
    target.write_bytes(data)
    print(f'{rel}: {len(data):,} bytes')

print('\nFertig.')
