"use server";

import { del } from "@vercel/blob";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { requireDb } from "@/lib/db";
import { siteImages } from "@/lib/db/schema";
import { SITE_IMAGES_TAG } from "@/lib/site-images/server";
import {
  SLOT_MAP,
  isAllowedImageUrl,
  isBlobUrl,
} from "@/lib/site-images/slots";

const MAX_IMAGES_PER_SLOT = 60;

export type SaveResult = { ok: true } | { ok: false; error: string };

const sameList = (a: string[], b: string[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

const refreshSite = () => {
  // 立刻讓前台拿到新圖片，不提供舊快取
  revalidateTag(SITE_IMAGES_TAG, { expire: 0 });
  revalidatePath("/", "layout");
};

// 刪掉已經沒有任何位置在用的 Blob 檔案，避免佔用儲存空間
const cleanupBlobs = async (candidates: string[]) => {
  const blobUrls = [...new Set(candidates.filter(isBlobUrl))];
  if (blobUrls.length === 0) return;
  const db = requireDb();
  const stillUsed = await db
    .select({ url: siteImages.url })
    .from(siteImages)
    .where(inArray(siteImages.url, blobUrls));
  const used = new Set(stillUsed.map((r) => r.url));
  const orphans = blobUrls.filter((u) => !used.has(u));
  if (orphans.length === 0) return;
  try {
    await del(orphans);
  } catch (error) {
    console.error("[admin] 刪除 Blob 檔案失敗", orphans, error);
  }
};

const readSlot = async (slot: string) => {
  const db = requireDb();
  const rows = await db
    .select({ url: siteImages.url, sortOrder: siteImages.sortOrder })
    .from(siteImages)
    .where(eq(siteImages.slot, slot));
  return rows.sort((a, b) => a.sortOrder - b.sortOrder).map((r) => r.url);
};

export const saveSlotImages = async (
  slot: string,
  urls: string[],
): Promise<SaveResult> => {
  try {
    await requireAdmin();
    const def = SLOT_MAP.get(slot);
    if (!def) return { ok: false, error: "找不到這個圖片位置" };
    if (!Array.isArray(urls) || urls.some((u) => typeof u !== "string")) {
      return { ok: false, error: "資料格式錯誤" };
    }
    if (
      def.multiple &&
      (urls.length < 1 || urls.length > MAX_IMAGES_PER_SLOT)
    ) {
      return {
        ok: false,
        error: `這個位置需要 1～${MAX_IMAGES_PER_SLOT} 張照片`,
      };
    }
    if (!def.multiple && urls.length !== 1) {
      return { ok: false, error: "這個位置只能放 1 張照片" };
    }
    if (!urls.every(isAllowedImageUrl)) {
      return { ok: false, error: "圖片網址不合法" };
    }

    const db = requireDb();
    const previous = await readSlot(slot);
    const deleteRows = db.delete(siteImages).where(eq(siteImages.slot, slot));

    // 跟預設完全一樣就不存，等於恢復預設
    if (sameList(urls, def.defaults)) {
      await deleteRows;
    } else {
      await db.batch([
        deleteRows,
        db
          .insert(siteImages)
          .values(urls.map((url, i) => ({ slot, url, sortOrder: i }))),
      ]);
    }

    await cleanupBlobs(previous.filter((u) => !urls.includes(u)));
    refreshSite();
    return { ok: true };
  } catch (error) {
    console.error("[admin] saveSlotImages 失敗", slot, error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "儲存失敗",
    };
  }
};

export const resetSlotImages = async (slot: string): Promise<SaveResult> => {
  try {
    await requireAdmin();
    if (!SLOT_MAP.has(slot)) return { ok: false, error: "找不到這個圖片位置" };
    const db = requireDb();
    const previous = await readSlot(slot);
    await db.delete(siteImages).where(eq(siteImages.slot, slot));
    await cleanupBlobs(previous);
    refreshSite();
    return { ok: true };
  } catch (error) {
    console.error("[admin] resetSlotImages 失敗", slot, error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "恢復預設失敗",
    };
  }
};
