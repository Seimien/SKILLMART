import { ArrowLeft, Check, Download, Heart, Share2, ShieldCheck, Star } from "lucide-react";
import { useApp } from "../context/AppContext";
import { AvatarBubble } from "../components/shared/AvatarBubble";
import { Pill } from "../components/shared/Pill";
import { StarRow } from "../components/shared/StarRow";
import { ProductCard } from "../components/shared/ProductCard";
import type { Product } from "../types";

const fmt = (n: number) => `$${n.toFixed(2)}`;

export function ProductDetail() {
  const { selectedProduct: p, go, setSelectedProduct, addToCart, wishlist, toggleWishlist, products, startConversation } = useApp();
  if (!p) {
    go("marketplace");
    return null;
  }

  const isHire = p.category === "Hire";
  const wishlisted = wishlist.includes(p.id);
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  const open = (item: Product) => {
    setSelectedProduct(item);
    window.scrollTo({ top: 0 });
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-16">
      <button onClick={() => go("marketplace")} className="flex items-center gap-1.5 text-sm text-[var(--muted-fg)] hover:text-[var(--foreground)] mb-5 transition-colors">
        <ArrowLeft size={15} /> Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="rounded-2xl overflow-hidden bg-[var(--muted)] aspect-[16/10] mb-5">
            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
          </div>

          <div className="card p-5 mb-5">
            <h2 className="font-bold mb-2">Description</h2>
            <p className="text-sm text-[var(--muted-fg)] leading-relaxed">{p.description}</p>
            <div className="flex gap-1.5 flex-wrap mt-4">
              {p.tags.map((t) => <Pill key={t} variant="outline">{t}</Pill>)}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-bold mb-3">{isHire ? "What you get" : "What is included"}</h2>
            <ul className="flex flex-col gap-2.5">
              {(isHire
                ? ["Direct messaging with seller", "Milestone-based payments", "Scope confirmation before work starts"]
                : ["Digital file attached by seller", "Lifetime access after seller delivery", "Order record stored in your account"]
              ).map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <Check size={14} className="text-emerald-500 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card p-5 lg:sticky lg:top-20">
            {p.badge && <Pill variant="amber">{p.badge}</Pill>}
            <h1 className="text-xl font-bold mt-2 mb-2 leading-snug">{p.title}</h1>
            <StarRow rating={p.rating} count={p.reviews} />

            <div className="flex items-center gap-3 mt-4 mb-5 pb-5 border-b border-[var(--border)]">
              <AvatarBubble initials={p.sellerAvatar} />
              <div>
                <div className="font-semibold text-sm">{p.seller}</div>
                <div className="text-xs text-[var(--muted-fg)] flex items-center gap-1">
                  <ShieldCheck size={11} className="text-emerald-500" /> Verified Seller
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="text-3xl font-extrabold font-mono">{fmt(p.price)}{isHire && <span className="text-sm font-medium text-[var(--muted-fg)]">/hr</span>}</div>
                {p.downloads !== undefined && <div className="text-xs text-[var(--muted-fg)] mt-1">{p.downloads} downloads</div>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleWishlist(p.id)} className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center hover:bg-[var(--secondary)] transition-colors">
                  <Heart size={16} className={wishlisted ? "text-red-500 fill-red-500" : "text-[var(--muted-fg)]"} />
                </button>
                <button className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center hover:bg-[var(--secondary)] transition-colors">
                  <Share2 size={16} className="text-[var(--muted-fg)]" />
                </button>
              </div>
            </div>

            {isHire ? (
              <button onClick={() => startConversation(p)} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">Message Seller</button>
            ) : (
              <div className="flex flex-col gap-2.5">
                <button onClick={() => addToCart(p)} className="btn-primary w-full py-3.5">Add to Cart</button>
                <button onClick={() => { addToCart(p); go("cart"); }} className="btn-secondary w-full py-3.5 flex items-center justify-center gap-2">
                  <Download size={15} /> Buy Now
                </button>
                <button onClick={() => startConversation(p)} className="btn-secondary w-full py-3.5">Ask Seller</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-bold text-lg mb-4">More in {p.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((r) => <ProductCard key={r.id} product={r} onClick={() => open(r)} />)}
          </div>
        </section>
      )}
    </main>
  );
}
