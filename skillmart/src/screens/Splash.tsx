import { Store } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

export function Splash() {
  const { go } = useApp();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setProgress((p) => (p >= 100 ? (clearInterval(iv), 100) : p + 2)), 40);
    const t  = setTimeout(() => go("landing"), 2400);
    return () => { clearInterval(iv); clearTimeout(t); };
  }, [go]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6" style={{ background: "var(--primary)" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
          <Store size={40} style={{ color: "var(--primary)" }} />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">SkillMart</h1>
          <p className="text-white/70 text-sm mt-1 font-medium">Where Knowledge Meets Opportunity</p>
        </div>
      </div>
      <div className="w-56">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-75" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
