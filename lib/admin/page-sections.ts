import "server-only";
import {
  ADMIN_NAV,
  ALL_PAGE_SECTIONS,
  isNavParent,
  pageSectionHref,
  type SitePageSection,
} from "@/lib/admin/sections";
import { BLOCKS } from "@/lib/site-content/registry";
import type { ContentBlock } from "@/lib/site-content/schema";
import { SLOTS, type SlotDef } from "@/lib/site-images/slots";

// 載入時檢查：每個文字區塊、圖片位置都要在後台某一頁找得到，
// 新增頁面卻忘了加進 lib/admin/sections.ts 時直接在 dev/build 報錯，避免店家改不到。
const assertCovered = () => {
  const blockPages = new Set(ALL_PAGE_SECTIONS.flatMap((p) => p.blockPages));
  const slotPages = new Set(ALL_PAGE_SECTIONS.flatMap((p) => p.slotPages));
  const missingBlocks = [
    ...new Set(BLOCKS.map((b) => b.page).filter((p) => !blockPages.has(p))),
  ];
  const missingSlots = [
    ...new Set(SLOTS.map((s) => s.page).filter((p) => !slotPages.has(p))),
  ];
  // 每個頁面設定也都要出現在左側選單，不然店家點不到
  const navHrefs = new Set(
    ADMIN_NAV.flatMap((g) =>
      g.items.flatMap((i) =>
        isNavParent(i) ? i.children.map((c) => c.href) : [i.href],
      ),
    ),
  );
  const missingNav = ALL_PAGE_SECTIONS.filter(
    (p) => !navHrefs.has(pageSectionHref(p.slug)),
  ).map((p) => p.label);
  if (missingNav.length > 0) {
    throw new Error(
      `[admin] 這些頁面沒有放進 ADMIN_NAV 左側選單：${missingNav.join("、")}`,
    );
  }
  if (missingBlocks.length > 0 || missingSlots.length > 0) {
    throw new Error(
      `[admin] lib/admin/sections.ts 沒有涵蓋這些頁面：` +
        [
          missingBlocks.length && `文字區塊 ${missingBlocks.join("、")}`,
          missingSlots.length && `圖片位置 ${missingSlots.join("、")}`,
        ]
          .filter(Boolean)
          .join("；"),
    );
  }
};
assertCovered();

export interface ResolvedSection {
  section: SitePageSection;
  blocks: ContentBlock[];
  slots: SlotDef[];
}

export const resolveSection = (section: SitePageSection): ResolvedSection => ({
  section,
  blocks: BLOCKS.filter((b) => section.blockPages.includes(b.page)),
  slots: SLOTS.filter((s) => section.slotPages.includes(s.page)),
});

export const findSection = (slug: string) =>
  ALL_PAGE_SECTIONS.find((p) => p.slug === slug);

// 舊網址 /admin/content?page=首頁 → 對應到新的頁面
export const sectionForBlockPage = (blockPage: string) =>
  ALL_PAGE_SECTIONS.find((p) => p.blockPages.includes(blockPage));
