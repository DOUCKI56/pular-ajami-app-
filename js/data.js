/* Données pédagogiques — Pulaar en ajami, orthographe VALIDÉE.
 * Référence : Manuel de transcription Ajami Pulaar ⇄ Latin harmonisé
 * (alphabet harmonisé de Bamako, 1987) — document des formateurs :
 * docs/Regles_Ajami_Pulaar.html
 * Les formateurs peuvent modifier ou enrichir ce fichier sans toucher au code.
 */

const DATA = {};

DATA.meta = {
  reference: "Manuel de transcription Ajami Pulaar ⇄ Latin harmonisé (alphabet harmonisé de Bamako, 1987)",
  rulesDoc: "docs/Regles_Ajami_Pulaar.html"
};

/* ============ 1. CONSONNES : 15 STANDARD + 7 SPÉCIFIQUES ============ */
DATA.alphabet = [
  { aj: "ب", latin: "B", name: "B", joins: true,
    ex: { aj: "بَابَ", latin: "Baaba" } },
  { aj: "ت", latin: "T", name: "T", joins: true,
    ex: { aj: "تَاتِ", latin: "Taati" } },
  { aj: "ج", latin: "J", name: "J", joins: true,
    ex: { aj: "جَاجَ", latin: "Jaaja" } },
  { aj: "د", latin: "D", name: "D", joins: false,
    ex: { aj: "دُودُ", latin: "Duudu" } },
  { aj: "ر", latin: "R", name: "R", joins: false,
    ex: { aj: "رࣹيدُ", latin: "Rèèdu" } },
  { aj: "س", latin: "S", name: "S", joins: true,
    ex: { aj: "سَسَ", latin: "Sasa" } },
  { aj: "ف", latin: "F", name: "F", joins: true,
    ex: { aj: "فِلّ", latin: "Fello" },
    note: "Avec chadda ( ّ ), la consonne est doublée : فِلّ ➔ Fello (Règle 6)." },
  { aj: "ك", latin: "K", name: "K", joins: true,
    ex: { aj: "كُلَ", latin: "Kula" } },
  { aj: "گ", latin: "G", name: "G", joins: true,
    ex: { aj: "گَارَ", latin: "Gaara" } },
  { aj: "ل", latin: "L", name: "L", joins: true,
    ex: { aj: "لَنْظَنْ", latin: "Landhan" } },
  { aj: "م", latin: "M", name: "M", joins: true,
    ex: { aj: "مَارْ", latin: "Maaro" } },
  { aj: "ن", latin: "N", name: "N", joins: true,
    ex: { aj: "نَامُ", latin: "Naamu" },
    note: "Sans diacritique, elle forme les prénasalisées mb, nɗ, nj, nd, ng (Règle 9)." },
  { aj: "ه", latin: "H", name: "H", joins: true,
    ex: { aj: "هَوَ", latin: "Hawa" } },
  { aj: "و", latin: "W / oo / uu", name: "Waw", joins: false,
    ex: { aj: "وَادُ", latin: "Waado" },
    note: "Règle 7 : voyelle longue (oo/uu) après Damma, Potthal ou Toral ; consonne w après Fatha, Kasra ou avec Soukoun." },
  { aj: "ي", latin: "Y", name: "Y", joins: true,
    ex: { aj: "يَايࣹ", latin: "Yaayè" } },

  { aj: "ࢠ", latin: "Ɓ (Bha)", name: "Bha", unique: true, joins: true,
    ex: { aj: "ࢠِرَ", latin: "Ɓira" }, desc: "Injectif bilabial" },
  { aj: "پ", latin: "P (Pa)", name: "Pa", unique: true, joins: true,
    ex: { aj: "پُتࣹ", latin: "Putèè" }, desc: "Consonne sourde" },
  { aj: "ط", latin: "Ɗ (Dha)", name: "Dha", unique: true, joins: true,
    ex: { aj: "طَطِ", latin: "Ɗaɗi" }, desc: "Injectif alvéolaire (ɗ)" },
  { aj: "ݖ", latin: "C (Tha)", name: "Tha", unique: true, joins: true,
    ex: { aj: "ݖُلِّ", latin: "Colli" }, desc: "Affriquée — se prononce « tch »" },
  { aj: "ڃ", latin: "Ƴ (Yha)", name: "Yha", unique: true, joins: true,
    ex: { aj: "ڃَمَلْ", latin: "Ƴamal" }, desc: "Glottalisée" },
  { aj: "ݝ", latin: "Ŋ (Nha)", name: "Nha", unique: true, joins: true,
    ex: { aj: "ݝَرِ", latin: "Ŋari" }, desc: "Nasale vélaire" },
  { aj: "ݧ", latin: "Ñ (Nya)", name: "Nya", unique: true, joins: true,
    ex: { aj: "ݧَارِ", latin: "Ñaari" }, desc: "Nasale palatale (« gn » en français)" }
];

/* ============ 2. VOYELLES ============ */
DATA.vowels = {
  intro: "Toutes les voyelles s'écrivent. Les voyelles brèves sont des diacritiques ; le pulaar ajoute des signes propres pour e (Tèral) et o (Toral, Potthal). Le choix du siège du Hamza en début de mot suit l'harmonie vocalique (Règle 8).",
  list: [
    { sound: "a", name: "Fatha", aj: "ـَ", init: "أَ", desc: "voyelle arrière" },
    { sound: "i", name: "Kasra", aj: "ـِ", init: "إِ", desc: "voyelle avant" },
    { sound: "u", name: "Damma", aj: "ـُ", init: "أُ", desc: "voyelle arrière" },
    { sound: "e (Tèral)", name: "Tèral", aj: "ـࣹ", init: "إࣹ", desc: "voyelle antérieure" },
    { sound: "e (Nèènè)", name: "variante du Tèral", aj: "ـٖ", init: "إٖ", desc: "équivalent du Tèral" },
    { sound: "o (Toral)", name: "Toral", aj: "ـࣷ", init: "إࣷ", desc: "voyelle postérieure" },
    { sound: "o (Potthal)", name: "Potthal", aj: "ـٝ", init: "أٝ", desc: "voyelle postérieure" }
  ],
  lengthening: {
    title: "Voyelles longues (prolongation)",
    rows: [
      { aj: "ا", latin: "aa" },
      { aj: "ئِي (ou ي)", latin: "ii" },
      { aj: "أُو", latin: "uu" },
      { aj: "ئࣹي", latin: "ee" },
      { aj: "ئُو (ou و)", latin: "oo" },
      { aj: "ئٜي", latin: "èè" }
    ]
  },
  initial: {
    title: "Le siège du Hamza en début de mot (Règle 8)",
    back: [
      { aj: "أَ", latin: "a" }, { aj: "أُ", latin: "u" }, { aj: "أٝ", latin: "o" }
    ],
    front: [
      { aj: "إِ", latin: "i" }, { aj: "إࣹ", latin: "e" }, { aj: "إٖ", latin: "e" }, { aj: "إࣷ", latin: "o" }
    ]
  }
};

/* ============ 3. RÈGLES MAJEURES (Règles 6 à 10) ============ */
DATA.rules = [
  { title: "Règle 6 — Le Chadda ( ّ ) : redoublement de consonne",
    text: "Une consonne portant le Chadda est obligatoirement doublée (géminée) en latin. Exemples : فِلّ ➔ Fello (Fello avec ll) ; Ghirritagol ➔ قِرِّتَگُلْ (chadda sur le ر)." },
  { title: "Règle 7 — Le Waw (و) : consonne ou voyelle ?",
    text: "La lecture du Waw dépend strictement de la voyelle qui le précède. Waw = voyelle longue (oo / uu) s'il est précédé d'une Damma (ـُ), d'un Potthal (ـٝ) ou d'un Toral (ـࣷ) : وُورِ ➔ wuuri, أٝوطٝو ➔ ooɗoo. Waw = consonne (w) s'il est précédé d'une Fatha (ـَ) ou d'une Kasra (ـِ), ou s'il porte un Soukoun (وْ) : كَوتَلْ ➔ kawtal, مَوْنُگٝلْ ➔ mawnugol." },
  { title: "Règle 8 — Le siège du Hamza",
    text: "En début de mot, le Hamza sert de support à la voyelle selon l'harmonie vocalique. Hamza au-dessus أ (voyelles arrière) : a (أَ), u (أُ), o (أٝ). Hamza en dessous إ (voyelles avant) : i (إِ), e (إࣹ ou إٖ), o fermé (إࣷ)." },
  { title: "Règle 9 — Le Soukoun initial et les prénasalisées",
    text: "Consonnes simples : interdiction absolue de commencer un mot par un Soukoun — on ajoute une voyelle d'appui i ou u (stool ➔ إِسْتٝول, istool). Consonnes prénasalisées (mb, nd, nj, ng, nɗ) : phonèmes uniques, écrites directement, sans voyelle d'appui et sans Soukoun sur le Noun : ndiyam ➔ نديَمْ, ngaari ➔ نگَارِ, mbolu ➔ نبٝلُ, njoowri ➔ نجٝورِ." },
  { title: "Règle 10 — Exception des noms propres arabes",
    text: "Les noms des Prophètes et des Compagnons ne suivent pas les règles phonétiques pulaar : ils conservent leur orthographe arabe standard. Exemples : Muhammadu ➔ مُحَمَّدُ, 'Umaru ➔ عُمَرُ." }
];

/* ============ 4. CONSONNES PRÉNASALISÉES (toujours avec Noun) ============ */
DATA.digraphs = [
  { aj: "نب", latin: "Mb", ex: { aj: "نبٝلُ", latin: "mbolu" } },
  { aj: "نط", latin: "Nɗ", ex: { aj: "نطَ", latin: "nɗa" } },
  { aj: "نج", latin: "Nj", ex: { aj: "نجٝورِ", latin: "njoowri" } },
  { aj: "ند", latin: "Nd", ex: { aj: "نديَمْ", latin: "ndiyam" } },
  { aj: "نگ", latin: "Ng", ex: { aj: "نگَارِ", latin: "ngaari" } }
];

/* ============ 5. VOCABULAIRE (graphies validées) ============ */
DATA.vocabulary = [
  { aj: "أَ جَرَامَ", latin: "a jaraama", fr: "bonjour / merci", cat: "Salutations" },
  { aj: "جَمْ وَ؟", latin: "jam wa?", fr: "ça va ?", cat: "Salutations" },
  { aj: "جَمْ تَنْ", latin: "jam tan", fr: "ça va, paix seulement", cat: "Salutations" },
  { aj: "بَابَ", latin: "baaba", fr: "le père", cat: "Famille" },
  { aj: "نديَمْ", latin: "ndiyam", fr: "l'eau", cat: "Nature" },
  { aj: "نگَارِ", latin: "ngaari", fr: "la vache", cat: "Nature" },
  { aj: "ݖُلِّ", latin: "colli", fr: "les oiseaux", cat: "Nature" },
  { aj: "فِلّ", latin: "fello", fr: "la montagne", cat: "Nature" },
  { aj: "نَامُ", latin: "naamu", fr: "le riz", cat: "Vie quotidienne" },
  { aj: "دُودُ", latin: "duudu", fr: "doucement", cat: "Base" },
  { aj: "كَوتَلْ", latin: "kawtal", fr: "le groupe, l'association", cat: "Base" },
  { aj: "ݧَارِ", latin: "ñaari", fr: "deux", cat: "Base" },
  { aj: "مَوْنُگٝلْ", latin: "mawnugol", fr: "grandir", cat: "Actions" },
  { aj: "وُورِ", latin: "wuuri", fr: "vivre", cat: "Actions" },
  { aj: "أٝوطٝو", latin: "ooɗoo", fr: "boire", cat: "Actions" },
  { aj: "إِسْتٝول", latin: "istool", fr: "le tabouret (emprunt)", cat: "Emprunts" }
];

/* ============ 6. NOMBRES ============ */
DATA.numbers = [
  { n: 1, latin: "go'o" }, { n: 2, latin: "ñaari" }, { n: 3, latin: "tati" },
  { n: 4, latin: "nawi" }, { n: 5, latin: "joyi" }, { n: 6, latin: "jeego" },
  { n: 7, latin: "jeewi" }, { n: 8, latin: "jeetati" }, { n: 9, latin: "teeɗi" },
  { n: 10, latin: "sappo" }
];

/* ============ 7. SALLE DE COURS (séances) ============ */
DATA.sessions = [
  {
    id: "s1", level: "Débutant", title: "Découverte de l'ajami pulaar harmonisé",
    duration: "45 min",
    objectives: [
      "Comprendre ce qu'est l'ajami pulaar et son alphabet harmonisé",
      "Reconnaître l'écriture de droite à gauche",
      "Découvrir les 5 voyelles et l'harmonie vocalique"
    ],
    content: "L'ajami écrit le pulaar avec l'alphabet arabe modifié. Référence : le manuel de transcription Ajami Pulaar ⇄ Latin harmonisé (alphabet harmonisé de Bamako, 1987). Il compte 15 consonnes standard (ب ت ج د ر س ف ك گ ل م ن ه و ي) et 7 consonnes spécifiques propres au pulaar (ࢠ پ ط ݖ ڃ ݝ ݧ). Toutes les voyelles s'écrivent : les brèves avec des diacritiques, les longues avec des lettres d'appui. On écrit de droite à gauche.",
    quiz: "alphabet"
  },
  {
    id: "s2", level: "Débutant", title: "Premières lettres : b, t, j, d, r, s",
    duration: "45 min",
    objectives: ["Lire et écrire 6 lettres de base", "Lire les exemples : baaba, taati, jaaja, duudu, rèèdu, sasa"],
    content: "Apprenons : B (ب), T (ت), J (ج), D (د), R (ر), S (س). Exemples validés : بَابَ ➔ Baaba, تَاتِ ➔ Taati, جَاجَ ➔ Jaaja, دُودُ ➔ Duudu, رࣹيدُ ➔ Rèèdu, سَسَ ➔ Sasa. Observez que certaines lettres (د, ر) ne se relient pas à la lettre suivante.",
    quiz: "alphabet"
  },
  {
    id: "s3", level: "Débutant", title: "Lettres suivantes : g, f, k, l, m, n, h, w, y",
    duration: "45 min",
    objectives: ["Lire et écrire 9 nouvelles lettres", "Comprendre le Waw (Règle 7) et le siège du Hamza (Règle 8)"],
    content: "گ (G), ف (F), ك (K), ل (L), م (M), ن (N), ه (H), و (W), ي (Y). Deux règles clés : le Waw و est voyelle longue (oo/uu) après Damma, Potthal ou Toral, mais consonne w après Fatha, Kasra ou avec Soukoun (Règle 7). En début de mot, le Hamza porte la voyelle selon l'harmonie vocalique : أ pour a, u, o — إ pour i, e (Règle 8).",
    quiz: "alphabet"
  },
  {
    id: "s4", level: "Débutant", title: "Les 7 consonnes spécifiques du pulaar : Ɓ P Ɗ C Ƴ Ŋ Ñ",
    duration: "45 min",
    objectives: ["Maîtriser les lettres spécifiques", "Distinguer B/Ɓ, D/Ɗ, Y/Ƴ, N/Ŋ, N/Ñ"],
    content: "Sept lettres sont propres au pulaar : Ɓ (ࢠ, injectif bilabial), P (پ, sourde), Ɗ (ط, injectif alvéolaire), C (ݖ, affriquée « tch »), Ƴ (ڃ, glottalisée), Ŋ (ݝ, nasale vélaire), Ñ (ݧ, nasale palatale « gn »). Exemples validés : ࢠِرَ ➔ Ɓira, پُتࣹ ➔ Putèè, طَطِ ➔ Ɗaɗi, ݖُلِّ ➔ Colli, ڃَمَلْ ➔ Ƴamal, ݝَرِ ➔ Ŋari, ݧَارِ ➔ Ñaari.",
    quiz: "alphabet"
  },
  {
    id: "s5", level: "Intermédiaire", title: "Les voyelles : brèves, variantes e et o, longues",
    duration: "60 min",
    objectives: ["Placer les diacritiques a, i, u et les variantes e, o", "Écrire les voyelles longues aa, ii, uu, ee, oo, èè"],
    content: "Voyelles brèves : a (ـَ Fatha), i (ـِ Kasra), u (ـُ Damma), e (ـࣹ Tèral, ou variante ـٖ), o (ـࣷ Toral, ou ـٝ Potthal). Voyelles longues : aa (ا), ii (ئِي ou ي), uu (أُو), ee (ئࣹي), oo (ئُو ou و), èè (ئٜي). Le siège du Hamza en début de mot suit l'harmonie vocalique (Règle 8).",
    quiz: "voyelles"
  },
  {
    id: "s6", level: "Intermédiaire", title: "Consonnes prénasalisées : Mb, Nɗ, Nj, Nd, Ng",
    duration: "60 min",
    objectives: ["Lire les 5 digrammes prénasalisés", "Appliquer la règle du Noun sans Soukoun (Règle 9)"],
    content: "Les prénasalisées mb, nd, nj, ng, nɗ sont des phonèmes uniques. En Ajami, elles s'écrivent toujours avec un Noun (ن), sans voyelle d'appui et sans Soukoun sur le Noun : نب (Mb), نط (Nɗ), نج (Nj), ند (Nd), نگ (Ng). Exemples validés : نبٝلُ ➔ mbolu, نطَ ➔ nɗa, نجٝورِ ➔ njoowri, نديَمْ ➔ ndiyam, نگَارِ ➔ ngaari. Rappel (Règle 9) : les autres consonnes ne commencent jamais un mot par un Soukoun — on ajoute une voyelle d'appui i ou u (stool ➔ إِسْتٝول).",
    quiz: "vocabulaire"
  },
  {
    id: "s7", level: "Intermédiaire", title: "Lecture de mots et de phrases",
    duration: "60 min",
    objectives: ["Lire à voix haute les mots du vocabulaire", "Appliquer les règles 6, 7 et 8 en lecture"],
    content: "Entraînement de lecture : baaba (بَابَ), ndiyam (نديَمْ), ngaari (نگَارِ), colli (ݖُلِّ), fello (فِلّ), ooɗoo (أٝوطٝو), kawtal (كَوتَلْ), mawnugol (مَوْنُگٝلْ). Attention : le Chadda double la consonne (فِلّ ➔ Fello) et le Waw se lit selon la voyelle qui précède (وُورِ ➔ wuuri mais كَوتَلْ ➔ kawtal).",
    quiz: "vocabulaire"
  },
  {
    id: "s8", level: "Avancé", title: "Écriture dictée et révision générale",
    duration: "60 min",
    objectives: ["Écrire sous dictée 10 mots", "Réviser consonnes, voyelles et règles 6 à 10"],
    content: "Votre formateur dicte 10 mots du vocabulaire ; vous les écrivez dans l'atelier d'écriture. Vérifiez notamment : le Chadda (Règle 6), le Waw (Règle 7), le siège du Hamza (Règle 8), l'absence de Soukoun initial (Règle 9) et les noms propres arabes (Règle 10 : مُحَمَّدُ, عُمَرُ). Ensuite, refaites les quiz de révision jusqu'à obtenir au moins 80 % partout.",
    quiz: "mots"
  }
];

/* ============ 8. DEVOIRS ET CORRECTIONS ============ */
DATA.homeworks = [
  {
    id: "d1", session: "s4", title: "Recopier l'alphabet harmonisé",
    due: "Après la séance 4",
    instructions: "Recopiez les 22 consonnes (15 standard + 7 spécifiques) dans votre cahier ou dans l'atelier d'écriture, puis collez votre travail ici (description ou dictée des lettres).",
    correction: {
      published: true,
      text: "Correction type : 15 consonnes standard (ب ت ج د ر س ف ك گ ل م ن ه و ي) et 7 consonnes spécifiques (ࢠ Ɓ, پ P, ط Ɗ, ݖ C, ڃ Ƴ, ݝ Ŋ, ݧ Ñ). Vérifiez les lettres qui ne se relient pas à la suivante (د, ر, و) et la règle du Chadda (Règle 6)."
    }
  },
  {
    id: "d2", session: "s7", title: "Lire à voix haute 5 mots",
    due: "Après la séance 7",
    instructions: "Avec l'atelier « Parler », enregistrez-vous en lisant : ndiyam, ngaari, colli, fello, ooɗoo. Puis décrivez ici votre auto-évaluation (mots faciles / difficiles).",
    correction: {
      published: true,
      text: "Attendu : ndiyam = نديَمْ ; ngaari = نگَارِ ; colli = ݖُلِّ ; fello = فِلّ ; ooɗoo = أٝوطٝو. Points de vigilance : le nd de ndiyam s'écrit ند (Noun sans Soukoun, Règle 9) ; le double l de colli vient du Chadda (Règle 6) ; dans ooɗoo, le Waw est voyelle longue après Potthal (Règle 7)."
    }
  },
  {
    id: "d3", session: "s8", title: "Écrire 3 phrases simples",
    due: "Après la séance 8",
    instructions: "Écrivez en ajami : 1) Jam wa?  2) Jam tan.  3) A jaraama. Utilisez l'atelier d'écriture pour vous entraîner, puis recopiez vos phrases ici.",
    correction: {
      published: true,
      text: "1) جَمْ وَ؟  2) جَمْ تَنْ  3) أَ جَرَامَ. Attention au début de « a jaraama » : le a initial s'écrit avec le Hamza au-dessus أَ (harmonie vocalique, Règle 8)."
    }
  }
];

/* ============ 9. FORMATEURS ============ */
DATA.trainers = [
  { id: "t1", name: "Formateur principal", subject: "Alphabet et lecture", contact: "À compléter dans js/data.js" },
  { id: "t2", name: "Formateur assistant", subject: "Écriture et devoirs", contact: "À compléter dans js/data.js" }
];

/* ============ 10. DOCUMENTS TÉLÉCHARGEABLES ============ */
DATA.docs = [
  { file: "docs/Regles_Ajami_Pulaar.html", label: "Manuel de transcription complet (HTML)", note: "Toutes les règles, tableaux et exceptions validés — le document de référence." },
  { file: "docs/guide-alphabet.pdf", label: "Guide de l'alphabet harmonisé (PDF)", note: "Consonnes standard et spécifiques, avec exemples validés." },
  { file: "docs/guide-voyelles.pdf", label: "Guide des voyelles et règles (PDF)", note: "Voyelles brèves et longues, siège du Hamza, règles 6 à 10." },
  { file: "docs/cahier-phrases.pdf", label: "Cahier de phrases et vocabulaire (PDF)", note: "Vocabulaire validé avec prononciation." },
  { file: "docs/alphabet-ajami.txt", label: "Alphabet ajami en texte Unicode (TXT)", note: "Pour copier-coller les caractères ajami." },
  { file: "docs/vocabulaire-ajami.txt", label: "Vocabulaire ajami en texte Unicode (TXT)", note: "Mots et phrases en écriture ajami." }
];
