import type { FodmapStatus } from '../../data/types';
import { STATUS_LABEL } from '../../data/types';

const STATUS_STYLES: Record<FodmapStatus, string> = {
  safe: 'bg-green-soft text-green',
  moderate: 'bg-amber-soft text-amber',
  avoid: 'bg-red-soft text-red',
};

const SIZES = {
  sm: 'px-2.5 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

interface StatusBadgeProps {
  status: FodmapStatus;
  size?: keyof typeof SIZES;
  className?: string;
}

/** Pill arrondie, fond légèrement teinté, texte coloré. */
export function StatusBadge({ status, size = 'md', className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${STATUS_STYLES[status]} ${SIZES[size]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}

interface PillProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

/** Pill neutre utilisée pour les filtres. */
export function FilterPill({ children, active = false, onClick, className = '' }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'border-amber bg-amber text-white'
          : 'border-border bg-surface text-muted hover:text-ink'
      } ${className}`}
    >
      {children}
    </button>
  );
}
