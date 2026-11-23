/** The 27 default categories (mirrors supabase/seed.sql). Used as a fallback when the
 *  database is unavailable, for menu grouping, and in preview demo mode. */
export interface StaticCategory {
  name: string;
  slug: string;
  description: string;
  icon: string;
  sort_order: number;
}

export const STATIC_CATEGORIES: StaticCategory[] = [
  { name: "Scooty Helmets", slug: "scooty-helmets", description: "Lightweight, comfortable helmets for daily scooty rides \u2014 half-face, open-face and full-face options for city commuting.", icon: "hard-hat", sort_order: 1 },
  { name: "Riding Gloves", slug: "riding-gloves", description: "Breathable riding gloves for better grip, sun protection and comfort on long commutes.", icon: "hand", sort_order: 2 },
  { name: "Riding Glasses", slug: "riding-glasses", description: "Riding glasses that shield your eyes from dust, wind and glare during the ride.", icon: "glasses", sort_order: 3 },
  { name: "Scooty Covers", slug: "scooty-covers", description: "Full-body covers to protect your scooty from sun, rain and dust when parked.", icon: "umbrella", sort_order: 4 },
  { name: "Scooty Seat Covers", slug: "scooty-seat-covers", description: "Seat covers that keep your seat cooler, cleaner and more comfortable.", icon: "armchair", sort_order: 5 },
  { name: "Scooty Mirrors", slug: "scooty-mirrors", description: "Replacement and upgrade side mirrors for clear rear visibility.", icon: "scan-eye", sort_order: 6 },
  { name: "Scooty Stickers & Decals", slug: "scooty-stickers-decals", description: "Stickers and decals to personalise your scooty's look.", icon: "sticker", sort_order: 7 },
  { name: "Scooty Mobile Holders", slug: "scooty-mobile-holders", description: "Secure handlebar phone mounts for navigation on the go.", icon: "smartphone", sort_order: 8 },
  { name: "GPS Trackers", slug: "gps-trackers", description: "GPS trackers to keep an eye on your scooty's location for extra peace of mind.", icon: "map-pin", sort_order: 9 },
  { name: "Anti-Theft Disc Locks", slug: "anti-theft-disc-locks", description: "Sturdy disc locks that make your parked scooty harder to steal.", icon: "lock", sort_order: 10 },
  { name: "Scooty Baskets", slug: "scooty-baskets", description: "Front and rear baskets for groceries, bags and everyday carry.", icon: "shopping-basket", sort_order: 11 },
  { name: "Scooty Storage Boxes", slug: "scooty-storage-boxes", description: "Lockable top boxes and storage cases for helmets and essentials.", icon: "package", sort_order: 12 },
  { name: "Riding Raincoats", slug: "riding-raincoats", description: "Rain suits and raincoats designed for riding through monsoon showers.", icon: "cloud-rain", sort_order: 13 },
  { name: "Knee & Elbow Guards", slug: "knee-elbow-guards", description: "Protective knee and elbow guards for safer riding.", icon: "shield", sort_order: 14 },
  { name: "Scooty LED Lights", slug: "scooty-led-lights", description: "LED lights for better visibility and a modern look.", icon: "lightbulb", sort_order: 15 },
  { name: "Scooty Horns", slug: "scooty-horns", description: "Clear, loud replacement horns for safer city riding.", icon: "megaphone", sort_order: 16 },
  { name: "Portable Tyre Inflators", slug: "portable-tyre-inflators", description: "Compact inflators to top up tyre pressure anywhere.", icon: "gauge", sort_order: 17 },
  { name: "Tyre Puncture Repair Kits", slug: "tyre-puncture-repair-kits", description: "Puncture repair kits so a flat tyre doesn't end your day.", icon: "wrench", sort_order: 18 },
  { name: "Scooty Handlebar Grips", slug: "scooty-handlebar-grips", description: "Comfortable, non-slip handlebar grips.", icon: "grip-horizontal", sort_order: 19 },
  { name: "Scooty Backrests", slug: "scooty-backrests", description: "Backrests for added pillion comfort and support.", icon: "armchair", sort_order: 20 },
  { name: "Scooty Footrests", slug: "scooty-footrests", description: "Footrests and foot pegs for comfortable riding posture.", icon: "footprints", sort_order: 21 },
  { name: "Scooty Side Bags", slug: "scooty-side-bags", description: "Side and saddle bags for extra carrying space.", icon: "briefcase", sort_order: 22 },
  { name: "Helmet Bluetooth Intercoms", slug: "helmet-bluetooth-intercoms", description: "Bluetooth intercoms for calls, music and navigation inside your helmet.", icon: "headphones", sort_order: 23 },
  { name: "Scooty Dupatta Guards", slug: "scooty-dupatta-guards", description: "Dupatta and saree guards that help keep loose clothing away from the rear wheel.", icon: "shield-check", sort_order: 24 },
  { name: "Scooty Windshields", slug: "scooty-windshields", description: "Windshields that cut wind and dust on the ride.", icon: "wind", sort_order: 25 },
  { name: "Scooty Battery Voltage Meters", slug: "scooty-battery-voltage-meters", description: "Voltage meters to monitor your electric scooty's battery health.", icon: "battery-charging", sort_order: 26 },
  { name: "Scooty Parking Side Stand Pads", slug: "scooty-parking-side-stand-pads", description: "Side stand pads that stop your scooty sinking into soft ground.", icon: "square-parking", sort_order: 27 },
];
