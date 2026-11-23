import Link from "next/link";
import { HelpCircle, Mail, PackageSearch } from "lucide-react";
import type { StoreSettings } from "@/types";

/** Dark utility bar: configurable announcement + quick links. */
export function AnnouncementBar({ settings }: { settings: StoreSettings }) {
  const announcement = settings.announcement_active && settings.announcement_text ? settings.announcement_text : null;
  const message = announcement ?? `Welcome to ScootyKit — ${settings.tagline}`;
  return (
    <div className="bg-navy-950 text-[12.5px] text-slate-300">
      <div className="container-page flex min-h-9 items-center justify-center gap-6 py-2 md:justify-between">
        <p className="text-center md:text-left">
          {announcement && settings.announcement_link ? (
            <Link href={settings.announcement_link} className="font-medium text-white hover:underline">
              {message} <span className="text-coral-500">→</span>
            </Link>
          ) : (
            <span className={announcement ? "font-medium text-white" : undefined}>{message}</span>
          )}
        </p>
        <ul className="hidden items-center divide-x divide-white/15 md:flex">
          <li className="pr-4">
            <Link href="/track-order" className="flex items-center gap-1.5 hover:text-white">
              <PackageSearch className="h-3.5 w-3.5 text-coral-500" /> Track order
            </Link>
          </li>
          <li className="px-4">
            <Link href="/faq" className="flex items-center gap-1.5 hover:text-white">
              <HelpCircle className="h-3.5 w-3.5 text-coral-500" /> Help center
            </Link>
          </li>
          {settings.contact_email && (
            <li className="pl-4">
              <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-1.5 hover:text-white">
                <Mail className="h-3.5 w-3.5 text-coral-500" /> {settings.contact_email}
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export function DemoBanner() {
  return (
    <div role="note" className="bg-amber-400 text-navy-950">
      <p className="container-page py-1.5 text-center text-[12.5px] font-semibold">
        Design preview — products shown are labelled SAMPLE items, not real inventory. Orders are disabled.
      </p>
    </div>
  );
}
