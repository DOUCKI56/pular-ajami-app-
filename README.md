# Pular Ajami — Apprendre le pular en caractères harmonisés

Application **multiplateforme** (PWA installable) pour apprendre le **pular**
(fulfulde du Fouta Djallon) écrit en **ajami**, avec l'alphabet **harmonisé**
agréé à la conférence JCMWA/MICCAO de Ngaoundéré (1998) : 33 lettres, dont
4 propres au fulfulde (ɓ, p, ƴ, ny).

## Fonctionnalités

| Module | Contenu |
|---|---|
| 🏠 Accueil | Progression, statistiques, accès rapide |
| 📖 Lire | Les 33 lettres harmonisées (4 formes, son, exemples), voyelles, diacritiques, digrammes prénasalisés (mb, nd, nj, ng) |
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

Les lettres, diacritiques et exemples suivent la convention ajami harmonisée
du fulfulde (JCMWA 1998) et l'orthographe pular du Fouta Djallon. Certains
caractères spécifiques (Ɓ ݠ ƴ ɲ) nécessitent une police arabe récente
(Noto Naskh Arabic recommandé). L'orthographe exacte de certains mots peut
varier selon les écoles calligraphiques : les formateurs peuvent l'ajuster
dans `js/data.js`.

## Sources

- [Adamawa Fulfulde — alphabet ajami (Wikipedia, norme JCMWA 1998)](https://en.wikipedia.org/wiki/Adamawa_Fulfulde)
- [Pular language — alphabet ajami (Wikipedia)](https://en.wikipedia.org/wiki/Pular_language)
