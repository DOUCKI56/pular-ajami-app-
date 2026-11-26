/* Données pédagogiques — Pular (fulfulde) en ajami harmonisé.
 * Orthographe de référence : alphabet ajami harmonisé du fulfulde,
 * agréé à la conférence JCMWA/MICCAO de Ngaoundéré (1998), 33 lettres.
 * Les formateurs peuvent modifier ou enrichir ce fichier sans toucher au code.
 */

const DATA = {};

/* ============ 1. ALPHABET AJAMI HARMONISÉ (33 lettres + hamza) ============ */
DATA.alphabet = [
  { aj: "\u0627", latin: "a (long)", name: "alii\u01e7i", ipa: "a\u02d0", type: "base",
    forms: { iso: "\u0627", fin: "\u0640\u0627" }, joins: false,
    note: "Allonge la voyelle a. Au début d'un mot pular, on utilise \u2018ayni (\u0639) comme support de la voyelle.",
    loan: false },
  { aj: "\u0628", latin: "b", name: "bee", ipa: "b", type: "base",
    forms: { iso: "\u0628", ini: "\u0628\u0640", med: "\u0640\u0628\u0640", fin: "\u0640\u0628" }, joins: true,
    example: { word: "bee", fr: "nom de la lettre b" }, loan: false },
  { aj: "\u08A1", latin: "\u0253", name: "\u0253ee mo\u0257u", ipa: "\u0253", type: "base", unique: true,
    forms: { iso: "\u08A1", ini: "\u08A1\u0640", med: "\u0640\u08A1\u0640", fin: "\u0640\u08A1" }, joins: true,
    note: "Lettre propre au fulfulde : \u1d50b implosive, comme dans \u00ab \u0253i\u014bgel \u00bb (enfant).", loan: false },
  { aj: "\u062A", latin: "t", name: "tee", ipa: "t", type: "base",
    forms: { iso: "\u062A", ini: "\u062A\u0640", med: "\u0640\u062A\u0640", fin: "\u0640\u062A" }, joins: true, loan: false },
  { aj: "\u062B", latin: "s", name: "camamlu", ipa: "s", type: "base",
    forms: { iso: "\u062B", ini: "\u062B\u0640", med: "\u0640\u062B\u0640", fin: "\u0640\u062B" }, joins: true,
    note: "Lettre d'origine arabe, r\u00e9serv\u00e9e aux emprunts \u00e0 l'arabe.", loan: true },
  { aj: "\u062C", latin: "j", name: "jiimi", ipa: "d\u0361\u0292", type: "base",
    forms: { iso: "\u062C", ini: "\u062C\u0640", med: "\u0640\u062C\u0640", fin: "\u0640\u062C" }, joins: true, loan: false },
  { aj: "\u062D", latin: "h", name: "\u1e25aa baaluul", ipa: "h", type: "base",
    forms: { iso: "\u062D", ini: "\u062D\u0640", med: "\u0640\u062D\u0640", fin: "\u0640\u062D" }, joins: true,
    note: "Se prononce h dans les mots pular (contrairement \u00e0 l'arabe).", loan: false },
  { aj: "\u062E", latin: "kh", name: "\u1e25aa to\u0253\u0253u", ipa: "h", type: "base",
    forms: { iso: "\u062E", ini: "\u062E\u0640", med: "\u0640\u062E\u0640", fin: "\u0640\u062E" }, joins: true,
    note: "Emprunts arabes : se prononce h ou kh en pular.", loan: true },
  { aj: "\u062F", latin: "d", name: "deeli", ipa: "d", type: "base",
    forms: { iso: "\u062F", fin: "\u0640\u062F" }, joins: false, loan: false },
  { aj: "\u0630", latin: "j", name: "jaali", ipa: "d\u0361\u0292", type: "base",
    forms: { iso: "\u0630", fin: "\u0640\u0630" }, joins: false,
    note: "Emprunts arabes : se prononce j en pular.", loan: true },
  { aj: "\u0631", latin: "r", name: "arre", ipa: "\u027E", type: "base",
    forms: { iso: "\u0631", fin: "\u0640\u0631" }, joins: false,
    note: "R roul\u00e9. Avec chadda (\u0631\u0651), il devient r roul\u00e9 long (rr).", loan: false },
  { aj: "\u0632", latin: "j", name: "jayra", ipa: "d\u0361\u0292", type: "base",
    forms: { iso: "\u0632", fin: "\u0640\u0632" }, joins: false,
    note: "Emprunts arabes : se prononce j en pular.", loan: true },
  { aj: "\u0633", latin: "s", name: "siini", ipa: "s", type: "base",
    forms: { iso: "\u0633", ini: "\u0633\u0640", med: "\u0640\u0633\u0640", fin: "\u0640\u0633" }, joins: true, loan: false },
  { aj: "\u0634", latin: "c", name: "ciini", ipa: "t\u0361\u0283", type: "base",
    forms: { iso: "\u0634", ini: "\u0634\u0640", med: "\u0640\u0634\u0640", fin: "\u0640\u0634" }, joins: true,
    note: "Se prononce c (tch) comme dans \u00ab tchao \u00bb.", loan: false },
  { aj: "\u0635", latin: "s", name: "saadi", ipa: "s", type: "base",
    forms: { iso: "\u0635", ini: "\u0635\u0640", med: "\u0640\u0635\u0640", fin: "\u0640\u0635" }, joins: true,
    note: "Emprunts arabes.", loan: true },
  { aj: "\u0636", latin: "d", name: "\u1e0daadi", ipa: "d", type: "base",
    forms: { iso: "\u0636", ini: "\u0636\u0640", med: "\u0640\u0636\u0640", fin: "\u0640\u0636" }, joins: true,
    note: "Emprunts arabes.", loan: true },
  { aj: "\u0637", latin: "\u0257", name: "\u0257aadi", ipa: "\u0257", type: "base",
    forms: { iso: "\u0637", ini: "\u0637\u0640", med: "\u0640\u0637\u0640", fin: "\u0640\u0637" }, joins: true,
    note: "Se prononce \u0257 (d implosive), comme dans \u00ab \u0257iyam \u00bb.", loan: false },
  { aj: "\u0638", latin: "j", name: "jaadi", ipa: "d\u0361\u0292", type: "base",
    forms: { iso: "\u0638", fin: "\u0640\u0638" }, joins: false,
    note: "Emprunts arabes.", loan: true },
  { aj: "\u0639", latin: "' (support)", name: "ayni", ipa: "\u2205", type: "base",
    forms: { iso: "\u0639", ini: "\u0639\u0640", med: "\u0640\u0639\u0640", fin: "\u0640\u0639" }, joins: true,
    note: "Innovation pular : support des voyelles en d\u00e9but de mot et entre voyelles.", loan: false },
  { aj: "\u063A", latin: "g", name: "a\u014bgani", ipa: "g", type: "base",
    forms: { iso: "\u063A", ini: "\u063A\u0640", med: "\u0640\u063A\u0640", fin: "\u0640\u063A" }, joins: true,
    note: "Se prononce g (comme dans \u00ab gare \u00bb).", loan: false },
  { aj: "\u06A2", latin: "f", name: "fee", ipa: "f", type: "base",
    forms: { iso: "\u06A2", ini: "\u06A2\u0640", med: "\u0640\u06A2\u0640", fin: "\u0640\u06A2" }, joins: true, loan: false },
  { aj: "\u0760", latin: "p", name: "pee", ipa: "p", type: "base", unique: true,
    forms: { iso: "\u0760", ini: "\u0760\u0640", med: "\u0640\u0760\u0640", fin: "\u0640\u0760" }, joins: true,
    note: "Lettre propre au fulfulde : p, comme dans \u00ab peewru \u00bb (r\u00f4t).", loan: false },
  { aj: "\u0642", latin: "k / g", name: "gaafu", ipa: "k", type: "base",
    forms: { iso: "\u0642", ini: "\u0642\u0640", med: "\u0640\u0642\u0640", fin: "\u0640\u0642" }, joins: true,
    note: "Emprunts arabes : se prononce k ou g en pular.", loan: true },
  { aj: "\u06A9", latin: "k", name: "keefu", ipa: "k", type: "base",
    forms: { iso: "\u06A9", ini: "\u06A9\u0640", med: "\u0640\u06A9\u0640", fin: "\u0640\u06A9" }, joins: true, loan: false },
  { aj: "\u0644", latin: "l", name: "laamu", ipa: "l", type: "base",
    forms: { iso: "\u0644", ini: "\u0644\u0640", med: "\u0640\u0644\u0640", fin: "\u0640\u0644" }, joins: true, loan: false },
  { aj: "\u0645", latin: "m", name: "miimi", ipa: "m", type: "base",
    forms: { iso: "\u0645", ini: "\u0645\u0640", med: "\u0640\u0645\u0640", fin: "\u0640\u0645" }, joins: true,
    note: "Sans diacritique, elle fait partie d'un digramme pr\u00e9nasalis\u00e9 (mb).", loan: false },
  { aj: "\u0646", latin: "n", name: "nuunu", ipa: "n", type: "base",
    forms: { iso: "\u0646", ini: "\u0646\u0640", med: "\u0640\u0646\u0640", fin: "\u0640\u0646" }, joins: true,
    note: "Sans diacritique, elle fait partie d'un digramme pr\u00e9nasalis\u00e9 (nd, ng, nj).", loan: false },
  { aj: "\u0647", latin: "h", name: "\u1e25aa peetel", ipa: "h", type: "base",
    forms: { iso: "\u0647", ini: "\u0647\u0640", med: "\u0640\u0647\u0640", fin: "\u0640\u0647" }, joins: true,
    note: "Emprunts arabes uniquement ; sinon on emploie \u1e25aa baaluul (\u062D).", loan: true },
  { aj: "\u0648", latin: "w / oo / uu", name: "waawu", ipa: "w", type: "base",
    forms: { iso: "\u0648", fin: "\u0640\u0648" }, joins: false,
    note: "Consonne w, ou allongement des voyelles o et u (preceding letter carries \u065B or \u064F).", loan: false },
  { aj: "\u0649\u0670", latin: "ee", name: "yah \u1e63iin", ipa: "e\u02d0", type: "base",
    forms: { iso: "\u0649\u0670", ini: "\u0649\u0670\u0640", med: "\u0640\u0649\u0670\u0640", fin: "\u0640\u0649\u0670" }, joins: true,
    note: "Allonge la voyelle e : la lettre pr\u00e9c\u00e9dente porte le point souscrit (\u065C).", loan: false },
  { aj: "\u064A", latin: "y / ii", name: "yah", ipa: "j", type: "base",
    forms: { iso: "\u064A", ini: "\u064A\u0640", med: "\u0640\u064A\u0640", fin: "\u0640\u064A" }, joins: true,
    note: "Consonne y, ou allongement de la voyelle i.", loan: false },
  { aj: "\u08A8", latin: "\u01b4", name: "yah mo\u0257i", ipa: "j\u02e4", type: "base", unique: true,
    forms: { iso: "\u08A8", ini: "\u08A8\u0640", med: "\u0640\u08A8\u0640", fin: "\u0640\u08A8" }, joins: true,
    note: "Lettre propre au fulfulde : y mouill\u00e9 (\u01b4), comme dans \u00ab \u01b4ami \u00bb (dire).", loan: false },
  { aj: "\u08A9", latin: "ny", name: "nya", ipa: "\u0272", type: "base", unique: true,
    forms: { iso: "\u08A9", ini: "\u08A9\u0640", med: "\u0640\u08A9\u0640", fin: "\u0640\u08A9" }, joins: true,
    note: "Lettre propre au fulfulde : ny, comme dans \u00ab \u0272aw \u00bb (b\u0153uf).", loan: false },
  { aj: "\u0621", latin: "' (coupure)", name: "hamaja", ipa: "\u0294", type: "base",
    forms: { iso: "\u0621" }, joins: false,
    note: "Emprunts arabes uniquement ; dans les mots pular, on emploie ayni (\u0639).", loan: true }
];

/* ============ 2. VOYELLES ET DIACRITIQUES ============ */
DATA.vowels = {
  intro: "Comme l'arabe n'a que 3 voyelles brèves, l'ajami pular en ajoute 2 grâce à des points : e (point souscrit) et o (damma pointée). Toutes les voyelles s'écrivent ; les consonnes sans voyelle portent le sukun.",
  list: [
    { aj: "\u064E", name: "fat\u1e25a", sound: "a", example: "\u062C\u064E\u0645\u0652 (jam \u2014 paix)" },
    { aj: "\u0650", name: "kasra", sound: "i", example: "\u0645\u0650\u0646\u0652 (min \u2014 moi/nous)" },
    { aj: "\u064F", name: "\u1e0damma", sound: "u", example: "\u062D\u064E\u0646\u062F\u064F (hendu \u2014 vent)" },
    { aj: "\u065C", name: "point souscrit (im\u0101la)", sound: "e", example: "\u0640\u065C\u0649\u0670 (ee long)" },
    { aj: "\u065B", name: "\u1e0damma point\u00e9e", sound: "o", example: "\u0640\u065B\u0648 (oo long)" },
    { aj: "\u0652", name: "sukun", sound: "aucune voyelle", example: "\u0645\u0652 (consonne ferm\u00e9e)" }
  ],
  initial: {
    title: "Voyelles en début de mot : le support \u2018ayni (\u0639)",
    rows: [
      { aj: "\u0639\u064E", latin: "a" }, { aj: "\u0639\u065C", latin: "e" },
      { aj: "\u0639\u0650", latin: "i" }, { aj: "\u0639\u065B", latin: "o" },
      { aj: "\u0639\u064F", latin: "u" }
    ]
  },
  lengthening: {
    title: "Voyelles longues (allongement)",
    rows: [
      { aj: "\u064E\u0627", latin: "aa" }, { aj: "\u065C\u0649\u0670", latin: "ee" },
      { aj: "\u0650\u064A", latin: "ii" }, { aj: "\u065B\u0648", latin: "oo" },
      { aj: "\u064F\u0648", latin: "uu" }
    ]
  }
};

/* ============ 3. DIGRAMMES PRÉNASALISÉS ============ */
DATA.digraphs = [
  { aj: "\u0645\u0628", latin: "mb", ipa: "\u1d50b", examples: ["\u0645\u0628\u064E\u0631\u064F\u063A\u0652 (mbarugo \u2014 tuer)", "\u06A2\u065B\u0645\u0628\u0650\u0646\u064E (fombina \u2014 sud)"] },
  { aj: "\u0646\u062C", latin: "nj", ipa: "\u207fd\u0361\u0292", examples: ["\u0646\u062C\u064E\u0627\u0631\u065C\u0646\u062F\u0650 (njaareendi \u2014 sable)"] },
  { aj: "\u0646\u062F", latin: "nd", ipa: "\u207fd", examples: ["\u0646\u062F\u0650\u064A\u064E\u0645\u0652 (ndiyam \u2014 eau)", "\u062D\u064E\u0646\u062F\u064F (hendu \u2014 vent)"] },
  { aj: "\u0646\u063A", latin: "ng / \u014b", ipa: "\u014b", examples: ["\u0646\u063A\u064E\u0631\u0652\u0644 (ngarol \u2014 beaut\u00e9)", "\u08A1\u0650\u0646\u063A\u0652\u063A\u065C\u0644 (bingel \u2014 enfant)"] }
];

/* ============ 4. VOCABULAIRE ============ */
DATA.vocabulary = [
  { aj: "\u062C\u064E\u0645\u0652", latin: "jam", fr: "la paix / \u00e7a va", cat: "Salutations" },
  { aj: "\u0639\u064E \u062C\u064E\u0631\u064E\u0627\u0645\u064E", latin: "a jaraama", fr: "bonjour / merci", cat: "Salutations" },
  { aj: "\u062C\u064E\u0645\u0652 \u0648\u064E\u061F", latin: "jam wa?", fr: "\u00e7a va ?", cat: "Salutations" },
  { aj: "\u062C\u064E\u0645\u0652 \u062A\u064E\u0646\u0652", latin: "jam tan", fr: "\u00e7a va, paix seulement", cat: "Salutations" },
  { aj: "\u0646\u062F\u0650\u064A\u064E\u0645\u0652", latin: "ndiyam", fr: "l'eau", cat: "Nature" },
  { aj: "\u062D\u064E\u0646\u062F\u064F", latin: "hendu", fr: "le vent", cat: "Nature" },
  { aj: "\u06A2\u065B\u0645\u0628\u0650\u0646\u064E", latin: "fombina", fr: "le sud", cat: "Nature" },
  { aj: "\u0646\u062C\u064E\u0627\u0631\u065C\u0646\u062F\u0650", latin: "njaareendi", fr: "le sable", cat: "Nature" },
  { aj: "\u0645\u0628\u064E\u0631\u064F\u063A\u0652", latin: "mbarugo", fr: "tuer", cat: "Actions" },
  { aj: "\u0633\u064E\u0646\u062F\u064F\u063A\u0652", latin: "sendugo", fr: "s\u00e9parer", cat: "Actions" },
  { aj: "\u0648\u065C\u0639\u064E", latin: "wi'a", fr: "dire", cat: "Actions" },
  { aj: "\u0645\u0650\u0646\u0652", latin: "min", fr: "moi / nous", cat: "Base" },
  { aj: "\u062C\u064E\u0648\u0652\u0645\u064F\u0631\u064E\u0627\u0648\u065B", latin: "jawmiraawo", fr: "le seigneur / le chef", cat: "Base" },
  { aj: "\u0646\u063A\u064E\u0631\u0652\u0644", latin: "ngarol", fr: "la beaut\u00e9", cat: "Base" },
  { aj: "\u08A1\u0650\u0646\u063A\u0652\u063A\u065C\u0644", latin: "bingel (bi\u014bgel)", fr: "l'enfant", cat: "Famille" },
  { aj: "\u0646\u063A\u064E\u064A\u0652\u0646\u064E\u0627\u06A9\u064E", latin: "ngaynaaka", fr: "l'\u00e9levage (des bovins)", cat: "Vie quotidienne" }
];

/* ============ 5. NOMBRES ============ */
DATA.numbers = [
  { n: 1, latin: "go\u2019o" }, { n: 2, latin: "\u0257i\u0257i" }, { n: 3, latin: "tati" },
  { n: 4, latin: "nawi" }, { n: 5, latin: "joyi" }, { n: 6, latin: "jeego" },
  { n: 7, latin: "jee\u0257i\u0257i" }, { n: 8, latin: "jeetati" }, { n: 9, latin: "tee\u0257i" },
  { n: 10, latin: "sappo" }
];

/* ============ 6. SALLE DE COURS (séances) ============ */
DATA.sessions = [
  {
    id: "s1", level: "D\u00e9butant", title: "D\u00e9couverte de l'ajami pular harmonis\u00e9",
    duration: "45 min",
    objectives: [
      "Comprendre ce qu'est l'ajami et pourquoi un alphabet harmonis\u00e9",
      "Reconna\u00eetre la logique de l'\u00e9criture de droite \u00e0 gauche",
      "D\u00e9couvrir les 5 voyelles du pular"
    ],
    content: "L'ajami est l'\u00e9criture du pular avec l'alphabet arabe adapt\u00e9. Depuis la conf\u00e9rence de Ngaound\u00e9r\u00e9 (1998), un alphabet harmonis\u00e9 de 33 lettres est agr\u00e9\u00e9 : 29 lettres issues de l'arabe et 4 lettres propres au fulfulde (\u0253, p, \u01b4, ny). Contrairement \u00e0 l'arabe, on \u00e9crit toutes les voyelles avec des diacritiques. On \u00e9crit de droite \u00e0 gauche.",
    quiz: "alphabet"
  },
  {
    id: "s2", level: "D\u00e9butant", title: "Premi\u00e8res lettres : b, t, j, d, r, s",
    duration: "45 min",
    objectives: ["Lire et \u00e9crire 6 lettres de base", "Prononcer leur son", "Les relier entre elles"],
    content: "Apprenons : bee (\u0628, b), tee (\u062A, t), jiimi (\u062C, j), deeli (\u062F, d), arre (\u0631, r), siini (\u0633, s). Observez les 4 formes de chaque lettre : isol\u00e9e, initiale, m\u00e9diane, finale. Exemple de mot : ndiyam (eau) utilise d reli\u00e9 \u00e0 i.",
    quiz: "alphabet"
  },
  {
    id: "s3", level: "D\u00e9butant", title: "Lettres suivantes : g, f, k, l, m, n et le support \u2018ayni",
    duration: "45 min",
    objectives: ["Lire et \u00e9crire 6 nouvelles lettres", "Comprendre le r\u00f4le de \u2018ayni (\u0639)"],
    content: "a\u014bgani (\u063A, g), fee (\u06A2, f), keefu (\u06A9, k), laamu (\u0644, l), miimi (\u0645, m), nuunu (\u0646, n). Le pular ne commence jamais un mot par alif : la voyelle initiale s'appuie sur ayni (\u0639), comme dans a jaraama (\u0639\u064E \u062C\u064E\u0631\u064E\u0627\u0645\u064E).",
    quiz: "alphabet"
  },
  {
    id: "s4", level: "D\u00e9butant", title: "Les 4 lettres propres au fulfulde : \u0253, p, \u01b4, ny",
    duration: "45 min",
    objectives: ["Ma\u00eetriser les lettres sp\u00e9cifiques du fulfulde", "Distinguer b/\u0253, f/p, y/\u01b4, n/ny"],
    content: "Quatre lettres ont \u00e9t\u00e9 cr\u00e9\u00e9es pour le fulfulde : \u0253ee mo\u0257u (\u08A1, \u0253), pee (\u0760, p), yah mo\u0257i (\u08A8, \u01b4), nya (\u08A9, ny). Elles n'existent pas en arabe : ce sont les lettres distinctives de l'ajami pular. Exemple : bingel (\u00ab enfant \u00bb) s'\u00e9crit avec \u0253.",
    quiz: "alphabet"
  },
  {
    id: "s5", level: "Interm\u00e9diaire", title: "Les 5 voyelles, le sukun et l'allongement",
    duration: "60 min",
    objectives: ["Placer les 6 diacritiques correctement", "\u00c9crire les voyelles longues aa, ee, ii, oo, uu"],
    content: "Les voyelles br\u00e8ves : a (fat\u1e25a), i (kasra), u (\u1e0damma) ; les voyelles sp\u00e9cifiques : e (point souscrit) et o (\u1e0damma point\u00e9e). Les consonnes sans voyelle portent le sukun. L'allongement se marque avec la lettre suivante : aa (\u064E\u0627), ee (\u065C\u0649\u0670), ii (\u0650\u064A), oo (\u065B\u0648), uu (\u064F\u0648).",
    quiz: "voyelles"
  },
  {
    id: "s6", level: "Interm\u00e9diaire", title: "Consonnes pr\u00e9nasalis\u00e9es : mb, nd, nj, ng",
    duration: "60 min",
    objectives: ["Lire les 4 digrammes", "Comprendre la r\u00e8gle : premi\u00e8re lettre sans diacritique"],
    content: "Le pular poss\u00e8de 4 consonnes pr\u00e9nasalis\u00e9es \u00e9crites avec 2 lettres : mb (\u0645\u0628), nd (\u0646\u062F), nj (\u0646\u062C), ng (\u0646\u063A). R\u00e8gle cl\u00e9 : la premi\u00e8re lettre du digramme (m ou n) ne porte jamais de diacritique. Exemple : mbarugo (tuer) s'\u00e9crit \u0645\u0628\u064E\u0631\u064F\u063A\u0652.",
    quiz: "vocabulaire"
  },
  {
    id: "s7", level: "Interm\u00e9diaire", title: "Lecture de mots et de phrases",
    duration: "60 min",
    objectives: ["Lire \u00e0 voix haute les mots du vocabulaire", "Lire des phrases compl\u00e8tes"],
    content: "Entra\u00eenement de lecture : jam (\u062C\u064E\u0645\u0652), ndiyam (\u0646\u062F\u0650\u064A\u064E\u0645\u0652), hendu (\u062D\u064E\u0646\u062F\u064F), njaareendi (\u0646\u062C\u064E\u0627\u0631\u065C\u0646\u062F\u0650), fombina (\u06A2\u065B\u0645\u0628\u0650\u0646\u064E). Puis les phrases : Jam wa? (va-t-il bien ?), Jam tan (paix seulement), A jaraama (bonjour/merci).",
    quiz: "vocabulaire"
  },
  {
    id: "s8", level: "Avanc\u00e9", title: "\u00c9criture dict\u00e9e et r\u00e9vision g\u00e9n\u00e9rale",
    duration: "60 min",
    objectives: ["\u00c9crire sous dict\u00e9e 10 mots", "R\u00e9viser tout l'alphabet et les voyelles"],
    content: "Votre formateur dicte 10 mots du vocabulaire ; vous les \u00e9crivez dans l'atelier d'\u00e9criture. Ensuite, refaites les 3 quiz de r\u00e9vision jusqu'\u00e0 obtenir au moins 80 % partout. Terminez par le devoir final.",
    quiz: "mots"
  }
];

/* ============ 7. DEVOIRS ET CORRECTIONS ============ */
DATA.homeworks = [
  {
    id: "d1", session: "s4", title: "Recopier l'alphabet harmonis\u00e9",
    due: "Apr\u00e8s la s\u00e9ance 4",
    instructions: "Recopiez les 33 lettres de l'alphabet harmonis\u00e9 (formes isol\u00e9e, initiale, m\u00e9diane, finale) dans votre cahier ou dans l'atelier d'\u00e9criture, puis collez votre travail ici (description ou dict\u00e9e des lettres).",
    correction: {
      published: true,
      text: "Correction type : l'alphabet comporte 33 lettres. V\u00e9rifiez surtout les 4 lettres propres au fulfulde : \u0253 (\u08A1), p (\u0760), \u01b4 (\u08A8), ny (\u08A9), et les lettres qui ne se relient pas \u00e0 gauche : \u0627 \u062F \u0630 \u0631 \u0632 \u0648. Chaque lettre doit porter une voyelle (fat\u1e25a, kasra, \u1e0damma) ou un sukun."
    }
  },
  {
    id: "d2", session: "s7", title: "Lire \u00e0 voix haute 5 mots",
    due: "Apr\u00e8s la s\u00e9ance 7",
    instructions: "Avec l'atelier \u00ab Parler \u00bb, enregistrez-vous en lisant : jam, ndiyam, hendu, njaareendi, fombina. Puis d\u00e9crivez ici votre auto-\u00e9valuation (mots faciles / difficiles).",
    correction: {
      published: true,
      text: "Attendu : jam = \u062C\u064E\u0645\u0652 (j-a-m) ; ndiyam = \u0646\u062F\u0650\u064A\u064E\u0645\u0652 (n-i-y-a-m) ; hendu = \u062D\u064E\u0646\u062F\u064F (h-e-n-d-u) ; njaareendi = \u0646\u062C\u064E\u0627\u0631\u065C\u0646\u062F\u0650 ; fombina = \u06A2\u065B\u0645\u0628\u0650\u0646\u064E. Points de vigilance : le nd de ndiyam/hendu est un digramme (n sans diacritique) et le e de hendu s'\u00e9crit avec le point souscrit."
    }
  },
  {
    id: "d3", session: "s8", title: "\u00c9crire 3 phrases simples",
    due: "Apr\u00e8s la s\u00e9ance 8",
    instructions: "\u00c9crivez en ajami : 1) Jam wa?  2) Jam tan.  3) A jaraama. Utilisez l'atelier d'\u00e9criture pour vous entra\u00eener, puis recopiez vos phrases ici.",
    correction: {
      published: true,
      text: "1) \u062C\u064E\u0645\u0652 \u0648\u064E\u061F  2) \u062C\u064E\u0645\u0652 \u062A\u064E\u0646\u0652  3) \u0639\u064E \u062C\u064E\u0631\u064E\u0627\u0645\u064E. Attention au d\u00e9but de \u00ab a jaraama \u00bb : la voyelle initiale s'\u00e9crit sur ayni (\u0639\u064E), jamais sur alif."
    }
  }
];

/* ============ 8. FORMATEURS ============ */
DATA.trainers = [
  { id: "t1", name: "Formateur principal", subject: "Alphabet et lecture", contact: "\u00c0 compl\u00e9ter dans js/data.js" },
  { id: "t2", name: "Formateur assistant", subject: "\u00c9criture et devoirs", contact: "\u00c0 compl\u00e9ter dans js/data.js" }
];

/* ============ 9. DOCUMENTS TÉLÉCHARGEABLES ============ */
DATA.docs = [
  { file: "docs/guide-alphabet.pdf", label: "Guide de l'alphabet harmonis\u00e9 (PDF)", note: "Les 33 lettres, noms, sons et \u00e9quivalents latins." },
  { file: "docs/guide-voyelles.pdf", label: "Guide des voyelles et diacritiques (PDF)", note: "Les 5 voyelles, le sukun, les voyelles longues." },
  { file: "docs/cahier-phrases.pdf", label: "Cahier de phrases et vocabulaire (PDF)", note: "Vocabulaire de base avec prononciation." },
  { file: "docs/alphabet-ajami.txt", label: "Alphabet ajami en texte Unicode (TXT)", note: "Pour copier-coller les caract\u00e8res ajami." },
  { file: "docs/vocabulaire-ajami.txt", label: "Vocabulaire ajami en texte Unicode (TXT)", note: "Mots et phrases en \u00e9criture ajami." }
];
