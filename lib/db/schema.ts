import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

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
