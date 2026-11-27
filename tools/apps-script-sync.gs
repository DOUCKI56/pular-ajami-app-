/**
 * Salle de cours connectée — mini-serveur pour l'application Pular Ajami.
 *
 * INSTALLATION (une seule fois, ~5 minutes) :
 * 1. Allez sur https://script.google.com (connecté avec votre compte Google)
 * 2. Cliquez « Nouveau projet »
 * 3. Effacez le contenu de l'éditeur et collez TOUT ce fichier
 * 4. À la ligne `const CLE = ...`, remplacez « CHANGE-ME-2026 » par votre
 *    propre clé de classe (ex : "MA-CLASSE-2026"). Gardez-la secrète.
 * 5. Cliquez « Déployer » → « Nouveau déploiement » → roue dentée →
 *    « Application Web » :
 *      - Exécuter en tant que : Moi
 *      - Qui a accès : Tout le monde
 *    puis « Déployer » (Google demandera d'autoriser l'accès au Drive : accepter)
 * 6. Copiez l'« URL de l'application Web » (elle finit par /exec)
 *
 * Dans l'application Pular Ajami (⚙️ Paramètres → 🏫 Salle de cours connectée) :
 * collez cette URL et la clé de classe. Ensuite :
 *   - Administrateur/Enseignant : bouton « Envoyer mes contenus » (menu 🔐)
 *   - Apprenants : bouton « Recevoir » (Paramètres)
 */

// ⚠️ CHANGEZ CETTE CLÉ (étape 4 ci-dessus)
const CLE = "CHANGE-ME-2026";

const NOM_FICHIER = "pular-ajami-classe.json";

function fichier() {
  const it = DriveApp.getFilesByName(NOM_FICHIER);
  return it.hasNext() ? it.next()
    : DriveApp.createFile(NOM_FICHIER, "{}", "application/json");
}

function lire() {
  try {
    return JSON.parse(fichier().getBlob().getDataAsString("UTF-8"));
  } catch (e) {
    return {};
  }
}

function ecrire(d) {
  fichier().setContent(JSON.stringify(d));
}

function repondre(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if ((p.key || "") !== CLE) return repondre({ ok: false, error: "cle" });
  if (p.action === "get") {
    const d = lire();
    return repondre({
      ok: true,
      content: d.content || null,
      questions: d.questions || [],
      submissions: d.submissions || [],
      updatedAt: d.updatedAt || ""
    });
  }
  return repondre({ ok: false, error: "action" });
}

function doPost(e) {
  let b = {};
  try { b = JSON.parse(e.postData.contents); }
  catch (err) { return repondre({ ok: false, error: "json" }); }
  if ((b.key || "") !== CLE) return repondre({ ok: false, error: "cle" });
  const d = lire();
  if (b.content) d.content = b.content;
  if (b.questions) d.questions = b.questions;
  if (b.submissions) d.submissions = b.submissions;
  d.updatedAt = new Date().toISOString();
  ecrire(d);
  return repondre({ ok: true, updatedAt: d.updatedAt });
}
