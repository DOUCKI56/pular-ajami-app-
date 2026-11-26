#!/usr/bin/env python3
"""Génère les documents téléchargeables de l'application (PDF légers + TXT Unicode).

Les PDF sont écrits à la main (police Helvetica de base) pour rester très
légers (1-3 Ko). Les caractères ajami sont fournis dans les fichiers TXT
UTF-8, car l'incorporation d'une police arabe dans un PDF alourdirait
considérablement les fichiers.
"""
import os
import zlib

OUT = os.path.join(os.path.dirname(__file__), "..", "docs")


def wrap(text, width=88):
    lines = []
    for para in text.split("\n"):
        while len(para) > width:
            cut = para.rfind(" ", 0, width)
            cut = cut if cut > 0 else width
            lines.append(para[:cut])
            para = " " + para[cut:]
        lines.append(para)
    return lines


def esc(s):
    return s.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")


def make_pdf(path, title, subtitle, body):
    content = ["BT /F1 16 Tf 72 760 Td (%s) Tj ET" % esc(title)]
    content.append("BT /F1 11 Tf 72 738 Td (%s) Tj ET" % esc(subtitle))
    y = 714
    for line in wrap(body):
        content.append("BT /F2 10 Tf 72 %d Td (%s) Tj ET" % (y, esc(line)))
        y -= 14
        if y < 60:
            break
    stream = "\n".join(content).encode("latin-1", "replace")
    compressed = zlib.compress(stream)

    objs = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
        b"/Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        b"<< /Length %d /Filter /FlateDecode >>\nstream\n%s\nendstream" % (len(compressed), compressed),
    ]
    pdf = bytearray(b"%PDF-1.4\n")
    offsets = []
    for i, obj in enumerate(objs, 1):
        offsets.append(len(pdf))
        pdf += b"%d 0 obj\n" % i + obj + b"\nendobj\n"
    xref = len(pdf)
    pdf += b"xref\n0 %d\n0000000000 65535 f \n" % (len(objs) + 1)
    for off in offsets:
        pdf += b"%010d 00000 n \n" % off
    pdf += b"trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF\n" % (len(objs) + 1, xref)

    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(bytes(pdf))
    print("OK %-40s %d octets" % (os.path.basename(path), os.path.getsize(path)))


LETTERS = """GUIDE DE L'ALPHABET AJAMI HARMONISE DU PULAR (FULFULDE)
Norme agreee a la conference JCMWA/MICCAO de Ngaoundere (1998) : 33 lettres.

Translitteration des lettres (les caracteres ajami sont dans le fichier
alphabet-ajami.txt et dans l'application) :

  aliiji (a long)  - A     bee  - B      bee modu - B(b implosif)
  tee - T          camamlu - S (emprunts)   jiimi - J
  haa baaluul - H  haa tobou - KH (emprunts) deeli - D
  jaali - J (emprunts)   arre - R          jayra - J (emprunts)
  siini - S        ciini - C (tch)          saadi - S (emprunts)
  daadi - D (emprunts)   daadi peetel - D(d implosif)   jaadi - J (emprunts)
  ayni - support des voyelles initiales (' )
  angani - G       fee - F    pee - P (lettre propre au fulfulde)
  gaafu - K/G (emprunts)   keefu - K         laamu - L
  miimi - M        nuunu - N                haa peetel - H (emprunts)
  waawu - W / oo / uu      yah siiin - ee (long)   yah - Y / ii
  yah modi - Y(y mouille, propre au fulfulde)
  nya - NY (propre au fulfulde)            hamaja - ' (emprunts)

Les 4 lettres propres au fulfulde (n'existent pas en arabe) :
  B implosif, P, Y mouille, NY.

Regles essentielles :
1. On ecrit de droite a gauche.
2. Toutes les voyelles s'ecrivent avec des diacritiques.
3. Les consonnes sans voyelle portent un sukun.
4. Un mot pular ne commence jamais par alif : la voyelle initiale
   s'appuie sur ayni.
5. Dix lettres servent uniquement aux emprunts arabes.
"""

VOYELLES = """GUIDE DES VOYELLES ET DIACRITIQUES DU PULAR AJAMI

L'arabe compte 3 voyelles breves ; le pular en compte 5. Deux points
supplementaires ont donc ete ajoutes.

Voyelles breves :
  - fatha              = a
  - kasra              = i
  - damma              = u
  - point souscrit (imala) = e  (voyelle propre au pular)
  - damma pointee      = o  (voyelle propre au pular)
  - sukun              = aucune voyelle (consonne fermee)

Voyelles en debut de mot (support ayni) :
  ayni + fatha = a    ayni + point souscrit = e
  ayni + kasra = i    ayni + damma pointee  = o
  ayni + damma = u

Voyelles longues (la lettre suivante allonge la voyelle) :
  fatha + alif            = aa
  point souscrit + yeh siin = ee
  kasra + yeh             = ii
  damma pointee + waawu   = oo
  damma + waawu           = uu

Regles :
1. Toutes les voyelles s'ecrivent, contrairement a l'arabe classique.
2. La premiere lettre d'un digramme prenasalise (mb, nd, nj, ng) ne
   porte jamais de diacritique.
3. Le e s'ecrit avec le point souscrit, le o avec la damma pointee.
"""

PHRASES = """CAHIER DE PHRASES ET VOCABULAIRE - PULAR AJAMI
(Translitteration latine ; les formes ajami sont dans l'application
et dans vocabulaire-ajami.txt)

SALUTATIONS
  a jaraama          bonjour / merci
  jam wa?            ca va ?
  jam tan            ca va, paix seulement

MOTS DE BASE
  ndiyam             l'eau
  hendu              le vent
  fombina            le sud
  njaareendi         le sable
  mbarugo            tuer
  sendugo            separer
  wi'a               dire
  min                moi / nous
  jawmiraawo         le seigneur / le chef
  ngarol             la beaute
  bingel (bingel)    l'enfant
  ngaynaaka          l'elevage des bovins

NOMBRES (1 a 10)
  go'o, didi, tati, nawi, joyi, jeego,
  jeedidi, jeetati, teedi, sappo

EXERCICE
Traduisez en pular puis ecrivez en ajami :
1. L'eau et le vent.   2. Paix seulement.   3. L'enfant est beau.
"""

if __name__ == "__main__":
    make_pdf(os.path.join(OUT, "guide-alphabet.pdf"),
             "Pular Ajami - Alphabet harmonise",
             "Norme JCMWA/MICCAO, Ngaoundere 1998 - 33 lettres", LETTERS)
    make_pdf(os.path.join(OUT, "guide-voyelles.pdf"),
             "Pular Ajami - Voyelles et diacritiques",
             "Les 5 voyelles, le sukun et l'allongement", VOYELLES)
    make_pdf(os.path.join(OUT, "cahier-phrases.pdf"),
             "Pular Ajami - Cahier de phrases",
             "Vocabulaire de base et exercices", PHRASES)

    with open(os.path.join(OUT, "alphabet-ajami.txt"), "w", encoding="utf-8") as f:
        f.write("ALPHABET AJAMI HARMONISE DU PULAR (Unicode)\n"
                "Copiez-collez ces caracteres.\n\n")
        rows = [
            ("a (long)", "ا"), ("b", "ب"), ("b implosif (ɓ)", "Ɓ"), ("t", "ت"),
            ("s (emprunt)", "ث"), ("j", "ج"), ("h", "ح"), ("kh (emprunt)", "خ"),
            ("d", "د"), ("j (emprunt)", "ذ"), ("r", "ر"), ("j (emprunt)", "ز"),
            ("s", "س"), ("c (tch)", "ش"), ("s (emprunt)", "ص"), ("d (emprunt)", "ض"),
            ("d implosif (ɗ)", "ط"), ("j (emprunt)", "ظ"), ("' support", "ع"),
            ("g", "غ"), ("f", "ڢ"), ("p", "ݠ"), ("k/g (emprunt)", "ق"),
            ("k", "ک"), ("l", "ل"), ("m", "م"), ("n", "ن"), ("h (emprunt)", "ه"),
            ("w/oo/uu", "و"), ("ee (long)", "ىٰ"), ("y/ii", "ي"),
            ("y mouille (ƴ)", "ƴ"), ("ny", "ɲ"), ("coupure (emprunt)", "ء"),
        ]
        for latin, a in rows:
            f.write("%-22s %s\n" % (latin, a))
        f.write("\nDiacritiques : a = ـَ   i = ـِ   u = ـُ   e = ـٕ   o = ـٚ   sukun = ـْ\n")
        f.write("Digrammes : mb = مب   nd = ند   nj = نج   ng = نغ\n")
    print("OK alphabet-ajami.txt")

    with open(os.path.join(OUT, "vocabulaire-ajami.txt"), "w", encoding="utf-8") as f:
        f.write("VOCABULAIRE PULAR AJAMI (Unicode)\n\n")
        vocab = [
            ("jam", "جَمْ", "la paix / ça va"),
            ("a jaraama", "عَ جَرَامَ", "bonjour / merci"),
            ("jam wa?", "جَمْ وَ؟", "ça va ?"),
            ("jam tan", "جَمْ تَنْ", "ça va, paix seulement"),
            ("ndiyam", "نديَمْ", "l'eau"),
            ("hendu", "حَندُ", "le vent"),
            ("fombina", "ڢٚمبِنَ", "le sud"),
            ("njaareendi", "نجَارٕنديْ", "le sable"),
            ("mbarugo", "مبَرُغْ", "tuer"),
            ("sendugo", "سَندُغْ", "séparer"),
            ("wi'a", "وِعَ", "dire"),
            ("min", "مِنْ", "moi / nous"),
            ("jawmiraawo", "جَوْمُرَاوْ", "le seigneur / le chef"),
            ("ngarol", "نغَرْلْ", "la beauté"),
            ("bingel", "Ɓِنغْغٕلْ", "l'enfant"),
            ("ngaynaaka", "نغَيْنَاكَ", "l'élevage"),
        ]
        for latin, a, fr in vocab:
            f.write("%-14s %-16s %s\n" % (latin, a, fr))
    print("OK vocabulaire-ajami.txt")
