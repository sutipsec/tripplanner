"use client";
import Image from "next/image";
import { Plane, Clock, ArrowRight } from "lucide-react";
import { useFlights } from "@/hooks/useTrip";

export function FlightsSection() {
  const { flights, loading } = useFlights();

  if (loading) return <div className="flex h-40 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-indigo-400" /></div>;

  return (
    <section className="space-y-5">
      {flights.map((flight) => (
        <article key={flight.id} className="overflow-hidden rounded-2xl glass shadow-lg">
          <div className="relative overflow-hidden bg-gradient-to-r from-[#1a3a5c] to-[#234e7a] px-6 py-5 perforated-edge">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(243,194,82,0.08),transparent_60%)]" />
            <div className="relative flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5 p-1">
                  <Image src="/vietnam-airlines-logo.png" alt="Vietnam Airlines" width={102} height={56} className="h-8 w-auto object-contain" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#f3c252]">Vietnam Airlines</p>
                  <p className="text-lg font-bold text-white">{flight.route_code}</p>
                </div>
              </div>
              <div className="rounded-full bg-[#f3c252] px-3 py-1 text-xs font-bold text-[#1a3a5c] shadow-lg shadow-yellow-500/20">{flight.booking_ref}</div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">{flight.direction}</h2>
                <p className="text-sm text-slate-400">{flight.depart_label} → {flight.arrive_label} ({flight.duration})</p>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-400 ring-1 ring-sky-500/20"><Clock size={11} /> {flight.transit}</span>
            </div>
            <div className="mt-5 border-t border-dashed border-white/5 pt-4"><p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Boarding pass segments</p></div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {(flight.flight_segments || []).map((seg: any, idx: number) => (
                <div key={seg.id} className="rounded-xl border border-white/5 bg-white/3 p-4 transition hover:border-white/10 hover:bg-white/5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Segment {idx + 1}</p>
                    <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-400">{seg.flight_no}</span>
                  </div>
                  <p className="mt-2 text-base font-bold text-white">{seg.route}</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="text-slate-400">{seg.aircraft}</p>
                    <p className="rounded-lg bg-white/3 px-2.5 py-1.5 text-xs text-slate-300 ring-1 ring-white/5">{seg.seat}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-white/3 p-4 ring-1 ring-white/5">
              <p className="mb-2 text-xs font-semibold text-slate-400">Flight Flow</p>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {(flight.flow || []).map((point: string, i: number) => (
                  <div key={`${flight.id}-${point}`} className="contents">
                    {i > 0 && <ArrowRight size={12} className="text-slate-600" />}
                    <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-300 ring-1 ring-white/5">{i === 1 ? `Transit: ${point}` : point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
