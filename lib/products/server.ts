import "server-only";
import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import type { Product } from "./shared";

export const PRODUCTS_TAG = "products";

const columns = {
  id: products.id,
  name: products.name,
  kind: products.kind,
  price: products.price,
  priceNote: products.priceNote,
  summary: products.summary,
  description: products.description,
  images: products.images,
  published: products.published,
  sortOrder: products.sortOrder,
};

const order = [asc(products.sortOrder), asc(products.id)];

// ─── 前台（有快取，後台存檔時清掉） ──────────────────────────
const loadPublished = async (): Promise<Product[]> => {
  if (!db) return [];
  return db
    .select(columns)
    .from(products)
    .where(eq(products.published, true))
    .orderBy(...order);
};

const getCachedPublished = unstable_cache(loadPublished, ["products"], {
  tags: [PRODUCTS_TAG],
});

export const getPublishedProducts = async (): Promise<Product[]> => {
  try {
    return await getCachedPublished();
  } catch (error) {
    console.error("[products] 讀取商品失敗", error);
    return [];
  }
};

export const getPublishedProduct = async (
  id: number,
): Promise<Product | undefined> =>
  (await getPublishedProducts()).find((p) => p.id === id);

// ─── 後台（不經快取） ───────────────────────────────────────
export const listAllProducts = async (): Promise<Product[]> => {
  if (!db) return [];
  return db
    .select(columns)
    .from(products)
    .orderBy(...order);
};

export const getProductForAdmin = async (
  id: number,
): Promise<Product | undefined> => {
  if (!db) return undefined;
  const rows = await db
    .select(columns)
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return rows[0];
};
