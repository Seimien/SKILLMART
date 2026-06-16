import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { AvatarBubble } from "../components/shared/AvatarBubble";

const fmt = (n: number) => `$${n.toFixed(2)}`;
const FEE_RATE = 0.02; // platform fee — 2%

export function Cart() {
  const { cart, updateQty, removeFromCart, go } = useApp();

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const fee      = subtotal * FEE_RATE;
  const total    = subtotal + fee;

  if (cart.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <ShoppingCart size={48} className="mx-auto mb-4 text-[var(--muted-fg)] opacity-30" />
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-sm text-[var(--muted-fg)] mb-6">Browse the marketplace to find resources and talent.</p>
        <button onClick={() => go("marketplace")} className="btn-primary px-6 py-3">Browse Marketplace</button>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-16">
      <button onClick={() => go("marketplace")} className="flex items-center gap-1.5 text-sm text-[var(--muted-fg)] hover:text-[var(--foreground)] mb-5 transition-colors">
        <ArrowLeft size={15} /> Continue Shopping
      </button>
      <h1 className="text-2xl font-extrabold mb-6">Your Cart ({cart.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {cart.map((item) => (
            <div key={item.id} className="card p-4 flex gap-4">
              <img src={item.image} alt={item.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <AvatarBubble initials={item.sellerAvatar} size="sm" />
                  <span className="text-xs text-[var(--muted-fg)]">{item.seller}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 border border-[var(--border)] rounded-lg">
                    <button onClick={() => updateQty(item.id, -1)} className="p-1.5 hover:bg-[var(--secondary)] rounded-l-lg transition-colors"><Minus size={13} /></button>
                    <span className="text-sm font-mono w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="p-1.5 hover:bg-[var(--secondary)] rounded-r-lg transition-colors"><Plus size={13} /></button>
                  </div>
                  <span className="font-bold text-sm font-mono">{fmt(item.price * item.qty)}</span>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-[var(--muted-fg)] hover:text-red-500 transition-colors self-start">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit lg:sticky lg:top-20">
          <h2 className="font-bold mb-4">Order Summary</h2>
          <div className="flex flex-col gap-2.5 text-sm mb-4">
            <div className="flex justify-between text-[var(--muted-fg)]"><span>Subtotal</span><span className="font-mono">{fmt(subtotal)}</span></div>
            <div className="flex justify-between text-[var(--muted-fg)]"><span>Platform Fee (2%)</span><span className="font-mono">{fmt(fee)}</span></div>
          </div>
          <div className="flex justify-between font-bold pt-3 border-t border-[var(--border)] mb-5">
            <span>Total</span><span className="font-mono">{fmt(total)}</span>
          </div>
          <button onClick={() => go("checkout")} className="btn-primary w-full py-3.5">Proceed to Checkout</button>
        </div>
      </div>
    </main>
  );
}
