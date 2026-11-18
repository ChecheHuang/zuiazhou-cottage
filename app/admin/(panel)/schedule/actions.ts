"use server";

import { and, count, eq, ne } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { requireDb } from "@/lib/db";
import { scheduleBookings, scheduleClosedDays } from "@/lib/db/schema";
import { partyPlans } from "@/lib/site-content/blocks/baby-party";
import { scheduleSettings } from "@/lib/site-content/blocks/schedule";
import { mergeBlockValue } from "@/lib/site-content/schema";
import { getContentOverridesFresh } from "@/lib/site-content/server";
import { SCHEDULE_TAG } from "@/lib/schedule/server";
import {
  isDateKey,
  parseScheduleConfig,
  slotCapacity,
  validateBookingInput,
  type BookingInput,
} from "@/lib/schedule/shared";

export type ScheduleActionResult =
  { ok: true; id?: number } | { ok: false; error: string };

const refreshSite = () => {
  revalidateTag(SCHEDULE_TAG, { expire: 0 });
  revalidatePath("/", "layout");
};

const fail = (scope: string, error: unknown): ScheduleActionResult => {
  console.error(`[admin] ${scope} 失敗`, error);
  return {
    ok: false,
    error: error instanceof Error ? error.message : "操作失敗",
  };
};

// 寫入前再檢查一次：同一場次的場數不能超過上限、同一間場地不能重複
const checkSlot = async (
  input: BookingInput,
  excludeId?: number,
): Promise<string | null> => {
  const overrides = await getContentOverridesFresh();
  const config = parseScheduleConfig(
    mergeBlockValue(scheduleSettings, overrides[scheduleSettings.key]),
  );
  const plans = mergeBlockValue(partyPlans, overrides[partyPlans.key]).plans;
  const capacity = slotCapacity(config, plans.length);

  const sameSlot = and(
    eq(scheduleBookings.date, input.date),
    eq(scheduleBookings.slot, input.slot),
    excludeId === undefined ? undefined : ne(scheduleBookings.id, excludeId),
  );
  const db = requireDb();
  const [{ n }] = await db
    .select({ n: count() })
    .from(scheduleBookings)
    .where(sameSlot);
  if (n >= capacity) {
    return `這個場次已經有 ${n} 場，達到「同一場次最多同時幾場」的上限（${capacity}）`;
  }
  const [{ n: roomTaken }] = await db
    .select({ n: count() })
    .from(scheduleBookings)
    .where(and(sameSlot, eq(scheduleBookings.room, input.room)));
  if (roomTaken > 0) return `「${input.room}」這個場次已經被預約了`;

  const closed = await db
    .select({ date: scheduleClosedDays.date })
    .from(scheduleClosedDays)
    .where(eq(scheduleClosedDays.date, input.date))
    .limit(1);
  if (closed.length > 0) return "這天設為公休，請先取消公休再新增預約";
  return null;
};

export const createBooking = async (
  raw: unknown,
): Promise<ScheduleActionResult> => {
  try {
    await requireAdmin();
    const checked = validateBookingInput(raw);
    if (!checked.ok) return checked;
    const conflict = await checkSlot(checked.value);
    if (conflict) return { ok: false, error: conflict };
    const [row] = await requireDb()
      .insert(scheduleBookings)
      .values(checked.value)
      .returning({ id: scheduleBookings.id });
    refreshSite();
    return { ok: true, id: row.id };
  } catch (error) {
    return fail("createBooking", error);
  }
};

export const updateBooking = async (
  id: number,
  raw: unknown,
): Promise<ScheduleActionResult> => {
  try {
    await requireAdmin();
    if (!Number.isInteger(id)) return { ok: false, error: "資料格式錯誤" };
    const checked = validateBookingInput(raw);
    if (!checked.ok) return checked;
    const conflict = await checkSlot(checked.value, id);
    if (conflict) return { ok: false, error: conflict };
    const rows = await requireDb()
      .update(scheduleBookings)
      .set({ ...checked.value, updatedAt: new Date() })
      .where(eq(scheduleBookings.id, id))
      .returning({ id: scheduleBookings.id });
    if (rows.length === 0) return { ok: false, error: "找不到這筆預約" };
    refreshSite();
    return { ok: true, id };
  } catch (error) {
    return fail("updateBooking", error);
  }
};

export const deleteBooking = async (
  id: number,
): Promise<ScheduleActionResult> => {
  try {
    await requireAdmin();
    if (!Number.isInteger(id)) return { ok: false, error: "資料格式錯誤" };
    await requireDb().delete(scheduleBookings).where(eq(scheduleBookings.id, id));
    refreshSite();
    return { ok: true };
  } catch (error) {
    return fail("deleteBooking", error);
  }
};

export const setDayClosed = async (
  date: string,
  closed: boolean,
  note = "",
): Promise<ScheduleActionResult> => {
  try {
    await requireAdmin();
    if (!isDateKey(date)) return { ok: false, error: "日期格式錯誤" };
    const db = requireDb();
    if (closed) {
      const [{ n }] = await db
        .select({ n: count() })
        .from(scheduleBookings)
        .where(eq(scheduleBookings.date, date));
      if (n > 0) {
        return { ok: false, error: `這天還有 ${n} 筆預約，請先處理再設為公休` };
      }
      await db
        .insert(scheduleClosedDays)
        .values({ date, note: note.trim().slice(0, 200) })
        .onConflictDoUpdate({
          target: scheduleClosedDays.date,
          set: { note: note.trim().slice(0, 200) },
        });
    } else {
      await db.delete(scheduleClosedDays).where(eq(scheduleClosedDays.date, date));
    }
    refreshSite();
    return { ok: true };
  } catch (error) {
    return fail("setDayClosed", error);
  }
};
