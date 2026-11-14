import "server-only";
import { del } from "@vercel/blob";
import { inArray, sql } from "drizzle-orm";
import { requireDb } from "@/lib/db";
import { products, siteContent, siteImages } from "@/lib/db/schema";
import { isBlobUrl } from "@/lib/site-images/urls";

// 刪掉已經沒有任何地方在用的 Blob 檔案（圖片位置、文字區塊、商品照片都會檢查）。
// 失敗只記 log，不影響存檔。
export const cleanupBlobs = async (candidates: string[]) => {
  const blobUrls = [...new Set(candidates.filter(isBlobUrl))];
  if (blobUrls.length === 0) return;

  const db = requireDb();
  const usedInImages = await db
    .select({ url: siteImages.url })
    .from(siteImages)
    .where(inArray(siteImages.url, blobUrls));
  const used = new Set(usedInImages.map((r) => r.url));

  for (const url of blobUrls) {
    if (used.has(url)) continue;
    const [inContent, inProducts] = await Promise.all([
      db
        .select({ key: siteContent.key })
        .from(siteContent)
        .where(sql`position(${url} in ${siteContent.value}::text) > 0`)
        .limit(1),
      db
        .select({ id: products.id })
        .from(products)
        .where(sql`${products.images} @> ${JSON.stringify([url])}::jsonb`)
        .limit(1),
    ]);
    if (inContent.length > 0 || inProducts.length > 0) used.add(url);
  }

  const orphans = blobUrls.filter((u) => !used.has(u));
  if (orphans.length === 0) return;
  try {
    await del(orphans);
  } catch (error) {
    console.error("[admin] 刪除 Blob 檔案失敗", orphans, error);
  }
};
