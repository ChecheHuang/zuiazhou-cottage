# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 專案概要

「Happy 抓周小屋」店家官網（繁體中文），Next.js 16 App Router + React 19 + Tailwind CSS v4，部署在 Vercel。資料庫是 Neon Postgres（Drizzle ORM），後台上傳的圖片放 Vercel Blob。程式碼註解與 UI 文字一律用繁體中文。

## 常用指令（套件管理用 pnpm）

```bash
pnpm dev                 # 開發伺服器（用 --webpack，因為 dev 時掛了 code-inspector-plugin）
pnpm build               # 正式 build
pnpm lint                # ESLint（eslint-config-next core-web-vitals + typescript）
pnpm exec tsc --noEmit   # 型別檢查（沒有另外的 script）
pnpm db:push             # 把 lib/db/schema.ts 套用到「開發」資料庫（讀 .env.local）
pnpm db:push:prod        # 套用到「正式」資料庫：暫時 pull production env、要輸入 yes、用完即刪
pnpm db:reset-dev        # 把 Neon development 分支重置成正式資料（需先 npx neonctl auth）
```

專案沒有測試框架。沒有 migration 檔，結構變更一律用 `drizzle-kit push`。

推到 GitHub 後 Vercel 會自動部署，但資料庫結構不會自動變更。改 schema 時要遵守 README「修改資料表結構時的順序」：新增欄位／表要先 `db:push:prod` 再部署；刪除要先部署不再使用的程式碼再 `db:push:prod`；改名或改型別要拆成「新增 → 搬遷 → 刪除」。`db:push:prod` 是互動式且會動到正式資料庫，要由使用者自己執行，不要代跑。

## 環境與資料分離

- `.env.local` 由 `vercel env pull .env.local` 產生，本機與 Preview 應連 **Neon development 分支** 與開發用 Blob；pull 後若有指向正式資料庫／正式 Blob 的變數要清掉。
- 必要變數：`DATABASE_URL`（`DATABASE_URL_UNPOOLED` 給 drizzle-kit）、`BLOB_READ_WRITE_TOKEN`、`ADMIN_PASSWORD`、`ADMIN_SESSION_SECRET`（≥32 字元）。`NEXT_PUBLIC_SITE_URL` 可選，用於 SEO 網址（見 `lib/seo.ts`）。
- `DATABASE_URL` 沒設時 `db` 為 `null`，前台會退回程式碼中的預設內容，網站不會掛；後台寫入用 `requireDb()` 會直接報錯。

## 架構重點

### 「程式碼預設值 + 資料庫覆寫」模式

全站文字與圖片都可以在後台修改，但資料庫只存「被改過的部分」，沒有資料就用程式碼裡的預設值：

- **文字區塊**（`lib/site-content/`）：
  - `blocks/*.ts` 每個頁面一個檔案，用 `defineBlock({ key, page, label, fields, defaults })` 宣告區塊；`registry.ts` 收集所有 export 的區塊，後台依定義順序（`.seo` 區塊排最後）自動產生表單。
  - 新增頁面的 blocks 檔案時要加進 `registry.ts` 的 `modules` 陣列。
  - 欄位型別 `text / image / images / list`（定義在 `schema.ts`）；`server.ts` 在載入時會驗證每個區塊的 `defaults` 是否符合欄位定義、key 是否重複，寫錯會直接在 dev/build 報錯。
  - 讀取：Server Component 用 `await getContent(block)`；Client Component 用 `useContent(block)`（`components/SiteContentProvider.tsx`，root layout 把 overrides 注入 context）。
  - 存到 `site_content` 表（key → JSON）；存回與預設值相同的內容時會刪掉該筆。
- **圖片位置（slot）**（`lib/site-images/`）：`slots.ts` 定義固定圖片位置與預設圖（來自 `data/photos.ts`），存在 `site_images` 表；Client 端用 `useSlotImage(s)`。屬於清單項目的圖片（服務卡片、團隊、餐點方案…）不是 slot，而是放在文字區塊的 `image/images` 欄位裡。
- **商品**（`lib/products/`）：`products` 表，`published=false` 前台不顯示。`server.ts` 為 server-only 讀取，`shared.ts` 放前後台共用的型別與工具。

### 快取與更新

前台讀取都包在 `unstable_cache` 並掛 tag（`SITE_CONTENT_TAG`、`SITE_IMAGES_TAG`、`PRODUCTS_TAG`），讀 DB 失敗時 catch 並退回預設值。後台 Server Action 寫入後呼叫 `revalidateTag(tag, { expire: 0 })` + `revalidatePath("/", "layout")`。後台頁面則讀不經快取的版本（如 `getSiteImageOverridesFresh`、`listAllProducts`、`getProductForAdmin`）。

### 後台（`/admin`）

- 單一管理密碼登入，HMAC 簽章 cookie（`lib/admin-auth.ts`）。
- `proxy.ts`（Next 16 取代 middleware 的檔名）擋未登入的 `/admin/*`，但這只是第一道；**每個 Server Action 與 Route Handler 都必須再呼叫 `requireAdmin()` / `isAdmin()`**。
- 圖片上傳：瀏覽器直傳 Vercel Blob，`app/api/admin/upload/route.ts` 只簽發 token（路徑必須以 `site-images/` 開頭，繞過 4.5MB function 限制），上傳完再由前端呼叫 Server Action 寫 DB。
- 內容／圖片被替換或刪除時，用 `lib/admin/blob-cleanup.ts` 的 `cleanupBlobs` 清掉不再被引用的 Blob。
- `app/admin/(panel)/` 是登入後的 route group，`/admin/login` 在其外。

### 前台與 SEO

- 各頁 `generateMetadata` 從對應的 `*.seo` 文字區塊取資料，透過 `lib/seo.ts` 的 `buildPageMetadata` 產生 title/canonical/OG；root layout 不設 canonical。另有 `app/sitemap.ts`、`app/robots.ts`、`components/seo/` 的 JSON-LD。
- 主題色用 Tailwind v4 `@theme` 的 `--color-brand*` token（`app/globals.css`），`data-theme="teal"` 切換成第二套配色（`ThemeToggle` + layout 中的 boot script 讀 localStorage）。新增顏色請用這些 token，不要寫死色碼。
- 外部圖片網域需加進 `next.config.ts` 的 `images.remotePatterns`。
