"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createBooking,
  deleteBooking,
  setDayClosed,
  updateBooking,
  type ScheduleActionResult,
} from "@/app/admin/(panel)/schedule/actions";
import { cn } from "@/lib/cn";
import { useUnsavedGuard } from "./useUnsavedGuard";
import {
  BOOKING_STATUS_LABEL,
  formatDateLabel,
  fromDateKey,
  toDateKey,
  type Booking,
  type BookingInput,
  type BookingStatus,
  type ClosedDay,
} from "@/lib/schedule/shared";

// 後台排程日曆：上面是月曆（每天顯示幾場），點日期後下面列出當天「場次 × 場地」。

const WEEK = ["日", "一", "二", "三", "四", "五", "六"];

const shiftMonth = (month: string, delta: number) => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

/** 月曆格子：前面補上個月的空格，讓 1 號對齊星期 */
const monthCells = (month: string) => {
  const first = fromDateKey(`${month}-01`);
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return [
    ...Array.from({ length: first.getDay() }, () => null),
    ...Array.from({ length: days }, (_, i) =>
      toDateKey(new Date(first.getFullYear(), first.getMonth(), i + 1)),
    ),
  ];
};

type Draft = BookingInput & { id?: number };

const emptyDraft = (date: string, slot: string, room: string): Draft => ({
  date,
  slot,
  room,
  status: "hold",
  customer: "",
  phone: "",
  note: "",
});

const STATUS_STYLE: Record<BookingStatus, string> = {
  hold: "bg-amber-50 text-amber-800 ring-amber-200",
  confirmed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export const ScheduleBoard = ({
  month,
  today,
  slots,
  rooms,
  bookings,
  closedDays,
}: {
  month: string;
  today: string;
  slots: string[];
  rooms: string[];
  bookings: Booking[];
  closedDays: ClosedDay[];
}) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState(
    today.startsWith(month) ? today : `${month}-01`,
  );
  const [draft, setDraft] = useState<Draft>();
  const [closeNote, setCloseNote] = useState("");
  const [error, setError] = useState<string>();
  // 預約表單填到一半就換頁時提醒
  useUnsavedGuard(
    "schedule-draft",
    Boolean(draft && (draft.customer || draft.phone || draft.note)),
  );

  const byDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of bookings) map.set(b.date, [...(map.get(b.date) ?? []), b]);
    return map;
  }, [bookings]);
  const closedMap = useMemo(
    () => new Map(closedDays.map((c) => [c.date, c.note])),
    [closedDays],
  );

  const dayBookings = byDate.get(selected) ?? [];
  const isClosed = closedMap.has(selected);
  // 舊場次或已改名的場地也要列出來，才不會有預約看不到
  const daySlots = [...new Set([...slots, ...dayBookings.map((b) => b.slot)])].sort();
  const dayRooms = [...new Set([...rooms, ...dayBookings.map((b) => b.room)])];
  const find = (slot: string, room: string) =>
    dayBookings.find((b) => b.slot === slot && b.room === room);

  const run = (action: () => Promise<ScheduleActionResult>, after?: () => void) => {
    setError(undefined);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      after?.();
      router.refresh();
    });
  };

  const save = () => {
    if (!draft) return;
    const { id, ...input } = draft;
    run(
      () => (id === undefined ? createBooking(input) : updateBooking(id, input)),
      () => setDraft(undefined),
    );
  };

  const remove = (b: Booking) => {
    if (!confirm(`確定刪除 ${formatDateLabel(b.date)} ${b.slot}「${b.room}」的預約？`)) return;
    run(() => deleteBooking(b.id), () => setDraft(undefined));
  };

  const selectDay = (date: string) => {
    setSelected(date);
    setDraft(undefined);
    setError(undefined);
  };

  return (
    <div className="grid gap-6">
      {/* ─── 月曆 ─── */}
      <section className="rounded-3xl border border-brand-soft/40 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href={`/admin/schedule?month=${shiftMonth(month, -1)}`}
            className="rounded-full px-3 py-1.5 text-sm text-brand hover:bg-brand-soft/30"
          >
            ← 上個月
          </Link>
          <h2 className="text-lg font-semibold text-brand">
            {Number(month.slice(0, 4))} 年 {Number(month.slice(5))} 月
          </h2>
          <Link
            href={`/admin/schedule?month=${shiftMonth(month, 1)}`}
            className="rounded-full px-3 py-1.5 text-sm text-brand hover:bg-brand-soft/30"
          >
            下個月 →
          </Link>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-brand-ink/60">
          {WEEK.map((w) => (
            <div key={w} className="py-1">
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {monthCells(month).map((date, i) => {
            if (!date) return <div key={`blank-${i}`} />;
            const n = byDate.get(date)?.length ?? 0;
            const closed = closedMap.has(date);
            const past = date < today;
            return (
              <button
                key={date}
                type="button"
                onClick={() => selectDay(date)}
                aria-pressed={selected === date}
                className={cn(
                  "flex min-h-16 flex-col items-center gap-1 rounded-xl border p-1.5 text-sm transition-colors sm:min-h-20",
                  selected === date
                    ? "border-brand bg-brand/5"
                    : "border-transparent hover:bg-brand-soft/20",
                  past && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-full",
                    date === today && "bg-brand text-white",
                  )}
                >
                  {Number(date.slice(8))}
                </span>
                {closed ? (
                  <span className="rounded-full bg-brand-ink/10 px-1.5 text-[11px] text-brand-ink/70">
                    公休
                  </span>
                ) : n > 0 ? (
                  <span className="rounded-full bg-brand-soft/50 px-1.5 text-[11px] font-medium text-brand">
                    {n} 場
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── 當天場次 ─── */}
      <section className="rounded-3xl border border-brand-soft/40 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-brand">
            {formatDateLabel(selected)}
            <span className="ml-2 text-sm font-normal text-brand-ink/60">
              {isClosed ? "公休" : `${dayBookings.length} 場`}
            </span>
          </h2>
          {isClosed ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => setDayClosed(selected, false))}
              className="rounded-full border border-brand/30 px-4 py-1.5 text-sm text-brand hover:bg-brand-soft/20 disabled:opacity-50"
            >
              取消公休
            </button>
          ) : (
            dayBookings.length === 0 && (
              <div className="flex items-center gap-2">
                <input
                  value={closeNote}
                  onChange={(e) => setCloseNote(e.target.value)}
                  placeholder="公休原因（選填，只有後台看得到）"
                  className="w-56 rounded-full border border-brand-soft/60 px-3 py-1.5 text-sm"
                />
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    run(() => setDayClosed(selected, true, closeNote), () => setCloseNote(""))
                  }
                  className="rounded-full border border-brand/30 px-4 py-1.5 text-sm text-brand hover:bg-brand-soft/20 disabled:opacity-50"
                >
                  設為公休
                </button>
              </div>
            )
          )}
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {isClosed ? (
          <p className="mt-4 text-sm text-brand-ink/70">
            這天整天不接場，首頁日曆會顯示「公休」。
            {closedMap.get(selected) && `（${closedMap.get(selected)}）`}
          </p>
        ) : daySlots.length === 0 ? (
          <p className="mt-4 text-sm text-brand-ink/70">
            還沒有設定場次，請先到「場次設定」填每天的場次時間。
          </p>
        ) : (
          <div className="mt-4 grid gap-4">
            {daySlots.map((slot) => (
              <div key={slot} className="rounded-2xl bg-brand-beige/40 p-3">
                <p className="mb-2 text-sm font-semibold text-brand-ink">
                  {slot}
                  {!slots.includes(slot) && (
                    <span className="ml-2 text-xs font-normal text-amber-700">
                      （已不在場次設定中）
                    </span>
                  )}
                </p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {dayRooms.map((room) => {
                    const b = find(slot, room);
                    return b ? (
                      <button
                        key={room}
                        type="button"
                        onClick={() => setDraft({ ...b })}
                        className={cn(
                          "rounded-xl px-3 py-2 text-left text-sm ring-1 transition-shadow hover:shadow",
                          STATUS_STYLE[b.status],
                        )}
                      >
                        <span className="block text-xs opacity-80">
                          {room}・{BOOKING_STATUS_LABEL[b.status]}
                        </span>
                        <span className="block truncate font-medium">
                          {b.customer || "（未填姓名）"}
                        </span>
                      </button>
                    ) : (
                      <button
                        key={room}
                        type="button"
                        onClick={() => setDraft(emptyDraft(selected, slot, room))}
                        className="rounded-xl border border-dashed border-brand-soft px-3 py-2 text-left text-sm text-brand-ink/60 hover:border-brand hover:text-brand"
                      >
                        <span className="block text-xs">{room}</span>
                        <span className="block">＋ 新增預約</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── 新增／編輯 ─── */}
      {draft && (
        <section
          aria-label={draft.id === undefined ? "新增預約" : "編輯預約"}
          className="rounded-3xl border border-brand bg-white p-4 shadow-md sm:p-6"
        >
          <h2 className="text-lg font-semibold text-brand">
            {draft.id === undefined ? "新增預約" : "編輯預約"}・{formatDateLabel(draft.date)}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              場次
              <select
                value={draft.slot}
                onChange={(e) => setDraft({ ...draft, slot: e.target.value })}
                className="rounded-xl border border-brand-soft/60 px-3 py-2"
              >
                {daySlots.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              場地
              <select
                value={draft.room}
                onChange={(e) => setDraft({ ...draft, room: e.target.value })}
                className="rounded-xl border border-brand-soft/60 px-3 py-2"
              >
                {dayRooms.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <fieldset className="grid gap-1 text-sm sm:col-span-2">
              <legend className="mb-1">狀態</legend>
              <div className="flex gap-2">
                {(Object.keys(BOOKING_STATUS_LABEL) as BookingStatus[]).map((s) => (
                  <label
                    key={s}
                    className={cn(
                      "cursor-pointer rounded-full px-4 py-1.5 ring-1",
                      draft.status === s ? STATUS_STYLE[s] : "ring-brand-soft/60",
                    )}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={draft.status === s}
                      onChange={() => setDraft({ ...draft, status: s })}
                      className="sr-only"
                    />
                    {BOOKING_STATUS_LABEL[s]}
                    {s === "hold" && "（待付訂金）"}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="grid gap-1 text-sm">
              客人稱呼
              <input
                value={draft.customer}
                onChange={(e) => setDraft({ ...draft, customer: e.target.value })}
                placeholder="例如 王媽媽／小寶抓周"
                className="rounded-xl border border-brand-soft/60 px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              聯絡電話
              <input
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                inputMode="tel"
                className="rounded-xl border border-brand-soft/60 px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm sm:col-span-2">
              備註
              <textarea
                value={draft.note}
                onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                rows={3}
                placeholder="派對類型、人數、加購攝影／餐點、主持人…"
                className="rounded-xl border border-brand-soft/60 px-3 py-2"
              />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={save}
              className="rounded-full bg-brand px-6 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {pending ? "儲存中…" : "儲存"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => setDraft(undefined)}
              className="rounded-full px-4 py-2 text-sm text-brand-ink/70 hover:bg-brand-ink/5"
            >
              取消
            </button>
            {draft.id !== undefined && (
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  const b = bookings.find((x) => x.id === draft.id);
                  if (b) remove(b);
                }}
                className="ml-auto rounded-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                刪除這筆預約
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
