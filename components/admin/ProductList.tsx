"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  reorderProducts,
  setProductPublished,
} from "@/app/admin/(panel)/products/actions";
import { cn } from "@/lib/cn";
import { formatPrice, kindLabel, type Product } from "@/lib/products/shared";

export const ProductList = ({ initial }: { initial: Product[] }) => {
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const run = async (
    next: Product[],
    action: () => Promise<{ ok: boolean; error?: string }>,
  ) => {
    const previous = items;
    setItems(next);
    setBusy(true);
    setError(undefined);
    const result = await action();
    setBusy(false);
    if (!result.ok) {
      setItems(previous);
      setError(result.error ?? "操作失敗");
    }
  };

  const togglePublished = (p: Product) =>
    run(
      items.map((x) => (x.id === p.id ? { ...x, published: !p.published } : x)),
      () => setProductPublished(p.id, !p.published),
    );

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    void run(next, () => reorderProducts(next.map((p) => p.id)));
  };

  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-brand-soft bg-white px-6 py-12 text-center text-sm text-brand-ink/60">
        還沒有商品，按右上角「新增商品」開始建立。
      </p>
    );
  }

  return (
    <>
      {error && (
        <p role="alert" className="mb-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <ul className="grid gap-3">
        {items.map((p, i) => (
          <li
            key={p.id}
            className="flex items-center gap-3 rounded-2xl border border-brand-soft/40 bg-white p-3 shadow-sm sm:gap-4"
          >
            <div className="flex flex-col">
              <button
                type="button"
                aria-label="往上移"
                disabled={busy || i === 0}
                onClick={() => move(i, -1)}
                className="rounded-md px-2 text-brand-ink/70 hover:bg-brand-ink/5 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                aria-label="往下移"
                disabled={busy || i === items.length - 1}
                onClick={() => move(i, 1)}
                className="rounded-md px-2 text-brand-ink/70 hover:bg-brand-ink/5 disabled:opacity-30"
              >
                ↓
              </button>
            </div>
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-brand-beige">
              {p.images[0] ? (
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center text-[10px] text-brand-ink/50">
                  無照片
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/admin/products/${p.id}`}
                className="block truncate font-medium text-brand-ink hover:text-brand"
              >
                {p.name}
              </Link>
              <p className="mt-0.5 text-xs text-brand-ink/60">
                {kindLabel(p.kind)} · {formatPrice(p.price, p.priceNote)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void togglePublished(p)}
              disabled={busy}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-sm disabled:opacity-50",
                p.published
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "bg-brand-ink/5 text-brand-ink/60 hover:bg-brand-ink/10",
              )}
              title={p.published ? "點擊下架" : "點擊上架"}
            >
              {p.published ? "上架中" : "已下架"}
            </button>
            <Link
              href={`/admin/products/${p.id}`}
              className="hidden shrink-0 rounded-full border border-brand-soft/60 px-3 py-1.5 text-sm text-brand-ink hover:bg-brand-soft/30 sm:inline-block"
            >
              編輯
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
