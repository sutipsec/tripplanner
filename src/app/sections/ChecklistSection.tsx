"use client";
import { BookOpen, Train, Shield, Ticket, Building2, Bus, Wifi, Banknote } from "lucide-react";
import { useChecklist } from "@/hooks/useTrip";
import { ProgressRing } from "../components/ProgressRing";

const checklistIcons: Record<string, React.ReactNode> = {
  Passport: <BookOpen size={14} />, "JR Pass booking": <Train size={14} />, "Travel insurance": <Shield size={14} />,
  "Universal Studios tickets": <Ticket size={14} />, "Hotel booking": <Building2 size={14} />,
  "Airport bus / transport plan": <Bus size={14} />, "Pocket WiFi / SIM card": <Wifi size={14} />,
  "Currency exchange (JPY)": <Banknote size={14} />,
};

export function ChecklistSection() {
  const { items, loading, toggle } = useChecklist();
  const doneCount = items.filter((i) => i.done).length;
  const pct = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;

  if (loading) return <div className="flex h-40 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-indigo-400" /></div>;

  return (
    <section className="glass rounded-2xl p-6">
      <div className="mb-5 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div><h2 className="text-lg font-bold text-white">Checklist</h2><p className="text-sm text-slate-400">{doneCount} / {items.length} completed</p></div>
        <ProgressRing radius={32} stroke={5} progress={pct} color="#818cf8"><p className="text-xs font-bold text-indigo-400">{pct}%</p></ProgressRing>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {items.map((item) => (
          <label key={item.id} className={`group flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-sm transition-all ${item.done ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/5 bg-white/3 hover:border-white/10 hover:bg-white/5"}`}>
            <div className="relative">
              <input type="checkbox" checked={item.done} onChange={() => toggle(item.id, item.done)} className="peer sr-only" />
              <div className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${item.done ? "border-emerald-500 bg-emerald-500 shadow-lg shadow-emerald-500/20" : "border-white/20 bg-white/5 group-hover:border-white/30"}`}>
                {item.done && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="animate-[check-pop_0.3s_ease-out]"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
            </div>
            <span className={`text-slate-400 transition ${item.done ? "text-emerald-400/60" : ""}`}>{checklistIcons[item.label]}</span>
            <span className={`transition ${item.done ? "text-slate-500 line-through" : "font-medium text-slate-300"}`}>{item.label}</span>
            {item.done && <span className="ml-auto text-xs font-bold text-emerald-400">✓</span>}
          </label>
        ))}
      </div>
    </section>
  );
}
