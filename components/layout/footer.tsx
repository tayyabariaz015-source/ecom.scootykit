import Link from "next/link";
import { Banknote, Building2, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { COLLECTIONS } from "@/lib/commerce/collections";
import { formatPhone } from "@/lib/commerce/phone";
import type { Category, StoreSettings } from "@/types";

const CARE = [
  { href: "/track-order", label: "Track your order" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact us" },
  { href: "/account", label: "My account" },
  { href: "/wishlist", label: "Wishlist" },
];

const POLICIES = [
  { href: "/about", label: "About ScootyKit" },
  { href: "/shipping-policy", label: "Shipping policy" },
  { href: "/returns", label: "Returns & exchanges" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms & conditions" },
];

const POPULAR = ["scooty-helmets", "anti-theft-disc-locks", "scooty-mobile-holders", "gps-trackers", "scooty-covers", "riding-gloves"];

export function Footer({ settings, categories }: { settings: StoreSettings; categories: Category[] }) {
  const socials = [
    { href: settings.social_facebook, label: "Facebook" },
    { href: settings.social_instagram, label: "Instagram" },
    { href: settings.social_tiktok, label: "TikTok" },
  ].filter((s): s is { href: string; label: string } => Boolean(s.href));
  const popular = POPULAR.map((s) => categories.find((c) => c.slug === s)).filter((c): c is Category => Boolean(c));
  const payments = [settings.cod_enabled && { icon: Banknote, label: "Cash on Delivery" }, settings.bank_transfer_enabled && { icon: Building2, label: "Bank Transfer" }].filter(
    Boolean,
  ) as { icon: typeof Banknote; label: string }[];

  return (
    <footer className="mt-auto bg-navy-900 pb-16 text-slate-300 lg:pb-0">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
            {settings.tagline} Quality accessories for electric scooty, scooter and motorcycle riders in Pakistan.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm">
            {settings.contact_phone && (
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-coral-500" />
                <a href={`tel:${settings.contact_phone}`} className="hover:text-white">
                  {formatPhone(settings.contact_phone)}
                </a>
              </li>
            )}
            {settings.contact_email && (
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-coral-500" />
                <a href={`mailto:${settings.contact_email}`} className="hover:text-white">
                  {settings.contact_email}
                </a>
              </li>
            )}
            {settings.business_hours && (
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-coral-500" />
                {settings.business_hours}
              </li>
            )}
            {settings.business_address && (
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-coral-500" />
                <span>{settings.business_address}</span>
              </li>
            )}
          </ul>
          {socials.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:border-coral-500 hover:text-coral-500"
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <FooterColumn title="Shop">
          <li>
            <Link href="/shop" className="hover:text-white">
              All products
            </Link>
          </li>
          {COLLECTIONS.map((c) => (
            <li key={c.slug}>
              <Link href={`/collections/${c.slug}`} className="hover:text-white">
                {c.shortTitle}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/shop?featured=1" className="hover:text-white">
              Featured products
            </Link>
          </li>
        </FooterColumn>
        {popular.length > 0 && (
          <FooterColumn title="Popular categories">
            {popular.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </FooterColumn>
        )}
        <FooterColumn title="Customer care">
          {CARE.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-white">
                {l.label}
              </Link>
            </li>
          ))}
        </FooterColumn>
        <FooterColumn title="Company">
          {POLICIES.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-white">
                {l.label}
              </Link>
            </li>
          ))}
        </FooterColumn>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-5 text-xs text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} ScootyKit. All rights reserved. Prices in Pakistani Rupees (PKR).</p>
          {payments.length > 0 && (
            <ul className="flex items-center gap-2" aria-label="Payment methods">
              <li className="mr-1">We accept</li>
              {payments.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 font-semibold text-slate-200 ring-1 ring-white/10">
                  <Icon className="h-3.5 w-3.5 text-coral-500" />
                  {label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.1em] text-white">{title}</h2>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}
