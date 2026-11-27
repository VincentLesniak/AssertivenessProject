# Changelog

Toutes les évolutions notables du projet sont listées ici.
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versions : [SemVer](https://semver.org/lang/fr/).

## [Non publié]

## [0.5.1] - 2026-11-27

### Modifié

- « Enregistrer en PDF » télécharge directement le fichier `Test-d-assertivite_mes-resultats_AAAA-MM-JJ.pdf`, sans passer par la fenêtre d'impression. Le PDF est généré avec jsPDF, chargé seulement au clic.

### Supprimé

- Feuille de style d'impression, remplacée par la génération directe du PDF.

## [0.5.0] - 2026-11-27

### Ajouté

- Bouton « Enregistrer en PDF » sur l'écran des résultats et sur la conclusion : la fenêtre d'impression du navigateur produit une page A4 avec la date, l'histogramme, les 4 postures et leur score, la conclusion et le crédit du livre. Aucune bibliothèque ajoutée.
- Mention sur l'accueil : « Vos réponses restent dans votre navigateur, rien n'est envoyé. »
- Captures dans `docs/screens/v0.5.0/`, avec un aperçu du PDF.

## [0.4.1] - 2026-11-27

### Corrigé

- Les boutons « Plutôt faux » et « Plutôt vrai » restent au même endroit d'une question à l'autre : la question occupe toujours la hauteur de la plus longue, texte centré.
- Barres de l'histogramme posées à plat sur l'axe : seuls les coins du haut sont arrondis.

## [0.4.0] - 2026-11-27

### Ajouté

- Charte graphique : palette « Ardoise », une couleur par posture, polices Inter et Space Grotesk incluses dans le site (sans Google Fonts).
- Bouton « Commencer » et durée indicative sur l'accueil.
- Icône d'onglet et titre « Test d'assertivité ».
- Maquettes v0.4.0 dans `docs/maquettes/v0.4.0/`, captures dans `docs/screens/v0.4.0/`.
- Raccourcis clavier : V ou F pour répondre, ← et → pour naviguer ; aide « Clavier : V ou F » sous les réponses (masquée sur écran tactile).
- Reprise d'un test interrompu : les réponses sont sauvegardées dans le navigateur, l'accueil propose « Recommencer » ou « Reprendre (question N) ».

### Modifié

- Nouvelle mise en page en colonne : plus de textes superposés ni de défilement dans la carte, sur ordinateur comme sur mobile.
- Boutons de 48 px de haut, réponse choisie remplie avec une coche, navigation « ← Précédent » / « Suivant → ».
- Histogramme et cartes de détail aux couleurs des postures.
- Accents ajoutés aux titres (RÈGLES, TES RÉSULTATS) ; « faîtes » corrigé en « faites ».
- Espaces insécables avant « : ; ? ! » et à l'intérieur des guillemets, pour éviter un signe seul en début de ligne.
- Texte courant justifié, avec césure française pour éviter les grands blancs.
- Contraste AA : couleurs des postures légèrement foncées, boutons de posture non choisis lisibles (contour gris au lieu d'être pâlis), contour de focus orange plus soutenu.

## [0.3.0] - 2026-11-26

### Ajouté

- Après la question 60 : grille d'analyse, puis histogramme des 4 scores, puis conclusion.
- Histogramme SVG animé (désactivé si « réduire les animations » est activé).
- Détail de chaque posture au clic sur son bouton, avec des textes originaux.
- Bouton « Recommencer » sur la conclusion.
- Tests de l'enchaînement des écrans et de la géométrie de l'histogramme.

### Modifié

- Sur petit écran, les boutons Précédent et Suivant passent en bas de la carte.

## [0.2.0] - 2026-11-26

### Ajouté

- Écran « TES RESULTATS » après la question 60, avec les quatre scores sur 15.
- Indicateur « Question 12 / 60 » et barre de progression.
- La réponse déjà donnée est mise en évidence quand on revient sur une question.
- Bouton « Suivant » sur une question déjà répondue.
- Tests de la navigation et des réponses (`src/core/quiz.js`).

### Modifié

- Boutons « Précédent » et « Suivant » à la place de « Left » et « Right ».
- « Plutôt faux » à gauche, « Plutôt vrai » à droite, comme sur la maquette.
- La mention du livre apparaît dès l'écran d'accueil.
- La page est déclarée en français (`lang="fr"`).

### Corrigé

- Modifier une réponse après un retour arrière ne compte plus le point deux fois.
- La fin du test n'affiche plus un écran vide.
- Les scores ne sont plus écrits dans la console.

## [0.1.0] - 2026-11-26

### Modifié

- Restructuration complète du projet : Vite, modules ES, nouvelle arborescence `src/`.
- Les 60 questions et les textes sont dans `src/data/` (JSON), séparés du code.
- Le calcul des scores est isolé dans `src/core/scoring.js`.
- Les maquettes passent de `models/` à `docs/maquettes/`.
- Le site est publié sur https://vincentlesniak.github.io/AssertivenessProject/ (sans `/app/`).

### Ajouté

- Tests Vitest du calcul des scores et de la grille de correction.
- ESLint, Prettier, CI GitHub Actions et déploiement automatique sur GitHub Pages.
- Modèles d'issues et de PR, LICENSE, ce changelog.

### Supprimé

- `results.html` et `results.js`, qui ne fonctionnaient pas ; leurs textes sont conservés dans `src/data/content.json` pour la v0.3.0.

[Non publié]: https://github.com/VincentLesniak/AssertivenessProject/compare/v0.5.1...HEAD
[0.5.1]: https://github.com/VincentLesniak/AssertivenessProject/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/VincentLesniak/AssertivenessProject/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/VincentLesniak/AssertivenessProject/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/VincentLesniak/AssertivenessProject/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/VincentLesniak/AssertivenessProject/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/VincentLesniak/AssertivenessProject/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/VincentLesniak/AssertivenessProject/releases/tag/v0.1.0
