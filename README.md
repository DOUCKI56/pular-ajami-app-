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

**Panneau d'administration** : menu **🔐 Administration** de l'application.
Au premier accès, activez le **mode formateur** (bouton fourni), puis :

- ajouter/supprimer des **mots de vocabulaire** (ajami, transcription,
  traduction, catégorie) — ils apparaissent aussitôt dans Lire, Écrire,
  Parler et les quiz ;
- ajouter/supprimer des **séances de la salle de cours** (niveau, durée,
  objectifs, leçon, quiz associé) ;
- ajouter des **cours depuis un fichier externe** (PDF, Word .doc/.docx,
  TXT ou HTML — 3 Mo max) : le fichier est enregistré dans l'application et
  les apprenants l'ouvrent (PDF) ou le téléchargent (Word) depuis la salle
  de cours ;
- ajouter des **prononciations audio enregistrées avec votre voix** (micro) :
  sélectionnez un mot ou une lettre, enregistrez 1 à 2 secondes, sauvegardez —
  votre audio remplace la voix de synthèse dans « Lire » et « Parler » ;
- ajouter des **devoirs** et **rédiger/publier les corrections** ;
- **exporter/importer** les contenus personnalisés en JSON (sauvegarde,
  partage entre appareils).

Les contenus administrés sont stockés sur l'appareil (localStorage) et
fusionnés avec la base intégrée. Pour une modification permanente du contenu
de référence, éditez `js/data.js` (alphabet, voyelles, vocabulaire, séances,
devoirs + corrections, formateurs).
- Les questions/devoirs sont stockés sur l'appareil (localStorage). Pour une
  **classe connectée** (synchronisation multi-appareils), brancher `js/storage.js`
  sur un petit backend (par exemple Firebase Realtime Database, Supabase ou un
  Google Sheet via Apps Script) — la structure de données est déjà prévue.

## Note sur l'orthographe

Les lettres, voyelles et exemples suivent le **manuel de transcription validé**
par les formateurs (`docs/Regles_Ajami_Pulaar.html`, référence : alphabet
harmonisé de Bamako, 1987). Certains caractères spécifiques (ࢠ, ݖ, ڃ, ݝ, ݧ)
nécessitent une police arabe récente (Noto Naskh Arabic recommandé).
Toute évolution de l'orthographe se fait dans `js/data.js`.

## Sources

- Manuel de transcription Ajami Pulaar ⇄ Latin harmonisé (fourni par les formateurs)
- [Pular language — écriture ajami (Wikipedia)](https://en.wikipedia.org/wiki/Pular_language)
