"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Heart, LayoutGrid, Menu, PackageSearch, Phone, Search, ShoppingBag, Store, User, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { CategoryIcon } from "@/components/ui/category-icon";
import { useCart } from "@/lib/client/cart-store";
import { useWishlist } from "@/lib/client/wishlist-store";
import { useSignedIn } from "@/lib/client/session";
import { COLLECTIONS } from "@/lib/commerce/collections";
import { formatPKR } from "@/lib/commerce/format";
import { cartSubtotal } from "@/lib/commerce/pricing";
import { formatPhone } from "@/lib/commerce/phone";
import { cn } from "@/lib/utils";

export interface NavCategory {
  name: string;
  slug: string;
  icon: string;
}

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All" },
  { href: "/categories", label: "Shop by Category" },
  { href: "/shop?featured=1", label: "Featured Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-coral-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function SearchBar({ categories, className, inputId }: { categories: NavCategory[]; className?: string; inputId: string }) {
  const router = useRouter();
  return (
    <form
      role="search"
      className={cn("flex h-12 items-stretch rounded-full border-2 border-navy-900 bg-white", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const q = String(fd.get("q") ?? "").trim();
        const cat = String(fd.get("cat") ?? "");
        const base = cat ? `/category/${cat}` : "/shop";
        router.push(q ? `${base}?q=${encodeURIComponent(q)}` : base);
      }}
    >
      <label htmlFor={`${inputId}-cat`} className="sr-only">
        Search in category
      </label>
      <select
        id={`${inputId}-cat`}
        name="cat"
        defaultValue=""
        className="hidden w-44 shrink-0 cursor-pointer appearance-none truncate rounded-l-full border-r border-line bg-transparent pl-5 pr-3 text-sm font-semibold text-navy-900 focus:outline-none lg:block"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      <label htmlFor={inputId} className="sr-only">
        Search products
      </label>
      <input
        id={inputId}
        name="q"
        type="search"
        autoComplete="off"
        placeholder="Search helmets, disc locks, mobile holders…"
        className="min-w-0 flex-1 rounded-l-full bg-transparent px-4 text-[15px] placeholder:text-muted/80 focus:outline-none lg:rounded-none"
      />
      <button type="submit" className="m-1 grid w-11 shrink-0 place-items-center rounded-full bg-coral-500 text-white transition-colors hover:bg-coral-600 sm:w-24" aria-label="Search">
        <Search className="h-4.5 w-4.5 sm:hidden" />
        <span className="hidden text-sm font-semibold sm:inline">Search</span>
      </button>
    </form>
  );
}

function MegaMenu({ categories, id }: { categories: NavCategory[]; id: string }) {
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  return (
    <div id={id} className="absolute left-0 top-full z-50 w-[min(94vw,1180px)] rounded-b-2xl border border-t-0 border-line bg-white p-6 shadow-[var(--shadow-lift)]">
      <div className="grid grid-cols-[1fr_2fr_1fr] gap-8">
        {COLLECTIONS.map((col) => (
          <div key={col.slug}>
            <Link href={`/collections/${col.slug}`} className="mb-3 flex items-center justify-between border-b border-line pb-2.5 text-xs font-bold uppercase tracking-[0.12em] text-navy-900 hover:text-coral-600">
              {col.shortTitle}
              <span aria-hidden="true" className="text-coral-500">
                →
              </span>
            </Link>
            <ul className={cn("grid gap-0.5", col.categorySlugs.length > 8 && "grid-cols-2 gap-x-3")}>
              {col.categorySlugs
                .map((s) => bySlug.get(s))
                .filter((c): c is NavCategory => Boolean(c))
                .map((c) => (
                  <li key={c.slug}>
                    <Link href={`/category/${c.slug}`} className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13.5px] text-navy-800 hover:bg-coral-50 hover:text-coral-700">
                      <CategoryIcon name={c.icon} className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-coral-600" />
                      <span className="line-clamp-1">{c.name.replace(/^Scooty /, "")}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between rounded-xl bg-surface px-4 py-3 text-sm">
        <span className="text-muted">{categories.length} categories for electric scooty &amp; scooter riders</span>
        <Link href="/categories" className="font-semibold text-coral-600 hover:underline">
          View all categories →
        </Link>
      </div>
    </div>
  );
}

export function Header({ categories, phone }: { categories: NavCategory[]; phone: string | null }) {
  const pathname = usePathname();
  const lines = useCart();
  const cartCount = lines.reduce((n, l) => n + l.quantity, 0);
  const cartTotal = cartSubtotal(lines.map((l) => ({ price: l.price, sale_price: l.salePrice, quantity: l.quantity })));
  const wishlistCount = useWishlist().length;
  const signedIn = useSignedIn();
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaId = useId();

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setMegaOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMenuOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : href.startsWith("/shop?") ? false : pathname === href.split("?")[0]);
  const action = "relative flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-navy-900 transition-colors hover:text-coral-600";

  return (
    <header className="relative z-40 bg-white">
      {/* Main row */}
      <div className="border-b border-line">
        <div className="container-page flex h-[72px] items-center gap-3 lg:h-[88px] lg:gap-8">
          <button className="-ml-2 grid h-10 w-10 place-items-center rounded-xl hover:bg-surface lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}>
            <Menu className="h-5.5 w-5.5" />
          </button>
          <Logo className="shrink-0" />
          <SearchBar categories={categories} inputId="header-search" className="hidden flex-1 md:flex" />
          {phone && (
            <a href={`tel:${phone}`} className="hidden shrink-0 items-center gap-2.5 xl:flex">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-coral-50 text-coral-600">
                <Phone className="h-4.5 w-4.5" />
              </span>
              <span className="leading-tight">
                <span className="block text-xs text-muted">Need help?</span>
                <span className="block text-sm font-bold">{formatPhone(phone)}</span>
              </span>
            </a>
          )}
          <nav aria-label="Account" className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link href="/account" className={cn(action, "hidden sm:flex")} aria-label="Account">
              <User className="h-6 w-6" />
              <span className="hidden text-left leading-tight xl:block">
                <span className="block text-xs text-muted">{signedIn ? "My" : "Sign in"}</span>
                <span className="block text-sm font-bold">Account</span>
              </span>
            </Link>
            <Link href="/wishlist" className={cn(action, "hidden sm:flex")} aria-label={`Wishlist (${wishlistCount} items)`}>
              <span className="relative">
                <Heart className="h-6 w-6" />
                <Badge count={wishlistCount} />
              </span>
              <span className="hidden text-left leading-tight xl:block">
                <span className="block text-xs text-muted">Saved</span>
                <span className="block text-sm font-bold">Wishlist</span>
              </span>
            </Link>
            <Link href="/cart" className={action} aria-label={`Cart (${cartCount} items)`}>
              <span className="relative">
                <ShoppingBag className="h-6 w-6" />
                <Badge count={cartCount} />
              </span>
              <span className="hidden text-left leading-tight xl:block">
                <span className="block text-xs text-muted">Your cart</span>
                <span className="block text-sm font-bold">{formatPKR(cartTotal)}</span>
              </span>
            </Link>
          </nav>
        </div>
        <div className="container-page pb-3 md:hidden">
          <SearchBar categories={categories} inputId="header-search-mobile" className="h-11" />
        </div>
      </div>

      {/* Navigation row (desktop) */}
      <div className="hidden border-b border-line lg:block">
        <div className="container-page flex h-14 items-center gap-3 xl:gap-6">
          <div ref={megaRef} className="relative h-full">
            <button
              onClick={() => setMegaOpen((o) => !o)}
              aria-expanded={megaOpen}
              aria-controls={megaId}
              className="flex h-full w-[220px] items-center gap-3 bg-coral-500 px-5 xl:w-[260px] text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-coral-600"
            >
              <LayoutGrid className="h-4.5 w-4.5" />
              All Categories
              <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", megaOpen && "rotate-180")} />
            </button>
            {megaOpen && <MegaMenu categories={categories} id={megaId} />}
          </div>
          <nav aria-label="Main" className="flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-2 py-2 text-sm font-semibold transition-colors hover:text-coral-600 xl:px-3",
                  isActive(l.href) ? "text-coral-600" : "text-navy-900",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/track-order" className="ml-auto hidden items-center gap-2 text-sm font-semibold text-navy-900 hover:text-coral-600 xl:flex">
            <PackageSearch className="h-4.5 w-4.5 text-coral-500" />
            Track your order
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button className="absolute inset-0 bg-navy-950/50" onClick={() => setMenuOpen(false)} aria-label="Close menu" />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <Logo />
              <button className="grid h-10 w-10 place-items-center rounded-xl hover:bg-surface" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X className="h-5.5 w-5.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
              <nav aria-label="Mobile main" className="grid gap-0.5">
                {[...NAV_LINKS, { href: "/track-order", label: "Track Order" }].map((l) => (
                  <Link key={l.href} href={l.href} className="rounded-xl px-3 py-3 text-[15px] font-semibold hover:bg-surface">
                    {l.label}
                  </Link>
                ))}
              </nav>
              {COLLECTIONS.map((col) => (
                <div key={col.slug} className="mt-5">
                  <Link href={`/collections/${col.slug}`} className="mb-1 block px-3 text-xs font-bold uppercase tracking-[0.12em] text-coral-600">
                    {col.shortTitle}
                  </Link>
                  {col.categorySlugs.map((s) => {
                    const c = categories.find((x) => x.slug === s);
                    if (!c) return null;
                    return (
                      <Link key={c.slug} href={`/category/${c.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] hover:bg-surface">
                        <CategoryIcon name={c.icon} className="h-4.5 w-4.5 text-slate-400" />
                        {c.name}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/** Bottom tab bar for phones — mirrors common mobile shopping apps. */
export function MobileBottomNav() {
  const pathname = usePathname();
  const cartCount = useCart().reduce((n, l) => n + l.quantity, 0);
  const wishlistCount = useWishlist().length;
  const items = [
    { href: "/shop", label: "Shop", icon: Store, count: 0 },
    { href: "/categories", label: "Categories", icon: LayoutGrid, count: 0 },
    { href: "/wishlist", label: "Wishlist", icon: Heart, count: wishlistCount },
    { href: "/account", label: "Account", icon: User, count: 0 },
    { href: "/cart", label: "Cart", icon: ShoppingBag, count: cartCount },
  ];
  return (
    <nav aria-label="Quick links" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon, count }) => {
          const active = pathname === href || (href !== "/shop" && pathname.startsWith(`${href}/`));
          return (
            <li key={href}>
              <Link href={href} className={cn("flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold", active ? "text-coral-600" : "text-navy-800")}>
                <span className="relative">
                  <Icon className="h-5.5 w-5.5" />
                  <Badge count={count} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
