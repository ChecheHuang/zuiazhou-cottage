"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { cleanupBlobs } from "@/lib/admin/blob-cleanup";
import { requireAdmin } from "@/lib/admin-auth";
import { requireDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { BLOCK_MAP } from "@/lib/site-content/registry";
import {
  collectImageUrls,
  validateBlockValue,
} from "@/lib/site-content/schema";
import { SITE_CONTENT_TAG } from "@/lib/site-content/server";

export type ContentSaveResult = { ok: true } | { ok: false; error: string };

const refreshSite = () => {
  revalidateTag(SITE_CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");
};

const readStored = async (key: string) => {
  const db = requireDb();
  const rows = await db
    .select({ value: siteContent.value })
    .from(siteContent)
    .where(eq(siteContent.key, key))
    .limit(1);
  return rows[0]?.value;
};

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const saveContent = async (
  key: string,
  value: unknown,
): Promise<ContentSaveResult> => {
  try {
    await requireAdmin();
    const block = BLOCK_MAP.get(key);
    if (!block) return { ok: false, error: "找不到這個文字區塊" };

    const checked = validateBlockValue(block, value);
    if (!checked.ok) return { ok: false, error: checked.error };

    const db = requireDb();
    const previous = await readStored(key);
    const isDefault =
      JSON.stringify(checked.value) === JSON.stringify(block.defaults);

    if (isDefault) {
      await db.delete(siteContent).where(eq(siteContent.key, key));
    } else {
      await db
        .insert(siteContent)
        .values({ key, value: checked.value, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: siteContent.key,
          set: { value: checked.value, updatedAt: new Date() },
        });
    }

    const nextUrls = new Set(collectImageUrls(block.fields, checked.value));
    await cleanupBlobs(
      collectImageUrls(block.fields, previous).filter((u) => !nextUrls.has(u)),
    );
    refreshSite();
    return { ok: true };
  } catch (error) {
    console.error("[admin] saveContent 失敗", key, error);
    return { ok: false, error: errorMessage(error, "儲存失敗") };
  }
};

export const resetContent = async (key: string): Promise<ContentSaveResult> => {
  try {
    await requireAdmin();
    const block = BLOCK_MAP.get(key);
    if (!block) return { ok: false, error: "找不到這個文字區塊" };
    const db = requireDb();
    const previous = await readStored(key);
    await db.delete(siteContent).where(eq(siteContent.key, key));
    await cleanupBlobs(collectImageUrls(block.fields, previous));
    refreshSite();
    return { ok: true };
  } catch (error) {
    console.error("[admin] resetContent 失敗", key, error);
    return { ok: false, error: errorMessage(error, "恢復預設失敗") };
  }
};
