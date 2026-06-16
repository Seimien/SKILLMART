import { ArrowLeft, Check, CreditCard, Lock, Smartphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

const fmt = (n: number) => `$${n.toFixed(2)}`;
const FEE_RATE = 0.02;
const STEPS = ["Contact", "Method", "Review"];

export function Checkout() {
  const { cart, go, submitOrder, user } = useApp();
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState({ name: user?.name ?? "", email: user?.email ?? "" });
  const [method, setMethod] = useState<"card" | "mpesa">("card");
  const [busy, setBusy] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const fee = subtotal * FEE_RATE;
  const total = subtotal + fee;

  const next = async () => {
    if (step === 0 && (!contact.name || !contact.email)) {
      toast.error("Please add your contact details.");
      return;
    }

    if (step < 2) {
      setStep(step + 1);
      return;
    }

    setBusy(true);
    try {
      await submitOrder({
        contactName: contact.name,
        contactEmail: contact.email,
        method,
        subtotal,
        fee,
        total,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-16">
      <button onClick={() => go("cart")} className="flex items-center gap-1.5 text-sm text-[var(--muted-fg)] hover:text-[var(--foreground)] mb-5 transition-colors">
        <ArrowLeft size={15} /> Back to Cart
      </button>

      <div className="flex items-center mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                i < step ? "bg-emerald-500 text-white" : i === step ? "bg-[var(--primary)] text-white" : "bg-[var(--secondary)] text-[var(--muted-fg)]"
              }`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-sm font-medium ${i === step ? "text-[var(--foreground)]" : "text-[var(--muted-fg)]"} hidden sm:inline`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < step ? "bg-emerald-500" : "bg-[var(--border)]"}`} />}
          </div>
        ))}
      </div>

      <div className="card p-6">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-lg mb-1">Contact Information</h2>
            <div>
              <label className="text-sm font-medium block mb-1.5">Full Name</label>
              <input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Jane Doe" className="input" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Email Address</label>
              <input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} type="email" placeholder="jane@university.ac" className="input" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-lg mb-1">Preferred Payment Method</h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setMethod("card")} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${method === "card" ? "border-[var(--primary)] bg-[var(--accent)]" : "border-[var(--border)]"}`}>
                <CreditCard size={20} className={method === "card" ? "text-[var(--primary)]" : "text-[var(--muted-fg)]"} />
                <span className="text-sm font-medium">Card</span>
              </button>
              <button onClick={() => setMethod("mpesa")} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${method === "mpesa" ? "border-[var(--primary)] bg-[var(--accent)]" : "border-[var(--border)]"}`}>
                <Smartphone size={20} className={method === "mpesa" ? "text-[var(--primary)]" : "text-[var(--muted-fg)]"} />
                <span className="text-sm font-medium">M-Pesa</span>
              </button>
            </div>

            {method === "card" ? (
              <div className="flex flex-col gap-3 mt-1">
                <input placeholder="Card Number" className="input" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="MM/YY" className="input" />
                  <input placeholder="CVC" className="input" />
                </div>
              </div>
            ) : (
              <input placeholder="M-Pesa Phone Number" className="input mt-1" />
            )}

            <p className="flex items-center gap-1.5 text-xs text-[var(--muted-fg)] mt-1">
              <Lock size={12} /> No real payment is processed. This order is stored for coursework review.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-lg mb-1">Review Order</h2>
            <div className="flex flex-col gap-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm py-1.5">
                  <span className="text-[var(--muted-fg)]">{item.title} x {item.qty}</span>
                  <span className="font-mono">{fmt(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 text-sm pt-3 border-t border-[var(--border)]">
              <div className="flex justify-between text-[var(--muted-fg)]"><span>Subtotal</span><span className="font-mono">{fmt(subtotal)}</span></div>
              <div className="flex justify-between text-[var(--muted-fg)]"><span>Platform Fee</span><span className="font-mono">{fmt(fee)}</span></div>
              <div className="flex justify-between font-bold pt-2 border-t border-[var(--border)]"><span>Total</span><span className="font-mono">{fmt(total)}</span></div>
            </div>
          </div>
        )}

        <button onClick={next} disabled={busy} className="btn-primary w-full py-3.5 mt-6 disabled:opacity-60">
          {busy ? "Saving order..." : step === 2 ? `Place Order (${fmt(total)})` : "Continue"}
        </button>
      </div>
    </main>
  );
}
