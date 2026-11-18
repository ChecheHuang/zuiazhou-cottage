"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { cleanupBlobs } from "@/lib/admin/blob-cleanup";
import { requireAdmin } from "@/lib/admin-auth";
import { requireDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { PRODUCTS_TAG } from "@/lib/products/server";
import { validateProductInput } from "@/lib/products/shared";

export type ProductActionResult =
  { ok: true; id?: number } | { ok: false; error: string };

const refreshSite = () => {
  revalidateTag(PRODUCTS_TAG, { expire: 0 });
  // 選單會依「有沒有上架商品」顯示商品專區，所以整站都要更新
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
};

const fail = (scope: string, error: unknown): ProductActionResult => {
  console.error(`[admin] ${scope} 失敗`, error);
  return {
    ok: false,
    error: error instanceof Error ? error.message : "操作失敗",
  };
};

const readImages = async (id: number) => {
  const rows = await requireDb()
    .select({ images: products.images })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return rows[0]?.images;
};

export const createProduct = async (
  raw: unknown,
): Promise<ProductActionResult> => {
  try {
    await requireAdmin();
    const checked = validateProductInput(raw);
    if (!checked.ok) return checked;
    const db = requireDb();
    // 新商品排在最後面
    const [{ next }] = await db
      .select({
        next: sql<number>`coalesce(max(${products.sortOrder}), -1) + 1`,
      })
      .from(products);
    const [row] = await db
      .insert(products)
      .values({ ...checked.value, sortOrder: Number(next) })
      .returning({ id: products.id });
    refreshSite();
    return { ok: true, id: row.id };
  } catch (error) {
    return fail("createProduct", error);
  }
};

export const updateProduct = async (
  id: number,
  raw: unknown,
): Promise<ProductActionResult> => {
  try {
    await requireAdmin();
    const checked = validateProductInput(raw);
    if (!checked.ok) return checked;
    const previous = await readImages(id);
    if (!previous) return { ok: false, error: "找不到這個商品" };
    await requireDb()
      .update(products)
      .set({ ...checked.value, updatedAt: new Date() })
      .where(eq(products.id, id));
    await cleanupBlobs(
      previous.filter((u) => !checked.value.images.includes(u)),
    );
    refreshSite();
    return { ok: true, id };
  } catch (error) {
    return fail("updateProduct", error);
  }
};

export const deleteProduct = async (
  id: number,
): Promise<ProductActionResult> => {
  try {
    await requireAdmin();
    const previous = await readImages(id);
    if (!previous) return { ok: false, error: "找不到這個商品" };
    await requireDb().delete(products).where(eq(products.id, id));
    await cleanupBlobs(previous);
    refreshSite();
    return { ok: true };
  } catch (error) {
    return fail("deleteProduct", error);
  }
};

export const setProductPublished = async (
  id: number,
  published: boolean,
): Promise<ProductActionResult> => {
  try {
    await requireAdmin();
    const images = await readImages(id);
    if (!images) return { ok: false, error: "找不到這個商品" };
    if (published && images.length === 0) {
      return { ok: false, error: "上架前請至少上傳一張照片" };
    }
    await requireDb()
      .update(products)
      .set({ published, updatedAt: new Date() })
      .where(eq(products.id, id));
    refreshSite();
    return { ok: true };
  } catch (error) {
    return fail("setProductPublished", error);
  }
};

// 依後台清單目前的順序重新編號
export const reorderProducts = async (
  ids: number[],
): Promise<ProductActionResult> => {
  try {
    await requireAdmin();
    if (!Array.isArray(ids) || !ids.every((id) => Number.isInteger(id))) {
      return { ok: false, error: "資料格式錯誤" };
    }
    const db = requireDb();
    const updates = ids.map((id, index) =>
      db.update(products).set({ sortOrder: index }).where(eq(products.id, id)),
    );
    if (updates.length > 0) {
      await db.batch(updates as [(typeof updates)[number], ...typeof updates]);
    }
    refreshSite();
    return { ok: true };
  } catch (error) {
    return fail("reorderProducts", error);
  }
};
