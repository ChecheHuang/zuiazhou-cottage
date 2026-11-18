import Link from "next/link";
import { UpcomingBookings } from "@/components/admin/UpcomingBookings";
import { loadOverview, type SectionStat } from "@/lib/admin/overview";
import { pageSectionHref } from "@/lib/admin/sections";

const timeFormat = new Intl.DateTimeFormat("zh-TW", {
  timeZone: "Asia/Taipei",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const SectionCard = ({ stat }: { stat: SectionStat }) => {
  const { section } = stat;
  const parts = [
    stat.slots > 0 && `圖片 ${stat.customSlots}/${stat.slots}`,
    stat.blocks > 0 && `文字 ${stat.customBlocks}/${stat.blocks}`,
  ].filter(Boolean);
  return (
    <Link
      href={pageSectionHref(section.slug)}
      className="group flex items-center gap-3 rounded-2xl border border-brand-soft/40 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-soft hover:shadow-md"
    >
      <span aria-hidden className="text-2xl">
        {section.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-brand-ink group-hover:text-brand">
          {section.label}
        </span>
        <span className="mt-0.5 block text-xs text-brand-ink/55">
          已自訂 {parts.join("・")}
        </span>
      </span>
      <span aria-hidden className="text-brand-ink/30 group-hover:text-brand">
        →
      </span>
    </Link>
  );
};

export default async function AdminOverviewPage() {
  const { stats, totals, recent, products, hasDb } = await loadOverview();
  const sitePages = stats.filter((s) => s.section.href);
  const settings = stats.filter((s) => !s.section.href);

  return (
    <>
      <h1 className="text-2xl font-semibold text-brand">總覽</h1>
      <p className="mt-2 text-sm text-brand-ink/70">
        最上面是近期的預約；要改網站內容，從左邊選單或下方選擇頁面，同一頁的圖片和文字都在同一個地方。
      </p>

      {!hasDb && (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          目前沒有連上資料庫，網站顯示的是程式內建的預設內容，後台無法存檔。
        </p>
      )}

      {hasDb && <UpcomingBookings />}

      {/* 數字摘要 */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/products"
          className="rounded-2xl border border-brand-soft/40 bg-white p-5 shadow-sm hover:border-brand-soft"
        >
          <p className="text-sm text-brand-ink/60">上架中商品</p>
          <p className="mt-1 text-3xl font-semibold text-brand">
            {products.published}
            <span className="ml-1 text-base font-normal text-brand-ink/50">
              / {products.total}
            </span>
          </p>
        </Link>
        <div className="rounded-2xl border border-brand-soft/40 bg-white p-5 shadow-sm">
          <p className="text-sm text-brand-ink/60">已自訂的文字區塊</p>
          <p className="mt-1 text-3xl font-semibold text-brand">
            {totals.customBlocks}
            <span className="ml-1 text-base font-normal text-brand-ink/50">
              / {totals.blocks}
            </span>
          </p>
        </div>
        <div className="rounded-2xl border border-brand-soft/40 bg-white p-5 shadow-sm">
          <p className="text-sm text-brand-ink/60">已換過的圖片位置</p>
          <p className="mt-1 text-3xl font-semibold text-brand">
            {totals.customSlots}
            <span className="ml-1 text-base font-normal text-brand-ink/50">
              / {totals.slots}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div>
          <h2 className="text-lg font-semibold text-brand">網站頁面</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {sitePages.map((s) => (
              <SectionCard key={s.section.slug} stat={s} />
            ))}
          </div>

          <h2 className="mt-8 text-lg font-semibold text-brand">全站設定</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {settings.map((s) => (
              <SectionCard key={s.section.slug} stat={s} />
            ))}
          </div>
        </div>

        <aside>
          <h2 className="text-lg font-semibold text-brand">最近修改</h2>
          <div className="mt-3 rounded-2xl border border-brand-soft/40 bg-white shadow-sm">
            {recent.length === 0 ? (
              <p className="p-5 text-sm text-brand-ink/60">還沒有修改紀錄。</p>
            ) : (
              <ul className="divide-y divide-brand-soft/30">
                {recent.map((r) => (
                  <li key={`${r.href}-${r.at.getTime()}`}>
                    <Link
                      href={r.href}
                      className="block px-4 py-3 hover:bg-brand-soft/20"
                    >
                      <span className="block truncate text-sm text-brand-ink">
                        {r.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-brand-ink/50">
                        {r.where}・{timeFormat.format(r.at)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/admin/products/new"
              className="rounded-full bg-brand px-5 py-2.5 text-center text-sm font-medium text-white hover:opacity-90"
            >
              ＋ 新增商品
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
