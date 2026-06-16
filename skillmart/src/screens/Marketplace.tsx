import { BookOpen, Briefcase, FileText, LayoutGrid, Search, Users, X } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import type { Category } from "../types";
import { ProductCard } from "../components/shared/ProductCard";

const CATEGORIES: { name: Category; icon?: React.ReactNode }[] = [
  { name: "All",            icon: <LayoutGrid size={13} /> },
  { name: "Research Papers",icon: <FileText size={13} className="text-violet-500" /> },
  { name: "Project Code",   icon: <Briefcase size={13} className="text-sky-500" /> },
  { name: "Books",          icon: <BookOpen size={13} className="text-amber-500" /> },
  { name: "Hire",           icon: <Users size={13} className="text-emerald-500" /> },
];

export function Marketplace() {
  const { go, setSelectedProduct, products } = useApp();
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery]        = useState("");
  const [sort, setSort]          = useState("popular");

  const filtered = products
    .filter((p) => category === "All" || p.category === category)
    .filter((p) => !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))
    .sort((a, b) =>
      sort === "price-asc"  ? a.price - b.price :
      sort === "price-desc" ? b.price - a.price :
      sort === "newest" ? new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime() :
      b.reviews - a.reviews
    );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-16">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold mb-1">Marketplace</h1>
        <p className="text-[var(--muted-fg)] text-sm">{products.length} listings from verified sellers</p>
      </div>

      {/* Search + sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 flex items-center gap-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-3 py-2.5">
          <Search size={16} className="text-[var(--muted-fg)] shrink-0" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search listings, tags…"
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-[var(--muted-fg)]" />
          {query && <button onClick={() => setQuery("")}><X size={14} className="text-[var(--muted-fg)]" /></button>}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm outline-none">
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(({ name, icon }) => {
          const active = category === name;
          const count  = name === "All" ? null : products.filter((p) => p.category === name).length;
          return (
            <button key={name} onClick={() => setCategory(name)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                active
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-[var(--background)] text-[var(--muted-fg)] border-[var(--border)] hover:text-[var(--foreground)]"
              }`}>
              {icon} {name}
              {count !== null && <span className={`text-[10px] font-mono ${active ? "text-white/70" : "text-[var(--muted-fg)]"}`}>({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Grid / empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--muted-fg)]">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No listings found</p>
          <p className="text-sm mt-1">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onClick={() => { setSelectedProduct(p); go("product"); }} />
          ))}
        </div>
      )}
    </main>
  );
}
