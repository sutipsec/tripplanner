-- =============================================
-- Trip Planner Database Schema + Seed Data
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. TRIPS
create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date,
  end_date date,
  budget integer default 0,
  spent integer default 0,
  members text[] default '{}',
  created_at timestamptz default now()
);

-- 2. ITINERARY DAYS
create table if not exists itinerary_days (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  day_number integer not null,
  date date,
  title text,
  emoji text default '📍',
  sort_order integer default 0
);

-- 3. LOCATIONS
create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  name text not null,
  name_jp text,
  lat float8,
  lng float8,
  emoji text default '📍',
  type text default 'attraction',
  day_number integer
);

-- 4. ITINERARY ENTRIES
create table if not exists itinerary_entries (
  id uuid primary key default gen_random_uuid(),
  day_id uuid references itinerary_days(id) on delete cascade,
  time text,
  detail text,
  location_id uuid references locations(id) on delete set null,
  sort_order integer default 0
);

-- 5. EXPENSES
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  category text not null,
  estimate integer default 0,
  actual integer default 0,
  sort_order integer default 0
);

-- 6. CHECKLIST
create table if not exists checklist_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  label text not null,
  done boolean default false,
  sort_order integer default 0
);

-- 7. FLIGHTS
create table if not exists flights (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  direction text,
  route_code text,
  depart_label text,
  arrive_label text,
  duration text,
  transit text,
  layover_duration text,
  booking_ref text,
  flow text[] default '{}',
  sort_order integer default 0
);

-- 8. FLIGHT SEGMENTS
create table if not exists flight_segments (
  id uuid primary key default gen_random_uuid(),
  flight_id uuid references flights(id) on delete cascade,
  route text,
  flight_no text,
  aircraft text,
  seat text,
  from_code text,
  from_city text,
  from_time text,
  to_code text,
  to_city text,
  to_time text,
  duration text,
  sort_order integer default 0
);

-- =============================================
-- RLS: Allow public read access
-- =============================================
alter table trips enable row level security;
alter table itinerary_days enable row level security;
alter table itinerary_entries enable row level security;
alter table locations enable row level security;
alter table expenses enable row level security;
alter table checklist_items enable row level security;
alter table flights enable row level security;
alter table flight_segments enable row level security;

-- Public read policies
create policy "public read" on trips for select using (true);
create policy "public read" on itinerary_days for select using (true);
create policy "public read" on itinerary_entries for select using (true);
create policy "public read" on locations for select using (true);
create policy "public read" on expenses for select using (true);
create policy "public read" on checklist_items for select using (true);
create policy "public read" on flights for select using (true);
create policy "public read" on flight_segments for select using (true);

-- Public write for checklist (toggle done)
create policy "public update checklist" on checklist_items for update using (true);

-- =============================================
-- SEED DATA
-- =============================================

-- Trip
insert into trips (id, name, start_date, end_date, budget, spent, members)
values (
  '11111111-1111-1111-1111-111111111111',
  'Japan Family Trip 2026',
  '2026-12-07', '2026-12-13',
  96000, 62000,
  ARRAY['Toon','Gus','Pun','Pae']
);

-- Itinerary Days
insert into itinerary_days (id, trip_id, day_number, date, title, emoji, sort_order) values
('d1000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111',1,'2026-12-07','Arrival + Hakata + Shrine Walk','🛬',1),
('d1000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111',2,'2026-12-08','Move Hotel + Nanzoin','🛕',2),
('d1000000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111',3,'2026-12-09','Dazaifu Day Trip','⛩️',3),
('d1000000-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111',4,'2026-12-10','Yufuin + Kinrin Lake','🌸',4),
('d1000000-0000-0000-0000-000000000005','11111111-1111-1111-1111-111111111111',5,'2026-12-11','Aso Day Trip','🌋',5),
('d1000000-0000-0000-0000-000000000006','11111111-1111-1111-1111-111111111111',6,'2026-12-12','Mojiko + Karato + Kumamoto','🐡',6),
('d1000000-0000-0000-0000-000000000007','11111111-1111-1111-1111-111111111111',7,'2026-12-13','Airport + Fly Home','🛫',7);

-- Locations
insert into locations (id, trip_id, name, name_jp, lat, lng, emoji, type, day_number) values
('a0000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','Fukuoka Airport','福岡空港',33.5859,130.4511,'✈️','airport',1),
('a0000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','Hakata Station','博多駅',33.5897,130.4207,'🚆','station',1),
('a0000000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','Tochoji Temple','東長寺',33.5932,130.4130,'🛕','temple',1),
('a0000000-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','Kushida Shrine','櫛田神社',33.5903,130.4098,'⛩️','temple',1),
('a0000000-0000-0000-0000-000000000005','11111111-1111-1111-1111-111111111111','Canal City Hakata','キャナルシティ博多',33.5895,130.4110,'🛍️','shopping',1),
('a0000000-0000-0000-0000-000000000006','11111111-1111-1111-1111-111111111111','Tenjin Area','天神',33.5917,130.3986,'🏙️','shopping',1),
('a0000000-0000-0000-0000-000000000007','11111111-1111-1111-1111-111111111111','Ones Hotel Fukuoka',null,33.5890,130.4025,'🏨','hotel',2),
('a0000000-0000-0000-0000-000000000008','11111111-1111-1111-1111-111111111111','Nanzoin Temple','南蔵院',33.6244,130.5658,'🛕','temple',2),
('a0000000-0000-0000-0000-000000000009','11111111-1111-1111-1111-111111111111','Yatai Stalls','屋台',33.5940,130.4010,'🍜','food',2),
('a0000000-0000-0000-0000-000000000010','11111111-1111-1111-1111-111111111111','Dazaifu Tenmangu','太宰府天満宮',33.5194,130.5350,'⛩️','temple',3),
('a0000000-0000-0000-0000-000000000011','11111111-1111-1111-1111-111111111111','Yufuin','由布院',33.2674,131.3688,'♨️','nature',4),
('a0000000-0000-0000-0000-000000000012','11111111-1111-1111-1111-111111111111','Kinrin Lake','金鱗湖',33.2620,131.3767,'🏞️','nature',4),
('a0000000-0000-0000-0000-000000000013','11111111-1111-1111-1111-111111111111','Mt. Aso','阿蘇山',32.8842,131.1040,'🌋','nature',5),
('a0000000-0000-0000-0000-000000000014','11111111-1111-1111-1111-111111111111','Kumamoto Station','熊本駅',32.7898,130.6882,'🚆','station',5),
('a0000000-0000-0000-0000-000000000015','11111111-1111-1111-1111-111111111111','Mojiko Retro','門司港レトロ',33.9461,130.9612,'🏛️','attraction',6),
('a0000000-0000-0000-0000-000000000016','11111111-1111-1111-1111-111111111111','Karato Fish Market','唐戸市場',33.9575,130.9442,'🐟','food',6),
('a0000000-0000-0000-0000-000000000017','11111111-1111-1111-1111-111111111111','Kumamoto Castle Area','熊本城',32.8063,130.7058,'🏯','attraction',6);

-- Itinerary Entries (Day 1)
insert into itinerary_entries (day_id, time, detail, location_id, sort_order) values
('d1000000-0000-0000-0000-000000000001','07:35','ถึง Fukuoka Airport (FUK) จากไฟลต์ VN356','a0000000-0000-0000-0000-000000000001',1),
('d1000000-0000-0000-0000-000000000001','08:10','นั่ง Airport Bus เข้า Hakata และฝากกระเป๋า','a0000000-0000-0000-0000-000000000002',2),
('d1000000-0000-0000-0000-000000000001','09:30','Exchange JR Pass และจัดการตั๋วเดินทางหลัก',null,3),
('d1000000-0000-0000-0000-000000000001','11:00','แวะ Tochoji Temple และ Kushida Shrine','a0000000-0000-0000-0000-000000000003',4),
('d1000000-0000-0000-0000-000000000001','13:00','มื้อกลางวันย่าน Hakata',null,5),
('d1000000-0000-0000-0000-000000000001','16:30','เดินเล่น Canal City','a0000000-0000-0000-0000-000000000005',6),
('d1000000-0000-0000-0000-000000000001','19:00','มื้อเย็นย่าน Tenjin แล้วกลับที่พัก','a0000000-0000-0000-0000-000000000006',7);

-- Day 2
insert into itinerary_entries (day_id, time, detail, location_id, sort_order) values
('d1000000-0000-0000-0000-000000000002','09:30','เช็กเอาต์โรงแรมเดิมและย้ายไป Ones Hotel Fukuoka','a0000000-0000-0000-0000-000000000007',1),
('d1000000-0000-0000-0000-000000000002','11:00','Airport Line ไป Hakata แล้วต่อรถไฟไป Nanzoin',null,2),
('d1000000-0000-0000-0000-000000000002','12:30','เที่ยว Nanzoin Temple (พระนอน)','a0000000-0000-0000-0000-000000000008',3),
('d1000000-0000-0000-0000-000000000002','15:30','กลับเข้าเมือง แวะช้อปปิงเบาๆ',null,4),
('d1000000-0000-0000-0000-000000000002','18:30','Ichiran ramen',null,5),
('d1000000-0000-0000-0000-000000000002','20:00','เดินเล่นย่าน Yatai แล้วกลับที่พัก','a0000000-0000-0000-0000-000000000009',6);

-- Day 3
insert into itinerary_entries (day_id, time, detail, location_id, sort_order) values
('d1000000-0000-0000-0000-000000000003','08:00','ออกจากโรงแรมไป Hakata Bus Center',null,1),
('d1000000-0000-0000-0000-000000000003','09:00','นั่งบัสไป Dazaifu',null,2),
('d1000000-0000-0000-0000-000000000003','10:00','เดินถนนคนเดิน + Dazaifu Tenmangu','a0000000-0000-0000-0000-000000000010',3),
('d1000000-0000-0000-0000-000000000003','12:30','มื้อกลางวันแถว Dazaifu',null,4),
('d1000000-0000-0000-0000-000000000003','15:30','ขึ้นบัสกลับ Fukuoka',null,5),
('d1000000-0000-0000-0000-000000000003','18:00','Canal City และมื้อเย็นย่าน Tenjin','a0000000-0000-0000-0000-000000000005',6);

-- Day 4
insert into itinerary_entries (day_id, time, detail, location_id, sort_order) values
('d1000000-0000-0000-0000-000000000004','07:30','ออกจากที่พักไป Hakata Station',null,1),
('d1000000-0000-0000-0000-000000000004','09:17','รถไฟ Yufuin No Mori ออกจาก Hakata',null,2),
('d1000000-0000-0000-0000-000000000004','11:31','ถึง Yufuin และเริ่มเดินเที่ยวเมือง','a0000000-0000-0000-0000-000000000011',3),
('d1000000-0000-0000-0000-000000000004','13:00','เที่ยว Yufuin Floral Village',null,4),
('d1000000-0000-0000-0000-000000000004','15:00','แวะ Kinrin Lake + Yunotsubo Street','a0000000-0000-0000-0000-000000000012',5),
('d1000000-0000-0000-0000-000000000004','17:17','ขึ้นรถไฟกลับ Fukuoka',null,6),
('d1000000-0000-0000-0000-000000000004','19:28','ถึง Hakata และกลับโรงแรม',null,7);

-- Day 5
insert into itinerary_entries (day_id, time, detail, location_id, sort_order) values
('d1000000-0000-0000-0000-000000000005','08:00','ออกจากที่พักและนั่ง Shinkansen ไป Kumamoto',null,1),
('d1000000-0000-0000-0000-000000000005','09:30','ต่อรถไฟ/บัสไป Aso',null,2),
('d1000000-0000-0000-0000-000000000005','11:30','ถึง Aso และขึ้นรถบัสไปจุดชมวิว Aso San','a0000000-0000-0000-0000-000000000013',3),
('d1000000-0000-0000-0000-000000000005','13:00','เที่ยวโซนภูเขาไฟ (ขึ้นกับสภาพอากาศ)',null,4),
('d1000000-0000-0000-0000-000000000005','16:00','เดินทางกลับ Kumamoto และต่อกลับ Hakata','a0000000-0000-0000-0000-000000000014',5),
('d1000000-0000-0000-0000-000000000005','20:00','ถึง Hakata และพักผ่อน',null,6);

-- Day 6
insert into itinerary_entries (day_id, time, detail, location_id, sort_order) values
('d1000000-0000-0000-0000-000000000006','07:00','ออกจากโรงแรมไป Hakata Station',null,1),
('d1000000-0000-0000-0000-000000000006','07:20','นั่งรถไฟไป Mojiko',null,2),
('d1000000-0000-0000-0000-000000000006','09:30','ข้ามไป Karato Fish Market เดินเล่นและกินซูชิ','a0000000-0000-0000-0000-000000000016',3),
('d1000000-0000-0000-0000-000000000006','12:30','เดินทางกลับฝั่ง Mojiko','a0000000-0000-0000-0000-000000000015',4),
('d1000000-0000-0000-0000-000000000006','13:30','ขึ้น Shinkansen ไป Kumamoto',null,5),
('d1000000-0000-0000-0000-000000000006','16:00','เดินเล่น Josaien / Shimotori Shopping Arcade','a0000000-0000-0000-0000-000000000017',6),
('d1000000-0000-0000-0000-000000000006','20:00','กลับที่พัก',null,7);

-- Day 7
insert into itinerary_entries (day_id, time, detail, sort_order) values
('d1000000-0000-0000-0000-000000000007','05:30','เช็กเอาต์และเดินทางไปสนามบิน Fukuoka',1),
('d1000000-0000-0000-0000-000000000007','10:00','ไฟลต์ VN357: FUK → HAN',2),
('d1000000-0000-0000-0000-000000000007','12:55','ถึง Hanoi และรอทรานซิต',3),
('d1000000-0000-0000-0000-000000000007','15:50','ไฟลต์ VN619: HAN → BKK',4),
('d1000000-0000-0000-0000-000000000007','17:55','ถึงกรุงเทพฯ และเดินทางกลับบ้าน',5);

-- Expenses
insert into expenses (trip_id, category, estimate, actual, sort_order) values
('11111111-1111-1111-1111-111111111111','Flight',62000,62000,1),
('11111111-1111-1111-1111-111111111111','Hotel',15000,0,2),
('11111111-1111-1111-1111-111111111111','Food & Dining',8000,0,3),
('11111111-1111-1111-1111-111111111111','Transport (JR Pass etc.)',6000,0,4),
('11111111-1111-1111-1111-111111111111','Activities',5000,0,5);

-- Checklist
insert into checklist_items (trip_id, label, done, sort_order) values
('11111111-1111-1111-1111-111111111111','Passport',true,1),
('11111111-1111-1111-1111-111111111111','JR Pass booking',true,2),
('11111111-1111-1111-1111-111111111111','Travel insurance',false,3),
('11111111-1111-1111-1111-111111111111','Universal Studios tickets',false,4),
('11111111-1111-1111-1111-111111111111','Hotel booking',false,5),
('11111111-1111-1111-1111-111111111111','Airport bus / transport plan',false,6),
('11111111-1111-1111-1111-111111111111','Pocket WiFi / SIM card',false,7),
('11111111-1111-1111-1111-111111111111','Currency exchange (JPY)',false,8);

-- Flights
insert into flights (id, trip_id, direction, route_code, depart_label, arrive_label, duration, transit, layover_duration, booking_ref, flow, sort_order) values
('f0000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','Bangkok to Fukuoka','BKK → FUK','Sat 6 Dec 2026','Sun 7 Dec 2026','7h 25m','Transit at Hanoi (HAN) 1h 50m','1h 50m','PNR: VN8FUK26',ARRAY['Thailand','Hanoi','Fukuoka'],1),
('f0000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','Fukuoka to Bangkok','FUK → BKK','Mon 14 Dec 2026','Mon 14 Dec 2026','9h 55m','Transit at Hanoi (HAN) 2h 55m','2h 55m','PNR: VN8BKK26',ARRAY['Fukuoka','Hanoi','Thailand'],2);

-- Flight Segments
insert into flight_segments (flight_id, route, flight_no, aircraft, seat, from_code, from_city, from_time, to_code, to_city, to_time, duration, sort_order) values
('f0000000-0000-0000-0000-000000000001','BKK 22:10 → HAN 00:05 (+1)','VN616','Airbus A321','Toon 24A · Gus 24B · Pun 24C · Pae 24D','BKK','Bangkok','22:10','HAN','Hanoi','00:05','3h 55m',1),
('f0000000-0000-0000-0000-000000000001','HAN 01:55 → FUK 07:35','VN356','Airbus A321','Toon 18A · Gus 18B · Pun 18C · Pae 18D','HAN','Hanoi','01:55','FUK','Fukuoka','07:35','5h 40m',2),
('f0000000-0000-0000-0000-000000000002','FUK 10:00 → HAN 12:55','VN357','Airbus A321','Toon 16A · Gus 16B · Pun 16C · Pae 16D','FUK','Fukuoka','10:00','HAN','Hanoi','12:55','2h 55m',1),
('f0000000-0000-0000-0000-000000000002','HAN 15:50 → BKK 17:55','VN619','Airbus A321','Toon 21A · Gus 21B · Pun 21C · Pae 21D','HAN','Hanoi','15:50','BKK','Bangkok','17:55','2h 05m',2);
