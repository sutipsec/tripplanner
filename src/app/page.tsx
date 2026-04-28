"use client";

import Image from "next/image";
import { useState } from "react";
import {
  LayoutDashboard,
  Map,
  CalendarDays,
  Plane,
  Wallet,
  CheckSquare,
  Calendar,
  ListChecks,
  CreditCard,
  Building2,
  Utensils,
  Train,
  Ticket,
  BookOpen,
  Shield,
  Wifi,
  Banknote,
  Bus,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  type TopSection =
    | "dashboard"
    | "map"
    | "trip-detail"
    | "flights"
    | "budget"
    | "checklist";

  const trip = {
    name: "Japan Family Trip 2026",
    dates: "7 - 13 ธันวาคม 2569",
    members: ["Toon", "Gus", "Pun", "Pae"],
    budget: 96000,
    spent: 62000,
  };

  const itinerary = [
    {
      day: "Day 1",
      date: "7 Dec 2026",
      title: "Arrival + Hakata + Shrine Walk",
      emoji: "🛬",
      entries: [
        { time: "07:35", detail: "ถึง Fukuoka Airport (FUK) จากไฟลต์ VN356" },
        { time: "08:10", detail: "นั่ง Airport Bus เข้า Hakata และฝากกระเป๋า" },
        { time: "09:30", detail: "Exchange JR Pass และจัดการตั๋วเดินทางหลัก" },
        { time: "11:00", detail: "แวะ Tochoji Temple และ Kushida Shrine" },
        { time: "13:00", detail: "มื้อกลางวันย่าน Hakata" },
        { time: "16:30", detail: "เดินเล่น Canal City" },
        { time: "19:00", detail: "มื้อเย็นย่าน Tenjin แล้วกลับที่พัก" },
      ],
    },
    {
      day: "Day 2",
      date: "8 Dec 2026",
      title: "Move Hotel + Nanzoin",
      emoji: "🛕",
      entries: [
        { time: "09:30", detail: "เช็กเอาต์โรงแรมเดิมและย้ายไป One's Hotel Fukuoka" },
        { time: "11:00", detail: "Airport Line ไป Hakata แล้วต่อรถไฟไป Nanzoin" },
        { time: "12:30", detail: "เที่ยว Nanzoin Temple (พระนอน)" },
        { time: "15:30", detail: "กลับเข้าเมือง แวะช้อปปิงเบาๆ" },
        { time: "18:30", detail: "Ichiran ramen" },
        { time: "20:00", detail: "เดินเล่นย่าน Yatai แล้วกลับที่พัก" },
      ],
    },
    {
      day: "Day 3",
      date: "9 Dec 2026",
      title: "Dazaifu Day Trip",
      emoji: "⛩️",
      entries: [
        { time: "08:00", detail: "ออกจากโรงแรมไป Hakata Bus Center" },
        { time: "09:00", detail: "นั่งบัสไป Dazaifu" },
        { time: "10:00", detail: "เดินถนนคนเดิน + Dazaifu Tenmangu" },
        { time: "12:30", detail: "มื้อกลางวันแถว Dazaifu" },
        { time: "15:30", detail: "ขึ้นบัสกลับ Fukuoka" },
        { time: "18:00", detail: "Canal City และมื้อเย็นย่าน Tenjin" },
      ],
    },
    {
      day: "Day 4",
      date: "10 Dec 2026",
      title: "Yufuin + Kinrin Lake",
      emoji: "🌸",
      entries: [
        { time: "07:30", detail: "ออกจากที่พักไป Hakata Station" },
        { time: "09:17", detail: "รถไฟ Yufuin No Mori ออกจาก Hakata" },
        { time: "11:31", detail: "ถึง Yufuin และเริ่มเดินเที่ยวเมือง" },
        { time: "13:00", detail: "เที่ยว Yufuin Floral Village" },
        { time: "15:00", detail: "แวะ Kinrin Lake + Yunotsubo Street" },
        { time: "17:17", detail: "ขึ้นรถไฟกลับ Fukuoka" },
        { time: "19:28", detail: "ถึง Hakata และกลับโรงแรม" },
      ],
    },
    {
      day: "Day 5",
      date: "11 Dec 2026",
      title: "Aso Day Trip",
      emoji: "🌋",
      entries: [
        { time: "08:00", detail: "ออกจากที่พักและนั่ง Shinkansen ไป Kumamoto" },
        { time: "09:30", detail: "ต่อรถไฟ/บัสไป Aso" },
        { time: "11:30", detail: "ถึง Aso และขึ้นรถบัสไปจุดชมวิว Aso San" },
        { time: "13:00", detail: "เที่ยวโซนภูเขาไฟ (ขึ้นกับสภาพอากาศ)" },
        { time: "16:00", detail: "เดินทางกลับ Kumamoto และต่อกลับ Hakata" },
        { time: "20:00", detail: "ถึง Hakata และพักผ่อน" },
      ],
    },
    {
      day: "Day 6",
      date: "12 Dec 2026",
      title: "Mojiko + Karato + Kumamoto",
      emoji: "🐡",
      entries: [
        { time: "07:00", detail: "ออกจากโรงแรมไป Hakata Station" },
        { time: "07:20", detail: "นั่งรถไฟไป Mojiko" },
        { time: "09:30", detail: "ข้ามไป Karato Fish Market เดินเล่นและกินซูชิ" },
        { time: "12:30", detail: "เดินทางกลับฝั่ง Mojiko" },
        { time: "13:30", detail: "ขึ้น Shinkansen ไป Kumamoto" },
        { time: "16:00", detail: "เดินเล่น Josaien / Shimotori Shopping Arcade" },
        { time: "20:00", detail: "กลับที่พัก" },
      ],
    },
    {
      day: "Day 7",
      date: "13 Dec 2026",
      title: "Airport + Fly Home",
      emoji: "🛫",
      entries: [
        { time: "05:30", detail: "เช็กเอาต์และเดินทางไปสนามบิน Fukuoka" },
        { time: "10:00", detail: "ไฟลต์ VN357: FUK → HAN" },
        { time: "12:55", detail: "ถึง Hanoi และรอทรานซิต" },
        { time: "15:50", detail: "ไฟลต์ VN619: HAN → BKK" },
        { time: "17:55", detail: "ถึงกรุงเทพฯ และเดินทางกลับบ้าน" },
      ],
    },
  ];

  const expenses = [
    { category: "Flight", estimate: 62000, actual: 62000 },
    { category: "Hotel", estimate: 15000, actual: 0 },
    { category: "Food & Dining", estimate: 8000, actual: 0 },
    { category: "Transport (JR Pass etc.)", estimate: 6000, actual: 0 },
    { category: "Activities", estimate: 5000, actual: 0 },
  ];

  const expenseIcons: Record<string, React.ReactNode> = {
    Flight: <Plane size={14} />,
    Hotel: <Building2 size={14} />,
    "Food & Dining": <Utensils size={14} />,
    "Transport (JR Pass etc.)": <Train size={14} />,
    Activities: <Ticket size={14} />,
  };

  const [checklist, setChecklist] = useState([
    { label: "Passport", done: true },
    { label: "JR Pass booking", done: true },
    { label: "Travel insurance", done: false },
    { label: "Universal Studios tickets", done: false },
    { label: "Hotel booking", done: false },
    { label: "Airport bus / transport plan", done: false },
    { label: "Pocket WiFi / SIM card", done: false },
    { label: "Currency exchange (JPY)", done: false },
  ]);

  const checklistIcons: Record<string, React.ReactNode> = {
    Passport: <BookOpen size={14} />,
    "JR Pass booking": <Train size={14} />,
    "Travel insurance": <Shield size={14} />,
    "Universal Studios tickets": <Ticket size={14} />,
    "Hotel booking": <Building2 size={14} />,
    "Airport bus / transport plan": <Bus size={14} />,
    "Pocket WiFi / SIM card": <Wifi size={14} />,
    "Currency exchange (JPY)": <Banknote size={14} />,
  };

  const progress = Math.round((trip.spent / trip.budget) * 100);
  const [mapView, setMapView] = useState<"outbound" | "inbound" | "city">("outbound");
  const [activeSection, setActiveSection] = useState<TopSection>("dashboard");

  const bookedFlights = [
    {
      direction: "Bangkok to Fukuoka",
      routeCode: "BKK → FUK",
      departLabel: "Sat 6 Dec 2026",
      arriveLabel: "Sun 7 Dec 2026",
      duration: "7h 25m",
      transit: "Transit at Hanoi (HAN) 1h 50m",
      layoverDuration: "1h 50m",
      bookingRef: "PNR: VN8FUK26",
      segments: [
        {
          route: "BKK 22:10 → HAN 00:05 (+1)",
          flightNo: "VN616",
          aircraft: "Airbus A321",
          seat: "Toon 24A · Gus 24B · Pun 24C · Pae 24D",
          from: { code: "BKK", city: "Bangkok", time: "22:10" },
          to: { code: "HAN", city: "Hanoi", time: "00:05" },
          duration: "3h 55m",
        },
        {
          route: "HAN 01:55 → FUK 07:35",
          flightNo: "VN356",
          aircraft: "Airbus A321",
          seat: "Toon 18A · Gus 18B · Pun 18C · Pae 18D",
          from: { code: "HAN", city: "Hanoi", time: "01:55" },
          to: { code: "FUK", city: "Fukuoka", time: "07:35" },
          duration: "5h 40m",
        },
      ],
      flow: ["Thailand", "Hanoi", "Fukuoka"],
    },
    {
      direction: "Fukuoka to Bangkok",
      routeCode: "FUK → BKK",
      departLabel: "Mon 14 Dec 2026",
      arriveLabel: "Mon 14 Dec 2026",
      duration: "9h 55m",
      transit: "Transit at Hanoi (HAN) 2h 55m",
      layoverDuration: "2h 55m",
      bookingRef: "PNR: VN8BKK26",
      segments: [
        {
          route: "FUK 10:00 → HAN 12:55",
          flightNo: "VN357",
          aircraft: "Airbus A321",
          seat: "Toon 16A · Gus 16B · Pun 16C · Pae 16D",
          from: { code: "FUK", city: "Fukuoka", time: "10:00" },
          to: { code: "HAN", city: "Hanoi", time: "12:55" },
          duration: "2h 55m",
        },
        {
          route: "HAN 15:50 → BKK 17:55",
          flightNo: "VN619",
          aircraft: "Airbus A321",
          seat: "Toon 21A · Gus 21B · Pun 21C · Pae 21D",
          from: { code: "HAN", city: "Hanoi", time: "15:50" },
          to: { code: "BKK", city: "Bangkok", time: "17:55" },
          duration: "2h 05m",
        },
      ],
      flow: ["Fukuoka", "Hanoi", "Thailand"],
    },
  ];

  const outboundFlight = bookedFlights[0];
  const inboundFlight = bookedFlights[1];

  const tabs: { id: TopSection; label: string; Icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { id: "map", label: "Map", Icon: Map },
    { id: "trip-detail", label: "Trip Detail", Icon: CalendarDays },
    { id: "flights", label: "Flights", Icon: Plane },
    { id: "budget", label: "Budget", Icon: Wallet },
    { id: "checklist", label: "Checklist", Icon: CheckSquare },
  ];

  const dayColors = [
    "from-rose-500 to-pink-500",
    "from-orange-500 to-amber-400",
    "from-amber-500 to-yellow-400",
    "from-emerald-500 to-teal-400",
    "from-teal-500 to-cyan-400",
    "from-sky-500 to-blue-400",
    "from-indigo-500 to-violet-400",
  ];

  const memberColors = ["bg-rose-500", "bg-violet-500", "bg-sky-500", "bg-emerald-500"];

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8 md:px-6">

        {/* ─── HEADER ─── */}
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 p-6 shadow-xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.18),transparent_55%)]" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-300/80">
                Family Trip Planner
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                {trip.name}
              </h1>
              <p className="mt-1.5 text-sm text-slate-400">{trip.dates} &nbsp;·&nbsp; 7 วัน</p>
            </div>
            <button className="self-start rounded-xl border border-white/10 bg-white/8 px-5 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-sm transition hover:bg-white/15">
              Share Trip
            </button>
          </div>
          <div className="relative mt-4 flex flex-wrap gap-2">
            {trip.members.map((member, i) => (
              <div
                key={member}
                className="flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 ring-1 ring-white/10"
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${memberColors[i % memberColors.length]}`}
                >
                  {member[0]}
                </span>
                <span className="text-sm font-medium text-white/85">{member}</span>
              </div>
            ))}
          </div>
        </header>

        {/* ─── NAV ─── */}
        <nav className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <div className="flex flex-wrap gap-1">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${
                  activeSection === id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </nav>

        {/* ─── DASHBOARD ─── */}
        {activeSection === "dashboard" && (
          <section className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  Icon: Calendar,
                  label: "Trip Days",
                  value: "7",
                  sub: "Dec 7 – 13",
                  color: "text-indigo-500",
                  bg: "bg-indigo-50",
                },
                {
                  Icon: ListChecks,
                  label: "Activities",
                  value: String(itinerary.reduce((s, d) => s + d.entries.length, 0)),
                  sub: "Planned",
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
                {
                  Icon: CreditCard,
                  label: "Budget Paid",
                  value: `${progress}%`,
                  sub: `${trip.spent.toLocaleString()} THB`,
                  color: "text-sky-600",
                  bg: "bg-sky-50",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                    <div className={`rounded-lg p-1.5 ${stat.bg}`}>
                      <stat.Icon size={14} className={stat.color} />
                    </div>
                  </div>
                  <p className="mt-2.5 text-3xl font-bold text-slate-800">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{stat.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-3 md:col-span-2">
                <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-sky-50/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                    Next Up
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    Fly from Thailand to Fukuoka
                  </p>
                  <p className="text-sm text-slate-500">
                    Hakata, Canal City & Kushida Shrine
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <Plane size={14} className="text-slate-500" />
                    <p className="text-sm font-semibold text-slate-700">Flight Snapshot</p>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-800">{outboundFlight.direction}</p>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {outboundFlight.departLabel} → {outboundFlight.arriveLabel}
                      </p>
                      <p className="text-xs text-slate-400">{outboundFlight.transit}</p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {outboundFlight.duration}
                    </span>
                  </div>
                  <div className="mt-3 border-t border-dashed border-slate-100 pt-3">
                    <p className="text-xs text-slate-400">
                      Return: {inboundFlight.departLabel} → {inboundFlight.arriveLabel}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSection("flights")}
                    className="mt-3 flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                  >
                    Open boarding pass
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                <p className="mb-3 text-sm font-semibold text-slate-700">Quick Access</p>
                <div className="space-y-1.5">
                  {(
                    [
                      { id: "map", label: "Map", Icon: Map },
                      { id: "trip-detail", label: "Trip Detail", Icon: CalendarDays },
                      { id: "budget", label: "Budget", Icon: Wallet },
                      { id: "flights", label: "Flights", Icon: Plane },
                      { id: "checklist", label: "Checklist", Icon: CheckSquare },
                    ] as { id: TopSection; label: string; Icon: React.ElementType }[]
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSection(item.id)}
                      className="flex w-full items-center gap-2.5 rounded-lg border border-slate-100 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <item.Icon size={14} className="text-slate-400" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── TRIP DETAIL ─── */}
        {activeSection === "trip-detail" && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Trip Timeline</h2>
                <p className="text-sm text-slate-500">{trip.dates} · 7 วัน</p>
              </div>
              <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50">
                + Add Activity
              </button>
            </div>
            <div className="space-y-3">
              {itinerary.map((day, dayIndex) => (
                <div
                  key={day.day}
                  className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm"
                >
                  <div
                    className={`bg-gradient-to-r ${dayColors[dayIndex % dayColors.length]} px-5 py-3.5`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl leading-none">{day.emoji}</span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                          {day.day} · {day.date}
                        </p>
                        <p className="font-bold text-white">{day.title}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="ml-1 space-y-1 border-l-2 border-slate-100 pl-4">
                      {day.entries.map((entry) => (
                        <div
                          key={`${day.day}-${entry.time}`}
                          className="group flex items-start gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-50"
                        >
                          <div className="mt-0.5 flex shrink-0 items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 group-hover:bg-white">
                            <Clock size={10} className="text-slate-400" />
                            <span className="font-mono text-[10px] font-semibold text-slate-500">
                              {entry.time}
                            </span>
                          </div>
                          <span className="text-sm leading-relaxed text-slate-700">
                            {entry.detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── MAP ─── */}
        {activeSection === "map" && (
          <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">เส้นทางการเดินทาง</h2>
                <p className="text-sm text-slate-500">รายละเอียดเที่ยวบินและแผนที่เมือง</p>
              </div>
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                {(["outbound", "inbound", "city"] as const).map((view) => {
                  const labels = {
                    outbound: "Outbound",
                    inbound: "Return",
                    city: "Fukuoka City",
                  };
                  return (
                    <button
                      key={view}
                      type="button"
                      onClick={() => setMapView(view)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                        mapView === view
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {labels[view]}
                    </button>
                  );
                })}
              </div>
            </div>

            {mapView === "city" ? (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <iframe
                  title="Fukuoka City Map"
                  src="https://www.google.com/maps?q=Fukuoka+Japan&output=embed"
                  className="h-[450px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="space-y-3">
                {/* Journey header */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-5 shadow-lg">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.2),transparent_60%)]" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">
                        {mapView === "outbound" ? "Outbound Flight" : "Return Flight"}
                      </p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {(mapView === "outbound" ? outboundFlight : inboundFlight).direction}
                      </p>
                      <p className="text-sm text-slate-400">
                        {(mapView === "outbound" ? outboundFlight : inboundFlight).departLabel}
                        {" → "}
                        {(mapView === "outbound" ? outboundFlight : inboundFlight).arriveLabel}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500">
                        Total
                      </p>
                      <p className="text-2xl font-black text-sky-300">
                        {(mapView === "outbound" ? outboundFlight : inboundFlight).duration}
                      </p>
                      <span className="mt-1 inline-block rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-400 ring-1 ring-white/10">
                        {(mapView === "outbound" ? outboundFlight : inboundFlight).bookingRef}
                      </span>
                    </div>
                  </div>
                  <div className="relative mt-5 flex items-center">
                    {(mapView === "outbound" ? outboundFlight : inboundFlight).flow.map(
                      (city, i, arr) => (
                        <div key={`flow-${i}`} className="contents">
                          {i > 0 && (
                            <div className="flex flex-1 items-center px-2">
                              <div className="h-px flex-1 border-t border-dashed border-slate-600" />
                              <Plane size={12} className="mx-1.5 text-sky-400" />
                              <div className="h-px flex-1 border-t border-dashed border-slate-600" />
                            </div>
                          )}
                          <div className="text-center">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                              {i === 0 ? "FROM" : i === arr.length - 1 ? "TO" : "VIA"}
                            </p>
                            <p className="mt-0.5 text-sm font-bold text-white">{city}</p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Segment cards */}
                {(mapView === "outbound" ? outboundFlight : inboundFlight).segments.map(
                  (seg, i) => (
                    <div key={seg.flightNo}>
                      {i > 0 && (
                        <div className="flex items-center gap-3 py-2">
                          <div className="flex-1 border-t border-dashed border-amber-200" />
                          <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                            <Clock size={11} />
                            Transit Hanoi ·{" "}
                            {
                              (mapView === "outbound" ? outboundFlight : inboundFlight)
                                .layoverDuration
                            }
                          </div>
                          <div className="flex-1 border-t border-dashed border-amber-200" />
                        </div>
                      )}
                      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Segment {i + 1}
                          </span>
                          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-600">
                            {seg.flightNo}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 md:gap-6">
                          <div className="min-w-0">
                            <p className="text-4xl font-black tracking-tight text-slate-800">
                              {seg.from.code}
                            </p>
                            <p className="mt-0.5 text-sm text-slate-500">{seg.from.city}</p>
                            <p className="mt-2 text-2xl font-bold tabular-nums text-slate-700">
                              {seg.from.time}
                            </p>
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                            <span className="text-xs font-bold text-sky-500">{seg.duration}</span>
                            <div className="flex w-full items-center">
                              <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-slate-100" />
                              <div className="mx-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 shadow-md">
                                <Plane size={14} className="text-white" />
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-l from-slate-200 to-slate-100" />
                            </div>
                            <span className="text-xs text-slate-400">{seg.aircraft}</span>
                          </div>
                          <div className="min-w-0 text-right">
                            <p className="text-4xl font-black tracking-tight text-slate-800">
                              {seg.to.code}
                            </p>
                            <p className="mt-0.5 text-sm text-slate-500">{seg.to.city}</p>
                            <p className="mt-2 text-2xl font-bold tabular-nums text-slate-700">
                              {seg.to.time}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs">
                          <span className="text-slate-400">Seats:</span>
                          <span className="font-semibold text-slate-700">{seg.seat}</span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        )}

        {/* ─── FLIGHTS ─── */}
        {activeSection === "flights" && (
          <section className="space-y-4">
            {bookedFlights.map((flight) => (
              <article
                key={flight.direction}
                className="overflow-hidden rounded-xl border border-[#1f4f82]/20 bg-[#f7fbff] shadow-md"
              >
                <div className="bg-gradient-to-r from-[#1f4f82] to-[#2c6aa6] px-5 py-4 text-white">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="overflow-hidden rounded-lg border border-white/20 bg-[#1a437a]">
                        <Image
                          src="/vietnam-airlines-logo.png"
                          alt="Vietnam Airlines"
                          width={102}
                          height={56}
                          className="h-8 w-auto object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#f3c252]">
                          Vietnam Airlines
                        </p>
                        <p className="text-base font-bold text-white">{flight.routeCode}</p>
                      </div>
                    </div>
                    <div className="rounded-full bg-[#f3c252] px-3 py-1 text-xs font-bold text-[#1f4f82]">
                      {flight.bookingRef}
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-[#123a66]">{flight.direction}</h2>
                      <p className="text-sm text-slate-600">
                        {flight.departLabel} → {flight.arriveLabel} ({flight.duration})
                      </p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#e8f1fb] px-3 py-1 text-xs font-medium text-[#1f4f82]">
                      <Clock size={11} />
                      {flight.transit}
                    </span>
                  </div>

                  <div className="mt-4 border-t border-dashed border-[#b8cee6] pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#2c6aa6]">
                      Boarding pass segments
                    </p>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {flight.segments.map((segment, index) => (
                      <div
                        key={segment.flightNo}
                        className="rounded-xl border border-[#cfe0f3] bg-white p-4"
                      >
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#2c6aa6]">
                          Segment {index + 1}
                        </p>
                        <p className="mt-1 text-base font-bold text-[#123a66]">
                          {segment.route}
                        </p>
                        <div className="mt-2 space-y-1 text-sm text-slate-600">
                          <p>
                            Flight:{" "}
                            <span className="font-bold text-[#1f4f82]">{segment.flightNo}</span>
                          </p>
                          <p className="text-slate-400">{segment.aircraft}</p>
                          <p className="rounded-lg bg-[#eef5fc] px-2 py-1.5 text-xs text-[#123a66]">
                            {segment.seat}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl bg-[#eef5fc] p-4">
                    <p className="mb-2 text-xs font-semibold text-[#123a66]">Flight Flow</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-[#1f4f82]">
                      {flight.flow.map((point, pointIndex) => (
                        <div key={`${flight.direction}-${point}`} className="contents">
                          {pointIndex > 0 && (
                            <ArrowRight size={12} className="text-slate-400" />
                          )}
                          <span className="rounded-lg bg-white px-2.5 py-1 text-xs shadow-sm ring-1 ring-[#d5e4f4]">
                            {pointIndex === 1 ? `Transit: ${point}` : point}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* ─── BUDGET ─── */}
        {activeSection === "budget" && (
          <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-800">Budget</h2>
              <p className="text-sm text-slate-500">ค่าใช้จ่ายตลอดทริป</p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                {
                  label: "Total Budget",
                  value: trip.budget.toLocaleString(),
                  color: "text-slate-800",
                  Icon: Wallet,
                  iconColor: "text-slate-400",
                  bg: "bg-slate-50",
                },
                {
                  label: "Paid So Far",
                  value: trip.spent.toLocaleString(),
                  color: "text-emerald-600",
                  Icon: CreditCard,
                  iconColor: "text-emerald-500",
                  bg: "bg-emerald-50",
                },
                {
                  label: "Remaining",
                  value: (trip.budget - trip.spent).toLocaleString(),
                  color: "text-sky-600",
                  Icon: Banknote,
                  iconColor: "text-sky-500",
                  bg: "bg-sky-50",
                },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-500">{s.label}</p>
                    <div className={`rounded-lg p-1.5 ${s.bg}`}>
                      <s.Icon size={14} className={s.iconColor} />
                    </div>
                  </div>
                  <p className={`mt-2 text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-400">THB</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{progress}% paid</span>
                <span>
                  {trip.spent.toLocaleString()} / {trip.budget.toLocaleString()} THB
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Breakdown
              </p>
              {expenses.map((expense) => {
                const pct =
                  expense.estimate > 0
                    ? Math.round((expense.actual / expense.estimate) * 100)
                    : 0;
                return (
                  <div
                    key={expense.category}
                    className="rounded-xl border border-slate-100 px-4 py-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-sm">
                        <span className="text-slate-400">
                          {expenseIcons[expense.category]}
                        </span>
                        <span className="font-medium text-slate-700">{expense.category}</span>
                      </div>
                      <span className="text-sm text-slate-500">
                        {expense.actual.toLocaleString()} / {expense.estimate.toLocaleString()}{" "}
                        THB
                      </span>
                    </div>
                    <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          pct >= 100 ? "bg-red-400" : pct > 0 ? "bg-emerald-400" : "bg-slate-200"
                        }`}
                        style={{ width: pct > 0 ? `${Math.min(pct, 100)}%` : "4px" }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {pct > 0 ? `${pct}% paid` : "Not paid yet"}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── CHECKLIST ─── */}
        {activeSection === "checklist" && (
          <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Checklist</h2>
                <p className="text-sm text-slate-500">
                  {checklist.filter((i) => i.done).length} / {checklist.length} completed
                </p>
              </div>
            </div>
            <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                style={{
                  width: `${Math.round(
                    (checklist.filter((i) => i.done).length / checklist.length) * 100
                  )}%`,
                }}
              />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {checklist.map((item) => (
                <label
                  key={item.label}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                    item.done
                      ? "border-emerald-100 bg-emerald-50/70"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() =>
                      setChecklist((prev) =>
                        prev.map((c) =>
                          c.label === item.label ? { ...c, done: !c.done } : c
                        )
                      )
                    }
                    className="h-4 w-4 cursor-pointer rounded accent-emerald-500"
                  />
                  <span className="text-slate-400">
                    {checklistIcons[item.label]}
                  </span>
                  <span
                    className={
                      item.done
                        ? "text-slate-400 line-through"
                        : "font-medium text-slate-700"
                    }
                  >
                    {item.label}
                  </span>
                  {item.done && (
                    <span className="ml-auto text-xs font-bold text-emerald-500">✓</span>
                  )}
                </label>
              ))}
            </div>
          </section>
        )}

        <footer className="py-2 text-center text-xs text-slate-400">
          Frontend mock · No backend yet · Ready for Vercel
        </footer>
      </main>
    </div>
  );
}
