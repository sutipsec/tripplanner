"use client";
import { Wallet, CreditCard, Banknote, Plane, Building2, Utensils, Train, Ticket } from "lucide-react";
import { useExpenses } from "@/hooks/useTrip";
import { ProgressRing } from "../components/ProgressRing";

const expenseIcons: Record<string, React.ReactNode> = {
  Flight: <Plane size={14} />, Hotel: <Building2 size={14} />, "Food & Dining": <Utensils size={14} />,
  "Transport (JR Pass etc.)": <Train size={14} />, Activities: <Ticket size={14} />,
};
const categoryBarColors: Record<string, string> = {
  Flight: "bg-rose-400", Hotel: "bg-indigo-400", "Food & Dining": "bg-amber-400",
  "Transport (JR Pass etc.)": "bg-sky-400", Activities: "bg-emerald-400",
};

export function BudgetSection({ trip }: { trip: any }) {
  const { expenses, loading } = useExpenses();
  const progress = trip.budget > 0 ? Math.round((trip.spent / trip.budget) * 100) : 0;

  if (loading) return <div className="flex h-40 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-indigo-400" /></div>;

  return (
    <section className="glass rounded-2xl p-6">
      <div className="mb-6"><h2 className="text-lg font-bold text-white">Budget</h2><p className="text-sm text-slate-400">ค่าใช้จ่ายตลอดทริป</p></div>
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <ProgressRing radius={60} stroke={8} progress={progress} color="#34d399">
          <p className="text-2xl font-black text-white">{progress}%</p>
          <p className="text-[10px] text-slate-400">paid</p>
        </ProgressRing>
        <div className="grid flex-1 gap-3 sm:grid-cols-3 w-full">
          {[
            { label: "Total Budget", value: trip.budget?.toLocaleString(), Icon: Wallet, gradient: "from-slate-600 to-slate-500", textColor: "text-white" },
            { label: "Paid So Far", value: trip.spent?.toLocaleString(), Icon: CreditCard, gradient: "from-emerald-600 to-emerald-500", textColor: "text-emerald-400" },
            { label: "Remaining", value: (trip.budget - trip.spent)?.toLocaleString(), Icon: Banknote, gradient: "from-sky-600 to-sky-500", textColor: "text-sky-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/5 bg-white/3 p-4">
              <div className="flex items-center justify-between"><p className="text-xs font-medium text-slate-400">{s.label}</p><div className={`rounded-lg bg-gradient-to-br ${s.gradient} p-1.5`}><s.Icon size={12} className="text-white" /></div></div>
              <p className={`mt-2 text-2xl font-bold ${s.textColor}`}>{s.value}</p>
              <p className="text-xs text-slate-500">THB</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-slate-500"><span>{progress}% paid</span><span>{trip.spent?.toLocaleString()} / {trip.budget?.toLocaleString()} THB</span></div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5"><div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all" style={{ width: `${Math.min(progress, 100)}%` }} /></div>
      </div>
      <div className="mt-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Breakdown</p>
        {expenses.map((exp) => {
          const pct = exp.estimate > 0 ? Math.round((exp.actual / exp.estimate) * 100) : 0;
          return (
            <div key={exp.id} className="rounded-xl border border-white/5 bg-white/3 px-4 py-3.5 transition hover:border-white/10 hover:bg-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-sm"><span className="text-slate-400">{expenseIcons[exp.category]}</span><span className="font-medium text-slate-300">{exp.category}</span></div>
                <span className="text-sm text-slate-400">{exp.actual?.toLocaleString()} / {exp.estimate?.toLocaleString()} THB</span>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/5"><div className={`h-1.5 rounded-full transition-all ${pct >= 100 ? "bg-rose-400" : pct > 0 ? categoryBarColors[exp.category] || "bg-emerald-400" : "bg-white/10"}`} style={{ width: pct > 0 ? `${Math.min(pct, 100)}%` : "4px" }} /></div>
              <p className="mt-1 text-xs text-slate-500">{pct > 0 ? `${pct}% paid` : "Not paid yet"}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
