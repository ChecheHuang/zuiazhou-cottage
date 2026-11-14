import { isAllowedImageUrl } from "@/lib/site-images/urls";

// 前台、後台、Server Action 共用（不能 import server-only 的東西）

export type ProductKind = "goods" | "service";

export const PRODUCT_KINDS: { value: ProductKind; label: string }[] = [
  { value: "goods", label: "實體商品" },
  { value: "service", label: "服務／加購" },
];

export const kindLabel = (kind: ProductKind) =>
  PRODUCT_KINDS.find((k) => k.value === kind)?.label ?? "";

export interface ProductInput {
  name: string;
  kind: ProductKind;
  price: number | null;
  priceNote: string;
  summary: string;
  description: string;
  images: string[];
  published: boolean;
}

export interface Product extends ProductInput {
  id: number;
  sortOrder: number;
}

export const toProductInput = (p: Product): ProductInput => ({
  name: p.name,
  kind: p.kind,
  price: p.price,
  priceNote: p.priceNote,
  summary: p.summary,
  description: p.description,
  images: p.images,
  published: p.published,
});

export const emptyProduct: ProductInput = {
  name: "",
  kind: "goods",
  price: null,
  priceNote: "",
  summary: "",
  description: "",
  images: [],
  published: false,
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const str = (v: unknown, max: number) =>
  typeof v === "string" && v.length <= max ? v : null;

type Result = { ok: true; value: ProductInput } | { ok: false; error: string };

// 存檔前驗證；上架的商品至少要有名稱和一張照片
export const validateProductInput = (raw: unknown): Result => {
  if (!isRecord(raw)) return { ok: false, error: "資料格式錯誤" };
  const name = str(raw.name, 100)?.trim();
  if (!name) return { ok: false, error: "請填寫商品名稱（100 字以內）" };
  if (raw.kind !== "goods" && raw.kind !== "service") {
    return { ok: false, error: "請選擇商品類型" };
  }
  const price = raw.price;
  if (
    price !== null &&
    !(typeof price === "number" && Number.isInteger(price) && price >= 0)
  ) {
    return { ok: false, error: "價格必須是 0 以上的整數，或留白表示請洽詢" };
  }
  if (price !== null && price > 10_000_000) {
    return { ok: false, error: "價格太大" };
  }
  const priceNote = str(raw.priceNote, 20);
  if (priceNote === null) return { ok: false, error: "價格補充最多 20 字" };
  const summary = str(raw.summary, 200);
  if (summary === null) return { ok: false, error: "簡介最多 200 字" };
  const description = str(raw.description, 5000);
  if (description === null) return { ok: false, error: "詳細說明最多 5000 字" };
  const images = raw.images;
  if (
    !Array.isArray(images) ||
    images.length > 20 ||
    !images.every((u) => typeof u === "string" && isAllowedImageUrl(u))
  ) {
    return { ok: false, error: "照片最多 20 張，且必須是上傳的圖片" };
  }
  const published = raw.published === true;
  if (published && images.length === 0) {
    return { ok: false, error: "上架前請至少上傳一張照片" };
  }
  return {
    ok: true,
    value: {
      name,
      kind: raw.kind,
      price,
      priceNote: priceNote.trim(),
      summary: summary.trim(),
      description: description.trim(),
      images,
      published,
    },
  };
};

export const formatPrice = (price: number | null, note = "") =>
  price === null
    ? "價格請洽詢"
    : `NT$${price.toLocaleString("en-US")}${note ? ` ${note}` : ""}`;

// 開啟官方 LINE 並預先填好訊息（客人按送出即可）
export const lineInquiryUrl = (lineId: string, message: string) =>
  `https://line.me/R/oaMessage/${encodeURIComponent(lineId)}/?${encodeURIComponent(message)}`;
