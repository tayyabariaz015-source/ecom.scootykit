/**
 * DESIGN-PREVIEW DEMO MODE
 * ------------------------------------------------------------------
 * Shows clearly-labelled SAMPLE products so the storefront design can be
 * reviewed before real inventory exists. Sample items are never written to
 * the database, can't be ordered, have no fake sales or reviews, and every
 * page shows a "Design preview" banner while this mode is on.
 *
 * Enabled only when NEXT_PUBLIC_DEMO_MODE=true AND the deployment is not a
 * Vercel production deployment. Never enable it on the live store.
 */
import { STATIC_CATEGORIES } from "@/lib/commerce/static-categories";
import { effectivePrice } from "@/lib/commerce/pricing";
import type { Category, Product, ProductSummary } from "@/types";

export function isDemoMode(): boolean {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") return false;
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.VERCEL_ENV;
  return vercelEnv !== "production";
}

interface DemoSeed {
  slug: string;
  name: string;
  category: string;
  price: number;
  sale?: number;
  stock: number;
  art: string;
  featured?: boolean;
  short: string;
  features: string[];
  specs: [string, string][];
}

const SEEDS: DemoSeed[] = [
  { slug: "demo-half-face-helmet", name: "Half-Face City Helmet", category: "scooty-helmets", price: 3800, stock: 12, art: "helmet", featured: true, short: "Lightweight open-face helmet with clear visor for daily commuting.", features: ["Clear flip-up visor", "Padded, removable liner", "Quick-release chin strap"], specs: [["Shell", "ABS"], ["Sizes", "M / L"], ["Weight", "≈ 900 g"]] },
  { slug: "demo-touchscreen-riding-gloves", name: "Touchscreen Riding Gloves", category: "riding-gloves", price: 1450, stock: 20, art: "gloves", featured: true, short: "Breathable full-finger gloves with touchscreen fingertips.", features: ["Touchscreen fingertips", "Anti-slip palm", "Velcro wrist strap"], specs: [["Material", "Mesh & synthetic leather"], ["Sizes", "M / L / XL"]] },
  { slug: "demo-anti-glare-riding-glasses", name: "Anti-Glare Riding Glasses", category: "riding-glasses", price: 1200, stock: 0, art: "glasses", short: "Wrap-around glasses that cut glare, wind and dust.", features: ["Wrap-around frame", "Anti-glare tinted lens"], specs: [["Lens", "Polycarbonate"]] },
  { slug: "demo-waterproof-scooty-cover", name: "Waterproof Scooty Body Cover", category: "scooty-covers", price: 2200, stock: 15, art: "cover", featured: true, short: "Full-body cover that protects your parked scooty from sun, rain and dust.", features: ["Water-resistant fabric", "Elastic hem", "Storage pouch included"], specs: [["Fit", "Most standard scooties"], ["Material", "Polyester, PU coated"]] },
  { slug: "demo-convex-side-mirror-pair", name: "Convex Side Mirror (Pair)", category: "scooty-mirrors", price: 1600, stock: 8, art: "mirror", short: "Wide-angle replacement mirrors for clearer rear visibility.", features: ["Wide-angle convex glass", "Adjustable ball joint"], specs: [["Thread", "8 mm / 10 mm adaptors"]] },
  { slug: "demo-handlebar-mobile-holder", name: "Handlebar Mobile Holder", category: "scooty-mobile-holders", price: 1350, sale: 1150, stock: 25, art: "phone-holder", featured: true, short: "Secure 360° phone mount for navigation on the go.", features: ["One-touch lock", "360° rotation", "Fits 4.7–6.8\" phones"], specs: [["Mount", "Handlebar clamp"], ["Material", "ABS & silicone"]] },
  { slug: "demo-mini-gps-tracker", name: "Mini GPS Tracker", category: "gps-trackers", price: 6500, stock: 6, art: "gps-tracker", featured: true, short: "Compact tracker to check your scooty's location from your phone.", features: ["Live location in app", "Geo-fence alerts", "Hidden mounting"], specs: [["Network", "2G/4G SIM (not included)"], ["Power", "12–72 V"]] },
  { slug: "demo-disc-brake-lock", name: "Anti-Theft Disc Brake Lock", category: "anti-theft-disc-locks", price: 2400, stock: 18, art: "disc-lock", featured: true, short: "Hardened disc lock that makes your parked scooty harder to steal.", features: ["Hardened steel shackle", "2 keys included", "Reminder cable"], specs: [["Pin", "6 mm"], ["Material", "Zinc alloy & steel"]] },
  { slug: "demo-front-wire-basket", name: "Front Wire Basket", category: "scooty-baskets", price: 1800, stock: 10, art: "basket", short: "Sturdy front basket for bags and groceries.", features: ["Rust-resistant coating", "Easy mounting"], specs: [["Capacity", "≈ 10 L"]] },
  { slug: "demo-top-storage-box", name: "Lockable Top Storage Box", category: "scooty-storage-boxes", price: 5200, stock: 4, art: "storage-box", short: "Lockable top box with space for a helmet and essentials.", features: ["Fits one half-face helmet", "Key lock", "Quick-release base"], specs: [["Capacity", "≈ 28 L"]] },
  { slug: "demo-two-piece-rain-suit", name: "Two-Piece Riding Rain Suit", category: "riding-raincoats", price: 2600, stock: 14, art: "raincoat", short: "Jacket and trousers designed for riding through monsoon showers.", features: ["Sealed seams", "Reflective strips", "Carry bag"], specs: [["Sizes", "L / XL / XXL"]] },
  { slug: "demo-led-spot-light", name: "LED Auxiliary Spot Light", category: "scooty-led-lights", price: 2900, stock: 3, art: "led-light", short: "Bright LED light for better night-time visibility.", features: ["High / low / flash modes", "Water-resistant housing"], specs: [["Voltage", "12–80 V DC"]] },
  { slug: "demo-portable-tyre-inflator", name: "Portable Digital Tyre Inflator", category: "portable-tyre-inflators", price: 7800, stock: 9, art: "tyre-inflator", featured: true, short: "Rechargeable inflator with digital pressure display.", features: ["Auto-stop at set pressure", "USB-C charging", "LED torch"], specs: [["Max pressure", "150 PSI"], ["Battery", "Rechargeable"]] },
  { slug: "demo-waterproof-side-bag", name: "Waterproof Side Bag", category: "scooty-side-bags", price: 3400, stock: 7, art: "side-bag", short: "Saddle-style side bag for extra carrying space.", features: ["Water-resistant", "Reflective trim"], specs: [["Capacity", "≈ 15 L"]] },
  { slug: "demo-helmet-bluetooth-intercom", name: "Helmet Bluetooth Intercom", category: "helmet-bluetooth-intercoms", price: 6900, stock: 5, art: "intercom", short: "Hands-free calls, music and navigation prompts inside your helmet.", features: ["Bluetooth calling", "Music & GPS prompts", "Rechargeable"], specs: [["Bluetooth", "5.x"]] },
];

const DEMO_DATE = "2026-11-01T00:00:00.000Z";

function idFor(i: number) {
  return `d0000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`;
}

export const DEMO_CATEGORIES: Category[] = STATIC_CATEGORIES.map((c, i) => ({
  id: `c0000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`,
  name: c.name,
  slug: c.slug,
  description: c.description,
  image_url: null,
  icon: c.icon,
  sort_order: c.sort_order,
  is_visible: true,
  seo_title: null,
  seo_description: null,
  product_count: SEEDS.filter((s) => s.category === c.slug).length,
}));

export const DEMO_PRODUCTS: Product[] = SEEDS.map((s, i) => {
  const cat = DEMO_CATEGORIES.find((c) => c.slug === s.category)!;
  const image = { id: `${idFor(i)}-img`, url: `/art/${s.art}.svg`, alt: `${s.name} (sample illustration)`, sort_order: 0 };
  return {
    id: idFor(i),
    name: s.name,
    slug: s.slug,
    price: s.price,
    sale_price: s.sale ?? null,
    stock: s.stock,
    is_featured: Boolean(s.featured),
    short_description: s.short,
    image,
    category: { id: cat.id, name: cat.name, slug: cat.slug },
    is_demo: true,
    sku: null,
    description: `${s.short}\n\nThis is a sample product shown only in design-preview mode. It is not real ScootyKit inventory and cannot be ordered.`,
    features: s.features,
    status: "active",
    low_stock_threshold: 5,
    images: [image],
    specifications: s.specs.map(([label, value], j) => ({ id: `${idFor(i)}-s${j}`, label, value, sort_order: j })),
    seo_title: null,
    seo_description: null,
    created_at: DEMO_DATE,
    updated_at: DEMO_DATE,
    // Newer items first in "newest" sort
    published_at: new Date(Date.parse(DEMO_DATE) + (SEEDS.length - i) * 3600_000).toISOString(),
  } as Product & { published_at: string };
});

export interface DemoQuery {
  q?: string;
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  availability?: "in_stock" | "out_of_stock";
  featured?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
}

export function queryDemoProducts(f: DemoQuery): ProductSummary[] {
  let list = [...DEMO_PRODUCTS];
  if (f.q) list = list.filter((p) => p.name.toLowerCase().includes(f.q!.toLowerCase()));
  if (f.categoryIds?.length) list = list.filter((p) => p.category && f.categoryIds!.includes(p.category.id));
  if (f.minPrice !== undefined) list = list.filter((p) => effectivePrice(p) >= f.minPrice!);
  if (f.maxPrice !== undefined) list = list.filter((p) => effectivePrice(p) <= f.maxPrice!);
  if (f.availability === "in_stock") list = list.filter((p) => p.stock > 0);
  if (f.availability === "out_of_stock") list = list.filter((p) => p.stock === 0);
  if (f.featured) list = list.filter((p) => p.is_featured);
  if (f.sort === "price_asc") list.sort((a, b) => effectivePrice(a) - effectivePrice(b));
  else if (f.sort === "price_desc") list.sort((a, b) => effectivePrice(b) - effectivePrice(a));
  // "popular" uses real sales only — sample items have none, so keep newest order.
  return list;
}
