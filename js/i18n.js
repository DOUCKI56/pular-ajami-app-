/* i18n — langue d'affichage optionnelle : français (par défaut), العربية, pular.
 * Traduction des textes d'interface (menu, titres, boutons) par remplacement exact.
 * Les leçons et contenus pédagogiques restent dans leur langue d'origine. */
const I18N = (function () {
  const DICT = {
    ar: {
      "Accueil": "الرئيسية",
      "Lire — l'alphabet": "قراءة — الحروف",
      "Fiches pédagogiques": "البطاقات التعليمية",
      "Écrire — atelier": "الكتابة — الورشة",
      "Parler — prononciation": "التحدّث — النطق",
      "Réviser — quiz": "المراجعة — اختبار",
      "Salle de cours": "قاعة الدرس",
      "Poser une question": "طرح سؤال",
      "Déposer un devoir": "إيداع الواجب",
      "Documents (PDF)": "الوثائق (PDF)",
      "Partager (QR)": "مشاركة (QR)",
      "À propos": "حول التطبيق",
      "Clavier ajami": "لوحة المفاتيح الأجَم",
      "Administration": "الإدارة",
      "Paramètres": "الإعدادات",
      "Lire": "قراءة",
      "Écrire": "كتابة",
      "Quiz": "اختبار",
      "Cours": "الدروس",
      "Installer": "تثبيت",
      "séances terminées": "دروس مكتملة",
      "lettres harmonisées": "حروف منسّقة",
      "quiz tentés": "اختبارات منجزة",
      "devoirs déposés": "واجبات مودَعة",
      "Commencer": "ابدأ",
      "Ouvrir": "افتح",
      "Se tester": "اختبر نفسك",
      "Entrer": "ادخل",
      "Télécharger": "تنزيل",
      "Découvrir": "اكتشف",
      "Partager": "مشاركة",
      "Enregistrer": "حفظ",
      "Découvrez les 33 lettres de l'alphabet ajami harmonisé, leurs formes et leurs sons.": "اكتشف الحروف المنسّقة للأجَم وأشكالها وأصواتها.",
      "Atelier d'écriture : entraînez-vous à tracer les lettres et les mots.": "ورشة الكتابة: تدرّب على رسم الحروف والكلمات.",
      "Écoutez la prononciation et enregistrez-vous.": "استمع إلى النطق وسجّل صوتك.",
      "Quiz de révision : alphabet, voyelles, vocabulaire.": "اختبارات مراجعة: الحروف، الحركات، المفردات.",
      "Posez vos questions aux formateurs.": "اطرح أسئلتك على المدرّبين.",
      "Déposez vos devoirs et consultez les corrections.": "أودع واجباتك واطّلع على التصحيحات.",
      "PDF et fichiers légers à télécharger.": "ملفات PDF خفيفة قابلة للتنزيل.",
      "Faites connaître l'ajami pulaar : envoyez l'application à vos contacts.": "عرِّف الناس بالأجَم البولاري: أرسل التطبيق إلى معارفك.",
      "Histoire de l'écriture ajami pulaar et mission de cette application.": "تاريخ كتابة الأجَم البولاري ورسالة هذا التطبيق.",
      "📥 Documents téléchargeables": "📥 الوثائق القابلة للتنزيل",
      "Fichiers légers (quelques Ko) consultables hors ligne. Les PDF sont aussi imprimables.": "ملفات خفيفة تعمل دون اتصال، والملفات PDF قابلة للطباعة.",
      "⚙️ Paramètres": "⚙️ الإعدادات",
      "Votre nom d'apprenant": "اسمك كمتعلّم",
      "Mon rôle": "دوري",
      "Vous êtes :": "أنت:",
      "Revenir en simple apprenant": "العودة إلى متعلّم بسيط",
      "Réinitialiser": "إعادة التهيئة",
      "Tout réinitialiser": "إعادة تهيئة كل شيء",
      "🏫 Salle de cours connectée": "🏫 قاعة الدرس المتصلة",
      "💾 Enregistrer la connexion": "💾 حفظ الاتصال",
      "⬇️ Recevoir les contenus de la classe": "⬇️ استقبال محتوى الصف",
      "🖨️ Imprimer l'affiche": "🖨️ طباعة الملصق",
      "📤 Partager le lien": "📤 مشاركة الرابط",
      "⌨️ Activer le clavier ajami": "⌨️ تفعيل لوحة المفاتيح الأجَم"
    },
    ff: {
      "Accueil": "Galle",
      "Lire — l'alphabet": "Janngude — Alkule",
      "Fiches pédagogiques": "Janngirɗe",
      "Écrire — atelier": "Winndude — Gollorde",
      "Parler — prononciation": "Haalude — Haala",
      "Réviser — quiz": "Ngartaade — Lanndaaji",
      "Salle de cours": "Suudu janngirde",
      "Poser une question": "Irde e jannginoowo",
      "Déposer un devoir": "Hokkude gollal",
      "Documents (PDF)": "Binndi (PDF)",
      "Partager (QR)": "Yaltinde (QR)",
      "À propos": "Ko fayti e",
      "Clavier ajami": "Ñoggirde ajami",
      "Administration": "Njuɓɓudi",
      "Paramètres": "Teeltugol",
      "Lire": "Janngude",
      "Écrire": "Winndude",
      "Quiz": "Lanndaaji",
      "Cours": "Janngirɗe",
      "Installer": "Aafde",
      "séances terminées": "janngirɗe timmuɗe",
      "lettres harmonisées": "alkule ajami",
      "quiz tentés": "lanndaaji gaañiiɗi",
      "devoirs déposés": "golle neldaaɗe",
      "Commencer": "Fuɗɗaa",
      "Ouvrir": "Uddit",
      "Entrer": "Naat",
      "Télécharger": "Aaddo",
      "Découvrir": "Anndu",
      "Partager": "Yaltinde",
      "Enregistrer": "Danndu"
    }
  };

  const VIEWS = {
    ar: { accueil: "الرئيسية", lire: "قراءة", fiches: "البطاقات", ecrire: "الكتابة", parler: "التحدّث",
          reviser: "المراجعة", cours: "قاعة الدرس", formateurs: "المدرّبون", devoirs: "الواجبات",
          documents: "الوثائق", qrcode: "مشاركة", apropos: "حول", clavier: "لوحة المفاتيح",
          admin: "الإدارة", parametres: "الإعدادات", seance: "درس" },
    ff: { accueil: "Galle", lire: "Janngude", fiches: "Janngirɗe", ecrire: "Winndude", parler: "Haalude",
          reviser: "Ngartaade", cours: "Suudu janngirde", formateurs: "Jannginoowo", devoirs: "Golle",
          documents: "Binndi", qrcode: "Yaltinde", apropos: "Ko fayti e", clavier: "Ñoggirde",
          admin: "Njuɓɓudi", parametres: "Teeltugol", seance: "Janngirde" }
  };

  function lang() {
    if (typeof Store === "undefined") return "fr";
    const l = Store.get("uiLang", "fr");
    return (l === "ar" || l === "ff") ? l : "fr";
  }

  function walk(node, dict) {
    if (!node || !node.childNodes) return;
    node.childNodes.forEach((child) => {
      if (child.nodeType === 3) {
        const raw = child.nodeValue;
        const key = raw.trim();
        if (key && dict[key] !== undefined) child.nodeValue = raw.replace(key, dict[key]);
      } else if (child.nodeType === 1) {
        if ((child.tagName === "INPUT" || child.tagName === "TEXTAREA") && child.placeholder && dict[child.placeholder] !== undefined) {
          child.placeholder = dict[child.placeholder];
        } else {
          walk(child, dict);
        }
      }
    });
  }

  function apply(root) {
    const d = DICT[lang()];
    if (d) walk(root, d);
  }

  function applyChrome() {
    if (typeof document === "undefined") return;
    const side = document.querySelector(".sidebar");
    const tab = document.querySelector(".tabbar");
    const top = document.querySelector(".topbar");
    if (side) apply(side);
    if (tab) apply(tab);
    if (top) apply(top);
  }

  function viewTitle(view) {
    const d = VIEWS[lang()];
    return (d && d[view]) || view;
  }

  function setLang(l) {
    if (typeof Store !== "undefined") Store.set("uiLang", (l === "ar" || l === "ff") ? l : "fr");
  }

  return { lang, apply, applyChrome, viewTitle, setLang };
})();
