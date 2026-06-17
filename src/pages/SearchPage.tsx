import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { FilterPill } from '../components/Badge/Badge';
import { FoodCard } from '../components/FoodSearch/FoodCard';
import { SearchIcon, CloseIcon } from '../components/ui/Icons';
import { useFoodSearch } from '../hooks/useFoodSearch';
import type { FodmapStatus, FoodCategory } from '../data/types';
import { CATEGORY_LABEL, STATUS_LABEL } from '../data/types';

const CATEGORIES: (FoodCategory | 'all')[] = [
  'all',
  'fruit',
  'vegetable',
  'cereal',
  'protein',
  'dairy',
  'condiment',
  'sauce',
  'other',
];
const STATUSES: (FodmapStatus | 'all')[] = ['all', 'safe', 'moderate', 'avoid'];

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FoodCategory | 'all'>('all');
  const [status, setStatus] = useState<FodmapStatus | 'all'>('all');

  const results = useFoodSearch({ query, category, status });

  return (
    <AppShell eyebrow="Rechercher" title="Aliments">
      {/* Barre de recherche proéminente */}
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          type="search"
          inputMode="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un aliment…"
          className="w-full rounded-btn border border-border bg-surface py-3.5 pl-12 pr-11 text-base text-ink shadow-card outline-none placeholder:text-muted focus:border-amber/60"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Effacer"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filtres statut */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        {STATUSES.map((s) => (
          <FilterPill key={s} active={status === s} onClick={() => setStatus(s)}>
            {s === 'all' ? 'Tous statuts' : STATUS_LABEL[s]}
          </FilterPill>
        ))}
      </div>

      {/* Filtres catégorie */}
      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
        {CATEGORIES.map((c) => (
          <FilterPill key={c} active={category === c} onClick={() => setCategory(c)}>
            {c === 'all' ? 'Toutes catégories' : CATEGORY_LABEL[c]}
          </FilterPill>
        ))}
      </div>

      <p className="mt-5 text-sm text-muted">
        {results.length} aliment{results.length > 1 ? 's' : ''}
      </p>

      {/* Résultats */}
      {results.length > 0 ? (
        <div className="mt-3 space-y-3">
          {results.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-card border border-dashed border-border bg-surface/60 p-8 text-center">
          <p className="font-display text-2xl text-ink">Aucun résultat{query ? ` pour « ${query} »` : ''}</p>
          <p className="mt-2 text-sm text-muted">
            Si tu doutes d’un aliment, consulte l’app Monash University pour vérifier son statut FODMAP.
          </p>
        </div>
      )}
    </AppShell>
  );
}
