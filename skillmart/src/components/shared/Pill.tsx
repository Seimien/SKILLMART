/* Pill — small coloured badge chip used for categories, badges, statuses */
type Variant = "default" | "green" | "amber" | "blue" | "red" | "outline";

const STYLES: Record<Variant, string> = {
  default: "bg-[var(--secondary)] text-[var(--foreground)] border-[var(--border)]",
  green:   "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  amber:   "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  blue:    "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800",
  red:     "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  outline: "bg-transparent text-[var(--muted-fg)] border-[var(--border)]",
};

interface Props { children: React.ReactNode; variant?: Variant; }

export function Pill({ children, variant = "default" }: Props) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${STYLES[variant]}`}>
      {children}
    </span>
  );
}
