"""
Lädt echte Wikimedia-Commons-Fotos für 14 Begriffe, die aktuell noch
Platzhalterbilder haben, und legt sie direkt an der von data.js erwarteten
Stelle im Projekt ab.

Wikimedia Commons ist vom Netzwerk-Proxy der Cloud-Sandbox blockiert, daher
kann dieses Skript dort nicht laufen. Bitte lokal ausführen (auf einem
Rechner mit normalem Internetzugang), im Projekt-Root:

    python3 tools/foto-import/download_bilder.py

Die Lizenz-/Quellenangaben stehen in quellen.json. Nach dem Ausführen bitte
Claude Bescheid geben, dann werden die bildQuelle-Einträge in data.js sowie
der Bildnachweise-Abschnitt ergänzt.
"""
from pathlib import Path
from urllib.request import Request, urlopen

# Projekt-Root = zwei Ebenen über diesem Skript (tools/foto-import/../..)
ROOT = Path(__file__).resolve().parent.parent.parent

FILES = [
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/B-Aarwangen-Schloss.jpg', 'images/orte/Aarwangen.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Sch%C3%BCss-Promenade%20Biel.jpg', 'images/fluesse/Schuess.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/B%C3%A4rengraben%20Bern.JPG', 'images/sehenswuerdigkeiten/Baerengraben.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Zytglogge-Bern.jpg', 'images/sehenswuerdigkeiten/Zytglogge.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/M%C3%BCnster%20%28Bern%29.jpg', 'images/sehenswuerdigkeiten/Berner_Muenster.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/SchlossThun.jpg', 'images/sehenswuerdigkeiten/Schloss_Thun.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/4136%20-%20Thun%20-%20Stadtkirche.JPG', 'images/sehenswuerdigkeiten/Stadtkirche_Thun.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Schloss%20Schadau%20am%20Thunersee.jpg', 'images/sehenswuerdigkeiten/Schloss_Schadau.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Ring%20Pfau.jpg', 'images/sehenswuerdigkeiten/Altstadt_Biel.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Taubenlochschlucht%2001%2010.jpg', 'images/sehenswuerdigkeiten/Taubenlochschlucht.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Omega-Museum%20Biel.jpg', 'images/sehenswuerdigkeiten/Omega_Museum.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Niesen%20with%20Niesenbahn.jpg', 'images/berge/Niesen.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/GstaadPanoramaVillage.jpg', 'images/orte/Gstaad.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Tour%20de%20Moron%202018.jpg', 'images/berge/Moron.jpg'),
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
