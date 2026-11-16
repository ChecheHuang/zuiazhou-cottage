import "server-only";
import { desc, max } from "drizzle-orm";
import { resolveSection } from "@/lib/admin/page-sections";
import {
  ALL_PAGE_SECTIONS,
  pageSectionHref,
  type SitePageSection,
} from "@/lib/admin/sections";
import { db } from "@/lib/db";
import { products, siteContent, siteImages } from "@/lib/db/schema";
import { BLOCKS, BLOCK_MAP } from "@/lib/site-content/registry";
import { getContentOverridesFresh } from "@/lib/site-content/server";
import { getSiteImageOverridesFresh } from "@/lib/site-images/server";
import { SLOTS, SLOT_MAP } from "@/lib/site-images/slots";

// 後台總覽頁的資料：各頁自訂了多少、商品數量、最近修改

export interface SectionStat {
  section: SitePageSection;
  slots: number;
  customSlots: number;
  blocks: number;
  customBlocks: number;
}

export interface RecentEdit {
  label: string;
  where: string;
  href: string;
  at: Date;
}

const sectionOfBlockPage = (page: string) =>
  ALL_PAGE_SECTIONS.find((s) => s.blockPages.includes(page));
const sectionOfSlotPage = (page: string) =>
  ALL_PAGE_SECTIONS.find((s) => s.slotPages.includes(page));

const loadRecent = async (): Promise<RecentEdit[]> => {
  if (!db) return [];
  const [contentRows, imageRows, productRows] = await Promise.all([
    db
      .select({ key: siteContent.key, at: siteContent.updatedAt })
      .from(siteContent)
      .orderBy(desc(siteContent.updatedAt))
      .limit(6),
    db
      .select({ slot: siteImages.slot, at: max(siteImages.createdAt) })
      .from(siteImages)
      .groupBy(siteImages.slot)
      .orderBy(desc(max(siteImages.createdAt)))
      .limit(6),
    db
      .select({ id: products.id, name: products.name, at: products.updatedAt })
      .from(products)
      .orderBy(desc(products.updatedAt))
      .limit(6),
  ]);

  const fromContent = contentRows.flatMap((r): RecentEdit[] => {
    const block = BLOCK_MAP.get(r.key);
    const section = block && sectionOfBlockPage(block.page);
    if (!block || !section) return [];
    return [
      {
        label: block.label,
        where: section.label,
        href: `${pageSectionHref(section.slug)}#${encodeURIComponent(block.key)}`,
        at: r.at,
      },
    ];
  });
  const fromImages = imageRows.flatMap((r): RecentEdit[] => {
    const slot = SLOT_MAP.get(r.slot);
    const section = slot && sectionOfSlotPage(slot.page);
    if (!slot || !section || !r.at) return [];
    return [
      {
        label: `圖片：${slot.label}`,
        where: section.label,
        href: `${pageSectionHref(section.slug)}#images`,
        at: r.at,
      },
    ];
  });
  const fromProducts = productRows.map(
    (r): RecentEdit => ({
      label: r.name || "（未命名商品）",
      where: "商品",
      href: `/admin/products/${r.id}`,
      at: r.at,
    }),
  );

  return [...fromContent, ...fromImages, ...fromProducts]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 8);
};

export const loadOverview = async () => {
  const [imageOverrides, contentOverrides, recent, productRows] =
    await Promise.all([
      getSiteImageOverridesFresh(),
      getContentOverridesFresh(),
      loadRecent(),
      db
        ? db.select({ published: products.published }).from(products)
        : Promise.resolve([]),
    ]);

  const stats: SectionStat[] = ALL_PAGE_SECTIONS.map((section) => {
    const { blocks, slots } = resolveSection(section);
    return {
      section,
      slots: slots.length,
      customSlots: slots.filter((s) => (imageOverrides[s.key]?.length ?? 0) > 0)
        .length,
      blocks: blocks.length,
      customBlocks: blocks.filter((b) => b.key in contentOverrides).length,
    };
  });

  // 全站總數用 SLOTS／BLOCKS 算：作品集同時屬於兩頁，逐頁加總會重複
  const totals = {
    slots: SLOTS.length,
    customSlots: SLOTS.filter((s) => (imageOverrides[s.key]?.length ?? 0) > 0)
      .length,
    blocks: BLOCKS.length,
    customBlocks: BLOCKS.filter((b) => b.key in contentOverrides).length,
  };

  return {
    stats,
    totals,
    recent,
    products: {
      total: productRows.length,
      published: productRows.filter((p) => p.published).length,
    },
    hasDb: Boolean(db),
  };
};
