import React from "react";

/**
 * Base shimmer block. Every skeleton below is composed from this so the
 * pulse timing and tone stay identical everywhere. `animate-pulse` is a
 * stock Tailwind utility; `bg-border2` is the same tone used for real
 * image placeholders, so skeletons read as "content, loading" rather than
 * as empty boxes.
 */
export function Skeleton({ className = "", style }) {
  return <div className={`animate-pulse rounded bg-border2 ${className}`} style={style} />;
}

/** Mirrors ProductCard / PublicProductCard so the grid doesn't reflow
 *  when the real products arrive. */
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-panel overflow-hidden flex flex-col">
      <Skeleton className="rounded-none" style={{ aspectRatio: "16 / 10" }} />
      <div className="p-4 flex flex-col flex-1">
        <Skeleton className="h-2.5 w-16" />
        <Skeleton className="h-4 w-3/4 mt-2" />
        <div className="flex items-center justify-between mt-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-9 w-full mt-4 rounded-lg" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, minWidth = 240 }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${minWidth}px), 1fr))` }}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Mirrors an OrdersPage row. */
export function OrderListSkeleton({ count = 5 }) {
  return (
    <div className="rounded-2xl border border-border bg-panel overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`flex items-center justify-between px-5 py-3.5 ${i < count - 1 ? "border-b border-border2" : ""}`}
        >
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Mirrors OwnedProductCard on the My products page. */
export function OwnedProductGridSkeleton({ count = 4 }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-panel overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <div className="space-y-2">
              <Skeleton className="h-2.5 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <div className="mx-5 mb-5 border-t border-dashed border-border" />
          <div className="mx-5 mb-5 flex items-center gap-3">
            <Skeleton className="h-11 flex-1 rounded-lg" />
            <Skeleton className="h-11 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
