#!/usr/bin/env python3
"""Erzeugt deutsch/test-pruefung-26-10.html (Probetest zum Ausdrucken) aus den
Inhalten der Lernziele «Baumuster und Satzglieder». Danach render_pdf.js
ausführen, um Test.pdf und Loesung.pdf zu erzeugen:

    python3 tools/test-pdf/build_test.py
    NODE_PATH=$(npm root -g) node tools/test-pdf/render_pdf.js
"""
import html, pathlib

OUT = pathlib.Path(__file__).resolve().parents[2] / "deutsch" / "test-pruefung-26-10.html"

def e(s): return html.escape(s)

# ---------- Silbenmodell (6 Kästchen) ----------
def modell(zellen=None, lang=None, leer=False, klein=False):
    z = zellen or [""] * 6
    def k(i):
        b = z[i]
        cls = "k"
        if b and not leer:
            if i == 1: cls += " lang" if lang else " kurz"
            elif i == 4: cls += " nebe"
        return f'<span class="{cls}">{e(b) if not leer else ""}</span>'
    return ('<span class="modell%s"><span class="silbe haupt">%s</span><span class="silbe">%s</span></span>'
            % (" klein" if klein else "", "".join(k(i) for i in range(3)), "".join(k(i) for i in range(3, 6))))

W = {
 "Rose": (["R","o","","s","e",""], True, 1), "Taube": (["T","au","","b","e",""], True, 1),
 "lieben": (["l","ie","","b","e","n"], True, 1), "Pinsel": (["P","i","n","s","e","l"], False, 2),
 "Wolke": (["W","o","l","k","e",""], False, 2), "Keller": (["K","e","l","l","e","r"], False, 3),
 "gucken": (["g","u","c","k","e","n"], False, 3), "drehen": (["dr","e","","h","e","n"], True, 4),
 "gehen": (["g","e","","h","e","n"], True, 4), "Sommer": (["S","o","m","m","e","r"], False, 3),
}

# ---------- Verbenfächer ----------
POS = [  # (Frage, Box-x, Box-y, Anker-x, Anker-y)
 ("Wer? Was?", 20, 14, 170, 48), ("Wo?", 390, 14, 390, 48), ("Wann?", 0, 148, 130, 165),
 ("Womit?", 420, 148, 430, 165), ("Wie?", 20, 282, 170, 282), ("Wen? Was?", 390, 282, 390, 282),
]
def faecher(verb, inhalt, loesung=False):
    """inhalt: dict Frage -> Text ('' = leer lassen zum Ausfüllen)."""
    out = ['<svg class="faecher" viewBox="0 0 560 270" role="img">']
    cx, cy = 280, 135
    boxes = [(20,20,170,"Wer? Was?"),(370,20,170,"Wo?"),(4,113,150,"Wann?"),(406,113,150,"Womit?"),(20,214,170,"Wie?"),(370,214,170,"Wen? Was?")]
    for (x, y, w, frage) in boxes:
        bx, by = x + w/2, y + 20
        out.append(f'<line x1="{cx}" y1="{cy}" x2="{bx}" y2="{by}" class="strahl"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="52" class="mitte"/>')
    out.append(f'<text x="{cx}" y="{cy-22}" text-anchor="middle" font-size="16">♛</text>')
    if verb:
        out.append(f'<text x="{cx}" y="{cy+6}" text-anchor="middle" class="ein" font-size="19">{e(verb)}</text>')
    for (x, y, w, frage) in boxes:
        txt = inhalt.get(frage, None)
        out.append(f'<rect x="{x}" y="{y}" width="{w}" height="40" rx="12" class="feld"/>')
        out.append(f'<text x="{x+w/2}" y="{y-4}" text-anchor="middle" class="frage" font-size="13">{e(frage)}</text>')
        if txt:
            size = 14 if len(txt) < 20 else 12
            out.append(f'<text x="{x+w/2}" y="{y+25}" text-anchor="middle" class="ein" font-size="{size}">{e(txt)}</text>')
    out.append('</svg>')
    return "".join(out)

def zeilen(n, h="9mm"):
    return '<div class="zeilen">' + "".join(f'<div class="zeile" style="height:{h}"></div>' for _ in range(n)) + "</div>"

def kasten(opts, richtig=None, loesung=False):
    li = []
    for i, o in enumerate(opts):
        ok = loesung and i == richtig
        li.append(f'<li class="{"ok" if ok else ""}"><span class="box">{"✔" if ok else ""}</span> {e(o)}</li>')
    return '<ul class="opts">' + "".join(li) + "</ul>"

# ---------- Teil A: Multiple Choice ----------
MC = [
 ("Die Hauptsilbe von „Ro-se“ ist offen. Der Vokal wird …", ["lang gelesen", "kurz gelesen", "gar nicht gelesen"], 0),
 ("Welches Wort gehört zu Baumuster 2?", ["Rose", "Pinsel", "gehen"], 1),
 ("Kel__er (der Vokal wird kurz gelesen) — was fehlt?", ["l", "ll", "lh"], 1),
 ("Welches Wort ist richtig geschrieben?", ["gukken", "gucken", "guken"], 1),
 ("Welches h steckt in „dre-hen“?", ["Dehnungs-h", "silbentrennendes h", "kein h"], 1),
 ("Welches Wort hat ein Dehnungs-h?", ["sehen", "Fehler", "drehen"], 1),
 ("Wie schreibt man ein langes i in einer offenen Silbe (lie-ben)?", ["i", "ie", "ii"], 1),
 ("Was ist ein Satzglied?", ["Ein Wort oder eine Wortgruppe, die beim Umstellen zusammenbleibt", "Immer genau ein Wort", "Nur das Verb"], 0),
 ("Was steht im Zentrum des Verbenfächers?", ["das Subjekt", "das konjugierte Verb", "das Nomen"], 1),
 ("Verschiebeprobe: „Wir warten an der Haltestelle auf den Bus.“ — Welcher Satz stimmt?", ["An der Haltestelle warten wir auf den Bus.", "An der Haltestelle wir warten auf den Bus.", "Wir an der Haltestelle warten auf den Bus."], 0),
 ("„Wir warten mit der Klasse an der Haltestelle auf den Bus.“ Welche Probe ist das?", ["Weglassprobe", "Erweiterungsprobe", "Ersatzprobe"], 1),
 ("hält oder hällt? Verlängere das Wort: hal-ten. Richtig ist …", ["hält", "hällt", "helt"], 0),
]

def seite_mc(loesung):
    items = []
    for i, (f, o, r) in enumerate(MC, 1):
        items.append(f'<div class="frage"><p><b>{i}.</b> {e(f)}</p>{kasten(o, r, loesung)}</div>')
    return "".join(items)

# ---------- Teil B: Baumuster ----------
B_WOERTER = ["Rose", "Pinsel", "Taube", "Keller", "drehen", "lieben"]
def seite_baumuster(loesung):
    rows = []
    for w in B_WOERTER:
        z, lang, bm = W[w]
        rows.append(
            f'<tr><td class="wort">{e(w)}</td><td>{modell(z, lang, leer=not loesung)}</td>'
            f'<td class="bm">Baumuster {"<b class=ok>%d</b>" % bm if loesung else "&nbsp;&nbsp;___"}<br>'
            f'Vokal: <span class="{"ok" if loesung and lang else ""}">☐ lang</span> '
            f'<span class="{"ok" if loesung and not lang else ""}">☐ kurz</span></td></tr>')
    sp = [("kippt", "kippen", "Baumuster 3", "kippt"), ("Hund", "Hunde", "Baumuster 2", "Hund"),
          ("Stück", "Stücke", "Baumuster 3 (ck)", "Stück"), ("Kuh", "Kühe", "Baumuster 4", "Kuh")]
    sprows = "".join(
        f'<tr><td class="wort">{e(a)}</td><td>→ verlängert: {"<b class=ok>%s</b>" % e(b) if loesung else "_______________"}</td>'
        f'<td>→ {"<b class=ok>%s</b>" % e(c) if loesung else "Baumuster ____"}</td></tr>' for a, b, c, _ in sp)
    return f'''
    <p class="aufgabe">B1. Trage jedes Wort ins Silbenmodell ein (ein Kästchen pro Buchstabe, bei <i>au</i>, <i>ie</i>, <i>dr</i> ein
    Kästchen für beide Buchstaben). Kreuze dann das Baumuster und den Vokal an.</p>
    <table class="bmt"><tbody>{"".join(rows)}</tbody></table>
    <p class="aufgabe">B2. Silbenprobe: Verlängere das einsilbige Wort und bestimme das Baumuster.</p>
    <table class="bmt"><tbody>{sprows}</tbody></table>
    <p class="aufgabe">B3. Erkläre mit eigenen Worten den Unterschied zwischen <b>Dehnungs-h</b> und <b>silbentrennendem h</b> und schreibe je ein Beispiel auf.</p>
    {"<p class='ok-text'>Dehnungs-h: am Ende der ersten Silbe, nur vor l, m, n, r (Feh-ler, woh-nen). Silbentrennendes h: am Anfang der zweiten Silbe, trennt zwei Vokale (ge-hen, dre-hen).</p>" if loesung else zeilen(3)}
    '''

# ---------- Teil C: Verbenfächer ----------
def seite_faecher(loesung):
    c1 = {"Wer? Was?": "Lena", "Wann?": "abends", "Wo?": "im Bett", "Wie?": "leise", "Wen? Was?": "ein Buch", "Womit?": ""}
    c2_gegeben = {"Wer? Was?": "die Kinder", "Wo?": "auf dem Pausenplatz"}
    c2_loesung = {"Wer? Was?": "die Kinder", "Wo?": "auf dem Pausenplatz", "Wann?": "heute", "Wie?": "laut", "Wen? Was?": "Fussball", "Womit?": "mit dem Ball"}
    c3 = {"Wer? Was?": "die Mutter", "Wen? Was?": "einen Kuchen", "Wann?": "am Sonntag", "Womit?": "mit Schokolade"}
    return f'''
    <p class="aufgabe">C1. Fülle den Verbenfächer aus. Schreibe das Verb in die Mitte und die Satzglieder in die Felder.
    Ein Feld bleibt leer — kreuze an, welches.<br>
    <i>Lena liest abends im Bett leise ein Buch.</i></p>
    {faecher("liest" if loesung else "", c1 if loesung else {})}
    <p class="klein">Leeres Feld: {"<b class=ok>Womit?</b>" if loesung else "☐ Wer? Was?  ☐ Wann?  ☐ Womit?  ☐ Wie?"}</p>
    <p class="aufgabe">C2. Ergänze den Verbenfächer mit eigenen Ideen und schreibe den ganzen Satz auf.</p>
    {faecher("spielen", c2_loesung if loesung else c2_gegeben)}
    {"<p class='ok-text'>Beispiel: Die Kinder spielen heute laut Fussball mit dem Ball auf dem Pausenplatz.</p>" if loesung else zeilen(2)}
    <p class="aufgabe">C3. Bilde mit dem Verbenfächer einen Satz. Bilde danach einen zweiten Satz, der mit „Am Sonntag“ beginnt.</p>
    {faecher("backt", c3)}
    {"<p class='ok-text'>Die Mutter backt am Sonntag mit Schokolade einen Kuchen. — Am Sonntag backt die Mutter mit Schokolade einen Kuchen.</p>" if loesung else zeilen(3)}
    '''

# ---------- Teil D: Satzproben ----------
def seite_proben(loesung):
    def zl(text, n=1):
        return f"<p class='ok-text'>{text}</p>" if loesung else zeilen(n, "8mm")
    return f'''
    <p class="aufgabe">D1. Trenne die Satzglieder mit senkrechten Strichen.<br><i>Wir warten an der Haltestelle auf den Bus.</i></p>
    {zl("Wir | warten | an der Haltestelle | auf den Bus.")}
    <p class="aufgabe">D2. Wende die vier Satzproben auf den Satz an.</p>
    <div class="probe"><b>Verschiebeprobe</b> (stelle um)</div>{zl("An der Haltestelle warten wir auf den Bus.")}
    <div class="probe"><b>Weglassprobe</b> (streiche ein Satzglied)</div>{zl("Wir warten an der Haltestelle.")}
    <div class="probe"><b>Erweiterungsprobe</b> (ergänze Wörter)</div>{zl("Wir warten mit der Klasse an der Haltestelle auf den Bus.")}
    <div class="probe"><b>Ersatzprobe</b> (ersetze ein Satzglied)</div>{zl("Wir warten gemeinsam auf den Bus.")}
    <p class="aufgabe">D3. Erkläre mit eigenen Worten: Was ist ein Satzglied? Woran erkennst du es bei den Satzproben?</p>
    {zl("Ein Satzglied ist ein Wort oder eine Wortgruppe. Satzglieder bleiben beim Verändern des Satzes (Satzproben) immer zusammen.", 3)}
    '''

# ---------- Erklärseite ----------
def erklaerung():
    bm = [
     (1, "Rose", "Die Hauptsilbe ist <b>offen</b>. Sie endet mit einem Vokal oder Diphthong (au, ei, eu). Der Vokal wird <b>lang</b> gelesen. Langes i: <b>ie</b> (lie-ben)."),
     (2, "Pinsel", "Die Hauptsilbe ist <b>geschlossen</b>. Sie endet mit einem Konsonanten. Der Vokal wird <b>kurz</b> gelesen. Kurzes i: <b>i</b> (Pin-sel)."),
     (3, "Keller", "Der Vokal soll kurz gelesen werden, deshalb braucht es <b>zwei Konsonanten</b>. k und z werden nicht verdoppelt: <b>gucken</b> (nicht gukken), <b>sitzen</b> (nicht sizzen)."),
     (4, "drehen", "Das <b>silbentrennende h</b> trennt die Vokale der beiden Silben. Es steht am Anfang der zweiten Silbe: dre-<b>h</b>en (nicht dre-en)."),
    ]
    boxes = "".join(
        f'<div class="bmk"><h3>Baumuster {n}</h3>{modell(W[w][0], W[w][1])}<div class="wortname">{w}</div><p>{t}</p></div>' for n, w, t in bm)
    return f'''
    <div class="legende"><span class="sw lang"></span> Vokal lang <span class="sw kurz"></span> Vokal kurz <span class="sw nebe"></span> e der Nebensilbe</div>
    <div class="bmgrid">{boxes}</div>
    <div class="regeln">
      <p><b>Dehnungs-h:</b> verlängert die offene Hauptsilbe. Es steht nur vor <b>l, m, n</b> oder <b>r</b>: Feh-ler, zah-me, woh-nen, Oh-ren.</p>
      <p><b>Doppelvokale:</b> In wenigen Wörtern verlängert derselbe Vokal die Hauptsilbe: <b>aa, ee, oo</b> (Haare, leeren, Boote).</p>
      <p><b>Silbenprobe:</b> Verlängere ein einsilbiges Wort (kippt → kippen), trage es ins Silbenmodell ein und entscheide.</p>
      <p><b>Satzglieder</b> sind Wörter oder Wortgruppen, die beim Verändern des Satzes zusammenbleiben. Im Zentrum des <b>Verbenfächers</b> steht das konjugierte Verb; die W-Fragen (Wer? Was? Wo? Wann? Womit? Wie? Wen?) helfen, die Satzglieder zu finden.</p>
      <p><b>Satzproben:</b> Verschiebeprobe, Weglassprobe, Erweiterungsprobe, Ersatzprobe.</p>
    </div>'''

def kopf(titel, loesung):
    return f'''<div class="kopf"><div><h1>{titel}</h1><div class="sub">Baumuster und Satzglieder · 6. Klasse · Prüfung 26.10.2026</div></div>
    <div class="name">{"Lösungen" if loesung else "Name: ____________________<br>Datum: ____________  Punkte: ____ / 40"}</div></div>'''

CSS = '''
@page { size: A4; margin: 12mm 14mm; }
* { box-sizing: border-box; }
body { font-family: "Nunito", "Segoe UI", Arial, sans-serif; font-size: 11pt; line-height: 1.35; color: #222; margin: 0;
       -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.seite { page-break-after: always; break-after: page; padding: 0; }
.seite:last-child { page-break-after: auto; break-after: auto; }
.kopf { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #4b3a9e; padding-bottom: 5px; margin-bottom: 8px; }
h1 { font-size: 20pt; margin: 0; color: #4b3a9e; }
h2 { font-size: 14pt; margin: 6px 0 6px; color: #4b3a9e; background: #ece8fb; padding: 3px 9px; border-radius: 6px; }
h3 { font-size: 11pt; margin: 0 0 4px; color: #4b3a9e; }
.sub { color: #666; font-size: 10pt; } .name { text-align: right; font-size: 10.5pt; line-height: 1.7; }
.modell { display: inline-flex; gap: 6px; vertical-align: middle; }
.silbe { display: inline-flex; } .silbe.haupt { outline: 2px solid #777; outline-offset: -1px; border-radius: 3px; }
.k { width: 9mm; height: 10mm; border: 1px solid #aaa; margin-left: -1px; display: inline-grid; place-items: center; font-size: 14pt; font-weight: 700; background: #fff; }
.k.lang { background: #d6ebfb; color: #1d5f93; } .k.kurz { background: #f9d9cf; color: #a3402a; } .k.nebe { background: #fdf0d3; color: #8a6410; }
.legende { font-size: 9.5pt; color: #555; margin-bottom: 5px; } .sw { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin: 0 3px 0 10px; }
.sw.lang { background: #d6ebfb; } .sw.kurz { background: #f9d9cf; } .sw.nebe { background: #fdf0d3; }
.bmgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.bmk { border: 1.5px solid #cfc8f0; border-radius: 10px; padding: 7px 9px; background: #faf9ff; break-inside: avoid; }
.bmk p { margin: 5px 0 0; font-size: 10pt; } .wortname { font-weight: 700; margin-top: 2px; }
.regeln { margin-top: 8px; border: 2px dashed #4b3a9e; border-radius: 10px; padding: 4px 10px; } .regeln p { margin: 5px 0; font-size: 10.5pt; }
.frage { break-inside: avoid; margin-bottom: 6px; } .frage p { margin: 0 0 3px; }
.opts { list-style: none; margin: 0 0 0 16px; padding: 0; display: flex; flex-wrap: wrap; gap: 2px 18px; } .opts li { margin: 1px 0; }
.box { display: inline-block; width: 4.2mm; height: 4.2mm; border: 1.4px solid #444; border-radius: 2px; vertical-align: -1px; margin-right: 5px; font-size: 9pt; line-height: 4mm; text-align: center; color: #1a7a3d; font-weight: 700; }
.ok { color: #1a7a3d; font-weight: 700; } .ok-text { color: #1a7a3d; font-style: italic; margin: 3px 0 6px 6px; }
.aufgabe { margin: 10px 0 4px; font-weight: 700; } .aufgabe i { font-weight: 400; }
.bmt { width: 100%; border-collapse: collapse; } .bmt td { padding: 5px 6px; border-bottom: 1px solid #ddd; vertical-align: middle; }
.bmt .wort { font-weight: 700; font-size: 13pt; width: 28mm; } .bmt .bm { font-size: 10pt; }
.zeilen { margin: 2px 0 6px; } .zeile { border-bottom: 1px solid #999; }
.faecher { width: 100%; max-width: 96mm; display: block; margin: 2px auto; }
.faecher .feld { fill: #fff; stroke: #4b3a9e; stroke-width: 2; stroke-dasharray: 5 4; } .faecher .mitte { fill: #ece8fb; stroke: #4b3a9e; stroke-width: 2; }
.faecher .strahl { stroke: #999; stroke-width: 1.6; } .faecher .frage { fill: #4b3a9e; font-weight: 700; } .faecher .ein { fill: #1a7a3d; font-weight: 700; font-family: "Comic Sans MS", "Segoe Print", cursive, sans-serif; }
.klein { font-size: 10pt; margin: 2px 0; } .probe { margin-top: 6px; }
.loesung { display: none; }
body.nur-loesung .test { display: none; } body.nur-loesung .loesung { display: block; }
.druckleiste { position: sticky; top: 0; background: #402900; color: #ffe3b3; padding: 8px 12px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; font-size: 14px; }
.druckleiste button, .druckleiste a { font: inherit; font-weight: 700; border: none; border-radius: 999px; padding: 6px 14px; background: #ffe3b3; color: #402900; cursor: pointer; text-decoration: none; }
@media print { .druckleiste { display: none; } .seite { height: 270mm; overflow: hidden; } }
@media screen { .seite { max-width: 190mm; margin: 12px auto; padding: 10mm; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,.15); } body { background: #eee; } }
'''

def bauen(loesung):
    cls = "loesung" if loesung else "test"
    t = "Lösungen: Deutsch-Test" if loesung else "Deutsch-Test"
    s = []
    if not loesung:
        s.append(f'<section class="seite">{kopf(t, False)}<h2>Das musst du wissen</h2>{erklaerung()}</section>')
    s.append(f'<section class="seite">{kopf(t, loesung)}<h2>A · Multiple Choice</h2><p class="klein">Kreuze die richtige Antwort an (nur eine).</p>{seite_mc(loesung)}</section>')
    s.append(f'<section class="seite">{kopf(t, loesung)}<h2>B · Baumuster ausführen</h2>{seite_baumuster(loesung)}</section>')
    s.append(f'<section class="seite">{kopf(t, loesung)}<h2>C · Mit dem Verbenfächer arbeiten</h2>{seite_faecher(loesung)}</section>')
    s.append(f'<section class="seite">{kopf(t, loesung)}<h2>D · Satzglieder und Satzproben</h2>{seite_proben(loesung)}</section>')
    return f'<div class="{cls}">' + "".join(s) + "</div>"

HTML = f'''<!DOCTYPE html>
<html lang="de-CH"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Deutsch-Test Prüfung 26.10.</title><style>{CSS}</style></head>
<body>
<div class="druckleiste"><a href="index.html">← Deutsch</a><button onclick="document.body.classList.remove('nur-loesung')">📝 Test</button>
<button onclick="document.body.classList.add('nur-loesung')">✅ Lösungen</button><button onclick="window.print()">🖨️ Drucken / PDF speichern</button></div>
{bauen(False)}{bauen(True)}
</body></html>'''
OUT.write_text(HTML, encoding="utf8")
print("geschrieben:", OUT)
