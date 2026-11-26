# 0002 - Charte graphique et mise en page (v0.4.0)

Date : 2026-11-27 · Statut : validé

- Palette A « Ardoise » : fond `#eef1f5`, texte `#1e2633`, principale `#2f5d8a`. Postures : passif `#627691`, agressif `#c35037`, manipulateur `#8964ac`, assertif `#2b8368` (foncées en v0.4.0 partie 2 pour atteindre le contraste AA 4,5:1, focus `#c9780e` à 3,4:1). Valeurs dans `src/styles/tokens.css`.
- Typographie 1 : Inter (texte) et Space Grotesk (titres), incluses via `@fontsource`, sans appel à Google Fonts (RGPD).
- Mise en page en colonne, 640 px maximum, marges de 16 px sur mobile, boutons d'au moins 48 px.
- Réponse choisie remplie de la couleur principale avec une coche ; navigation « ← Précédent » / « Suivant → ».
- Titres d'écran en majuscules, avec leurs accents.
- Accueil : bouton « Commencer » et durée indicative.
- Espaces insécables typographiques françaises (`src/core/typography.js`).
- Pas de mode sombre en v0.4.0.

Maquettes : `docs/maquettes/v0.4.0/`.
