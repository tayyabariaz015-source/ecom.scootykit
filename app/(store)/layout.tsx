import { AnnouncementBar, DemoBanner } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header, MobileBottomNav } from "@/components/layout/header";
import { getCategories } from "@/lib/data/catalog";
import { getStoreSettings } from "@/lib/data/settings";
import { isDemoMode } from "@/lib/demo";

export default async function StoreLayout({ children }: LayoutProps<"/">) {
  const [settings, categories] = await Promise.all([getStoreSettings(), getCategories()]);
  return (
    <>
      {isDemoMode() && <DemoBanner />}
      <AnnouncementBar settings={settings} />
      <Header categories={categories.map((c) => ({ name: c.name, slug: c.slug, icon: c.icon }))} phone={settings.contact_phone} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} categories={categories} />
      <MobileBottomNav />
    </>
  );
}
