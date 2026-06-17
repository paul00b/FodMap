import { useMemo, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/Badge/Badge';
import { RecipePicker } from '../components/RecipePicker/RecipePicker';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, PlusIcon, CartIcon } from '../components/ui/Icons';
import { recipes } from '../data/recipes';
import {
  useMealPlan,
  MEAL_SLOTS,
  WEEKDAYS,
  addWeeks,
  formatWeekLabel,
  type MealSlot,
  type MealEntry,
} from '../hooks/useMealPlan';
import { generateShoppingList } from '../lib/shopping';
import { SHOPPING_KEY } from './ShoppingPage';

const recipeById = new Map(recipes.map((r) => [r.id, r]));

interface PlannerPageProps {
  onGoToShopping: () => void;
}

export function PlannerPage({ onGoToShopping }: PlannerPageProps) {
  const [reference, setReference] = useState(() => new Date());
  const { plan, setEntry } = useMealPlan(reference);
  const [picking, setPicking] = useState<{ day: number; slot: MealSlot } | null>(null);

  const plannedRecipeIds = useMemo(() => {
    const ids: string[] = [];
    for (const day of Object.values(plan)) {
      for (const entry of Object.values(day)) {
        if (entry?.kind === 'recipe') ids.push(entry.recipeId);
      }
    }
    return ids;
  }, [plan]);

  const handleGenerate = () => {
    const items = generateShoppingList(plannedRecipeIds);
    localStorage.setItem(SHOPPING_KEY, JSON.stringify(items));
    onGoToShopping();
  };

  const renderEntry = (entry: MealEntry, day: number, slot: MealSlot) => {
    const recipe = entry.kind === 'recipe' ? recipeById.get(entry.recipeId) : undefined;
    return (
      <div className="flex items-center justify-between gap-2 rounded-xl bg-bg px-3 py-2">
        <div className="min-w-0">
          {recipe ? (
            <>
              <p className="truncate text-sm font-medium text-ink">{recipe.name}</p>
              <StatusBadge status={recipe.status} size="sm" className="mt-1" />
            </>
          ) : (
            <p className="truncate text-sm text-ink">{entry.kind === 'free' ? entry.text : '—'}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setEntry(day, slot, null)}
          aria-label="Retirer"
          className="shrink-0 text-muted hover:text-red"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>
    );
  };

  return (
    <AppShell eyebrow="Ma semaine" title="Planificateur">
      {/* Navigation de semaine */}
      <div className="flex items-center justify-between rounded-card border border-border-soft bg-surface p-2 shadow-card">
        <button
          type="button"
          onClick={() => setReference((d) => addWeeks(d, -1))}
          aria-label="Semaine précédente"
          className="rounded-btn p-2 text-muted hover:text-ink"
        >
          <ChevronLeftIcon />
        </button>
        <p className="text-center text-sm font-medium text-ink">{formatWeekLabel(reference)}</p>
        <button
          type="button"
          onClick={() => setReference((d) => addWeeks(d, 1))}
          aria-label="Semaine suivante"
          className="rounded-btn p-2 text-muted hover:text-ink"
        >
          <ChevronRightIcon />
        </button>
      </div>

      <Button variant="primary" className="mt-4 w-full" onClick={handleGenerate} disabled={plannedRecipeIds.length === 0}>
        <CartIcon className="h-5 w-5" />
        Générer la liste de courses
      </Button>

      {/* Jours */}
      <div className="mt-6 space-y-5">
        {WEEKDAYS.map((dayLabel, dayIndex) => (
          <section key={dayIndex}>
            <h2 className="mb-2 font-display text-2xl text-ink">{dayLabel}</h2>
            <div className="space-y-2">
              {MEAL_SLOTS.map(({ id: slot, label }) => {
                const entry = plan[dayIndex]?.[slot];
                return (
                  <div key={slot} className="rounded-card border border-border-soft bg-surface p-4 shadow-card">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
                    {entry ? (
                      renderEntry(entry, dayIndex, slot)
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPicking({ day: dayIndex, slot })}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-sm text-muted hover:border-amber/60 hover:text-amber"
                      >
                        <PlusIcon className="h-4 w-4" />
                        Ajouter
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {picking && (
        <RecipePicker
          slotLabel={`${WEEKDAYS[picking.day]} · ${MEAL_SLOTS.find((s) => s.id === picking.slot)?.label}`}
          onClose={() => setPicking(null)}
          onPick={(entry) => {
            setEntry(picking.day, picking.slot, entry);
            setPicking(null);
          }}
        />
      )}
    </AppShell>
  );
}
