import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { foods } from '../data/foods';
import type { Food, FodmapStatus, FoodCategory } from '../data/types';

const fuse = new Fuse(foods, {
  keys: [
    { name: 'name', weight: 0.8 },
    { name: 'note', weight: 0.2 },
  ],
  threshold: 0.38,
  ignoreLocation: true,
  minMatchCharLength: 2,
});

export interface FoodFilters {
  query: string;
  category: FoodCategory | 'all';
  status: FodmapStatus | 'all';
}

/** Recherche fuzzy + filtres catégorie/statut sur la base d'aliments. */
export function useFoodSearch({ query, category, status }: FoodFilters): Food[] {
  return useMemo(() => {
    const trimmed = query.trim();
    let list: Food[] = trimmed.length >= 2 ? fuse.search(trimmed).map((r) => r.item) : foods;

    if (category !== 'all') list = list.filter((f) => f.category === category);
    if (status !== 'all') list = list.filter((f) => f.status === status);

    // Sans recherche : tri alphabétique pour une liste lisible.
    if (trimmed.length < 2) {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    }
    return list;
  }, [query, category, status]);
}
