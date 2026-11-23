/**
 * Navigation collections — groups of categories (not discounts or promotions).
 * Every one of the 27 categories belongs to exactly one collection.
 */
export interface Collection {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  art: string;
  tone: "navy" | "coral" | "light";
  categorySlugs: string[];
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "rider-safety-essentials",
    title: "Rider Safety Essentials",
    shortTitle: "Rider Safety",
    tagline: "Helmets, gloves, guards & visibility",
    description: "Gear that protects you on every ride — helmets, gloves, glasses, guards, lights, horns and rainwear.",
    art: "/art/helmet.svg",
    tone: "navy",
    categorySlugs: [
      "scooty-helmets",
      "riding-gloves",
      "riding-glasses",
      "knee-elbow-guards",
      "riding-raincoats",
      "scooty-led-lights",
      "scooty-horns",
      "scooty-dupatta-guards",
    ],
  },
  {
    slug: "everyday-scooty-accessories",
    title: "Everyday Scooty Accessories",
    shortTitle: "Everyday Accessories",
    tagline: "Comfort, storage & on-the-go essentials",
    description: "Accessories that make daily commuting easier — phone holders, storage, comfort upgrades and roadside essentials.",
    art: "/art/phone-holder.svg",
    tone: "coral",
    categorySlugs: [
      "scooty-mobile-holders",
      "scooty-baskets",
      "scooty-storage-boxes",
      "scooty-side-bags",
      "scooty-seat-covers",
      "scooty-backrests",
      "scooty-footrests",
      "scooty-handlebar-grips",
      "scooty-mirrors",
      "scooty-stickers-decals",
      "helmet-bluetooth-intercoms",
      "portable-tyre-inflators",
      "tyre-puncture-repair-kits",
      "scooty-battery-voltage-meters",
    ],
  },
  {
    slug: "scooty-security-protection",
    title: "Scooty Security & Protection",
    shortTitle: "Security & Protection",
    tagline: "Locks, trackers, covers & more",
    description: "Protect your scooty when it's parked and on the road — disc locks, GPS trackers, covers, windshields and stand pads.",
    art: "/art/disc-lock.svg",
    tone: "light",
    categorySlugs: ["anti-theft-disc-locks", "gps-trackers", "scooty-covers", "scooty-windshields", "scooty-parking-side-stand-pads"],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function collectionForCategory(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.categorySlugs.includes(slug));
}

/** Original ScootyKit illustrations (public/art) used when a category has no uploaded image. */
export const CATEGORY_ART: Record<string, string> = {
  "scooty-helmets": "/art/helmet.svg",
  "riding-gloves": "/art/gloves.svg",
  "riding-glasses": "/art/glasses.svg",
  "scooty-covers": "/art/cover.svg",
  "scooty-mirrors": "/art/mirror.svg",
  "scooty-mobile-holders": "/art/phone-holder.svg",
  "gps-trackers": "/art/gps-tracker.svg",
  "anti-theft-disc-locks": "/art/disc-lock.svg",
  "scooty-baskets": "/art/basket.svg",
  "scooty-storage-boxes": "/art/storage-box.svg",
  "riding-raincoats": "/art/raincoat.svg",
  "scooty-led-lights": "/art/led-light.svg",
  "portable-tyre-inflators": "/art/tyre-inflator.svg",
  "scooty-side-bags": "/art/side-bag.svg",
  "helmet-bluetooth-intercoms": "/art/intercom.svg",
};
