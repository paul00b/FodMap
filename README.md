# FodMap

PWA personnelle de suivi du régime **sans FODMAP** — recherche d'aliments, planificateur de repas et liste de courses. 100% client-side, installable et utilisable hors-ligne.

> ⚠️ **Fiabilité des données** — tous les statuts FODMAP (`safe` / `moderate` / `avoid`) reflètent la recherche de **Monash University** (monashfodmap.com). Les statuts dépendent des portions (champs `portion` et `note`). En cas de doute sur un aliment, vérifie dans l'app Monash officielle.

## Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 (config CSS-first, palette warm)
- `fuse.js` (recherche fuzzy)
- `vite-plugin-pwa` / Workbox (service worker, offline)

## Scripts

```bash
npm install
npm run dev      # serveur de dev (http://localhost:5173)
npm run build    # build de production + service worker
npm run preview  # sert le build (SW actif, test offline)
```

## Architecture

```
src/
  data/        foods.ts (285 aliments) · recipes.ts (40 recettes) · types.ts
  components/  Badge · FoodSearch · RecipePicker · layout · ui
  hooks/       useLocalStorage · useFoodSearch · useMealPlan
  lib/         shopping.ts (agrégation de la liste de courses)
  pages/       SearchPage · PlannerPage · ShoppingPage
  App.tsx · main.tsx
```

## Données

- **Aliments** : 285 entrées (> 200 requis), incluant les indispensables asiatiques.
- **Recettes** : 40 (15 françaises, 15 asiatiques, 10 quotidiennes). Aucune recette ne contient d'ingrédient `avoid` ; ail/oignon remplacés par huile infusée à l'ail et parties vertes d'oignon vert.

## Persistance

- Plan de repas : `localStorage`, une clé par semaine ISO (`mealplan-2025-W23`).
- Liste de courses : `localStorage` (`fodmap-shopping-list`).
