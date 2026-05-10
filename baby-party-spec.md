# Happy 抓週小屋 — 專案規格

> **參考來源**：`https://beberudostudio.com/`（首頁互動）+ `https://beberudostudio.com/baby-party/`（寶寶派對頁）
> **品牌**：Happy 抓週小屋（桃園市楊梅區幼獅路二段 218 巷 360 弄 43 號 / 0981 987 355 / IG @happyonehouse）
> **技術棧**：Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + framer-motion + Swiper + yet-another-react-lightbox
> **用途**：給 AI（Claude Code / Cursor）讀取後接續開發、調整或復刻

---

## 1. 技術棧與依賴

| 套件 | 版本 | 用途 |
|---|---|---|
| `next` | 16.2.6 | App Router、Image、Font 最佳化 |
| `react` / `react-dom` | 19.2.4 | UI |
| `typescript` | ^5 | 型別 |
| `tailwindcss` + `@tailwindcss/postcss` | ^4 | CSS（v4 走 `@theme` token） |
| `swiper` | ^12 | 派對方案輪播 + Hero 背景輪播替代方案 |
| `framer-motion` | ^12 | 進場、scroll-reveal、hover、stagger |
| `yet-another-react-lightbox` | ^3 | 攝影作品燈箱 |
| `clsx` + `tailwind-merge` | — | className 合併（`lib/cn.ts`） |
| `code-inspector-plugin` | ^1.5（dev only） | 瀏覽器點擊元素跳到 IDE 原始碼 |

**注意**：因為 `code-inspector-plugin` 走 webpack，`package.json` 的 `dev` script 改為 `next dev --webpack`（其他指令保留 Turbopack）。

```bash
pnpm install
pnpm dev    # http://localhost:3000（webpack 模式）
```

---

## 2. 設計 Token（Tailwind v4 `@theme`，定義在 `app/globals.css`）

| Token | 值 | 用途 |
|---|---|---|
| `--color-brand` | `#EDA09D` | 主色：所有標題、CTA |
| `--color-brand-soft` | `#F5C9C7` | 淺粉，分隔線、ring |
| `--color-brand-accent` | `#D7BBA5` | 米色，副標、scroll-to-top |
| `--color-brand-ink` | `#555555` | 內文 |
| `--color-brand-cream` | `#F5EAE2` | watermark 英文標題 |
| `--color-brand-beige` | `#FFEEE1` | About / 視差區塊底色 |
| `--font-sans` | `var(--font-noto-tc), Noto Sans TC, ...` | 主字（中文 + 內文） |
| `--font-display` | `var(--font-cormorant), Cormorant Garamond, serif` | 英文 watermark / 副標 |
| `--container-content` | `1200px` | 主容器寬 (`max-w-content`) |

字體在 `app/layout.tsx` 透過 `next/font/google` 載入 `Noto_Sans_TC` 與 `Cormorant_Garamond`，並掛上對應 CSS 變數。

---

## 3. 路由結構

```
app/
├── layout.tsx              # 全站 RootLayout（字體 + FloatingActions）
├── globals.css             # Tailwind v4 + @theme token
├── page.tsx                # / 首頁
├── about/page.tsx          # /about       (TODO 占位)
├── baby-party/page.tsx     # /baby-party  (完整實作)
├── photo/page.tsx          # /photo       (TODO 占位)
├── food/page.tsx           # /food        (TODO 占位)
├── faq/page.tsx            # /faq         (TODO 占位)
└── contact/page.tsx        # /contact     (TODO 占位)
```

`/baby-party` 之外的子頁全部使用共用 `<TodoPage>` 元件呈現 Coming Soon 與規劃中項目。

---

## 4. 全站元件（`components/`）

### 4.1 跨頁通用

| 檔案 | 角色 |
|---|---|
| `SiteHeader.tsx` | 黏性導航：滾動縮小、桌機 hover 下拉選單、行動 accordion、純路由點亮（`usePathname`） |
| `SiteFooter.tsx` | 品牌 logo + 服務說明 + 電話地址 + 社群圖示（hover shrink） + 版權 |
| `SectionHeading.tsx` | watermark 英文 + 中文標題雙層、可選描述、可切 `light` 白字 |
| `TodoPage.tsx` | TODO 子頁的 placeholder，含 watermark + Coming Soon 卡片 + comingSoon list |
| `FloatingActions.tsx` | 右下浮動：LINE 綠色按鈕（永遠顯示）、scroll-to-top（捲動 320px 後浮現，AnimatePresence） |

### 4.2 首頁專用 (`components/home/`)

| 元件 | 互動 |
|---|---|
| `HeroSlideshow` | 7 張背景輪播（4.5s 一輪）+ Ken Burns scale 1→1.12、AnimatePresence 漸隱、雙 CTA、底部 dot indicator 可手動切換 |
| `AboutSection` | 米色底；左圖片 4:5 + 中央 play 鍵 overlay；右白卡 `-ml-12 -mt-8` 偏移壓在圖上、含 watermark + 波浪線分隔；外加左上星星、右下太陽兩個浮動裝飾 |
| `ServiceSection` | 3 張卡片 stagger 0.18s 進場、hover 上浮 + 圖片 scale 1.1 + 漸層遮罩 |
| `ParallaxBreak` | 420 / md:520px 高、`bg-fixed bg-cover` 視差固定背景、白漸層遮罩、中央 watermark `Environment` + 中文副標 + 波浪線 |
| `ReviewSection` | 3 張評論卡片（avatar + 5 星 + 引言）+ 8 張小圖 grid，stagger 進場、hover 縮放 |
| `HomeGallery` | 8 張預覽 grid（2/3/4 欄）、點擊開 Lightbox、CTA 連到 `/baby-party#gallery` |
| `BookingSteps` | 4 步驟卡片，stagger 0.12s，每張頂部圓形 emoji 徽章；底部 LINE CTA + 電話 |
| `InformationSection` | Google Maps iframe（楊梅實際座標）+ 右側資訊卡（地址/時間/電話/IG/Access）+ 雙 CTA |
| `BlogSection` | 3 張部落格卡片，hover 上浮 + 圖片放大 + 箭頭間距變化 |

### 4.3 寶寶派對頁專用（`components/`）

| 元件 | 內容 |
|---|---|
| `HeroIntro` | 標題「寶寶派對」+ 3 行說明 |
| `PartyPlansSection` + `PartyPlan` | 3 個方案 × Swiper 輪播（autoplay 3.8–4s、pause on hover、pagination dots，左右交錯版型）|
| `NoticeList` | 雙欄注意事項 + 客製說明 + 取消規範 |
| `HostIntro` | 圓形大頭照 + 主理人介紹 |
| `RitualTimeline` | 9 步驟左右交錯時間軸、stagger 0.04s |
| `ZhuazhouGrid` | 抓週物品 grid（職業 21 項 + 傳統 10 項）、hover 縮放 + 寓意 tooltip |
| `PhotoGallery` | 24 張照片 + Lightbox |
| `BackgroundSlideshow` | 8 張背景循環 + Ken Burns + 文字疊加 |
| `BirthdayPlan` | 兒童生日派對方案，左圖右文 |

---

## 5. 資料層（`data/`）

| 檔案 | 內容 |
|---|---|
| `photos.ts` | 統一管理本地照片（`public/photos/p01–p57.jpg`），對應到各區塊的 `range()` 切片：派對方案、Hero、About、Service、Review、Gallery、Background slideshow、Step、生日、視差 |
| `home.ts` | 首頁文案：services、bookingSteps、blogPosts、reviews、`businessInfo`（品牌、地址、電話、營業時間、IG、access、socials） |
| `party-plans.ts` | 寶寶派對 3 方案內容 + 共用 footer 文字 |
| `notices.ts` | 注意事項條列、客製說明、取消規範 |
| `ritual-steps.ts` | 9 個抓周流程步驟（標題、寓意說明） |
| `zhuazhou-items.ts` | 職業 21 + 傳統 10 個物品名稱 + 寓意對應 |

**抽換邏輯**：所有圖片路徑都從 `data/photos.ts` 集中匯出，需要替換素材時只改這一個檔案。職業/傳統物品還沒有實拍照片，目前用 `picsum.photos/seed/...` 占位。

---

## 6. 互動行為總表

| 互動 | 元件 | 實作 |
|---|---|---|
| 黏性導航縮小 | SiteHeader | `useState(scrolled)` + `window.scrollY > 32` |
| Nav 點亮（純路由） | SiteHeader | `usePathname()` 比對 `item.href`，父項另用 `startsWith` |
| Nav 桌機 hover 下拉 | SiteHeader | `onMouseEnter/Leave` + AnimatePresence-style transition class |
| Nav 行動 accordion | SiteHeader | `lg` 以下顯示漢堡，子項目縮排展開 |
| Hero 背景輪播 + Ken Burns | HeroSlideshow | `setInterval` 切換 + framer-motion `scale: 1 → 1.12` |
| About 影片+卡片重疊 | AboutSection | grid 12 欄、卡片 `md:-ml-12 md:-mt-8 md:self-center` 偏移 |
| Service 卡片 stagger | ServiceSection | `motion.ul variants.staggerChildren: 0.18` |
| 視差背景固定 | ParallaxBreak | `bg-fixed bg-cover bg-center` |
| Reviews stagger | ReviewSection | 評論 0.15s + 照片 0.05s |
| 燈箱 | HomeGallery / PhotoGallery | yet-another-react-lightbox |
| 派對方案輪播 | PartyPlan | Swiper autoplay `pauseOnMouseEnter: true` |
| 時間軸 fadeInUp | RitualTimeline / BookingSteps | framer-motion `whileInView` + delay |
| 全站進場動畫 | 多處 | `whileInView` + `viewport: { once: true, margin: '-80px' }` |
| LINE 浮動按鈕 | FloatingActions | 永遠顯示、hover scale 1.1 |
| Scroll-to-top | FloatingActions | `scrollY > 320` 才浮現、AnimatePresence |
| Hover 縮放 | ServiceSection / Grid / Gallery | `group-hover:scale-105/110 transition-transform` |

---

## 7. 裝飾資產（`public/decorations/`）

| 檔案 | 用途 | 來源 |
|---|---|---|
| `line-divider.png` | 青綠波浪線分隔（heading 下方） | beberudostudio.com |
| `ic004.png` | 黃色星星閃光（About 左上） | beberudostudio.com |
| `ic006.png` | 笑臉太陽（About 右下） | beberudostudio.com |

---

## 8. 照片資源

- 本地照片：`public/photos/p01.jpg` ~ `p57.jpg`（57 張實拍）
- Logo：`public/photos/logo.png`（圓形「Happy 抓週小屋」）
- Favicon：`app/favicon.ico`（複製自 `public/photos/favicon.ico`）
- 抓週物品（31 項）：仍使用 `picsum.photos` 占位，待後續補實拍

照片分配（在 `data/photos.ts`）：

| 用途 | 來源 | 數量 |
|---|---|---|
| 派對方案 A/B/C 輪播 | p01–p05 / p06–p11 / p20–p24 | 5+6+5 |
| Host 大頭照 | p40 | 1 |
| 攝影作品 Gallery | p25–p39 + p41–p49 | 24 |
| Background slideshow（寶寶派對頁） | p50–p57 | 8 |
| 生日方案 | p12 | 1 |
| Step 流程 | p13–p19 | 7 |
| Hero 首頁輪播 | p01,10,20,30,40,50,57 | 7 |
| About 大圖 | p11 | 1 |
| Service 三卡 | p02 / p15 / p20 | 3 |
| Review 小圖 | p35–p42 | 8 |
| ParallaxBreak | p20 | 1 |

---

## 9. 響應式斷點

| 斷點 | 寬度 | 重點 |
|---|---|---|
| 預設 | < 640px | 漢堡選單、單欄 grid、nav 收進 accordion |
| `md` | ≥ 768px | 服務 3 欄、評論 3 欄、Timeline 左右交錯 |
| `lg` | ≥ 1024px | 桌機 nav 顯示 7 項 + 下拉、Gallery 4 欄、Zhuazhou Grid 7 欄 |

---

## 10. 開發者工具

- **code-inspector-plugin**：dev 啟用，按住 `Alt + Shift`（Mac `Option + Shift`）+ 點擊任意元素 → 跳到 IDE 對應原始碼
- **Chrome DevTools MCP**：實作後可走 MCP 直接驅動 Chrome 測試（截圖、滾動、操作 DOM、檢查 console）

---

## 11. 待補事項

- [ ] 抓週物品（職業 21 + 傳統 10）實拍照片，替換 picsum 占位
- [ ] About section 真正的影片檔（目前用照片 + 播放鍵 overlay 占位）
- [ ] 5 個 TODO 子頁實際內容：`/about`、`/photo`、`/food`、`/faq`、`/contact`
- [ ] 部落格文章詳細頁（`/blog/[slug]`）
- [ ] Booking 表單功能（送出後接 LINE / Email 通知）
- [ ] SEO：sitemap.xml、robots.txt、Open Graph 圖片
- [ ] Lighthouse 跑分 + 圖片壓縮優化（部分 p*.jpg 超過 2MB）

---

## 12. 與原參考站的差異

| 項目 | beberudostudio.com | 本專案 |
|---|---|---|
| CMS | WordPress + Elementor + UAEL | 純 Next.js（資料寫死在 `data/`） |
| 動畫 | Elementor data-settings + jQuery | framer-motion |
| 輪播 | Swiper（jQuery） | Swiper React 模組 |
| 燈箱 | Elementor 內建 | yet-another-react-lightbox |
| 字體 | Noto Sans TC + ADLaM Display | Noto Sans TC + Cormorant Garamond |
| 主色 | `#EDA09D` | 同 |
| 品牌 | 貝貝魯多（台中北屯） | Happy 抓週小屋（桃園楊梅） |
