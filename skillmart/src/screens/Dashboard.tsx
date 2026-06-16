import { BarChart2, ChevronRight, DollarSign, Inbox, Package, Plus, Star, Store, Tag } from "lucide-react";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/shared/ProductCard";
import type { Product } from "../types";

const fmt = (n: number) => `$${n.toFixed(2)}`;

export function Dashboard() {
  const { user, go, setSelectedProduct, products, myListings, orders } = useApp();
  const sellerSales = orders.flatMap((order) => order.items.filter((item) => item.sellerId === user?.id));

  const stats = [
    { label: "Total Earnings", value: fmt(user?.totalEarned ?? 0), icon: <DollarSign size={18} className="text-emerald-500" />, bg: "bg-emerald-50 dark:bg-emerald-900/30", sub: "Updated from seller activity" },
    { label: "Total Sales", value: String(sellerSales.length), icon: <Package size={18} className="text-violet-500" />, bg: "bg-violet-50 dark:bg-violet-900/30", sub: `${orders.length} buyer order(s)` },
    { label: "My Listings", value: String(myListings.length), icon: <Tag size={18} className="text-sky-500" />, bg: "bg-sky-50 dark:bg-sky-900/30", sub: `${myListings.filter((p) => p.category !== "Hire").length} digital item(s)` },
    { label: "Avg. Rating", value: `${user?.rating ?? 0}*`, icon: <Star size={18} className="text-amber-400" />, bg: "bg-amber-50 dark:bg-amber-900/30", sub: "From product reviews" },
  ];

  const actions = [
    { label: "Add Listing", icon: <Plus size={16} />, screen: "add-listing" as const, cls: "bg-[var(--accent)] hover:bg-[var(--accent)]/80 border-[var(--primary)]/20 text-[var(--primary)]" },
    { label: "My Store", icon: <BarChart2 size={16} />, screen: "my-store" as const, cls: "bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800" },
    { label: "Browse", icon: <Store size={16} />, screen: "marketplace" as const, cls: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800" },
    { label: "View Orders", icon: <Inbox size={16} />, screen: "profile" as const, cls: "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800" },
  ];

  const openProduct = (p: Product) => {
    setSelectedProduct(p);
    go("product");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-16">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold">Good morning, {user?.name.split(" ")[0]}</h1>
        <p className="text-[var(--muted-fg)] text-sm mt-0.5">Here is what is happening in your marketplace today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>{s.icon}</div>
            <div className="text-2xl font-extrabold font-mono">{s.value}</div>
            <div className="text-xs text-[var(--muted-fg)] mt-0.5">{s.label}</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {actions.map((a) => (
          <button key={a.label} onClick={() => go(a.screen)}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-medium text-sm transition-colors ${a.cls}`}>
            {a.icon} {a.label}
          </button>
        ))}
      </div>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">New on the Marketplace</h2>
          <button onClick={() => go("marketplace")} className="text-sm text-[var(--primary)] flex items-center gap-1 font-medium hover:gap-2 transition-all">
            See all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} onClick={() => openProduct(p)} />
          ))}
          {products.length === 0 && (
            <div className="card p-6 text-sm text-[var(--muted-fg)] sm:col-span-2 lg:col-span-4">
              No listings yet. Create the first one from Add Listing.
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Recommended for You</h2>
          <span className="text-xs text-[var(--muted-fg)] bg-[var(--secondary)] px-2.5 py-1 rounded-full font-mono">Live data</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {[...products].reverse().slice(0, 6).map((p) => (
            <div key={p.id} className="shrink-0 w-60">
              <ProductCard product={p} onClick={() => openProduct(p)} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
