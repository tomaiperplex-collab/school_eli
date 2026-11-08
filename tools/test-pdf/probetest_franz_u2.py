#!/usr/bin/env python3
"""Erzeugt franzoesisch/probetest-cr6-u2.html (Probetest Französisch, Ça roule 6).
Danach: NODE_PATH=$(npm root -g) node tools/test-pdf/render_franz.js"""
import html, pathlib
OUT = pathlib.Path(__file__).resolve().parents[2] / "franzoesisch" / "probetest-cr6-u2.html"
e = html.escape
def L(t): return f'<span class="los">{e(t)}</span>'
def zl(n=1, los=None):
    out = ""
    for i in range(n):
        out += f'<div class="zl">{L(los) if (los and i == 0) else ""}</div>'
    return out

def tabelle(paare, richtung):
    rows = ""
    for fr, de in paare:
        a, b = (fr, L(de))
        rows += f'<tr><td>{e(a)}</td><td class="w">{b}</td></tr>'
    return f'<table class="vok">{rows}</table>'

def luecken(items):
    s = ""
    for i, (satz, antwort) in enumerate(items, 1):
        s += f'<div class="satz">{i}. {e(satz).replace("___", "<span class=lin>" + L(antwort) + "</span>")}</div>'
    return s

A_FD = [("l'athlétisme","die Leichtathletik"),("la gymnastique","das Turnen"),("le printemps","der Frühling"),("l'hiver","der Winter"),
        ("la gare","der Bahnhof"),("la mer","das Meer"),("toujours","immer"),("voyager","reisen")]
A_DF = [("der Geburtstag","l'anniversaire"),("der Sommer","l'été"),("der Herbst","l'automne"),("die Ferien","les vacances"),
        ("der Ausflug","l'excursion"),("der Berg","la montagne"),("die Jahreszeit","la saison"),("der Monat","le mois")]
B_ART = [("___ tennis","le"),("___ gymnastique","la"),("___ été","l'"),("___ vacances","les"),
         ("___ gare","la"),("___ ski","le")]
C_ADJ = [("Januar: ___","janvier"),("Februar: ___","février"),("Juni: ___","juin"),("August: ___","août"),("Dezember: ___","décembre")]
D_FAIRE = [("Je ___ du ski. (faire)","fais"),("Tu ___ de la gymnastique. (faire)","fais"),("Elle ___ de l'athlétisme. (faire)","fait"),
           ("Nous ___ du tennis. (faire)","faisons"),("Vous ___ une excursion. (faire)","faites"),("Ils ___ du sport. (faire)","font")]
E_DU = [("Je fais ___ ski.","du"),("Elle fait ___ gymnastique.","de la"),("Nous faisons ___ tennis.","du"),("Ils font ___ athlétisme.","de l'")]
F_FRAGE = [("___ est-ce que tu habites? (wo)","Où"),("___ est-ce que tu as ton anniversaire? (wann)","Quand"),
           ("___ tu fais comme hobby? (was)","Qu'est-ce que"),("___ est-ce que tu t'appelles? (wie)","Comment")]
G_ORT = [("Nous allons en ___ à la mer. (Ferien)","vacances"),("J'aime ___ en train. (reisen)","voyager"),
         ("Nous avons rendez-vous à la ___. (Bahnhof)","gare"),("En vacances, nous allons ___ chez ma grand-mère. (immer)","toujours"),
         ("Nous faisons du ski à la ___. (Berg)","montagne")]
H_UEB = [("Ich mache Leichtathletik.","Je fais de l'athlétisme."),
         ("Im Winter mache ich Ski.","En hiver, je fais du ski."),
         ("Wann hast du Geburtstag?","Quand est-ce que tu as ton anniversaire?"),
         ("Im Sommer gehen wir ans Meer.","En été, nous allons à la mer."),
         ("Heute ist der erste Mai.","Aujourd'hui, c'est le premier mai.")]

def kopf():
    return ('<div class="kopf"><span>Name: <span class="lin" style="min-width:60mm"></span></span>'
            '<span>Datum: <span class="lin" style="min-width:30mm"></span></span>'
            '<span>Punkte: <span class="lin" style="min-width:14mm"></span> / 56</span></div>')

h = f'''<!DOCTYPE html><html lang="de-CH"><head><meta charset="UTF-8"><title>Probetest Französisch – Unité 2</title><style>
@page {{ size: A4; margin: 13mm 15mm; }}
* {{ box-sizing: border-box; }}
body {{ font-family: "Liberation Sans", Arial, sans-serif; font-size: 11pt; line-height: 1.35; color: #111; margin: 0; }}
.seite {{ break-after: page; }} .seite:last-child {{ break-after: auto; }}
.kopf {{ display: flex; justify-content: space-between; margin-bottom: 6mm; }}
.lin {{ display: inline-block; border-bottom: 1px solid #333; min-width: 22mm; text-align: center; }}
h1 {{ font-size: 20pt; margin: 0 0 1mm; }} .sub {{ color: #555; margin: 0 0 6mm; }}
h2 {{ font-size: 12.5pt; margin: 5mm 0 2mm; }} .p {{ float: right; font-weight: 400; font-size: 10.5pt; }}
.vok {{ width: 100%; border-collapse: collapse; }} .vok td {{ padding: 1.2mm 3mm; border-bottom: 1px solid #aaa; width: 50%; height: 7mm; }}
.satz {{ margin: 4mm 0; }} .zl {{ border-bottom: 1px solid #333; height: 9mm; margin-top: 3mm; display:flex; align-items:flex-end; }}
.u {{ margin-top: 5mm; }}
.los {{ visibility: hidden; color: #b00020; font-weight: 700; }}
body.nur-loesung .los {{ visibility: visible; }}
.tipp {{ background:#f3f3f3; padding:3mm 4mm; margin:3mm 0; font-size:10pt; }}
</style></head><body>
<div class="seite">{kopf()}
<h1>Probetest Französisch</h1><p class="sub">Ça roule 6 · Unité 2 «Salut les Romands» (Sport, Jahreszeiten, Monate, Reisen, faire, du / de la, Les questions) · 30 Minuten · 56 Punkte</p>

<h2>1. Französisch → Deutsch <span class="p">/ 8</span></h2>{tabelle(A_FD,"fd")}
<h2>2. Deutsch → Französisch <span class="p">/ 8</span></h2>{tabelle(A_DF,"df")}
<h2>3. Artikel <span class="p">/ 6</span></h2><div class="tipp">Schreibe le, la, l' oder les.</div>{luecken(B_ART)}
</div>
<div class="seite">{kopf()}
<h2>4. Monate <span class="p">/ 5</span></h2><div class="tipp">Schreibe den Monat auf Französisch.</div>{luecken(C_ADJ)}
<h2>5. Das Verb «faire» <span class="p">/ 6</span></h2>{luecken(D_FAIRE)}
<h2>6. du, de la oder de l'? <span class="p">/ 4</span></h2>{luecken(E_DU)}
<h2>7. Fragen <span class="p">/ 4</span></h2><div class="tipp">Où · Quand · Comment · Qu'est-ce que</div>{luecken(F_FRAGE)}
</div>
<div class="seite">{kopf()}
<h2>8. Reisen und Ferien <span class="p">/ 5</span></h2><div class="tipp">vacances · voyager · gare · toujours · montagne</div>{luecken(G_ORT)}
<h2>9. Übersetze ins Französische <span class="p">/ 10</span></h2>'''
for de, fr in H_UEB:
    h += f'<div class="u">{e(de)}{zl(1, fr)}</div>'
h += '</div></body></html>'
OUT.write_text(h, encoding="utf-8")
print(OUT)
