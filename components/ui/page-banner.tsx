import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./misc";
import { CategoryIcon } from "./category-icon";

/** Navy page banner used on shop, category and collection pages. */
export function PageBanner({
  title,
  description,
  crumbs,
  art,
  icon,
  meta,
}: {
  title: string;
  description?: string;
  crumbs: Crumb[];
  art?: string | null;
  icon?: string;
  meta?: ReactNode;
}) {
  return (
    <section className="container-page pt-5">
      <div className="relative isolate overflow-hidden rounded-xl bg-navy-900 px-6 py-8 sm:px-10 sm:py-10">
        <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-coral-500/25 blur-3xl" aria-hidden="true" />
        <Breadcrumbs items={crumbs} dark />
        <div className="mt-4 flex items-center gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-extrabold text-white sm:text-[2rem]">{title}</h1>
            {description && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-300">{description}</p>}
            {meta && <div className="mt-3 text-sm font-semibold text-coral-500">{meta}</div>}
          </div>
          {art ? (
            <span className="hidden h-32 w-32 shrink-0 place-items-center rounded-full bg-white shadow-xl sm:grid lg:h-36 lg:w-36">
              <Image src={art} alt="" width={120} height={120} unoptimized={art.endsWith(".svg")} className="h-24 w-24 object-contain lg:h-28 lg:w-28" />
            </span>
          ) : icon ? (
            <span className="hidden h-24 w-24 shrink-0 place-items-center rounded-full bg-white/10 text-coral-500 sm:grid">
              <CategoryIcon name={icon} className="h-11 w-11" />
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
