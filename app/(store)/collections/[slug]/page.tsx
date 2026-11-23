import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductListing, parseListingParams } from "@/components/products/listing";
import { CategoryIcon } from "@/components/ui/category-icon";
import { PageBanner } from "@/components/ui/page-banner";
import { COLLECTIONS, getCollection } from "@/lib/commerce/collections";
import { getCategories } from "@/lib/data/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const collection = getCollection((await params).slug);
  if (!collection) return { title: "Collection not found" };
  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: `/collections/${collection.slug}` },
  };
}

export default async function CollectionPage({ params, searchParams }: PageProps<"/collections/[slug]">) {
  const collection = getCollection((await params).slug);
  if (!collection) notFound();
  const all = await getCategories();
  const scope = collection.categorySlugs.map((s) => all.find((c) => c.slug === s)).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const listingParams = parseListingParams(await searchParams);
  const total = scope.reduce((n, c) => n + (c.product_count ?? 0), 0);

  return (
    <>
      <PageBanner
        title={collection.title}
        description={collection.description}
        crumbs={[{ label: "Collections", href: "/categories" }, { label: collection.title }]}
        art={collection.art}
        meta={`${scope.length} categories · ${total} ${total === 1 ? "product" : "products"}`}
      />
      <div className="container-page pt-6">
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" aria-label="Categories in this collection">
          {scope.map((c) => (
            <li key={c.slug} className="shrink-0">
              <Link href={`/category/${c.slug}`} className="flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-navy-800 hover:border-coral-300 hover:text-coral-600">
                <CategoryIcon name={c.icon} className="h-4 w-4 text-coral-500" />
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="container-page py-8">
        <ProductListing params={listingParams} allCategories={all} scopeCategories={scope} basePath={`/collections/${collection.slug}`} />
      </div>
    </>
  );
}
