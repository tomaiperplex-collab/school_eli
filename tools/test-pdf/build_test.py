#!/usr/bin/env python3
"""Erzeugt deutsch/lernmaterial-pruefung-26-10.html: Lernziele, Merkblatt und
Kurztests (Wortstrukturen und Sätze, je Version A und B) im Stil der
Kurztests der Schule. Danach render_pdf.js ausführen:

    python3 tools/test-pdf/build_test.py
    NODE_PATH=$(npm root -g) node tools/test-pdf/render_pdf.js

Das Skript schreibt ausserdem die Lösungen (nur im PDF «…-loesungen.pdf» sichtbar).
"""
import html, pathlib

OUT = pathlib.Path(__file__).resolve().parents[2] / "deutsch" / "lernmaterial-pruefung-26-10.html"
def e(s): return html.escape(s)

# ---------------- Bausteine ----------------
def modell(zellen=None, lang=None, leer=True):
    z = zellen or [""] * 6
    def k(i):
        b = z[i]; cls = "k"
        if b and not leer:
            if i == 1: cls += " lang" if lang else " kurz"
            elif i == 4: cls += " nebe"
        return f'<span class="{cls}">{e(b) if not leer else ""}</span>'
    return ('<span class="modell"><span class="silbe haupt">%s</span><span class="silbe">%s</span></span>'
            % ("".join(k(i) for i in range(3)), "".join(k(i) for i in range(3, 6))))

def bogen(silben):
    """Wort mit Silbenbögen (Lösung): Silben als Liste."""
    return '<span class="bogenwort">' + "".join(f'<span class="bogen">{e(s)}</span>' for s in silben) + "</span>"

def zeilen(n, h="8.2mm"):
    return '<div class="zeilen">' + "".join(f'<div class="zeile" style="height:{h}"></div>' for _ in range(n)) + "</div>"

FRAGEN_STANDARD = ["Wer? Was?", "Wo?", "Wann?", "Womit?", "Wie?", "Wen? Was?"]
def faecher(verb, inhalt, fragen=None):
    f = fragen or FRAGEN_STANDARD
    boxes = [(20,20,170,f[0]),(370,20,170,f[1]),(4,113,150,f[2]),(406,113,150,f[3]),(20,214,170,f[4]),(370,214,170,f[5])]
    cx, cy = 280, 135
    o = ['<svg class="faecher" viewBox="0 0 560 270" role="img">']
    for (x, y, w, f) in boxes:
        o.append(f'<line x1="{cx}" y1="{cy}" x2="{x+w/2}" y2="{y+20}" class="strahl"/>')
    o.append(f'<circle cx="{cx}" cy="{cy}" r="52" class="mitte"/><text x="{cx}" y="{cy-22}" text-anchor="middle" font-size="16">♛</text>')
    if verb: o.append(f'<text x="{cx}" y="{cy+6}" text-anchor="middle" class="ein" style="font-size:19px">{e(verb)}</text>')
    for (x, y, w, f) in boxes:
        t = inhalt.get(f, "")
        o.append(f'<rect x="{x}" y="{y}" width="{w}" height="40" rx="12" class="feld"/><text x="{x+w/2}" y="{y-4}" text-anchor="middle" class="frage" font-size="13">{e(f)}</text>')
        if t: o.append(f'<text x="{x+w/2}" y="{y+25}" text-anchor="middle" class="ein" style="font-size:{14 if len(t)<=14 else 12 if len(t)<=19 else 10.5 if len(t)<=22 else 9}px">{e(t)}</text>')
    o.append("</svg>")
    return "".join(o)

W = {  # Wort: (Zellen, Vokal lang?, Baumuster, Silben)
 "Rose": (["R","o","","s","e",""], True, 1, ["Ro","se"]), "Taube": (["T","au","","b","e",""], True, 1, ["Tau","be"]),
 "Hase": (["H","a","","s","e",""], True, 1, ["Ha","se"]), "Wagen": (["W","a","","g","e","n"], True, 1, ["Wa","gen"]),
 "Pinsel": (["P","i","n","s","e","l"], False, 2, ["Pin","sel"]), "Wolke": (["W","o","l","k","e",""], False, 2, ["Wol","ke"]),
 "Winter": (["W","i","n","t","e","r"], False, 2, ["Win","ter"]), "Kinder": (["K","i","n","d","e","r"], False, 2, ["Kin","der"]),
 "Keller": (["K","e","l","l","e","r"], False, 3, ["Kel","ler"]), "Sommer": (["S","o","m","m","e","r"], False, 3, ["Som","mer"]),
 "Puppe": (["P","u","p","p","e",""], False, 3, ["Pup","pe"]), "Katze": (["K","a","t","z","e",""], False, 3, ["Kat","ze"]),
 "sehen": (["s","e","","h","e","n"], True, 4, ["se","hen"]), "drehen": (["dr","e","","h","e","n"], True, 4, ["dre","hen"]),
 "nähen": (["n","ä","","h","e","n"], True, 4, ["nä","hen"]), "lieben": (["l","ie","","b","e","n"], True, 1, ["lie","ben"]),
 "blitzen": (None, None, 3, ["blit","zen"]),
 "Bären": (["B","ä","","r","e","n"], True, 1, ["Bä","ren"]), "Hafen": (["H","a","","f","e","n"], True, 1, ["Ha","fen"]),
 "Löwe": (["L","ö","","w","e",""], True, 1, ["Lö","we"]), "Lauben": (["L","au","","b","e","n"], True, 1, ["Lau","ben"]),
 "Gerber": (["G","e","r","b","e","r"], False, 2, ["Ger","ber"]), "Gasse": (["G","a","s","s","e",""], False, 3, ["Gas","se"]),
 "Ritter": (["R","i","t","t","e","r"], False, 3, ["Rit","ter"]), "Glocke": (None, None, 3, ["Glo","cke"]),
 "Brunnen": (None, None, 3, ["Brun","nen"]), "Münster": (None, None, 2, ["Müns","ter"]),
}
BM_BEISPIEL = {1: "Rose", 2: "Pinsel", 3: "Keller", 4: "drehen"}

EIGENE_WORTE = 'Satzglieder sind die Bausteine eines Satzes. Ein Satzglied kann ein einzelnes Wort sein oder mehrere Wörter, die zusammengehören. Wenn man den Satz umstellt, bleiben diese Wörter immer zusammen. Beispiel: Lena | kauft | gestern | im Laden | ein Buch. „im Laden“ sind zwei Wörter, aber nur ein Satzglied, weil sie beim Umstellen zusammenbleiben: Im Laden kauft Lena gestern ein Buch.'

# ---------------- Kurztests ----------------
BM_ERKL = {
 1: ("Die Hauptsilbe ist offen: Sie endet mit einem Vokal oder Diphthong (z. B. au). Der Vokal wird lang gelesen. Ein langes i schreibt man ie. Beispiel: Ro-se, Tau-be, lie-ben."),
 2: ("Die Hauptsilbe ist geschlossen: Sie endet mit einem Konsonanten. Der Vokal wird kurz gelesen. Beispiel: Pin-sel, Wol-ke."),
 3: ("Der Vokal der Hauptsilbe soll kurz gelesen werden. Deshalb braucht es zwei Konsonanten. Die Konsonanten k und z werden nicht verdoppelt: gucken anstatt gukken, sitzen anstatt sizzen. Beispiel: Kel-ler."),
 4: ("Das silbentrennende h trennt die Vokale der beiden Silben. Es steht am Anfang der zweiten Silbe: dre-hen anstatt dre-en. Beispiel: dre-hen, se-hen."),
}
KT_W = {
 "A": {"bm": 3,
       "woerter": ["Rose", "Pinsel", "Taube", "Keller", "sehen", "Wolke", "Sommer", "lieben"],
       "saetze": [
         ("Wir <u>sehen/seen</u> am Himmel eine <u>Wolke/Wolcke</u>.", [("sehen", ["se","hen"], 4), ("Wolke", ["Wol","ke"], 2)]),
         ("Der Hund <u>rent/rennt</u> über die <u>Wiese/Wise</u>.", [("rennt", ["ren","nen"], 3), ("Wiese", ["Wie","se"], 1)]),
       ]},
 "B": {"bm": 4,
       "woerter": ["Hase", "Wagen", "Winter", "Puppe", "nähen", "Katze", "Kinder", "drehen"],
       "saetze": [
         ("Mein Bruder <u>geht/get</u> jeden Tag zur <u>Schule/Schuhle</u>.", [("geht", ["ge","hen"], 4), ("Schule", ["Schu","le"], 1)]),
         ("Die <u>Mutter/Muter</u> <u>kippt/kipt</u> die Milch ins Glas.", [("Mutter", ["Mut","ter"], 3), ("kippt", ["kip","pen"], 3)]),
       ]},
}
KT_S = {
 "A": {"erkl": "Erkläre mit eigenen Worten, was Satzglieder sind. Mache dazu ein Beispiel.",
       "trenne": ["Die Kinder spielen heute auf dem Pausenplatz.", "Am Sonntag backt die Mutter einen Kuchen.", "Der Hund frisst im Garten einen Knochen."],
       "trenne_l": ["Die Kinder | spielen | heute | auf dem Pausenplatz.", "Am Sonntag | backt | die Mutter | einen Kuchen.", "Der Hund | frisst | im Garten | einen Knochen."],
       "fan_satz": "Lena liest abends im Bett leise ein Buch.", "fan_verb": "liest",
       "fan": {"Wer? Was?": "Lena", "Wann?": "abends", "Wo?": "im Bett", "Wie?": "leise", "Wen? Was?": "ein Buch"},
       "fan_modus": "leer",
       "probe_satz": "Wir warten an der Haltestelle auf den Bus.",
       "probe_l": ["An der Haltestelle warten wir auf den Bus.", "Wir warten an der Haltestelle.", "Wir warten mit der Klasse an der Haltestelle auf den Bus.", "Wir warten gemeinsam auf den Bus."]},
 "B": {"erkl": "Woran erkennst du ein Satzglied? Erkläre mit eigenen Worten und mache ein Beispiel mit der Verschiebeprobe.",
       "trenne": ["Meine Oma spricht am Morgen mit dem Briefträger.", "Heute backt die Mutter einen Kuchen.", "Die Taube pickt abends kleine Körner."],
       "trenne_l": ["Meine Oma | spricht | am Morgen | mit dem Briefträger.", "Heute | backt | die Mutter | einen Kuchen.", "Die Taube | pickt | abends | kleine Körner."],
       "fan_satz": "Ergänze die leeren Felder mit eigenen Ideen und schreibe den ganzen Satz auf.", "fan_verb": "spielen",
       "fan": {"Wer? Was?": "die Kinder", "Wo?": "auf dem Pausenplatz"},
       "fan_loesung": {"Wer? Was?": "die Kinder", "Wo?": "auf dem Pausenplatz", "Wann?": "heute", "Wie?": "laut", "Wen? Was?": "Fussball", "Womit?": "mit dem Ball"},
       "fan_modus": "ergaenzen",
       "probe_satz": "Die Taube pickt abends kleine Körner am Boden.",
       "probe_l": ["Abends pickt die Taube kleine Körner am Boden.", "Die Taube pickt kleine Körner am Boden.", "Die graue Taube pickt abends kleine Körner mit ihrem Schnabel am Boden.", "Sie pickt abends kleine Körner am Boden."]},
}

def kopf(titel):
    return f'<div class="kt-kopf"><span>Name: <i class="lin" style="width:62mm"></i></span><span>Datum: <i class="lin" style="width:34mm"></i></span></div><h1 class="kt-titel">{titel}</h1>'

def punkte(n, wert=""):
    return f'<div class="pkt">{wert or "____"} / {n}</div>'

def fuss(gesamt=16):
    return f'<div class="fussbox"><div class="unterschrift">Unterschrift Eltern:<div class="lin2"></div></div><div class="erreicht">Erreichte Punktzahl:<b>____ / {gesamt}</b></div><div class="note">Note:<b>&nbsp;</b></div></div>'

def vorlagen(l, bsp=None):
    bsp = bsp or BM_BEISPIEL
    rows = []
    for n in (1, 2, 3, 4):
        w = bsp[n]
        inh = modell(W[w][0], W[w][1], leer=not l) if l else modell()
        rows.append(f'<div class="vz"><div class="vz-kopf">Baumuster {n}</div><div class="vz-box">{inh}</div></div>')
    return '<div class="vzgrid">' + "".join(rows) + "</div>"

def kt_wort(v, l):
    d = KT_W[v]
    # 1
    a1 = f'<p class="aufg"><b>1.</b> Erkläre, wie die Wörter des Baumuster {d["bm"]} gebildet werden. Mache dazu ein Beispiel.</p>'
    a1 += f'<div class="loesungstext">{e(BM_ERKL[d["bm"]])}</div>' if l else zeilen(6)
    a1 += punkte(4)
    # 2
    cells = []
    for w in d["woerter"]:
        cells.append(f'<div class="bw">{bogen(W[w][3]) if l else e(w)}{"" if not l else ""}</div>')
    a2 = '<p class="aufg"><b>2.</b> Zeichne die Silbenbögen ein.</p><div class="bwgrid">' + "".join(cells) + "</div>" + punkte(2)
    # 3
    a3 = '<p class="aufg"><b>3.</b> Entscheide welche Schreibweise richtig ist. Schreibe das korrekte Wort mit Silbenbögen auf. Zu welchem Baumuster gehört das Wort? Schreibe auf.</p>'
    for satz, items in d["saetze"]:
        a3 += f'<p class="satz">{satz}</p>'
        for wort, silben, bm in items:
            if l:
                a3 += f'<div class="zl">{bogen(silben)} <span class="bmn">Baumuster {bm}</span> <span class="hint">{e("→ " + wort) if wort != "".join(silben) else ""}</span></div>'
            else:
                a3 += '<div class="zl"></div>'
    a3 += punkte(6)
    # 4
    a4 = '<p class="aufg"><b>4.</b> Mache zu jedem Baumuster ein Beispiel und schreibe das Wort korrekt in die Vorlagen.</p>' + vorlagen(l)
    if l: a4 += '<p class="hint2">Beispiele (andere Wörter sind möglich): Rose · Pinsel · Keller · drehen</p>'
    a4 += punkte(4)
    return (f'<section class="seite kt"><div class="rahmen">{kopf("Kurztest – Wortstrukturen " + v)}{a1}{a2}{a3}</div></section>'
            f'<section class="seite kt"><div class="rahmen">{a4}{fuss()}</div></section>')

def kt_saetze(v, l):
    d = KT_S[v]
    a1 = f'<p class="aufg"><b>1.</b> {e(d["erkl"])}</p>'
    a1 += f'<div class="loesungstext">{e(EIGENE_WORTE)}</div>' if l else zeilen(5)
    a1 += punkte(4)
    a2 = '<p class="aufg"><b>2.</b> Trenne die Satzglieder mit senkrechten Strichen.</p>'
    for s, ls in zip(d["trenne"], d["trenne_l"]):
        a2 += f'<p class="satz">{e(s)}</p>' + (f'<div class="zl"><span class="ein">{e(ls)}</span></div>' if l else '<div class="zl"></div>')
    a2 += punkte(3)
    if d["fan_modus"] == "leer":
        a3 = f'<p class="aufg"><b>3.</b> Fülle den Verbenfächer aus. Schreibe das Verb in die Mitte und die Satzglieder in die Felder.<br><i>{e(d["fan_satz"])}</i></p>'
        a3 += faecher(d["fan_verb"] if l else "", d["fan"] if l else {})
        a3 += '<p class="klein">Leeres Feld: ' + ('<b class="ok">Womit?</b>' if l else "____________") + "</p>"
    else:
        a3 = f'<p class="aufg"><b>3.</b> {e(d["fan_satz"])}</p>'
        a3 += faecher(d["fan_verb"], d["fan_loesung"] if l else d["fan"])
        a3 += (f'<div class="loesungstext">Beispiel: Die Kinder spielen heute laut Fussball mit dem Ball auf dem Pausenplatz.</div>' if l else zeilen(2))
    a3 += punkte(5)
    a4 = f'<p class="aufg"><b>4.</b> Wende die vier Satzproben auf den Satz an.<br><i>{e(d["probe_satz"])}</i></p>'
    for name, hint, lo in zip(["Verschiebeprobe", "Weglassprobe", "Erweiterungsprobe", "Ersatzprobe"],
                              ["(stelle um)", "(streiche ein Satzglied)", "(ergänze Wörter)", "(ersetze ein Satzglied)"], d["probe_l"]):
        a4 += f'<p class="probe"><b>{name}</b> {hint}</p>' + (f'<div class="zl"><span class="ein">{e(lo)}</span></div>' if l else '<div class="zl"></div>')
    a4 += punkte(4)
    return (f'<section class="seite kt"><div class="rahmen">{kopf("Kurztest – Sätze " + v)}{a1}{a2}</div></section>'
            f'<section class="seite kt"><div class="rahmen">{a3}{a4}{fuss()}</div></section>')


# ---------------- Satzpuzzle (Übungsblatt) ----------------
def karten_spalten(spalten):
    return f'<div class="kspalten" style="--n:{len(spalten)}">' + "".join('<div class="kspalte">' + "".join(f'<div class="kk">{e(t)}</div>' for t in sp) + "</div>" for sp in spalten) + "</div>"

def seite_puzzle(l):
    s1 = [["auf", "schnell", "in der Nacht", "am Himmelszelt", "geht"], ["das Elektroauto", "im Osten", "am Morgen", "fährt", "um die Kurve"], ["am Nachmittag", "scheint", "hell", "die Sonne", "der Mond"]]
    s3 = [["ein Gespenst", "sass", "auf dem Estrich", "am Geburtstag"], ["in einer Kiste", "allein", "Ramos", "versteckte"], ["Tila", "suchte", "am Abend", "mit einer Taschenlampe"], ["nach einem Buch", "im Schrank", "eine halbe Stunde", "eine geheimnisvolle Kiste"]]
    def zl(txts, n):
        return "".join(f'<div class="zl"><span class="ein">{e(t)}</span></div>' for t in txts) if l else zeilen(n)
    p1 = f'''<section class="seite kt"><div class="rahmen">{kopf("Übungsblatt – Satzpuzzle")}
    <p class="aufg"><b>1.</b> Bilde mit den Satzgliedern drei korrekte Sätze. Verwende alle Satzglieder einmal.</p>
    <p class="klein"><b>a)</b> Markiere mit gleicher Farbe alle Satzglieder, die einen Satz bilden.</p>{karten_spalten(s1)}
    <p class="klein"><b>b)</b> Schreibe die Sätze auf.</p>
    {zl(["In der Nacht geht der Mond am Himmelszelt schnell auf.", "Das Elektroauto fährt am Morgen im Osten um die Kurve.", "Am Nachmittag scheint die Sonne hell."], 6)}
    {punkte(3)}
    <p class="klein"><b>c)</b> Führe mit jedem Satz die Verschiebeprobe durch.</p>
    {zl(["Der Mond geht in der Nacht am Himmelszelt schnell auf.", "Am Morgen fährt das Elektroauto im Osten um die Kurve.", "Die Sonne scheint am Nachmittag hell."], 6)}
    {punkte(3)}</div></section>'''
    p2 = f'''<section class="seite kt"><div class="rahmen">
    <p class="aufg"><b>2.</b> Bilde drei neue Sätze. Jeder Satz enthält ein Satzglied aus einem Satz der Aufgabe 1b.</p>
    {zl(["Am Abend ist der Mond sehr hell.", "Es hat einen Berg im Osten.", "Die Sonne ist heute sehr heiss."], 3)}{punkte(3)}
    <p class="aufg"><b>3.</b> Bilde mit den Satzgliedern korrekte Sätze (Verb an 2. Stelle!). Schreibe sie auf.</p>{karten_spalten(s3)}
    {zl(["Tila suchte am Abend mit einer Taschenlampe nach einem Buch im Schrank.", "Ramos versteckte am Geburtstag eine geheimnisvolle Kiste.", "Ein Gespenst sass eine halbe Stunde allein in einer Kiste auf dem Estrich."], 6)}{punkte(3)}
    {fuss(12)}</div></section>'''
    return p1 + p2


# ---------------- Übungsblatt: Verbenfächer und Satzproben (Lehrmittel-Aufgaben) ----------------
def seite_uebung(l):
    def zl(txts, n):
        return "".join(f'<div class="zl"><span class="ein">{e(t)}</span></div>' for t in txts) if l else zeilen(n)
    treppe = lambda n, txts: ("".join(f'<div class="zl"><span class="ein">{e(t)}</span></div>' for t in txts) if l else "".join(f'<div class="zeile" style="height:8.2mm;width:{100-(n-1-i)*18}%"></div>' for i in range(n)))
    bezahlt_f = ["Wer? Was?", "Wofür?", "Wie?", "Wo?", "Wen? Was?", "Womit?"]
    p1 = f'''<section class="seite kt"><div class="rahmen">{kopf("Übungsblatt – Verbenfächer")}
    <p class="aufg"><b>1.</b> Schreibe die Satzglieder zu den entsprechenden Fragen im Verbenfächer hin.</p>
    <p class="satz kk-reihe">mit der Karte &nbsp;·&nbsp; im Gemüseladen &nbsp;·&nbsp; schnell &nbsp;·&nbsp; den Apfel &nbsp;·&nbsp; für die Pause</p>
    {faecher("bezahlt", {"Wer? Was?": "Lisa", "Wofür?": "für die Pause", "Wie?": "schnell", "Wo?": "im Gemüseladen", "Wen? Was?": "den Apfel", "Womit?": "mit der Karte"} if l else {"Wer? Was?": "Lisa"}, bezahlt_f)}
    <p class="aufg"><b>2.</b> Bilde mit den Satzgliedern einen korrekten Satz.</p>
    {zl(["Lisa bezahlt im Gemüseladen schnell den Apfel mit der Karte für die Pause."], 3)}
    <p class="aufg"><b>3.</b> Verschiebe die Satzglieder und bilde einen weiteren korrekten Satz.</p>
    {zl(["Im Gemüseladen bezahlt Lisa schnell den Apfel mit der Karte für die Pause."], 3)}
    <p class="aufg"><b>4.</b> Fülle einen eigenen Verbenfächer aus. Schreibe eines der Verben in die Mitte: <i>werfen, kommen, stehen, tanzen, befehlen</i>.</p>
    {faecher("tanzen" if l else "", {"Wer? Was?": "die Kinder", "Wo?": "im Garten", "Wann?": "am Abend", "Womit?": "mit Musik", "Wie?": "fröhlich"} if l else {})}
    <p class="aufg"><b>5.</b> Bilde mit den Satzgliedern aus deinem Verbenfächer zwei korrekte Sätze.</p>
    {zl(["Die Kinder tanzen am Abend fröhlich mit Musik im Garten.", "Im Garten tanzen die Kinder am Abend fröhlich mit Musik."], 4)}
    </div></section>'''
    p2 = f'''<section class="seite kt"><div class="rahmen">{kopf("Übungsblatt – Satzproben")}
    <p class="aufg"><b>Verschiebeprobe 1.</b> Bilde mit den Satzgliedern einen korrekten Satz und schreibe ihn auf.</p>
    <p class="satz kk-reihe">das alte Fahrrad &nbsp;·&nbsp; seit Jahren &nbsp;·&nbsp; im Schuppen &nbsp;·&nbsp; rostet</p>
    {zl(["Das alte Fahrrad rostet seit Jahren im Schuppen."], 2)}
    <p class="klein"><b>b)</b> Verschiebe die Satzglieder im Satz. Bilde verschiedene korrekte Sätze und schreibe sie auf.</p>
    {zl(["Seit Jahren rostet das alte Fahrrad im Schuppen.", "Im Schuppen rostet das alte Fahrrad seit Jahren."], 4)}
    <p class="aufg"><b>2.</b> Verschiebe die Satzglieder. Schreibe die Sätze auf.<br><i>Im Herbst wird es am Abend wieder früher dunkel.</i></p>
    {zl(["Am Abend wird es im Herbst wieder früher dunkel.", "Wieder früher wird es im Herbst am Abend dunkel."], 3)}
    <p class="aufg"><b>3.</b> Lies die drei Sätze. Wie wirkt der Satz nach dem Verschieben?<br>
    <i>Ich kenne deine Wünsche schon lange. · Schon lange kenne ich deine Wünsche. · Deine Wünsche kenne ich schon lange.</i></p>
    {zl(["Durch das Verschieben von Satzgliedern verändert sich die Wirkung des Satzes: Was vorne steht, wird betont."], 3)}
    <p class="aufg"><b>Weglassprobe 4.</b> Lasse bei diesem Satz immer ein Satzglied mehr weg.<br><i>Die Kinder freuen sich am Abend auf das Spielen im Garten.</i></p>
    {treppe(3, ["Die Kinder freuen sich am Abend auf das Spielen.", "Die Kinder freuen sich auf das Spielen.", "Die Kinder freuen sich."])}
    <p class="aufg"><b>5.</b> Schreibe einen eigenen Satz auf. Lasse Satzglieder schrittweise weg.</p>
    {treppe(4, ["Die Athletin rennt im Training jeden Tag.", "Die Athletin rennt im Training.", "Die Athletin rennt."])}
    </div></section>'''
    p3 = f'''<section class="seite kt"><div class="rahmen">{kopf("Übungsblatt – Satzproben")}
    <p class="aufg"><b>Erweiterungsprobe 6.</b> Erweitere den Satz immer mit einem zusätzlichen Satzglied.<br><i>Die Ärztin kommt.</i></p>
    {treppe(4, ["Die Ärztin kommt heute.", "Die Ärztin kommt heute mit dem Auto.", "Die Ärztin kommt heute mit dem Auto zu uns."])}
    <p class="aufg"><b>7.</b> Schreibe einen eigenen Satz auf. Erweitere ihn schrittweise mit zusätzlichen Satzgliedern.</p>
    {treppe(4, ["Romano fährt.", "Romano fährt schnell.", "Romano fährt schnell mit dem Skateboard.", "Romano fährt schnell mit dem Skateboard über die Stufe."])}
    <p class="aufg"><b>Ersatzprobe 8.</b> Ersetze die markierten Satzglieder durch andere Satzglieder.</p>
    <p class="satz">Im Sommer <mark>geht</mark> der Fischer mit dem Boot auf den See hinaus.</p>{zl(["Im Sommer fährt der Fischer mit dem Boot auf den See hinaus."], 1)}
    <p class="satz">Ich schreibe <mark>dir</mark> eine Mail.</p>{zl(["Ich schreibe meinem Freund eine Mail."], 1)}
    <p class="satz">«Alle Billette vorweisen!», ruft <mark>der Mann</mark> im Zug.</p>{zl(["«Alle Billette vorweisen!», ruft der Kontrolleur im Zug."], 1)}
    <p class="satz"><mark>Heute</mark> komme ich <mark>spät</mark> nach Hause.</p>{zl(["Morgen komme ich früh nach Hause."], 1)}
    <p class="satz"><mark>Die Kinder</mark> <mark>rennen</mark> draussen im <mark>Regen</mark> herum.</p>{zl(["Die Hunde laufen draussen im Schnee herum."], 1)}
    <div class="regeln"><p><b>Merke dir:</b> Satzproben helfen, Satzglieder zu bestimmen. Satzglieder bleiben beim Verändern des Satzes immer zusammen. Satzproben sind: Verschiebeprobe, Weglassprobe, Erweiterungsprobe, Ersatzprobe. Sie helfen auch beim inhaltlichen Überarbeiten eines Textes.</p></div>
    </div></section>'''
    return p1 + p2 + p3

# ---------------- Lernziele + Merkblatt ----------------
LERNZIELE = ["Ich weiss, wie die Wörter der Baumuster 1, 2, 3 und 4 gebildet werden.",
 "Ich kann das silbentrennende h vom Dehnungs-h unterscheiden.",
 "Ich kann einsilbige Wörter verlängern und die Silbenprobe anwenden.",
 "Ich kann mit eigenen Worten erklären, was Satzglieder sind.",
 "Ich kann mit dem Verbenfächer Sätze bilden.",
 "Ich kann die vier verschiedenen Satzproben anwenden und Sätze damit verändern."]

def seite_lernziele():
    li = "".join(f'<tr><td>{e(t)}</td><td class="chk">☐</td><td class="chk">☐</td><td class="chk">☐</td></tr>' for t in LERNZIELE)
    return f'''<section class="seite"><div class="rahmen">
    <div class="kt-kopf"><span>Name: <i class="lin" style="width:62mm"></i></span><span>Datum: <i class="lin" style="width:34mm"></i></span></div>
    <h1 class="kt-titel">Lernziele Baumuster und Satzglieder</h1><p class="sub">Prüfung 26.10.2026 · 6. Klasse</p>
    <table class="lz"><thead><tr><th></th><th>kann ich</th><th>fast</th><th>üben</th></tr></thead><tbody>{li}</tbody></table>
    <h2>Das Material</h2>
    <ol class="inhalt"><li><b>Merkblatt</b> — alles Wichtige auf zwei Seiten</li>
    <li><b>Kurztest – Wortstrukturen A und B</b> (je 16 Punkte)</li>
    <li><b>Kurztest – Sätze A und B</b> (je 16 Punkte)</li>
    <li><b>Übungsblatt – Satzpuzzle</b> (12 Punkte)</li>
    <li><b>Übungsblätter – Verbenfächer und Satzproben</b> (Aufgaben wie im Lehrmittel)</li>
    <li><b>Lösungen</b> in einer eigenen Datei — erst nach dem Üben nachschauen!</li></ol>
    <p class="klein">Tipp: Mache einen Kurztest, korrigiere mit den Lösungen und trage die Punkte ein. Mit dem Merkblatt kannst du alles nachschlagen. Üben kannst du auch in der Deutsch-App unter «Prüfung 26.10.».</p>
    </div></section>'''

def seite_merk1():
    bm = [(1, "Rose", "Die Hauptsilbe ist <b>offen</b>. Sie endet mit einem Vokal oder Diphthong. Der Vokal wird <b>lang</b> gelesen. Langes i: <b>ie</b> (lie-ben)."),
          (2, "Pinsel", "Die Hauptsilbe ist <b>geschlossen</b>. Sie endet mit einem Konsonanten. Der Vokal wird <b>kurz</b> gelesen (Pin-sel)."),
          (3, "Keller", "Der Vokal soll kurz gelesen werden, deshalb braucht es <b>zwei Konsonanten</b>. k und z werden nicht verdoppelt: <b>gucken</b> (nicht gukken), <b>sitzen</b> (nicht sizzen)."),
          (4, "drehen", "Das <b>silbentrennende h</b> trennt die Vokale der beiden Silben. Es steht am Anfang der zweiten Silbe: dre-<b>h</b>en (nicht dre-en).")]
    boxes = "".join(f'<div class="bmk"><h3>Baumuster {n}</h3>{modell(W[w][0], W[w][1], leer=False)}<div class="wn">{w}</div><p>{t}</p></div>' for n, w, t in bm)
    return f'''<section class="seite"><div class="rahmen"><h1 class="kt-titel">Merkblatt 1 – Wortstrukturen</h1>
    <div class="legende"><span class="sw lang"></span> Vokal lang <span class="sw kurz"></span> Vokal kurz <span class="sw nebe"></span> e der Nebensilbe</div>
    <div class="bmgrid">{boxes}</div>
    <div class="regeln"><p><b>Dehnungs-h:</b> verlängert die offene Hauptsilbe. Es steht nur vor <b>l, m, n</b> oder <b>r</b>: Feh-ler, zah-me, woh-nen, Oh-ren.</p>
    <p><b>Doppelvokale:</b> In wenigen Wörtern verlängert derselbe Vokal die Hauptsilbe: <b>aa, ee, oo</b> (Haare, leeren, Boote).</p>
    <p><b>i oder ie?</b> Geschlossene Silbe (Baumuster 2): i wird kurz gelesen (Pin-sel). Offene Silbe (Baumuster 1): i wird lang gelesen und als <b>ie</b> geschrieben (lie-ben).</p>
    <p><b>Silbenprobe:</b> 1. Einsilbiges Wort <b>verlängern</b> (kippt → kippen, Hund → Hunde, krumm → der krumme Nagel). 2. Ins <b>Silbenmodell</b> eintragen. 3. Auf die <b>Betonung</b> achten: lang oder kurz?</p>
    <p><b>Rechtschreibtipps:</b> Markiere die Silben mit Silbenbögen oder trage zweisilbige Wörter ins Silbenmodell ein. Lang oder kurz gelesene Vokale ändern neben der Schreibweise auch die Bedeutung: <i>Die Clowns tragen lustige Hüte. Wir machen Ferien in einer Hütte im Wald.</i></p></div>
    </div></section>'''

def seite_merk2():
    return f'''<section class="seite"><div class="rahmen"><h1 class="kt-titel">Merkblatt 2 – Sätze</h1>
    <div class="regeln"><p><b>Verbenfächer:</b> Ein Satz besteht aus verschiedenen Satzgliedern. Die W-Fragen im Verbenfächer helfen, Satzglieder zu finden. Im Zentrum steht immer das <b>konjugierte Verb</b>.</p></div>
    {faecher("pickt", {"Wer? Was?": "die Taube", "Wo?": "am Boden", "Wann?": "abends", "Womit?": "mit ihrem Schnabel", "Wie?": "schnell", "Wen? Was?": "kleine Körner"})}
    <div class="eigene"><b>Satzglieder in eigenen Worten (Beispiel):</b><br>{e(EIGENE_WORTE)}</div>
    <div class="regeln"><p><b>Satzglied:</b> ein Wort oder eine Wortgruppe, die beim Verändern des Satzes <b>immer zusammenbleibt</b>. Nicht jeder Satz hat jedes Satzglied (Felder dürfen leer bleiben). Zweiteilige Verben gehören beide in die Mitte: <i>ruft … an</i>.</p>
    <p><b>Satzproben</b> helfen, Satzglieder zu bestimmen und Texte zu überarbeiten: Verschiebeprobe, Weglassprobe, Erweiterungsprobe, Ersatzprobe.</p></div>
    <p class="satz"><b>Wir | warten | an der Haltestelle | auf den Bus.</b></p>
    <table class="pt"><tbody>
     <tr><th>Verschiebeprobe</th><td><mark>An der Haltestelle</mark> warten wir auf den Bus.</td></tr>
     <tr><th>Weglassprobe</th><td>Wir warten an der Haltestelle. <mark><s>auf den Bus.</s></mark></td></tr>
     <tr><th>Erweiterungsprobe</th><td>Wir warten <mark>mit der Klasse</mark> an der Haltestelle auf den Bus.</td></tr>
     <tr><th>Ersatzprobe</th><td>Wir warten <mark>gemeinsam</mark> auf den Bus.</td></tr></tbody></table>
    </div></section>'''

# ---------------- Zusammenbau ----------------
CSS = '''
@page { size: A4; margin: 12mm 14mm; }
* { box-sizing: border-box; }
body { font-family: "Liberation Sans", Arial, Helvetica, sans-serif; font-size: 11pt; line-height: 1.35; color: #111; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.seite { page-break-after: always; break-after: page; }
.seite:last-child { page-break-after: auto; break-after: auto; }
.kt-kopf { display: flex; justify-content: space-between; font-size: 12pt; margin-bottom: 7mm; } .lin { display: inline-block; border-bottom: 1px solid #333; height: 1em; vertical-align: baseline; }
.kt-titel { font-family: "DejaVu Sans", Arial, sans-serif; font-variant: small-caps; font-weight: 700; font-size: 21pt; letter-spacing: .03em; margin: 0 0 7mm; }
h2 { font-size: 13pt; margin: 6mm 0 3mm; } h3 { font-size: 11pt; margin: 0 0 3px; } .sub { margin: -5mm 0 6mm; color: #555; }
.aufg { margin: 6mm 0 2mm; } .aufg i { font-style: normal; } .satz { margin: 3mm 0 1mm; } .satz u { text-underline-offset: 2px; }
.zeile { border-bottom: 1px solid #222; } .zl { border-bottom: 1px solid #222; min-height: 9mm; display: flex; align-items: flex-end; gap: 10px; padding-bottom: 1px; }
.pkt { text-align: right; margin: 2mm 0 0; font-size: 11pt; }
.bwgrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7mm 4mm; margin: 5mm 6mm 2mm; } .bw { font-size: 13pt; letter-spacing: .08em; text-align: center; min-height: 10mm; }
.bogen { display: inline-block; border-bottom: 2px solid #111; border-radius: 0 0 55% 55% / 0 0 6px 6px; padding: 0 3px 4px; margin: 0 1px; }
.vzgrid { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid #333; margin-top: 3mm; } .vz { border: 1px solid #333; } .vz-kopf { font-weight: 700; font-size: 10pt; padding: 3px 6px; border-bottom: 1px solid #333; }
.vz-box { padding: 5mm 4mm; min-height: 22mm; display: flex; align-items: center; justify-content: center; }
.modell { display: inline-flex; gap: 5px; } .silbe { display: inline-flex; } .silbe.haupt { outline: 2px solid #777; outline-offset: -1px; border-radius: 3px; }
.k { width: 9mm; height: 10mm; border: 1px solid #aaa; border-style: dotted solid dotted solid; margin-left: -1px; display: inline-grid; place-items: center; font-size: 14pt; font-weight: 700; background: #fff; }
.k.lang { background: #d6ebfb; color: #1d5f93; } .k.kurz { background: #f9d9cf; color: #a3402a; } .k.nebe { background: #fdf0d3; color: #8a6410; }
.fussbox { display: grid; grid-template-columns: 1.6fr 1fr 0.8fr; border: 1.5px dotted #444; margin-top: 5mm; font-size: 9.5pt; } .fussbox > div { padding: 3px 7px; min-height: 17mm; } .fussbox b { display: block; font-size: 14pt; margin-top: 3mm; text-align: center; }
.fussbox .erreicht, .fussbox .note { border-left: 1.5px dotted #444; } .lin2 { border-bottom: 1px solid #555; margin-top: 8mm; }
.loesungstext, .ein { color: #1a7a3d; font-family: "DejaVu Sans", sans-serif; font-style: italic; font-size: 10pt; } .loesungstext { margin: 2mm 0; padding: 3mm; border: 1px solid #1a7a3d; border-radius: 6px; background: #f3fbf6; }
.bogenwort .bogen { color: #1a7a3d; font-weight: 700; } .bmn { color: #1a7a3d; font-weight: 700; } .hint, .hint2 { color: #1a7a3d; font-size: 9.5pt; } .ok { color: #1a7a3d; }
.faecher { width: 100%; max-width: 112mm; display: block; margin: 2px auto; } .faecher .feld { fill: #fff; stroke: #4b3a9e; stroke-width: 2; stroke-dasharray: 5 4; } .faecher .mitte { fill: #ece8fb; stroke: #4b3a9e; stroke-width: 2; }
.faecher .strahl { stroke: #999; stroke-width: 1.6; } .faecher .frage { fill: #4b3a9e; font-weight: 700; } .faecher .ein { fill: #1a7a3d; font-weight: 700; font-style: normal; }
.probe { margin: 4mm 0 0; } .kspalten { display: grid; grid-template-columns: repeat(var(--n, 3), 1fr); gap: 3mm; margin: 3mm 0 4mm; } .kspalte { display: flex; flex-direction: column; gap: 2mm; } .kk { border: 1px solid #555; border-radius: 6px; padding: 2px 8px; font-size: 10.5pt; background: #fff; } .klein { font-size: 10pt; margin: 2mm 0; } .eigene { border: 2px solid #1a7a3d; background: #f3fbf6; border-radius: 8px; padding: 3mm; margin: 3mm 0; font-size: 10.5pt; } .faktengrid { columns: 2; column-gap: 6mm; margin-top: 3mm; } .fakt { break-inside: avoid; border: 1.5px solid #cfc8f0; border-radius: 8px; padding: 2mm 3mm; margin-bottom: 3mm; background: #faf9ff; } .fakt h3 { margin: 0 0 1mm; } .fakt p { margin: 1mm 0; font-size: 9.5pt; } .kk-reihe { text-align: center; font-size: 10.5pt; }
.lz { width: 100%; border-collapse: collapse; margin-top: 4mm; } .lz th { font-size: 10pt; text-align: center; } .lz td { border-top: 1px solid #aaa; padding: 3.5mm 2mm; } .lz .chk { text-align: center; width: 18mm; font-size: 16pt; }
.inhalt { line-height: 1.8; }
.bmgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; } .bmk { border: 1.5px solid #cfc8f0; border-radius: 10px; padding: 7px 9px; background: #faf9ff; } .bmk p { margin: 5px 0 0; font-size: 10pt; } .wn { font-weight: 700; margin-top: 2px; }
.regeln { margin: 3mm 0; border: 2px dashed #4b3a9e; border-radius: 10px; padding: 2px 10px; } .regeln p { margin: 5px 0; font-size: 10.5pt; }
.legende { font-size: 9.5pt; color: #555; margin-bottom: 5px; } .sw { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin: 0 3px 0 10px; } .sw.lang { background: #d6ebfb; } .sw.kurz { background: #f9d9cf; } .sw.nebe { background: #fdf0d3; }
.pt { width: 100%; border-collapse: collapse; margin-top: 3mm; } .pt th { text-align: left; width: 38mm; padding: 6px; border-bottom: 1px solid #ccc; vertical-align: top; } .pt td { padding: 6px; border-bottom: 1px solid #ccc; } mark { background: #d9d2f7; padding: 0 2px; }
.loesung-teil { display: none; } .test-teil { display: block; }
body.nur-loesung .test-teil { display: none; } body.nur-loesung .loesung-teil { display: block; }
.druckleiste { position: sticky; top: 0; background: #402900; color: #ffe3b3; padding: 8px 12px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; font-size: 14px; z-index: 5; }
.druckleiste button, .druckleiste a { font: inherit; font-weight: 700; border: none; border-radius: 999px; padding: 6px 14px; background: #ffe3b3; color: #402900; cursor: pointer; text-decoration: none; }
@media print { .druckleiste { display: none; } .seite { height: 270mm; overflow: hidden; } }
@media screen { .seite { max-width: 190mm; margin: 12px auto; padding: 10mm; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,.15); } body { background: #eee; } }
'''

def teil(l):
    s = []
    if not l:
        s += [seite_lernziele(), seite_merk1(), seite_merk2()]
    for v in ("A", "B"):
        s.append(kt_wort(v, l))
    for v in ("A", "B"):
        s.append(kt_saetze(v, l))
    s.append(seite_puzzle(l))
    s.append(seite_uebung(l))
    return "".join(s)

HTML = f'''<!DOCTYPE html>
<html lang="de-CH"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lernmaterial Prüfung 26.10.</title><style>{CSS}</style></head>
<body>
<div class="druckleiste"><a href="index.html">← Deutsch</a><button onclick="document.body.classList.remove('nur-loesung')">📝 Material</button>
<button onclick="document.body.classList.add('nur-loesung')">✅ Lösungen</button><button onclick="window.print()">🖨️ Drucken / PDF speichern</button></div>
<div class="test-teil">{teil(False)}</div><div class="loesung-teil">{teil(True)}</div>
</body></html>'''
OUT.write_text(HTML, encoding="utf8")
print("geschrieben:", OUT)


# =====================================================================
# Probeprüfung (ca. 45 Minuten, keine Multiple-Choice-Aufgaben)
# =====================================================================
OUT_PRUEFUNG = OUT.with_name("probepruefung-26-10.html")

def pruefung_kopf(titel, teil, l):
    zeit = "" if l else '<div class="zeitbox"><b>Zeit:</b> 45 Minuten &nbsp;·&nbsp; <b>Punkte:</b> 40 &nbsp;·&nbsp; keine Hilfsmittel</div>'
    return kopf(titel) + zeit + f'<h2 class="teil">{teil}</h2>'

def pruefung(l):
    # ---------- Teil A ----------
    a1 = '<p class="aufg"><b>1.</b> Erkläre, wie die Wörter des Baumuster 3 gebildet werden. Mache dazu ein Beispiel.</p>'
    a1 += f'<div class="loesungstext">{e(BM_ERKL[3])}</div>' if l else zeilen(5)
    a1 += punkte(4)
    a2 = '<p class="aufg"><b>2.</b> Erkläre den Unterschied zwischen dem <b>Dehnungs-h</b> und dem <b>silbentrennenden h</b>. Schreibe zu jedem h zwei Beispiele auf.</p>'
    a2 += ('<div class="loesungstext">Dehnungs-h: steht am Ende der ersten Silbe und verlängert den Vokal, nur vor l, m, n, r (Feh-ler, woh-nen, zah-me, Oh-ren). '
           'Silbentrennendes h: steht am Anfang der zweiten Silbe und trennt zwei Vokale (ge-hen, se-hen, dre-hen, nä-hen).</div>') if l else zeilen(5)
    a2 += punkte(4)
    wl = ["Wolke", "Hase", "Kinder", "sehen", "Katze", "Taube", "Pinsel", "lieben"]
    a3 = '<p class="aufg"><b>3.</b> Zeichne die Silbenbögen ein.</p><div class="bwgrid">' + "".join(f'<div class="bw">{bogen(W[w][3]) if l else e(w)}</div>' for w in wl) + "</div>" + punkte(4)
    sat = [("Wir <u>sehen/seen</u> im Garten eine <u>Taube/Taupe</u>.", [("sehen", ["se","hen"], 4, "sehen"), ("Taube", ["Tau","be"], 1, "")]),
           ("Der <u>Hunt/Hund</u> springt über den <u>Zaun/Zaum</u>.", [("Hund", ["Hun","de"], 2, "Hund → Hunde"), ("Zaun", ["Zäu","ne"], 1, "Zaun → Zäune")])]
    a4 = '<p class="aufg"><b>4.</b> Entscheide, welche Schreibweise richtig ist. Schreibe das korrekte Wort mit Silbenbögen auf. Zu welchem Baumuster gehört das Wort? Schreibe auf. Verlängere bei Bedarf.</p>'
    for satz, items in sat:
        a4 += f'<p class="satz">{satz}</p>'
        for wort, silben, bm, h in items:
            a4 += (f'<div class="zl">{bogen(silben)} <span class="bmn">Baumuster {bm}</span> <span class="hint">{e(h)}</span></div>' if l else '<div class="zl"></div>')
    a4 += punkte(6)
    a5 = '<p class="aufg"><b>5.</b> Mache zu jedem Baumuster ein Beispiel und schreibe das Wort korrekt in die Vorlagen.</p>' + vorlagen(l)
    if l: a5 += '<p class="hint2">Beispiele (andere Wörter sind möglich): Rose · Pinsel · Keller · drehen</p>'
    a5 += punkte(2)
    seiteA1 = f'<section class="seite kt"><div class="rahmen">{pruefung_kopf("Deutsch-Prüfung · Baumuster und Satzglieder", "Teil A · Wortstrukturen (ca. 20 Minuten · 20 Punkte)", l)}{a1}{a2}</div></section>'
    seiteA2 = f'<section class="seite kt"><div class="rahmen">{a3}{a4}{a5}</div></section>'

    # ---------- Teil B ----------
    zl = lambda txts, n: "".join(f'<div class="zl"><span class="ein">{e(t)}</span></div>' for t in txts) if l else zeilen(n)
    b6 = '<p class="aufg"><b>6.</b> Erkläre mit eigenen Worten, was Satzglieder sind. Mache dazu ein Beispiel.</p>'
    b6 += f'<div class="loesungstext">{e(EIGENE_WORTE)}</div>' if l else zeilen(4)
    b6 += punkte(3)
    b7 = '<p class="aufg"><b>7.</b> Schreibe die Satzglieder zu den entsprechenden Fragen im Verbenfächer hin.</p><p class="satz kk-reihe">im Laden &nbsp;·&nbsp; gestern &nbsp;·&nbsp; ein Buch &nbsp;·&nbsp; mit Bargeld &nbsp;·&nbsp; Lena</p>'
    b7 += faecher("kauft", {"Wer? Was?": "Lena", "Wann?": "gestern", "Wo?": "im Laden", "Wen? Was?": "ein Buch", "Womit?": "mit Bargeld"} if l else {})
    b7 += '<p class="klein">Leeres Feld: ' + ('<b class="ok">Wie?</b>' if l else "____________") + "</p>" + punkte(4)
    b8 = '<p class="aufg"><b>8.</b> Bilde mit den Satzgliedern aus Aufgabe 7 einen korrekten Satz. Verschiebe danach die Satzglieder und bilde einen weiteren korrekten Satz.</p>'
    b8 += zl(["Lena kauft gestern im Laden mit Bargeld ein Buch.", "Im Laden kauft Lena gestern mit Bargeld ein Buch."], 4) + punkte(3)
    b9 = '<p class="aufg"><b>9.</b> Fülle einen eigenen Verbenfächer aus. Schreibe eines der Verben in die Mitte: <i>werfen, kommen, stehen, tanzen, befehlen</i>. Bilde mit den Satzgliedern zwei korrekte Sätze.</p>'
    b9 += faecher("tanzen" if l else "", {"Wer? Was?": "die Kinder", "Wo?": "im Garten", "Wann?": "am Abend", "Womit?": "mit Musik", "Wie?": "fröhlich"} if l else {})
    b9 += zl(["Die Kinder tanzen am Abend fröhlich mit Musik im Garten.", "Im Garten tanzen die Kinder am Abend fröhlich mit Musik."], 2) + punkte(4)
    seiteB1 = f'<section class="seite kt"><div class="rahmen">{pruefung_kopf("Deutsch-Prüfung · Baumuster und Satzglieder", "Teil B · Sätze (ca. 25 Minuten · 20 Punkte)", l)}{b6}{b7}{b8}</div></section>'
    b10 = '<p class="aufg"><b>10.</b> Wende die vier Satzproben auf den Satz an.<br><i>Die Kinder spielen am Nachmittag im Garten.</i></p>'
    for name, hint, lo in zip(["Verschiebeprobe", "Weglassprobe", "Erweiterungsprobe", "Ersatzprobe"],
                              ["(stelle um)", "(lasse ein Satzglied weg)", "(ergänze ein Satzglied)", "(ersetze ein Satzglied)"],
                              ["Am Nachmittag spielen die Kinder im Garten.", "Die Kinder spielen im Garten.", "Die Kinder spielen am Nachmittag fröhlich im Garten.", "Sie spielen am Nachmittag im Garten."]):
        b10 += f'<p class="probe"><b>{name}</b> {hint}</p>' + (f'<div class="zl"><span class="ein">{e(lo)}</span></div>' if l else '<div class="zl"></div>')
    b10 += punkte(4)
    b11 = '<p class="aufg"><b>11.</b> Ersetze die markierten Satzglieder durch andere Satzglieder.</p>'
    b11 += '<p class="satz"><mark>Heute</mark> komme ich <mark>spät</mark> nach Hause.</p>' + zl(["Morgen komme ich früh nach Hause."], 1)
    b11 += '<p class="satz">Ich schreibe <mark>dir</mark> eine Mail.</p>' + zl(["Ich schreibe meinem Freund eine Mail."], 1) + punkte(2)
    seiteB2 = f'<section class="seite kt"><div class="rahmen">{b9}{b10}{b11}{fuss(40)}</div></section>'
    return seiteA1 + seiteA2 + seiteB1 + seiteB2

CSS2 = CSS + '''
.zeitbox { border: 1.5px solid #333; padding: 2mm 3mm; margin: -2mm 0 3mm; font-size: 10.5pt; }
h2.teil { background: #eee; font-size: 11.5pt; padding: 2mm 3mm; margin: 3mm 0 0; border-left: 4px solid #333; }
'''
def dokument(titel, inhalt_test, inhalt_loesung):
    return f'''<!DOCTYPE html>
<html lang="de-CH"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titel}</title><style>{CSS2}</style></head>
<body>
<div class="druckleiste"><a href="index.html">← Deutsch</a><button onclick="document.body.classList.remove('nur-loesung')">📝 Prüfung</button>
<button onclick="document.body.classList.add('nur-loesung')">✅ Lösungen</button><button onclick="window.print()">🖨️ Drucken / PDF speichern</button></div>
<div class="test-teil">{inhalt_test}</div><div class="loesung-teil">{inhalt_loesung}</div>
</body></html>'''

OUT_PRUEFUNG.write_text(dokument("Probeprüfung Deutsch 26.10.", pruefung(False), pruefung(True)), encoding="utf8")
print("geschrieben:", OUT_PRUEFUNG)


# =====================================================================
# Probeprüfung «Stadt Bern» (Deutsch-Prüfung mit Inhalten aus dem NMG, 45 Minuten)
# =====================================================================
OUT_BERN = OUT.with_name("probepruefung-stadt-bern.html")

def faktenblatt():
    fakten = [
     ("Gründung & Name", ["Herzog Berchtold V. von Zähringen gründete Bern im Jahr 1191.", "Er liess die Stadt von Osten nach Westen bauen.", "Der Herzog wollte die Stadt nach dem ersten erlegten Tier benennen – es war ein Bär. Darum heisst die Stadt Bern, und der Bär ist das Wappentier."]),
     ("Aufbau der Stadt", ["Auf drei Seiten schützte die Aare die Stadt. Im Westen schützten ein Stadttor, eine hohe Stadtmauer und ein Stadtgraben.", "Schon im Mittelalter war Bern ein wichtiges Handelszentrum."]),
     ("Nydegghöfli", ["Hier bauten die Zähringer eine Burg zur Sicherung des Aareübergangs.", "Die kleine Brücke (Untere Brücke) war Berns erste Brücke (1256, Holz; 1461 aus Stein neu gebaut). Man bezahlte Zoll.", "Die Aare ist grün wegen der Mineralien im Gletscherwasser. Die erste Schokoladenfabrik von Lindt stand hier."]),
     ("Münster", ["Der Turm ist mit 100,6 Metern der höchste Kirchturm der Schweiz (Bauzeit 1421–1590; oberster Teil 1893).", "Das Münster hat neun Glocken. Die grösste, die «Gewichtige Susanna», wiegt 10'000 kg.", "Das Hauptportal zeigt das Jüngste Gericht. Die Wasserspeier dienen als Regenrinnen."]),
     ("Zytglogge", ["Die Zytglogge zeigt seit 1405 die Zeit an. Von 1191 bis 1346 war sie das westliche Stadttor.", "Das Uhrwerk schmiedete 1530 der Schlosser Kaspar Brunner.", "Zur vollen Stunde tanzt der Narr, die Bären drehen sich und der Hahn kräht. Der goldene Stundenschläger (Hans von Thann, 2,55 m) schlägt die grosse Glocke."]),
     ("Junkerngasse & Kramgasse", ["Die Junkerngasse hiess früher «Edle Gasse». Der Löwe mit Stern auf dem Brunnen ist das Wappen der Familie von Bubenberg. Das Gespensterhaus steht an der Junkerngasse 54.", "Napoleons Truppen besetzten Bern und nummerierten die Häuser.", "In der Kramgasse entstanden die Lauben. Der Affe ist das Zeichen der Steinmetze. Der Kindlifresserbrunnen ist der berühmteste Brunnen. Albert Einstein wohnte 1905 an der Kramgasse 49."]),
     ("Mattequartier", ["In der Matte wohnten Handwerker (Müller, Gerber, Fischer, Flösser, Säger, Goldschmiede). Sie war der Hafen Berns.", "Die Aare trat oft über die Ufer. Darum liegen die Laubengänge der Schifflaube tiefer als die Strasse.", "Die Matte hat eine eigene Sprache: das Mattenenglisch."]),
    ]
    teile = "".join(f'<div class="fakt"><h3>{e(t)}</h3>' + "".join(f"<p>{e(x)}</p>" for x in xs) + "</div>" for t, xs in fakten)
    return f'''<section class="seite kt"><div class="rahmen"><h1 class="kt-titel">Beilage – Das musst du über Stadt Bern wissen</h1>
    <p class="klein">Alle Sätze dieser Prüfung stammen aus dem NMG-Thema «Stadt Bern». Lies die Fakten vor oder nach der Prüfung — so lernst du gleichzeitig Deutsch und NMG.</p>
    <div class="faktengrid">{teile}</div></div></section>'''

def pruefung_bern(l):
    T = "Deutsch-Prüfung · Stadt Bern"
    # ---------- Teil A ----------
    a1 = '<p class="aufg"><b>1.</b> Erkläre, wie die Wörter des Baumuster 3 gebildet werden. Mache dazu ein Beispiel aus dem Thema Stadt Bern.</p>'
    a1 += f'<div class="loesungstext">{e(BM_ERKL[3])} Beispiele aus Bern: Gas-se (Junkerngasse), Brun-nen (Kindlifresserbrunnen), Rit-ter (Zähringerbrunnen), Mat-te (Mattequartier).</div>' if l else zeilen(5)
    a1 += punkte(4)
    a2 = '<p class="aufg"><b>2.</b> Erkläre den Unterschied zwischen dem <b>Dehnungs-h</b> und dem <b>silbentrennenden h</b>. Schreibe zu jedem h zwei Beispiele auf.</p>'
    a2 += ('<div class="loesungstext">Dehnungs-h: steht am Ende der ersten Silbe und verlängert den Vokal, nur vor l, m, n, r (Uhr, Fäh-re, Zäh-ringer, woh-nen). '
           'Silbentrennendes h: steht am Anfang der zweiten Silbe und trennt zwei Vokale (ste-hen, se-hen, dre-hen, Ze-hen).</div>') if l else zeilen(5)
    a2 += punkte(4)
    wl = ["Bären", "Lauben", "Hafen", "Löwe", "Glocke", "Brunnen", "Münster", "Gasse"]
    a3 = '<p class="aufg"><b>3.</b> Zeichne die Silbenbögen ein. <i>(Wörter aus dem Thema Stadt Bern)</i></p><div class="bwgrid">' + "".join(f'<div class="bw">{bogen(W[w][3]) if l else e(w)}</div>' for w in wl) + "</div>" + punkte(4)
    sat = [("Früher war die Matte der <u>Hafen/Haffen</u> von Bern.", ("Hafen", ["Ha","fen"], 1, "")),
           ("Der Kindlifresserbrunnen ist der berühmteste <u>Brunnen/Brunen</u> der Stadt.", ("Brunnen", ["Brun","nen"], 3, "")),
           ("An der kleinen Brücke musste man früher <u>Zoll/Zol</u> bezahlen.", ("Zoll", ["Zöl","le"], 3, "Zoll → Zölle")),
           ("Hinter der Statue von Berchtold V. <u>stehen/steen</u> vier Bronzetafeln.", ("stehen", ["ste","hen"], 4, ""))]
    a4 = '<p class="aufg"><b>4.</b> Entscheide, welche Schreibweise richtig ist. Schreibe das korrekte Wort mit Silbenbögen auf. Zu welchem Baumuster gehört das Wort? Schreibe auf. Verlängere bei Bedarf.</p>'
    for satz, (wort, silben, bm, h) in sat:
        a4 += f'<p class="satz">{satz}</p>' + (f'<div class="zl">{bogen(silben)} <span class="bmn">Baumuster {bm}</span> <span class="hint">{e(h)}</span></div>' if l else '<div class="zl"></div>')
    a4 += punkte(6)
    a5 = '<p class="aufg"><b>5.</b> Schreibe zu jedem Baumuster ein Wort aus dem Thema Stadt Bern in die Vorlage. <i>(Tipp: Bär, Matte, Zytglogge, Münster, Aare …)</i></p>'
    a5 += vorlagen(l, {1: "Bären", 2: "Gerber", 3: "Ritter", 4: "drehen"})
    if l: a5 += '<p class="hint2">Beispiele (andere Wörter sind möglich): Bären · Hafen · Löwe · Gerber (Matte) · Ritter · Gasse · drehen (Zytglogge)</p>'
    a5 += punkte(2)
    A1 = f'<section class="seite kt"><div class="rahmen">{pruefung_kopf(T, "Teil A · Wortstrukturen (ca. 20 Minuten · 20 Punkte)", l)}{a1}{a2}</div></section>'
    A2 = f'<section class="seite kt"><div class="rahmen">{a3}{a4}{a5}</div></section>'
    # ---------- Teil B ----------
    zl = lambda txts, n: "".join(f'<div class="zl"><span class="ein">{e(t)}</span></div>' for t in txts) if l else zeilen(n)
    b6 = '<p class="aufg"><b>6.</b> Erkläre mit eigenen Worten, was Satzglieder sind. Mache dazu ein Beispiel mit diesem Satz:<br><i>Herzog Berchtold V. von Zähringen gründete Bern im Jahr 1191.</i></p>'
    b6 += ('<div class="loesungstext">Satzglieder sind die Bausteine eines Satzes. Ein Satzglied kann ein einzelnes Wort sein oder mehrere Wörter, die zusammengehören. '
           'Wenn man den Satz umstellt, bleiben diese Wörter immer zusammen. Beispiel: Herzog Berchtold V. von Zähringen | gründete | Bern | im Jahr 1191. '
           '„Herzog Berchtold V. von Zähringen“ sind fünf Wörter, aber nur ein Satzglied: Im Jahr 1191 gründete Herzog Berchtold V. von Zähringen Bern.</div>') if l else zeilen(4)
    b6 += punkte(3)
    b7 = '<p class="aufg"><b>7.</b> Schreibe die Satzglieder zu den entsprechenden Fragen im Verbenfächer hin.</p><p class="satz kk-reihe">an der Zytglogge &nbsp;·&nbsp; mit dem Hammer &nbsp;·&nbsp; die grosse Glocke &nbsp;·&nbsp; der goldene Stundenschläger &nbsp;·&nbsp; zur vollen Stunde</p>'
    b7 += faecher("schlägt", {"Wer? Was?": "der goldene Stundenschläger", "Wann?": "zur vollen Stunde", "Wo?": "an der Zytglogge", "Wen? Was?": "die grosse Glocke", "Womit?": "mit dem Hammer"} if l else {})
    b7 += '<p class="klein">Leeres Feld: ' + ('<b class="ok">Wie?</b>' if l else "____________") + "</p>" + punkte(4)
    b8 = '<p class="aufg"><b>8.</b> Bilde mit den Satzgliedern einen korrekten Satz. Verschiebe danach die Satzglieder und bilde einen weiteren korrekten Satz.</p>' + karten_spalten([["in der Stadt", "seit 1405"], ["die Zytglogge", "zeigt"], ["die Zeit", "an"]])
    b8 += zl(["Die Zytglogge zeigt seit 1405 in der Stadt die Zeit an.", "Seit 1405 zeigt die Zytglogge in der Stadt die Zeit an."], 4) + punkte(3)
    b9 = '<p class="aufg"><b>9.</b> Fülle einen eigenen Verbenfächer aus. Schreibe eines der Verben in die Mitte: <i>gründen, bauen, wohnen, hängen, besetzen</i>. Bilde mit den Satzgliedern zwei korrekte Sätze über Stadt Bern.</p>'
    b9 += faecher("bauen" if l else "", {"Wer? Was?": "die Zähringer", "Wo?": "am Nydegghöfli", "Wann?": "im Mittelalter", "Wen? Was?": "eine Burg", "Womit?": "mit grossem Aufwand"} if l else {})
    b9 += zl(["Die Zähringer bauten im Mittelalter am Nydegghöfli mit grossem Aufwand eine Burg.", "Am Nydegghöfli bauten die Zähringer im Mittelalter eine Burg."], 2) + punkte(4)
    B1 = f'<section class="seite kt"><div class="rahmen">{pruefung_kopf(T, "Teil B · Sätze (ca. 25 Minuten · 20 Punkte)", l)}{b6}{b7}{b8}</div></section>'
    b10 = '<p class="aufg"><b>10.</b> Wende die vier Satzproben auf den Satz an.<br><i>Herzog Berchtold gründete im Jahr 1191 die Stadt Bern an der Aare.</i></p>'
    for name, hint, lo in zip(["Verschiebeprobe", "Weglassprobe", "Erweiterungsprobe", "Ersatzprobe"],
                              ["(stelle um)", "(lasse ein Satzglied weg)", "(ergänze ein Satzglied)", "(ersetze ein Satzglied)"],
                              ["Im Jahr 1191 gründete Herzog Berchtold die Stadt Bern an der Aare.", "Herzog Berchtold gründete die Stadt Bern an der Aare.", "Herzog Berchtold gründete im Jahr 1191 mit seinen Leuten die Stadt Bern an der Aare.", "Er gründete im Jahr 1191 die Stadt Bern an der Aare."]):
        b10 += f'<p class="probe"><b>{name}</b> {hint}</p>' + (f'<div class="zl"><span class="ein">{e(lo)}</span></div>' if l else '<div class="zl"></div>')
    b10 += punkte(4)
    b11 = '<p class="aufg"><b>11.</b> Ersetze die markierten Satzglieder durch andere Satzglieder.</p>'
    b11 += '<p class="satz"><mark>Albert Einstein</mark> wohnte <mark>1905</mark> an der Kramgasse 49.</p>' + zl(["Der Physiker wohnte damals an der Kramgasse 49."], 1)
    b11 += '<p class="satz">Das Münster hat <mark>neun Glocken</mark>.</p>' + zl(["Das Münster hat die schwerste Glocke der Schweiz."], 1) + punkte(2)
    B2 = f'<section class="seite kt"><div class="rahmen">{b9}{b10}{b11}{fuss(40)}</div></section>'
    return A1 + A2 + B1 + B2 + faktenblatt()

OUT_BERN.write_text(dokument("Probeprüfung Deutsch · Stadt Bern", pruefung_bern(False), pruefung_bern(True)), encoding="utf8")
print("geschrieben:", OUT_BERN)
