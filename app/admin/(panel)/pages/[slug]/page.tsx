import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { SlotEditor } from "@/components/admin/SlotEditor";
import { findSection, resolveSection } from "@/lib/admin/page-sections";
import { navParentLabel, pageSectionHref } from "@/lib/admin/sections";
import { mergeBlockValue } from "@/lib/site-content/schema";
import { getContentOverridesFresh } from "@/lib/site-content/server";
import { getSiteImageOverridesFresh } from "@/lib/site-images/server";

// 依網頁分頁：同一頁的圖片位置與文字區塊放在一起編輯
export default async function AdminPageSectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const section = findSection(slug);
  if (!section) notFound();

  const { blocks, slots } = resolveSection(section);
  const parent = navParentLabel(pageSectionHref(section.slug));
  const [imageOverrides, contentOverrides] = await Promise.all([
    slots.length > 0 ? getSiteImageOverridesFresh() : Promise.resolve({}),
    blocks.length > 0 ? getContentOverridesFresh() : Promise.resolve({}),
  ]);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          {parent && (
            <p className="mb-1 text-xs text-brand-ink/50">{parent} ›</p>
          )}
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-brand">
            <span aria-hidden>{section.icon}</span>
            {section.label}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">
            {slots.length > 0 &&
              "圖片上傳、刪除或調整順序後會自動儲存。"}
            {blocks.length > 0 &&
              "文字修改後按「儲存」才會生效，「恢復預設」會回到原本內建的內容。"}
            網站幾秒內就會更新。
          </p>
        </div>
        {section.href && (
          <a
            href={section.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-brand-soft/60 bg-white px-4 py-2 text-sm text-brand-ink hover:bg-brand-soft/30"
          >
            查看此頁 ↗
          </a>
        )}
      </div>

      {/* 區塊多時的快速跳轉 */}
      {slots.length + blocks.length > 3 && (
        <nav
          aria-label="本頁區塊"
          className="mt-4 flex flex-wrap gap-2 text-sm"
        >
          {slots.length > 0 && (
            <a
              href="#images"
              className="rounded-full bg-brand/10 px-3 py-1 text-brand hover:bg-brand/15"
            >
              🖼 圖片（{slots.length}）
            </a>
          )}
          {blocks.map((b) => (
            <a
              key={b.key}
              href={`#${encodeURIComponent(b.key)}`}
              className="rounded-full border border-brand-soft/60 bg-white px-3 py-1 text-brand-ink hover:bg-brand-soft/30"
            >
              {b.label}
            </a>
          ))}
        </nav>
      )}

      {slots.length > 0 && (
        <section id="images" className="mt-8 scroll-mt-20">
          <h2 className="border-b border-brand-soft/50 pb-2 text-lg font-semibold text-brand">
            圖片
          </h2>
          <div className="mt-4 grid gap-4">
            {slots.map((slot) => {
              const custom = (imageOverrides as Record<string, string[]>)[
                slot.key
              ];
              const isCustom = Boolean(custom && custom.length > 0);
              return (
                <SlotEditor
                  key={slot.key}
                  slotKey={slot.key}
                  label={slot.label}
                  hint={slot.hint}
                  multiple={slot.multiple}
                  defaults={slot.defaults}
                  initialImages={isCustom ? custom : slot.defaults}
                  initialIsCustom={isCustom}
                />
              );
            })}
          </div>
        </section>
      )}

      {blocks.length > 0 && (
        <section className="mt-10">
          {slots.length > 0 && (
            <h2 className="border-b border-brand-soft/50 pb-2 text-lg font-semibold text-brand">
              文字
            </h2>
          )}
          <div className="mt-4 grid gap-6">
            {blocks.map((block) => {
              const stored = (contentOverrides as Record<string, unknown>)[
                block.key
              ];
              return (
                <div
                  key={block.key}
                  id={encodeURIComponent(block.key)}
                  className="scroll-mt-20"
                >
                  <ContentEditor
                    blockKey={block.key}
                    label={block.label}
                    description={block.description}
                    fields={block.fields}
                    defaults={block.defaults}
                    initialValue={mergeBlockValue(block, stored)}
                    initialIsCustom={stored !== undefined}
                    // 區塊少時直接展開；多時先收合，只列標題，點開再編輯
                    defaultOpen={blocks.length <= 2}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
