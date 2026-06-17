import type { ReactNode } from 'react';

interface AppShellProps {
  /** Surtitre fin au-dessus du titre. */
  eyebrow?: string;
  title: string;
  /** Action optionnelle à droite du titre. */
  action?: ReactNode;
  children: ReactNode;
}

/** Conteneur mobile-first, max-width 430px centré, en-tête éditorial. */
export function AppShell({ eyebrow, title, action, children }: AppShellProps) {
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-bg pb-24">
      <header className="px-6 pb-2 pt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">{eyebrow}</p>
            )}
            <h1 className="font-display text-4xl leading-none text-ink">{title}</h1>
          </div>
          {action}
        </div>
      </header>
      <main className="px-6 pt-4">{children}</main>
    </div>
  );
}
