import { useMemo, useState } from 'react';
import { foods } from '../../data/foods';
import {
  DELAY_LABEL,
  DELAY_ORDER,
  PAIN_TYPE_LABEL,
  PAIN_TYPE_ORDER,
  PORTION_PRESETS,
  SEVERITY_LABEL,
  SEVERITY_ORDER,
  SYMPTOM_LABEL,
  SYMPTOM_ORDER,
  toLocalInput,
  fromLocalInput,
  type DelayId,
  type JournalEntry,
  type PainTypeId,
  type Severity,
  type SymptomId,
} from '../../data/journal';
import type { JournalDraft } from '../../hooks/useJournal';
import { FilterPill } from '../Badge/Badge';
import { Button } from '../ui/Button';
import { CloseIcon, SearchIcon } from '../ui/Icons';

/** Normalise pour une comparaison sans accents ni casse. */
const norm = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

interface JournalFormProps {
  /** Entrée à modifier ; absente = création. */
  initial?: JournalEntry;
  onClose: () => void;
  onSubmit: (draft: JournalDraft) => void;
}

export function JournalForm({ initial, onClose, onSubmit }: JournalFormProps) {
  const [food, setFood] = useState(initial?.food ?? '');
  const [foodId, setFoodId] = useState<string | undefined>(initial?.foodId);
  const [portion, setPortion] = useState(initial?.portion ?? '');
  const [at, setAt] = useState(toLocalInput(initial?.at ?? new Date().toISOString()));
  const [severity, setSeverity] = useState<Severity>(initial?.severity ?? 'none');
  const [symptoms, setSymptoms] = useState<SymptomId[]>(initial?.symptoms ?? []);
  const [painType, setPainType] = useState<PainTypeId | undefined>(initial?.painType);
  const [delay, setDelay] = useState<DelayId | undefined>(initial?.delay);
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [focusFood, setFocusFood] = useState(false);

  // Suggestions d'aliments (accès rapide à la base FODMAP).
  const suggestions = useMemo(() => {
    const q = norm(food.trim());
    if (q.length < 1) return [];
    return foods
      .filter((f) => norm(f.name).includes(q))
      .slice(0, 6);
  }, [food]);

  const toggleSymptom = (id: SymptomId) =>
    setSymptoms((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const hasPain = symptoms.includes('douleur');

  const handleSubmit = () => {
    const trimmedFood = food.trim();
    if (!trimmedFood) return;
    onSubmit({
      at: fromLocalInput(at),
      food: trimmedFood,
      foodId,
      portion: portion.trim() || undefined,
      severity,
      symptoms,
      painType: hasPain ? painType : undefined,
      delay,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <button type="button" aria-label="Fermer" onClick={onClose} className="absolute inset-0 bg-ink/30 backdrop-blur-sm" />

      <div className="relative mt-8 flex max-h-[calc(100vh-2rem)] w-full max-w-[430px] flex-col rounded-t-card bg-bg shadow-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Journal</p>
            <h2 className="font-display text-2xl text-ink">{initial ? 'Modifier l’entrée' : 'Nouvelle entrée'}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="text-muted hover:text-ink">
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-6 pt-5">
          {/* Aliment */}
          <div>
            <label className="text-sm font-semibold text-ink">Aliment ou repas</label>
            <div className="relative mt-2">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                value={food}
                onChange={(e) => {
                  setFood(e.target.value);
                  setFoodId(undefined);
                }}
                onFocus={() => setFocusFood(true)}
                onBlur={() => setTimeout(() => setFocusFood(false), 150)}
                placeholder="Ex : Pain complet, pomme, pâtes…"
                className="w-full rounded-btn border border-border bg-surface py-3 pl-12 pr-4 text-base text-ink outline-none placeholder:text-muted focus:border-amber/60"
              />
              {focusFood && suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-btn border border-border-soft bg-surface shadow-card">
                  {suggestions.map((f, i) => (
                    <button
                      key={f.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setFood(f.name);
                        setFoodId(f.id);
                        if (!portion && f.portion) setPortion(f.portion);
                        setFocusFood(false);
                      }}
                      className={`block w-full px-4 py-2.5 text-left text-sm text-ink hover:bg-bg ${
                        i > 0 ? 'border-t border-border-soft' : ''
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Portion */}
          <div>
            <label className="text-sm font-semibold text-ink">Portion</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PORTION_PRESETS.map((p) => (
                <FilterPill key={p} active={portion === p} onClick={() => setPortion(p)}>
                  {p}
                </FilterPill>
              ))}
            </div>
            <input
              value={portion}
              onChange={(e) => setPortion(e.target.value)}
              placeholder="Ou préciser (ex : 2 tranches, 150 g)…"
              className="mt-2 w-full rounded-btn border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-amber/60"
            />
          </div>

          {/* Date & heure */}
          <div>
            <label className="text-sm font-semibold text-ink">Date et heure</label>
            <input
              type="datetime-local"
              value={at}
              onChange={(e) => setAt(e.target.value)}
              className="mt-2 w-full rounded-btn border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-amber/60"
            />
          </div>

          {/* Ressenti global */}
          <div>
            <label className="text-sm font-semibold text-ink">Ressenti global</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {SEVERITY_ORDER.map((s) => (
                <FilterPill key={s} active={severity === s} onClick={() => setSeverity(s)}>
                  {SEVERITY_LABEL[s]}
                </FilterPill>
              ))}
            </div>
          </div>

          {/* Symptômes */}
          <div>
            <label className="text-sm font-semibold text-ink">Symptômes</label>
            <p className="mt-0.5 text-xs text-muted">Sélectionne tout ce qui s’applique.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SYMPTOM_ORDER.map((id) => (
                <FilterPill key={id} active={symptoms.includes(id)} onClick={() => toggleSymptom(id)}>
                  {SYMPTOM_LABEL[id]}
                </FilterPill>
              ))}
            </div>
          </div>

          {/* Type de douleur (si douleur) */}
          {hasPain && (
            <div>
              <label className="text-sm font-semibold text-ink">Type de douleur</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {PAIN_TYPE_ORDER.map((id) => (
                  <FilterPill
                    key={id}
                    active={painType === id}
                    onClick={() => setPainType((prev) => (prev === id ? undefined : id))}
                  >
                    {PAIN_TYPE_LABEL[id]}
                  </FilterPill>
                ))}
              </div>
            </div>
          )}

          {/* Délai d'apparition */}
          <div>
            <label className="text-sm font-semibold text-ink">Délai d’apparition</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {DELAY_ORDER.map((id) => (
                <FilterPill
                  key={id}
                  active={delay === id}
                  onClick={() => setDelay((prev) => (prev === id ? undefined : id))}
                >
                  {DELAY_LABEL[id]}
                </FilterPill>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-semibold text-ink">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Contexte, stress, médicaments, autres observations…"
              className="mt-2 w-full resize-none rounded-btn border border-border bg-surface px-4 py-3 text-sm text-ink outline-none placeholder:text-muted focus:border-amber/60"
            />
          </div>
        </div>

        <div className="border-t border-border bg-bg px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button variant="primary" className="w-full" onClick={handleSubmit} disabled={!food.trim()}>
            {initial ? 'Enregistrer les modifications' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
