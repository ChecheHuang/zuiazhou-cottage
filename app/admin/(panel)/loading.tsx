// 後台換頁時立刻顯示的骨架畫面（左側選單不動，只有右邊內容區換成骨架）。
// 有這個檔案 Next 才會預先載入後台頁面的外框，點選單時不用等伺服器回應才有反應。
export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="載入中" className="animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-brand-soft/40" />
      <div className="mt-3 h-4 w-80 max-w-full rounded bg-brand-soft/30" />
      <div className="mt-8 grid gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-brand-soft/30 bg-white p-6"
          >
            <div className="h-5 w-40 rounded bg-brand-soft/40" />
            <div className="mt-4 h-10 w-full rounded-xl bg-brand-soft/20" />
            <div className="mt-3 h-10 w-2/3 rounded-xl bg-brand-soft/20" />
          </div>
        ))}
      </div>
    </div>
  );
}
