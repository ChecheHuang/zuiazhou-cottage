// 排程日曆：前後台共用的型別與純函式（不碰資料庫）

export type BookingStatus = "hold" | "confirmed";

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  hold: "保留中",
  confirmed: "已確認",
};

export interface Booking {
  id: number;
  date: string;
  slot: string;
  room: string;
  status: BookingStatus;
  customer: string;
  phone: string;
  note: string;
}

export interface ClosedDay {
  date: string;
  note: string;
}

/** 前台日曆每一天的狀態；沒列在裡面的日期視為「有空」 */
export type DayStatus = "open" | "few" | "full" | "closed";

/** 前台日曆的資料：from～to 這段期間，非「有空」的日期與其狀態 */
export interface PublicAvailability {
  from: string;
  to: string;
  statuses: Record<string, DayStatus>;
}

export interface ScheduleConfig {
  slots: string[];
  perSlotLimit: number;
  fewThreshold: number;
  daysAhead: number;
}

// ─── 日期（一律用台灣時間的 YYYY-MM-DD 字串，避免時區差一天） ─────────

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-\d{2}$/;
const SLOT_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export const isDateKey = (s: unknown): s is string =>
  typeof s === "string" &&
  DATE_RE.test(s) &&
  toDateKey(fromDateKey(s)) === s;

export const isMonthKey = (s: unknown): s is string =>
  typeof s === "string" && MONTH_RE.test(s);

/** 台灣今天的日期 */
export const todayKey = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

/** Date（只看年月日）→ YYYY-MM-DD */
export const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** YYYY-MM-DD → 當地午夜的 Date（給日曆元件用） */
export const fromDateKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (key: string, days: number) => {
  const d = fromDateKey(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
};

/** 一個月的第一天與最後一天（YYYY-MM） */
export const monthRange = (month: string) => {
  const [y, m] = month.split("-").map(Number);
  return {
    from: toDateKey(new Date(y, m - 1, 1)),
    to: toDateKey(new Date(y, m, 0)),
  };
};

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

/** 12/20（六） */
export const formatDateLabel = (key: string) => {
  const d = fromDateKey(key);
  return `${d.getMonth() + 1}/${d.getDate()}（${WEEKDAYS[d.getDay()]}）`;
};

// ─── 設定（後台文字區塊都是字串，這裡轉成可用的數字並給保底值） ─────

const toInt = (s: string, fallback: number, min: number, max: number) => {
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

export const parseScheduleConfig = (raw: {
  slots: string[];
  perSlotLimit: string;
  fewThreshold: string;
  daysAhead: string;
}): ScheduleConfig => ({
  // 只留格式正確的時間，去重並依時間排序
  slots: [...new Set(raw.slots.map((s) => s.trim()).filter((s) => SLOT_RE.test(s)))].sort(),
  perSlotLimit: toInt(raw.perSlotLimit, 1, 1, 20),
  fewThreshold: toInt(raw.fewThreshold, 1, 0, 50),
  daysAhead: toInt(raw.daysAhead, 90, 7, 366),
});

/** 場地名稱前面的表情符號去掉，存進資料庫的是純名稱 */
export const roomName = (title: string) =>
  title.replace(/^[^\p{L}\p{N}]+/u, "").trim();

/** 某個場次最多能同時接幾場：主持人數與場地數取小的 */
export const slotCapacity = (config: ScheduleConfig, roomCount: number) =>
  Math.min(config.perSlotLimit, Math.max(roomCount, 1));

// ─── 前台：每天的狀態 ────────────────────────────────────────

/**
 * 依預約與公休日，算出每天還能接幾場，轉成前台顯示的狀態。
 * 只回傳不是「有空」的日期，讓傳到瀏覽器的資料最小。
 */
export const computeDayStatuses = ({
  bookings,
  closedDays,
  config,
  roomCount,
}: {
  bookings: Pick<Booking, "date" | "slot">[];
  closedDays: string[];
  config: ScheduleConfig;
  roomCount: number;
}): Record<string, DayStatus> => {
  const result: Record<string, DayStatus> = {};
  if (config.slots.length === 0) return result;

  const capacity = slotCapacity(config, roomCount);
  const perDayTotal = capacity * config.slots.length;
  const validSlots = new Set(config.slots);

  // 每天每個場次被訂了幾場（超過上限的不多扣）
  const used = new Map<string, Map<string, number>>();
  for (const b of bookings) {
    if (!validSlots.has(b.slot)) continue;
    const day = used.get(b.date) ?? new Map<string, number>();
    day.set(b.slot, (day.get(b.slot) ?? 0) + 1);
    used.set(b.date, day);
  }

  for (const [date, slots] of used) {
    let taken = 0;
    for (const n of slots.values()) taken += Math.min(n, capacity);
    const left = perDayTotal - taken;
    if (left <= 0) result[date] = "full";
    else if (left <= config.fewThreshold) result[date] = "few";
  }
  for (const date of closedDays) result[date] = "closed";
  return result;
};

// ─── 後台：表單驗證 ──────────────────────────────────────────

export interface BookingInput {
  date: string;
  slot: string;
  room: string;
  status: BookingStatus;
  customer: string;
  phone: string;
  note: string;
}

export const validateBookingInput = (
  raw: unknown,
): { ok: true; value: BookingInput } | { ok: false; error: string } => {
  if (!raw || typeof raw !== "object") return { ok: false, error: "資料格式錯誤" };
  const r = raw as Record<string, unknown>;
  const str = (v: unknown, max: number) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";

  if (!isDateKey(r.date)) return { ok: false, error: "日期格式錯誤" };
  const slot = str(r.slot, 5);
  if (!SLOT_RE.test(slot)) return { ok: false, error: "請選擇場次" };
  const room = str(r.room, 40);
  if (!room) return { ok: false, error: "請選擇場地" };
  const status = r.status === "confirmed" ? "confirmed" : "hold";

  return {
    ok: true,
    value: {
      date: r.date,
      slot,
      room,
      status,
      customer: str(r.customer, 60),
      phone: str(r.phone, 30),
      note: str(r.note, 500),
    },
  };
};
