import {
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

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
