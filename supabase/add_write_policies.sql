-- Add write permissions for trip editing
-- Run this in Supabase SQL Editor

-- Itinerary entries: insert, update, delete
create policy "public insert entries" on itinerary_entries for insert with check (true);
create policy "public update entries" on itinerary_entries for update using (true);
create policy "public delete entries" on itinerary_entries for delete using (true);

-- Itinerary days: update (edit title/emoji)
create policy "public update days" on itinerary_days for update using (true);
create policy "public insert days" on itinerary_days for insert with check (true);

-- Locations: insert, update, delete (for linking entries to map)
create policy "public insert locations" on locations for insert with check (true);
create policy "public update locations" on locations for update using (true);
create policy "public delete locations" on locations for delete using (true);
