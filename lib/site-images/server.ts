import "server-only";
import { asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { siteImages } from "@/lib/db/schema";
import { SLOT_MAP, type SiteImageOverrides } from "./slots";

export const SITE_IMAGES_TAG = "site-images";

const loadOverrides = async (): Promise<SiteImageOverrides> => {
  if (!db) return {};
  const rows = await db
    .select({ slot: siteImages.slot, url: siteImages.url })
    .from(siteImages)
    .orderBy(asc(siteImages.slot), asc(siteImages.sortOrder));

  return rows.reduce<SiteImageOverrides>((acc, row) => {
    if (!SLOT_MAP.has(row.slot)) return acc;
    return { ...acc, [row.slot]: [...(acc[row.slot] ?? []), row.url] };
  }, {});
};

const getCachedOverrides = unstable_cache(loadOverrides, ["site-images"], {
  tags: [SITE_IMAGES_TAG],
});

// 前台用：有快取，後台存檔時用 SITE_IMAGES_TAG 清掉。
// 資料庫連不上時退回預設圖片，網站不會因此掛掉。
export const getSiteImageOverrides = async (): Promise<SiteImageOverrides> => {
  try {
    return await getCachedOverrides();
  } catch (error) {
    console.error("[site-images] 讀取資料庫失敗，改用預設圖片", error);
    return {};
  }
};

// 後台用：不經過快取，永遠讀最新資料
export const getSiteImageOverridesFresh = loadOverrides;
