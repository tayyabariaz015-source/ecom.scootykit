import { PackageSearch } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { Pagination } from "@/components/ui/pagination";
import { getProducts, type ProductFilters, type SortOption } from "@/lib/data/catalog";
import { firstParam } from "@/lib/utils";
import type { Category } from "@/types";
import { ProductGrid } from "./product-card";
import { FiltersPanel } from "./filters-panel";

type RawParams = Record<string, string | string[] | undefined>;

export interface ParsedListingParams {
  q: string;
  categories: string[];
  min: string;
  max: string;
  stock: "" | "in_stock" | "out_of_stock";
  sort: SortOption;
  page: number;
  featured: boolean;
}

const SORTS: SortOption[] = ["newest", "price_asc", "price_desc", "popular"];

export function parseListingParams(sp: RawParams): ParsedListingParams {
  const rawCats = sp.category;
  const categories = (Array.isArray(rawCats) ? rawCats : rawCats ? rawCats.split(",") : []).map((c) => c.trim()).filter(Boolean).slice(0, 27);
  const sort = firstParam(sp.sort) as SortOption;
  const stock = firstParam(sp.stock);
  const num = (v: string | undefined) => (v && /^\d{1,7}$/.test(v) ? v : "");
  const page = Number(firstParam(sp.page));
  return {
    q: (firstParam(sp.q) ?? "").slice(0, 80),
    categories,
    min: num(firstParam(sp.min)),
    max: num(firstParam(sp.max)),
    stock: stock === "in_stock" || stock === "out_of_stock" ? stock : "",
    sort: SORTS.includes(sort) ? sort : "newest",
    page: Number.isInteger(page) && page > 0 && page < 10000 ? page : 1,
    featured: firstParam(sp.featured) === "1",
  };
}

export async function ProductListing({
  params,
  allCategories,
  fixedCategory,
  scopeCategories,
  basePath,
}: {
  params: ParsedListingParams;
  allCategories: Category[];
  fixedCategory?: Category;
  /** Limit results (and the category filter) to these categories, e.g. a collection. */
  scopeCategories?: Category[];
  basePath: string;
}) {
  const filterable = scopeCategories ?? allCategories;
  const selected = filterable.filter((c) => params.categories.includes(c.slug)).map((c) => c.id);
  const categoryIds = fixedCategory ? [fixedCategory.id] : selected.length ? selected : scopeCategories ? scopeCategories.map((c) => c.id) : [];

  const filters: ProductFilters = {
    q: params.q || undefined,
    categoryIds: categoryIds.length ? categoryIds : undefined,
    minPrice: params.min ? Number(params.min) : undefined,
    maxPrice: params.max ? Number(params.max) : undefined,
    availability: params.stock || undefined,
    featured: params.featured || undefined,
    sort: params.sort,
    page: params.page,
    pageSize: 24,
  };
  const result = await getProducts(filters);
  const hasFilters = Boolean(params.q || params.min || params.max || params.stock || params.featured || (!fixedCategory && selected.length));

  const linkParams: Record<string, string | undefined> = {
    q: params.q || undefined,
    category: fixedCategory ? undefined : params.categories.join(",") || undefined,
    min: params.min || undefined,
    max: params.max || undefined,
    stock: params.stock || undefined,
    sort: params.sort !== "newest" ? params.sort : undefined,
    featured: params.featured ? "1" : undefined,
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <FiltersPanel
        basePath={basePath}
        params={params}
        categories={fixedCategory ? [] : filterable.map((c) => ({ slug: c.slug, name: c.name, count: c.product_count ?? 0 }))}
        resultCount={result.total}
      />
      <div>
        {result.products.length > 0 ? (
          <>
            <ProductGrid products={result.products} className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4" />
            <Pagination page={result.page} pageCount={result.pageCount} basePath={basePath} params={linkParams} />
          </>
        ) : (
          <EmptyState
            icon={PackageSearch}
            title={hasFilters ? "No products match your filters" : fixedCategory ? "No products in this category yet" : "No products yet"}
            description={
              hasFilters
                ? "Try removing a filter or searching for something else."
                : fixedCategory
                  ? `We're adding ${fixedCategory.name.toLowerCase()} soon. Browse other categories in the meantime.`
                  : "New accessories are being added. Please check back soon."
            }
            action={
              hasFilters ? (
                <ButtonLink href={basePath} variant="outline">
                  Clear filters
                </ButtonLink>
              ) : (
                <ButtonLink href="/categories" variant="outline">
                  Browse categories
                </ButtonLink>
              )
            }
          />
        )}
      </div>
    </div>
  );
}
