interface IconProps {
  className?: string;
  strokeWidth?: number;
}

const base = (className?: string) => `h-6 w-6 ${className ?? ''}`.trim();

export function LeafIcon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  );
}

export function CalendarIcon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </svg>
  );
}

export function CartIcon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

export function SearchIcon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function CloseIcon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function PlusIcon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ChevronLeftIcon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function CheckIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ClockIcon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function CopyIcon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function TrashIcon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </svg>
  );
}

export function NotebookIcon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4a2 2 0 0 1 2-2h12a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2Z" />
      <path d="M4 7H2M4 12H2M4 17H2M9 7h6M9 11h6" />
    </svg>
  );
}

export function PencilIcon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
