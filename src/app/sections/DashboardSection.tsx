"use client";
import { Calendar, ListChecks, CreditCard, Plane, ArrowRight, Map, CalendarDays, Wallet, CheckSquare, Sparkles } from "lucide-react";
import { useItinerary, useFlights } from "@/hooks/useTrip";

type TopSection = "dashboard" | "map" | "trip-detail" | "flights" | "budget" | "checklist";

export function DashboardSection({ trip, setActiveSection }: { trip: any; setActiveSection: (s: TopSection) => void }) {
  const { days } = useItinerary();
  const { flights } = useFlights();
  const progress = trip.budget > 0 ? Math.round((trip.spent / trip.budget) * 100) : 0;
  const totalActivities = days.reduce((s: number, d: any) => s + (d.itinerary_entries?.length || 0), 0);
  const outbound = flights[0];
  const inbound = flights[1];

  const stats = [
    { Icon: Calendar, label: "Trip Days", value: "7", sub: `${trip.start_date} – ${trip.end_date}`, iconBg: "from-indigo-500 to-violet-600" },
    { Icon: ListChecks, label: "Activities", value: String(totalActivities || "—"), sub: "Planned", iconBg: "from-emerald-500 to-teal-600" },
    { Icon: CreditCard, label: "Budget Paid", value: `${progress}%`, sub: `${trip.spent?.toLocaleString()} THB`, iconBg: "from-sky-500 to-blue-600" },
  ];

  const quickLinks: { id: TopSection; label: string; Icon: React.ElementType; desc: string }[] = [
    { id: "map", label: "Map & Routes", Icon: Map, desc: "Route map + locations" },
    { id: "trip-detail", label: "Trip Timeline", Icon: CalendarDays, desc: "Day-by-day itinerary" },
    { id: "budget", label: "Budget Tracker", Icon: Wallet, desc: "Expenses breakdown" },
    { id: "flights", label: "Flight Tickets", Icon: Plane, desc: "Boarding passes" },
    { id: "checklist", label: "Checklist", Icon: CheckSquare, desc: "Preparation items" },
  ];

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <div key={s.label} className="glass glass-hover rounded-2xl p-5 group cursor-default">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
              <div className={`rounded-xl bg-gradient-to-br ${s.iconBg} p-2.5 shadow-lg`}><s.Icon size={16} className="text-white" /></div>
            </div>
            <p className="mt-3 text-4xl font-black tracking-tight text-white">{s.value}</p>
            <p className="mt-1 text-xs text-slate-500">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-5">
        <div className="space-y-4 md:col-span-3">
          <div className="relative overflow-hidden rounded-2xl border border-indigo-500/15 bg-gradient-to-br from-indigo-950/60 to-slate-900/80 p-5 backdrop-blur-sm">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="relative flex items-start gap-3">
              <span className="relative mt-1 flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/80">Next Up</p>
                <p className="mt-1 text-lg font-bold text-white">Fly from Thailand to Fukuoka</p>
                <p className="mt-0.5 text-sm text-slate-400">Hakata, Canal City & Kushida Shrine</p>
              </div>
            </div>
          </div>

          {outbound && (
            <div className="glass rounded-2xl p-5">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 p-2 shadow-lg"><Plane size={14} className="text-white" /></div>
                <p className="text-sm font-bold text-white">Flight Snapshot</p>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-bold text-white">{outbound.direction}</p>
                  <p className="mt-1 text-sm text-slate-400">{outbound.depart_label} → {outbound.arrive_label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{outbound.transit}</p>
                </div>
                <span className="shrink-0 rounded-xl bg-sky-500/10 px-3.5 py-2 text-sm font-black tabular-nums text-sky-400 ring-1 ring-sky-500/20">{outbound.duration}</span>
              </div>
              {inbound && <div className="mt-4 border-t border-white/5 pt-3"><p className="text-xs text-slate-500">Return: {inbound.depart_label} → {inbound.arrive_label} · {inbound.duration}</p></div>}
              <button type="button" onClick={() => setActiveSection("flights")} className="mt-4 flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg transition hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">Open boarding pass <ArrowRight size={14} /></button>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-5 md:col-span-2">
          <div className="mb-4 flex items-center gap-2"><Sparkles size={14} className="text-amber-400" /><p className="text-sm font-bold text-white">Quick Access</p></div>
          <div className="space-y-2">
            {quickLinks.map((item) => (
              <button key={item.id} type="button" onClick={() => setActiveSection(item.id)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all hover:bg-white/5 group">
                <div className="rounded-xl bg-white/5 p-2.5 ring-1 ring-white/5 transition group-hover:bg-white/10"><item.Icon size={16} className="text-slate-400 group-hover:text-white transition" /></div>
                <div className="flex-1"><p className="text-sm font-semibold text-slate-200 group-hover:text-white transition">{item.label}</p><p className="text-[11px] text-slate-500">{item.desc}</p></div>
                <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
