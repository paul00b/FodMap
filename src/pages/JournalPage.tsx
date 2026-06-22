import { useMemo, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { JournalForm } from '../components/Journal/JournalForm';
import { FilterPill } from '../components/Badge/Badge';
import { PlusIcon, PencilIcon, TrashIcon } from '../components/ui/Icons';
import { useJournal } from '../hooks/useJournal';
import {
  DELAY_LABEL,
  PAIN_TYPE_LABEL,
  SEVERITY_LABEL,
  SEVERITY_STYLE,
  SYMPTOM_LABEL,
  dayKey,
  formatDayLabel,
  formatTime,
  type JournalEntry,
  type SymptomId,
} from '../data/journal';

type Editing = { mode: 'new' } | { mode: 'edit'; entry: JournalEntry } | null;

export function JournalPage() {
  const { entries, addEntry, updateEntry, removeEntry } = useJournal();
  const [editing, setEditing] = useState<Editing>(null);
  const [symptomFilter, setSymptomFilter] = useState<SymptomId | 'all'>('all');

  // Symptômes réellement présents dans le journal, par fréquence décroissante.
  const usedSymptoms = useMemo(() => {
    const count = new Map<SymptomId, number>();
    for (const e of entries) for (const s of e.symptoms) count.set(s, (count.get(s) ?? 0) + 1);
    return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);
  }, [entries]);

  const filtered = useMemo(
    () => (symptomFilter === 'all' ? entries : entries.filter((e) => e.symptoms.includes(symptomFilter))),
    [entries, symptomFilter],
  );

  // Regroupement par jour, en conservant l'ordre antéchronologique.
  const groups = useMemo(() => {
    const map = new Map<string, JournalEntry[]>();
    for (const e of filtered) {
      const k = dayKey(e.at);
      const arr = map.get(k);
      if (arr) arr.push(e);
      else map.set(k, [e]);
    }
    return [...map.entries()];
  }, [filtered]);

  const addAction = (
    <Button variant="primary" onClick={() => setEditing({ mode: 'new' })} className="px-4 py-2.5">
      <PlusIcon className="h-5 w-5" />
      Ajouter
    </Button>
  );

  if (entries.length === 0) {
    return (
      <AppShell eyebrow="Mon suivi" title="Journal" action={addAction}>
        <div className="mt-10 rounded-card border border-dashed border-border bg-surface/60 p-8 text-center">
          <p className="font-display text-2xl text-ink">Aucune entrée</p>
          <p className="mt-2 text-sm text-muted">
            Note ce que tu manges et comment tu te sens ensuite. En quelques jours, tu repéreras les aliments qui te
            posent problème.
          </p>
          <Button variant="primary" className="mt-5" onClick={() => setEditing({ mode: 'new' })}>
            <PlusIcon className="h-5 w-5" />
            Ajouter une entrée
          </Button>
        </div>
        {editing && (
          <JournalForm
            onClose={() => setEditing(null)}
            onSubmit={(draft) => {
              addEntry(draft);
              setEditing(null);
            }}
          />
        )}
      </AppShell>
    );
  }

  return (
    <AppShell eyebrow="Mon suivi" title="Journal" action={addAction}>
      <p className="text-sm text-muted">
        {entries.length} entrée{entries.length > 1 ? 's' : ''} enregistrée{entries.length > 1 ? 's' : ''}
      </p>

      {/* Filtre par symptôme */}
      {usedSymptoms.length > 0 && (
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
          <FilterPill active={symptomFilter === 'all'} onClick={() => setSymptomFilter('all')}>
            Tous
          </FilterPill>
          {usedSymptoms.map((id) => (
            <FilterPill key={id} active={symptomFilter === id} onClick={() => setSymptomFilter(id)}>
              {SYMPTOM_LABEL[id]}
            </FilterPill>
          ))}
        </div>
      )}

      {/* Historique groupé par jour */}
      <div className="mt-6 space-y-7">
        {groups.map(([key, dayEntries]) => (
          <section key={key}>
            <h2 className="mb-3 font-display text-2xl capitalize text-ink">{formatDayLabel(dayEntries[0].at)}</h2>
            <div className="space-y-3">
              {dayEntries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onEdit={() => setEditing({ mode: 'edit', entry })}
                  onDelete={() => removeEntry(entry.id)}
                />
              ))}
            </div>
          </section>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">Aucune entrée avec ce symptôme.</p>
        )}
      </div>

      {editing && (
        <JournalForm
          initial={editing.mode === 'edit' ? editing.entry : undefined}
          onClose={() => setEditing(null)}
          onSubmit={(draft) => {
            if (editing.mode === 'edit') updateEntry(editing.entry.id, draft);
            else addEntry(draft);
            setEditing(null);
          }}
        />
      )}
    </AppShell>
  );
}

interface EntryCardProps {
  entry: JournalEntry;
  onEdit: () => void;
  onDelete: () => void;
}

function EntryCard({ entry, onEdit, onDelete }: EntryCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="rounded-card border border-border-soft bg-surface p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted">{formatTime(entry.at)}</p>
          <h3 className="font-display text-lg leading-snug text-ink">{entry.food}</h3>
          {entry.portion && <p className="text-sm text-muted">{entry.portion}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${SEVERITY_STYLE[entry.severity]}`}
          >
            {SEVERITY_LABEL[entry.severity]}
          </span>
          <button type="button" onClick={onEdit} aria-label="Modifier" className="p-1.5 text-muted hover:text-amber">
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => (confirmDelete ? onDelete() : setConfirmDelete(true))}
            onBlur={() => setConfirmDelete(false)}
            aria-label={confirmDelete ? 'Confirmer la suppression' : 'Supprimer'}
            className={`p-1.5 ${confirmDelete ? 'text-red' : 'text-muted hover:text-red'}`}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {entry.symptoms.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {entry.symptoms.map((s) => (
            <span key={s} className="rounded-full bg-bg px-2.5 py-0.5 text-xs text-ink">
              {SYMPTOM_LABEL[s]}
              {s === 'douleur' && entry.painType ? ` · ${PAIN_TYPE_LABEL[entry.painType]}` : ''}
            </span>
          ))}
        </div>
      )}

      {(entry.delay || entry.notes) && (
        <div className="mt-3 space-y-1 border-t border-border-soft pt-3">
          {entry.delay && (
            <p className="text-xs text-muted">
              <span className="font-medium text-ink">Délai :</span> {DELAY_LABEL[entry.delay]}
            </p>
          )}
          {entry.notes && <p className="text-sm text-ink">{entry.notes}</p>}
        </div>
      )}
    </div>
  );
}
