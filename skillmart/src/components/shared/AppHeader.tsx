import { BarChart2, Bell, Home, Menu, MessageCircle, Moon, ShoppingCart, Store, Sun, User, X } from "lucide-react";
import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import type { Screen } from "../../types";
import { AvatarBubble } from "./AvatarBubble";

const NAV: { label: string; icon: React.ReactNode; screen: Screen }[] = [
  { label: "Home",        icon: <Home size={15} />,     screen: "dashboard"   },
  { label: "Marketplace", icon: <Store size={15} />,    screen: "marketplace" },
  { label: "My Store",    icon: <BarChart2 size={15} />,screen: "my-store"    },
  { label: "Messages",    icon: <MessageCircle size={15} />,screen: "messages"    },
  { label: "Profile",     icon: <User size={15} />,     screen: "profile"     },
];

export function AppHeader() {
  const { screen, go, cart, user, messages } = useApp();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  const isActive = (s: Screen) =>
    screen === s || (s === "my-store" && screen === "add-listing");

  const navBtn = (item: typeof NAV[0]) => (
    <button
      key={item.label}
      onClick={() => { go(item.screen); setOpen(false); }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        isActive(item.screen)
          ? "bg-[var(--accent)] text-[var(--primary)]"
          : "text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
      }`}
    >
      {item.icon} {item.label}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <button onClick={() => go("dashboard")} className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-[var(--primary)] rounded-lg flex items-center justify-center">
            <Store size={14} className="text-white" />
          </div>
          <span className="font-extrabold text-base hidden sm:block">
            Skill<span style={{ color: "var(--primary)" }}>Mart</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">{NAV.map(navBtn)}</nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors text-[var(--muted-fg)]">
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Cart */}
          <button onClick={() => go("cart")} className="relative p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors text-[var(--muted-fg)]">
            <ShoppingCart size={19} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--primary)] text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Notifications (placeholder) */}
          <button onClick={() => go("messages")} className="relative p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors">
            <Bell size={19} className="text-amber-500" />
            {messages.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {messages.length > 9 ? "9" : messages.length}
              </span>
            )}
          </button>

          {/* Avatar */}
          <button onClick={() => go("profile")} className="hidden sm:flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-[var(--secondary)] transition-colors">
            <AvatarBubble initials={user?.avatar ?? "U"} size="sm" className="bg-[var(--primary)] text-white" />
            <span className="text-sm font-medium hidden sm:block">{user?.name.split(" ")[0]}</span>
          </button>

          {/* Mobile menu toggle */}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors">
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {open && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--background)] px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {NAV.map(navBtn)}
        </div>
      )}
    </header>
  );
}
