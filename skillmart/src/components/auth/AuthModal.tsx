import { Lock, LogIn, Mail, Store, User, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { authErrorMessage, friendlyAuthError, normalizeEmail } from "../../lib/auth";

export function AuthModal() {
  const { authModal, setAuthModal, signIn, signUp } = useApp();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { setTab(authModal === "signup" ? "signup" : "login"); }, [authModal]);

  if (authModal === "none") return null;

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    const email = normalizeEmail(form.email);
    const password = form.password;

    if (!email || !password) return setError("Please fill in all fields.");
    if (tab === "signup" && !form.name.trim()) return setError("Please enter your full name.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (tab === "signup" && password !== form.confirm) return setError("Passwords do not match.");
    setError("");
    setNotice("");
    setBusy(true);

    try {
      if (tab === "signup") {
        const result = await signUp(form.name.trim(), email, password);
        if (result === "confirm-email") {
          setNotice("Account created. Check your email for a confirmation link, then sign in.");
          setTab("login");
        }
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(friendlyAuthError(authErrorMessage(err)));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
         onClick={() => setAuthModal("none")}>
      <div className="bg-[var(--card)] w-full max-w-md rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden"
           onClick={(e) => e.stopPropagation()}>

        {/* Branded header */}
        <div className="bg-[var(--primary)] px-6 pt-6 pb-8 text-white relative">
          <button onClick={() => setAuthModal("none")} className="absolute top-4 right-4 opacity-60 hover:opacity-100 transition-opacity">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <Store size={16} /><span className="font-bold text-sm">SkillMart</span>
          </div>
          <h2 className="text-2xl font-extrabold">{tab === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="text-white/70 text-sm mt-1">
            {tab === "login" ? "Sign in to access your store and purchases." : "Join thousands of students buying and selling."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border)]">
          {(["login", "signup"] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setError(""); setNotice(""); }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === t ? "text-[var(--primary)] border-b-2 border-[var(--primary)]" : "text-[var(--muted-fg)] hover:text-[var(--foreground)]"}`}>
              {t === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {tab === "signup" && (
            <Field label="Full Name" icon={<User size={15} />}>
              <input value={form.name} onChange={set("name")} placeholder="Grace Mutua" className="input pl-9" />
            </Field>
          )}
          <Field label="Email Address" icon={<Mail size={15} />}>
            <input value={form.email} onChange={set("email")} type="email" placeholder="you@university.ac" className="input pl-9" />
          </Field>
          <Field label="Password" icon={<Lock size={15} />}>
            <input value={form.password} onChange={set("password")} type="password" placeholder="••••••••" className="input pl-9" />
          </Field>
          {tab === "signup" && (
            <Field label="Confirm Password" icon={<Lock size={15} />}>
              <input value={form.confirm} onChange={set("confirm")} type="password" placeholder="••••••••" className="input pl-9" />
            </Field>
          )}

          {error && (
            <p className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-100 dark:border-red-800">
              {error}
            </p>
          )}
          {notice && (
            <p className="text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg border border-emerald-100 dark:border-emerald-800">
              {notice}
            </p>
          )}
          {tab === "login" && (
            <button className="text-xs text-[var(--primary)] text-right hover:underline self-end -mt-2">Forgot password?</button>
          )}

          <button onClick={submit} disabled={busy} className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-1 disabled:opacity-60">
            {busy ? "Please wait..." : tab === "login" ? <><LogIn size={16} /> Sign In</> : <><UserPlus size={16} /> Create Account</>}
          </button>

          <p className="text-center text-xs text-[var(--muted-fg)]">
            {tab === "login" ? "No account?" : "Already have an account?"}{" "}
            <button onClick={() => { setTab(tab === "login" ? "signup" : "login"); setError(""); setNotice(""); }}
              className="text-[var(--primary)] font-semibold hover:underline">
              {tab === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* Input field wrapper with absolute icon */
function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1.5 text-[var(--foreground)]">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-fg)]">{icon}</div>
        {children}
      </div>
    </div>
  );
}
