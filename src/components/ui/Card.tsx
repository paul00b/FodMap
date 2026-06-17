import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Filigrane décoratif (chiffre ou lettre) en Playfair Display, très clair. */
  watermark?: string | number;
}

/** Card — border-radius 20px, ombre douce, padding généreux, filigrane optionnel. */
export function Card({ watermark, className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-card border border-border-soft bg-surface p-6 shadow-card ${className}`}
      {...rest}
    >
      {watermark !== undefined && (
        <span
          className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[7rem] leading-none text-watermark"
          aria-hidden
        >
          {watermark}
        </span>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
