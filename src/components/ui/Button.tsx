import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'outline' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-amber text-white border border-amber hover:bg-amber/90',
  outline: 'bg-surface text-ink border border-border hover:border-amber/60',
  ghost: 'bg-transparent text-muted border border-transparent hover:text-ink',
};

/** Bouton — outline fin par défaut, CTA ambre plein. */
export function Button({ variant = 'outline', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-btn px-5 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
