"use client";

import { useState } from "react";
import Image from "next/image";
import { LayoutDashboard, Map, CalendarDays, Plane, Wallet, CheckSquare } from "lucide-react";
import { useTrip } from "@/hooks/useTrip";
import { DashboardSection } from "./sections/DashboardSection";
import { MapSection } from "./sections/MapSection";
import { TripDetailSection } from "./sections/TripDetailSection";
import { FlightsSection } from "./sections/FlightsSection";
import { BudgetSection } from "./sections/BudgetSection";
import { ChecklistSection } from "./sections/ChecklistSection";

type TopSection = "dashboard" | "map" | "trip-detail" | "flights" | "budget" | "checklist";

const tabs: { id: TopSection; label: string; Icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "map", label: "Map", Icon: Map },
  { id: "trip-detail", label: "Trip Detail", Icon: CalendarDays },
  { id: "flights", label: "Flights", Icon: Plane },
  { id: "budget", label: "Budget", Icon: Wallet },
  { id: "checklist", label: "Checklist", Icon: CheckSquare },
];

const memberColors = [
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-sky-400 to-blue-500",
  "from-emerald-400 to-teal-500",
];

export default function Home() {
  const [activeSection, setActiveSection] = useState<TopSection>("dashboard");
  const { trip, loading } = useTrip();

  if (loading || !trip) {
    return (
      <div className="relative min-h-screen">
        <div className="animated-bg"><div className="animated-bg-orb" /></div>
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-indigo-400" />
            <p className="text-sm text-slate-400">Loading trip…</p>
          </div>
        </div>
      </div>
    );
  }

  const now = new Date();
  const departureDate = new Date(trip.start_date);
  const diff = departureDate.getTime() - now.getTime();
  const daysUntil = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  const tripDates = `${trip.start_date} – ${trip.end_date}`;

  return (
    <div className="relative min-h-screen">
      <div className="animated-bg"><div className="animated-bg-orb" /></div>
      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-8 md:px-6">

        {/* HEADER */}
        <header className="relative overflow-hidden rounded-3xl shadow-2xl shadow-black/40">
          <div className="absolute inset-0">
            <Image src="/japan-hero.png" alt="Japan scenery" fill sizes="(min-width: 1024px) 960px, 100vw" className="object-cover object-center" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </div>
          <div className="relative p-7 pb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇯🇵</span>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Family Trip Planner</p>
                </div>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-white drop-shadow-lg">{trip.name}</h1>
                <p className="mt-2 text-sm font-medium text-white/60">{tripDates} &nbsp;·&nbsp; 7 วัน &nbsp;·&nbsp; Kyushu Region</p>
              </div>
              <div className="flex items-center gap-3 self-start">
                <div className="flex flex-col items-center rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md ring-1 ring-white/10">
                  <span className="text-3xl font-black tabular-nums text-white">{daysUntil}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">days to go</span>
                </div>
                <button className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md ring-1 ring-white/10 transition hover:bg-white/20">Share Trip</button>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {(trip.members || []).map((member: string, i: number) => (
                <div key={member} className="group flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm ring-1 ring-white/10 transition hover:bg-white/15">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${memberColors[i % memberColors.length]} text-[11px] font-bold text-white shadow-lg transition-transform group-hover:scale-110`}>{member[0]}</span>
                  <span className="text-sm font-medium text-white/90">{member}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* NAV */}
        <nav className="glass-strong rounded-2xl p-1.5">
          <div className="flex flex-wrap gap-1">
            {tabs.map(({ id, label, Icon }) => (
              <button key={id} type="button" onClick={() => setActiveSection(id)} className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${activeSection === id ? "bg-white text-slate-900 shadow-lg" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                <Icon size={14} />{label}
              </button>
            ))}
          </div>
        </nav>

        {/* CONTENT */}
        <div key={activeSection} className="animate-fade-in">
          {activeSection === "dashboard" && <DashboardSection trip={trip} setActiveSection={setActiveSection} />}
          {activeSection === "map" && <MapSection />}
          {activeSection === "trip-detail" && <TripDetailSection />}
          {activeSection === "flights" && <FlightsSection />}
          {activeSection === "budget" && <BudgetSection trip={trip} />}
          {activeSection === "checklist" && <ChecklistSection />}
        </div>

        <footer className="py-3 text-center text-xs text-slate-600">Built with ♥ for the family · Powered by Supabase</footer>
      </main>
    </div>
  );
}
