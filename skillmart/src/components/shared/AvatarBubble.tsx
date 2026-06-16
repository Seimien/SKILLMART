type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "w-7 h-7 text-[11px]",
  md: "w-9 h-9 text-sm",
  lg: "w-14 h-14 text-xl",
};

interface Props { initials: string; size?: Size; className?: string; }

export function AvatarBubble({ initials, size = "md", className = "bg-[var(--accent)] text-[var(--primary)]" }: Props) {
  return (
    <div className={`${SIZES[size]} ${className} rounded-full flex items-center justify-center font-bold shrink-0`}>
      {initials}
    </div>
  );
}
