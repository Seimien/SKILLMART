import {
  ArrowRight, BarChart2, BookOpen, Briefcase, ChevronRight,
  FileText, Globe, Moon, Shield, Star, Store, Sun, TrendingUp,
  Users, X, Zap, Menu,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { TESTIMONIALS } from "../data/mock";
import { AvatarBubble } from "../components/shared/AvatarBubble";

/* ── Sticky nav ── */
function LandingNav() {
  const { setAuthModal } = useApp();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${scrolled ? "bg-[var(--background)]/95 backdrop-blur shadow-sm border-b border-[var(--border)]" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
            <Store size={16} className="text-white" />
          </div>
          <span className="font-extrabold text-lg">Skill<span style={{ color: "var(--primary)" }}>Mart</span></span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--muted-fg)]">
          {["Features", "How it Works"].map((l) => (
            <button key={l} onClick={() => document.getElementById(l.toLowerCase().replace(" ", "-"))?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-[var(--foreground)] transition-colors">{l}</button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors text-[var(--muted-fg)]">
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button onClick={() => setAuthModal("login")} className="px-4 py-2 text-sm font-semibold hover:bg-[var(--secondary)] rounded-lg transition-colors">Sign In</button>
          <button onClick={() => setAuthModal("signup")} className="btn-primary px-4 py-2 text-sm">Get Started Free</button>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[var(--background)] border-t border-[var(--border)] px-4 py-4 flex flex-col gap-3">
          <div className="flex gap-2 pt-2">
            <button onClick={() => { setAuthModal("login"); setOpen(false); }} className="flex-1 py-2.5 text-sm font-semibold btn-secondary">Sign In</button>
            <button onClick={() => { setAuthModal("signup"); setOpen(false); }} className="flex-1 py-2.5 text-sm font-semibold btn-primary">Sign Up</button>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ── Main landing ── */
export function Landing() {
  const { setAuthModal } = useApp();

  const features = [
    { icon: <Store size={22} style={{ color: "var(--primary)" }} />,  title: "Sell Anything You Know",  desc: "List books, papers, code, or offer your time hourly." },
    { icon: <Users size={22} className="text-emerald-500" />,          title: "Hire Talent Directly",    desc: "Post a hire request and get matched with verified student talent." },
    { icon: <BarChart2 size={22} className="text-amber-500" />,        title: "Track Your Business",     desc: "Real-time sales dashboard, earnings history, and buyer analytics." },
    { icon: <Shield size={22} className="text-violet-500" />,          title: "Secure Payments",         desc: "Escrow-backed payments mean your money is safe until delivery." },
    { icon: <Globe size={22} className="text-sky-500" />,              title: "Global Reach",            desc: "Sell to students and professionals across 40+ countries." },
    { icon: <BookOpen size={22} className="text-rose-500" />,          title: "Quality Resources",       desc: "Curated academic and professional content, peer-reviewed." },
  ];

  const categories = [
    { name: "Research Papers", icon: <FileText size={24} className="text-violet-500" />, count: "1,240+", color: "hover:border-violet-300 hover:bg-violet-50/50 dark:hover:bg-violet-900/20" },
    { name: "Project Code",    icon: <Briefcase size={24} className="text-sky-500" />,   count: "890+",   color: "hover:border-sky-300 hover:bg-sky-50/50 dark:hover:bg-sky-900/20" },
    { name: "Books",           icon: <BookOpen size={24} className="text-amber-500" />,  count: "2,100+", color: "hover:border-amber-300 hover:bg-amber-50/50 dark:hover:bg-amber-900/20" },
    { name: "Hire",            icon: <Users size={24} className="text-emerald-500" />,   count: "620+",   color: "hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20" },
  ];

  return (
    <div className="bg-[var(--background)] overflow-x-hidden">
      <LandingNav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--background) 60%)" }} />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[var(--accent)] border border-[var(--border)] text-[var(--primary)] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <Zap size={12} className="text-amber-500" /> 4,200+ listings from 1,800+ sellers
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.08] tracking-tight mb-5">
                The marketplace<br />
                <span style={{ color: "var(--primary)" }}>built for students</span><br />
                & knowledge.
              </h1>
              <p className="text-[var(--muted-fg)] text-lg leading-relaxed mb-8 max-w-lg">
                Buy research papers, project code, and books. Hire top student talent. Or sell what you know — all on one platform.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setAuthModal("signup")} className="btn-primary flex items-center gap-2 px-6 py-3.5">
                  Start Selling Free <ArrowRight size={16} />
                </button>
                <button onClick={() => setAuthModal("login")} className="btn-secondary flex items-center gap-2 px-6 py-3.5">
                  Browse Marketplace
                </button>
              </div>
              {/* Stats */}
              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-[var(--border)]">
                {[["$284K+", "Paid to sellers"], ["4,200+", "Active listings"], ["1,800+", "Verified sellers"]].map(([val, label]) => (
                  <div key={label}>
                    <div className="text-xl font-extrabold font-mono">{val}</div>
                    <div className="text-xs text-[var(--muted-fg)]">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image with floating cards */}
            <div className="relative hidden lg:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-[var(--muted)]">
                <img src="https://images.unsplash.com/photo-1758270705290-62b6294dd044?w=700&h=520&fit=crop" alt="Students collaborating" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-6 card p-3 shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp size={18} className="text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs text-[var(--muted-fg)]">This month</div>
                  <div className="font-bold text-sm">+$142.50 earned</div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 card p-3 shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Star size={18} className="text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <div className="text-xs text-[var(--muted-fg)]">Avg. seller rating</div>
                  <div className="font-bold text-sm">4.8 / 5.0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 sm:px-6 bg-[var(--muted)]/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold mb-2">What you can buy & sell</h2>
            <p className="text-[var(--muted-fg)]">Four categories. Unlimited potential.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <button key={cat.name} onClick={() => setAuthModal("signup")}
                className={`card flex flex-col items-center gap-3 p-6 transition-all duration-200 group ${cat.color}`}>
                <div className="w-12 h-12 bg-[var(--background)] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm">{cat.name}</div>
                  <div className="text-xs text-[var(--muted-fg)] mt-0.5">{cat.count} listings</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-3">Everything you need to earn and learn</h2>
            <p className="text-[var(--muted-fg)] max-w-xl mx-auto">SkillMart is the only platform where every user is both a buyer and a seller — no switching accounts, no friction.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card p-6 hover:shadow-md transition-all">
                <div className="w-11 h-11 bg-[var(--muted)] rounded-xl flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--muted-fg)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-[var(--primary)] text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-3">Up and running in minutes</h2>
            <p className="text-white/70">No complicated setup. No hidden fees for getting started.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {[
              { n: "01", title: "Create your account", desc: "Sign up free in 60 seconds. No credit card needed." },
              { n: "02", title: "List or Browse",       desc: "Add your first listing or explore thousands of resources." },
              { n: "03", title: "Buy, Sell & Earn",     desc: "Complete transactions securely. Get paid instantly." },
            ].map((s, i) => (
              <div key={s.n} className="relative">
                <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
                  <div className="text-4xl font-extrabold text-white/20 font-mono mb-3">{s.n}</div>
                  <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{s.desc}</p>
                </div>
                {i < 2 && <ChevronRight size={20} className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-white/40 z-10" />}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => setAuthModal("signup")} className="inline-flex items-center gap-2 bg-white font-bold px-8 py-4 rounded-xl hover:bg-white/90 transition-colors shadow-xl" style={{ color: "var(--primary)" }}>
              Get Started Free <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-3">What our community says</h2>
            <p className="text-[var(--muted-fg)]">Real people. Real results.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-6 flex flex-col gap-4">
                <div className="flex">{[1,2,3,4,5].map((i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}</div>
                <p className="text-sm text-[var(--muted-fg)] leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
                  <AvatarBubble initials={t.avatar} size="sm" className="bg-[var(--primary)] text-white" />
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-[var(--muted-fg)]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-[var(--muted)]/40">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-4">Ready to turn your knowledge into income?</h2>
          <p className="text-[var(--muted-fg)] text-lg mb-8">Join 1,800+ students already earning on SkillMart.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setAuthModal("signup")} className="btn-primary flex items-center justify-center gap-2 px-8 py-4">
              Create Free Account <ArrowRight size={16} />
            </button>
            <button onClick={() => setAuthModal("login")} className="btn-secondary flex items-center justify-center gap-2 px-8 py-4">
              I have an account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[var(--primary)] rounded-lg flex items-center justify-center">
              <Store size={14} className="text-white" />
            </div>
            <span className="font-extrabold">SkillMart</span>
          </div>
          <p className="text-xs text-[var(--muted-fg)]">© 2025 SkillMart. Built for the knowledge economy.</p>
          <div className="flex gap-4 text-xs text-[var(--muted-fg)]">
            {["Privacy", "Terms", "Support"].map((l) => (
              <button key={l} className="hover:text-[var(--foreground)] transition-colors">{l}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
