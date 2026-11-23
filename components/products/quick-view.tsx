"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { Eye, X } from "lucide-react";
import { Price } from "@/components/ui/price";
import { MAX_PER_LINE, useCart } from "@/lib/client/cart-store";
import type { ProductSummary } from "@/types";
import { AddToCartButton } from "./add-to-cart-button";
import { ProductImg } from "./product-image";
import { QuantitySelector } from "./quantity-selector";

/** Eye button on product cards that opens a native <dialog> quick view. */
export function QuickViewButton({ product }: { product: ProductSummary }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const close = () => {
    ref.current?.close();
  };
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
          ref.current?.showModal();
        }}
        aria-label={`Quick view ${product.name}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-navy-800 shadow-sm ring-1 ring-line backdrop-blur transition-colors hover:bg-coral-500 hover:text-white hover:ring-coral-500"
      >
        <Eye className="h-4.5 w-4.5" />
      </button>
      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === ref.current) close();
        }}
        aria-label={`Quick view: ${product.name}`}
        className="m-auto w-[min(92vw,860px)] max-w-none rounded-2xl p-0 shadow-2xl backdrop:bg-navy-950/60"
      >
        {open && <QuickViewBody product={product} onClose={close} />}
      </dialog>
    </>
  );
}

function QuickViewBody({ product, onClose }: { product: ProductSummary; onClose: () => void }) {
  const inCart = useCart().find((l) => l.productId === product.id)?.quantity ?? 0;
  const available = Math.max(Math.min(product.stock, MAX_PER_LINE) - inCart, 0);
  const [qty, setQty] = useState(1);
  const soldOut = product.stock <= 0;
  return (
    <div className="relative grid md:grid-cols-2">
      <button onClick={onClose} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white shadow ring-1 ring-line hover:bg-surface" aria-label="Close quick view">
        <X className="h-4.5 w-4.5" />
      </button>
      <div className="relative aspect-square bg-surface">
        {product.image && <ProductImg src={product.image.url} alt={product.image.alt || product.name} fill sizes="430px" className="object-contain p-8" />}
        {product.is_demo && <span className="absolute left-3 top-3 rounded-md bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold uppercase text-navy-950">Sample</span>}
      </div>
      <div className="flex flex-col p-6 sm:p-8">
        {product.category && <p className="text-xs font-bold uppercase tracking-[0.12em] text-coral-600">{product.category.name}</p>}
        <h2 className="mt-2 text-xl font-bold leading-snug sm:text-2xl">{product.name}</h2>
        <Price price={product.price} salePrice={product.sale_price} size="lg" showBadge className="mt-4" />
        <p className={`mt-2 text-sm font-semibold ${soldOut ? "text-red-600" : "text-emerald-700"}`}>{soldOut ? "Out of stock" : product.stock <= 5 ? `Only ${product.stock} left` : "In stock"}</p>
        {product.short_description && <p className="mt-4 text-[15px] leading-7 text-navy-700">{product.short_description}</p>}
        <div className="mt-auto space-y-3 pt-6">
          {!soldOut && available > 0 && <QuantitySelector value={Math.min(qty, available)} max={available} onChange={setQty} />}
          <AddToCartButton product={product} quantity={Math.min(qty, Math.max(available, 1))} size="lg" className="h-12 w-full" />
          <Link href={`/product/${product.slug}`} onClick={onClose} className="block text-center text-sm font-semibold text-coral-600 hover:underline">
            View full details →
          </Link>
        </div>
      </div>
    </div>
  );
}
