export interface MapLocation {
  name: string;
  nameJP?: string;
  lat: number;
  lng: number;
  day: number;
  emoji: string;
  type: "airport" | "temple" | "food" | "shopping" | "nature" | "station" | "hotel" | "attraction";
}

export const fukuokaLocations: MapLocation[] = [
  // Day 1
  { name: "Fukuoka Airport", nameJP: "福岡空港", lat: 33.5859, lng: 130.4511, day: 1, emoji: "✈️", type: "airport" },
  { name: "Hakata Station", nameJP: "博多駅", lat: 33.5897, lng: 130.4207, day: 1, emoji: "🚆", type: "station" },
  { name: "Tochoji Temple", nameJP: "東長寺", lat: 33.5932, lng: 130.4130, day: 1, emoji: "🛕", type: "temple" },
  { name: "Kushida Shrine", nameJP: "櫛田神社", lat: 33.5903, lng: 130.4098, day: 1, emoji: "⛩️", type: "temple" },
  { name: "Canal City Hakata", nameJP: "キャナルシティ博多", lat: 33.5895, lng: 130.4110, day: 1, emoji: "🛍️", type: "shopping" },
  { name: "Tenjin Area", nameJP: "天神", lat: 33.5917, lng: 130.3986, day: 1, emoji: "🏙️", type: "shopping" },

  // Day 2
  { name: "One's Hotel Fukuoka", lat: 33.5890, lng: 130.4025, day: 2, emoji: "🏨", type: "hotel" },
  { name: "Nanzoin Temple", nameJP: "南蔵院", lat: 33.6244, lng: 130.5658, day: 2, emoji: "🛕", type: "temple" },
  { name: "Yatai Stalls", nameJP: "屋台", lat: 33.5940, lng: 130.4010, day: 2, emoji: "🍜", type: "food" },

  // Day 3
  { name: "Dazaifu Tenmangu", nameJP: "太宰府天満宮", lat: 33.5194, lng: 130.5350, day: 3, emoji: "⛩️", type: "temple" },

  // Day 4
  { name: "Yufuin", nameJP: "由布院", lat: 33.2674, lng: 131.3688, day: 4, emoji: "♨️", type: "nature" },
  { name: "Kinrin Lake", nameJP: "金鱗湖", lat: 33.2620, lng: 131.3767, day: 4, emoji: "🏞️", type: "nature" },

  // Day 5
  { name: "Mt. Aso", nameJP: "阿蘇山", lat: 32.8842, lng: 131.1040, day: 5, emoji: "🌋", type: "nature" },
  { name: "Kumamoto Station", nameJP: "熊本駅", lat: 32.7898, lng: 130.6882, day: 5, emoji: "🚆", type: "station" },

  // Day 6
  { name: "Mojiko Retro", nameJP: "門司港レトロ", lat: 33.9461, lng: 130.9612, day: 6, emoji: "🏛️", type: "attraction" },
  { name: "Karato Fish Market", nameJP: "唐戸市場", lat: 33.9575, lng: 130.9442, day: 6, emoji: "🐟", type: "food" },
  { name: "Kumamoto Castle Area", nameJP: "熊本城", lat: 32.8063, lng: 130.7058, day: 6, emoji: "🏯", type: "attraction" },
];

export const dayRouteColors: Record<number, string> = {
  1: "#f87171",
  2: "#fb923c",
  3: "#fbbf24",
  4: "#34d399",
  5: "#22d3ee",
  6: "#818cf8",
  7: "#c084fc",
};
