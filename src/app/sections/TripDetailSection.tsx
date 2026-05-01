"use client";
import { useState, useEffect, useCallback } from "react";
import { Clock, Plus, Pencil, Trash2, X, Check, MapPin } from "lucide-react";
import { useTrip, useItinerary, useLocations } from "@/hooks/useTrip";
import { supabase } from "@/lib/supabase";

const dayThemes = [
  { gradient: "from-rose-500/80 to-rose-600/80", accent: "border-l-rose-400", dot: "bg-rose-400", bg: "bg-rose-500" },
  { gradient: "from-orange-500/80 to-amber-600/80", accent: "border-l-orange-400", dot: "bg-orange-400", bg: "bg-orange-500" },
  { gradient: "from-amber-500/80 to-yellow-600/80", accent: "border-l-amber-400", dot: "bg-amber-400", bg: "bg-amber-500" },
  { gradient: "from-emerald-500/80 to-teal-600/80", accent: "border-l-emerald-400", dot: "bg-emerald-400", bg: "bg-emerald-500" },
  { gradient: "from-cyan-500/80 to-teal-600/80", accent: "border-l-cyan-400", dot: "bg-cyan-400", bg: "bg-cyan-500" },
  { gradient: "from-blue-500/80 to-indigo-600/80", accent: "border-l-blue-400", dot: "bg-blue-400", bg: "bg-blue-500" },
  { gradient: "from-violet-500/80 to-purple-600/80", accent: "border-l-violet-400", dot: "bg-violet-400", bg: "bg-violet-500" },
];

/* ───── Inline Add Entry ───── */
function AddEntryRow({ dayId, theme, locations, onAdded, onCancel }: { dayId: string; theme: any; locations: any[]; onAdded: () => void; onCancel: () => void }) {
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
    <div className="relative flex flex-wrap items-start gap-2 rounded-xl bg-white/5 px-3 py-3 ring-1 ring-indigo-500/30 mt-2 shadow-lg">
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
        <button onClick={handleSave} disabled={saving || !detail.trim()} className="rounded-lg bg-emerald-500 p-1.5 text-white transition hover:bg-emerald-400 disabled:opacity-50"><Check size={14} /></button>
        <button onClick={onCancel} className="rounded-lg bg-white/10 p-1.5 text-slate-400 transition hover:bg-white/20"><X size={14} /></button>
      </div>
    </div>
  );
}

/* ───── Edit Entry Inline ───── */
function EntryRow({ entry, theme, locations, onDeleted, onUpdated }: { entry: any; theme: any; locations: any[]; onDeleted: () => void; onUpdated: () => void }) {
  const [editing, setEditing] = useState(false);
  const [time, setTime] = useState(entry.time);
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
          <button onClick={handleSave} className="rounded-lg bg-emerald-500 p-1.5 text-white transition hover:bg-emerald-400"><Check size={14} /></button>
          <button onClick={() => { setEditing(false); setTime(entry.time); setDetail(entry.detail); setLocationId(entry.location_id || ""); }} className="rounded-lg bg-white/10 p-1.5 text-slate-400 transition hover:bg-white/20"><X size={14} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/3">
      <div className={`absolute -left-[27px] top-[14px] h-2 w-2 rounded-full ${theme.dot} opacity-60 ring-2 ring-black/50`} />
      <div className="mt-0.5 flex shrink-0 items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-400 ring-1 ring-white/5">
        <Clock size={9} className="text-slate-500" />{entry.time}
      </div>
      <div className="flex-1">
        <span className="text-[13px] leading-relaxed text-slate-300">{entry.detail}</span>
        {entry.locations && <span className="ml-2 inline-flex items-center gap-0.5 rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-400 ring-1 ring-indigo-500/20"><MapPin size={9} /> {entry.locations.name}</span>}
      </div>
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
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
  
  // Inline edit day header
  const [editDayId, setEditDayId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editEmoji, setEditEmoji] = useState("");
  const [savingDay, setSavingDay] = useState(false);

  const [liveDays, setLiveDays] = useState<any[]>([]);
  useEffect(() => { setLiveDays(days); }, [days]);

  const refetch = useCallback(async () => {
    const { data } = await supabase
      .from("itinerary_days")
      .select("*, itinerary_entries(*, locations(*))")
      .eq("trip_id", "11111111-1111-1111-1111-111111111111")
      .order("sort_order");
    if (data) {
      setLiveDays(data.map((d: any) => ({
        ...d,
        itinerary_entries: (d.itinerary_entries || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
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

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Trip Timeline</h2>
          <p className="text-sm text-slate-400">{trip?.start_date} – {trip?.end_date} · {liveDays.length} วัน</p>
        </div>
      </div>
      <div className="space-y-4">
        {liveDays.map((day, idx) => {
          const theme = dayThemes[idx % dayThemes.length];
          const entries = day.itinerary_entries || [];
          const isEditing = editDayId === day.id;

          return (
            <div key={day.id} className="glass rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:shadow-black/20">
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
                        <span className="text-[11px] text-white/60">{day.date}</span>
                      </div>
                      <p className="mt-0.5 text-[15px] font-bold text-white">{day.title}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 transition group-hover/header:opacity-100">
                      <button onClick={() => { setEditDayId(day.id); setEditTitle(day.title); setEditEmoji(day.emoji); }} className="rounded-lg bg-white/15 p-1.5 text-white/90 transition hover:bg-white/25 hover:text-white" title="Edit day">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setAddDayId(day.id)} className="flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1.5 text-[11px] font-semibold text-white/90 transition hover:bg-white/25 hover:text-white" title="Add activity">
                        <Plus size={13} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Entries */}
              <div className="p-4">
                <div className={`ml-2 space-y-0 border-l-2 ${theme.accent} border-opacity-30 pl-5`}>
                  {entries.map((entry: any) => (
                    <EntryRow key={entry.id} entry={entry} theme={theme} locations={locations} onDeleted={refetch} onUpdated={refetch} />
                  ))}
                  
                  {addDayId === day.id && (
                    <AddEntryRow dayId={day.id} theme={theme} locations={locations} onAdded={() => { setAddDayId(null); refetch(); }} onCancel={() => setAddDayId(null)} />
                  )}
                  
                  {!addDayId && !isEditing && entries.length === 0 && (
                    <div className="py-2 text-sm text-slate-500 italic">ไม่มีกิจกรรมในวันนี้</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
