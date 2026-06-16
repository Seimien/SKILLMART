import { Download, LogOut, Mail, Package, Save, Settings, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import { Pill } from "../components/shared/Pill";
import { AvatarBubble } from "../components/shared/AvatarBubble";

const fmt = (n: number) => `$${n.toFixed(2)}`;

export function Profile() {
  const { user, orders, logout, saveProfile, downloadItem } = useApp();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name ?? "",
    bio: user?.bio ?? "",
    phone: user?.phone ?? "",
    payoutMethod: user?.payoutMethod ?? "manual",
    payoutDetails: user?.payoutDetails ?? "",
  });

  if (!user) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await saveProfile(form);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Profile could not be updated.");
    } finally {
      setBusy(false);
    }
  };

  const download = async (filePath: string) => {
    try {
      await downloadItem(filePath);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Download is not available yet.");
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-16">
      <div className="card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8">
        <AvatarBubble initials={user.avatar} size="lg" className="bg-[var(--primary)] text-white" />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <ShieldCheck size={16} className="text-emerald-500" />
          </div>
          <p className="text-sm text-[var(--muted-fg)] flex items-center justify-center sm:justify-start gap-1.5 mt-1">
            <Mail size={13} /> {user.email}
          </p>
          <p className="text-sm text-[var(--muted-fg)] mt-0.5">{user.bio} · Joined {user.joinedDate}</p>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold">{user.rating}</span>
            <span className="text-xs text-[var(--muted-fg)]">seller rating</span>
          </div>
        </div>
        <button onClick={logout} className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm shrink-0">
          <LogOut size={15} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[["Total Earned", fmt(user.totalEarned)], ["Total Sales", user.totalSales], ["Orders Placed", orders.length]].map(([label, val]) => (
          <div key={label} className="card p-4 text-center">
            <div className="text-xl font-extrabold font-mono">{val}</div>
            <div className="text-xs text-[var(--muted-fg)] mt-1">{label}</div>
          </div>
        ))}
      </div>

      <section className="mb-8">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Package size={18} /> Order History</h2>
        <div className="flex flex-col gap-3">
          {orders.map((o) => (
            <div key={o.id} className="card p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
                <div>
                  <div className="font-mono font-semibold text-sm">{o.id}</div>
                  <div className="text-xs text-[var(--muted-fg)]">{o.date} · {o.items.length} item(s)</div>
                </div>
                <Pill variant={o.status === "Delivered" ? "green" : "amber"}>{o.status}</Pill>
                <span className="font-bold font-mono text-sm">{fmt(o.total)}</span>
              </div>
              <div className="flex flex-col gap-2 border-t border-[var(--border)] pt-3">
                {o.items.map((item) => (
                  <div key={`${o.id}-${item.orderItemId ?? item.id}`} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[var(--muted-fg)] line-clamp-1">{item.title}</span>
                    <div className="flex items-center gap-2">
                      <Pill variant={item.deliveryStatus === "delivered" ? "green" : "amber"}>{item.deliveryStatus ?? "pending"}</Pill>
                      {item.filePath && item.deliveryStatus === "delivered" && (
                        <button onClick={() => download(item.filePath!)} className="btn-secondary px-3 py-1.5 text-xs flex items-center gap-1">
                          <Download size={12} /> Download
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="card p-6 text-center text-sm text-[var(--muted-fg)]">No orders yet.</div>
          )}
        </div>
      </section>

      <section className="card p-5">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Settings size={18} /> Account Settings</h2>
        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Full Name</label>
            <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="+254..." />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium block mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input resize-none" rows={3} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Payout Method</label>
            <select value={form.payoutMethod} onChange={(e) => setForm({ ...form, payoutMethod: e.target.value })} className="input">
              <option value="manual">Manual / coursework demo</option>
              <option value="mpesa">M-Pesa note</option>
              <option value="bank">Bank note</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Payout Details</label>
            <input value={form.payoutDetails} onChange={(e) => setForm({ ...form, payoutDetails: e.target.value })} className="input" placeholder="Private note for admin review" />
          </div>
          <div className="sm:col-span-2">
            <button disabled={busy} className="btn-primary px-5 py-2.5 flex items-center gap-2 disabled:opacity-60">
              <Save size={15} /> {busy ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
