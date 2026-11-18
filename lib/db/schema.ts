import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// 商品專區的商品（實體商品或服務）。published = false 時前台看不到。
// 之後若加購物車／金流，訂單表可以直接參照這張表的 id。
export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    kind: text("kind", { enum: ["goods", "service"] })
      .notNull()
      .default("goods"),
    /** 新台幣整數；null 代表「價格請洽詢」 */
    price: integer("price"),
    /** 價格後的補充，例如「起」「/組」 */
    priceNote: text("price_note").notNull().default(""),
    summary: text("summary").notNull().default(""),
    description: text("description").notNull().default(""),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    published: boolean("published").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("products_listing_idx").on(t.published, t.sortOrder)],
);

// 每個文字區塊 (block) 的內容，整個區塊存成一筆 JSON。
// 沒有資料時使用程式碼裡的預設文字（見 lib/site-content/blocks）。
export const siteContent = pgTable("site_content", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// 每個「圖片位置」(slot) 的圖片清單。某個 slot 在這張表裡沒有資料時，
// 網站會使用程式碼裡的預設圖片（見 lib/site-images/slots.ts）。
export const siteImages = pgTable(
  "site_images",
  {
    id: serial("id").primaryKey(),
    slot: text("slot").notNull(),
    url: text("url").notNull(),
    sortOrder: integer("sort_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("site_images_slot_idx").on(t.slot, t.sortOrder)],
);

// 線上模擬抓周：每個物品累計被抓到幾次（「有 N% 的寶寶跟你一樣抓到…」）。
// 只存物品名稱與次數，不存寶寶小名或任何個人資料。
export const playGrabStats = pgTable("play_grab_stats", {
  item: text("item").primaryKey(),
  count: integer("count").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// 排程日曆：每一筆是某天、某個場次、某間主題場地的一場預約（後台「排程日曆」管理）。
// 前台只會看到每天「有空／快滿／已滿」，客人姓名電話不會出現在前台。
export const scheduleBookings = pgTable(
  "schedule_bookings",
  {
    id: serial("id").primaryKey(),
    /** 台灣當地日期，格式 YYYY-MM-DD */
    date: text("date").notNull(),
    /** 場次開始時間，例如 10:00（對應後台「檔期設定」的場次） */
    slot: text("slot").notNull(),
    /** 主題場地名稱（對應寶寶派對頁的場地方案） */
    room: text("room").notNull(),
    /** hold = 保留中（待付訂金）、confirmed = 已確認 */
    status: text("status", { enum: ["hold", "confirmed"] })
      .notNull()
      .default("hold"),
    customer: text("customer").notNull().default(""),
    phone: text("phone").notNull().default(""),
    note: text("note").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    // 同一天同一場次，同一間場地只能有一筆
    uniqueIndex("schedule_bookings_unique_idx").on(t.date, t.slot, t.room),
  ],
);

// 公休日：整天不接場，前台顯示「公休」
export const scheduleClosedDays = pgTable("schedule_closed_days", {
  /** 台灣當地日期，格式 YYYY-MM-DD */
  date: text("date").primaryKey(),
  note: text("note").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
