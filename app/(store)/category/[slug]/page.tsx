import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing, parseListingParams } from "@/components/products/listing";
import { PageBanner } from "@/components/ui/page-banner";
import { CATEGORY_ART, collectionForCategory } from "@/lib/commerce/collections";
import { getCategories, getCategoryBySlug } from "@/lib/data/catalog";
import { SITE_URL } from "@/lib/env";

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  const title = category.seo_title || `${category.name} in Pakistan`;
  const description = category.seo_description || category.description || `Shop ${category.name} at ScootyKit.`;
  return {
    title,
    description,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: { title, description, url: `/category/${category.slug}`, images: category.image_url ? [category.image_url] : undefined },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const [category, categories] = await Promise.all([getCategoryBySlug(slug), getCategories()]);
  if (!category) notFound();
  const listingParams = parseListingParams(await searchParams);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Categories", item: `${SITE_URL}/categories` },
      { "@type": "ListItem", position: 3, name: category.name, item: `${SITE_URL}/category/${category.slug}` },
    ],
  };

  const collection = collectionForCategory(category.slug);
  const count = category.product_count ?? 0;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <PageBanner
        title={category.name}
        description={category.description}
        crumbs={[
          { label: "Categories", href: "/categories" },
          ...(collection ? [{ label: collection.shortTitle, href: `/collections/${collection.slug}` }] : []),
          { label: category.name },
        ]}
        art={category.image_url ?? CATEGORY_ART[category.slug] ?? null}
        icon={category.icon}
        meta={`${count} ${count === 1 ? "product" : "products"} available`}
      />
      <div className="container-page py-8">
        <ProductListing params={listingParams} allCategories={categories} fixedCategory={category} basePath={`/category/${category.slug}`} />
      </div>
    </>
  );
}
