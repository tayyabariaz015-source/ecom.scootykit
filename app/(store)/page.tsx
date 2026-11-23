import { PackageOpen } from "lucide-react";
import { Newsletter } from "@/components/home/newsletter";
import { CollectionBanners, CustomerReviews, HeroRow, ProductSection, SectionTitle, ServiceStrip, ShopByCategory, WhyChoose } from "@/components/home/sections";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { getBestSellers, getCategories, getFeaturedProducts, getLatestReviews, getNewArrivals } from "@/lib/data/catalog";
import { getStoreSettings } from "@/lib/data/settings";
import { SITE_URL } from "@/lib/env";

export const revalidate = 120;

export default async function HomePage() {
  const [settings, categories, featured, bestSellers, newArrivals, reviews] = await Promise.all([
    getStoreSettings(),
    getCategories(),
    getFeaturedProducts(10),
    getBestSellers(10),
    getNewArrivals(10),
    getLatestReviews(6),
  ]);
  const catalogEmpty = newArrivals.length === 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: "ScootyKit",
    slogan: "Everything Your Scooty Needs.",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/scootykit-icon.svg`,
    areaServed: "PK",
    currenciesAccepted: "PKR",
    ...(settings.contact_email ? { email: settings.contact_email } : {}),
    ...(settings.contact_phone ? { telephone: settings.contact_phone } : {}),
  };

  return (
    <div className="pb-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroRow settings={settings} categories={categories} />
      <ServiceStrip settings={settings} />
      <ShopByCategory categories={categories} />

      {catalogEmpty ? (
        <section className="container-page pt-14">
          <SectionTitle title="Featured products" />
          <EmptyState
            icon={PackageOpen}
            title="Our first collection is on its way"
            description="We're adding verified scooty accessories now. Subscribe below and we'll let you know as soon as they're live."
            action={
              <ButtonLink href="/categories" variant="outline">
                Browse categories
              </ButtonLink>
            }
          />
        </section>
      ) : (
        <ProductSection title="Featured products" href="/shop?featured=1" products={featured} />
      )}

      <CollectionBanners categories={categories} />

      {!catalogEmpty && (
        <>
          <ProductSection
            title="Best sellers"
            href="/shop?sort=popular"
            products={bestSellers}
            tone="surface"
            empty={{ title: "Best sellers are calculated from real orders", text: "This section fills in automatically once customers start ordering — we never show made-up rankings." }}
          />
          <ProductSection title="New arrivals" href="/shop?sort=newest" products={newArrivals} />
        </>
      )}

      <WhyChoose settings={settings} />
      <CustomerReviews reviews={reviews} />
      <Newsletter />
    </div>
  );
}
