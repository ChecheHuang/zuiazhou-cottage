"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/app/admin/(panel)/products/actions";
import { ImagesInput } from "@/components/admin/ContentEditor";
import { cn } from "@/lib/cn";
import {
  PRODUCT_KINDS,
  formatPrice,
  type ProductInput,
  type ProductKind,
} from "@/lib/products/shared";

const inputClass =
  "w-full rounded-xl border border-brand-soft/50 bg-white px-3 py-2 text-[15px] text-brand-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15";

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-brand-ink">
      {label}
    </span>
    {hint && (
      <span className="-mt-1 mb-1.5 block text-xs text-brand-ink/55">
        {hint}
      </span>
    )}
    {children}
  </label>
);

interface ProductFormProps {
  productId?: number;
  initial: ProductInput;
}

export const ProductForm = ({ productId, initial }: ProductFormProps) => {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [saved, setSaved] = useState(initial);
  // 價格輸入框用字串，留白代表「價格請洽詢」
  const [priceText, setPriceText] = useState(
    initial.price === null ? "" : String(initial.price),
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string }>();
  const isNew = productId === undefined;
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const onPrice = (text: string) => {
    const digits = text.replace(/[^\d]/g, "");
    setPriceText(digits);
    set("price", digits === "" ? null : Number(digits));
  };

  const onSave = async () => {
    setBusy(true);
    setMessage(undefined);
    const result = isNew
      ? await createProduct(draft)
      : await updateProduct(productId, draft);
    if (!result.ok) {
      setBusy(false);
      setMessage({ ok: false, text: result.error });
      return;
    }
    setSaved(draft);
    setMessage({ ok: true, text: "已儲存，網站已更新" });
    if (isNew && result.id) {
      // 新商品建立後保持 busy 直到換頁，避免在導頁空檔再按一次建立出重複商品
      router.replace(`/admin/products/${result.id}`);
      return;
    }
    setBusy(false);
  };

  const onDelete = async () => {
    if (isNew) return;
    if (!window.confirm(`確定要刪除「${saved.name}」嗎？刪除後無法復原。`)) {
      return;
    }
    setBusy(true);
    const result = await deleteProduct(productId);
    setBusy(false);
    if (!result.ok) {
      setMessage({ ok: false, text: result.error });
      return;
    }
    router.replace("/admin/products");
  };

  return (
    <article className="rounded-2xl border border-brand-soft/40 bg-white p-4 shadow-sm sm:p-6">
      <div className="space-y-5">
        <Field label="商品名稱">
          <input
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputClass}
            placeholder="例如：抓週道具組"
          />
        </Field>

        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-brand-ink">
            類型
          </legend>
          <div className="flex flex-wrap gap-2">
            {PRODUCT_KINDS.map((k) => (
              <label
                key={k.value}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-1.5 text-sm",
                  draft.kind === k.value
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-brand-soft/60 text-brand-ink hover:bg-brand-soft/20",
                )}
              >
                <input
                  type="radio"
                  name="kind"
                  value={k.value}
                  checked={draft.kind === k.value}
                  onChange={() => set("kind", k.value as ProductKind)}
                  className="sr-only"
                />
                {k.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
          <Field label="價格（新台幣）" hint="留白會顯示「價格請洽詢」">
            <input
              inputMode="numeric"
              value={priceText}
              onChange={(e) => onPrice(e.target.value)}
              className={inputClass}
              placeholder="例如：1280"
            />
          </Field>
          <Field label="價格補充" hint="例如「起」「/組」，可留白">
            <input
              value={draft.priceNote}
              onChange={(e) => set("priceNote", e.target.value)}
              className={inputClass}
              maxLength={20}
            />
          </Field>
        </div>
        <p className="-mt-3 text-xs text-brand-ink/55">
          前台顯示：{formatPrice(draft.price, draft.priceNote)}
        </p>

        <div>
          <p className="mb-1.5 text-sm font-medium text-brand-ink">照片</p>
          <p className="-mt-1 mb-1.5 text-xs text-brand-ink/55">
            第一張是封面，可用箭頭調整順序。上架前至少要有一張。
          </p>
          <ImagesInput
            label={draft.name || "商品照片"}
            value={draft.images}
            onChange={(fn) => setDraft((d) => ({ ...d, images: fn(d.images) }))}
            folder="products"
          />
        </div>

        <Field label="簡介" hint="顯示在商品列表卡片上，建議 50 字以內">
          <textarea
            value={draft.summary}
            onChange={(e) => set("summary", e.target.value)}
            rows={2}
            maxLength={200}
            className={inputClass}
          />
        </Field>

        <Field label="詳細說明" hint="顯示在商品頁，可換行">
          <textarea
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
            rows={8}
            className={cn(inputClass, "leading-relaxed")}
          />
        </Field>

        <label className="flex items-center gap-3 rounded-xl bg-brand-beige/40 px-4 py-3">
          <input
            type="checkbox"
            checked={draft.published}
            onChange={(e) => set("published", e.target.checked)}
            className="size-5 accent-[var(--color-brand)]"
          />
          <span className="text-sm text-brand-ink">
            <span className="font-medium">上架</span>
            ：勾選後客人才看得到這個商品
          </span>
        </label>
      </div>

      <footer className="sticky bottom-0 -mx-4 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-brand-soft/30 bg-white/95 px-4 pb-1 pt-4 backdrop-blur sm:-mx-6 sm:px-6">
        <p
          aria-live="polite"
          className={cn(
            "text-sm",
            message?.ok === false ? "text-red-600" : "text-brand-ink/60",
          )}
        >
          {busy ? "處理中…" : message?.text}
          {!busy && !message && dirty && "有尚未儲存的修改"}
        </p>
        <div className="flex gap-2">
          {!isNew && (
            <button
              type="button"
              onClick={onDelete}
              disabled={busy}
              className="rounded-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              刪除商品
            </button>
          )}
          <Link
            href="/admin/products"
            className="rounded-full border border-brand-soft/60 px-4 py-2 text-sm text-brand-ink hover:bg-brand-soft/30"
          >
            回列表
          </Link>
          <button
            type="button"
            onClick={onSave}
            disabled={busy || (!isNew && !dirty)}
            className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            {isNew ? "建立商品" : "儲存"}
          </button>
        </div>
      </footer>
    </article>
  );
};
