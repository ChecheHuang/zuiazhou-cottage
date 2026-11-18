import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  listBookingsBetween,
  listUpcomingHolds,
} from "@/lib/schedule/server";
import {
  addDays,
  BOOKING_STATUS_LABEL,
  formatDateLabel,
  todayKey,
  type Booking,
} from "@/lib/schedule/shared";

// 後台總覽最上方：店家一登入最想看的「近期場次」與「還沒付訂金」名單

const DAYS = 7;

const scheduleHref = (date: string) =>
  `/admin/schedule?month=${date.slice(0, 7)}`;

const BookingRow = ({ b, showDate }: { b: Booking; showDate?: boolean }) => (
  <li>
    <Link
      href={scheduleHref(b.date)}
      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-brand-soft/20"
    >
      <span className="w-12 shrink-0 font-medium text-brand-ink">{b.slot}</span>
      <span className="min-w-0 flex-1 truncate">
        {showDate && (
          <span className="mr-2 text-brand-ink/60">{formatDateLabel(b.date)}</span>
        )}
        {b.customer || "（未填姓名）"}
        <span className="ml-2 text-brand-ink/50">{b.room}</span>
      </span>
      <span
        className={cn(
          "shrink-0 rounded-full px-2 py-0.5 text-xs",
          b.status === "hold"
            ? "bg-amber-50 text-amber-800"
            : "bg-emerald-50 text-emerald-800",
        )}
      >
        {BOOKING_STATUS_LABEL[b.status]}
      </span>
    </Link>
  </li>
);

export const UpcomingBookings = async () => {
  const today = todayKey();
  const [{ bookings, closedDays }, holds] = await Promise.all([
    listBookingsBetween(today, addDays(today, DAYS - 1)),
    listUpcomingHolds(today),
  ]);
  const closed = new Set(closedDays.map((c) => c.date));
  const dates = Array.from({ length: DAYS }, (_, i) => addDays(today, i));

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
      <section className="rounded-2xl border border-brand-soft/40 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 pt-4">
          <h2 className="text-lg font-semibold text-brand">📅 未來 {DAYS} 天的場次</h2>
          <Link
            href="/admin/schedule"
            className="rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            ＋ 登記預約
          </Link>
        </div>
        <ul className="mt-3 divide-y divide-brand-soft/30 border-t border-brand-soft/30">
          {dates.map((date) => {
            const items = bookings.filter((b) => b.date === date);
            return (
              <li key={date}>
                <p
                  className={cn(
                    "bg-brand-beige/40 px-4 py-1.5 text-xs font-medium",
                    date === today ? "text-brand" : "text-brand-ink/70",
                  )}
                >
                  {date === today ? "今天 " : ""}
                  {formatDateLabel(date)}
                  {closed.has(date) && "・公休"}
                  {!closed.has(date) && items.length === 0 && "・沒有預約"}
                </p>
                {items.length > 0 && (
                  <ul className="divide-y divide-brand-soft/20">
                    {items.map((b) => (
                      <BookingRow key={b.id} b={b} />
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="h-fit rounded-2xl border border-amber-200 bg-white shadow-sm">
        <h2 className="px-4 pt-4 text-lg font-semibold text-amber-800">
          ⏳ 保留中・待付訂金
        </h2>
        <p className="px-4 pt-1 text-xs text-brand-ink/60">
          收到訂金後，到排程日曆把狀態改成「已確認」。
        </p>
        {holds.length === 0 ? (
          <p className="px-4 py-5 text-sm text-brand-ink/60">目前沒有待付訂金的預約。</p>
        ) : (
          <ul className="mt-3 divide-y divide-brand-soft/30 border-t border-brand-soft/30">
            {holds.map((b) => (
              <BookingRow key={b.id} b={b} showDate />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
