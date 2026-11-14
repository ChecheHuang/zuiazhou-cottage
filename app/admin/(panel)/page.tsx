import { SlotEditor } from "@/components/admin/SlotEditor";
import { getSiteImageOverridesFresh } from "@/lib/site-images/server";
import { SLOTS, type SlotDef } from "@/lib/site-images/slots";

const groupByPage = (slots: SlotDef[]) =>
  slots.reduce<{ page: string; slots: SlotDef[] }[]>((groups, slot) => {
    const last = groups[groups.length - 1];
    if (last && last.page === slot.page) {
      return [
        ...groups.slice(0, -1),
        { ...last, slots: [...last.slots, slot] },
      ];
    }
    return [...groups, { page: slot.page, slots: [slot] }];
  }, []);

export default async function AdminHomePage() {
  const overrides = await getSiteImageOverridesFresh();
  const groups = groupByPage(SLOTS);

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-brand">網站圖片管理</h1>
        <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">
          每個區塊對應網站上的一個位置。上傳、刪除或調整順序後會自動儲存，
          網站幾秒內就會更新。標示「預設」的是程式內建的照片。
        </p>
        <nav className="mt-4 flex flex-wrap gap-2">
          {groups.map((g) => (
            <a
              key={g.page}
              href={`#${encodeURIComponent(g.page)}`}
              className="rounded-full border border-brand-soft/60 bg-white px-4 py-1.5 text-sm text-brand-ink hover:bg-brand-soft/30"
            >
              {g.page}
            </a>
          ))}
        </nav>
      </div>

      {groups.map((g) => (
        <section
          key={g.page}
          id={encodeURIComponent(g.page)}
          className="mt-10 scroll-mt-20"
        >
          <h2 className="border-b border-brand-soft/50 pb-2 text-lg font-semibold text-brand">
            {g.page}
          </h2>
          <div className="mt-4 grid gap-4">
            {g.slots.map((slot) => {
              const custom = overrides[slot.key];
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
      ))}
    </>
  );
}
