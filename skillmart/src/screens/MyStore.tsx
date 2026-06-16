import { BarChart2, DollarSign, Edit2, Eye, Package, Plus, Star, Trash2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Pill } from "../components/shared/Pill";

const fmt = (n: number) => `$${n.toFixed(2)}`;
const TABS = ["Listings", "Sales", "Analytics"] as const;

export function MyStore() {
  const { user, go, myListings, orders, removeListing, setSelectedProduct, markDelivered } = useApp();
  const [tab, setTab] = useState<typeof TABS[number]>("Listings");
  const sellerLines = orders.flatMap((order) =>
    order.items
      .filter((item) => item.sellerId === user?.id)
      .map((item) => ({ order, item }))
  );
  const revenue = sellerLines.reduce((sum, line) => sum + line.item.price * line.item.qty, 0);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-16">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">My Store</h1>
          <p className="text-[var(--muted-fg)] text-sm mt-0.5">Manage your live Supabase listings and sales.</p>
        </div>
        <button onClick={() => go("add-listing")} className="btn-primary flex items-center gap-2 px-4 py-2.5">
          <Plus size={16} /> Add Listing
        </button>
      </div>

      <div className="flex gap-1 border-b border-[var(--border)] mb-6">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === t ? "border-[var(--primary)] text-[var(--primary)]" : "border-transparent text-[var(--muted-fg)] hover:text-[var(--foreground)]"
            }`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Listings" && (
        <div className="flex flex-col gap-3">
          {myListings.map((p) => (
            <div key={p.id} className="card p-4 flex items-center gap-4">
              <img src={p.image} alt={p.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-1">{p.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Pill variant="green">Active</Pill>
                  <span className="text-xs text-[var(--muted-fg)] flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" /> {p.rating} ({p.reviews})</span>
                </div>
              </div>
              <span className="font-bold font-mono text-sm hidden sm:block">{fmt(p.price)}</span>
              <div className="flex gap-1.5">
                <button onClick={() => { setSelectedProduct(p); go("product"); }} className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"><Eye size={15} className="text-[var(--muted-fg)]" /></button>
                <button className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"><Edit2 size={15} className="text-[var(--muted-fg)]" /></button>
                <button onClick={() => removeListing(p.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={15} className="text-red-500" /></button>
              </div>
            </div>
          ))}
          {myListings.length === 0 && (
            <div className="text-center py-16 text-[var(--muted-fg)]">
              <Package size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No listings yet</p>
              <button onClick={() => go("add-listing")} className="btn-primary px-5 py-2.5 mt-4">Create your first listing</button>
            </div>
          )}
        </div>
      )}

      {tab === "Sales" && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--muted)] text-left text-[var(--muted-fg)] text-xs font-semibold uppercase">
                <th className="px-4 py-3">Order</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {sellerLines.map(({ order, item }) => (
                <tr key={`${order.id}-${item.orderItemId ?? item.id}`} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3 font-mono font-medium">{order.id}</td>
                  <td className="px-4 py-3 text-[var(--muted-fg)]">{order.date}</td>
                  <td className="px-4 py-3 text-[var(--muted-fg)]">{item.title}</td>
                  <td className="px-4 py-3"><Pill variant={item.deliveryStatus === "delivered" ? "green" : "amber"}>{item.deliveryStatus ?? "pending"}</Pill></td>
                  <td className="px-4 py-3 text-right">
                    {item.deliveryStatus === "delivered" || !item.orderItemId ? (
                      <span className="font-mono font-semibold">{fmt(item.price * item.qty)}</span>
                    ) : (
                      <button onClick={() => markDelivered(item.orderItemId!)} className="btn-primary px-3 py-1.5 text-xs">Mark delivered</button>
                    )}
                  </td>
                </tr>
              ))}
              {sellerLines.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[var(--muted-fg)]">No sales yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Analytics" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Revenue", value: fmt(revenue), icon: <DollarSign size={18} className="text-emerald-500" />, trend: "From completed orders" },
            { label: "Listings", value: String(myListings.length), icon: <TrendingUp size={18} className="text-violet-500" />, trend: "Active catalogue" },
            { label: "Sales", value: String(sellerLines.length), icon: <BarChart2 size={18} className="text-sky-500" />, trend: "Orders containing your items" },
          ].map((s) => (
            <div key={s.label} className="card p-5">
              <div className="w-10 h-10 bg-[var(--muted)] rounded-xl flex items-center justify-center mb-3">{s.icon}</div>
              <div className="text-2xl font-extrabold font-mono">{s.value}</div>
              <div className="text-xs text-[var(--muted-fg)] mt-0.5">{s.label}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">{s.trend}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
