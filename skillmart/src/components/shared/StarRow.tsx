import { Star } from "lucide-react";

interface Props { rating: number; count?: number; }

export function StarRow({ rating, count }: Props) {
  return (
    <span className="flex items-center gap-1">
      <span className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i} size={11}
            className={i < Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-stone-300 fill-stone-300 dark:text-stone-600 dark:fill-stone-600"}
          />
        ))}
      </span>
      <span className="text-xs font-mono text-[var(--muted-fg)]">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-[var(--muted-fg)]">({count})</span>
      )}
    </span>
  );
}
