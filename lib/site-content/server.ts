import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { BLOCKS, BLOCK_MAP } from "./registry";
import {
  mergeBlockValue,
  validateBlockValue,
  type ContentBlock,
  type ContentRecord,
} from "./schema";

export const SITE_CONTENT_TAG = "site-content";
export type ContentOverrides = Record<string, unknown>;

// 開發／build 時檢查每個區塊的預設值是否符合欄位定義，寫錯會直接報錯
const assertDefaults = () => {
  const seen = new Set<string>();
  for (const block of BLOCKS) {
    if (seen.has(block.key)) throw new Error(`文字區塊 key 重複：${block.key}`);
    seen.add(block.key);
    const r = validateBlockValue(block, block.defaults);
    if (!r.ok) {
      throw new Error(
        `文字區塊 ${block.key} 的預設值不符合欄位定義：${r.error}`,
      );
    }
  }
};
assertDefaults();

const loadOverrides = async (): Promise<ContentOverrides> => {
  if (!db) return {};
  const rows = await db
    .select({ key: siteContent.key, value: siteContent.value })
    .from(siteContent);
  return Object.fromEntries(
    rows.filter((r) => BLOCK_MAP.has(r.key)).map((r) => [r.key, r.value]),
  );
};

const getCachedOverrides = unstable_cache(loadOverrides, ["site-content"], {
  tags: [SITE_CONTENT_TAG],
});

// 前台用：有快取；資料庫連不上時退回預設文字
export const getContentOverrides = async (): Promise<ContentOverrides> => {
  try {
    return await getCachedOverrides();
  } catch (error) {
    console.error("[site-content] 讀取資料庫失敗，改用預設文字", error);
    return {};
  }
};

// Server Component 用：await getContent(siteBusiness)
export const getContent = async <T extends ContentRecord>(
  block: ContentBlock<T>,
): Promise<T> =>
  mergeBlockValue(block, (await getContentOverrides())[block.key]);

// 後台用：不經過快取
export const getContentOverridesFresh = loadOverrides;
