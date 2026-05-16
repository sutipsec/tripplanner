"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Check, MapPin, Pencil, Plus, Trash2, X } from "lucide-react";
import { useLocations } from "@/hooks/useTrip";

type TripLocation = {
  id: string;
  trip_id?: string;
  name: string;
  name_jp?: string | null;
  lat: number | null;
  lng: number | null;
  emoji: string;
  type: string;
  day_number: number;
};

const dayRouteColors: Record<number, string> = {
  1: "#f87171", 2: "#fb923c", 3: "#fbbf24", 4: "#34d399",
  5: "#22d3ee", 6: "#818cf8", 7: "#c084fc",
};

const emptyLocation = (dayNumber: number): TripLocation => ({
  id: `local-location-${Date.now()}`,
  name: "",
  name_jp: "",
  lat: 33.5902,
  lng: 130.4017,
  emoji: "📍",
  type: "attraction",
  day_number: dayNumber,
});

const loadSavedLocations = () => {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem("trip-map-locations");
  if (!saved) return null;
  try {
    return JSON.parse(saved) as TripLocation[];
  } catch {
    window.localStorage.removeItem("trip-map-locations");
    return null;
  }
};

const parseMapCoordinates = (value: string) => {
  const decoded = decodeURIComponent(value.trim());
  const patterns = [
    /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
    /[?&](?:q|query|ll)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
  ];

  for (const pattern of patterns) {
    const match = decoded.match(pattern);
    if (!match) continue;
    const lat = Number(match[1]);
    const lng = Number(match[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  }

  return null;
};

function createIcon(loc: TripLocation, showLabel: boolean) {
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

function MapInner({ locations, selectedDay }: { locations: TripLocation[]; selectedDay: number | null }) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const linesRef = useRef<L.Polyline[]>([]);

  const filtered = useMemo(() => selectedDay ? locations.filter((l) => l.day_number === selectedDay) : locations, [locations, selectedDay]);
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
  }, [filtered, selectedDay, showLabels]);

  return <div ref={containerRef} className="h-full w-full rounded-xl" />;
}

function LocationEditor({
  location,
  onSave,
  onCancel,
}: {
  location: TripLocation;
  onSave: (location: TripLocation) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<TripLocation>(location);
  const [mapLink, setMapLink] = useState("");
  const [mapLinkError, setMapLinkError] = useState("");

  const patch = (updates: Partial<TripLocation>) => setDraft((current) => ({ ...current, ...updates }));
  const applyMapLink = () => {
    const coords = parseMapCoordinates(mapLink);
    if (!coords) {
      setMapLinkError("ยังอ่านพิกัดไม่ได้ ลองใช้ลิงก์ Google Maps แบบเต็มที่มี @lat,lng หรือ !3d...!4d...");
      return;
    }
    patch(coords);
    setMapLinkError("");
  };

  return (
    <div className="rounded-xl bg-white/5 p-3 ring-1 ring-indigo-400/25">
      <div className="mb-2 grid gap-2 md:grid-cols-[1fr_auto]">
        <input value={mapLink} onChange={(event) => { setMapLink(event.target.value); setMapLinkError(""); }} placeholder="Paste Google Maps link เช่น https://www.google.com/maps/place/.../@33.5902,130.4017,17z" className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400" />
        <button type="button" onClick={applyMapLink} className="rounded-lg bg-indigo-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-400">
          Use coords
        </button>
      </div>
      {mapLinkError && <p className="mb-2 text-xs text-amber-300">{mapLinkError}</p>}
      <div className="grid gap-2 md:grid-cols-[72px_1fr_1fr]">
        <input value={draft.emoji} onChange={(event) => patch({ emoji: event.target.value })} className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-center text-lg text-white outline-none focus:border-indigo-400" />
        <input value={draft.name} onChange={(event) => patch({ name: event.target.value })} placeholder="Place name" className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400" />
        <input value={draft.name_jp || ""} onChange={(event) => patch({ name_jp: event.target.value })} placeholder="Japanese name" className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400" />
        <select value={draft.day_number} onChange={(event) => patch({ day_number: Number(event.target.value) })} className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => <option key={day} value={day}>Day {day}</option>)}
        </select>
        <input value={draft.type} onChange={(event) => patch({ type: event.target.value })} placeholder="type เช่น hotel / temple" className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400" />
        <div className="grid grid-cols-2 gap-2">
          <input type="number" step="0.000001" value={draft.lat ?? ""} onChange={(event) => patch({ lat: Number(event.target.value) })} placeholder="lat" className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400" />
          <input type="number" step="0.000001" value={draft.lng ?? ""} onChange={(event) => patch({ lng: Number(event.target.value) })} placeholder="lng" className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400" />
        </div>
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <button type="button" onClick={() => onSave(draft)} disabled={!draft.name.trim() || !draft.lat || !draft.lng} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-400 disabled:opacity-50">
          <Check size={14} /> Save
        </button>
        <button type="button" onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/15">
          <X size={14} /> Cancel
        </button>
      </div>
    </div>
  );
}

export function RouteMapSection() {
  const { locations, loading } = useLocations();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [localLocations, setLocalLocations] = useState<TripLocation[] | null>(loadSavedLocations);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const editableLocations = localLocations || (locations as TripLocation[]);

  const persistLocations = (nextLocations: TripLocation[]) => {
    setLocalLocations(nextLocations);
    window.localStorage.setItem("trip-map-locations", JSON.stringify(nextLocations));
  };

  const saveLocation = (location: TripLocation) => {
    const exists = editableLocations.some((item) => item.id === location.id);
    const nextLocations = exists
      ? editableLocations.map((item) => item.id === location.id ? location : item)
      : [...editableLocations, location];
    persistLocations(nextLocations);
    setEditingId(null);
    setAdding(false);
  };

  const deleteLocation = (id: string) => {
    persistLocations(editableLocations.filter((item) => item.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const resetLocations = () => {
    window.localStorage.removeItem("trip-map-locations");
    setLocalLocations(locations as TripLocation[]);
    setEditingId(null);
    setAdding(false);
  };

  const days = [
    { day: 1, emoji: "🛬" }, { day: 2, emoji: "🛕" }, { day: 3, emoji: "⛩️" },
    { day: 4, emoji: "🌸" }, { day: 5, emoji: "🌋" }, { day: 6, emoji: "🐡" },
    { day: 7, emoji: "🛫" },
  ];

  const currentLocs = selectedDay ? editableLocations.filter((l) => l.day_number === selectedDay) : editableLocations;

  if (loading && editableLocations.length === 0) return <div className="flex h-[500px] items-center justify-center rounded-2xl bg-white/3"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-indigo-400" /></div>;

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
        <div className="h-[520px] w-full"><MapInner locations={editableLocations} selectedDay={selectedDay} /></div>
      </div>
      <div className="glass rounded-xl p-4">
        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{selectedDay ? `Day ${selectedDay} — แก้สถานที่ของวันนี้` : "แก้สถานที่ทั้งหมดในทริป"}</p>
            <p className="mt-1 text-xs text-slate-500">แก้ชื่อ พิกัด emoji ประเภท และย้ายวันได้จากหน้านี้</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-lg bg-white/5 px-2 py-2 text-xs font-semibold text-slate-400 ring-1 ring-white/5">{currentLocs.length} places</span>
            <button type="button" onClick={() => { setAdding(true); setEditingId(null); }} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-900 transition hover:bg-slate-100">
              <Plus size={14} /> Add {selectedDay ? `Day ${selectedDay}` : "Place"}
            </button>
            <button type="button" onClick={resetLocations} className="rounded-lg bg-white/5 px-3 py-2 text-xs font-bold text-slate-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white">
              Reset
            </button>
          </div>
        </div>

        {adding && (
          <div className="mb-3">
            <LocationEditor location={emptyLocation(selectedDay || 1)} onSave={saveLocation} onCancel={() => setAdding(false)} />
          </div>
        )}

        <div className="grid gap-2">
          {currentLocs.map((loc) => (
            editingId === loc.id ? (
              <LocationEditor key={loc.id} location={loc} onSave={saveLocation} onCancel={() => setEditingId(null)} />
            ) : (
              <div key={loc.id} className="grid gap-3 rounded-xl px-3 py-3 transition hover:bg-white/5 md:grid-cols-[1fr_auto] md:items-center">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base" style={{ background: `${dayRouteColors[loc.day_number]}22`, border: `2px solid ${dayRouteColors[loc.day_number]}` }}>{loc.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-200">{loc.name}</p>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 ring-1 ring-white/5">Day {loc.day_number}</span>
                      <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300 ring-1 ring-indigo-500/20">{loc.type}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
                      {loc.name_jp && <span>{loc.name_jp}</span>}
                      <span>{loc.lat?.toFixed(5)}, {loc.lng?.toFixed(5)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-1.5">
                  <button type="button" onClick={() => setEditingId(loc.id)} className="rounded-lg p-2 text-slate-500 transition hover:bg-white/10 hover:text-white" title="Edit place">
                    <Pencil size={14} />
                  </button>
                  <button type="button" onClick={() => deleteLocation(loc.id)} className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-500/15 hover:text-rose-300" title="Delete place">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          ))}
          {currentLocs.length === 0 && (
            <button type="button" onClick={() => setAdding(true)} className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/3 px-4 py-8 text-sm font-semibold text-slate-400 transition hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-indigo-200">
              <MapPin size={16} /> เพิ่มสถานที่สำหรับมุมมองนี้
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
