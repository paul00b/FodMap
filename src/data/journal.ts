// =============================================================================
// Journal alimentaire — suivre ce que je mange et son effet sur moi.
// 100% local (localStorage). Tout en français.
// =============================================================================

/** Intensité globale du ressenti après le repas. */
export type Severity = 'none' | 'mild' | 'moderate' | 'severe';

/** Symptôme ressenti. */
export type SymptomId =
  | 'ballonnements'
  | 'douleur'
  | 'gaz'
  | 'diarrhee'
  | 'constipation'
  | 'nausee'
  | 'reflux'
  | 'urgence'
  | 'fatigue';

/** Type de douleur (pertinent si le symptôme « douleur » est sélectionné). */
export type PainTypeId = 'crampes' | 'brulure' | 'lancinante' | 'spasmes' | 'diffuse';

/** Délai d'apparition des symptômes après l'ingestion. */
export type DelayId = 'immediat' | 'sous1h' | 'h1a3' | 'h3a6' | 'plus6h' | 'lendemain';

export interface JournalEntry {
  id: string;
  /** Date + heure (ISO). Renseignée automatiquement, modifiable. */
  at: string;
  /** Nom de l'aliment / repas (libre ou choisi dans la base). */
  food: string;
  /** Référence à foods.ts si l'aliment vient de la base. */
  foodId?: string;
  /** Portion mangée (texte court : « Normale », « 100 g »…). */
  portion?: string;
  /** Ressenti global. */
  severity: Severity;
  /** Symptômes ressentis. */
  symptoms: SymptomId[];
  /** Type de douleur, si applicable. */
  painType?: PainTypeId;
  /** Délai d'apparition. */
  delay?: DelayId;
  /** Notes libres. */
  notes?: string;
}

// --- Libellés -----------------------------------------------------------------

export const SEVERITY_LABEL: Record<Severity, string> = {
  none: 'Rien',
  mild: 'Léger',
  moderate: 'Modéré',
  severe: 'Fort',
};

/** Couleur (classe Tailwind) associée à chaque intensité, alignée sur le thème. */
export const SEVERITY_STYLE: Record<Severity, string> = {
  none: 'bg-green-soft text-green',
  mild: 'bg-amber-soft text-amber',
  moderate: 'bg-amber-soft text-amber',
  severe: 'bg-red-soft text-red',
};

export const SEVERITY_ORDER: Severity[] = ['none', 'mild', 'moderate', 'severe'];

export const SYMPTOM_LABEL: Record<SymptomId, string> = {
  ballonnements: 'Ballonnements',
  douleur: 'Douleur au ventre',
  gaz: 'Gaz',
  diarrhee: 'Diarrhée',
  constipation: 'Constipation',
  nausee: 'Nausée',
  reflux: 'Reflux / brûlures',
  urgence: 'Urgence',
  fatigue: 'Fatigue',
};

export const SYMPTOM_ORDER: SymptomId[] = [
  'ballonnements',
  'douleur',
  'gaz',
  'diarrhee',
  'constipation',
  'nausee',
  'reflux',
  'urgence',
  'fatigue',
];

export const PAIN_TYPE_LABEL: Record<PainTypeId, string> = {
  crampes: 'Crampes',
  brulure: 'Brûlure',
  lancinante: 'Lancinante',
  spasmes: 'Spasmes',
  diffuse: 'Diffuse',
};

export const PAIN_TYPE_ORDER: PainTypeId[] = ['crampes', 'brulure', 'lancinante', 'spasmes', 'diffuse'];

export const DELAY_LABEL: Record<DelayId, string> = {
  immediat: 'Immédiat',
  sous1h: '< 1 h',
  h1a3: '1–3 h',
  h3a6: '3–6 h',
  plus6h: '> 6 h',
  lendemain: 'Lendemain',
};

export const DELAY_ORDER: DelayId[] = ['immediat', 'sous1h', 'h1a3', 'h3a6', 'plus6h', 'lendemain'];

/** Portions proposées en accès rapide (modifiable ensuite). */
export const PORTION_PRESETS = ['Petite', 'Normale', 'Grosse'] as const;

// --- Helpers ------------------------------------------------------------------

/** Identifiant unique, avec repli si crypto.randomUUID indisponible. */
export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `j_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** ISO → valeur pour <input type="datetime-local"> (heure locale). */
export function toLocalInput(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Valeur de <input type="datetime-local"> → ISO. */
export function fromLocalInput(value: string): string {
  return new Date(value).toISOString();
}

/** « 14:05 » — heure seule, pour les listes groupées par jour. */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

/** Clé de groupe par jour (AAAA-MM-JJ en heure locale). */
export function dayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Titre lisible d'un jour : « Aujourd'hui », « Hier », sinon « mardi 17 juin ». */
export function formatDayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(today) - startOf(d)) / 86_400_000);
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}
