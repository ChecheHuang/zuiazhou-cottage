import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
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
