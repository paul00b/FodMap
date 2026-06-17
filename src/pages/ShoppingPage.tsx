import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { CheckIcon, CopyIcon, TrashIcon } from '../components/ui/Icons';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  SHOPPING_GROUP_LABEL,
  SHOPPING_GROUP_ORDER,
  shoppingListToText,
  type ShoppingItem,
} from '../lib/shopping';

export const SHOPPING_KEY = 'fodmap-shopping-list';

export function ShoppingPage() {
  const [items, setItems] = useLocalStorage<ShoppingItem[]>(SHOPPING_KEY, []);
  const [copied, setCopied] = useState(false);

  const toggle = (id: string) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)));

  const reset = () => setItems([]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shoppingListToText(items));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papier indisponible */
    }
  };

  const remaining = items.filter((i) => !i.checked).length;

  if (items.length === 0) {
    return (
      <AppShell eyebrow="Mes courses" title="Liste de courses">
        <div className="mt-10 rounded-card border border-dashed border-border bg-surface/60 p-8 text-center">
          <p className="font-display text-2xl text-ink">Liste vide</p>
          <p className="mt-2 text-sm text-muted">
            Planifie des repas puis appuie sur « Générer la liste de courses » dans le planificateur.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell eyebrow="Mes courses" title="Liste de courses">
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={copy}>
          <CopyIcon className="h-5 w-5" />
          {copied ? 'Copié !' : 'Copier la liste'}
        </Button>
        <Button variant="ghost" onClick={reset} aria-label="Réinitialiser" className="px-4">
          <TrashIcon className="h-5 w-5" />
        </Button>
      </div>

      <p className="mt-3 text-sm text-muted">
        {remaining} article{remaining > 1 ? 's' : ''} restant{remaining > 1 ? 's' : ''} sur {items.length}
      </p>

      <div className="mt-4 space-y-5">
        {SHOPPING_GROUP_ORDER.map((group) => {
          const groupItems = items.filter((i) => i.group === group);
          if (groupItems.length === 0) return null;
          return (
            <section key={group}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {SHOPPING_GROUP_LABEL[group]}
              </h2>
              <div className="overflow-hidden rounded-card border border-border-soft bg-surface shadow-card">
                {groupItems.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
                      idx > 0 ? 'border-t border-border-soft' : ''
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                        item.checked ? 'border-green bg-green text-white' : 'border-border'
                      }`}
                    >
                      {item.checked && <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm font-medium ${item.checked ? 'text-muted line-through' : 'text-ink'}`}>
                        {item.name}
                      </span>
                      {item.quantity && (
                        <span className={`block text-xs ${item.checked ? 'text-muted line-through' : 'text-muted'}`}>
                          {item.quantity}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
