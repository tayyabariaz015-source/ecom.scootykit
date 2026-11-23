import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryGrid, SectionTitle } from "@/components/home/sections";
import { EmptyState } from "@/components/ui/misc";
import { PageBanner } from "@/components/ui/page-banner";
import { COLLECTIONS } from "@/lib/commerce/collections";
import { getCategories } from "@/lib/data/catalog";
import type { Category } from "@/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "All Categories",
  description: "Browse all 27 ScootyKit categories — helmets, gloves, covers, locks, GPS trackers, lights and more for scooty riders in Pakistan.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <>
      <PageBanner title="Shop by category" description={`${categories.length} categories of accessories for electric scooty, scooter and motorcycle riders.`} crumbs={[{ label: "Categories" }]} art="/art/scooty.svg" />
      <div className="container-page space-y-12 py-10">
        {categories.length === 0 && <EmptyState title="Categories unavailable" description="We couldn't load categories right now. Please try again shortly." />}
        {COLLECTIONS.map((col) => {
          const items = col.categorySlugs.map((s) => categories.find((c) => c.slug === s)).filter((c): c is Category => Boolean(c));
          if (items.length === 0) return null;
          return (
            <section key={col.slug}>
              <SectionTitle title={col.title}>
                <Link href={`/collections/${col.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-coral-600 hover:underline">
                  Shop collection <ArrowRight className="h-4 w-4" />
                </Link>
              </SectionTitle>
              <CategoryGrid categories={items} />
            </section>
          );
        })}
      </div>
    </>
  );
}
