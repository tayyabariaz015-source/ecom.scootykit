import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BadgeCheck, ChevronRight, PackageSearch, ShieldCheck, Star, Truck, Wallet } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { CategoryIcon } from "@/components/ui/category-icon";
import { ProductGrid } from "@/components/products/product-card";
import { CATEGORY_ART, COLLECTIONS, type Collection } from "@/lib/commerce/collections";
import { cn, formatDate } from "@/lib/utils";
import type { Category, ProductSummary, Review, StoreSettings } from "@/types";
import { HeroIllustration } from "./hero-illustration";

// ---------------------------------------------------------------------------
// Section title — »» accent, uppercase, divider line
// ---------------------------------------------------------------------------
export function SectionTitle({ title, href, linkLabel = "View all", children, className }: { title: string; href?: string; linkLabel?: string; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3", className)}>
      <h2 className="flex items-center gap-2.5 text-xl font-extrabold uppercase tracking-tight sm:text-2xl">
        <span aria-hidden="true" className="text-coral-500">
          ›››
        </span>
        {title}
      </h2>
      {children}
      {href && (
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-navy-800 hover:text-coral-600">
          {linkLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero row: category sidebar · main banner · two collection banners
// ---------------------------------------------------------------------------
const SIDEBAR_SLUGS = [
  "scooty-helmets",
  "riding-gloves",
  "anti-theft-disc-locks",
  "gps-trackers",
  "scooty-mobile-holders",
  "scooty-covers",
  "riding-raincoats",
  "scooty-led-lights",
  "scooty-storage-boxes",
  "portable-tyre-inflators",
];

function CategorySidebar({ categories }: { categories: Category[] }) {
  const items = SIDEBAR_SLUGS.map((s) => categories.find((c) => c.slug === s)).filter((c): c is Category => Boolean(c));
  return (
    <nav aria-label="Popular categories" className="hidden self-start overflow-hidden rounded-b-xl border border-t-0 border-line bg-white lg:block">
      <ul className="divide-y divide-line">
        {items.map((c) => (
          <li key={c.slug}>
            <Link href={`/category/${c.slug}`} className="group flex items-center gap-3 px-5 py-[11px] text-[14px] text-navy-800 transition-colors hover:bg-coral-50 hover:text-coral-700">
              <CategoryIcon name={c.icon} className="h-4.5 w-4.5 text-slate-400 group-hover:text-coral-600" />
              <span className="flex-1">{c.name}</span>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-coral-500" />
            </Link>
          </li>
        ))}
        <li>
          <Link href="/categories" className="flex items-center justify-between px-5 py-3 text-sm font-semibold text-coral-600 hover:bg-coral-50">
            View all {categories.length} categories <span aria-hidden="true">+</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function HeroBanner({ settings }: { settings: StoreSettings }) {
  return (
    <section className="relative isolate overflow-hidden rounded-xl bg-navy-900 lg:mt-4" aria-labelledby="hero-title">
      <div className="pointer-events-none absolute -right-24 top-1/2 -z-10 h-[460px] w-[460px] -translate-y-1/2 rounded-full bg-coral-500/20 blur-3xl" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "44px 44px" }}
        aria-hidden="true"
      />
      <div className="grid items-center gap-4 px-6 py-9 sm:px-10 md:grid-cols-[1fr_1.05fr] lg:min-h-[430px] lg:py-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral-500">Electric scooty accessories</p>
          <h1 id="hero-title" className="mt-3 text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.025em] text-white sm:text-[2.6rem] xl:text-[2.75rem]">
            Everything Your <span className="text-coral-500">Scooty</span> Needs.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300 sm:text-lg">Discover quality accessories designed for your ride.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/shop" size="lg">
              Shop Now <ArrowRight className="h-4.5 w-4.5" />
            </ButtonLink>
            <ButtonLink href="/categories" size="lg" variant="outline-light">
              Explore Categories
            </ButtonLink>
          </div>
          {settings.cod_enabled && (
            <p className="mt-6 flex items-center gap-2 text-sm text-slate-300">
              <Wallet className="h-4 w-4 text-coral-500" /> Cash on Delivery available
            </p>
          )}
        </div>
        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          {settings.hero_image_url ? (
            <div className="relative aspect-[10/8] overflow-hidden rounded-xl">
              <Image src={settings.hero_image_url} alt="Electric scooty with riding accessories" fill priority sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
            </div>
          ) : (
            <>
              <HeroIllustration className="h-auto w-full" />
              <ul className="mt-1 flex flex-wrap justify-center gap-2" aria-label="Popular accessories">
                {[
                  { slug: "scooty-helmets", label: "Helmets", art: "/art/helmet.svg" },
                  { slug: "anti-theft-disc-locks", label: "Disc locks", art: "/art/disc-lock.svg" },
                  { slug: "scooty-mobile-holders", label: "Phone holders", art: "/art/phone-holder.svg" },
                ].map((a) => (
                  <li key={a.slug}>
                    <Link href={`/category/${a.slug}`} className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3.5 text-[13px] font-semibold text-navy-900 shadow-lg transition-transform hover:-translate-y-0.5">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-surface">
                        <Image src={a.art} alt="" width={28} height={28} unoptimized className="h-6 w-6" />
                      </span>
                      {a.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function SideBanner({ collection, className }: { collection: Collection; className?: string }) {
  const dark = collection.tone !== "light";
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className={cn(
        "group relative flex min-h-[190px] flex-1 overflow-hidden rounded-xl p-5 transition-transform hover:-translate-y-0.5",
        collection.tone === "navy" && "bg-navy-800 text-white",
        collection.tone === "coral" && "bg-coral-500 text-white",
        collection.tone === "light" && "bg-surface text-navy-900 ring-1 ring-line",
        className,
      )}
    >
      <div className="relative z-10 flex max-w-[62%] flex-col">
        <p className={cn("text-[11px] font-bold uppercase tracking-[0.16em]", dark ? "text-white/70" : "text-coral-600")}>Collection</p>
        <h3 className={cn("mt-1.5 text-lg font-extrabold leading-tight", dark ? "text-white" : "")}>{collection.title}</h3>
        <p className={cn("mt-1.5 text-[13px]", dark ? "text-white/80" : "text-muted")}>{collection.tagline}</p>
        <span className={cn("mt-auto inline-flex items-center gap-1 pt-4 text-sm font-bold", dark ? "text-white" : "text-coral-600")}>
          Shop now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
      <span className={cn("absolute -bottom-6 -right-6 grid h-40 w-40 place-items-center rounded-full", dark ? "bg-white" : "bg-white ring-1 ring-line")}>
        <Image src={collection.art} alt="" width={120} height={120} unoptimized className="h-28 w-28 -translate-x-2 -translate-y-2 transition-transform duration-300 group-hover:scale-105" />
      </span>
    </Link>
  );
}

export function HeroRow({ settings, categories }: { settings: StoreSettings; categories: Category[] }) {
  const [safety, everyday, security] = COLLECTIONS;
  return (
    <div className="container-page grid gap-4 pb-2 lg:grid-cols-[220px_1fr] xl:grid-cols-[260px_1fr_300px]">
      <CategorySidebar categories={categories} />
      <HeroBanner settings={settings} />
      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3 xl:col-span-1 xl:mt-4 xl:flex xl:flex-col">
        <SideBanner collection={safety} />
        <SideBanner collection={security} />
        <SideBanner collection={everyday} className="hidden lg:flex xl:hidden" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Service strip (only true statements)
// ---------------------------------------------------------------------------
export function ServiceStrip({ settings }: { settings: StoreSettings }) {
  const items = [
    settings.cod_enabled
      ? { icon: Wallet, title: "Cash on Delivery", text: "Pay when your order arrives" }
      : { icon: Wallet, title: "Simple payment", text: "Clear options at checkout" },
    { icon: Truck, title: "Delivery charges upfront", text: "Shown before you place the order" },
    { icon: ShieldCheck, title: "Secure checkout", text: "Prices & stock verified on our server" },
    { icon: PackageSearch, title: "Track your order", text: "With your order number & phone" },
  ];
  return (
    <section aria-label="Why shop with us" className="container-page pt-6">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-center gap-3.5 rounded-xl border border-line bg-white p-3.5 sm:p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-coral-50 text-coral-600">
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-navy-900">{title}</span>
              <span className="block text-xs text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Category cards
// ---------------------------------------------------------------------------
export function CategoryCard({ category }: { category: Category }) {
  const art = category.image_url ?? CATEGORY_ART[category.slug];
  const count = category.product_count ?? 0;
  return (
    <Link href={`/category/${category.slug}`} className="group flex flex-col items-center rounded-xl border border-line bg-white px-2 pb-3.5 pt-4 text-center sm:px-3 sm:pb-4 sm:pt-5 transition-[border-color,box-shadow] hover:border-coral-200 hover:shadow-[var(--shadow-card)]">
      <span className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-surface transition-colors group-hover:bg-coral-50 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
        {art ? (
          <Image src={art} alt="" fill sizes="112px" unoptimized={art.endsWith(".svg")} className="object-contain p-3 transition-transform duration-300 group-hover:scale-110" />
        ) : (
          <CategoryIcon name={category.icon} className="h-7 w-7 text-navy-700 sm:h-10 sm:w-10 transition-colors group-hover:text-coral-600" />
        )}
      </span>
      <span className="mt-2.5 line-clamp-2 min-h-[2.5em] text-[12px] font-semibold leading-tight text-navy-900 group-hover:text-coral-600 sm:mt-3 sm:text-[13.5px]">{category.name}</span>
      <span className="mt-1 text-xs text-muted">
        {count} {count === 1 ? "item" : "items"}
      </span>
    </Link>
  );
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3 md:grid-cols-4 lg:grid-cols-6">
      {categories.map((c) => (
        <CategoryCard key={c.slug} category={c} />
      ))}
    </div>
  );
}

const SHOWCASE_SLUGS = [
  "scooty-helmets",
  "riding-gloves",
  "anti-theft-disc-locks",
  "scooty-mobile-holders",
  "gps-trackers",
  "scooty-covers",
  "riding-raincoats",
  "scooty-led-lights",
  "scooty-storage-boxes",
  "scooty-side-bags",
  "portable-tyre-inflators",
  "helmet-bluetooth-intercoms",
];

export function ShopByCategory({ categories }: { categories: Category[] }) {
  const items = SHOWCASE_SLUGS.map((s) => categories.find((c) => c.slug === s)).filter((c): c is Category => Boolean(c));
  if (items.length === 0) return null;
  return (
    <section className="container-page pt-14">
      <SectionTitle title="Shop by category" href="/categories" linkLabel={`All ${categories.length} categories`} />
      <CategoryGrid categories={items} />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Collection banners (navigation collections — not discounts)
// ---------------------------------------------------------------------------
export function CollectionBanners({ categories }: { categories: Category[] }) {
  return (
    <section className="container-page pt-14" aria-label="Shop by collection">
      <div className="grid gap-4 md:grid-cols-3">
        {COLLECTIONS.map((col) => {
          const count = col.categorySlugs.filter((s) => categories.some((c) => c.slug === s)).length;
          return (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className={cn(
                "group relative flex min-h-[210px] overflow-hidden rounded-xl p-6 transition-transform hover:-translate-y-0.5",
                col.tone === "navy" && "bg-navy-900 text-white",
                col.tone === "coral" && "bg-coral-500 text-white",
                col.tone === "light" && "bg-surface ring-1 ring-line",
              )}
            >
              <div className="relative z-10 flex max-w-[58%] flex-col">
                <p className={cn("text-[11px] font-bold uppercase tracking-[0.16em]", col.tone === "light" ? "text-coral-600" : "text-white/70")}>{count} categories</p>
                <h3 className={cn("mt-2 text-xl font-extrabold leading-tight", col.tone === "light" ? "text-navy-900" : "text-white")}>{col.title}</h3>
                <p className={cn("mt-2 text-sm", col.tone === "light" ? "text-muted" : "text-white/80")}>{col.tagline}</p>
                <span
                  className={cn(
                    "mt-auto inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide",
                    col.tone === "light" ? "bg-navy-900 text-white" : "bg-white text-navy-900",
                  )}
                >
                  Shop collection <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <span className="absolute -bottom-6 -right-6 grid h-40 w-40 place-items-center rounded-full bg-white ring-1 ring-line">
                <Image src={col.art} alt="" width={120} height={120} unoptimized className="h-24 w-24 -translate-x-2 -translate-y-2 transition-transform duration-300 group-hover:scale-105" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Product sections
// ---------------------------------------------------------------------------
export function ProductSection({
  title,
  href,
  products,
  empty,
  tone,
}: {
  title: string;
  href: string;
  products: ProductSummary[];
  empty?: { title: string; text: string };
  tone?: "surface";
}) {
  if (products.length === 0 && !empty) return null;
  return (
    <section className={tone === "surface" ? "mt-14 bg-surface py-12" : "container-page pt-14"}>
      <div className={tone === "surface" ? "container-page" : undefined}>
        <SectionTitle title={title} href={products.length > 0 ? href : undefined} />
        {products.length > 0 ? (
          <ProductGrid products={products.length >= 5 ? products.slice(0, Math.min(10, products.length - (products.length % 5))) : products} />
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-line bg-white px-6 py-10 text-center">
            <BadgeCheck className="h-7 w-7 text-coral-500" />
            <p className="font-semibold">{empty!.title}</p>
            <p className="max-w-md text-sm text-muted">{empty!.text}</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Why choose ScootyKit
// ---------------------------------------------------------------------------
export function WhyChoose({ settings }: { settings: StoreSettings }) {
  const payment =
    settings.cod_enabled && settings.bank_transfer_enabled
      ? "Cash on Delivery or bank transfer — choose what suits you."
      : settings.cod_enabled
        ? "Pay in cash when your order is delivered."
        : "Clear, simple payment options at checkout.";
  const items = [
    { icon: BadgeCheck, title: "Curated for riders", text: "27 categories chosen around the real needs of daily scooty and scooter riders." },
    { icon: Wallet, title: "Pay your way", text: payment },
    { icon: PackageSearch, title: "Track every order", text: "Check status anytime with your order number and phone." },
    { icon: ShieldCheck, title: "Honest listings", text: "Live PKR prices and stock, and reviews only from verified buyers." },
  ];
  return (
    <section className="container-page pt-14">
      <div className="overflow-hidden rounded-2xl bg-navy-900 px-6 py-10 sm:px-10">
        <h2 className="text-center text-2xl font-extrabold text-white">Why riders choose ScootyKit</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            <div key={title} className="text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-coral-500">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Reviews (approved, verified only — hidden when none)
// ---------------------------------------------------------------------------
export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className ?? ""}`} aria-label={`${rating} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-4 w-4 ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} aria-hidden="true" />
      ))}
    </span>
  );
}

export function CustomerReviews({ reviews }: { reviews: (Review & { product: { name: string; slug: string } | null })[] }) {
  if (reviews.length === 0) return null;
  return (
    <section className="container-page pt-14">
      <SectionTitle title="Customer reviews" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <figure key={r.id} className="flex flex-col rounded-xl border border-line bg-white p-6">
            <Stars rating={r.rating} />
            {r.title && <p className="mt-3 font-semibold">{r.title}</p>}
            <blockquote className="mt-2 line-clamp-5 flex-1 text-[15px] leading-7 text-navy-700">“{r.body}”</blockquote>
            <figcaption className="mt-4 border-t border-line pt-4 text-sm">
              <span className="font-semibold">{r.author_name}</span>
              <span className="text-emerald-700"> · Verified buyer</span>
              <span className="text-muted"> · {formatDate(r.created_at)}</span>
              {r.product && (
                <Link href={`/product/${r.product.slug}`} className="mt-0.5 block truncate text-coral-600 hover:underline">
                  {r.product.name}
                </Link>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
