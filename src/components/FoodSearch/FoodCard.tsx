import type { Food } from '../../data/types';
import { CATEGORY_LABEL } from '../../data/types';
import { StatusBadge } from '../Badge/Badge';

export function FoodCard({ food }: { food: Food }) {
  return (
    <article className="rounded-card border border-border-soft bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-snug text-ink">{food.name}</h3>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-muted">{CATEGORY_LABEL[food.category]}</p>
        </div>
        <StatusBadge status={food.status} size="sm" className="mt-1 shrink-0" />
      </div>

      {(food.note || food.portion) && (
        <div className="mt-3 space-y-1.5 border-t border-border-soft pt-3 text-sm">
          {food.portion && (
            <p className="text-ink">
              <span className="text-muted">Portion de référence : </span>
              {food.portion}
            </p>
          )}
          {food.note && <p className="text-muted">{food.note}</p>}
        </div>
      )}
    </article>
  );
}
