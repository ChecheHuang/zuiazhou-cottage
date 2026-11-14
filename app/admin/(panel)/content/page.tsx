import Link from "next/link";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { cn } from "@/lib/cn";
import { BLOCKS, BLOCK_PAGES } from "@/lib/site-content/registry";
import { mergeBlockValue } from "@/lib/site-content/schema";
import { getContentOverridesFresh } from "@/lib/site-content/server";

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const current =
    page && BLOCK_PAGES.includes(page) ? page : (BLOCK_PAGES[0] ?? "");
  const overrides = await getContentOverridesFresh();
  const blocks = BLOCKS.filter((b) => b.page === current);

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-brand">網站文字管理</h1>
        <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">
          依頁面分類。修改後按「儲存」才會生效，網站幾秒內就會更新；
          「恢復預設」會回到原本內建的文字。
        </p>
        <nav className="mt-4 flex flex-wrap gap-2">
          {BLOCK_PAGES.map((p) => (
            <Link
              key={p}
              href={`/admin/content?page=${encodeURIComponent(p)}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm",
                p === current
                  ? "border-brand bg-brand text-white"
                  : "border-brand-soft/60 bg-white text-brand-ink hover:bg-brand-soft/30",
              )}
            >
              {p}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-8 grid gap-6">
        {blocks.map((block) => {
          const stored = overrides[block.key];
          return (
            <ContentEditor
              key={block.key}
              blockKey={block.key}
              label={block.label}
              description={block.description}
              fields={block.fields}
              defaults={block.defaults}
              initialValue={mergeBlockValue(block, stored)}
              initialIsCustom={stored !== undefined}
            />
          );
        })}
        {blocks.length === 0 && (
          <p className="text-sm text-brand-ink/60">
            這一頁目前沒有可編輯的文字。
          </p>
        )}
      </div>
    </>
  );
}
