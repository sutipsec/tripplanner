"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { bookedFlights, defaultChecklist, expenses as fallbackExpenses, itinerary, trip as fallbackTrip } from "@/app/data";

const TRIP_ID = "11111111-1111-1111-1111-111111111111";

const fallbackTripRecord = {
  id: TRIP_ID,
  name: fallbackTrip.name,
  start_date: "2026-12-07",
  end_date: "2026-12-13",
  budget: fallbackTrip.budget,
  spent: fallbackTrip.spent,
  members: fallbackTrip.members,
};

const fallbackDays = itinerary.map((day, dayIndex) => ({
  id: `fallback-day-${dayIndex + 1}`,
  trip_id: TRIP_ID,
  day_number: dayIndex + 1,
  date: new Date(2026, 11, 7 + dayIndex).toISOString().slice(0, 10),
  title: day.title,
  emoji: day.emoji,
  sort_order: dayIndex + 1,
  itinerary_entries: day.entries.map((entry, entryIndex) => ({
    id: `fallback-entry-${dayIndex + 1}-${entryIndex + 1}`,
    day_id: `fallback-day-${dayIndex + 1}`,
    time: entry.time,
    detail: entry.detail,
    location_id: null,
    sort_order: entryIndex + 1,
    locations: null,
  })),
}));

const fallbackFlights = bookedFlights.map((flight, flightIndex) => ({
  id: `fallback-flight-${flightIndex + 1}`,
  trip_id: TRIP_ID,
  direction: flight.direction,
  route_code: flight.routeCode,
  depart_label: flight.departLabel,
  arrive_label: flight.arriveLabel,
  duration: flight.duration,
  transit: flight.transit,
  layover_duration: flight.layoverDuration,
  booking_ref: flight.bookingRef,
  flow: flight.flow,
  sort_order: flightIndex + 1,
  flight_segments: flight.segments.map((segment, segmentIndex) => ({
    id: `fallback-segment-${flightIndex + 1}-${segmentIndex + 1}`,
    flight_id: `fallback-flight-${flightIndex + 1}`,
    route: segment.route,
    flight_no: segment.flightNo,
    aircraft: segment.aircraft,
    seat: segment.seat,
    from_code: segment.from.code,
    from_city: segment.from.city,
    from_time: segment.from.time,
    to_code: segment.to.code,
    to_city: segment.to.city,
    to_time: segment.to.time,
    duration: segment.duration,
    sort_order: segmentIndex + 1,
  })),
}));

const fallbackChecklist = defaultChecklist.map((item, index) => ({
  id: `fallback-checklist-${index + 1}`,
  trip_id: TRIP_ID,
  label: item.label,
  done: item.done,
  sort_order: index + 1,
}));

const fallbackExpenseRecords = fallbackExpenses.map((expense, index) => ({
  id: `fallback-expense-${index + 1}`,
  trip_id: TRIP_ID,
  category: expense.category,
  estimate: expense.estimate,
  actual: expense.actual,
  sort_order: index + 1,
}));

// ─── Trip ───
export function useTrip() {
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("trips").select("*").eq("id", TRIP_ID).single()
      .then(({ data, error }) => {
        setTrip(error || !data ? fallbackTripRecord : data);
        setLoading(false);
      }, () => {
        setTrip(fallbackTripRecord);
        setLoading(false);
      });
  }, []);
  return { trip, loading };
}

// ─── Itinerary (days + entries + linked locations) ───
export function useItinerary() {
  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from("itinerary_days")
      .select("*, itinerary_entries(*, locations(*))")
      .eq("trip_id", TRIP_ID)
      .order("sort_order")
      .then(({ data, error }) => {
        const source = error || !data?.length ? fallbackDays : data;
        const sorted = source.map((d: any) => ({
          ...d,
          itinerary_entries: (d.itinerary_entries || []).sort(
            (a: any, b: any) => a.sort_order - b.sort_order
          ),
        }));
        setDays(sorted);
        setLoading(false);
      }, () => {
        setDays(fallbackDays);
        setLoading(false);
      });
  }, []);
  return { days, loading };
}

// ─── Locations ───
export function useLocations() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("locations").select("*").eq("trip_id", TRIP_ID)
      .order("day_number")
      .then(({ data }) => { setLocations(data || []); setLoading(false); }, () => { setLocations([]); setLoading(false); });
  }, []);
  return { locations, loading };
}

// ─── Expenses ───
export function useExpenses() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("expenses").select("*").eq("trip_id", TRIP_ID)
      .order("sort_order")
      .then(({ data, error }) => { setExpenses(error || !data?.length ? fallbackExpenseRecords : data); setLoading(false); }, () => { setExpenses(fallbackExpenseRecords); setLoading(false); });
  }, []);
  return { expenses, loading };
}

// ─── Checklist ───
export function useChecklist() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    supabase.from("checklist_items").select("*").eq("trip_id", TRIP_ID)
      .order("sort_order")
      .then(({ data, error }) => { setItems(error || !data?.length ? fallbackChecklist : data); setLoading(false); }, () => { setItems(fallbackChecklist); setLoading(false); });
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const toggle = async (id: string, done: boolean) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, done: !done } : i));
    if (id.startsWith("fallback-")) return;
    await supabase.from("checklist_items").update({ done: !done }).eq("id", id);
  };

  return { items, loading, toggle };
}

// ─── Flights ───
export function useFlights() {
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from("flights")
      .select("*, flight_segments(*)")
      .eq("trip_id", TRIP_ID)
      .order("sort_order")
      .then(({ data, error }) => {
        const source = error || !data?.length ? fallbackFlights : data;
        const sorted = source.map((f: any) => ({
          ...f,
          flight_segments: (f.flight_segments || []).sort(
            (a: any, b: any) => a.sort_order - b.sort_order
          ),
        }));
        setFlights(sorted);
        setLoading(false);
      }, () => {
        setFlights(fallbackFlights);
        setLoading(false);
      });
  }, []);
  return { flights, loading };
}
