# Changelog

Toutes les évolutions notables du projet sont listées ici.
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versions : [SemVer](https://semver.org/lang/fr/).

## [Non publié]

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

[Non publié]: https://github.com/VincentLesniak/AssertivenessProject/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/VincentLesniak/AssertivenessProject/releases/tag/v0.1.0
