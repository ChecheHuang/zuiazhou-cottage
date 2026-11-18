import "server-only";
import { and, asc, eq, gte, lte, max } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { scheduleBookings, scheduleClosedDays } from "@/lib/db/schema";
import { partyPlans } from "@/lib/site-content/blocks/baby-party";
import { scheduleSettings } from "@/lib/site-content/blocks/schedule";
import { getContent } from "@/lib/site-content/server";
import {
  addDays,
  computeDayStatuses,
  parseScheduleConfig,
  roomName,
  todayKey,
  type Booking,
  type ClosedDay,
  type PublicAvailability,
} from "./shared";

export const SCHEDULE_TAG = "schedule";

const bookingColumns = {
  id: scheduleBookings.id,
  date: scheduleBookings.date,
  slot: scheduleBookings.slot,
  room: scheduleBookings.room,
  status: scheduleBookings.status,
  customer: scheduleBookings.customer,
  phone: scheduleBookings.phone,
  note: scheduleBookings.note,
};

// ─── 前台：只回傳每天的狀態，不含任何客人資料 ──────────────────

const loadPublicRange = async (from: string, to: string) => {
  if (!db) {
    return { bookings: [], closedDays: [] as string[], lastEdited: null as string | null };
  }
  const [bookings, closed, [bookingEdit], [closedEdit]] = await Promise.all([
    db
      .select({ date: scheduleBookings.date, slot: scheduleBookings.slot })
      .from(scheduleBookings)
      .where(and(gte(scheduleBookings.date, from), lte(scheduleBookings.date, to))),
    db
      .select({ date: scheduleClosedDays.date })
      .from(scheduleClosedDays)
      .where(
        and(gte(scheduleClosedDays.date, from), lte(scheduleClosedDays.date, to)),
      ),
    // 最後一次在後台新增／修改預約或公休的時間（刪除不留紀錄，所以不算在內）
    db.select({ at: max(scheduleBookings.updatedAt) }).from(scheduleBookings),
    db.select({ at: max(scheduleClosedDays.createdAt) }).from(scheduleClosedDays),
  ]);
  const edits = [bookingEdit?.at, closedEdit?.at].filter((d): d is Date => !!d);
  const lastEdited = edits.length
    ? new Date(Math.max(...edits.map((d) => new Date(d).getTime()))).toISOString()
    : null;
  return { bookings, closedDays: closed.map((c) => c.date), lastEdited };
};

const getCachedPublicRange = unstable_cache(loadPublicRange, ["schedule-public"], {
  tags: [SCHEDULE_TAG],
});

export const getPublicAvailability = async (): Promise<PublicAvailability> => {
  const [settings, plans] = await Promise.all([
    getContent(scheduleSettings),
    getContent(partyPlans),
  ]);
  const config = parseScheduleConfig(settings);
  const from = todayKey();
  const to = addDays(from, config.daysAhead - 1);
  try {
    const { bookings, closedDays, lastEdited } = await getCachedPublicRange(from, to);
    return {
      from,
      to,
      // 存成台灣日期（YYYY-MM-DD）；快取會把 Date 轉成字串，所以這裡一律用 ISO 字串再換算
      updatedOn: lastEdited ? todayKey(new Date(lastEdited)) : null,
      statuses: computeDayStatuses({
        bookings,
        closedDays,
        config,
        roomCount: plans.plans.length,
      }),
    };
  } catch (error) {
    // 讀不到資料庫時全部顯示「有空」，客人仍可用 LINE 詢問
    console.error("[schedule] 讀取檔期失敗", error);
    return { from, to, statuses: {}, updatedOn: null };
  }
};

// ─── 後台（不經快取） ───────────────────────────────────────

export const listBookingsBetween = async (
  from: string,
  to: string,
): Promise<{ bookings: Booking[]; closedDays: ClosedDay[] }> => {
  if (!db) return { bookings: [], closedDays: [] };
  const [bookings, closedDays] = await Promise.all([
    db
      .select(bookingColumns)
      .from(scheduleBookings)
      .where(and(gte(scheduleBookings.date, from), lte(scheduleBookings.date, to)))
      .orderBy(asc(scheduleBookings.date), asc(scheduleBookings.slot)),
    db
      .select({ date: scheduleClosedDays.date, note: scheduleClosedDays.note })
      .from(scheduleClosedDays)
      .where(
        and(gte(scheduleClosedDays.date, from), lte(scheduleClosedDays.date, to)),
      ),
  ]);
  return { bookings, closedDays };
};

/** 後台總覽：今天以後還在「保留中（待付訂金）」的預約，日期近的在前 */
export const listUpcomingHolds = async (from: string, limit = 20): Promise<Booking[]> => {
  if (!db) return [];
  return db
    .select(bookingColumns)
    .from(scheduleBookings)
    .where(and(eq(scheduleBookings.status, "hold"), gte(scheduleBookings.date, from)))
    .orderBy(asc(scheduleBookings.date), asc(scheduleBookings.slot))
    .limit(limit);
};

/** 後台用的場地名稱清單（來自寶寶派對頁的場地方案） */
export const roomNamesFrom = (plans: { title: string }[]) =>
  plans.map((p) => roomName(p.title)).filter(Boolean);
