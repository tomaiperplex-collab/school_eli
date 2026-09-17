"""
Lädt 27 zusätzliche, lizenzgeprüfte Wikimedia-Commons-Fotos für die 9
Sehenswürdigkeiten (SW1-SW9), je 3 Alternativbilder pro Begriff. Diese
Fotos sind NICHT für die Haupt-bildpfad-Zuordnung in data.js gedacht (die
ist bereits über tools/foto-import/download_bilder.py abgedeckt), sondern
als Reserve/Auswahl, falls z.B. ein Foto-Karussell oder Foto→Name-
Varianten mit mehreren Bildern pro Begriff eingebaut werden sollen.

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
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/B%C3%A4rengraben.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW1_Baerengraben/SW1_01.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Bern%20B%C3%A4rengraben.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW1_Baerengraben/SW1_02.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Barengraben%20in%20Bern%20%282520050737%29.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW1_Baerengraben/SW1_03.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Bern%2C%20Zytglogge.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW2_Zytglogge/SW2_01.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Bern%20Zytglogge.JPG', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW2_Zytglogge/SW2_02.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Zytglogge%20Bern%20%283%29.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW2_Zytglogge/SW2_03.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/2014%20Bern%20M%C3%BCnster%20Cathedral%2C%20Bern%20Switzerland%20Ank%20Kumar%20Infosys%20Limited%2001.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW3_Berner_Muenster/SW3_01.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Bern%20Minster%2020180827-1.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW3_Berner_Muenster/SW3_02.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Bern%20Minster%20232A0980.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW3_Berner_Muenster/SW3_03.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/4144%20-%20Thun%20-%20Schloss%20Thun.JPG', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW4_Schloss_Thun/SW4_01.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/4157%20-%20Thun%20-%20Schloss%20Thun.JPG', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW4_Schloss_Thun/SW4_02.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Thun%20Castle%20%28Schloss%20Thun%29%20from%20above%20130622.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW4_Schloss_Thun/SW4_03.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Stadtkirche%20Thun.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW5_Stadtkirche_Thun/SW5_01.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Thun%20Stadtkirche%20DSC06476.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW5_Stadtkirche_Thun/SW5_02.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/2023-06-01%20Thun%20Freienhofgasse%2001%20Stadtkirche.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW5_Stadtkirche_Thun/SW5_03.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/4307%20-%20Thun%20-%20Schloss%20Schadau.JPG', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW6_Schloss_Schadau/SW6_01.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/4312%20-%20Thun%20-%20Schloss%20Schadau.JPG', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW6_Schloss_Schadau/SW6_02.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/SchlossSchadau%206383.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW6_Schloss_Schadau/SW6_03.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/I09%20326%20Ring%2C%20Vennerbrunnen.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW7_Altstadt_Biel/SW7_01.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Biel%20Ring%201.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW7_Altstadt_Biel/SW7_02.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Biel%20Ring%2011.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW7_Altstadt_Biel/SW7_03.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Taubenlochschlucht.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW8_Taubenlochschlucht/SW8_01.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Taubenlochschlucht%2000%2010.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW8_Taubenlochschlucht/SW8_02.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Taubenlochschlucht%2002%2011.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW8_Taubenlochschlucht/SW8_03.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/%22Cit%C3%A9%20du%20Temps%22%20der%20Swatch%20Group%2C%20Biel-Bienne%202020.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW9_Omega_Museum/SW9_01.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Biel%20Horlogerie%20OMEGA%20Eingang.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW9_Omega_Museum/SW9_02.jpg'),
    ('https://commons.wikimedia.org/wiki/Special:Redirect/file/Omega-Bienne-4.jpg', 'tools/foto-import/zusatzfotos-sehenswuerdigkeiten/SW9_Omega_Museum/SW9_03.jpg'),
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
