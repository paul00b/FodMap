import { useLocalStorage } from './useLocalStorage';

export type MealSlot = 'breakfast' | 'lunch' | 'dinner';

export const MEAL_SLOTS: { id: MealSlot; label: string }[] = [
  { id: 'breakfast', label: 'Petit-déjeuner' },
  { id: 'lunch', label: 'Déjeuner' },
  { id: 'dinner', label: 'Dîner' },
];

export const WEEKDAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export type MealEntry = { kind: 'recipe'; recipeId: string } | { kind: 'free'; text: string };

/** Plan d'une semaine : index du jour (0 = lundi) -> créneau -> entrée. */
export type WeekPlan = Record<number, Partial<Record<MealSlot, MealEntry>>>;

// ---------------------------------------------------------------------------
// Helpers de semaine ISO (lundi -> dimanche)
// ---------------------------------------------------------------------------

/** Numéro de semaine ISO 8601. */
export function getISOWeek(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // lundi = 0
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // jeudi de la semaine
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  const week = 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000));
  return { year: d.getUTCFullYear(), week };
}

/** Clé localStorage : `mealplan-2025-W23`. */
export function weekKey(date: Date): string {
  const { year, week } = getISOWeek(date);
  return `mealplan-${year}-W${String(week).padStart(2, '0')}`;
}

/** Lundi de la semaine contenant `date`. */
export function getMonday(date: Date): Date {
  const d = new Date(date);
  const dayNum = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - dayNum);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addWeeks(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n * 7);
  return d;
}

/** Les 7 dates (lundi -> dimanche) de la semaine. */
export function getWeekDays(date: Date): Date[] {
  const monday = getMonday(date);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export function formatWeekLabel(date: Date): string {
  const days = getWeekDays(date);
  const fmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });
  const { week } = getISOWeek(date);
  return `Semaine ${week} · ${fmt.format(days[0])} – ${fmt.format(days[6])}`;
}

/** Hook : plan de la semaine donnée, persistant en localStorage. */
export function useMealPlan(reference: Date) {
  const [plan, setPlan] = useLocalStorage<WeekPlan>(weekKey(reference), {});

  const setEntry = (day: number, slot: MealSlot, entry: MealEntry | null) => {
    setPlan((prev) => {
      const next: WeekPlan = { ...prev, [day]: { ...prev[day] } };
      if (entry === null) {
        delete next[day][slot];
      } else {
        next[day][slot] = entry;
      }
      return next;
    });
  };

  return { plan, setEntry, setPlan };
}
