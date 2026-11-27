# 0001 - Choix de conception de la v1

Date : 2026-11-26 · Statut : validé

La v1.0.0 est une application statique, sans compte ni serveur, hébergée sur GitHub Pages.

| #   | Sujet                         | Décision                                                                                        |
| --- | ----------------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | Versionnage                   | SemVer : 0.x pendant le développement, 1.0.0 pour la v1, tags Git + GitHub Releases + CHANGELOG |
| 2   | Branches                      | GitHub Flow : `main` protégée, une branche courte par tâche, fusion par PR (squash)             |
| 3   | Messages de commit            | Conventional Commits en anglais (`feat`, `fix`, `refactor`, `docs`, `chore`…)                   |
| 4   | Stack                         | HTML, CSS, JavaScript vanilla en modules ES, Vite                                               |
| 5   | Qualité                       | ESLint, Prettier, tests Vitest sur le calcul des scores                                         |
| 6   | CI/CD                         | GitHub Actions : lint + tests sur chaque PR, déploiement GitHub Pages depuis `main`             |
| 7   | Données                       | Questions en JSON (`id`, `text`, `category`), séparées du code                                  |
| 8   | Sauvegarde locale             | `localStorage` pour reprendre un test ; aucune donnée ne quitte le navigateur                   |
| 9   | Graphique                     | Histogramme maison en SVG/CSS                                                                   |
| 10  | « Sauvegarder mes résultats » | PDF téléchargé directement (jsPDF chargé au clic, v0.5.1)                                       |
| 11  | Accessibilité                 | Objectif WCAG 2.1 AA                                                                            |
| 12  | Suivi                         | GitHub Issues, un milestone par version, un tableau GitHub Projects                             |
| 13  | Licence du code               | Tous droits réservés                                                                            |
| 14  | Droits sur le questionnaire   | Vérifier auprès de l'éditeur du livre de D. Chalvin avant tout usage commercial                 |

Détails de la v0.1.0, validés le même jour : code en anglais et textes en français ; Prettier
avec 4 espaces, guillemets doubles et points-virgules ; npm et Node 22 LTS ; maquettes dans
`docs/maquettes/` ; déploiement par GitHub Actions (URL sans `/app/`) ; `main` protégée ;
branche `develop` supprimée après la restructuration ; comportement de l'app inchangé.
