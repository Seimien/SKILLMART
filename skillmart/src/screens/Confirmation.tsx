import { CheckCircle2, Download, Store } from "lucide-react";
import { useApp } from "../context/AppContext";

export function Confirmation() {
  const { lastOrder, orders, go } = useApp();
  const order = lastOrder ?? orders[0];

  return (
    <main className="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={40} className="text-emerald-500" />
      </div>
      <h1 className="text-2xl font-extrabold mb-2">Checkout Successful!</h1>
      <p className="text-[var(--muted-fg)] text-sm mb-8">
        Checkout complete! Your order <span className="font-mono font-semibold text-[var(--foreground)]">#{order?.id}</span> was placed successfully.
        No real payment gateway is used—this order is stored for coursework review and appears in your order history + seller analytics.
      </p>

      <div className="card p-5 text-left mb-8">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-[var(--muted-fg)]">Order Date</span>
          <span className="font-medium">{order?.date}</span>
        </div>

        <div className="flex justify-between text-sm mb-3">
          <span className="text-[var(--muted-fg)]">Items</span><span className="font-medium">{order?.items.length ?? 0}</span>
        </div>
        <div className="flex justify-between text-sm pt-3 border-t border-[var(--border)]">
          <span className="font-bold">Total Paid</span><span className="font-bold font-mono">${order?.total.toFixed(2) ?? "0.00"}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => go("profile")} className="btn-secondary flex-1 py-3 flex items-center justify-center gap-2">
          <Download size={15} /> View Orders
        </button>
        <button onClick={() => go("marketplace")} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
          <Store size={15} /> Continue Shopping
        </button>
      </div>
    </main>
  );
}
