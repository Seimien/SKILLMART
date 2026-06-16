import { Heart } from "lucide-react";
import { useApp } from "../../context/AppContext";
import type { Product } from "../../types";
import { AvatarBubble } from "./AvatarBubble";
import { Pill } from "./Pill";
import { StarRow } from "./StarRow";

const BADGE_VARIANT: Record<string, "amber" | "green" | "blue" | "default"> = {
  Bestseller: "amber",
  "Top Rated": "green",
  Pro: "blue",
  New: "default",
};

const fmt = (n: number) => `$${n.toFixed(2)}`;

interface Props { product: Product; onClick: () => void; }

export function ProductCard({ product: p, onClick }: Props) {
  const { addToCart, wishlist, toggleWishlist } = useApp();
  const isHire      = p.category === "Hire";
  const wishlisted  = wishlist.includes(p.id);

  return (
    <div
      onClick={onClick}
      className="card flex flex-col cursor-pointer group hover:shadow-md transition-all duration-200 overflow-hidden"
      style={{ borderRadius: "var(--radius)" }}
    >
      {/* Thumbnail */}
      <div className="relative bg-muted h-40 overflow-hidden">
        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {p.badge && (
          <div className="absolute top-2 left-2">
            <Pill variant={BADGE_VARIANT[p.badge] ?? "default"}>{p.badge}</Pill>
          </div>
        )}

        {/* Wishlist toggle */}
        <button
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 dark:bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
          onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={13} className={wishlisted ? "text-red-500 fill-red-500" : "text-[var(--muted-fg)]"} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-3.5 gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-fg)]">{p.category}</span>
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
          {p.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <AvatarBubble initials={p.sellerAvatar} size="sm" />
          <span className="text-xs text-[var(--muted-fg)] truncate">{p.seller}</span>
        </div>
        <StarRow rating={p.rating} count={p.reviews} />

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-1.5 mt-auto">
          <span className="font-bold text-sm font-mono">
            {isHire ? `${fmt(p.price)}/hr` : fmt(p.price)}
          </span>
          {isHire ? (
            /* Hire — contact, not cart */
            <button
              className="text-[var(--primary)] text-xs font-semibold border border-[var(--primary)]/40 px-3 py-1.5 rounded-lg hover:bg-[var(--accent)] transition-colors"
              onClick={(e) => { e.stopPropagation(); onClick(); }}
            >
              View Profile
            </button>
          ) : (
            <button
              className="btn-primary text-xs px-3 py-1.5"
              onClick={(e) => { e.stopPropagation(); addToCart(p); }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
