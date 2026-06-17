import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { recipes } from '../../data/recipes';
import type { Cuisine, FodmapStatus } from '../../data/types';
import { CUISINE_LABEL, STATUS_LABEL } from '../../data/types';
import type { MealEntry } from '../../hooks/useMealPlan';
import { StatusBadge, FilterPill } from '../Badge/Badge';
import { Button } from '../ui/Button';
import { CloseIcon, SearchIcon, ClockIcon, PlusIcon } from '../ui/Icons';

const fuse = new Fuse(recipes, {
  keys: ['name', 'description', 'tags'],
  threshold: 0.38,
  ignoreLocation: true,
});

const CUISINES: (Cuisine | 'all')[] = ['all', 'french', 'asian', 'everyday'];
const STATUSES: (FodmapStatus | 'all')[] = ['all', 'safe', 'moderate'];

interface RecipePickerProps {
  slotLabel: string;
  onClose: () => void;
  onPick: (entry: MealEntry) => void;
}

export function RecipePicker({ slotLabel, onClose, onPick }: RecipePickerProps) {
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState<Cuisine | 'all'>('all');
  const [status, setStatus] = useState<FodmapStatus | 'all'>('all');
  const [freeText, setFreeText] = useState('');

  const results = useMemo(() => {
    let list = query.trim().length >= 2 ? fuse.search(query.trim()).map((r) => r.item) : recipes;
    if (cuisine !== 'all') list = list.filter((r) => r.cuisine === cuisine);
    if (status !== 'all') list = list.filter((r) => r.status === status);
    return list;
  }, [query, cuisine, status]);

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      {/* Overlay */}
      <button type="button" aria-label="Fermer" onClick={onClose} className="absolute inset-0 bg-ink/30 backdrop-blur-sm" />

      {/* Feuille */}
      <div className="relative mt-12 flex w-full max-w-[430px] flex-col rounded-t-card bg-bg shadow-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{slotLabel}</p>
            <h2 className="font-display text-2xl text-ink">Choisir une recette</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="text-muted hover:text-ink">
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4">
          {/* Repas libre */}
          <div className="rounded-card border border-border-soft bg-surface p-4 shadow-card">
            <label className="text-sm font-medium text-ink">Repas libre</label>
            <div className="mt-2 flex gap-2">
              <input
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="Ex : Restes du dîner, restaurant…"
                className="min-w-0 flex-1 rounded-btn border border-border bg-bg px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-amber/60"
              />
              <Button
                variant="primary"
                disabled={!freeText.trim()}
                onClick={() => onPick({ kind: 'free', text: freeText.trim() })}
                className="px-4 py-2.5"
              >
                <PlusIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Recherche recette */}
          <div className="relative mt-4">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une recette…"
              className="w-full rounded-btn border border-border bg-surface py-3 pl-12 pr-4 text-base text-ink outline-none placeholder:text-muted focus:border-amber/60"
            />
          </div>

          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            {CUISINES.map((c) => (
              <FilterPill key={c} active={cuisine === c} onClick={() => setCuisine(c)}>
                {c === 'all' ? 'Toutes' : CUISINE_LABEL[c]}
              </FilterPill>
            ))}
          </div>
          <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
            {STATUSES.map((s) => (
              <FilterPill key={s} active={status === s} onClick={() => setStatus(s)}>
                {s === 'all' ? 'Tous statuts' : STATUS_LABEL[s]}
              </FilterPill>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {results.map((recipe) => (
              <button
                key={recipe.id}
                type="button"
                onClick={() => onPick({ kind: 'recipe', recipeId: recipe.id })}
                className="block w-full rounded-card border border-border-soft bg-surface p-4 text-left shadow-card transition-colors hover:border-amber/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg leading-snug text-ink">{recipe.name}</h3>
                  <StatusBadge status={recipe.status} size="sm" className="shrink-0" />
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{recipe.description}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                  <ClockIcon className="h-4 w-4" />
                  {recipe.prepTime + recipe.cookTime} min · {CUISINE_LABEL[recipe.cuisine]}
                </p>
              </button>
            ))}
            {results.length === 0 && (
              <p className="py-8 text-center text-sm text-muted">Aucune recette ne correspond à ces filtres.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
