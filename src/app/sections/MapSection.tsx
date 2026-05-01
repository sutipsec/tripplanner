"use client";
import dynamic from "next/dynamic";
import { Plane, Clock } from "lucide-react";
import { useFlights } from "@/hooks/useTrip";
import { useState } from "react";

const RouteMapSection = dynamic(
  () => import("../components/RouteMap").then((m) => m.RouteMapSection),
  { ssr: false, loading: () => <div className="flex h-[500px] items-center justify-center rounded-2xl bg-white/3"><p className="text-slate-500">Loading map…</p></div> }
);

type MapTab = "route" | "outbound" | "inbound";

export function MapSection() {
  const [mapView, setMapView] = useState<MapTab>("route");
  const { flights } = useFlights();
  const flight = mapView === "outbound" ? flights[0] : flights[1];

  return (
    <section className="glass rounded-2xl p-5">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">เส้นทางการเดินทาง</h2>
          <p className="text-sm text-slate-400">แผนที่ route ทริป Fukuoka และเที่ยวบิน</p>
        </div>
        <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
          {(["route", "outbound", "inbound"] as const).map((view) => {
            const labels: Record<MapTab, string> = { route: "🗺️ Route Map", outbound: "✈️ Outbound", inbound: "✈️ Return" };
            return (
              <button key={view} type="button" onClick={() => setMapView(view)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${mapView === view ? "bg-white text-slate-900 shadow-lg" : "text-slate-400 hover:text-white"}`}>
                {labels[view]}
              </button>
            );
          })}
        </div>
      </div>

      {mapView === "route" ? (
        <RouteMapSection />
      ) : flight ? (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 shadow-lg glow-indigo">
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">{mapView === "outbound" ? "Outbound Flight" : "Return Flight"}</p>
                <p className="mt-1 text-lg font-bold text-white">{flight.direction}</p>
                <p className="text-sm text-slate-400">{flight.depart_label} → {flight.arrive_label}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Total</p>
                <p className="text-3xl font-black gradient-text">{flight.duration}</p>
                <span className="mt-1 inline-block rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-slate-400 ring-1 ring-white/10">{flight.booking_ref}</span>
              </div>
            </div>
            <div className="relative mt-6 flex items-center">
              {(flight.flow || []).map((city: string, i: number, arr: string[]) => (
                <div key={`flow-${i}`} className="contents">
                  {i > 0 && (<div className="flex flex-1 items-center px-2"><div className="h-px flex-1 border-t border-dashed border-indigo-500/30" /><Plane size={12} className="mx-1.5 text-sky-400" /><div className="h-px flex-1 border-t border-dashed border-indigo-500/30" /></div>)}
                  <div className="text-center">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{i === 0 ? "FROM" : i === arr.length - 1 ? "TO" : "VIA"}</p>
                    <p className="mt-0.5 text-sm font-bold text-white">{city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {(flight.flight_segments || []).map((seg: any, i: number) => (
            <div key={seg.id}>
              {i > 0 && (
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 border-t border-dashed border-amber-500/20" />
                  <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400"><Clock size={11} /> Transit Hanoi · {flight.layover_duration}</div>
                  <div className="flex-1 border-t border-dashed border-amber-500/20" />
                </div>
              )}
              <div className="glass rounded-2xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Segment {i + 1}</span>
                  <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-400 ring-1 ring-indigo-500/20">{seg.flight_no}</span>
                </div>
                <div className="flex items-center gap-3 md:gap-6">
                  <div><p className="text-4xl font-black tracking-tight gradient-text">{seg.from_code}</p><p className="mt-0.5 text-sm text-slate-400">{seg.from_city}</p><p className="mt-2 text-2xl font-bold tabular-nums text-white">{seg.from_time}</p></div>
                  <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-bold text-sky-400">{seg.duration}</span>
                    <div className="flex w-full items-center"><div className="h-px flex-1 bg-gradient-to-r from-indigo-500/40 to-transparent" /><div className="mx-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 shadow-lg shadow-indigo-500/30"><Plane size={14} className="text-white" /></div><div className="h-px flex-1 bg-gradient-to-l from-indigo-500/40 to-transparent" /></div>
                    <span className="text-xs text-slate-500">{seg.aircraft}</span>
                  </div>
                  <div className="text-right"><p className="text-4xl font-black tracking-tight gradient-text">{seg.to_code}</p><p className="mt-0.5 text-sm text-slate-400">{seg.to_city}</p><p className="mt-2 text-2xl font-bold tabular-nums text-white">{seg.to_time}</p></div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-white/3 px-3 py-2.5 text-xs ring-1 ring-white/5"><span className="text-slate-500">Seats:</span><span className="font-semibold text-slate-300">{seg.seat}</span></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center text-slate-500">Loading flight data…</div>
      )}
    </section>
  );
}
