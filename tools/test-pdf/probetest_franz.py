#!/usr/bin/env python3
"""Erzeugt franzoesisch/probetest-cr6.html (Probetest Französisch, Ça roule 6).
Danach: NODE_PATH=$(npm root -g) node tools/test-pdf/render_franz.js"""
import html, pathlib
OUT = pathlib.Path(__file__).resolve().parents[2] / "franzoesisch" / "probetest-cr6.html"
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
        a, b = (fr, L(de)) if richtung == "fd" else (de, L(fr))
        rows += f'<tr><td>{e(a)}</td><td class="w">{b}</td></tr>'
    return f'<table class="vok">{rows}</table>'

def luecken(items):
    s = ""
    for i, (satz, antwort) in enumerate(items, 1):
        s += f'<div class="satz">{i}. {e(satz).replace("___", "<span class=lin>" + L(antwort) + "</span>")}</div>'
    return s

A_FD = [("la police","die Polizei"),("voler","stehlen"),("crier","rufen, schreien"),("tout à coup","plötzlich"),
        ("la montre","die Uhr"),("traverser","überqueren"),("les yeux","die Augen"),("derrière","hinter")]
A_DF = [("der Dieb","le voleur"),("heute","aujourd'hui"),("die Brille","les lunettes"),("der Hut","le chapeau"),
        ("nach links","à gauche"),("unter","sous"),("lang (m)","long"),("schlank","mince")]
B_ART = [("___ détective (m/f)","le / la"),("___ nez","le"),("___ moustache","la"),("___ chaussures","les"),
         ("___ cheveux","les"),("___ objet","l'")]
C_ADJ = [("Elle a les cheveux ___. (blond)","blonds"),("Il a les cheveux ___. (court)","courts"),
         ("Le voleur est ___. (mince)","mince"),("Elle a les cheveux ___. (long)","longs"),
         ("Il a une moustache ___. (noir)","noire")]
D_FAIRE = [("Je ___ du sport. (faire)","fais"),("Tu ___ de la musique. (faire)","fais"),("Elle ___ du théâtre. (faire)","fait"),
           ("Nous ___ du vélo. (faire)","faisons"),("Vous ___ de la danse. (faire)","faites"),("Ils ___ du football. (faire)","font")]
E_DU = [("Je fais ___ sport.","du"),("Elle fait ___ musique.","de la"),("Nous faisons ___ natation.","de la"),("Ils font ___ vélo.","du")]
F_FRAGE = [("___ est-ce que tu habites? (wo)","Où"),("___ est-ce que tu as ton anniversaire? (wann)","Quand"),
           ("___ est-ce que tu fais comme hobby? (was)","Qu'est-ce que"),("___ est-ce que tu t'appelles? (wie)","Comment")]
F_FRAGE[2] = ("___ tu fais comme hobby? (was)","Qu'est-ce que")
G_ORT = [("Raphaela est ___ le magasin. (vor)","devant"),("Ils trouvent le chapeau ___ un banc. (unter)","sous"),
         ("___ le chapeau, il y a un papier. (Hinter)","Derrière"),("Le voleur est à ___ de la maison. (links von)","gauche"),
         ("D'abord, tu tournes ___. (nach rechts)","à droite")]
H_UEB = [("Der Detektiv sucht den Dieb.","Le détective cherche le voleur."),
         ("Sie ruft die Polizei an.","Elle téléphone à la police."),
         ("Ich mache Sport.","Je fais du sport."),
         ("Er hat lange Haare und eine Brille.","Il a les cheveux longs et il porte des lunettes."),
         ("Wo wohnst du?","Où est-ce que tu habites?")]

def kopf():
    return ('<div class="kopf"><span>Name: <span class="lin" style="min-width:60mm"></span></span>'
            '<span>Datum: <span class="lin" style="min-width:30mm"></span></span>'
            '<span>Punkte: <span class="lin" style="min-width:14mm"></span> / 56</span></div>')

h = f'''<!DOCTYPE html><html lang="de-CH"><head><meta charset="UTF-8"><title>Probetest Französisch – Ça roule 6</title><style>
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
<h1>Probetest Französisch</h1><p class="sub">Ça roule 6 · Unité 1 + Grammatik (faire, du / de la, Les questions) · 30 Minuten · 56 Punkte</p>

<h2>1. Französisch → Deutsch <span class="p">/ 8</span></h2>{tabelle(A_FD,"fd")}
<h2>2. Deutsch → Französisch <span class="p">/ 8</span></h2>{tabelle(A_DF,"df")}
<h2>3. Artikel <span class="p">/ 6</span></h2><div class="tipp">Schreibe le, la, l' oder les.</div>{luecken(B_ART)}
</div>
<div class="seite">{kopf()}
<h2>4. Aussehen beschreiben <span class="p">/ 5</span></h2><div class="tipp">Setze das Adjektiv in der richtigen Form ein.</div>{luecken(C_ADJ)}
<h2>5. Das Verb «faire» <span class="p">/ 6</span></h2>{luecken(D_FAIRE)}
<h2>6. du oder de la? <span class="p">/ 4</span></h2>{luecken(E_DU)}
<h2>7. Fragen <span class="p">/ 4</span></h2><div class="tipp">Où · Quand · Comment · Qu'est-ce que</div>{luecken(F_FRAGE)}
</div>
<div class="seite">{kopf()}
<h2>8. Wo ist was? <span class="p">/ 5</span></h2><div class="tipp">devant · derrière · sous · à gauche · à droite</div>{luecken(G_ORT)}
<h2>9. Übersetze ins Französische <span class="p">/ 10</span></h2>'''
for de, fr in H_UEB:
    h += f'<div class="u">{e(de)}{zl(1, fr)}</div>'
h += '</div></body></html>'
OUT.write_text(h, encoding="utf-8")
print(OUT)
