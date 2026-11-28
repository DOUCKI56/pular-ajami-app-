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
    note: "Règle 7 : voyelle longue (oo/uu) après Tural (Damma) ou Toral (o) ; consonne w après Pocal (Fatha), Pical (Kasra) ou avec Soukoun." },
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
  intro: "Toutes les voyelles s'écrivent. Les voyelles brèves sont des diacritiques ; le pulaar ajoute des signes propres pour e (Teral : ࣹ ou ٖ) et o (Toral : ࣷ ou ٝ). Le choix du siège du Hamza en début de mot suit l'harmonie vocalique (Règle 8).",
  list: [
    { sound: "a", name: "Pocal (Fatha)", aj: "ـَ", init: "أَ", desc: "voyelle arrière" },
    { sound: "i", name: "Pical (Kasra)", aj: "ـِ", init: "إِ", desc: "voyelle avant" },
    { sound: "u", name: "Tural (Damma)", aj: "ـُ", init: "أُ", desc: "voyelle arrière" },
    { sound: "e (Teral)", name: "Teral", aj: "ـࣹ", init: "إࣹ", desc: "voyelle antérieure — Hamza en dessous إࣹ, jamais أࣹ" },
    { sound: "e (Nèènè)", name: "variante du Teral", aj: "ـٖ", init: "إٖ", desc: "équivalent du Teral" },
    { sound: "o (Toral)", name: "Toral", aj: "ـࣷ", init: "إࣷ", desc: "voyelle postérieure" },
    { sound: "o (Toral ٝ)", name: "Toral (variante ٝ)", aj: "ـٝ", init: "أٝ", desc: "voyelle postérieure — variante du Toral" }
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
  { title: "Règle 7 — Le Waw (و) : consonne ou voyelle d'allongement ?",
    text: "La lecture du Waw dépend strictement de la voyelle qui le précède. Waw = consonne (w) s'il est précédé d'une Pocal (Fatha ـَ) ou d'une Pical (Kasra ـِ), ou s'il porte un Soukoun (وْ) : كَوتَلْ ➔ kawtal, هَوتُطَا ➔ hawtuɗa, مَوْنُگٝلْ ➔ mawnugol. Waw = voyelle longue (oo / uu) s'il est précédé d'une Tural (Damma ـُ), il allonge la voyelle : أٝوطٝو ➔ ooɗoo, وُورِ ➔ wuuri." },
  { title: "Règle 8 — Le siège du Hamza",
    text: "En début de mot, le Hamza sert de support à la voyelle selon l'harmonie vocalique. Hamza au-dessus أ (voyelles arrière) : a (أَ), u (أُ), o (أٝ). Hamza en dessous إ (voyelles avant) : i (إِ), e (إࣹ ou إٖ), o fermé (إࣷ). Attention : le e (Teral) prend toujours le Hamza en dessous إࣹ — jamais أࣹ." },
  { title: "Règle 9 — Interdiction absolue du Soukoun en début de mot",
    text: "Aucun mot pulaar ne peut commencer par une syllabe fermée (consonne + Soukoun). Cela vaut y compris pour les prénasalisées (mb, nd, nj, ng)." },
  { title: "Règle 10 — Exception des noms propres arabes",
    text: "Les noms des Prophètes et des Compagnons ne suivent pas les règles phonétiques pulaar : ils conservent leur orthographe arabe standard. Exemples : Muhammadu ➔ مُحَمَّدُ, 'Umaru ➔ عُمَرُ." }
];

/* ============ 4. CONSONNES PRÉNASALISÉES (toujours avec Noun) ============ */
DATA.digraphs = [
  { aj: "نب", latin: "Mb", ex: { aj: "نبࣹيوَ", latin: "mbeewa" } },
  { aj: "نط", latin: "Nɗ", ex: { aj: "نطَ", latin: "Nɗa" } },
  { aj: "نج", latin: "Nj", ex: { aj: "نجَارࣹ", latin: "njaare" } },
  { aj: "ند", latin: "Nd", ex: { aj: "ندࣹرْ", latin: "nder" } },
  { aj: "نگ", latin: "Ng", ex: { aj: "نگَارِ", latin: "ngaari" } }
];

/* ============ 5. VOCABULAIRE (graphies validées) ============ */
DATA.vocabulary = [
  { aj: "أَ جَرَامَ", latin: "a jaraama", fr: "bonjour / merci", cat: "Salutations" },
  { aj: "جَمْ وَ؟", latin: "jam wa?", fr: "ça va ?", cat: "Salutations" },
  { aj: "جَمْ تَنْ", latin: "jam tan", fr: "ça va, paix seulement", cat: "Salutations" },
  { aj: "بَابَ", latin: "baaba", fr: "le père", cat: "Famille" },
  { aj: "ندِيَمْ", latin: "ndiyam", fr: "l'eau", cat: "Nature" },
  { aj: "نبࣹيوَ", latin: "mbeewa", fr: "la chèvre", cat: "Nature" },
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
    content: "گ (G), ف (F), ك (K), ل (L), م (M), ن (N), ه (H), و (W), ي (Y). Deux règles clés : le Waw و est voyelle longue (oo/uu) après Tural (Damma), ٝ ou Toral, mais consonne w après Pocal (Fatha), Pical (Kasra) ou avec Soukoun (Règle 7). En début de mot, le Hamza porte la voyelle selon l'harmonie vocalique : أ pour a, u, o — إ pour i, e (Règle 8).",
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
    content: "Voyelles brèves : a (ـَ Pocal), i (ـِ Pical), u (ـُ Tural), e (ـࣹ Teral, ou variante ـٖ), o (ـࣷ Toral, ou variante ـٝ). Voyelles longues : aa (ا), ii (ئِي ou ي), uu (أُو), ee (ئࣹي), oo (ئُو ou و), èè (ئٜي). Le siège du Hamza en début de mot suit l'harmonie vocalique (Règle 8).",
    quiz: "voyelles"
  },
  {
    id: "s6", level: "Intermédiaire", title: "Consonnes prénasalisées : Mb, Nɗ, Nj, Nd, Ng",
    duration: "60 min",
    objectives: ["Lire les 5 digrammes prénasalisés", "Écrire les prénasalisées en début de mot sans Soukoun (Règle 9)"],
    content: "Les prénasalisées mb, nd, nj, ng, nɗ sont des phonèmes uniques. En Ajami, elles s'écrivent toujours avec un Noun (ن) : نب (Mb), نط (Nɗ), نج (Nj), ند (Nd), نگ (Ng). Exemples validés : نبࣹيوَ ➔ mbeewa, نطَ ➔ Nɗa, نجَارࣹ ➔ njaare, ندࣹرْ ➔ nder, نگَارِ ➔ ngaari. Attention (Règle 9) : en début de mot, les prénasalisées s'écrivent directement, sans Soukoun et sans voyelle d'appui ; seules les consonnes simples prennent une voyelle d'appui (stool ➔ إِسْتٝول istool).",
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
  },
  {
    id: "s9", level: "Avancé", title: "Lecture : Hadith 16 (Abû Dharr) — arabe et pular ajami",
    duration: "60 min",
    objectives: [
      "Lire un texte arabe entier avec ses voyelles",
      "Lire la traduction pular en ajami harmonisé",
      "Repérer les lettres spécifiques (ڃ ݝ ݧ ࢠ) et les prénasalisées dans un vrai texte"
    ],
    content: "📿 الحديث 16 — عَنْ أَبي ذَرٍّ رضي الله عنه أَيضًا أَنَّ أُنَاسًا مِنْ أَصحَابِ رَسُولِ اللهِ صلى الله عليه وسلم قَالوا لِلنَّبِيِّ صلى الله عليه وسلم : يَا رَسُولَ اللهِ، ذَهَبَ أَهلُ الدُّثُورِ بِالأُجُورِ، يُصَلُّوْنَ كَمَا نُصَلِّي، وَيَصُومُونَ كَمَا نَصُومُ، وَيَتَصَدَّقُوْنَ بِفُضُولِ أَمْوَالِهِمْ.\nقَالَ : (أَوَ لَيْسَ قَدْ جَعَلَ اللهُ لَكُمْ مَا تَصَّدَّقُوْنَ ؟ إِنَّ بِكُلِّ تَسْبِيْحَةٍ صَدَقَةٌ، وَكُلِّ تَكْبِيْرَةٍ صَدَقَةٌ، وَكُلِّ تَحْمِيْدَةٍ صَدَقَةٌ، وَكُلِّ تَهْلِيْلَةٍ صَدَقَةٌ، وَأَمْرٌ بِالمَعْرُوْفِ صَدَقَةٌ، وَنَهْيٌ عَنْ مُنْكَرٍ صَدَقَةٌ، وَفِي بُضْعِ أَحَدِكُمْ صَدَقَةٌ).\nقَالُوا : يَا رَسُوْلَ اللهِ، أَيَأْتِي أَحَدُنَا شَهوَتَهُ وَيَكُوْنُ لَهُ فِيْهَا أَجْرٌ ؟ قَالَ : أَرَأَيْتُمْ لَوْ وَضَعَهَا فِي حَرَامٍ أَكَانَ عَلَيْهِ وِزْرٌ ؟ فَكَذَلِكَ إِذَا وَضَعَهَا فِي الحَلالِ كَانَ لَهُ أَجْرٌ.\n📚 رَوَاهُ البُخَارِيُّ وَمُسْلِمٌ\n▪️ پُلَرْ :\n✍️ ڃࣹتَّامَ إࣹ أَبي ذَرٍّ كَدِ (يٝ اللّٰـهُ وࣹلࣹمٝ) أٝوِئِ : يِمْࢠࣹگٝو إِمّٝرْدࣹ إࣹ سَحَابَاࢠࣹ نࣹلَاطٝأٝنْ ﷺ وِأَنّٝ أَنَّبَاجٝأٝنْ ؛\n« كٝأٝنٝنْ يٝ نࣹلَاطٝ، يِمْࢠࣹ نگَلُوجِطِنْ لَنِّي نَࢠُدࣹ بَرَاجِطِنْ، هِࢠࣹ جُولُدࣹ وَنٝ مࣹنْ وٝنِ جُولِرْدࣹ، هِࢠࣹ هٝورٝدࣹ وَنٝ مࣹنْ وٝنِ هٝورِرْدࣹ، هِࢠࣹ إِتُّدࣹ سَدَكَ كٝ ࢠُرِ تࣹدُّدࣹ إࣹ جَوْلࣹ مَࢠَّࣹطࣹنْ،\nࢠࣹ مَاكِ ﷺ :\n« إࣹ لَاتَاكِ تَبِتِي اللّٰـهُ وَطَنِيأٝنْ كٝ إِتّٝنْ سَدَكَ ؟ أَنْندࣹي ؛\nكَلَ سࣹنِنِانگٝ كٝ سَدَكَ / سبحان الله\nكَلَ هَبِّرَانگٝ كٝ سَدَكَ / الله أكبر\nكَلَ حَمْدِنَانگٝ كٝ سَدَكَ / الحمد لله\nكَلَ سِنْتِرَانگٝ كٝ سَدَكَ / لا اله إلا الله\nيَمِرْگٝلْ كٝ مٝڃِّ كٝ سَدَكَ،\nهَطُگٝلْ كٝ أَݧَا كٝ سَدَكَ،\nوٝنِي إࣹ هُيْرࣹ گٝوتٝ كَلَ إࣹ مٝنْ سَدَكَ،\nࢠࣹ وِئِ : كٝأَنْ يٝ نࣹلَاطٝ اللّٰـهُ، گٝطّٝ إࣹ أَمࣹنْ أَرَيْ إِتَّ تُويٝ مُنْگٝنْ طُنْ لَاتَنٝومٝ بَرَاجِ ؟\nࢠࣹ مَاكِ ﷺ : يࣹيتࣹلَنْ سِأٝ وَطُنٝ طُنْ كَ حَرْمِ، نَا لَاتَنْتٝنٝ مٝ بَكَّاتُ ؟ كٝوَنٝ نٝنِ كَدِ سِأٝ وَطِيطُنْ كَ دَگِي لَاتَنٝرْتَ مٝ بَرَاجِ. »\n📚 فِلِّكࣹ البُخَارِيُّ إࣹ مُسْلِمٌ\n💡 Pistes de lecture : repérez les lettres spécifiques (ڃ ݝ ݧ ࢠ), les prénasalisées (گٝ، نٝ) et les voyelles longues (ا، وٝ). Les noms propres arabes (أَبي ذَرٍّ، البُخَارِيُّ) suivent la Règle 10 : orthographe arabe standard."
  ,
    quiz: "vocabulaire"
  },
  {
    id: "s10", level: "Avancé", title: "Lecture : la da'wa (دَعْوَة) — Dr. Muhammad Maka Bah",
    duration: "60 min",
    objectives: [
      "Lire un extrait de conférence en pular ajami harmonisé",
      "Reconnaître le discours rapporté (« أَ أَدِّي كࣹسُنْ »)",
      "S'habituer aux mots empruntés à l'arabe (دَعْوَة)"
    ],
    content: "♦️ «أَلَا هَيْ هُوندࣹ كٝ وَلِّتٝتٝوئࣹنْ هࣹݖِّنْطِنْگٝلْ \u201cدَعْوَة\u201d أٝنْ إࣹ ندࣹرْ نٝكّࣹيلِ مࣹنْ طِنْ [فُوتَ جَلٝو] ࢠُرِ وِطَگٝلْ بَتّࣹيجِ فࣹڃُّࢠّࣹنْ.\nكٝوَطِنٝنْ ؛ أَوَاوَتَا يࣹيتَادࣹ گٝطّٝ ݖࣹرْنٝ سَنبَ مَاكِي [...]، أٝيࣹيتٝمَا أَ أَدِّي كࣹسُنْ.\nأٝ وِأَدٝو وࣹلَالِمٝ، مَا أٝ وَطَتَا،\nكٝنٝنٝنْ أٝوِأَتَا \u201cأَ أَدِّي كࣹسُنْ\u201d.\nكٝوَنٝنٝنْ ݖࣹرْنٝ سَعْدُ…\n🎓 د. محمد مكه باه — حفظه الله تعالى\n💡 Pistes de lecture : le mot دَعْوَة (da'wa, « l'appel ») est un emprunt arabe. [...] marque un passage non transcrit. Repérez le discours rapporté entre guillemets et les prénasalisées (ندࣹرْ، نٝكّࣹيلِ، كٝوَنٝنٝنْ).",
    quiz: "vocabulaire"
  },
  {
    id: "s11", level: "Avancé", title: "Lecture : Hadith 14 — les conseils de Jibril (عش ما شئت)",
    duration: "60 min",
    objectives: [
      "Lire un hadith court entier en arabe et en pular ajami",
      "Suivre une énumération numérotée (١ ٢ ٣ ٤ ٥)",
      "Mémoriser les cinq conseils de Jibril"
    ],
    content: "🔳 الحديث 14\n♦ عَنْ سهل بن سعد رضي الله عنه قَالَ النَّبِيُّ صلى الله عليه و سلم : أتاني جبريل فقال : يا محمد ! عش ما شئت فإنك ميت، وأحبب ما شئت فإنك مفارقه، واعمل ما شئت فإنك مجزي به، واعلم أن شرف المؤمن قيامه بالليل، وعزه استغناؤه عن الناس.\n📚 رواه الطبراني و حسنه الشيخ الألباني في السلسلة الصحيحة رقم ٨٣١\n▪️ پُلَرْ :\n✍️ ڃࣹتَّامَ إࣹ عن سهل بن سعد رضي الله عنه\n▪️ نُلَاطٝ ﷺ مَاكِ : جبريل أَرِيلَنْ : أٝ وِئِ: كٝ أٝنْ يٝ مُـحَـمَّـد ؛\n١- وُورُ إࣹنْنبࣹرࣹ كٝ فَالَاطَا أَنْندُ كٝ أَ مَايٝووٝ ،\n٢- يِطُ كَلَ كٝ فَالَطَا أَ سࣹرْتَيْطٝ إࣹ مُنْ ،\n٣- گٝلُّ كَلَ كٝ فَالَطَا أَنْندُ كٝ أَ يٝࢠࣹتࣹيطٝ طُنْ ،\n٤- أَنْندُ تࣹدُّنگَلْ گٝنْطِنْطٝ كٝ دَرَگٝلْ مَكّٝ جࣹمَّ جُولَ ،\n٥- دٝولࣹ مَكّٝطࣹنْ كَدِ كٝ يٝنْندِنَگٝلْ مَكّٝ گَا إࣹ يِمْࢠࣹࢠࣹنْ .\n📚 رواه الطبراني و حسنه الشيخ الألباني في السلسلة الصحيحة رقم ٨٣١\n💡 Pistes de lecture : lisez les cinq conseils un par un, en arabe puis en pular. Repérez les nombres (١ ٢ ٣ ٤ ٥), le chadda (تࣹدُّنگَلْ، جࣹمَّ) et les voyelles longues (وُورُ، گَا). Exercice : répétez chaque conseil de mémoire.",
    quiz: "vocabulaire"
  },
  {
    id: "s12", level: "Intermédiaire", title: "Lecture : la quête du savoir (گَنْندُ) — أستاذ محمد طيب باه",
    duration: "45 min",
    objectives: [
      "Lire une courte citation en pular ajami harmonisé",
      "Observer la répétition du mot گَنْندُ (le savoir) et ses formes",
      "S'exercer à lire un texte de mémoire après quelques lectures"
    ],
    content: "✍️ «گَنْندُ تࣹدِّنَيْ گَنْندٝ تࣹدِّنَ گَنْندَلْ كَدِ، گَنْندَلْ فِجِرْتَاكࣹ ، كَلَ مٝ يِيطٝنْ نٝ يَوٝو گَنْندَلْ مَا يَوٝو گَنْندٝ وِي يٝو ࢠࣹيْدِتٝيْ هَرَيْ نٝ بَرْكِطِرِمٝ».\n🎓 أستاذ محمد طيب باه -حفظه الله تعالى-\n💡 Pistes de lecture : le mot گَنْندُ (le savoir) revient plusieurs fois avec ses formes گَنْندٝ، گَنْندَلْ — lisez-les lentement en les distinguant. Repérez le chadda (تࣹدِّنَيْ، تࣹدِّنَ، بَرْكِطِرِمٝ) et les voyelles longues (فِجِرْتَاكࣹ، يٝو). Exercice : lisez la citation trois fois, puis répétez-la de mémoire.",
    quiz: "vocabulaire"
  },
  {
    id: "s13", level: "Avancé", title: "Lecture : Hadith 7 — la création en sept jours (رواه مسلم)",
    duration: "60 min",
    objectives: [
      "Lire un hadith long en arabe et en pular ajami",
      "Connaître les noms des jours de la semaine en pular ajami",
      "Suivre une énumération en parallèle arabe / pular"
    ],
    content: "🔳 الحديث 7\n✍️ قال رسول اللّٰـهُ ﷺ :\nخلق الله عز وجل التربة يومَ السبت،\nوخلق فيها الجبال يوم الأحد،\nوخلق الشجر يوم الاثنين،\nوخلق المكروهُ يوم الثلاثاء،\nوخلق النور يوم الأربعاءِ،\nوبثَّ فيها الدواب يوم الخميس،\nوخلق آدم (عليه السلام) بعد العصر من يوم الجمعة،\nفي آخر الخلق،\nفي آخر ساعة من ساعات الجمعة،\nفيما بين العصر إلى الليل.\n📚 رواه مسلم\nپُـلَـرْ -\n★ نُلاَطٝ (ﷺ) مَاكِ : «اللّٰـهُ تࣹدُّطٝ مَوْنُطٝ أٝن؛\nأٝ تَگِي لࣹيْدِندِنْ ݧَنْندࣹ أَسࣹوࣹ،\nأٝتَگِ پࣹلّࣹطࣹنْ إࣹ أَلَتْ،\nأٝ تَگِ لࣹطّࣹطࣹنْ إ تࣹنࣹن،\nأٝ تَگِ أَݧَاطِطِنْ إࣹ تَلَاتَ،\nأٝ تَگِ أَنّٝورَاجِطِنْ إࣹ أَلَرْبَ،\nأٝ سَاكِتِ دَابࣹيجِطِنْ إࣹ مَيْرِ ݧَنْندࣹ أَلْكَمِسَ،\nأٝ تَگِ آدم (يٝ كِسَلْ وٝنُ إࣹ دٝوْ مَكّٝ) إࣹ ࢠَاوٝ أَلَنْسَرَا ݧَنْندࣹ جُمَ، كَ سَكِّتٝرْدࣹ تَگٝدِ مَكّٝ،\nكَ سَكِّتٝرْدࣹ سَاعِ إمّٝرْدࣹ إࣹ سَاعِيجِ جُمَ طِنْ،\nهَكُّندࣹ أَلَنْسَرَاؤٝنْ إࣹ كِيكِطࣹ أٝنْ».\n📚 فِلِّكࣹ مسلم\n💡 Pistes de lecture : les jours de la semaine — أَسࣹوࣹ (samedi), أَلَتْ (dimanche), إ تࣹنࣹن (lundi), تَلَاتَ (mardi), أَلَرْبَ (mercredi), أَلْكَمِسَ (jeudi), جُمَ (vendredi). Lisez chaque ligne en arabe puis en pular, en suivant l'ordre de la création.",
    quiz: "vocabulaire"
  },
  {
    id: "s14", level: "Intermédiaire", title: "Lecture : Hadith 8 — لَقِّنوا موتاكم (رواه مسلم)",
    duration: "45 min",
    objectives: [
      "Lire un hadith très court, arabe et pular",
      "Mémoriser une phrase courte avec sa traduction",
      "Observer la formule de la shahada dans les deux écritures"
    ],
    content: "🔳 الحديث 8\n♦ قال رسول الله ﷺ: «لَقِّنوا موتاكم ”لا إلَهَ إلاَّ اللَّه“.»\n📚 صحيح مسلم (٩١٧)\n▪︎پُـلَـرْ -\n★ نُلاَطٝ (ﷺ) مَاكِ : «لٝنْنگِنࣹي مَايٝوࢠࣹ مٝنْࢠࣹنْ \"لا إلَٰهَ إلاَّ اللّٰـهُ “ (أَلاَ رࣹوࣹتࣹيطٝ إࣹ گٝونگَ سِوٝنَا اللّٰـهُ).»\n📚 فِلِّكࣹ مسلم (٩١٧)\n💡 Pistes de lecture : ce hadith court contient la shahada — lisez-la en arabe puis en pular. Notez la répétition du chadda dans لَقِّنوا (demandez à quelqu'un de répéter) et la voyelle longue de اللّٰـهُ. Exercice : apprenez les deux phrases par cœur.",
    quiz: "vocabulaire"
  },

  /* --- Programme étendu : conjugaison, vocabulaire, grammaire (نُطْنُ وِنْدَنْدِ) --- */
  { "id": "s15", "level": "Intermédiaire", "title": "Conjugaison — وِنْدَنْدِ 1 : les formes verbales", "duration": "45 min", "objectives": ["Compter les trois formes verbales du پُلَار", "Reconnaître la marque de l'infinitif دِ", "Classer les verbes par groupe"], "content": "En پُلَار du فُوتَ تُورُ، nous pouvons compter trois formes verbales.\nPour toutes ces trois formes verbales, la marque de l'infinitif est : دِ.\nIl y a les verbes en :\n· Racine plus دِ ; cette forme a la même valeur que la forme en : racine plus ُ plus دِ.\nDans cette catégorie, nous avons des verbes tels que :\nيَهْدِ : aller, partir\nاَرْدِ : venir\nدُگْدِ : courir, fuir\nدِوْدِ : voler comme l'oiseau\nاَدُّدِ : amener\nتُوْدِ : porter sur les épaules\nلِمْدِ : compter\nهِلْدِ : casser\nجُطْدِ : cuir\nفَهْدِ : renifler\nهَرْدِ : ronfler\nلَپُّدِ ou فِيدِ : frapper\nݧَامْدِ : manger\nيَرْدِ : boire\nتُنْگُدِ : attacher\nنَنْگُدِ ou جَگُّدِ : attraper\nCes verbes se conjuguent de la même manière.\nLa deuxième forme verbale est celle composée de : Racine plus َا plus دِ.", "quiz": "vocabulaire" },
  { "id": "s16", "level": "Intermédiaire", "title": "Conjugaison — وِنْدَنْدِ 2 : l'impératif", "duration": "45 min", "objectives": ["Former l'impératif des verbes racine + دِ", "Former l'impératif des verbes racine + َا + دِ", "Distinguer 2e personne du singulier, pluriel et 3e personne du pluriel"], "content": "Pour les verbes de forme racine plus دِ, l'impératif se présente ainsi :\nAvec la deuxième personne du singulier, il suffit d'éliminer la marque de l'infinitif. Ex. :\nاَرْدِ → اَرْ : venir → viens\nيَلْتُدِ → يَلْتُ : sortir → sors\nلِمْدِ → لِم : compter → compte\nPour la deuxième personne du pluriel, on ajoute ـِن à la racine. Ex. : لِمْدِ → لِمِن ; يَهْدِ → نْجَهِن ; تُتُّدِ → تُتِّن.\nPour la troisième personne du pluriel, on ajoute ـِي à la racine. Ex. : لِمْدِ → لِمِي ; يَهْدِ → نْجَهِي.\nAinsi :\nلِم / لِمِن / لِمِي\nيَهْ / نْجَهِن / نْجَهِي\nPour la deuxième forme verbale, racine plus َا plus دِ, l'impératif se construit ainsi :\n2e pers. sing. : on ajoute ـُ à la racine. Ex. : اُمَّادِ / se lever → اُمُّ / lève-toi ; طَانَادِ / dormir → طَانُ / dors.\n2e pers. pl. : on ajoute ـطِن. Ex. : ݧَاگَادِ / demander → ݧَاگُطِن / demandons.\n3e pers. pl. : on ajoute ـطِي. Ex. : تِلَّادِ / descendre → تِلُطِي / descendez.\nAinsi :\nتِلُ / تِلُطِن / تِلُطِي\nݧَاگُ / ݧَاگُطِن / ݧَاگُطِي", "quiz": "vocabulaire" },
  { "id": "s17", "level": "Intermédiaire", "title": "Conjugaison — وِنْدَنْدِ 3 : le présent (سَهَا گُنَاطُ)", "duration": "60 min", "objectives": ["Conjuguer au présent les verbes racine + دِ (racine + َ)", "Conjuguer au présent les verbes racine + َا + دِ (racine + ُو)", "Connaître les pronoms sujets du présent"], "content": "Pour conjuguer un verbe au présent, il est important de se rappeler des trois formes verbales.\nPour les verbes de la forme racine plus دِ, le présent se construit ainsi : racine plus َ.\nExemple : يَهْدِ / partir\nمِطُ يَهَ، مِطُنِي يَهَ\nاَطَ يَهَ، اَطَنِي يَهَ\nاُومُ يَهَ، اُومُنِي يَهَ\nاِمِن نْجَهَ، اِمِنِي نْجَهَ\nاِطِن نْجَهَ، اِطِنِي نْجَهَ\nاُطُن نْجَهَ، اُطُنِي نْجَهَ\nاِࢠِ نْجَهَ، اِࢠِنِي نْجَهَ\nApplique cette règle avec : مُݧْدِ / patienter ; نَنْگُدِ / attraper.\nPour les verbes de la forme racine plus َا plus دِ, le présent se présente ainsi : racine plus ُو.\nExemple : لِلَادِ / se coucher\nمِطُ لِلُو\nاَطَ لِلُو\nاُومُ لِلُو\nاِمِن لِلُو\nاِطِن لِلُو\nاُطُن لِلُو\nاِࢠِ لِلُو\nApplique cette règle avec : جَࢠَّادِ / accueillir ; هُنَادِ / promettre.\nPour la forme racine plus ِي plus دِ, on construit le présent ainsi : racine plus ِي.", "quiz": "vocabulaire" },
  { "id": "s18", "level": "Avancé", "title": "Conjugaison — وِنْدَنْدِ 4 : le passé (سَهَا ࢠِنُّطُ)", "duration": "60 min", "objectives": ["Conjuguer au سَهَا ࢠِنُّطُ (passé composé) les verbes racine + دِ", "Connaître l'alternance consonantique نْگ", "Connaître la forme racine + َا + دِ (racine + ِيمَ)"], "content": "Il existe cinq types de passé en پُلَار. Pour cette leçon, nous allons nous intéresser au سَهَا ࢠِنُّطُ qui correspond au passé composé français.\nPour la première forme, racine plus دِ, ce type de passé se construit ainsi : racine plus ِي.\nExemple : اُنْدِ / piler\nمِ اُنِي\nاَ اُنِي\nاُ اُنِي\nمِن اُنِي ou مِن نْگُنِي\nاِن اُنِي ou اِن نْگُنِي\nاُن اُنِي ou اُن نْگُنِي\nࢠِ اُنِي ou ࢠِ نْگُنِي\nRemarque : le نْگ est de l'alternance consonantique.\nتِنْدُدِ / conter\nمِ تِنْدِي\nاَ تِنْدِي\nاُ تِنْدِي\nمِن تِنْدِي\nاِن تِنْدِي\nاُن تِنْدِي\nࢠِ تِنْدِي\nPour la deuxième forme, racine plus َا plus دِ, ce type de passé se construit ainsi : racine plus ِيمَ.", "quiz": "vocabulaire" },
  { "id": "s19", "level": "Avancé", "title": "Conjugaison — وِنْدَنْدِ 5 : le futur proche", "duration": "60 min", "objectives": ["Former le futur proche avec مَ + pronom + racine", "Conjuguer les trois groupes au futur proche"], "content": "On construit le futur proche de deux manières. Dans la première, on met مَ devant les pronoms personnels sujets.\nPour les verbes du groupe 1, racine + دِ, la conjugaison se fait ainsi : مَ + pronom + racine.\nدُگْدِ / courir\nمَ مِ دُگ\nمَ اَ دُگ / مَا دُگ\nمَ اُ دُگ / مُو دُگ\nمَ مِن نْدُگ\nمَ اِن نْدُگ / مِن نْدُگ\nمَ اُن نْدُگ / مُن نْدُگ\nمَ ࢠِ نْدُگ\nPour les verbes du groupe 2, racine + َا + دِ, la conjugaison se fait ainsi : racine + ُ.\nلِلَادِ / se coucher\nمَ مِ لِلُو\nمَ اَ لِلُو / مَا لِلُو\nمَ اُ لِلُو / مُو لِلُو\nمَ مِن لِلُو\nمَ اِن لِلُو / مِن لِلُو\nمَ اُن لِلُو / مُن لِلُو\nمَ ࢠِ لِلُو\nPour le groupe 3, racine + ِي + دِ, la conjugaison se fait ainsi : racine + ِ.\nهَࢠِيدِ / se battre\nمَ مِ هَࢠِ\nمَ اَ هَࢠِ ou مَا هَࢠِ\nمَ اُ هَࢠِ ou مُو هَࢠِ\nمَ مِن كَࢠِ\nمَ اِن كَࢠِ ou مِن كَࢠِ\nمَ اُن كَࢠِ ou مُن كَࢠِ\nمَ ࢠِ كَࢠِ", "quiz": "vocabulaire" },
  { "id": "s20", "level": "Débutant", "title": "Vocabulaire — وِنْدَنْدِ 1 : les parties du corps (1)", "duration": "45 min", "objectives": ["Nommer les parties du corps en پُلَار (tête, figure, nuque, œil…)", "Connaître les doublets (م / ك)", "Utiliser les possessifs avec هُورࣹ et كُيࣹ"], "content": "Les différentes parties du corps humain :\nهُورࣹ / كُيࣹ : la tête\nيࣹيسٝ / جࣹيسࣹ ou گࣹيسࣹ : la figure, la face\nهُڃُّدُ / كُڃُّلِي : la nuque\nيِتِرِ / گِتِ : l'œil / les yeux\nتِينْدِ / تِيطِ : le front\nهُنُكُ / كُنُطِ : la bouche\nاَࢠُّگُ / گَࢠُّلِ : la joue\nهِنِرِ / كِنِ : le nez\nنُفْرُ / نُپِّ : l'oreille\nدَانْدِ / دَاطِ : le cou\nسُكْنْدُ / ݖُكْلِي : le cheveu / les cheveux\nExercice :\nهُورࣹ اَم ; هُورࣹ مَا ; هُورࣹ مَكُّ ; كُيࣹ مِن ; كُيࣹ اَمِن ; كُيࣹ مُن ; كُيࣹ مَࢠِّ", "quiz": "vocabulaire" },
  { "id": "s21", "level": "Débutant", "title": "Vocabulaire — وِنْدَنْدِ 2 : les parties du corps (2)", "duration": "45 min", "objectives": ["Nommer la suite des parties du corps (dos, ventre, jambe, bras…)", "Compléter les phrases des exercices"], "content": "Suite leçon sur les parties du corps humain : جُكُّل وِنْدَنْدِ تِرطِ ࢠَنْدُ\nكِيݖِي / كِيݖِيجِ : le dos\nنُورُل / نُورِي : colonne vertébrale\nبَݖِّ : poitrine\nوِرْنْگُ / بِرطِ : côtelettes\nرِيدُ / دِيدِي : ventre\nوُدُّ / گُلِّ : nombril\nاِنْدُ / اِنطِ : sein\nنَدُرْدِ / نَدُرطِ : hanche\nكُيْنْگَل / كُيْطِ : jambe ou pied\nبُهَل / بُهِ : cuisse\nهُفْرُ / كُپِّ : genou\nكُرْلَل / كُرْلِ : avant-jambe\nݖُنْدُنْگُل / ݖُدُّلِي : cheville\nنْجَاࢠُرْدِ / جَاࢠُرطِ : pomme de pied\nفِطِينْدُ / پِطِيلِي : orteil\nتِپِّرِ / تِپِّ : talon\nجُنْگُ / جُوطِ : bras\nوَلَبُ / بَلَبِ : épaule\nنِوْرِ / نِوِ : paume\nفِطِينْدُ / پِطِيلِي : doigt\nExercices :\nكُيْطِ اَبُو اِ اِدِ = كُيْطِ…… = ……\nتِينْدِ مُوسَا = تِينْدِ…… = ……\nبِݖِّ سَمْبَ اِ مِين = بِݖِّ…… = ……\nكُپِّ سَدَ اِ اَنْ = كُپِّ…… = ……\nبُهَل اَم اِ بُهَل مَا = بُهِ…… = ……\nجُنْگُ مَا اِ جُنْگُ مَكُّ = جُوطِ…… = ……", "quiz": "vocabulaire" },
  { "id": "s22", "level": "Débutant", "title": "Vocabulaire — وِنْدَنْدِ 3 : compter en پُلَار (1 à 99)", "duration": "45 min", "objectives": ["Compter de 0 à 9 en پُلَار", "Former les dizaines et les nombres composés"], "content": "Comment compter en پُلَار : لِمِن كَدِي\nنْدِگَ : zéro\nگُو : un\nطِطِ : deux\nتَتِ : trois\nنَيِ : quatre\nجُيِ : cinq\nجِيگُم : six\nجِيطِطِ : sept\nجِيتَتِ : huit\nجِينَيْ : neuf\nDizaines : سَپُّ : dix ; نُوگَاس : vingt ; ݖَپَّنطِ تَتِ : trente ; ݖَپَّنطِ نَيِ : quarante ; ݖَپَّنطِ جُيِ : cinquante ; ݖَپَّنطِ جِيگُم : soixante ; ݖَپَّنطِ جِيطِطِ : soixante-dix ; ݖَپَّنطِ جِيتَتِ : quatre-vingts ; ݖَپَّنطِ جِينَيْ : quatre-vingt-dix.\nEx. : سَپُّ اِ جُيِ : 15 ; نُوگَاس اِ تَتِ : 23.\nݖَپَّنطِ تَتَتِ اِ جِيطِطِ : 37 ; ݖَپَّنطِ نَيِ اِ گُو : 41 ; ݖَپَّنطِ جُيِ اِ جِيتَتِ : 58 ; ݖَپَّنطِ جِيگُم اِ طِطِ : 62 ; ݖَپَّنطِ جِيطِطِ اِ جِينَيْ : 79 ; ݖَپَّنطِ جِيتَتِ اِ نَيِ : 84 ; ݖَپَّنطِ جِينَيْ اِ جِينَيْ : 99.", "quiz": "vocabulaire" },
  { "id": "s23", "level": "Intermédiaire", "title": "Vocabulaire — وِنْدَنْدِ 4 : centaines et milliers", "duration": "60 min", "objectives": ["Former les centaines (تِيمِدِ)", "Former les milliers (اُجُنَّاجِ)", "Placer le nom compté avant ou après le nombre (تِسْكُ)"], "content": "لِمِن كَدِي : comptons encore\nنَاتَنِن تِيمِدِّ اِ اُجُنَّاجِ : entamons les centaines et les milliers.\nتِيمِدِرِ : 100\nتِيمِدِّ طِطِ : 200\nتِيمِدِّ تَتِ : 300\nتِيمِدِّ نَيِ : 400\nتِيمِدِّ جُيِ : 500\nتِيمِدِّ جِيگُم : 600\nتِيمِدِّ جِيطِطِ : 700\nتِيمِدِّ جِيتَتِ : 800\nتِيمِدِّ جِينَيْ : 900\nEx. : تِيمِدِرِ اِ ݖَپَّنطِ تَتِ اِ جِيطِطِ : 137 ; تِيمِدِّ طِطِ اِ ݖَپَّنطِ نَيِ اِ تَتِ : 243 ; تِيمِدِّ تَتِ اِ ݖَپَّنطِ جُيِ اِ گُو : 351 ; تِيمِدِّ جِينَيْ اِ ݖَپَّنطِ جِينَيْ اِ جِينَيْ : 999.\nMilliers : اُجُنِرِ : 1000 ; اُجُنَّاجِ طِطِ : 2000 ; اُجُنَّاجِ تَتِ : 3000 ; اُجُنَّاجِ نَيِ : 4000 ; اُجُنَّاجِ جُيِ : 5000 ; اُجُنَّاجِ جِيگُم : 6000 ; اُجُنَّاجِ جِيطِطِ : 7000 ; اُجُنَّاجِ جِيتَتِ : 8000 ; اُجُنَّاجِ جِينَيْ : 9000.\nEx. : اُجُنِرِ اِ تِيمِدِّ جِيگُم اِ ݖَپَّنطِ تَتِ اِ جِيتَتِ : 1638 ; اُجُنَّاجِ نَيِ اِ تِيمِدِّ طِطِ اِ سَپُّ اِ جِيطِطِ : 4217.\nRemarque تِسْكُ : pour compter quelque chose en پُلَار, le mot à compter peut venir avant ou après. Ex. : تِيمِدِّ تَتِ هُورࣹ ou كُيࣹ تِيمِدِّ تَتِ : deux cents têtes.", "quiz": "vocabulaire" },
  { "id": "s24", "level": "Débutant", "title": "Vocabulaire — وِنْدَنْدِ 5 : les membres de la famille", "duration": "45 min", "objectives": ["Nommer les membres de la famille en پُلَار", "Connaître la forme possessive (تَانِيكُو…)", "Distinguer aîné(e) et cadet(te)"], "content": "Les membres de la famille :\nبَابَ / بَابِرَاࢠِ : père\nنِينِ / نِينِرَاࢠِ ou يُمَّ / يُمِّرَاࢠِ : mère\nࢠِطُّ / ࢠِࢠِّ ou ࢠِيّ : enfant\nمَامَ / مَامِرَاࢠِ ou تَانُو / تَانِرَاࢠِ : grand-père ou grand-mère\nكَاوْ / كَاوِرَاࢠِ : oncle\nگُگُّ ou گُرْگُل / گُرْگِلَاࢠِ : tante\nبَاطِرَاطُ / وَاطِرَاࢠِ : neveu ou nièce\nمِݧِرَاطُ / مِݧِرَاࢠِ : petit frère ou petite sœur\nمَوْنِرَاطُ / مَوْنِرَاࢠِ : grand frère ou grande sœur\nاِسِرَاطُ / اِسِرَاࢠِ : beau-père, belle-mère, beau-frère, belle-sœur\nكِينِرَاطُ / كِينِرَاࢠِ : gendre\nاَفُ : aîné(e)\nكُدُّ : cadet(te)\nRemarque تِسْكُ : on ne dira pas تَانُ مَكُّ mais تَانِيكُو : son grand-père ; تَانِيࢠِ : leurs grands-pères. Valable pour : تَانِيكُو/ِيࢠِ، ࢠِيِيكُو/ِيࢠِ، مَوْنِيكُو/ِيࢠِ، مِݧِيكُو/ِيࢠِ، بَاطِيكُو/ِيࢠِ، اِسِيكُو/ِيࢠِ، كِينِيكُو/ِيࢠِ.", "quiz": "vocabulaire" },
  { "id": "s25", "level": "Débutant", "title": "Vocabulaire — وِنْدَنْدِ 6 : le temps (سَهَا)", "duration": "45 min", "objectives": ["Exprimer les moments de la journée et les périodes", "Parler d'hier, aujourd'hui, demain", "Compter semaines, mois et années"], "content": "سَهَا : LE TEMPS\nجُونِي : actuellement\nنَانِ : il y a un moment\nݧَلَمَ / ݧَلَوْمَاجِ / بَلْطِ : le jour\nوَنْدُوگُ : aube\nسُبَكَ / سُبَكَاجِ : le matin\nكِكِيطِ / كِكِطَاجِ : l'après-midi\nمُتَال نَاݝِ : crépuscule\nجَمَّ / جَمَّاجِ : la soirée, la nuit\nهَنْكِ : hier\nهَنْدِ : aujourd'hui\nجَنْگُ : demain\nࢠَاوْ-جَنْگُ : après-demain\nهِݖِّ-هَنْكِ : avant-hier\nݧَنْدِين : l'autre jour\nيُنْتِرِ / جُنْتِ : semaine\nلِوْرُ / لِبِّ : mois\nهِتَانْدِ / كِتَالِ / دُوࢠِ : année\nهِكَّ : cette année\nرَوَنِ : l'année dernière\nمُ-وُورِي : l'année prochaine\nExercices : deux semaines : يُنْتِرِ طِطِ ; un mois et cinq jours : لِوْرُ اِ بَلْطِ جُيِ ; un an et sept mois : هِتَانْدِ اِ لِبِّ جِيطِطِ ; hier et aujourd'hui : هَنْكِ اِ هَنْدِ.", "quiz": "vocabulaire" },
  { "id": "s26", "level": "Intermédiaire", "title": "Vocabulaire — وِنْدَنْدِ 7 : les jours et les mois", "duration": "45 min", "objectives": ["Nommer les 7 jours de la semaine (origine arabe et création pular)", "Nommer les 12 mois (forme savante et forme pular)"], "content": "LES JOURS ET LES MOIS\nOrigine arabe / création / français :\nاَلْتِنِ / اَاࢠْنْدِ : lundi\nتَلَاتَ / مَوْبَارِ : mardi\nاَلَرْبَ / نْجِسْلَارِ : mercredi\nاَلْكَمِيسَ / نَاسَا : jeudi\nاَلْجُمَاعَ / مَوْن : vendredi\nاَسِت / هُورِ-بِير : samedi\nاَلِت / دِوُ-هُورِ-بِير : dimanche\nMois :\nسَامْوِيِ / سِيلُ : janvier\nفِيبُرْيِ / ݖُلْتِ : février\nمَارْسَ / نْبُويْ : mars\nاَوْرِيل / دُوجَل : avril\nمِ / سِيطْتُ : mai\nسُوِيك / مُرْسِ : juin\nسُولْيِ / كُرْسِ : juillet\nاُت / جُكُ : août\nسَتَمْبَرَ / سِلْتُ : septembre\nاُكْتُوبَر / يَرْكُمَ : octobre\nنُوَمْبُرُ / جُلَل : novembre\nدِيسَمْبُرُ / بُوْتِ : décembre", "quiz": "vocabulaire" },
  { "id": "s27", "level": "Débutant", "title": "Vocabulaire — وِنْدَنْدِ 8 : les salutations (سَلْمِنَانْگُ)", "duration": "45 min", "objectives": ["Saluer selon le moment de la journée", "Répondre aux salutations", "Mener un dialogue complet de salutation"], "content": "LES SALUTATIONS : سَلْمِنَانْگُ\nLe matin : جَم وَالِي / جَم نْبَال-طُن → اَ فِنِي؟ / اُن پِنِي؟ → جَم تَنْ\nVers midi : جَم وِيتِي / جَم نْبِيت-طُن → جَم تَنْ / اِن نْجِتِّي اَللّٰه\nAprès-midi : جَم ݧَلِّ / جَم ݧَل-طُن → جَم تَنْ\nLe soir : جَم هِيرِي / جَم كِير-طُن → اَ هِيرِي اِ جَم / اُن كِيرِي اِ جَم / جَم تَنْ\nنُ گَلِّ اُو : et la maison ? → اِنَ اِ جَم\nنُ ࢠِسْنْگُ نْگُو : et la famille ? → اِࢠِ اِ جَم\nنُ جَوْكَل كَل : et le bien ? → اِنَ اِ جَم\nنُ ࢠَنْدُ نْدُو : et la santé ? → كُ مَوْطُمْ\nنُ … وَطِي : comment va … ? → اُومُ اِ جَم\nكُ مَوْ طُمْ : ça va mieux\nاِطِن نْجِتَّ اَللّٰه : nous remercions Allah\nنُ نْبَط-طَا / نُ نْبَط-طُن : comment vas-tu / allez-vous ?\nاَطَ سِلِّ / اُطُن ݖِلِّ : tu te portes bien / vous vous portez bien\nنُ نْبَط-طَا اِ تَمْپِرِ / نُ نْبَطْدُ-طُن اِ تَمْپِرِ : et la fatigue ?\nنُ گُلِّ طِي : et les activités ?", "quiz": "vocabulaire" },
  { "id": "s28", "level": "Avancé", "title": "Vocabulaire — وِنْدَنْدِ 9 : présenter les condoléances", "duration": "60 min", "objectives": ["Présenter des condoléances en پُلَار", "Répondre aux condoléances", "Employer les formules de prière"], "content": "COMMENT PRÉSENTER LES CONDOLÉANCES EN PULAAR\nA : سَطِي كَا (كُ اَ) نِلْدَاكَ\nB : كُ نِلْدَل اَللّٰه\nA : يُو اَللّٰه يُرْمُ اِن جَهْطُ اُو يَافُو مُ\nB : آمِين\nA : يُو اَللّٰه هَارْنُ مُ اَلْجَنَّة\nB : آمِين\nA : يُو اَللّٰه سُدُّ مُ يُرْمِينْدِ، هَدَّ مُ يُرْمِينْدِ\nB : آمِين\nA : كُ نِهْ دَيْ وُنِي اِ اَدُنَا. يُو اَللّٰه رُكُّ اُن نُ مُݧِرْطُن\nB : آمِين\nB : يُو اَللّٰه وِنْدَنِ بَرَاجِ\nA : آمِين\nB : يُو پِلِ مَا نْجَوْتِنِ كَافَل سِرَاطِ\nA : آمِين\nB : يُو اَ ࢠُويْ يَهْدِ اَ يَهَاكَ\nA : آمِين\nB : يُو نْدِي ݧَمَانْدِ ࢠُويْ هَكُّنْدِ مِن يُࢠَاكَ ou هُتُ وُنْ ݧَمَانْدِ سَكَ يُࢠِي\nA : آمِين", "quiz": "vocabulaire" },
  { "id": "s29", "level": "Intermédiaire", "title": "Vocabulaire — وِنْدَنْدِ 10 : les animaux domestiques (كُلِّ وُرُ)", "duration": "45 min", "objectives": ["Nommer les animaux domestiques en پُلَار", "Connaître le cri de chaque animal", "Connaître la classe nominale de chaque animal"], "content": "LES ANIMAUX DOMESTIQUES : كُلِّ وُرُ\nاُلُّنْدُ / اُلُّطِ : chat — ݝِيوْدِ — مُوس — classe نْدُو/طِي\nرَوَانْدُ / دَوَاطِ : chien — وَوْ — اَيْ — نْدُو/طِي\nنْبِيوَ / نِعِ : chèvre — مِينْدِ — ݖِت — بَا/طِي\nنْدَمْنْدِ / دَمطِ : bouc — مِينْدِ — ݖَ — ݖِت — نْدِي/طِي\nنْبَالُ / بَالِ : mouton — مِينْدِ — اُرَيْ — اِر — نْگُو/طِي\nنْجَوْدِ / جَوطِ : bélier — مِينْدِ — اُرَيْ — اِر — نْدِي/طِي\nپُݖُّ / پُݖِّ : cheval — هِجْدِ — هِي — اُڃ — نْگُو/طِي\nنَگِّ / نَعِ : vache — هُونْدِ — تُرُيْ — نْدِك — نْگِي/طِي\nنْبَبَّ / بَمطِ : âne — هَنْد — كُر — اَرِ — بَا/طِي\nنْگِلُوبَ / گِلُوطِ : chameau — ݝَطْدِ — ? — بَا/طِي\nگِرْتُگَل / گِرْتُوطِ : poulet — جُگُّدِ — كُيْ — كِس/كُس — نْگَل/طِي", "quiz": "vocabulaire" },
  { "id": "s30", "level": "Intermédiaire", "title": "Vocabulaire — وِنْدَنْدِ 11 : les vœux (جُول مُ وُورِي)", "duration": "45 min", "objectives": ["Présenter ses vœux pour une nouvelle vie (mariage, départ…)", "Répondre aux vœux"], "content": "جُول مُ وُورِي\nA : جُول مُ وُورِي … نْجُولِي مُ وُورِي\nB : يُو اَ جُول كِيطِ … يُو اِن نْجُول كِيطِ\nA : يُو اَللّٰه رُكُّ اِن تَاوِيدِ اُو سَهَا نِهْ مُ وُورِي\nB : آمِين، تَاوَ اِطِن ࢠِيْدِي اِن اُسْتَاكِ\nA : اَللّٰه اَݖِّ دِنْتِل فُف، يُو اَللّٰه اَݖُّ دِنْتِل مِن\nB : آمِين، اِنِن كَلَ اِ جُولْࢠِ\nA : يُو اِن ࢠُويْ يَوُنْدِرْدِ\nB : آمِين\nA : اَللّٰه وَطِي اُن سُكَاجِ يُو اَللّٰه وَط اُن مَوْࢠِ مَلَاجِ\nB : آمِين، يُو اُن ࢠُويْ طُو جِيسِ اَمِن طُو.", "quiz": "vocabulaire" },
  { "id": "s31", "level": "Débutant", "title": "Vocabulaire — وِنْدَنْدِ 12 : les couleurs (گُوبُوجِ)", "duration": "45 min", "objectives": ["Nommer les couleurs en پُلَار", "Décrire des objets avec les couleurs"], "content": "LES COULEURS : گُوبُوجِ\nدَنِيجُ : blanc\nࢠَلِيجُ : noir\nبُطِيجُ : rouge\nاُولُ : jaune\nبُلَاجُ : bleu\nپُرُ : cendre\nگُوبُ هَاكُ : vert\nنَاوُ : entre le noir et le teint clair\nݖُويُ : jaunâtre\nEx. : ݖُمْݖُل دَنْوُل : un tissu blanc ; ݧِيڃِ دَنِيجِ : des dents blanches ; سُكْنْدُ رَنِيرُ : une chevelure blanche ; ݝَارِ نْدَنِيرِ : un bœuf blanc ; گِرْتُگَل دَنِوَل : un poulet blanc.", "quiz": "vocabulaire" },
  { "id": "s32", "level": "Intermédiaire", "title": "Grammaire — وِنْدَنْدِ 1 : l'alphabet (اَلْكُلِ)", "duration": "60 min", "objectives": ["Connaître les 37 lettres de l'alphabet پُلَار (API et IAI)", "Classer : voyelles, consonnes simples, nasales, prénasales, glottale", "Distinguer voyelles courtes et longues"], "content": "L'alphabet : اَلْكُلِ ; API et IAI. Le پُلَار utilise ces deux alphabets.\nLes 37 lettres sont divisées en :\n1 – Voyelles : وُوْيِلِّ\nVoyelles courtes : َ ِ ُ ٝ ࣹ\nVoyelles longues : َا ِي ُو ٝو ࣹي\nEx. : هَرْدِ / ronfler et هَارْدِ / être rassasié ; هِرْدِ / être jaloux et هِيرْدِ / soirée ; هُرْدِ / tarir et هُورْدِ / jeûner ; سِلْدِ / dévier et سِيلْدِ / hacher la viande ; تُفَادِ / se faire trouer les oreilles et تُوفَادِ / tendre un piège.\n2 – Consonnes simples : ب ࢠ ݖ د ط ف گ ه ج ك ل پ ق ر س ت و ي ڃ\nݖَام ; جَلُّ ; گِتِ ; گِسِ.\nLettres spécifiques : ط comme طِطِ ; ࢠ comme ࢠِطُّ ; ݝ comme ݝَرِ ; ڃ comme ڃَمَل ; ݧ comme ݧَامْدِ.\n3 – Nasales : م ن ݧ ݝ\n4 – Pré-nasales : نب comme نْبَبَّ ; ند comme نْدُوندِي ; نج comme نْجَمْنْدِ ; نگ comme نْگَلُ.\nLa glottale ء : جِيَل / propriété, parfois جِءَل ; اُولُءُولُوگُ ; هُونْدِ / beugler ou quelque chose ; هُونْءْدِ / sans confusion.", "quiz": "alphabet" },
  { "id": "s33", "level": "Intermédiaire", "title": "Grammaire — وِنْدَنْدِ 2 : les adjectifs possessifs", "duration": "45 min", "objectives": ["Employer les 7 possessifs du پُلَار", "Construire des expressions : هُورࣹ اَم, نِينِ مِن…"], "content": "LES ADJECTIFS POSSESSIFS : سِفَاء جِيَل\nاَم : mon, ma — هُورࣹ اَم\nمَا : ton, ta — هُورࣹ مَا\nمَكُّ : son, sa — هُورࣹ مَكُّ\nمِن : notre, nos inclusif — نِينِ مِن\nاَمِن : notre, nos exclusif — نِينِ اَمِن\nمُن : votre, vos — كَاوْ مُن\nمَࢠِّ : leur, leurs — كَاوْ مَࢠِّ\nRécapitulation : اَم، مَا، مَكُّ، مِن، اَمِن، مُن، مَࢠِّ", "quiz": "vocabulaire" },
  { "id": "s34", "level": "Avancé", "title": "Grammaire — وِنْدَنْدِ 3 : la gémination (سِدُّ)", "duration": "60 min", "objectives": ["Comprendre la gémination (renforcement consonantique)", "Savoir que 5 consonnes ne doublent pas : ر، س، ف، ه، ء", "Gémir les prénasales"], "content": "LA GEMINATION ou سِدُّ\nسِدُّ : renforcement d'une articulation consonantique.\nEx. : جُبُّل / جُبِّ ; دَࢠُّ ; لَݖِّرِي / لَݖِّيجِ ; لَدِّ ; لِطِّ ; گُگُّ ; بَجُّ ; لِكِّ ; پُلُّ ; لَمِّ ; اِنَّ ; سِݧُّدِ ; كَقِّ ; لَپُّلَپِّ ; سَقَّ ; هَوَّا ; لَيَّ ; لِڃِّ.\nDans le پُلَار du فُوتَ تُورُ, cinq consonnes ne doublent pas : ر، س، ف، ه، ء.\nEx. : جَلُ / la houe ; جَلُّ / nom de famille ; كُطُ / un étranger ; كُطُّ / un habitant ; گِتِ / yeux ; گِتِّ / coupe-ongle ; بَگِ / tissu ; بَگِّ / qui ne sont pas mûrs.\nPré-nasales géminées : ننب-نند-ننج-ننگ ; ex. : جُنْگُ ; هَنْدِ ; سَنْجُ ; دِنْبَ.", "quiz": "alphabet" },
  { "id": "s35", "level": "Intermédiaire", "title": "Grammaire — وِنْدَنْدِ 4 : les pronoms personnels sujets", "duration": "45 min", "objectives": ["Connaître les pronoms simples (مِ, اَ, اُ, مِن, اِن, اُن, ࢠِ)", "Connaître les pronoms du présent (مِطُ, اَطَ, اُومُ…)", "Connaître les pronoms du progressif (مِطُنِي, اَطَنِي…)"], "content": "Les pronoms personnels sujets : لُمْتُوجِ اِنْدِ گُلُّوْوُ\nمِ : je ; اَ : tu ; اُ : il/elle\nمِن : nous exclusif ; اِن : nous inclusif ; اُن : vous ; ࢠِ : ils/elles\nPrésent : مِطُ / نْبِطَ / نْبُطُ : je ; اَطَ : tu ; اُومُ : il/elle ; اِمِن : nous exclusif ; اِطِن : nous inclusif ; اُطُن : vous ; اِࢠِ : ils/elles.\nProgressif : مِطُنِي / نْبِطَنِي / نْبُطُنِي ; اَطَنِي ; اُومُنِي ; اِمِنِي ; اِطِنِي ; اُطُنِي ; اِࢠِنِي.", "quiz": "vocabulaire" },
  { "id": "s36", "level": "Avancé", "title": "Grammaire — وِنْدَنْدِ 5 : l'alternance consonantique", "duration": "60 min", "objectives": ["Connaître les consonnes qui ne changent pas", "Connaître les consonnes qui changent une fois (ݖ→س ; ف→پ ; ه→ك)", "Connaître les consonnes qui changent deux fois"], "content": "L'alternance consonantique\nLettres qui ne changent pas : ࢠ، ط، ل، م، ن، ݧ، ݝ، ق، ت، ڃ\nلَانَ : la pirogue — لَاطِ، لَانِل، لَانَل، لَانِرِي، لَانُرُ، لَاكُن، لَاطِيجِ\nݧَامْدِ : مِطُ ݧَامَ، اَطَ ݧَامَ، اُومُ ݧَامَ، اِمِن ݧَامَ، اِطِن ݧَامَ، اُطُن ݧَامَ، اِࢠِ ݧَامَ.\nConsonnes qui changent une fois : ݖ→س ; ف→پ ; ه→ك\nسُودُ → ݖُوطِ، ݖُورِل، ݖُورَل ; مِطُ فِجَ → اِمِن پِجَ ; هُطُ → كُطُولِي.\nConsonnes qui changent deux fois : ر→د→ند ; ي→ج→نج ; ي→گ→نگ ; و→ب→نب ; و→گ→نگ\nرَوَانْدُ → دَوَاطِ → نْدَوْكُن ; يَهْرِ → جَهِن → نْجَهُن ; يِتِرِ → گِتِ → نْگِتُن ; وَانْدُ → بَاطِ → نْبَاكُن ; وُرُ → گُرِ → نْگُرُن.", "quiz": "vocabulaire" },
  { "id": "s37", "level": "Avancé", "title": "Grammaire — وِنْدَنْدِ 6 : les classes nominales (پِلِّ اِنطِ)", "duration": "60 min", "objectives": ["Connaître les principales classes nominales", "Associer chaque classe à ses exemples", "Connaître les pluriels de classe"], "content": "LES CLASSES NOMINALES : پِلِّ اِنطِ\nClasses : اُو، ࢠِي، نْگُو، نْگِي، نْگَل، نْگِل، نْگُل، نْگُو، كَل، كُن، بَا، كِي، كَا، كُو، نْدِي، نْدِي، نْدُو، طَم، طِي، طِي، طُمْ…\nاُو : humains, pluriel ࢠِي ; emprunts. Ex. : اُو مُنْتُور : cette montre.\nنْگُو : نْگُو مَايُو : ce fleuve ; نْگُو لِيسُ : cette natte.\nنْدِي : نْدِي هُورࣹ : cette tête ; نْدِي لُوندِ : ce canari.\nنْدِي : masses : لَݖِّرِي نْدِي ; نْدِي گَوْرِي.\nنْگُل : longueur : نْگُل لَاوُل : ce chemin ; نْگُل ࢠُگُّل : cette corde.\nنْگِل : diminutif : نْگِل كُيِل : cette petite tête ; نْگِل دِفْتِل.\nنْگِي : sept mots : لِيگِ، نَگِّ، هِيگِ، يَنْگِ، نَاݝِ، تُوݧَنْگِ، هَرِ.\nطَم : fluides : ڃِيڃَم، نْدِيَم، كُسَم.\nطُمْ : classe neutre.\nنْدُو : creux : وُيْنْدُ، وِينْدُ.\nPluriel : طِي، طِي، كُن / كُݧ، ࢠِي.", "quiz": "vocabulaire" },
  { "id": "s38", "level": "Avancé", "title": "Grammaire — وِنْدَنْدِ 7 : la dérivation (ݖِيكِرطِ)", "duration": "60 min", "objectives": ["Connaître les préfixes de dérivation : اِر، اُر، اَنْ، تُ، دُ، اُنْدِر، كِنْد، اُتِر، اُي، اِن", "Dériver le verbe هَالْدِ / parler"], "content": "ݖِيكِرطِ\nاِر- اُر- اَنْ- تُ- دُ- اُنْدِر- كِنْد- اُتِر، اُي، اِن\nEx. : هَالْدِ / parler\nهَالَنْدِ : raconter à\nهَالْدُدِ : parler avec\nهَالْتُدِ : reparler / raconter un secret\nهَالُرْدِ : profiter d'une occasion pour raconter\nهَالِرْدِ : parler comme\nهَالُيْدِ : aller raconter\nهَالْكِنْدَادِ : faire semblant de parler.\nتُ : répétition ; دُ : rapport entre une personne et… ; كِنْد : faire semblant ; اُي : déplacement ; اُر : occasion ; اِر : manière.\nPour la 2e et 3e forme : تُ → ت ; دُ → د.\nلِلَادِ : se coucher ; لِلْتَادِ : se recoucher ; لِلْدَادِ : coucher avec ; لِلْكِنْدَادِ : faire semblant de se coucher.", "quiz": "vocabulaire" },
  { "id": "s39", "level": "Avancé", "title": "Grammaire — وِنْدَنْدِ 8 : la dérivation (suite)", "duration": "45 min", "objectives": ["Combiner les préfixes de dérivation", "Former les verbes dérivés combinés"], "content": "ݖِيكِرطِ (suite)\nCombinaisons : اَنْ + اُر = اَنُر : هَالَنُرْدِ ; اَنْ + اُي = اَنُي : هَالَنُيْدِ ; اَنْ + اِر = اَنِر : هَالَنِرْدِ ; تُ + اَنْ = تَنْ : هَالْتَانْدِ ; دُ + اَنْ + اِر = دَنِر : هَالْدَنِرْدِ ; دُ + اِر + اَنْ = دِرَانْدِ : هَالْدِرَانْدِ ; كِنْد + اُر = كِنْدُر : هَالْكِنْدُرَادِ.", "quiz": "vocabulaire" },
  { "id": "s40", "level": "Intermédiaire", "title": "Grammaire — وِنْدَنْدِ 9 : les pronoms compléments", "duration": "45 min", "objectives": ["Connaître les pronoms compléments : كَم, مَ, مُ, مِن, اِن, اُن, ࢠِ", "Construire des phrases avec pronoms compléments"], "content": "LES PRONOMS PERSONNELS COMPLÉMENTS : لُمْتُ اِنْدِ تِمُّودِ\nكَم : اُ فِيِي كَم : il m'a frappé\nمَ : مِ رُكِّي مَ : je t'ai donné\nمُ : اَ وَارِي مُ : tu l'as tué\nمِن : اُن كَلْجِنِي مِن : vous nous dérangez\nاِن : ࢠِ نَامْنِيمَ اِن : ils nous ont demandé\nاُن : مِن ݖَلِمِنِي اُن : nous vous avons salués\nࢠِ : اُ تِنْتِنِي ࢠِ : il les a informés.", "quiz": "vocabulaire" },
  { "id": "s41", "level": "Intermédiaire", "title": "Grammaire — وِنْدَنْدِ 10 : les mots interrogatifs", "duration": "45 min", "objectives": ["Poser des questions en پُلَار (quand, qui, combien, où, pourquoi, comment, quoi)"], "content": "LES MOTS INTERROGATIFS\nهُل نْدِ : quand — هُل نْدِ اَمَدُ يَهِي؟\nمَنْدِ : quand — مَنْدِ اَمَدُ يَهِي؟\nهُلِي : qui — هُلِي بِيتِيطُ سَمْبَ؟ ; هُلِي اُون؟\nنُ فُتِي : combien — نُ فُتِي كُيْنْگَل نْبَالُ نْگُو جَرِي؟\nهُل تُ : où — هُل تُ پَطِ مَا نْگُونِي؟\nهُل كُ وَطِي : pourquoi — هُل كُ وَطِي اُ وِيِي نُوْن؟\nهُل سَبَابُ : pourquoi\nهُل نُ : comment — هُل نُ هَرِ نْدِي گَسِرِي؟\nهُل طُوم : quoi / qu'est-ce que.", "quiz": "vocabulaire" }
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
      text: "Attendu : ndiyam = ندِيَمْ ; ngaari = نگَارِ ; colli = ݖُلِّ ; fello = فِلّ ; ooɗoo = أٝوطٝو. Points de vigilance : en début de mot, les prénasalisées s'écrivent directement, sans Soukoun et sans voyelle d'appui (Règle 9) ; le double l de colli vient du Chadda (Règle 6) ; dans ooɗoo, le Waw allonge la voyelle (Règle 7)."
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
  },
  { "id": "d4", "session": "s15", "title": "Classer 10 verbes par forme verbale", "due": "Après la séance 15", "instructions": "Classez ces 10 verbes selon leur forme (racine + دِ / racine + َا + دِ / racine + ِي + دِ) : يَهْدِ، اَرْدِ، اُمَّادِ، ݧَاگَادِ، لِلَادِ، هَࢠِيدِ، دُگْدِ، طَانَادِ، ݧَامْدِ، يَرْدِ. Écrivez vos trois listes en ajami.", "correction": { "published": true, "text": "Groupe 1 (racine + دِ) : يَهْدِ، اَرْدِ، دُگْدِ، ݧَامْدِ، يَرْدِ. Groupe 2 (racine + َا + دِ) : اُمَّادِ، ݧَاگَادِ، لِلَادِ، طَانَادِ. Groupe 3 (racine + ِي + دِ) : هَࢠِيدِ." } },
  { "id": "d5", "session": "s17", "title": "Conjuguer au présent (سَهَا گُنَاطُ)", "due": "Après la séance 17", "instructions": "Appliquez la règle du présent avec مُݧْدِ / patienter et نَنْگُدِ / attraper, comme dans l'exemple يَهْدِ → مِطُ يَهَ. Écrivez les 7 pronoms pour chaque verbe.", "correction": { "published": true, "text": "Verbes racine + دِ : le présent = racine + َ (Pocal). مُݧْدِ → مِطُ مُݧَ، اَطَ مُݧَ، اُومُ مُݧَ، اِمِن مُݧَ، اِطِن مُݧَ، اُطُن مُݧَ، اِࢠِ مُݧَ (et formes progressives en -نِي). نَنْگُدِ → مِطُ نَنْگَ، اَطَ نَنْگَ، اُومُ نَنْگَ، اِمِن نَنْگَ، اِطِن نَنْگَ، اُطُن نَنْگَ، اِࢠِ نَنْگَ. Vérifiez l'alternance avec votre formateur." } },
  { "id": "d6", "session": "s18", "title": "Conjuguer au passé (سَهَا ࢠِنُّطُ)", "due": "Après la séance 18", "instructions": "Conjuguez ݧَامْدِ / manger et اَرْدِ / venir au سَهَا ࢠِنُّطُ avec les 7 pronoms, comme dans l'exemple اُنْدِ → مِ اُنِي.", "correction": { "published": true, "text": "Passé = racine + ِي : ݧَامْدِ → مِ ݧَامِي، اَ ݧَامِي، اُ ݧَامِي، مِن ݧَامِي، اِن ݧَامِي، اُن ݧَامِي، ࢠِ ݧَامِي (ݧ ne change pas). اَرْدِ → مِ اَرِي، اَ اَرِي، اُ اَرِي، مِن اَرِي، اِن اَرِي، اُن اَرِي، ࢠِ اَرِي (alternance ر→د : مِن نْدَرِي possible — vérifiez avec votre formateur)." } },
  { "id": "d7", "session": "s20", "title": "Les parties du corps avec possessifs", "due": "Après la séance 20", "instructions": "Écrivez et lisez les expressions de l'exercice : هُورࣹ اَم ; هُورࣹ مَا ; هُورࣹ مَكُّ ; كُيࣹ مِن ; كُيࣹ اَمِن ; كُيࣹ مُن ; كُيࣹ مَࢠِّ. Donnez la traduction française de chacune.", "correction": { "published": true, "text": "هُورࣹ اَم : ma tête ; هُورࣹ مَا : ta tête ; هُورࣹ مَكُّ : sa tête ; كُيࣹ مِن : nos têtes (inclusif) ; كُيࣹ اَمِن : nos têtes (exclusif) ; كُيࣹ مُن : vos têtes ; كُيࣹ مَࢠِّ : leurs têtes. Remarquez le doublet هُورࣹ (singulier) / كُيࣹ (pluriel)." } },
  { "id": "d8", "session": "s22", "title": "Écrire les nombres en ajami", "due": "Après la séance 22", "instructions": "Écrivez en ajami harmonisé : 15, 23, 37, 41, 58, 62, 79, 84, 99. Puis lisez-les à voix haute.", "correction": { "published": true, "text": "15 = سَپُّ اِ جُيِ ; 23 = نُوگَاس اِ تَتِ ; 37 = ݖَپَّنطِ تَتَتِ اِ جِيطِطِ ; 41 = ݖَپَّنطِ نَيِ اِ گُو ; 58 = ݖَپَّنطِ جُيِ اِ جِيتَتِ ; 62 = ݖَپَّنطِ جِيگُم اِ طِطِ ; 79 = ݖَپَّنطِ جِيطِطِ اِ جِينَيْ ; 84 = ݖَپَّنطِ جِيتَتِ اِ نَيِ ; 99 = ݖَپَّنطِ جِينَيْ اِ جِينَيْ." } },
  { "id": "d9", "session": "s25", "title": "Exprimer la durée", "due": "Après la séance 25", "instructions": "Écrivez en ajami : deux semaines ; un mois et cinq jours ; un an et sept mois ; hier et aujourd'hui.", "correction": { "published": true, "text": "Deux semaines : يُنْتِرِ طِطِ ; un mois et cinq jours : لِوْرُ اِ بَلْطِ جُيِ ; un an et sept mois : هِتَانْدِ اِ لِبِّ جِيطِطِ ; hier et aujourd'hui : هَنْكِ اِ هَنْدِ." } },
  { "id": "d10", "session": "s27", "title": "Jouer un dialogue de salutations", "due": "Après la séance 27", "instructions": "Mémorisez le dialogue du matin (جَم وَالِي → اَ فِنِي؟ → جَم تَنْ) et celui du soir (جَم هِيرِي → اَ هِيرِي اِ جَم). Enregistrez-vous avec l'atelier « Parler » et décrivez votre expérience.", "correction": { "published": true, "text": "Matin : جَم وَالِي / جَم نْبَال-طُن → اَ فِنِي؟ / اُن پِنِي؟ → جَم تَنْ. Soir : جَم هِيرِي / جَم كِير-طُن → اَ هِيرِي اِ جَم / اُن كِيرِي اِ جَم / جَم تَنْ. Réponses usuelles : اِنَ اِ جَم (la maison) ; اِࢠِ اِ جَم (la famille) ; كُ مَوْطُمْ (la santé) ; اِطِن نْجِتَّ اَللّٰه (remerciement)." } },
  { "id": "d11", "session": "s29", "title": "Les animaux et leur classe", "due": "Après la séance 29", "instructions": "Écrivez en ajami 5 animaux de la leçon avec leur cri et leur classe nominale (ex. : نْبِيوَ — مِينْدِ — بَا/طِي).", "correction": { "published": true, "text": "Exemples : اُلُّنْدُ — ݝِيوْدِ — نْدُو/طِي ; رَوَانْدُ — وَوْ — نْدُو/طِي ; نَگِّ — هُونْدِ — نْگِي/طِي ; پُݖُّ — هِجْدِ — نْگُو/طِي ; گِرْتُگَل — جُگُّدِ — نْگَل/طِي." } },
  { "id": "d12", "session": "s33", "title": "Les possessifs avec la famille", "due": "Après la séance 33", "instructions": "Écrivez 7 expressions : mon père, ta mère, son enfant, notre grand-père (inclusif), votre oncle, leur tante, notre famille (exclusif) — en utilisant les possessifs de la leçon.", "correction": { "published": true, "text": "بَابَ اَم ; نِينِ مَا ; ࢠِطُّ مَكُّ ; تَانُو مِن (ou تَانِيكُو pour « son grand-père » — voir la remarque تِسْكُ de la séance 24) ; كَاوْ مُن ; گُگُّ مَࢠِّ ; ࢠِسْنْگُ نْگُو اَمِن." } }
];

/* ============ 9. FORMATEURS ============ */
DATA.trainers = [
  { id: "t1", name: "Formateur principal", subject: "Alphabet et lecture", contact: "À compléter dans js/data.js" },
  { id: "t2", name: "Formateur assistant", subject: "Écriture et devoirs", contact: "À compléter dans js/data.js" }
];

/* ============ 10. DOCUMENTS TÉLÉCHARGEABLES ============ */
/* ============ 9. FICHES PÉDAGOGIQUES (support complémentaire) ============ */
DATA.fiches = {
  header: "Présentation du support pédagogique · 15 pages · Norme ISESCO / UNESCO",
  motto: "وَنُطْنُ جَنَّتَيْنِ يُلْزِفِنَا تَوَا",
  notice: "Support complémentaire conçu par Baba Ibrahim Barry (Ayouba Barry), concepteur du clavier CaramBolfubhe. Attention : certaines conventions de ce support diffèrent du manuel de référence validé (ex. ت pour « c », پ pour « ɓ », مْب pour « mb », نج lu « ŋj », 5 voyelles au lieu de 7 signes). En cas de divergence, le manuel validé (alphabet harmonisé de Bamako, 1987) fait foi.",
  list: [
    { n: 1, title: "Les voyelles · Masiŋe · Harakat", lead: "Cinq voyelles, chacune se pose sur une lettre-support (ici ب) :", items: [
      { aj: "ـَ", latin: "a — fatha" },
      { aj: "ـِ", latin: "i — kasra" },
      { aj: "ـُ", latin: "u — damma" },
      { aj: "ٝ", latin: "o — waw pulaar" },
      { aj: "ࣹ", latin: "e — signe e pulaar" }
    ] },
    { n: 2, title: "Consonnes spécifiques · Karattoaaji kerfiniidi · implosives", lead: "Les lettres propres au pulaar :", items: [
      { aj: "ط", latin: "d implosif" },
      { aj: "پ", latin: "p" },
      { aj: "ࢠ", latin: "ɓ" },
      { aj: "ت", latin: "c implosif" },
      { aj: "ݝ", latin: "ŋ" }
    ] },
    { n: 3, title: "Consonnes prénasalisées · Pentude", lead: "Deux lettres, un seul son : on les écrit ensemble.", items: [
      { aj: "مْب", latin: "MB", note: "ex. mbeewa" },
      { aj: "ند", latin: "ND", note: "ex. ndiyam" },
      { aj: "نگ", latin: "NG" },
      { aj: "نج", latin: "NJ" }
    ] },
    { n: 4, title: "Consonnes simples", lead: "Les 17 lettres que l'on retrouve aussi en arabe standard. Elles se lisent comme en latin :", items: [
      { aj: "ب", latin: "b" }, { aj: "ت", latin: "t" }, { aj: "ج", latin: "j" }, { aj: "د", latin: "d" },
      { aj: "ر", latin: "r" }, { aj: "و", latin: "w" }, { aj: "ق", latin: "q" }, { aj: "ك", latin: "k" },
      { aj: "ل", latin: "l" }, { aj: "ه", latin: "h" }, { aj: "گ", latin: "g" }, { aj: "ف", latin: "f" },
      { aj: "س", latin: "s" }, { aj: "م", latin: "m" }, { aj: "ن", latin: "n" }, { aj: "ي", latin: "y" },
      { aj: "ع", latin: "ŋ" }
    ] },
    { n: 5, title: "Mots repères · Mots exemples d'illustration", lead: "Un mot pour retenir chaque son :", items: [
      { latin: "🧒 Enfant" },
      { latin: "👅 Langue", aj: "طࣹنْنگَلْ" },
      { latin: "🍲 Repas" },
      { latin: "🐐 Chèvre", aj: "بَيْطِ" },
      { latin: "💧 Eau", aj: "ندِيَمْ" },
      { latin: "🗣️ Pulaar" }
    ] },
    { n: 6, title: "L'alphabet · Abajada Pulaar · أَبْجَدَ پُلَّر", lead: "25 lettres et 4 consonnes prénasalisées. Lis chaque lettre, son nom latin est écrit dessous.", items: [
      { aj: "ا", latin: "a" }, { aj: "ج", latin: "y" }, { aj: "پ", latin: "p" }, { aj: "ي", latin: "y" },
      { aj: "ت", latin: "t" }, { aj: "ر", latin: "r" }, { aj: "و", latin: "w" }, { aj: "ق", latin: "q" },
      { aj: "ل", latin: "l" }, { aj: "ك", latin: "k" }, { aj: "ج", latin: "y" }, { aj: "ه", latin: "h" },
      { aj: "گ", latin: "g" }, { aj: "ف", latin: "f" }, { aj: "د", latin: "d" }, { aj: "س", latin: "s" },
      { aj: "ط", latin: "đ" }, { aj: "ن", latin: "ñ" }, { aj: "م", latin: "m" }, { aj: "ن", latin: "n" },
      { aj: "ب", latin: "b" }, { aj: "پ", latin: "ɓ" }, { aj: "ت", latin: "c" }, { aj: "ع", latin: "ŋ" },
      { aj: "ء", latin: "’" },
      { aj: "ند", latin: "nd" }, { aj: "نب", latin: "mb" }, { aj: "نگ", latin: "ng" }, { aj: "نج", latin: "ŋj" }
    ] },
    { n: 7, title: "Lecture syllabique · a bref (Pocal) et aa long", lead: "Lis chaque syllabe à voix haute : la prononciation est écrite sous chaque lettre.", items: [
      { latin: "a bref — Pocal", aj: "بِتَّلْ" },
      { latin: "aa long — آ", aj: "بَا · فَا · سَا…" }
    ] },
    { n: 8, title: "Lecture syllabique · i bref (Pical) et ii long", items: [
      { latin: "i bref — Pical", aj: "بَتَلْ" },
      { latin: "ii long — إِ", aj: "لِي · سِي…" }
    ] },
    { n: 9, title: "Lecture syllabique · o bref (Toral) et oo long", items: [
      { latin: "o bref — Toral", aj: "تَرُلْ" },
      { latin: "oo long — أُو", aj: "تُو · كُو…" }
    ] },
    { n: 10, title: "Lecture syllabique · u bref (Tural) et uu long", items: [
      { latin: "u bref — Tural", aj: "تَرُلْ" },
      { latin: "uu long — أُو", aj: "ءو…" }
    ] },
    { n: 11, title: "Lecture syllabique · e bref (Teral) et ee long", items: [
      { latin: "e bref — Teral", aj: "تِرَلْ" },
      { latin: "ee long — إࣹي", aj: "پࣹي · سࣹي…" }
    ] },
    { n: 12, title: "Sukun et shadda · Kowal · Ciddal", items: [
      { aj: "ْ", latin: "Sukun (كُولْ)", note: "ferme la syllabe — consonne sans voyelle" },
      { aj: "ّ", latin: "Shadda (نَدَّلْ)", note: "double la consonne — ex. cca, yya, ppa" }
    ] },
    { n: 13, title: "Le tanwiin · تَنوِين", lead: "Le tanwiin double la voyelle finale d'un mot arabe. Il se pose sur les lettres propres à l'arabe (ث، ح، خ، ذ، ز، ش، ص، ض، ظ، ع، غ) :", items: [
      { aj: "ً", latin: "Fathatan", note: "an" },
      { aj: "ٍ", latin: "Kasratan", note: "in" },
      { aj: "ٌ", latin: "Dammatan", note: "un" }
    ] },
    { n: 14, title: "Formes des lettres", lead: "Isolée · début · milieu · fin : une lettre change de forme selon sa place dans le mot.", items: [
      { latin: "Les lettres ا · د · ر · و ne se lient pas à la suivante." }
    ] }
  ]
};

DATA.docs = [
  { file: "docs/guide-utilisation.html", label: "📘 Guide d'utilisation complet (HTML imprimable)", note: "Installation, configuration, suivi des cours sans rien rater, questions aux formateurs, devoirs et corrections, dépannage." },
  { file: "docs/Regles_Ajami_Pulaar.html", label: "Manuel de transcription complet (HTML)", note: "Toutes les règles, tableaux et exceptions validés — le document de référence." },
  { file: "docs/livret-ajami.html", label: "📖 Livret complet — Apprendre l’ajami pular de A à Z (HTML imprimable)", note: "Tout le cours en un livret : alphabet, voyelles, syllabes, règles 6–10, vocabulaire, nombres et méthode — avec QR code." },
  { file: "docs/presentation-projet.html", label: "🤝 Kit de présentation du projet (HTML imprimable)", note: "Document à joindre aux demandes de partenariat : mission, outil, fondements, partenariats et QR code." },
  { file: "docs/affiche-alphabet.html", label: "Affiche de l'alphabet harmonisé (HTML imprimable)", note: "22 consonnes + prénasalisées + voyelles sur une page A4 — à imprimer et afficher en classe." },
  { file: "docs/fiche-lecture-syllabes.html", label: "Fiche de lecture — syllabes (HTML imprimable)", note: "Syllabes brèves, longues, fermées et prénasalisées pour lire à voix haute." },
  { file: "docs/fiche-vocabulaire-classe.html", label: "Fiche de vocabulaire pour la classe (HTML imprimable)", note: "17 mots validés avec ajami, latin, français et catégories." },
  { file: "docs/guide-alphabet.pdf", label: "Guide de l'alphabet harmonisé (PDF)", note: "Consonnes standard et spécifiques, avec exemples validés." },
  { file: "docs/guide-voyelles.pdf", label: "Guide des voyelles et règles (PDF)", note: "Voyelles brèves et longues, siège du Hamza, règles 6 à 10." },
  { file: "docs/cahier-phrases.pdf", label: "Cahier de phrases et vocabulaire (PDF)", note: "Vocabulaire validé avec prononciation." },
  { file: "docs/alphabet-ajami.txt", label: "Alphabet ajami en texte Unicode (TXT)", note: "Pour copier-coller les caractères ajami." },
  { file: "docs/vocabulaire-ajami.txt", label: "Vocabulaire ajami en texte Unicode (TXT)", note: "Mots et phrases en écriture ajami." }
];
