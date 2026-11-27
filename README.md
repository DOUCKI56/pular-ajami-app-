# Pular Ajami — Apprendre le pular en caractères harmonisés

Application **multiplateforme** (PWA installable) pour apprendre le **pular**
(pulaar) écrit en **ajami**, selon l'orthographe **validée** des formateurs :
manuel de transcription Ajami Pulaar ⇄ Latin harmonisé (alphabet harmonisé de
Bamako, 1987) — 15 consonnes standard + 7 consonnes spécifiques
(Ɓ, P, Ɗ, C, Ƴ, Ŋ, Ñ), 5 voyelles avec leurs variantes, et les règles 6 à 10
(chadda, waw, siège du hamza, soukoun initial, noms propres arabes).
Le document de référence est fourni dans l'application :
`docs/Regles_Ajami_Pulaar.html`.

## Fonctionnalités

| Module | Contenu |
|---|---|
| 🏠 Accueil | Progression, statistiques, accès rapide |
| 📖 Lire | Les 22 consonnes (15 standard + 7 spécifiques) avec exemples validés, les 5 voyelles et leurs variantes, les voyelles longues, les 5 prénasalisées (mb, nɗ, nj, nd, ng) et les règles majeures 6 à 10 |
| ✍️ Écrire | Atelier d'écriture tactile/souris avec modèle ajami, export PNG |
| 🗣️ Parler | Écoute de la prononciation + enregistrement et réécoute de sa voix |
| 🎯 Réviser | Quiz aléatoires : alphabet, voyelles, vocabulaire, révision générale, meilleur score suivi |
| 🏫 Salle de cours | 8 séances guidées (débutant → avancé) avec objectifs, leçon, quiz et devoir associé |
| 💬 Formateurs | Poser des questions, lire les réponses, mode formateur pour répondre |
| 📤 Devoirs | Déposer un travail, consulter la correction publiée, dépôts par devoir |
| 📥 Documents | PDF et TXT **très légers** (1 à 2 Ko) téléchargeables, consultables hors ligne |
| 📲 Partager (QR) | Bouton de partage (accueil) + affiche imprimable avec code QR pour faire connaître l'application |
| ℹ️ À propos | Histoire de l'écriture ajami pulaar, harmonisation de Bamako (1987), clavier CaramBolfubhe, code source |

## Faire connaître l'application

1. **Bouton Partager** (accueil ou page À propos) : ouvre le partage du téléphone (WhatsApp, etc.) ; sur ordinateur, ouvre WhatsApp Web.
2. **Affiche avec QR** (menu « 📱 Partager (QR) ») : cliquez « 🖨️ Imprimer l'affiche » — la feuille imprimée montre le QR et l'adresse de l'application ; chacun la scanne avec sa caméra.
3. **Documents imprimables** : nouvelle affiche de l'alphabet, fiche de syllabes et fiche de vocabulaire pour la classe (menu Documents).

## Installation / utilisation

**En ligne (recommandé)** : l'application est publiée automatiquement sur
GitHub Pages à chaque push (workflow `.github/workflows/pages.yml`) :

> https://doucki56.github.io/pular-ajami-app-/

**En local**, aucune compilation, aucune dépendance, aucun serveur obligatoire :

1. Ouvrez `index.html` dans un navigateur, **ou** servez le dossier :
   `python3 -m http.server 8080`
2. Sur mobile ou PC, utilisez le bouton **Installer** (ou menu du navigateur →
   « Installer » / « Ajouter à l'écran d'accueil »).
3. Après la première visite, l'application fonctionne **hors ligne**
   (service worker + cache).

Plateformes : Android, iOS, Windows, macOS, Linux — via n'importe quel
navigateur moderne.

## Structure

```
index.html          Page unique (SPA)
css/style.css       Styles (responsive, mobile + desktop)
js/data.js          Contenu pédagogique modifiable par les formateurs
js/storage.js       Persistance locale (localStorage)
js/app.js           Application (vues, quiz, atelier, routeur)
sw.js               Cache hors ligne
docs/               Documents téléchargeables (PDF/TXT)
tools/make_docs.py  Régénère les documents : python3 tools/make_docs.py
```

## Enrichir le contenu

**Rôles et accès** : trois rôles — **Apprenant** (par défaut),
**Enseignant**, **Administrateur**. Pour ajouter du contenu il faut être
enseignant ou administrateur. Deux façons d'entrer son code : le menu
**🔐 Administration** (écran « Entrez votre code d'accès ») ou
**⚙️ Paramètres → Mon rôle**.

- code **administrateur** par défaut : `PULAR1987` — **à changer
  immédiatement** dans **👥 Gestion des enseignants et administrateurs** ;
- l'administrateur **génère des codes enseignant** (bouton ➕, 6 caractères,
  à usage unique) et peut **révoquer** chaque code ;
- un enseignant peut ajouter tout le contenu mais ne voit pas la gestion des
  codes ; le menu 🔐 reste caché aux simples apprenants ;
- on peut revenir en simple apprenant via **Paramètres → Mon rôle**.

**Panneau d'administration** : menu **🔐 Administration**. Une fois accepté
comme enseignant ou administrateur :

- ajouter/supprimer des **mots de vocabulaire** (ajami, transcription,
  traduction, catégorie) — ils apparaissent aussitôt dans Lire, Écrire,
  Parler et les quiz ;
- ajouter/supprimer des **séances de la salle de cours** (niveau, durée,
  objectifs, leçon, quiz associé) ;
- **modifier** les séances (bouton ✏️, y compris celles fournies avec
  l'application — le bouton « ↺ Restaurer » rétablit l'original), le
  vocabulaire et le titre des fichiers de cours ;
- ajouter des **cours depuis un fichier externe** (PDF, Word .doc/.docx,
  image, TXT ou HTML — 20 Mo max) : les **images sont compressées
  automatiquement** (JPEG, qualité optimisée) ; les fichiers sont stockés en
  **IndexedDB** (capacité de plusieurs centaines de Mo) et se synchronisent
  avec la classe connectée ; les apprenants les ouvrent (PDF) ou les
  téléchargent (Word) depuis la salle de cours ;
- ajouter des **prononciations audio enregistrées avec votre voix** (micro) :
  sélectionnez un mot ou une lettre, enregistrez 1 à 2 secondes, sauvegardez —
  votre audio remplace la voix de synthèse dans « Lire » et « Parler » ;
- ajouter des **devoirs** et **rédiger/publier les corrections** ;
- **exporter/importer** les contenus personnalisés en JSON (sauvegarde,
  partage entre appareils).

⚠️ Les rôles et codes sont enregistrés **sur l'appareil** (localStorage) :
un code saisi sur un nouvel appareil y accorde le rôle, mais la liste des
codes n'est pas partagée entre appareils. Pour des comptes réels multi-
appareils, un petit backend sera nécessaire (voir ci-dessous).

Les contenus administrés sont stockés sur l'appareil (localStorage) et
fusionnés avec la base intégrée. Pour une modification permanente du contenu
de référence, éditez `js/data.js` (alphabet, voyelles, vocabulaire, séances,
devoirs + corrections, formateurs).

## 🏫 Salle de cours connectée (synchronisation multi-appareils)

Sans configuration, tout reste sur l'appareil. En suivant ces étapes, les
contenus, questions et dépôts de devoirs se partagent entre tous les
téléphones de la classe — gratuitement, avec un simple compte Google.

**Côté administrateur (une seule fois, ~5 minutes) :**

1. Ouvrez [script.google.com](https://script.google.com) avec votre compte
   Google → **Nouveau projet**
2. Copiez dans l'éditeur tout le contenu du fichier
   [`tools/apps-script-sync.gs`](tools/apps-script-sync.gs)
3. À la ligne `const CLE = ...`, remplacez `CHANGE-ME-2026` par votre clé de
   classe (gardez-la secrète)
4. **Déployer → Nouveau déploiement → Application Web** : « Exécuter en tant
   que : Moi », « Qui a accès : Tout le monde », puis autorisez l'accès
5. Copiez l'URL de l'application Web (elle finit par `/exec`)
6. Dans l'application : **⚙️ Paramètres → 🏫 Salle de cours connectée** —
   collez l'URL et la clé, puis **💾 Enregistrer**
7. Menu **🔐 Administration → ☁️ Salle de cours connectée** :
   **⬆️ Envoyer mes contenus vers la classe**

**Côté apprenants :** dans **⚙️ Paramètres → 🏫 Salle de cours connectée**,
coller la même URL et la même clé, puis **⬇️ Recevoir les contenus de la
classe**. Leurs questions et leurs dépôts de devoirs sont envoyés
automatiquement ; l'enseignant les récupère avec le bouton **⬇️ Recevoir**
de la section ☁️.

La fusion est tolérante aux conflits : les listes sont réunies par identifiant,
les suppressions et les corrections publiées priment sur les anciennes
versions. Le serveur conserve tout dans un fichier JSON sur votre Google Drive
(`pular-ajami-classe.json`).

⚠️ Toute personne possédant l'URL **et** la clé peut lire/écrire les données
de la classe : gardez la clé secrète et changez-la si besoin (redéployez le
script avec une nouvelle clé).

## Note sur l'orthographe

Les lettres, voyelles et exemples suivent le **manuel de transcription validé**
par les formateurs (`docs/Regles_Ajami_Pulaar.html`, référence : alphabet
harmonisé de Bamako, 1987). Certains caractères spécifiques (ࢠ, ݖ, ڃ, ݝ, ݧ)
nécessitent une police arabe récente (Noto Naskh Arabic recommandé).
Toute évolution de l'orthographe se fait dans `js/data.js`.

## Sources

- Manuel de transcription Ajami Pulaar ⇄ Latin harmonisé (fourni par les formateurs)
- [Pular language — écriture ajami (Wikipedia)](https://en.wikipedia.org/wiki/Pular_language)
