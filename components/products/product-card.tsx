import Link from "next/link";
import { ImageOff } from "lucide-react";
import { Price } from "@/components/ui/price";
import { discountPercent, isOnSale } from "@/lib/commerce/pricing";
import type { ProductSummary } from "@/types";
import { AddToCartButton } from "./add-to-cart-button";
import { ProductImg } from "./product-image";
import { QuickViewButton } from "./quick-view";
import { WishlistButton } from "./wishlist-button";

export function ProductImageFallback({ label }: { label?: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-surface to-slate-100 text-slate-400">
      <ImageOff className="h-8 w-8" aria-hidden="true" />
      {label && <span className="text-xs font-medium">{label}</span>}
    </div>
  );
}

export function StockLine({ stock, className }: { stock: number; className?: string }) {
  const soldOut = stock <= 0;
  const low = !soldOut && stock <= 5;
  return (
    <p className={`flex items-center gap-1.5 text-xs font-medium ${soldOut ? "text-red-600" : low ? "text-amber-700" : "text-emerald-700"} ${className ?? ""}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${soldOut ? "bg-red-500" : low ? "bg-amber-500" : "bg-emerald-500"}`} />
      {soldOut ? "Out of stock" : low ? `Only ${stock} left` : "In stock"}
    </p>
  );
}

export function ProductCard({ product, priority }: { product: ProductSummary; priority?: boolean }) {
  const href = `/product/${product.slug}`;
  const soldOut = product.stock <= 0;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-[border-color,box-shadow] duration-200 hover:border-coral-200 hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-square overflow-hidden bg-surface">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="block h-full w-full">
          {product.image ? (
            <ProductImg
              src={product.image.url}
              alt={product.image.alt || product.name}
              fill
              priority={priority}
              sizes="(min-width: 1280px) 18vw, (min-width: 768px) 30vw, 50vw"
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.05] sm:p-6"
            />
          ) : (
            <ProductImageFallback />
          )}
        </Link>
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {product.is_demo && <span className="rounded-md bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy-950">Sample</span>}
          {isOnSale(product) && <span className="rounded-md bg-coral-500 px-1.5 py-0.5 text-[11px] font-bold text-white">-{discountPercent(product)}%</span>}
          {soldOut && <span className="rounded-md bg-navy-900 px-1.5 py-0.5 text-[11px] font-bold text-white">Sold out</span>}
        </div>
        <div className="absolute right-2.5 top-2.5 z-10 flex flex-col gap-2 transition-all duration-200 lg:translate-x-3 lg:opacity-0 lg:group-focus-within:translate-x-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-x-0 lg:group-hover:opacity-100">
          <WishlistButton productId={product.id} productName={product.name} />
          <QuickViewButton product={product} />
        </div>
      </div>
      <div className="flex flex-1 flex-col border-t border-line p-3 sm:p-4">
        {product.category && (
          <Link href={`/category/${product.category.slug}`} className="relative z-10 mb-1 line-clamp-1 text-[11px] font-semibold uppercase tracking-wider text-muted hover:text-coral-600">
            {product.category.name}
          </Link>
        )}
        <h3 className="line-clamp-2 min-h-[2.5em] text-[14px] font-semibold leading-snug text-navy-900 sm:text-[15px]">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] hover:text-coral-600 focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <Price price={product.price} salePrice={product.sale_price} size="sm" accent className="mt-2" />
        <StockLine stock={product.stock} className="mt-1" />
        <div className="relative z-10 mt-3">
          <AddToCartButton product={product} size="sm" className="w-full" variant="card" />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, className }: { products: ProductSummary[]; className?: string }) {
  return (
    <div className={className ?? "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <div className="skeleton aspect-square rounded-none" />
      <div className="space-y-2.5 p-4">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton mt-3 h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
