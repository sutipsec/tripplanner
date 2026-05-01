"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocations } from "@/hooks/useTrip";

const dayRouteColors: Record<number, string> = {
  1: "#f87171", 2: "#fb923c", 3: "#fbbf24", 4: "#34d399",
  5: "#22d3ee", 6: "#818cf8", 7: "#c084fc",
};

function createIcon(loc: any, showLabel: boolean) {
  const color = dayRouteColors[loc.day_number] || "#818cf8";
  return L.divIcon({
    className: "",
    html: `<div style="display:flex;align-items:center;gap:6px;pointer-events:auto;cursor:pointer;">
      <div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:16px;">${loc.emoji}</div>
      ${showLabel ? `<div style="background:white;border-radius:8px;padding:3px 8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);font-size:11px;font-weight:600;font-family:system-ui;color:#1e293b;white-space:nowrap;border:1px solid #e2e8f0;">${loc.name}</div>` : ""}
    </div>`,
    iconSize: showLabel ? [200, 36] : [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -22],
  });
}

function MapInner({ locations, selectedDay }: { locations: any[]; selectedDay: number | null }) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const linesRef = useRef<L.Polyline[]>([]);

  const filtered = selectedDay ? locations.filter((l) => l.day_number === selectedDay) : locations;
  const showLabels = selectedDay !== null || filtered.length <= 8;

  useEffect(() => {
    if (!containerRef.current) return;
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, { zoomControl: false, attributionControl: false }).setView([33.55, 130.6], 9);
      L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", { maxZoom: 18 }).addTo(mapRef.current);
      L.control.attribution({ position: "bottomleft", prefix: false }).addAttribution('© CARTO · © OSM').addTo(mapRef.current);
    }
    const map = mapRef.current;
    markersRef.current.forEach((m) => m.remove()); markersRef.current = [];
    linesRef.current.forEach((p) => p.remove()); linesRef.current = [];

    filtered.forEach((loc) => {
      if (!loc.lat || !loc.lng) return;
      const m = L.marker([loc.lat, loc.lng], { icon: createIcon(loc, showLabels) })
        .addTo(map)
        .bindPopup(`<div style="font-family:system-ui;text-align:center;padding:6px 4px;">
          <div style="font-size:22px;margin-bottom:6px;">${loc.emoji}</div>
          <div style="font-weight:700;font-size:14px;color:#1e293b;">${loc.name}</div>
          ${loc.name_jp ? `<div style="font-size:12px;color:#64748b;margin-top:2px;">${loc.name_jp}</div>` : ""}
          <div style="margin-top:8px;display:inline-block;padding:3px 10px;border-radius:10px;font-size:11px;font-weight:700;color:white;background:${dayRouteColors[loc.day_number]};">Day ${loc.day_number}</div>
        </div>`, { closeButton: false, maxWidth: 200 });
      markersRef.current.push(m);
    });

    const days = [...new Set(filtered.map((l) => l.day_number))].sort();
    days.forEach((day) => {
      const locs = filtered.filter((l) => l.day_number === day && l.lat && l.lng);
      if (locs.length < 2) return;
      const line = L.polyline(locs.map((l) => [l.lat, l.lng] as L.LatLngTuple), {
        color: dayRouteColors[day] || "#818cf8", weight: 3, opacity: 0.7, dashArray: "10, 8",
      }).addTo(map);
      linesRef.current.push(line);
    });

    if (filtered.length > 0) {
      const g = L.featureGroup([...markersRef.current, ...linesRef.current]);
      map.fitBounds(g.getBounds().pad(0.2), { maxZoom: 14 });
    }
  }, [selectedDay, filtered.length, showLabels]);

  return <div ref={containerRef} className="h-full w-full rounded-xl" />;
}

export function RouteMapSection() {
  const { locations, loading } = useLocations();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const days = [
    { day: 1, emoji: "🛬" }, { day: 2, emoji: "🛕" }, { day: 3, emoji: "⛩️" },
    { day: 4, emoji: "🌸" }, { day: 5, emoji: "🌋" }, { day: 6, emoji: "🐡" },
  ];

  const currentLocs = selectedDay ? locations.filter((l) => l.day_number === selectedDay) : locations;

  if (loading) return <div className="flex h-[500px] items-center justify-center rounded-2xl bg-white/3"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-indigo-400" /></div>;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedDay(null)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${selectedDay === null ? "bg-white text-slate-900 shadow-lg" : "bg-white/5 text-slate-400 ring-1 ring-white/10 hover:bg-white/10"}`}>All Days</button>
        {days.map((d) => (
          <button key={d.day} onClick={() => setSelectedDay(selectedDay === d.day ? null : d.day)} className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${selectedDay === d.day ? "text-white shadow-lg" : "bg-white/5 text-slate-400 ring-1 ring-white/10 hover:bg-white/10"}`} style={selectedDay === d.day ? { background: dayRouteColors[d.day] } : {}}>
            <span>{d.emoji}</span> Day {d.day}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-black/20">
        <div className="h-[520px] w-full"><MapInner locations={locations} selectedDay={selectedDay} /></div>
      </div>
      <div className="glass rounded-xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{selectedDay ? `Day ${selectedDay} — สถานที่` : "สถานที่ทั้งหมดในทริป"}</p>
          <span className="rounded-lg bg-white/5 px-2 py-1 text-xs font-semibold text-slate-400 ring-1 ring-white/5">{currentLocs.length} places</span>
        </div>
        <div className="grid gap-1.5 sm:grid-cols-2 md:grid-cols-3">
          {currentLocs.map((loc) => (
            <div key={loc.id} className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition hover:bg-white/5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full text-base" style={{ background: `${dayRouteColors[loc.day_number]}22`, border: `2px solid ${dayRouteColors[loc.day_number]}` }}>{loc.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-200">{loc.name}</p>
                {loc.name_jp && <p className="truncate text-[11px] text-slate-500">{loc.name_jp}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
