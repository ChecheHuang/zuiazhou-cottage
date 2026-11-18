import Link from "next/link";
import { ScheduleBoard } from "@/components/admin/ScheduleBoard";
import { partyPlans } from "@/lib/site-content/blocks/baby-party";
import { scheduleSettings } from "@/lib/site-content/blocks/schedule";
import { mergeBlockValue } from "@/lib/site-content/schema";
import { getContentOverridesFresh } from "@/lib/site-content/server";
import { listBookingsBetween, roomNamesFrom } from "@/lib/schedule/server";
import {
  isMonthKey,
  monthRange,
  parseScheduleConfig,
  slotCapacity,
  todayKey,
} from "@/lib/schedule/shared";
import { pageSectionHref } from "@/lib/admin/sections";

export default async function AdminSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const today = todayKey();
  const month = isMonthKey(monthParam) ? monthParam : today.slice(0, 7);
  const { from, to } = monthRange(month);

  const [overrides, data] = await Promise.all([
    getContentOverridesFresh(),
    listBookingsBetween(from, to),
  ]);
  const config = parseScheduleConfig(
    mergeBlockValue(scheduleSettings, overrides[scheduleSettings.key]),
  );
  const rooms = roomNamesFrom(
    mergeBlockValue(partyPlans, overrides[partyPlans.key]).plans,
  );

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs text-brand-ink/50">預約 ›</p>
          <h1 className="text-2xl font-semibold text-brand">排程日曆</h1>
          <p className="mt-2 max-w-2xl text-sm text-brand-ink/70">
            點日期查看當天的場次。每個場次最多同時{" "}
            {slotCapacity(config, rooms.length)} 場；首頁的檔期日曆會依這裡的預約自動顯示「有空／快滿／已滿」，客人姓名電話不會出現在前台。
          </p>
        </div>
        <Link
          href={pageSectionHref("schedule-settings")}
          className="rounded-full border border-brand/30 px-5 py-2 text-sm font-medium text-brand hover:bg-brand-soft/20"
        >
          ⏰ 場次設定
        </Link>
      </div>
      <div className="mt-6">
        <ScheduleBoard
          month={month}
          today={today}
          slots={config.slots}
          rooms={rooms}
          bookings={data.bookings}
          closedDays={data.closedDays}
        />
      </div>
    </>
  );
}
