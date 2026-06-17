import { useCallback, useEffect, useState } from 'react';

/**
 * État persistant en localStorage. 100% client-side.
 * Se resynchronise si la clé change (utile pour le plan par semaine).
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const read = useCallback((): T => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
    // initialValue volontairement hors deps : on ne relit que sur changement de clé
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const [value, setValue] = useState<T>(read);

  // Resynchronise quand la clé change (ex: navigation de semaine).
  useEffect(() => {
    setValue(read());
  }, [read]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota dépassé ou stockage indisponible : on ignore silencieusement */
    }
  }, [key, value]);

  return [value, setValue] as const;
}
