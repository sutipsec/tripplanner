"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const TRIP_ID = "11111111-1111-1111-1111-111111111111";

// ─── Trip ───
export function useTrip() {
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("trips").select("*").eq("id", TRIP_ID).single()
      .then(({ data }) => { setTrip(data); setLoading(false); });
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
      .then(({ data }) => {
        const sorted = (data || []).map((d: any) => ({
          ...d,
          itinerary_entries: (d.itinerary_entries || []).sort(
            (a: any, b: any) => a.sort_order - b.sort_order
          ),
        }));
        setDays(sorted);
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
      .then(({ data }) => { setLocations(data || []); setLoading(false); });
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
      .then(({ data }) => { setExpenses(data || []); setLoading(false); });
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
      .then(({ data }) => { setItems(data || []); setLoading(false); });
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const toggle = async (id: string, done: boolean) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, done: !done } : i));
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
      .then(({ data }) => {
        const sorted = (data || []).map((f: any) => ({
          ...f,
          flight_segments: (f.flight_segments || []).sort(
            (a: any, b: any) => a.sort_order - b.sort_order
          ),
        }));
        setFlights(sorted);
        setLoading(false);
      });
  }, []);
  return { flights, loading };
}
