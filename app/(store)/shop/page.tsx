import type { Metadata } from "next";
import { ProductListing, parseListingParams } from "@/components/products/listing";
import { PageBanner } from "@/components/ui/page-banner";
import { getCategories } from "@/lib/data/catalog";
import { firstParam } from "@/lib/utils";

export async function generateMetadata({ searchParams }: PageProps<"/shop">): Promise<Metadata> {
  const sp = await searchParams;
  const q = firstParam(sp.q);
  const featured = firstParam(sp.featured) === "1";
  return {
    title: q ? `Search: ${q.slice(0, 60)}` : featured ? "Featured Products" : "Shop All Scooty Accessories",
    description: "Shop all ScootyKit accessories for electric scooty, scooter and motorcycle riders in Pakistan. Prices in PKR, Cash on Delivery available.",
    alternates: { canonical: "/shop" },
    robots: q ? { index: false, follow: true } : undefined,
  };
}

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const params = parseListingParams(await searchParams);
  const categories = await getCategories();
  const title = params.q ? `Results for “${params.q}”` : params.featured ? "Featured products" : "Shop all accessories";
  return (
    <>
      <PageBanner
        title={title}
        description={params.featured ? "Hand-picked accessories from across the store." : "Helmets, safety gear, security, comfort and tech for your ride."}
        crumbs={params.featured ? [{ label: "Shop", href: "/shop" }, { label: "Featured" }] : [{ label: "Shop" }]}
        art="/art/scooty.svg"
      />
      <div className="container-page py-8">
        <ProductListing params={params} allCategories={categories} basePath="/shop" />
      </div>
    </>
  );
}
