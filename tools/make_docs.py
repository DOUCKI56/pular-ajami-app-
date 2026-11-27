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


LETTERS = """GUIDE DE L'ALPHABET AJAMI PULAAR HARMONISE
Reference : Manuel de transcription Ajami Pulaar <-> Latin harmonise
(alphabet harmonise de Bamako, 1987) - document des formateurs.

CONSONNES STANDARD (15)
  B = ب   T = ت   J = ج   D = د   R = ر   S = س   F = ف
  K = ك   G = گ   L = ل   M = م   N = ن   H = ه   W = و   Y = ي

CONSONNES SPECIFIQUES DU PULAAR (7)
  Ɓ (Bha)  = injectif bilabial
  P (Pa)   = consonne sourde
  Ɗ (Dha)  = injectif alveolaire
  C (Tha)  = affriquee (se prononce "tch")
  Ƴ (Yha)  = glottalisee
  Ŋ (Nha)  = nasale velare
  Ñ (Nya)  = nasale palatale ("gn" en francais)

CONSONNES PRENASALISEES (phonemes uniques, toujours avec un Noun ن)
  Mb = نب     Nd = ند    Nj = نج    Ng = نگ    Nd = نط

Exemples valides :
  بَابَ Baaba    تَاتِ Taati    دُودُ Duudu    فِلّ Fello
  ݖُلِّ Colli    نديَمْ ndiyam   نگَارِ ngaari   نبٝلُ mbolu

REGLES MAJEURES (voir le manuel HTML complet) :
  Regle 6  : le Chadda double obligatoirement la consonne (فِلّ = Fello).
  Regle 7  : le Waw و est voyelle longue (oo/uu) apres Damma, Potthal
             ou Toral ; consonne w apres Fatha, Kasra ou avec Soukoun.
  Regle 8  : le Hamza porte la voyelle initiale selon l'harmonie
             vocalique (au-dessus أ : a, u, o ; en dessous إ : i, e).
  Regle 9  : pas de Soukoun initial (voyelle d'appui i ou u), sauf
             prénasalisées écrites directement.
  Regle 10 : les noms propres arabes gardent leur orthographe standard.
"""

VOYELLES = """GUIDE DES VOYELLES ET REGLES - PULAAR AJAMI
Reference : Manuel de transcription Ajami Pulaar <-> Latin harmonise.

VOYELLES BREVES (diacritiques)
  a  = fatha     (ـَ)   debut : أَ   (voyelle arriere)
  i  = kasra     (ـِ)   debut : إِ   (voyelle avant)
  u  = damma     (ـُ)   debut : أُ   (voyelle arriere)
  e  = Teral     (ـࣹ)   debut : إࣹ   (voyelle anterieure)
  e  = variante  (ـٖ)   debut : إٖ   (equivalent du Teral)
  o  = Toral     (ـࣷ)   debut : إࣷ   (voyelle posterieure)
  o  = Potthal   (ـٝ)   debut : أٝ   (voyelle posterieure)

VOYELLES LONGUES (prolongation)
  aa = ا        ii = ئِي (ou ي)      uu = أُو
  ee = ئࣹي      oo = ئُو (ou و)      ee ouvert = ئٜي

REGLES CLEFS
  Regle 6 : le Chadda ( ّ ) double la consonne en latin.
  Regle 7 : lecture du Waw selon la voyelle precedente.
  Regle 8 : siege du Hamza selon l'harmonie vocalique.
  Regle 9 : pas de Soukoun initial ; prénasalisées directes.
  Regle 10 : noms propres arabes en orthographe standard.
"""

PHRASES = """CAHIER DE PHRASES ET VOCABULAIRE - PULAAR AJAMI
Vocabulaire valide (transcription latine ; formes ajami dans
l'application et dans vocabulaire-ajami.txt)

SALUTATIONS
  a jaraama          bonjour / merci
  jam wa?            ca va ?
  jam tan            ca va, paix seulement

VOCABULAIRE
  baaba              le pere
  ndiyam             l'eau
  ngaari             la vache
  colli              les oiseaux
  fello              la montagne
  naamu              le riz
  duudu              doucement
  kawtal             le groupe, l'association
  ñaari              deux
  mawnugol           grandir
  wuuri              vivre
  ooddoo             boire
  istool             le tabouret (emprunt)

NOMBRES (1 a 10)
  go'o, ñaari, tati, nawi, joyi, jeego,
  jeewi, jeetati, teedi, sappo

EXERCICE
Traduisez en pulaar puis ecrivez en ajami :
1. L'eau et la vache.   2. Paix seulement.   3. Le pere boit.
"""

if __name__ == "__main__":
    make_pdf(os.path.join(OUT, "guide-alphabet.pdf"),
             "Pular Ajami - Alphabet harmonise",
             "Manuel de transcription Ajami Pulaar <-> Latin (Bamako, 1987)", LETTERS)
    make_pdf(os.path.join(OUT, "guide-voyelles.pdf"),
             "Pular Ajami - Voyelles et regles",
             "Voyelles breves et longues, regles 6 a 10", VOYELLES)
    make_pdf(os.path.join(OUT, "cahier-phrases.pdf"),
             "Pular Ajami - Cahier de phrases",
             "Vocabulaire valide et exercices", PHRASES)

    letters_rows = [
        ("B", "ب"), ("T", "ت"), ("J", "ج"), ("D", "د"), ("R", "ر"), ("S", "س"),
        ("F", "ف"), ("K", "ك"), ("G", "گ"), ("L", "ل"), ("M", "م"), ("N", "ن"),
        ("H", "ه"), ("W", "و"), ("Y", "ي"),
        ("Ɓ (Bha)", "ࢠ"), ("P (Pa)", "پ"), ("Ɗ (Dha)", "ط"), ("C (Tha)", "ݖ"),
        ("Ƴ (Yha)", "ڃ"), ("Ŋ (Nha)", "ݝ"), ("Ñ (Nya)", "ݧ"),
        ("Mb", "نب"), ("Nd", "ند"), ("Nj", "نج"), ("Ng", "نگ"), ("Nɗ", "نط"),
    ]
    with open(os.path.join(OUT, "alphabet-ajami.txt"), "w", encoding="utf-8") as f:
        f.write("ALPHABET AJAMI PULAAR HARMONISE (Unicode)\n"
                "Reference : Manuel de transcription Ajami Pulaar <-> Latin harmonise (Bamako, 1987)\n"
                "Copiez-collez ces caracteres.\n\n")
        for latin, a in letters_rows:
            f.write("%-12s %s\n" % (latin, a))
        f.write("\nVoyelles breves : a = ـَ   i = ـِ   u = ـُ   e = ـࣹ (ou ـٖ)   o = ـࣷ (ou ـٝ)\n")
        f.write("Voyelles longues : aa = ا   ii = ئِي   uu = أُو   ee = ئࣹي   oo = ئُو   èè = ئٜي\n")
        f.write("Siege du Hamza (debut de mot) : أَ a, أُ u, أٝ o / إِ i, إࣹ e, إٖ e, إࣷ o\n")
    print("OK alphabet-ajami.txt")

    vocab_rows = [
        ("a jaraama", "أَ جَرَامَ", "bonjour / merci"),
        ("jam wa?", "جَمْ وَ؟", "ça va ?"),
        ("jam tan", "جَمْ تَنْ", "ça va, paix seulement"),
        ("baaba", "بَابَ", "le père"),
        ("ndiyam", "نديَمْ", "l'eau"),
        ("ngaari", "نگَارِ", "la vache"),
        ("colli", "ݖُلِّ", "les oiseaux"),
        ("fello", "فِلّ", "la montagne"),
        ("naamu", "نَامُ", "le riz"),
        ("duudu", "دُودُ", "doucement"),
        ("kawtal", "كَوتَلْ", "le groupe, l'association"),
        ("ñaari", "ݧَارِ", "deux"),
        ("mawnugol", "مَوْنُگٝلْ", "grandir"),
        ("wuuri", "وُورِ", "vivre"),
        ("ooɗoo", "أٝوطٝو", "boire"),
        ("istool", "إِسْتٝول", "le tabouret (emprunt)"),
    ]
    with open(os.path.join(OUT, "vocabulaire-ajami.txt"), "w", encoding="utf-8") as f:
        f.write("VOCABULAIRE PULAAR AJAMI (Unicode) - graphies validees\n\n")
        for latin, a, fr in vocab_rows:
            f.write("%-12s %-16s %s\n" % (latin, a, fr))
    print("OK vocabulaire-ajami.txt")
