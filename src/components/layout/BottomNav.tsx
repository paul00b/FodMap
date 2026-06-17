import { LeafIcon, CalendarIcon, CartIcon } from '../ui/Icons';

export type Tab = 'search' | 'planner' | 'shopping';

const TABS: { id: Tab; label: string; Icon: typeof LeafIcon }[] = [
  { id: 'search', label: 'Aliments', Icon: LeafIcon },
  { id: 'planner', label: 'Planificateur', Icon: CalendarIcon },
  { id: 'shopping', label: 'Courses', Icon: CartIcon },
];

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[430px] border-t border-border bg-surface/95 backdrop-blur">
      <div className="flex items-stretch justify-around pb-[env(safe-area-inset-bottom)]">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? 'text-amber' : 'text-muted'
              }`}
            >
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2 : 1.6} />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
