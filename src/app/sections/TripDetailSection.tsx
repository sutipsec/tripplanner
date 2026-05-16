"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { BedDouble, CalendarDays, Camera, Clock, Plus, Pencil, Trash2, X, Check, MapPin, Route, ListChecks, ChevronDown, ChevronUp, ImagePlus } from "lucide-react";
import { useTrip, useItinerary, useLocations } from "@/hooks/useTrip";
import { supabase } from "@/lib/supabase";

const TRIP_ID = "11111111-1111-1111-1111-111111111111";

type DayTheme = {
  gradient: string;
  accent: string;
  dot: string;
  bg: string;
};

type Location = {
  id: string;
  name: string;
  emoji?: string;
};

type ItineraryEntry = {
  id: string;
  day_id: string;
  time?: string;
  detail: string;
  location_id?: string | null;
  sort_order: number;
  locations?: Location | null;
};

type ItineraryDay = {
  id: string;
  day_number: number;
  date?: string;
  title: string;
  emoji: string;
  itinerary_entries?: ItineraryEntry[];
};

type DayPhoto = {
  id: string;
  title: string;
  subtitle: string;
  label: string;
  image: string;
  kind: "place" | "stay" | "route";
};

const dayThemes = [
  { gradient: "from-rose-500/80 to-rose-600/80", accent: "border-l-rose-400", dot: "bg-rose-400", bg: "bg-rose-500" },
  { gradient: "from-orange-500/80 to-amber-600/80", accent: "border-l-orange-400", dot: "bg-orange-400", bg: "bg-orange-500" },
  { gradient: "from-amber-500/80 to-yellow-600/80", accent: "border-l-amber-400", dot: "bg-amber-400", bg: "bg-amber-500" },
  { gradient: "from-emerald-500/80 to-teal-600/80", accent: "border-l-emerald-400", dot: "bg-emerald-400", bg: "bg-emerald-500" },
  { gradient: "from-cyan-500/80 to-teal-600/80", accent: "border-l-cyan-400", dot: "bg-cyan-400", bg: "bg-cyan-500" },
  { gradient: "from-blue-500/80 to-indigo-600/80", accent: "border-l-blue-400", dot: "bg-blue-400", bg: "bg-blue-500" },
  { gradient: "from-violet-500/80 to-purple-600/80", accent: "border-l-violet-400", dot: "bg-violet-400", bg: "bg-violet-500" },
];

const dayPhotos: Record<number, DayPhoto[]> = {
  1: [
    { id: "day-1-route", title: "Fukuoka Arrival", subtitle: "Airport, Hakata, shrine walk", label: "Route", image: "/mockup-days/day-1.png", kind: "route" },
    { id: "day-1-hakata", title: "Hakata Station", subtitle: "JR pass and city base", label: "Station", image: "/mockup-days/day-1.png", kind: "place" },
    { id: "day-1-kushida", title: "Kushida Shrine", subtitle: "Old town shrine stop", label: "Shrine", image: "/mockup-days/day-1.png", kind: "place" },
    { id: "day-1-canal", title: "Canal City Hakata", subtitle: "Evening shopping walk", label: "Shopping", image: "/mockup-days/day-1.png", kind: "place" },
  ],
  2: [
    { id: "day-2-hotel", title: "One's Hotel Fukuoka", subtitle: "Main stay after hotel move", label: "Stay", image: "/mockup-days/day-2.png", kind: "stay" },
    { id: "day-2-nanzoin", title: "Nanzoin Temple", subtitle: "Reclining Buddha day trip", label: "Temple", image: "/mockup-days/day-2.png", kind: "place" },
    { id: "day-2-yatai", title: "Yatai Stalls", subtitle: "Night food walk", label: "Food", image: "/mockup-days/day-2.png", kind: "place" },
  ],
  3: [
    { id: "day-3-dazaifu", title: "Dazaifu Tenmangu", subtitle: "Shrine and walking street", label: "Shrine", image: "/mockup-days/day-3.png", kind: "place" },
    { id: "day-3-hotel", title: "One's Hotel Fukuoka", subtitle: "Return to Fukuoka base", label: "Stay", image: "/mockup-days/day-3.png", kind: "stay" },
  ],
  4: [
    { id: "day-4-yufuin", title: "Yufuin", subtitle: "Onsen town and street walk", label: "Town", image: "/mockup-days/day-4.png", kind: "place" },
    { id: "day-4-kinrin", title: "Kinrin Lake", subtitle: "Lake and morning mist view", label: "Lake", image: "/mockup-days/day-4.png", kind: "place" },
    { id: "day-4-hotel", title: "One's Hotel Fukuoka", subtitle: "Back to Fukuoka", label: "Stay", image: "/mockup-days/day-4.png", kind: "stay" },
  ],
  5: [
    { id: "day-5-aso", title: "Mt. Aso", subtitle: "Volcano viewpoint plan", label: "Nature", image: "/mockup-days/day-5.png", kind: "place" },
    { id: "day-5-kumamoto", title: "Kumamoto Station", subtitle: "Shinkansen connection", label: "Station", image: "/mockup-days/day-5.png", kind: "route" },
    { id: "day-5-hotel", title: "One's Hotel Fukuoka", subtitle: "Late return rest", label: "Stay", image: "/mockup-days/day-5.png", kind: "stay" },
  ],
  6: [
    { id: "day-6-karato", title: "Karato Fish Market", subtitle: "Sushi and market walk", label: "Food", image: "/mockup-days/day-6.png", kind: "place" },
    { id: "day-6-mojiko", title: "Mojiko Retro", subtitle: "Port town architecture", label: "Port", image: "/mockup-days/day-6.png", kind: "place" },
    { id: "day-6-castle", title: "Kumamoto Castle Area", subtitle: "Josaien / city walk", label: "Castle", image: "/mockup-days/day-6.png", kind: "place" },
    { id: "day-6-hotel", title: "One's Hotel Fukuoka", subtitle: "Final night base", label: "Stay", image: "/mockup-days/day-6.png", kind: "stay" },
  ],
  7: [
    { id: "day-7-airport", title: "Fukuoka Airport", subtitle: "VN357 departure", label: "Airport", image: "/mockup-days/day-7.png", kind: "route" },
    { id: "day-7-hanoi", title: "Transit Hanoi", subtitle: "Return connection", label: "Transit", image: "/mockup-days/day-7.png", kind: "route" },
  ],
};

const emptyPhoto = (dayNumber: number): DayPhoto => ({
  id: `day-${dayNumber}-photo-${Date.now()}`,
  title: "",
  subtitle: "",
  label: "Place",
  image: `/mockup-days/day-${dayNumber}.png`,
  kind: "place",
});

const getInitialPhotoLibrary = () => {
  if (typeof window === "undefined") return dayPhotos;
  const saved = window.localStorage.getItem("trip-day-photos");
  if (!saved) return dayPhotos;
  try {
    return JSON.parse(saved) as Record<number, DayPhoto[]>;
  } catch {
    window.localStorage.removeItem("trip-day-photos");
    return dayPhotos;
  }
};

const formatDate = (date?: string) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date(date));
};

const getTimeRange = (entries: ItineraryEntry[]) => {
  const times = entries.map((entry) => entry.time).filter(Boolean);
  if (times.length === 0) return "Flexible";
  return `${times[0]} - ${times[times.length - 1]}`;
};

const getLinkedLocations = (entries: ItineraryEntry[]) => {
  const map = new Map<string, Location>();
  entries.forEach((entry) => {
    if (entry.locations?.id) map.set(entry.locations.id, entry.locations);
  });
  return Array.from(map.values());
};

function DayPhotoGrid({ photos, onOpenPhoto }: { photos: DayPhoto[]; onOpenPhoto: (photo: DayPhoto) => void }) {
  if (photos.length === 0) return null;

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,0.95fr)_minmax(280px,0.55fr)]">
      <button type="button" onClick={() => onOpenPhoto(photos[0])} className="group relative min-h-[260px] overflow-hidden rounded-xl bg-white/5 text-left ring-1 ring-white/10 transition hover:ring-indigo-300/40">
        <img src={photos[0].image} alt={photos[0].title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
        <div className="absolute right-3 top-3 rounded-full bg-black/45 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100">
          View photo
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md ring-1 ring-white/20">
            <Camera size={12} /> Featured
          </span>
          <p className="mt-2 text-lg font-black text-white">{photos[0].title}</p>
          <p className="text-sm text-slate-200/80">{photos[0].subtitle}</p>
        </div>
      </button>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {photos.slice(1).map((photo, index) => {
          const Icon = photo.kind === "stay" ? BedDouble : MapPin;
          return (
            <button key={`${photo.title}-${index}`} type="button" onClick={() => onOpenPhoto(photo)} className="group grid grid-cols-[96px_1fr] overflow-hidden rounded-xl bg-white/5 text-left ring-1 ring-white/10 transition hover:bg-white/7 hover:ring-indigo-300/40">
              <div className="relative min-h-[94px] overflow-hidden bg-slate-800">
                <img src={photo.image} alt={photo.title} className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105" style={{ objectPosition: `${35 + (index % 3) * 20}% center` }} />
              </div>
              <div className="flex min-w-0 flex-col justify-center p-3">
                <span className={`mb-1 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${photo.kind === "stay" ? "bg-amber-500/10 text-amber-300 ring-amber-400/20" : "bg-indigo-500/10 text-indigo-300 ring-indigo-400/20"}`}>
                  <Icon size={10} /> {photo.label}
                </span>
                <p className="truncate text-sm font-bold text-white">{photo.title}</p>
                <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">{photo.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PhotoManager({ photos, dayNumber, onChange }: { photos: DayPhoto[]; dayNumber: number; onChange: (photos: DayPhoto[]) => void }) {
  const updatePhoto = (id: string, patch: Partial<DayPhoto>) => {
    onChange(photos.map((photo) => photo.id === id ? { ...photo, ...patch } : photo));
  };

  const uploadPhoto = (id: string, file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") updatePhoto(id, { image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-xl border border-dashed border-indigo-400/25 bg-indigo-500/5 p-3">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-white">Manage photos</p>
          <p className="text-xs text-slate-500">ใส่ path รูปใน public เช่น /photos/hotel.jpg หรือ URL รูป https://...</p>
        </div>
        <button type="button" onClick={() => onChange([...photos, emptyPhoto(dayNumber)])} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-900 transition hover:bg-slate-100">
          <ImagePlus size={14} /> Add photo
        </button>
      </div>

      <div className="space-y-3">
        {photos.map((photo, index) => (
          <div key={photo.id} className="grid gap-2 rounded-xl bg-white/5 p-3 ring-1 ring-white/10 lg:grid-cols-[120px_1fr_auto]">
            <div className="relative h-24 overflow-hidden rounded-lg bg-slate-800">
              <img src={photo.image || "/japan-hero.png"} alt={photo.title || "Trip photo"} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <input value={photo.title} onChange={(event) => updatePhoto(photo.id, { title: event.target.value })} placeholder="Title เช่น One's Hotel Fukuoka" className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400" />
              <input value={photo.label} onChange={(event) => updatePhoto(photo.id, { label: event.target.value })} placeholder="Label เช่น Stay / Temple" className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400" />
              <input value={photo.subtitle} onChange={(event) => updatePhoto(photo.id, { subtitle: event.target.value })} placeholder="Subtitle" className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400 sm:col-span-2" />
              <input value={photo.image} onChange={(event) => updatePhoto(photo.id, { image: event.target.value })} placeholder="/photos/place.jpg หรือ https://..." className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400 sm:col-span-2" />
              <select value={photo.kind} onChange={(event) => updatePhoto(photo.id, { kind: event.target.value as DayPhoto["kind"] })} className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400">
                <option value="place">Place</option>
                <option value="stay">Stay</option>
                <option value="route">Route</option>
              </select>
              <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-slate-200 ring-1 ring-white/10 transition hover:bg-white/15">
                <ImagePlus size={14} /> Upload file
                <input type="file" accept="image/*" onChange={(event) => uploadPhoto(photo.id, event.target.files?.[0])} className="sr-only" />
              </label>
            </div>
            <div className="flex items-start justify-between gap-2 lg:flex-col">
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 ring-1 ring-white/10">#{index + 1}</span>
              <button type="button" onClick={() => onChange(photos.filter((item) => item.id !== photo.id))} className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-500/15 hover:text-rose-300" title="Delete photo">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhotoLightbox({ photo, onClose }: { photo: DayPhoto; onClose: () => void }) {
  const Icon = photo.kind === "stay" ? BedDouble : MapPin;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={photo.title}>
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close photo viewer" />
      <div className="relative max-h-[92dvh] w-full max-w-4xl overflow-hidden rounded-2xl bg-slate-950 shadow-2xl ring-1 ring-white/15">
        <button type="button" onClick={onClose} className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition hover:bg-black/70" aria-label="Close photo viewer">
          <X size={18} />
        </button>
        <div className="relative h-[72dvh] max-h-[720px] min-h-[280px] bg-slate-900">
          <img src={photo.image} alt={photo.title} className="h-full w-full object-contain" />
        </div>
        <div className="flex flex-col gap-2 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-black text-white">{photo.title}</p>
            <p className="text-sm text-slate-400">{photo.subtitle}</p>
          </div>
          <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1 ${photo.kind === "stay" ? "bg-amber-500/10 text-amber-300 ring-amber-400/20" : "bg-indigo-500/10 text-indigo-300 ring-indigo-400/20"}`}>
            <Icon size={12} /> {photo.label}
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ───── Inline Add Entry ───── */
function AddEntryRow({ dayId, theme, locations, onAdded, onCancel }: { dayId: string; theme: DayTheme; locations: Location[]; onAdded: () => void; onCancel: () => void }) {
  const [time, setTime] = useState("12:00");
  const [detail, setDetail] = useState("");
  const [locationId, setLocationId] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!detail.trim()) return;
    setSaving(true);
    const { data: maxOrder } = await supabase
      .from("itinerary_entries")
      .select("sort_order")
      .eq("day_id", dayId)
      .order("sort_order", { ascending: false })
      .limit(1);
    const nextOrder = (maxOrder?.[0]?.sort_order || 0) + 1;

    await supabase.from("itinerary_entries").insert({
      day_id: dayId,
      time,
      detail: detail.trim(),
      location_id: locationId || null,
      sort_order: nextOrder,
    });
    setSaving(false);
    onAdded();
  };

  return (
    <div className="relative mt-2 flex flex-wrap items-start gap-2 rounded-xl bg-white/5 px-3 py-3 shadow-lg ring-1 ring-indigo-500/30">
      <div className={`absolute -left-[27px] top-[16px] h-2 w-2 rounded-full ${theme.dot} opacity-60 ring-2 ring-black/50`} />
      
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
        className="w-20 shrink-0 rounded-lg border border-white/10 bg-slate-800 px-2 py-1.5 font-mono text-[11px] text-white outline-none focus:border-indigo-500" autoFocus />
      
      <input type="text" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="รายละเอียดกิจกรรม..."
        className="flex-1 min-w-[150px] rounded-lg border border-white/10 bg-slate-800 px-2 py-1.5 text-[13px] text-white outline-none focus:border-indigo-500" onKeyDown={(e) => e.key === 'Enter' && handleSave()} />
      
      <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-800 px-2 py-1.5 text-[12px] text-slate-300 outline-none focus:border-indigo-500 sm:w-auto sm:flex-none">
        <option value="">-- ไม่ผูกกับสถานที่ --</option>
        {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.emoji} {loc.name}</option>)}
      </select>

      <div className="flex w-full justify-end gap-1 sm:w-auto">
        <button onClick={handleSave} disabled={saving || !detail.trim()} className="rounded-lg bg-emerald-500 p-1.5 text-white transition hover:bg-emerald-400 disabled:opacity-50" title="Save activity"><Check size={14} /></button>
        <button onClick={onCancel} className="rounded-lg bg-white/10 p-1.5 text-slate-400 transition hover:bg-white/20" title="Cancel"><X size={14} /></button>
      </div>
    </div>
  );
}

/* ───── Edit Entry Inline ───── */
function EntryRow({ entry, theme, locations, onDeleted, onUpdated }: { entry: ItineraryEntry; theme: DayTheme; locations: Location[]; onDeleted: () => void; onUpdated: () => void }) {
  const [editing, setEditing] = useState(false);
  const [time, setTime] = useState(entry.time || "");
  const [detail, setDetail] = useState(entry.detail);
  const [locationId, setLocationId] = useState(entry.location_id || "");
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    await supabase.from("itinerary_entries").update({ time, detail, location_id: locationId || null }).eq("id", entry.id);
    setEditing(false);
    onUpdated();
  };

  const handleDelete = async () => {
    setDeleting(true);
    await supabase.from("itinerary_entries").delete().eq("id", entry.id);
    onDeleted();
  };

  if (editing) {
    return (
      <div className="relative flex flex-wrap items-start gap-2 rounded-xl bg-white/5 px-3 py-3 ring-1 ring-indigo-500/30 shadow-lg mt-1 mb-1">
        <div className={`absolute -left-[27px] top-[16px] h-2 w-2 rounded-full ${theme.dot} opacity-60 ring-2 ring-black/50`} />
        
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
          className="w-20 shrink-0 rounded-lg border border-white/10 bg-slate-800 px-2 py-1.5 font-mono text-[11px] text-white outline-none focus:border-indigo-500" />
        
        <input type="text" value={detail} onChange={(e) => setDetail(e.target.value)}
          className="flex-1 min-w-[150px] rounded-lg border border-white/10 bg-slate-800 px-2 py-1.5 text-[13px] text-white outline-none focus:border-indigo-500" onKeyDown={(e) => e.key === 'Enter' && handleSave()} autoFocus />
        
        <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-800 px-2 py-1.5 text-[12px] text-slate-300 outline-none focus:border-indigo-500 sm:w-auto sm:flex-none">
          <option value="">-- ไม่ผูกกับสถานที่ --</option>
          {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.emoji} {loc.name}</option>)}
        </select>

        <div className="flex w-full justify-end gap-1 sm:w-auto">
          <button onClick={handleSave} className="rounded-lg bg-emerald-500 p-1.5 text-white transition hover:bg-emerald-400" title="Save activity"><Check size={14} /></button>
          <button onClick={() => { setEditing(false); setTime(entry.time || ""); setDetail(entry.detail); setLocationId(entry.location_id || ""); }} className="rounded-lg bg-white/10 p-1.5 text-slate-400 transition hover:bg-white/20" title="Cancel"><X size={14} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex items-start gap-3 rounded-xl px-3 py-3 transition hover:bg-white/3">
      <div className={`absolute -left-[27px] top-[14px] h-2 w-2 rounded-full ${theme.dot} opacity-60 ring-2 ring-black/50`} />
      <div className="mt-0.5 flex shrink-0 items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-400 ring-1 ring-white/5">
        <Clock size={9} className="text-slate-500" />{entry.time}
      </div>
      <div className="flex-1">
        <span className="text-[13px] leading-relaxed text-slate-300">{entry.detail}</span>
        {entry.locations && <span className="ml-2 inline-flex items-center gap-0.5 rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-400 ring-1 ring-indigo-500/20"><MapPin size={9} /> {entry.locations.name}</span>}
      </div>
      <div className="flex shrink-0 items-center gap-1 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
        <button onClick={() => setEditing(true)} className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/10 hover:text-white" title="Edit entry"><Pencil size={12} /></button>
        <button onClick={handleDelete} disabled={deleting} className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-500/20 hover:text-rose-400" title="Delete entry"><Trash2 size={12} /></button>
      </div>
    </div>
  );
}

/* ───── Main Section ───── */
export function TripDetailSection() {
  const { trip } = useTrip();
  const { days, loading: daysLoading } = useItinerary();
  const { locations } = useLocations(); // Fetch available locations
  
  const [addDayId, setAddDayId] = useState<string | null>(null);
  const [focusedDayId, setFocusedDayId] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<DayPhoto | null>(null);
  const [editingPhotoDay, setEditingPhotoDay] = useState<number | null>(null);
  const [photoLibrary, setPhotoLibrary] = useState<Record<number, DayPhoto[]>>(getInitialPhotoLibrary);
  
  // Inline edit day header
  const [editDayId, setEditDayId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editEmoji, setEditEmoji] = useState("");
  const [savingDay, setSavingDay] = useState(false);

  const [refetchedDays, setRefetchedDays] = useState<ItineraryDay[] | null>(null);
  const liveDays = (refetchedDays || days) as ItineraryDay[];

  const updateDayPhotos = useCallback((dayNumber: number, photos: DayPhoto[]) => {
    setPhotoLibrary((current) => {
      const next = { ...current, [dayNumber]: photos };
      window.localStorage.setItem("trip-day-photos", JSON.stringify(next));
      return next;
    });
  }, []);

  const refetch = useCallback(async () => {
    const { data } = await supabase
      .from("itinerary_days")
      .select("*, itinerary_entries(*, locations(*))")
      .eq("trip_id", TRIP_ID)
      .order("sort_order");
    if (data) {
      setRefetchedDays(data.map((d: ItineraryDay) => ({
        ...d,
        itinerary_entries: (d.itinerary_entries || []).sort((a, b) => a.sort_order - b.sort_order),
      })));
    }
  }, []);

  const handleSaveDay = async (id: string) => {
    if (!editTitle.trim()) return;
    setSavingDay(true);
    await supabase.from("itinerary_days").update({ title: editTitle.trim(), emoji: editEmoji }).eq("id", id);
    setSavingDay(false);
    setEditDayId(null);
    refetch();
  };

  if (daysLoading && liveDays.length === 0) return <div className="flex h-40 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-indigo-400" /></div>;

  const totalActivities = liveDays.reduce((sum, day) => sum + (day.itinerary_entries?.length || 0), 0);
  const totalLocations = new Set(liveDays.flatMap((day) => getLinkedLocations(day.itinerary_entries || []).map((loc) => loc.id))).size;
  const focusedDay = focusedDayId ? liveDays.find((day) => day.id === focusedDayId) : null;
  const visibleDays = focusedDay ? [focusedDay] : liveDays;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-400/80">Itinerary Builder</p>
          <h2 className="text-2xl font-black tracking-tight text-white">Trip Timeline</h2>
          <p className="mt-1 text-sm text-slate-400">{formatDate(trip?.start_date)} - {formatDate(trip?.end_date)} · {liveDays.length} days</p>
        </div>
        {focusedDay && (
          <button type="button" onClick={() => setFocusedDayId(null)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 shadow-lg transition hover:scale-[1.01] active:scale-[0.98]">
            <ChevronUp size={15} /> Show all days
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Days</p>
            <CalendarDays size={16} className="text-indigo-400" />
          </div>
          <p className="mt-2 text-3xl font-black text-white">{liveDays.length}</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Activities</p>
            <ListChecks size={16} className="text-emerald-400" />
          </div>
          <p className="mt-2 text-3xl font-black text-white">{totalActivities}</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Linked Places</p>
            <Route size={16} className="text-sky-400" />
          </div>
          <p className="mt-2 text-3xl font-black text-white">{totalLocations}</p>
        </div>
      </div>

      <div className="glass-strong sticky top-3 z-20 rounded-2xl p-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {liveDays.map((day, idx) => {
            const theme = dayThemes[idx % dayThemes.length];
            const isFocused = focusedDayId === day.id;
            return (
              <button key={day.id} type="button" onClick={() => setFocusedDayId(isFocused ? null : day.id)} className={`flex min-w-[132px] items-center gap-2 rounded-xl px-3 py-2 text-left transition ${isFocused ? "bg-white text-slate-900 shadow-lg" : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isFocused ? "bg-slate-900/10" : theme.bg} text-base`}>{day.emoji}</span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-black uppercase tracking-widest opacity-70">Day {day.day_number}</span>
                  <span className="block truncate text-xs font-bold">{day.title}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {visibleDays.map((day) => {
          const dayIndex = liveDays.findIndex((item) => item.id === day.id);
          const theme = dayThemes[(dayIndex >= 0 ? dayIndex : 0) % dayThemes.length];
          const entries = day.itinerary_entries || [];
          const dayLocations = getLinkedLocations(entries);
          const photos = photoLibrary[day.day_number] || [];
          const isEditing = editDayId === day.id;

          return (
            <div key={day.id} className="glass overflow-hidden rounded-2xl transition-all hover:shadow-xl hover:shadow-black/20">
              {/* Day header */}
              {isEditing ? (
                <div className={`bg-gradient-to-r ${theme.gradient} px-5 py-3 flex items-center gap-3`}>
                  <input type="text" value={editEmoji} onChange={(e) => setEditEmoji(e.target.value)} className="w-11 rounded-lg border border-white/20 bg-white/20 px-2 py-1.5 text-center text-xl outline-none focus:bg-white/30" />
                  <div className="flex-1">
                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full rounded-lg border border-white/20 bg-white/20 px-3 py-1.5 font-bold text-white outline-none focus:bg-white/30 placeholder-white/50" placeholder="ชื่อวัน..." onKeyDown={(e) => e.key === 'Enter' && handleSaveDay(day.id)} autoFocus />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => handleSaveDay(day.id)} disabled={savingDay || !editTitle.trim()} className="rounded-lg bg-white/90 p-1.5 text-slate-900 transition hover:bg-white disabled:opacity-50"><Check size={14} strokeWidth={3} /></button>
                    <button onClick={() => setEditDayId(null)} className="rounded-lg bg-white/20 p-1.5 text-white transition hover:bg-white/30"><X size={14} strokeWidth={3} /></button>
                  </div>
                </div>
              ) : (
                <div className={`bg-gradient-to-r ${theme.gradient} px-5 py-3 group/header`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl leading-none">{day.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">Day {day.day_number}</span>
                        <span className="text-[11px] text-white/60">{formatDate(day.date)}</span>
                        <span className="hidden text-[11px] text-white/50 sm:inline">· {getTimeRange(entries)}</span>
                      </div>
                      <p className="mt-0.5 text-[15px] font-bold text-white">{day.title}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-100 transition md:opacity-0 md:group-hover/header:opacity-100">
                      {!focusedDay && (
                        <button onClick={() => setFocusedDayId(day.id)} className="hidden items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1.5 text-[11px] font-semibold text-white/90 transition hover:bg-white/25 hover:text-white sm:flex" title="Focus this day">
                          <ChevronDown size={13} /> Focus
                        </button>
                      )}
                      <button onClick={() => { setEditDayId(day.id); setEditTitle(day.title); setEditEmoji(day.emoji); }} className="rounded-lg bg-white/15 p-1.5 text-white/90 transition hover:bg-white/25 hover:text-white" title="Edit day">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setEditingPhotoDay(editingPhotoDay === day.day_number ? null : day.day_number)} className="flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1.5 text-[11px] font-semibold text-white/90 transition hover:bg-white/25 hover:text-white" title="Manage photos">
                        <Camera size={13} /> Photos
                      </button>
                      <button onClick={() => setAddDayId(day.id)} className="flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1.5 text-[11px] font-semibold text-white/90 transition hover:bg-white/25 hover:text-white" title="Add activity">
                        <Plus size={13} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Entries */}
              <div className="space-y-4 p-4">
                <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300 ring-1 ring-white/5">
                      <ListChecks size={12} className="text-emerald-400" /> {entries.length} activities
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300 ring-1 ring-white/5">
                      <Clock size={12} className="text-sky-400" /> {getTimeRange(entries)}
                    </span>
                  </div>
                  {dayLocations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:justify-end">
                      {dayLocations.slice(0, 4).map((loc) => (
                        <span key={loc.id} className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-300 ring-1 ring-indigo-500/20">
                          <span>{loc.emoji}</span>{loc.name}
                        </span>
                      ))}
                      {dayLocations.length > 4 && <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-400 ring-1 ring-white/5">+{dayLocations.length - 4}</span>}
                    </div>
                  )}
                </div>
                <DayPhotoGrid photos={photos} onOpenPhoto={setSelectedPhoto} />
                {editingPhotoDay === day.day_number && (
                  <PhotoManager photos={photos} dayNumber={day.day_number} onChange={(nextPhotos) => updateDayPhotos(day.day_number, nextPhotos)} />
                )}
                <div className={`ml-2 space-y-0 border-l-2 ${theme.accent} border-opacity-30 pl-5`}>
                  {entries.map((entry) => (
                    <EntryRow key={entry.id} entry={entry} theme={theme} locations={locations} onDeleted={refetch} onUpdated={refetch} />
                  ))}
                  
                  {addDayId === day.id && (
                    <AddEntryRow dayId={day.id} theme={theme} locations={locations} onAdded={() => { setAddDayId(null); refetch(); }} onCancel={() => setAddDayId(null)} />
                  )}
                  
                  {!addDayId && !isEditing && entries.length === 0 && (
                    <button type="button" onClick={() => setAddDayId(day.id)} className="my-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/3 px-4 py-6 text-sm font-semibold text-slate-400 transition hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-indigo-200">
                      <Plus size={15} /> เพิ่มกิจกรรมแรกของวันนี้
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {selectedPhoto && <PhotoLightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
    </section>
  );
}
