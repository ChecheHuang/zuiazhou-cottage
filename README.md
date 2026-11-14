# Happy 抓周小屋 官網

抓周小屋的店家官網，包含寶寶派對、攝影、餐點、商品專區、常見問題、聯絡等頁面，以及可以修改全站文字、圖片和商品的管理後台（`/admin`）。

## 技術

- Next.js 16（App Router）＋ React 19 ＋ Tailwind CSS v4
- 資料庫：Neon Postgres ＋ Drizzle ORM
- 圖片儲存：Vercel Blob
- 部署：Vercel

## 本機開發

需要 Node.js、pnpm，以及已登入的 Vercel CLI。

```bash
pnpm install
vercel env pull .env.local   # 取得環境變數
pnpm dev                     # http://localhost:3000
```

> ⚠ 本機和 Preview 要連 **Neon development 分支** 與開發用的 Blob。pull 完環境變數後，請確認 `.env.local` 裡沒有指向正式資料庫或正式 Blob 的變數。

沒有設定 `DATABASE_URL` 也能跑，網站會直接顯示程式碼裡的預設文字和圖片，只是後台無法存檔。

### 環境變數

| 變數 | 用途 |
| --- | --- |
| `DATABASE_URL` / `DATABASE_URL_UNPOOLED` | Neon 連線字串（後者給 drizzle-kit 用） |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob，後台上傳圖片用 |
| `ADMIN_PASSWORD` | 後台登入密碼 |
| `ADMIN_SESSION_SECRET` | 後台登入 cookie 的簽章金鑰，至少 32 字元 |
| `NEXT_PUBLIC_SITE_URL` | （選用）正式網址，用於 SEO；沒設時用 Vercel 的正式網域 |

## 指令

| 指令 | 說明 |
| --- | --- |
| `pnpm dev` | 開發伺服器 |
| `pnpm build` / `pnpm start` | 正式 build／啟動 |
| `pnpm lint` | ESLint |
| `pnpm exec tsc --noEmit` | 型別檢查 |
| `pnpm db:push` | 把 `lib/db/schema.ts` 的資料表結構套用到開發資料庫 |
| `pnpm db:push:prod` | 套用到**正式**資料庫（會列出 SQL 並要求輸入 `yes` 確認） |
| `pnpm db:reset-dev` | 把開發資料庫重置成正式資料庫目前的內容（第一次要先 `npx neonctl auth`） |

## 管理後台

- 網址：`/admin`，用 `ADMIN_PASSWORD` 登入。
- **文字**：各頁文字區塊定義在 `lib/site-content/blocks/`，後台表單依定義自動產生。
- **圖片**：固定的圖片位置定義在 `lib/site-images/slots.ts`。
- **商品**：商品專區的新增、編輯、上下架與排序。

後台沒改過的內容會使用程式碼中的預設值；改回預設值時，資料庫中那筆資料會被刪除。

## 部署

推到 GitHub 後由 Vercel 自動部署（`master` → 正式環境，其他分支 → Preview）。

### 修改資料表結構時的順序

`git push` 就會部署，但資料庫結構不會跟著自動變更，所以順序很重要。原則是**不管在哪一步，正式網站上的程式碼都要能配合當下的資料庫結構**：

| 變更類型 | 順序 |
| --- | --- |
| **新增**資料表、欄位（欄位要可為 null 或有預設值） | 1. 開發資料庫 `pnpm db:push` 測試 → 2. `pnpm db:push:prod` → 3. push 程式碼部署 |
| **刪除**資料表、欄位 | 1. 先 push 不再使用它的程式碼並部署完成 → 2. `pnpm db:push:prod` 刪除 |
| **改名**、改型別 | 拆成「新增新欄位 → 程式碼改用新欄位並搬資料 → 刪除舊欄位」三次進行，不要一次改名 |

`db:push:prod` 會逐條列出 SQL，看到 `DROP` 或資料可能遺失的提示時，要確認是預期中的變更再同意。
