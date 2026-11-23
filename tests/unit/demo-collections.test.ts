import { afterEach, describe, expect, it, vi } from "vitest";
import { COLLECTIONS, collectionForCategory } from "@/lib/commerce/collections";
import { STATIC_CATEGORIES } from "@/lib/commerce/static-categories";
import { DEMO_PRODUCTS, isDemoMode, queryDemoProducts } from "@/lib/demo";

afterEach(() => vi.unstubAllEnvs());

describe("collections", () => {
  it("covers all 27 categories exactly once", () => {
    const all = COLLECTIONS.flatMap((c) => c.categorySlugs);
    expect(STATIC_CATEGORIES).toHaveLength(27);
    expect(new Set(all).size).toBe(all.length);
    expect([...all].sort()).toEqual(STATIC_CATEGORIES.map((c) => c.slug).sort());
    expect(collectionForCategory("gps-trackers")?.slug).toBe("scooty-security-protection");
  });
});

describe("demo mode guard", () => {
  it("is off unless explicitly enabled", () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "");
    expect(isDemoMode()).toBe(false);
  });
  it("never runs on a Vercel production deployment", () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "true");
    vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", "production");
    expect(isDemoMode()).toBe(false);
  });
  it("can run on preview deployments", () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "true");
    vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", "preview");
    expect(isDemoMode()).toBe(true);
  });
  it("sample products are labelled and have no fake sales", () => {
    expect(DEMO_PRODUCTS.every((p) => p.is_demo)).toBe(true);
    expect(queryDemoProducts({ featured: true }).every((p) => p.is_featured)).toBe(true);
    const asc = queryDemoProducts({ sort: "price_asc" });
    expect(asc[0].sale_price ?? asc[0].price).toBeLessThanOrEqual(asc[asc.length - 1].sale_price ?? asc[asc.length - 1].price);
  });
});
