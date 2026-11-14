import { defineConfig } from "drizzle-kit";

// 本機從 .env.local 讀連線字串（用 `vercel env pull .env.local` 產生）
try {
  process.loadEnvFile(".env.local");
} catch {
  // 沒有 .env.local 時改用既有的環境變數
}

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url)
  throw new Error("找不到 DATABASE_URL，請先執行 vercel env pull .env.local");

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
});
