import "server-only";
import { and, asc, gte, lte } from "drizzle-orm";
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
  if (!db) return { bookings: [], closedDays: [] as string[] };
  const [bookings, closed] = await Promise.all([
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
  ]);
  return { bookings, closedDays: closed.map((c) => c.date) };
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
    const { bookings, closedDays } = await getCachedPublicRange(from, to);
    return {
      from,
      to,
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
    return { from, to, statuses: {} };
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

/** 後台用的場地名稱清單（來自寶寶派對頁的場地方案） */
export const roomNamesFrom = (plans: { title: string }[]) =>
  plans.map((p) => roomName(p.title)).filter(Boolean);
