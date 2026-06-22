import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { newId, type JournalEntry } from '../data/journal';

export const JOURNAL_KEY = 'fodmap-journal';

/** Données d'un repas saisi (sans id), pour créer ou mettre à jour une entrée. */
export type JournalDraft = Omit<JournalEntry, 'id'>;

/** Gestion du journal alimentaire, persisté en localStorage. */
export function useJournal() {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>(JOURNAL_KEY, []);

  /** Entrées triées de la plus récente à la plus ancienne. */
  const sorted = useMemo(
    () => [...entries].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()),
    [entries],
  );

  const addEntry = useCallback(
    (draft: JournalDraft) => {
      setEntries((prev) => [{ ...draft, id: newId() }, ...prev]);
    },
    [setEntries],
  );

  const updateEntry = useCallback(
    (id: string, draft: JournalDraft) => {
      setEntries((prev) => prev.map((e) => (e.id === id ? { ...draft, id } : e)));
    },
    [setEntries],
  );

  const removeEntry = useCallback(
    (id: string) => {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    },
    [setEntries],
  );

  return { entries: sorted, addEntry, updateEntry, removeEntry };
}
